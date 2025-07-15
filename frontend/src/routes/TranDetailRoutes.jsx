import { Route } from "react-router-dom";
import SearchTranDetailPage from "../pages/SearchTranDetailPage"
import SearchTranDetailResultPage from "../pages/SearchTranDetailResultPage"

const TranDetailRoutes = [
  <Route key="tran-detail" path="tran-detail" element={<SearchTranDetailPage />} />,
  <Route key="tran-detail-result" path="tran-detail-result" element={<SearchTranDetailResultPage />} />
];

export default TranDetailRoutes;