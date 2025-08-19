import io, os, zipfile, requests, uuid, xlsxwriter, time
from fastapi import FastAPI, Query, Body, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import psycopg2
import bcrypt
import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from typing import Optional, List, Dict
from routers import reconcile
from db import get_db_data_by_ref_and_date
from db import get_car_balance_by_customer_id
from db import get_summary_by_customer_id_and_date
from db import search_member_invoices, search_nonmember_invoices
from db import search_member_receipt
from db import search_nonmember_receipt
from db import get_tran_member
from db import get_tran_nonmember
from db import get_tran_illegal
from db import fetch_tran_details
from db import search_car
from db import search_images_register
from db import get_pg_connection

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
FILE_SERVICE_URL = os.getenv("FILE_SERVICE_URL")
API_KEY = os.getenv("API_KEY")
if not FILE_SERVICE_URL:
    raise ValueError("FILE_SERVICE_URL is not set in the .env file")
if not API_KEY:
    raise ValueError("API_KEY is not set in the .env file")

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def cleanup_temp_folder():
    now = time.time()
    temp_dir = "temp"
    if not os.path.exists(temp_dir):
        return
    for f in os.listdir(temp_dir):
        path = os.path.join(temp_dir, f)
        if os.path.isfile(path) and f.endswith(".xlsx"):
            if now - os.path.getmtime(path) > 300:  # ใส่เป็นวินาที
                os.remove(path)

app.include_router(reconcile.router)


## Authentication and User Management ##
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str

