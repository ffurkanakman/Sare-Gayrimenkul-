import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../../../Libs/Routes/config';
import AuthLayout from '../Layouts/Auth'
import Login from "../../../Pages/Auth/Login.jsx";
import Register from "../../../Pages/Auth/Register.jsx";
import ForgotPassword from "../../../Pages/Auth/ForgotPassword.jsx";
// import TwoFactor from "../../../Pages/Auth/TwoFactor.jsx";
import ResetPassword from "../../../Pages/Auth/ResetPassword.jsx";

const AuthRouter = () => {
    return (
        <Route path="/" element={<AuthLayout />}>
            <Route path="Giris" element={<Login />} />
            <Route path="KayitOl" element={<Register />} />
            <Route path="SifremiUnuttum" element={<ForgotPassword />} />
            {/*<Route path="2Faktor" element={<TwoFactor />} />*/}
            <Route path="SifreyiSifirla" element={<ResetPassword />} />

            {/* Index route ekleyin */}
            <Route index element={<Navigate to="Giris" replace />} />
        </Route>
    );
};

export default AuthRouter;
