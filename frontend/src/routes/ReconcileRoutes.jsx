import { Route } from "react-router-dom";
import ReconcileSearchPage from "../pages/ReconcileSearchPage";
import ReconcileResultPage from "../pages/ReconcileResultPage";

const ReconcileRoutes = [
  <Route key="reconcile-search" path="reconcile-search" element={<ReconcileSearchPage />} />,
  <Route key="reconcile-result" path="reconcile-result" element={<ReconcileResultPage />} />
  
];

export default ReconcileRoutes;