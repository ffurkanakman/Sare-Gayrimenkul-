import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../Libs/Routes/config";
import {Slide, toast} from "react-toastify";
import { useAuth } from "../../ServerSide/Hooks/Auth/useAuth";
import "../../../sass/page/_auth.scss";

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, isAuthenticated, loading, loginError } = useAuth();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t('Geçerli bir email adresi giriniz'))
            .required(t('Email adresi zorunludur')),
        password: Yup.string()
            .required(t('Şifre zorunludur'))
            .min(6, t('Şifre en az 6 karakter olmalıdır'))
    });


    useEffect(() => {
        const isLogoutPending = sessionStorage.getItem('logoutToastPending');
        if (isLogoutPending) {
            sessionStorage.removeItem('logoutToastPending');

            // 🔥 Sayfa tamamen render olduktan sonra toast gösterilsin
            setTimeout(() => {
                toast.success("Çıkış yapıldı", {
                    transition: Slide, // veya Zoom / Bounce
                    autoClose: 2000,
                    pauseOnHover: false
                });

            });
        }
    }, []);



    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await login(values);
            if (result) {
                toast.success(t("Giriş başarılı! Yönlendiriliyorsunuz..."));
                setTimeout(() => {
                    navigate(ROUTES.UI.LANDING);
                }, 1500);
            }
        } catch (error) {
            console.error("Giriş hatası:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="auth-logo">
                <img src="/img/vector/logo.png" alt="Logo" />
            </div>
            <div>
                <div className="auth-header">
                    <h1>{t('Üye Girişi')}</h1>
                </div>
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="form-wrapper">
                                <div className="row">
                                    <div className="form-group col-lg-6 login-input">
                                        <label htmlFor="email" className="login-title">{t('E-posta')}</label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="ornek@email.com"
                                            className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="email" component="div" className="error-messages" />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label htmlFor="password" className="login-title">{t('Şifre')}</label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="password" component="div" className="error-messages" />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button btn btn-danger"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {t('Giriş Yapılıyor...')}
                                        </>
                                    ) : (
                                        t('Giriş Yap')
                                    )}
                                </button>

                                {loginError && (
                                    <div className="alert alert-danger mt-3">
                                        {loginError}
                                    </div>
                                )}

                                <div className="footer-links">
                                    <Link to={ROUTES.AUTH.FORGOT_PASSWORD}>{t('Şifremi Unuttum')}</Link>
                                    <Link to={ROUTES.AUTH.REGISTER}>{t('Hesap Oluştur')}</Link>
                                    <Link to={ROUTES.UI.LANDING}>{t('Anasayfa Dön')}</Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
