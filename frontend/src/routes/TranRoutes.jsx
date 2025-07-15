import { Route } from "react-router-dom";
import TranSearchMemberPage from "../pages/TranSearchMemberPage"
import TranSearchNonmemberPage from "../pages/TranSearchNonmemberPage"
import TranResultPage from "../pages/TranResultPage"
import TranSearchIllegalPage from "../pages/TranSearchillegalPage"
import TranillegalResultPage from "../pages/TranillegalResultPage"

const TranRoutes = [
  <Route key="tran-member" path="tran-member" element={<TranSearchMemberPage />} />,
  <Route key="tran-nonmember" path="tran-nonmember" element={<TranSearchNonmemberPage />} />,
  <Route key="tran-illegal" path="tran-illegal" element={<TranSearchIllegalPage />} />,
  <Route key="tran-result" path="tran-result" element={<TranResultPage />} />,
  <Route key="tran-result-illegal" path="tran-result-illegal" element={<TranillegalResultPage />} />

];

export default TranRoutes;