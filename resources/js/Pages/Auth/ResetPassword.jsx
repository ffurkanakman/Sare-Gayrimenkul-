import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PasswordStrengthBar from 'react-password-strength-bar';
import { useAuth } from "../../ServerSide/Hooks/Auth/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../Libs/Routes/config";

const ResetPassword = () => {
    const { t } = useTranslation();
    const { resetPassword, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState(null);

    // Get token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.UI.DASHBOARD);
        }
    }, [isAuthenticated, navigate]);

    // Redirect if token or email is missing
    useEffect(() => {
        if (!token || !email) {
            navigate(ROUTES.AUTH.FORGOT_PASSWORD);
        }
    }, [token, email, navigate]);

    const initialValues = {
        token: token || "",
        email: email || "",
        password: "",
        password_confirmation: "",
    };

    const validationSchema = Yup.object({
        token: Yup.string().required('Token is required'),
        email: Yup.string().email().required('Email is required'),
        password: Yup.string()
            .min(8, t('Şifre en az 8 karakter olmalıdır'))
            .matches(/[A-Z]/, t('Şifre en az 1 büyük harf içermelidir'))
            .matches(/[0-9]/, t('Şifre en az 1 rakam içermelidir'))
            .matches(/[\W_]/, t('Şifre en az 1 sembol içermelidir'))
            .required(t('Şifre zorunludur')),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], t('Şifreler eşleşmiyor'))
            .required(t('Şifre tekrarı zorunludur')),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setResetError(null);
        try {
            await resetPassword(values);
            setResetSuccess(true);
            setTimeout(() => {
                navigate(ROUTES.AUTH.LOGIN);
            }, 3000); // Redirect to login after 3 seconds
        } catch (error) {
            console.error("Şifre yenileme hatası:", error);
            setResetError(error.response?.data?.message || "Şifre yenileme işlemi sırasında bir hata oluştu");
        } finally {
            setSubmitting(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <div>
            <div className="auth-header">
                <h1>{t('Şifremi Yenile')}</h1>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, values }) => (
                    <Form className="form-wrapper">
                        <div className="form-group">
                            <label htmlFor="password">{t('Şifre')}</label>
                            <div className="pass-input">
                                <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('Şifre')}
                                    className={`form-control p-2 ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="flex items-center"
                                >
                                    <i className={`icon ${showPassword ? 'eye' : 'eye-slash'}`}></i>
                                </span>
                            </div>
                            <ErrorMessage name="password" component="div" className="error-messages" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_confirmation">{t('Şifre Tekrar')}</label>
                            <div className="pass-input">
                                <Field
                                    name="password_confirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder={t('Şifre Tekrar')}
                                    className={`form-control p-2 ${errors.password_confirmation && touched.password_confirmation ? 'is-invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                    className="d-flex align-items-center"
                                >
                                    <i className={`icon ${showPasswordConfirmation ? 'eye' : 'eye-slash'}`}></i>
                                </span>
                            </div>
                            <ErrorMessage name="password_confirmation" component="div" className="error-messages" />
                        </div>
                        <div className="my-2">
                            <PasswordStrengthBar className="pass-strength" password={values.password} />
                            <span className="pass-info">
                                {t('Lütfen en az 8 karakter, 1 büyük harf, 1 rakam ve 1 sembol içeren bir şifre giriniz.')}
                            </span>
                        </div>
                        {resetSuccess ? (
                            <div className="alert alert-success">
                                {t('Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...')}
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {t('İşleniyor...')}
                                    </>
                                ) : (
                                    t('Şifremi Sıfırla')
                                )}
                            </button>
                        )}

                        {resetError && (
                            <div className="alert alert-danger mt-3">
                                {resetError}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ResetPassword;
