import { Route } from "react-router-dom";
import RegisterForm from "../pages/RegisterForm";

const RegisterRoutes = [
    <Route key="register" path="register" element={<RegisterForm />} />
]

export default RegisterRoutes;