import { Route } from "react-router-dom";
import RefCheckerPage from "../pages/RefCheckerPage";
import ResultPage from "../pages/ResultPage";

const RefCheckerRoutes = [
  <Route key="ref-checker" path="ref-checker" element={<RefCheckerPage />} />,
  <Route key="result" path="result" element={<ResultPage />} />

]; 

export default RefCheckerRoutes;