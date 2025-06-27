import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';

export default function InvoiceSearchNonmemberPage() {
  const navigate = useNavigate();
  // const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [plate1, setPlate1] = useState("");
  const [plate2, setPlate2] = useState("");
  // const [province, setProvince] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    if (invoiceNo) params.append("invoice_no", invoiceNo);
    if (status) params.append("status", status);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    navigate(`/invoice-result?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">ค้นหาใบแจ้งหนี้ (ไม่ใช่สมาชิก)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={plate1}
            onChange={(e) => setPlate1(e.target.value)}
            placeholder="PLATE 1"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={plate2}
            onChange={(e) => setPlate2(e.target.value)}
            placeholder="PLATE 2"
            className="p-2 border rounded"
          />

          <select
            value={province} // ผูกกับ state 'province'
            onChange={(e) => setProvince(e.target.value)} // อัปเดต state เมื่อเลือก
            className="p-2 border rounded"
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

          {/* <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="จังหวัด (รหัส เช่น TH-10)"
            className="p-2 border rounded"
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-4">
          <input
            type="text"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            placeholder="เลข Invoice"
            className="p-2 border rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">-- เลือกสถานะ --</option>
            <option value="PAYMENT_WAITING">PAYMENT_WAITING</option>
            <option value="PAYMENT_INPROGRESS">PAYMENT_INPROGRESS</option>
            <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</option>
            <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
          </select>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🔍 ค้นหา
          </button>
        </div>
      </div>
    </div>
    
  );
}
