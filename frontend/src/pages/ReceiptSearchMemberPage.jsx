import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import provincesData from "../data/provinces.json";
import { API_BASE_URL } from '../config';

export default function ReceiptSearchMemberPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [plate1, setPlate1] = useState("");
  const [plate2, setPlate2] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // *** เพิ่ม States สำหรับ Dropdown จังหวัด ***
  const [province, setProvince] = useState(""); // เก็บโค้ดจังหวัดที่ถูกเลือก (เช่น "TH-10")
  const [provinceOptions, setProvinceOptions] = useState([]); // เก็บรายการจังหวัดจาก API
  const [loadingProvinces, setLoadingProvinces] = useState(true); // สถานะการโหลดของ Dropdown

    // *** Function สำหรับดึงข้อมูลจังหวัดจาก Backend ***
  //   useEffect(() => {
  //   setProvinceOptions(provincesData);
  //   setLoadingProvinces(false);
  // }, []);

  useEffect(() => {
      fetch(`${API_BASE_URL}/provinces`) // URL backend FastAPI
        .then((res) => res.json())
        .then((data) => {
          setProvinceOptions(data);
          setLoadingProvinces(false);
        })
        .catch((err) => {
          console.error("Error fetching provinces:", err);
          setLoadingProvinces(false);
        });
    }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append("member_type", "MEMBER");

    if (plate1) params.append("plate1", plate1);
    if (plate2) params.append("plate2", plate2);
    if (province) params.append("province", province);
    if (invoiceNo) params.append("invoice_no", invoiceNo);
    if (customerID) params.append("customer_id", customerID);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    navigate(`/receipt-result?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">ค้นหาใบเสร็จรับเงิน (สมาชิก)</h2>

        <div className="grid grid-cols-1 gap-1 mb-4">
          <label className="block text-gray-700 text-md font-semibold mb-1">
            ช่วงวันที่ผ่านทาง <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label htmlFor="startdate-input" className="text-gray-700 text-sm font-semibold mb-1">
                เริ่มต้น
              </label>
              <input
                type="date"
                id="startdate-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label htmlFor="enddate-input" className="text-gray-700 text-sm font-semibold mb-1">
                สิ้นสุด
              </label>
              <input
                type="date"
                id="enddate-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
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
              maxLength={3}
            />
          </div>

          <div>
            <label htmlFor="plate2-input" className="block text-gray-700 text-sm font-semibold mb-1">
              เลขทะเบียน
            </label>
            <input
              type="text"
              value={plate2}
              // onChange={(e) => setPlate2(e.target.value)}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setPlate2(numericValue);
              }}
              placeholder="ตัวอย่าง : 1234"
              className="p-2 border rounded w-full"
              maxLength={4}
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

        <div className="grid grid-cols-1 md:grid-cols-1 mb-4">
          <label htmlFor="customerid-input" className="block text-gray-700 text-sm font-semibold mb-1">
              หมายเลขสมาชิก
            </label>
          <input
            type="text"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            placeholder="หมายเลขสมาชิก"
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 mb-4">
          <label htmlFor="invoiceno-input" className="block text-gray-700 text-sm font-semibold mb-1">
            เลขที่ใบแจ้งหนี้
          </label>
          <input
            type="text"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            placeholder="เลขที่ใบแจ้งหนี้"
            className="p-2 border rounded w-full"
          />
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
