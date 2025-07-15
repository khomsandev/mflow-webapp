import { Route } from "react-router-dom";
import InvoiceSearchMemberPage from "../pages/InvoiceSearchMemberPage";
import InvoiceSearchNonmemberPage from "../pages/InvoiceSearchNonmemberPage";
import InvoiceResultPage from "../pages/InvoiceResultPage";

const invoiceRoutes = [
  <Route key="invoice-member" path="invoice-member" element={<InvoiceSearchMemberPage />} />,
  <Route key="invoice-nonmember" path="invoice-nonmember" element={<InvoiceSearchNonmemberPage />} />,
  <Route key="invoice-result" path="invoice-result" element={<InvoiceResultPage />} />
];

export default invoiceRoutes;