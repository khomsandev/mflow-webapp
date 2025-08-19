import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import { Save } from "lucide-react";
import Swal from "sweetalert2";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ!",
          text: "ระบบจะพาคุณไปที่หน้าเข้าสู่ระบบ",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login"); // redirect ไปหน้า login
        });

        setUsername("");
        setPassword("");
        setName("");
      } else {
        Swal.fire({
          icon: "error",
          title: "สมัครไม่สำเร็จ",
          text: data.detail || "กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-5">
        <img
          src="./mflow-logo2.png"
          alt="logo login page"
          className="w-56 h-auto"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Application Support
        </h1>
      </div>
      <form
        onSubmit={handleRegister}
        className="w-96 max-w-lg mt-3 bg-white shadow-md rounded p-6 space-y-4"
      >
        <h2 className="text-xl text-center font-semibold text-gray-700">
          ลงทะเบียน
        </h2>
        <div className="border-t border-gray-300 my-6"></div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="username-input"
              className="text-gray-700 text-sm font-semibold mb-1"
            >
              ชื่อผู้ใช้ <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              id="username-input"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="password-input"
              className="text-gray-700 text-sm font-semibold mb-1"
            >
              รหัสผ่าน <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="password"
              id="password-input"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="name-input"
              className="text-gray-700 text-sm font-semibold mb-1"
            >
              ชื่อ-นามสกุล <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              id="name-input"
              placeholder="ชื่อ-นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full font-medium px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save /> ลงทะเบียน
        </button>

        <Link
          to="/login"
          className="block mt-6 text-blue-500 hover:underline"
        >
          ← กลับไปหน้าล็อกอิน
        </Link>
      </form>
    </div>
  );
}
