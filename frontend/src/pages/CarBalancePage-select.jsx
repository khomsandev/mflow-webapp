import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Car } from "lucide-react";
import { API_BASE_URL } from '../config';


export default function CarBalancePage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/companies`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (!selectedCustomerId) {
      alert("กรุณาเลือกบริษัท");
      return;
    }

    navigate(`/car-balance/result?customer_id=${selectedCustomerId}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="flex gap-3 text-2xl font-bold mb-6">
          <Car className="w-8 h-8"/>
          Car Balance
      </h2>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        เลือกบริษัท
      </label>
      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- เลือกบริษัท --</option>
          {companies.map((company) => (
            <option key={company.customer_id} value={company.customer_id}>
              {`${company.customer_id} | ${company.name}`}
            </option>
          ))}
        </select>
      )}

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

