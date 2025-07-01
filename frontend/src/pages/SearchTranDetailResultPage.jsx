import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import * as XLSX from "xlsx";
import { ArrowBigLeft,
  HardDriveDownload,
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function SearchTranDetailResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "TRANSACTION_ID";
  const data = queryParams.get("data") || "";
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;


    useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/search-tran-detail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            ids: data.split(',').map((id) => id.trim()).filter(Boolean),
          }),
        });
          const json = await res.json();
          setResults(json.data || []);
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setLoading(false);
        }
      };
      if (data) fetchData();
    }, [type, data]);

  // ฟังก์ชั่น Download .xlsx
  const downloadExcel = () => {
  if (!results || results.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(results);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TransactionDetails");
  XLSX.writeFile(workbook, "transaction_details.xlsx");
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = results.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">ผลการค้นหารายการ ({type})</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => navigate("/tran-detail")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <ArrowBigLeft className="w-6 h-6" />
              ย้อนกลับ
            </button>

            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <HardDriveDownload className="w-5 h-5" />
              ดาวน์โหลด Excel
            </button>
          </div>

          <div className="overflow-auto border mt-2">
            <table className="min-w-full border text-sm">
              <thead className="bg-blue-500 text-left text-white">
                <tr>
                  {currentItems[0] && Object.keys(currentItems[0]).map((key) => (
                    <th key={key} className="px-2 py-1 border">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-blue-50">
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="border px-2 py-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            พบทั้งหมด {results.length.toLocaleString()} รายการ
          </p>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2 text-sm">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1 px-2 border rounded disabled:opacity-50"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 px-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">
                หน้า {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 px-2 border rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 px-2 border rounded disabled:opacity-50"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}