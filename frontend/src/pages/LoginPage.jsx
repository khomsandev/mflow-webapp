import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `${API_BASE_URL}/login`,
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("name", res.data.name);
    onLogin();
  } catch (err) {
    setError("Username หรือ Password ไม่ถูกต้อง", err.response?.data?.detail || "");
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="mb-5">
            <img src="./mflow-logo2.png" alt="logo login page" class="w-56 h-auto"/>
            <h1 className="text-2xl font-bold text-gray-800">Application Support</h1>
        </div>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96 max-w-lg">
        <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <div className="relative w-full max-w-sm mb-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6">
              <path 
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </span>
          
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative w-full max-w-sm mb-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6">
              <path 
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
          </span>
          
          <input
            type={showPassword ? "text" : "password"}
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="mb-5">
          <p className="text-sm text-gray-600 mt-4 text-center">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              คลิกที่นี่เพื่อลงทะเบียน
            </Link>
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 w-full font-medium px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            <LogIn className="w-5 h-5" /> เข้าสู่ระบบ
        </button>

      </form>
    </div>
  );
}
