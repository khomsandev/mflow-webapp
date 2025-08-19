import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import TranRoutes from "./routes/TranRoutes";
import RefCheckerRoutes from "./routes/RefCheckerRoutes";
import CustomerVipRoutes from "./routes/CustomerVipRoutes";
import InvoiceRoutes from "./routes/InvoiceRoutes";
import ReceiptRoutes from "./routes/ReceiptRoutes";
import TranDetailRoutes from "./routes/TranDetailRoutes";
import ReconcileRoutes from "./routes/ReconcileRoutes";
import ImgRegisRoutes from "./routes/ImgRegisRoutes";
import ErrorCodeRoutes from "./routes/ErrorCodeRoutes";
import RegisterRoutes from "./routes/RegisterRoutes";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => window.location.href = "/"} />} />
        {RegisterRoutes}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {TranRoutes}
          {ReconcileRoutes}
          {RefCheckerRoutes}
          {CustomerVipRoutes}
          {InvoiceRoutes}
          {ReceiptRoutes}
          {TranDetailRoutes}
          {ImgRegisRoutes}
          {ErrorCodeRoutes}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
