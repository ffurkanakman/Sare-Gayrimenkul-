import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../ServerSide/Hooks/Auth/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Libs/Routes/config";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const { forgotPassword, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [resetSent, setResetSent] = useState(false);
    const [resetError, setResetError] = useState(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.UI.DASHBOARD);
        }
    }, [isAuthenticated, navigate]);

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t('Geçerli bir email adresi giriniz'))
            .required(t('Email adresi zorunludur')),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setResetError(null);
        try {
            await forgotPassword(values.email);
            setResetSent(true);
            resetForm();
        } catch (error) {
            console.error("Şifre sıfırlama hatası:", error);
            setResetError(error.response?.data?.message || "Şifre sıfırlama işlemi sırasında bir hata oluştu");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            <div className="auth-header">
                <h1>{t('Şifremi Unuttum')}</h1>
                <p>
                    {t('Kayıtlı e-posta adresinize, şifrenizi değiştirmeniz için bir şifre değiştirme linki göndereceğiz.')}
                </p>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="form-wrapper">
                        <div className="form-group">
                            <label htmlFor="email">{t('E-posta Adresi')}</label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                placeholder="ornek@email.com"
                                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="email" component="div" className="error-messages" />

                        </div>
                        {resetSent ? (
                            <div className="alert alert-success">
                                {t('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.')}
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
                                        {t('Gönderiliyor...')}
                                    </>
                                ) : (
                                    t('Şifre Sıfırlama Linki Gönder')
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

export default ForgotPassword;
