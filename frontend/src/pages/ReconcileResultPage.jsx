// frontend/src/pages/ReconcileResultPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import ResultTable from "../components/ResultTable";
import { ArrowBigLeft } from "lucide-react";

export default function ReconcileResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ถ้าเข้าหน้านี้ตรง ๆ โดยไม่มี state ให้ย้อนกลับ
  if (!state) {
    navigate("/reconcile-search");
    return null;
  }

  const { data, count } = state;

  return (
    <div className="max-w-full mx-auto mt-10 p-4">
      <h2 className="text-3xl font-semibold mb-4">
        ผลการตรวจสอบประวัติการชำระเงิน ({count} รายการ)
      </h2>

      <div className="mb-4">
        <button
          onClick={() => navigate("/reconcile-search")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <ArrowBigLeft className="w-6 h-6" />
          ย้อนกลับ
        </button>
      </div>

      <ResultTable data={data} />
    </div>
  );
}
