import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody, KTIcon } from '../../Libs/Metronic/_metronic/helpers';
import { Toolbar } from '../../Libs/Metronic/_metronic/layout/components/toolbar/Toolbar';
import { Content } from '../../Libs/Metronic/_metronic/layout/components/Content';
import { useClient } from '../../ServerSide/Hooks/useClient';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema
const clientSchema = Yup.object().shape({
    company_name: Yup.string().required('Firma adı zorunludur'),
    authorized_person: Yup.string().required('Yetkili kişi adı zorunludur'),
    phone: Yup.string().required('Telefon numarası zorunludur'),
    email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta adresi zorunludur'),
    address: Yup.string()
});

const MusteriDuzenle = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { id } = useParams();
    const { getClient, updateClient, loading } = useClient();
    const [client, setClient] = useState(null);
    const [initialValues, setInitialValues] = useState({
        company_name: '',
        authorized_person: '',
        phone: '',
        email: '',
        address: ''
    });

    // Create breadcrumbs dynamically with client name
    const clientEditBreadCrumbs = [
        {
            title: 'Ana Sayfa',
            path: ROUTES.UI.LANDING,
            isSeparator: false,
            isActive: false,
        },
        {
            title: 'Müşteriler',
            path: ROUTES.UI.CLIENTS,
            isSeparator: false,
            isActive: false,
        },
        {
            title: client ? `${client.company_name || client.name} - Düzenle` : 'Müşteri Düzenle',
            path: '#',
            isSeparator: false,
            isActive: true,
        }
    ];

    // Fetch client details when component mounts
    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const clientData = await getClient(id);
                setClient(clientData);

                // Set initial form values
                setInitialValues({
                    company_name: clientData.company_name || '',
                    authorized_person: clientData.authorized_person || clientData.name || '',
                    phone: clientData.phone || '',
                    email: clientData.email || '',
                    address: clientData.address || ''
                });
            } catch (error) {
                console.error('Müşteri bilgileri yüklenirken hata oluştu:', error);
                toast.error('Müşteri bilgileri yüklenemedi');
                // Navigate back to clients list if client not found
                navigate(ROUTES.UI.CLIENTS);
            }
        };

        if (id) {
            fetchClientDetails();
        }
    }, [id]);

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateClient(id, values);
            toast.success('Müşteri başarıyla güncellendi');

            // Navigate to client view page after successful update
            setTimeout(() => {
                navigate(ROUTES.UI.VIEW_CLIENT.replace(':id', id));
            }, 1000);
        } catch (error) {
            console.error('Müşteri güncellenirken hata oluştu:', error);
            toast.error('Müşteri güncellenirken bir hata oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !client) {
        return (
            <>
                <PageTitle breadcrumbs={clientEditBreadCrumbs}>Müşteri Düzenle</PageTitle>
                <Content>
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                    </div>
                </Content>
            </>
        );
    }

    return (
        <>
            <PageTitle breadcrumbs={clientEditBreadCrumbs}>Müşteri Düzenle</PageTitle>
            <Content>
                <div className="card">
                    <div className="card-header border-0 pt-6">
                        <div className="card-title">
                            <h3 className="card-label">Müşteri Bilgilerini Düzenle</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={clientSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <div className="row mb-6">
                                        <div className="col-md-6">
                                            <div className="mb-10">
                                                <label className="form-label required">Firma Adı</label>
                                                <Field
                                                    type="text"
                                                    className={`form-control ${errors.company_name && touched.company_name ? 'is-invalid' : ''}`}
                                                    name="company_name"
                                                />
                                                <div className="invalid-feedback">
                                                    <ErrorMessage name="company_name" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-10">
                                                <label className="form-label required">Yetkili Kişi</label>
                                                <Field
                                                    type="text"
                                                    className={`form-control ${errors.authorized_person && touched.authorized_person ? 'is-invalid' : ''}`}
                                                    name="authorized_person"
                                                />
                                                <div className="invalid-feedback">
                                                    <ErrorMessage name="authorized_person" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-6">
                                        <div className="col-md-6">
                                            <div className="mb-10">
                                                <label className="form-label required">Telefon</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-telephone"></i>
                                                    </span>
                                                    <Field
                                                        type="text"
                                                        className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                                                        name="phone"
                                                        placeholder="0 (___) ___ __ __"
                                                    />
                                                </div>
                                                <div className="invalid-feedback d-block">
                                                    <ErrorMessage name="phone" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-10">
                                                <label className="form-label required">E-posta</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <Field
                                                        type="email"
                                                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                    />
                                                </div>
                                                <div className="invalid-feedback d-block">
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-6">
                                        <div className="col-md-12">
                                            <div className="mb-10">
                                                <label className="form-label">Adres</label>
                                                <Field
                                                    as="textarea"
                                                    className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`}
                                                    name="address"
                                                    rows="3"
                                                />
                                                <div className="invalid-feedback">
                                                    <ErrorMessage name="address" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light me-3"
                                            onClick={() => navigate(ROUTES.UI.VIEW_CLIENT.replace(':id', id))}
                                            disabled={isSubmitting}
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting || loading}
                                        >
                                            {!loading && !isSubmitting && (
                                                <span className="indicator-label">Kaydet</span>
                                            )}
                                            {(loading || isSubmitting) && (
                                                <span className="indicator-progress">
                                                    Lütfen bekleyin...
                                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Content>
        </>
    );
};

export default MusteriDuzenle;
