import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import TranRoutes from "./routes/TranRoutes";
import RefCheckerRoutes from "./routes/RefCheckerRoutes";
import CustomerVipRoutes from "./routes/CustomerVipRoutes";
import InvoiceRoutes from "./routes/InvoiceRoutes";
import ReceiptRoutes from "./routes/ReceiptRoutes";
import TranDetailRoutes from "./routes/TranDetailRoutes";
import ReconcileRoutes from "./routes/ReconcileRoutes";
import ImgRegisRoutes from "./routes/ImgRegisRoutes";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>

          {/* แดชบอร์ด */}
          {/* 🔹 Dashboard and other pages */}
          <Route index element={<DashboardPage />} />

          {/* ตรวจสอบรายการผ่านทาง */}
          {/* 🔹 Tran search routes */}
          {TranRoutes }

          {/* ตรวจสอบประวัติการชำระเงิน */}
          {/* 🔹 Reconcile routes */}
          {ReconcileRoutes }
          
          {/* ตรวจสอบการชำระเงิน */}
          {/* 🔹 RefChecker routes */}
          {RefCheckerRoutes }

          {/* CustomerVIP */}
          {CustomerVipRoutes }

          {/* ค้นหาใบแจ้งหนี้ */}
          {/* 🔹 Invoice search routes */}
          {InvoiceRoutes }

          {/* ค้นหาใบเสร็จรับเงิน */}
          {/* 🔹 receipt search routes */}
          {ReceiptRoutes }

          {/* ค้นหา Transection Detail */}
          {/* 🔹 tran detail search routes */}
          {TranDetailRoutes }

          {/* ค้นหารูปภาพการลงทะเบียน */}
          {/* 🔹 Image registration search routes */}
          {ImgRegisRoutes }

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
