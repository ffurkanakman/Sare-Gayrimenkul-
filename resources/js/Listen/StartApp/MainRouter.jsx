import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UiLayout from "./Layouts/Misc/Ui";
import { ROUTES } from "../../Libs/Routes/config";
import AuthLayout from "./Layouts/Auth";
import Login from "../../Pages/Auth/Login";
import Register from "../../Pages/Auth/Register";
import ForgotPassword from "../../Pages/Auth/ForgotPassword";
import ResetPassword from "../../Pages/Auth/ResetPassword";
import Kullanicilar from "../../Pages/Ui/Kullanicilar";
import KullaniciGoruntule from "../../Pages/Ui/KullaniciGoruntule";
import KullaniciDuzenle from "../../Pages/Ui/KullaniciDuzenle";
import YeniKullanici from "../../Pages/Ui/YeniKullanici";
import Customers from "../../Pages/Ui/Customers/index";
import MyCustomers from "../../Pages/Ui/Customers/MyCustomers";
import Substation from "../../Pages/Ui/Substations/Substation";
import ProtectedRoute from "../../Components/Auth/ProtectedRoute";
import { ErrorsPage } from "../../Libs/Metronic/app/modules/errors/ErrorsPage";
import { PagesLoad } from "../../Pages/Load.jsx";
import Navbar from "../../Pages/Ui/Settings/Navbar.jsx";
import SubstationCreateModal from "../../Pages/Ui/Substations/Modals/SubstationCreateModal";
import SubstationEditModal from "../../Pages/Ui/Substations/Modals/SubstationEditModal";
import AccountSettings from "../../Pages/Ui/Customers/AccountSettings";


const MainRouter = () => {
    return (
        <Routes>
            <Route path={ROUTES.UI.USER} element={<AuthLayout />}>
                <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
                <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
                <Route
                    path={ROUTES.AUTH.FORGOT_PASSWORD}
                    element={<ForgotPassword />}
                />
                <Route
                    path={ROUTES.AUTH.RESET_PASSWORD}
                    element={<ResetPassword />}
                />
                {/*<Route path={ROUTES.AUTH.TWO_FACTOR} element={<TwoFactor />} />*/}
                <Route index element={<Navigate to="Giris" replace />} />
            </Route>

            <Route element={<PagesLoad />}>
                <Route element={<UiLayout />}>
                    {/* Protected routes - require authentication */}
                    <Route
                        path={ROUTES.UI.LANDING}
                        index
                        element={
                            <ProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.USERS}
                        element={
                            <ProtectedRoute>
                                <Kullanicilar />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.VIEW_USER}
                        element={
                            <ProtectedRoute>
                                <KullaniciGoruntule />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.EDIT_USER}
                        element={
                            <ProtectedRoute>
                                <KullaniciDuzenle />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.NEW_USER}
                        element={
                            <ProtectedRoute>
                                <YeniKullanici />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.CLIENTS}
                        element={
                            <ProtectedRoute>
                                <Customers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.SUBSTATION}
                        element={
                            <ProtectedRoute>
                                <Substation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.NEW_SUBSTATION}
                        element={
                            <ProtectedRoute>
                                <SubstationCreateModal />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.UI.EDIT_SUBSTATION}
                        element={
                            <ProtectedRoute>
                                <SubstationEditModal />
                            </ProtectedRoute>
                        }
                    />
                    <Route element={<Navbar/>}>
                        <Route
                            path={ROUTES.UI.MYCLIENTS}
                            element={
                                <ProtectedRoute>
                                    <MyCustomers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.UI.ACCOUNT_SETTINGS}
                            element={
                                <ProtectedRoute>
                                    <AccountSettings />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Route>

                <Route path={`${ROUTES.UI.ERROR}/*`} element={<ErrorsPage />} />

            </Route>

            {/* Hatalı rota durumunda yönlendirme */}
            <Route
                path="*"
                element={<Navigate to={ROUTES.UI.LANDING} replace />}
            />
        </Routes>
    );
};

export default MainRouter;