@app.post("/register")
def register_user(req: RegisterRequest):
    try:
        conn = get_pg_connection()
        cur = conn.cursor()

        # เช็คว่า username ซ้ำหรือไม่
        cur.execute("SELECT id FROM users WHERE username = %s", (req.username,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Username นี้มีอยู่แล้ว กรุณาเลือกชื่อผู้ใช้ใหม่")

        # เข้ารหัส password
        hashed_pw = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt())
        hashed_pw = hashed_pw.decode("utf-8")  # แปลงเป็น string ก่อน insert

        # Insert user
        cur.execute(
            "INSERT INTO users (username, password, name) VALUES (%s, %s, %s)",
            (req.username, hashed_pw, req.name)
        )
        conn.commit()

        return {"message": "User registered successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.post("/login")
def login(data: LoginRequest):
    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, username, password, name FROM users WHERE username = %s",
        (data.username,),
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_id, username, hashed_password, name = user

    if not bcrypt.checkpw(data.password.encode("utf-8"), hashed_password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token_data = {
        "sub": username,
        "name": name,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer", "name": name}

@app.get("/me")
def read_me(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["sub"], "name": payload["name"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
## End of Authentication and User Management ##

@app.get("/error-code")
def get_error_code(file: str = Query(...), code: str = Query(...)):
    table_map = {
        "errorAddCarAddTagEPMP": "errorAddCarAddTagEPMP",
        "errorPaymentViaCardFailed": "errorPaymentViaCardFailed"
    }

    if file not in table_map:
        return {"error": "Invalid file name"}

    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute(f"""
        SELECT error_code, error_description_TH, error_description_EN
        FROM {table_map[file]}
        WHERE LOWER(error_code) = LOWER(%s)
        LIMIT 1
    """, (code,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return {
            "error_code": row[0],
            "error_description_TH": row[1],
            "error_description_EN": row[2]
        }
    else:
        return None

@app.get("/provinces")
def get_provinces():
    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute("SELECT code, name, name_en, dlt_code FROM provinces ORDER BY code ASC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    provinces_list = [
        {"code": row[0], "name": row[1], "name_en": row[2], "dlt_code": row[3]}
        for row in rows
    ]
    return provinces_list

@app.post("/download-zip")
def download_ebill_zip(file_ids: List[str] = Body(...)):
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_id in file_ids:
            try:
                url = f"{FILE_SERVICE_URL}/{file_id}?key={API_KEY}"
                response = requests.get(url)
                if response.status_code == 200:
                    zf.writestr(f"{file_id}.pdf", response.content)
                else:
                    zf.writestr(f"{file_id}_ERROR.txt", f"Failed to download. Status: {response.status_code}")
            except Exception as e:
                zf.writestr(f"{file_id}_ERROR.txt", f"Exception occurred: {str(e)}")

    memory_file.seek(0)
    return StreamingResponse(memory_file, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=ebill_files.zip"
    })

class FileDownloadRequest(BaseModel):
    file_ids: List[str]
    file_types: List[str]

@app.post("/download-multiple-zip")
def download_multiple_zip(data: FileDownloadRequest):
    file_ids = data.file_ids
    file_types = data.file_types
    memory_file = io.BytesIO()

    with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
        for i, file_id in enumerate(file_ids):
            try:
                url = f"{FILE_SERVICE_URL}/{file_id}?key={API_KEY}"
                response = requests.get(url)

                if response.status_code == 200:
                    ext = file_types[i] if i < len(file_types) else "bin"
                    filename = f"{file_id}.{ext}"
                    zf.writestr(filename, response.content)
                else:
                    zf.writestr(f"{file_id}_ERROR.txt", f"Failed to download. Status: {response.status_code}")
            except Exception as e:
                zf.writestr(f"{file_id}_ERROR.txt", f"Exception occurred: {str(e)}")

    memory_file.seek(0)
    return StreamingResponse(
        memory_file,
        media_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=ebill_files.zip"
        }
    )

@app.get("/check")
def check_ref(ref_id: Optional[str] = None, last4: Optional[str] = None, date: Optional[str] = None):
    try:
        if ref_id and date:
            result = get_db_data_by_ref_and_date(ref_id.strip(), date)
            return {"data": result}
        elif last4 and date:
            result = get_db_data_by_ref_and_date(last4.strip(), date)
            return {"data": result}
        else:
            return {"error": "กรุณาใส่ ref_id หรือ last4 พร้อมวันที่"}
    except Exception as e:
        print("❌ API Error:", e)
        return {"error": str(e)}


@app.get("/car-balance")
def car_balance(customer_id: Optional[str] = Query(None)):
    if not customer_id:
        return {"error": "กรุณาระบุ customer_id"}
    try:
        result = get_car_balance_by_customer_id(customer_id.strip())
        return {"data": result}
    except Exception as e:
        print("❌ API Error:", e)
        return {"error": str(e)}


@app.get("/summary-tran")
def get_summary(customer_id: str, start_date: str, end_date: str):
    try:
        result = get_summary_by_customer_id_and_date(customer_id.strip(), start_date, end_date)
        return {"data": result}
    except Exception as e:
        print("❌ Summary API Error:", e)
        return {"error": str(e)}


@app.get("/search-invoice")
def invoice_search(
    member_type: str,
    plate1: Optional[str] = None,
    plate2: Optional[str] = None,
    province: Optional[str] = None,
    invoice_no: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    try:
        member_type_upper = member_type.strip().upper()
        
        if member_type_upper == "MEMBER":
            result = search_member_invoices(
                plate1, plate2, province,
                invoice_no, customer_id, status, start_date, end_date
            )
        elif member_type_upper == "NONMEMBER":
            result = search_nonmember_invoices(
                plate1, plate2, province,
                invoice_no, status, start_date, end_date
            )
        else:
            return {"error": "member_type ต้องเป็น MEMBER หรือ NONMEMBER"}

        return {"data": result}

    except Exception as e:
        print("❌ Invoice Search API Error:", e)
        return {"error": str(e)}


@app.get("/search-img-regis")
def img_regis_search(
    plate1: Optional[str] = None,
    plate2: Optional[str] = None,
    province: Optional[str] = None,
):
    try:

        if plate1 and  plate2 and  province :

            result_car = search_car(
                plate1, plate2, province
            )

            if result_car:
                result_img = search_images_register(
                    result_car[0]['id'],
                    result_car[0]['customer_id']
                )
                
            return {"data": result_car, "image": result_img}

    except Exception as e:
        print("❌ Register Search API Error:", e)
        return {"error": str(e)}


@app.get("/search-receipt")
def search_receipt(
    member_type: str,
    plate1: Optional[str] = None,
    plate2: Optional[str] = None,
    province: Optional[str] = None,
    invoice_no: Optional[str] = None,
    customer_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    try:
        member_type_upper = member_type.strip().upper()
        
        if member_type_upper == "MEMBER":
            result = search_member_receipt(
                plate1, plate2, province,
                invoice_no, customer_id, start_date, end_date
            )
        elif member_type_upper == "NONMEMBER":
            result = search_nonmember_receipt(
                plate1, plate2, province,
                invoice_no, start_date, end_date
            )
        else:
            return {"error": "member_type ต้องเป็น MEMBER หรือ NONMEMBER"}

        return {"data": result}

    except Exception as e:
        print("❌ Invoice Search API Error:", e)
        return {"error": str(e)}
    

@app.get("/search-tran")
def search_tran(
    member_type: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    plate1: Optional[str] = None,
    plate2: Optional[str] = None,
    province: Optional[str] = None,
    status: Optional[str] = None,
    plaza: Optional[str] = None,
):
    try:
        member_type_upper = member_type.strip().upper()

        if member_type_upper == "MEMBER":
            result = get_tran_member(start_date, end_date, plate1, plate2, province, status, plaza)
        elif member_type_upper == "NONMEMBER":
            result = get_tran_nonmember(start_date, end_date, plate1, plate2, province, status, plaza)
        elif member_type_upper == "ILLEGAL":
            result = get_tran_illegal(start_date, end_date, plate1, plate2, province, plaza)
        else:
            return {"error": "member_type ต้องเป็น MEMBER หรือ NONMEMBER หรือ ILLEGAL"}

        return {"data": result}

    except Exception as e:
        print("❌ Tran Search API Error:", e)
        return {"error": str(e)}

class TranDetailRequest(BaseModel):
    ids: List[str]
    type: str  # "TRANSACTION_ID" or "REF_TRANSACTION_ID" or "INVOICE_NO"

@app.post("/search-tran-detail")
def search_tran_detail(req: TranDetailRequest):
    try:
        if req.type not in ["TRANSACTION_ID", "REF_TRANSACTION_ID", "INVOICE_NO"]:
            raise HTTPException(status_code=400, detail="Invalid type.")
        
        print("🔍 Request Type:", req.type)
        print("🔍 Number of IDs:", len(req.ids))

        cleanup_temp_folder()  # 🧹 ล้างไฟล์เก่าก่อนเริ่ม

        data = fetch_tran_details(req.ids, req.type)
        
        # ตรวจสอบข้อมูลก่อนสร้าง Excel
        if not data:
            return {"data": [], "excel_path": None}

        # ✅ สร้างไฟล์ Excel
        filename = f"{uuid.uuid4()}.xlsx"
        filepath = f"temp/{filename}"
        os.makedirs("temp", exist_ok=True)

        workbook = xlsxwriter.Workbook(filepath)
        worksheet = workbook.add_worksheet()
        headers = list(data[0].keys())

        for col, h in enumerate(headers):
            worksheet.write(0, col, h)
        for row_idx, row in enumerate(data, start=1):
            for col, h in enumerate(headers):
                worksheet.write(row_idx, col, row.get(h, ""))
        workbook.close()

        return {"data": data, "excel_path": f"/download-excel/{filename}"}
    except Exception as e:
        print("❌ ERROR:", str(e))  # เพิ่ม logging
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-excel/{filename}")
def download_excel(filename: str):
    file_path = f"temp/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=filename)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/search-receipt")
def search_receipt(
    member_type: str,
    plate1: Optional[str] = None,
    plate2: Optional[str] = None,
    province: Optional[str] = None,
    invoice_no: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    try:
        member_type_upper = member_type.strip().upper()
        
        if member_type_upper == "MEMBER":
            result = search_member_receipt(
                plate1, plate2, province,
                invoice_no, start_date, end_date
            )
        elif member_type_upper == "NONMEMBER":
            result = search_nonmember_receipt(
                plate1, plate2, province,
                invoice_no, start_date, end_date
            )
        else:
            return {"error": "member_type ต้องเป็น MEMBER หรือ NONMEMBER"}

        return {"data": result}

    except Exception as e:
        print("❌ Invoice Search API Error:", e)
        return {"error": str(e)}