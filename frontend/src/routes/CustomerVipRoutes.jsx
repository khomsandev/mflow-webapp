import { Route } from "react-router-dom";
import CarBalancePage from "../pages/CarBalancePage";
import CarBalanceResultPage from "../pages/CarBalanceResultPage";
import SumTransectionPage from "../pages/SumTransectionPage";
import SumTransectionResultPage from "../pages/SumTransectionResultPage";

const CustomerVipRoutes = [
  <Route key="car-balance" path="car-balance" element={<CarBalancePage />} />,
  <Route key="car-balance-result" path="car-balance/result" element={<CarBalanceResultPage />} />,
  <Route key="sum-transection" path="sum-transection" element={<SumTransectionPage />} />,
  <Route key="sum-transection-result" path="sum-transection-result" element={<SumTransectionResultPage />} />
];

export default CustomerVipRoutes;