// frontend/src/pages/ReconcileSearchPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, HandCoins } from "lucide-react";
import { API_BASE_URL } from "../config";

const CHANNELS = [
  { value: "BILL_PAYMENT", label: "Bill Payment", type: "INVOICE_NO" },
  { value: "FASTPAY", label: "FASTPAY", type: "INVOICE_NO" },
  { value: "COUNTER_SERVICE", label: "Counter Service", type: "INVOICE_NO" },
  { value: "EASYPASS", label: "EASYPASS", type: "TRANSACTION_ID" },
  { value: "MPASS", label: "MPASS", type: "TRANSACTION_ID" },
];

export default function ReconcileSearchPage() {
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [rawIds, setRawIds] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const ids = rawIds
      .split(/\s*[,\n]\s*/) // แยกด้วย , หรือ ขึ้นบรรทัด
      .filter(Boolean);

    if (!ids.length) {
      alert("กรุณากรอกหมายเลขอย่างน้อย 1 รายการ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reconcile/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channel.value, ids }),
      });

      if (!res.ok) {
        const detail = (await res.json()).detail;
        throw new Error(detail || `Error ${res.status}`);
      }

      const data = await res.json();
      navigate("/reconcile-result", { state: data });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-10">
      <h2 className="flex gap-3 text-2xl font-bold mb-6">
        <HandCoins className="w-8 h-8" />
        ตรวจสอบประวัติการชำระเงิน
      </h2>

      {/* เลือก channel */}
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        ช่องทางการชำระเงิน
      </label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={channel.value}
        onChange={(e) =>
          setChannel(CHANNELS.find((c) => c.value === e.target.value))
        }
      >
        {CHANNELS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      {/* ids textarea */}
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        ค้นหาด้วย&nbsp;
        <span className="font-bold text-red-600">{channel.type}</span>
        &nbsp;(คั่นด้วยคอมมาหรือขึ้นบรรทัดใหม่)
      </label>
      <textarea
        className="w-full p-2 h-40 border rounded mb-4"
        placeholder="ตัวอย่าง INV2024001, INV2024002 …หรือพิมพ์ทีละบรรทัดก็ได้"
        value={rawIds}
        onChange={(e) => setRawIds(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full font-semibold px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent rounded-full" />
        ) : (
          <Search className="w-5 h-5" />
        )}
        ตรวจสอบ
      </button>
    </div>
  );
}
