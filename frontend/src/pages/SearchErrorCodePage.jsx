import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchCode } from "lucide-react";

const SearchErrorCodePage = () => {
  const [errorCode, setErrorCode] = useState("");
  const [selectedFile, setSelectedFile] = useState("errorPaymentViaCardFailed");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!errorCode.trim()) return;

    // ส่งพารามิเตอร์ไฟล์และ code ไปใน URL query string
    navigate(`/search-errorcode-result?file=${selectedFile}&code=${encodeURIComponent(errorCode)}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="flex gap-3 text-2xl font-bold mb-6">
            <SearchCode className="w-8 h-8" />
            ค้นหา ErrorCode
        </h2>
      <form onSubmit={handleSearch} className="space-y-4">

        <label className="block font-semibold">เลือกประเภทสำหรับค้นหา</label>
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
            <option value="errorPaymentViaCardFailed">ERROR การตัดเงินผ่านบัตรเครดิต-เดบิต</option>
            <option value="errorAddCarAddTagEPMP">ERROR เพิ่มรถและเพิ่มบัตรEasyPassMpass</option>
        </select>

        <input
          type="text"
          placeholder="กรอก Error Code"
          value={errorCode}
          onChange={(e) => setErrorCode(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          ค้นหา
        </button>
      </form>
    </div>
  );
};

export default SearchErrorCodePage;
