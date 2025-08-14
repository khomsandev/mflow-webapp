import { Route } from "react-router-dom";
import SearchErrorCodePage from "../pages/SearchErrorCodePage";
import SearchErrorCodeResultPage from "../pages/SearchErrorCodeResultPage";

const ErrorCodeRoutes = [
  <Route key="search-errorcode" path="search-errorcode" element={<SearchErrorCodePage />} />,
  <Route key="search-errorcode-result" path="search-errorcode-result" element={<SearchErrorCodeResultPage />} />
];

export default ErrorCodeRoutes;
