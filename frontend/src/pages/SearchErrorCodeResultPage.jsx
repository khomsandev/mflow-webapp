import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from '../config';

// import ไฟล์ JSON ทั้ง 2 ไฟล์
// import errorAddCarAddTagEPMP from "../data/errorAddCarAddTagEPMP.json";
// import errorPaymentViaCardFailed from "../data/errorPaymentViaCardFailed.json";

// const fileMap = {
//   errorAddCarAddTagEPMP,
//   errorPaymentViaCardFailed,
// };

const SearchErrorCodeResultPage = () => {
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const searchCode = queryParams.get("code");
  const searchFile = queryParams.get("file");

  useEffect(() => {
    if (searchCode && searchFile) {
      setFileName(searchFile);
      setLoading(true);

      fetch(`${API_BASE_URL}/error-code?file=${searchFile}&code=${encodeURIComponent(searchCode)}`)
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    } else {
      setResult(null);
      setLoading(false);
    }
  }, [searchCode, searchFile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">ผลการค้นหา</h1>
      <p className="mb-2">
        <span className="font-semibold">ค้นหาในตาราง:</span> {fileName}
      </p>

      {result ? (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Error Code:</span> {result.error_code}
          </p>
          <p>
            <span className="font-semibold">รายละเอียด (TH):</span>{" "}
            {result.error_description_TH}
          </p>
          <p>
            <span className="font-semibold">รายละเอียด (EN):</span>{" "}
            {result.error_description_EN}
          </p>
        </div>
      ) : (
        <p className="text-red-500">ไม่พบ Error Code: {searchCode}</p>
      )}

      <Link
        to="/search-errorcode"
        className="block mt-6 text-blue-500 hover:underline"
      >
        ← กลับไปค้นหาใหม่
      </Link>
    </div>
  );
};

export default SearchErrorCodeResultPage;