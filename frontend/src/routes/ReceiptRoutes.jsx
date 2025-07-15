import { Route } from "react-router-dom";
import ReceiptSearchMemberPage from "../pages/ReceiptSearchMemberPage"
import ReceiptSearchNonmemberPage from "../pages/ReceiptSearchNonmemberPage"
import ReceiptResultPage from "../pages/ReceiptResultPage"

const ReceiptRoutes = [
  <Route key="receipt-member" path="receipt-member" element={<ReceiptSearchMemberPage />} />,
  <Route key="receipt-nonmember" path="receipt-nonmember" element={<ReceiptSearchNonmemberPage />} />,
  <Route key="receipt-result" path="receipt-result" element={<ReceiptResultPage />} />
];

export default ReceiptRoutes;