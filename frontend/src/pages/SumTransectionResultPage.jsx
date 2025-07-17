import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResultTable from "../components/ResultTable";
import { API_BASE_URL, API_KEY, FILE_SERVICE_URL } from "../config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  HardDriveDownload,
  ArrowBigLeft,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function SumTransectionResultPage() {
  // ──────────────────────── State ─────────────────────────
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const customerId = searchParams.get("customer_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const [companyNameForDownload, setCompanyNameForDownload] = useState(''); 

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(result.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;

  // ──────────────────────── Helpers ─────────────────────────
  const formatDateToThai = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yearBE = date.getFullYear() + 543;
    return `${day}/${month}/${yearBE}`;
  };

  // ──────────────────────── Fetch summary ─────────────────────────
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/summary-tran?customer_id=${customerId}&start_date=${startDate}&end_date=${endDate}`,
          {
            headers: { "x-api-key": API_KEY },
          }
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setResult(data.data || []);

        // อัปเดต companyNameForDownload เมื่อข้อมูลโหลดเสร็จ
        if (data.data && data.data.length > 0 && data.data[0].company_name) {
            // ทำความสะอาดชื่อบริษัทเพื่อใช้ในชื่อไฟล์
            const sanitizedName = data.data[0].company_name.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, ''); // เพิ่มการรองรับภาษาไทย
            setCompanyNameForDownload(sanitizedName);
        } else {
            setCompanyNameForDownload(''); // ถ้าไม่มี ให้เป็นค่าว่าง
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    if (customerId && startDate && endDate) fetchSummary();
  }, [customerId, startDate, endDate]);

  // ──────────────────────── Export to Excel ─────────────────────────
  const exportToExcel = async () => {
    if (!result || result.length === 0) {
      alert("ไม่มีข้อมูลให้ดาวน์โหลด");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SumTransection");

    const columns = Object.keys(result[0] || {}).concat("RECEIPT_LINK");
    worksheet.columns = columns.map((col) => ({ header: col, key: col }));

     worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" },
      };
    });

    result.forEach((item) => {
      const row = worksheet.addRow({
        ...item,
        RECEIPT_LINK: {
          text: "Download",
          hyperlink: `${FILE_SERVICE_URL}${item.receipt_file_id}?key=${API_KEY}`,
        },
      });

      const receiptCell = row.getCell("RECEIPT_LINK");
      receiptCell.font = {
        color: { argb: "FF1F4E78" },
        underline: true,
      };
    });

    // ใช้ companyNameForDownload ที่ถูกเก็บไว้ใน state
    const finalCompanyName = companyNameForDownload ? `${companyNameForDownload}` : '';

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `รายการผ่านทาง_${finalCompanyName}_${startDate}_to_${endDate}.xlsx`
    );
  };

  // ──────────────────────── Render ─────────────────────────
  return (
    <div className="max-w-full mx-auto mt-10 p-4">
      {/* หัวข้อ */}
      <h2 className="text-3xl font-semibold mb-4">
        รายการผ่านทาง
        {result.length > 0 && result[0].company_name && (
          <> : {result[0].company_name}</>
        )}
      </h2>

      {/* ช่วงวันที่ */}
      {startDate && endDate && (
        <p className="text-black mb-4 text-xl">
          ระหว่างวันที่ {formatDateToThai(startDate)} ถึง {formatDateToThai(endDate)}
        </p>
      )}

      {/* ปุ่ม action */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => navigate("/sum-transection")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <ArrowBigLeft className="w-6 h-6" />
          ย้อนกลับ
        </button>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <HardDriveDownload className="w-5 h-5" />
          ดาวน์โหลด Excel
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        พบทั้งหมด {result.length.toLocaleString()} รายการ
      </p>

      {/* เนื้อหา */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <>
          {result.length > 0 ? (
            <>
              {/* ตารางผลลัพธ์ */}
              <ResultTable data={result.slice(offset, offset + itemsPerPage)} offset={offset} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  {/* หน้าแรก */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* ก่อนหน้า */}
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* หน้าปัจจุบัน */}
                  <span className="px-2 py-1">หน้า {currentPage} จาก {totalPages}</span>

                  {/* ถัดไป */}
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* หน้าสุดท้าย */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  className="p-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
          ) : (
            <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
              ไม่พบข้อมูล
            </div>
        )}
        </>
      )}
    </div>
  );
}
