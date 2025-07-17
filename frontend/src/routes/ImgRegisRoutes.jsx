import { Route } from "react-router-dom";
import SearchImgRegisPage from "../pages/SearchImgRegisPage";
import SearchImgRegisResultPage from "../pages/SearchImgRegisResultPage";

const ImgRegisRoutes = [
  <Route key="search-img-regis" path="search-img-regis" element={<SearchImgRegisPage />} />,
  <Route key="search-img-regis-result" path="search-img-regis-result" element={<SearchImgRegisResultPage />} />
];

export default ImgRegisRoutes;