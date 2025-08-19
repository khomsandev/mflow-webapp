import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    // ล้างข้อมูล token และชื่อผู้ใช้
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    // กลับไปหน้า login
    navigate("/login");
  };

  const name = localStorage.getItem("name"); // ดึงชื่อผู้ใช้มาแสดง

  // ✅ เมนู dropdown
  const menuItems = [
    // {
    //   label: "Profile",
    //   icon: <User size={18} />,
    //   action: () => navigate("/profile"),
    // },
    // {
    //   label: "Settings",
    //   icon: <Settings size={18} />,
    //   action: () => navigate("/settings"),
    // },
    {
      label: "Logout",
      icon: <LogOut size={18} />,
      action: handleLogout,
    },
  ];

  // ✅ ปิด dropdown ถ้าคลิกนอก component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-blue-900 flex items-center justify-between px-10 shadow-md h-auto py-1">
      <div className="flex flex-col items-center">
        <img
          src="/mflow-logo-white2.png"
          alt="MFlow Logo"
          className="h-12 w-auto mb-1"
        />
        <h1 className="text-lg text-white font-extrabold">Application Support</h1>
      </div>

{name && (
        <div className="relative" ref={dropdownRef}>
          {/* ปุ่มชื่อผู้ใช้ */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white font-semibold flex items-center gap-1 focus:outline-none"
          >
            Hi, {name} <span className="text-sm">⏷</span>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg z-50">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDropdownOpen(false);
                    item.action();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
