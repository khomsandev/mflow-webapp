import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';

export default function TranSearchNonmemberPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [plate1, setPlate1] = useState("");
  const [plate2, setPlate2] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [status, setStatus] = useState("");
  const [plaza, setPlaza] = useState("");

  // *** เพิ่ม States สำหรับ Dropdown จังหวัด ***
  const [province, setProvince] = useState(""); // เก็บโค้ดจังหวัดที่ถูกเลือก (เช่น "TH-10")
  const [provinceOptions, setProvinceOptions] = useState([]); // เก็บรายการจังหวัดจาก API
  const [loadingProvinces, setLoadingProvinces] = useState(true); // สถานะการโหลดของ Dropdown

  // *** Function สำหรับดึงข้อมูลจังหวัดจาก Backend ***
  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true); // ตั้งค่าสถานะว่ากำลังโหลด
      // URL ของ Endpoint ใน FastAPI ที่เราสร้างไว้ใน main.py
      const res = await fetch(`${API_BASE_URL}/get-provinces`);
      if (!res.ok) {
        throw new Error(`Failed to fetch provinces: ${res.status}`);
      }
      const data = await res.json();
      // สมมติว่า Backend ส่งข้อมูลมาในรูปแบบ { "provinces": [{ code: "TH-10", name: "กรุงเทพมหานคร" }, ...] }
      setProvinceOptions(data.provinces || []); 
    } catch (err) {
      console.error("Error fetching provinces:", err);
      // แสดงข้อความแจ้งเตือนผู้ใช้หากดึงข้อมูลไม่ได้
      alert("ไม่สามารถโหลดรายการจังหวัดได้ กรุณาลองใหม่ภายหลัง");
    } finally {
      setLoadingProvinces(false); // ตั้งค่าสถานะว่าโหลดเสร็จแล้ว
    }
  };

  // *** ใช้ useEffect เพื่อเรียก fetchProvinces เมื่อ Component โหลดครั้งแรก ***
  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append("member_type", "NONMEMBER");

    if (plate1) params.append("plate1", plate1);
    if (plate2) params.append("plate2", plate2);
    if (province) params.append("province", province);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (status) params.append("status", status);
    if (plaza) params.append("plaza", plaza);

    navigate(`/tran-result?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <div className="mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">ตรวจสอบการผ่านทางที่ไม่ใช่สมาชิก</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-semibold mb-1">
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-semibold mb-1">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="plate1-input" className="block text-gray-700 text-sm font-semibold mb-1">
              หมวดหมู่
            </label>
            <input
              type="text"
              value={plate1}
              onChange={(e) => setPlate1(e.target.value)}
              placeholder="ตัวอย่าง : กข"
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="plate2-input" className="block text-gray-700 text-sm font-semibold mb-1">
              เลขทะเบียน
            </label>
            <input
              type="text"
              value={plate2}
              onChange={(e) => setPlate2(e.target.value)}
              placeholder="ตัวอย่าง : 1234"
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="province-select" className="block text-gray-700 text-sm font-semibold mb-1">
              จังหวัด
            </label>
            <select
              value={province} // ผูกกับ state 'province'
              onChange={(e) => setProvince(e.target.value)} // อัปเดต state เมื่อเลือก
              className="p-2 border rounded w-full"
              disabled={loadingProvinces} // ปิด dropdown ขณะโหลดข้อมูล
            >
              {loadingProvinces ? (
                // แสดงสถานะโหลด
                <option value="">กำลังโหลดจังหวัด...</option>
              ) : (
                // แสดงตัวเลือกจังหวัด
                <>
                  <option value="">-- เลือกจังหวัด --</option> {/* ตัวเลือกเริ่มต้น/placeholder */}
                  {provinceOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">-- เลือกสถานะ --</option>
              <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</option>
              <option value="PAYMENT_WAITING">PAYMENT_WAITING</option>
              <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
              <option value="PAYMENT_INPROGRESS">PAYMENT_INPROGRESS</option>
              <option value="BATCH_PROCESSING">BATCH_PROCESSING</option>
            </select>
          </div>
          
          <div>
            <select
              value={plaza}
              onChange={(e) => setPlaza(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">-- เลือกด่าน --</option>
              <option value="M9MS0002">ด่านทับช้าง 1</option>
              <option value="M9MS0001">ด่านทับช้าง 2</option>
              <option value="M9MS0004">ด่านธัญบุรี 1</option>
              <option value="M9MS0003">ด่านธัญบุรี 2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-5 gap-4">
          <div className="w-full md:w-1/4">
            <button
              onClick={handleSearch}
              className="p-2 border rounded w-full bg-blue-600 hover:bg-blue-300 text-white"
            >
              🔍 ค้นหา
            </button>
          </div>

          <div className="w-full md:w-1/4">
            <button
              type="button"
              onClick={() => {
                setStartDate(today);
                setEndDate(today);
                setPlate1("");
                setPlate2("");
                setProvince("");
                setStatus("");
                setPlaza("");
              }}
              className="p-2 border rounded w-full bg-red-500 text-white hover:bg-gray-400 transition"
            >
              ล้างข้อมูล
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
