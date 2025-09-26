import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeftRight } from "lucide-react";

export default function SumTransectionPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const handleSearch = () => {
    if (!customerId.trim() || !startDate || !endDate) {
      alert("กรุณากรอก Customer ID และระบุวันที่ให้ครบถ้วน");
      return;
    }
    navigate(
      `/sum-transection-result?customer_id=${customerId}&start_date=${startDate}&end_date=${endDate}`
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="flex gap-3 text-2xl font-bold mb-6">
        <ArrowLeftRight className="w-8 h-8" />
        รายการผ่านทาง
      </h2>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        CUSTOMER_ID
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="กรอก CUSTOMER_ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        วันที่เริ่มต้น
      </label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        วันที่สิ้นสุด
      </label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        ค้นหา
      </button>
    </div>
  );
}

