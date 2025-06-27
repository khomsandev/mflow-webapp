// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ตรวจให้ครอบคลุมไฟล์ที่ใช้
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kanit", "sans-serif"], // ตั้งค่า default font เป็น Kanit
      },
    },
  },
  plugins: [],
}
