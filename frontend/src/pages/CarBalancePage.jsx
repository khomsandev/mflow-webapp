import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Car } from "lucide-react";


export default function CarBalancePage() {
  const [customerId, setCustomerId] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!customerId.trim()) {
      alert("กรุณากรอก Customer ID");
      return;
    }
    navigate(`/car-balance/result?customer_id=${customerId}`);
  };

 return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="flex gap-3 text-2xl font-bold mb-6">
        <Car className="w-8 h-8" />
        Car Balance
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
