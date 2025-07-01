from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from db import get_db_data_by_ref_and_date
from db import get_car_balance_by_customer_id
from db import get_summary_by_customer_id_and_date
from db import search_member_invoices, search_nonmember_invoices
from db import get_all_provinces
from db import search_member_receipt
from db import search_nonmember_receipt
from db import get_tran_member
from db import get_tran_nonmember
from db import get_tran_illegal
from typing import Optional, List, Dict
import io, os, zipfile, requests

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
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    try:
        member_type_upper = member_type.strip().upper()
        
        if member_type_upper == "MEMBER":
            result = search_member_invoices(
                plate1, plate2, province,
                invoice_no, status, start_date, end_date
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