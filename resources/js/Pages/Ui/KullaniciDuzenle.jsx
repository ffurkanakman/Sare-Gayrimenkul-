import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody, KTIcon } from '../../Libs/Metronic/_metronic/helpers';
import { Content } from '../../Libs/Metronic/_metronic/layout/components/Content';
import { useUser } from '../../ServerSide/Hooks/useUser.jsx';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const userEditBreadCrumbs = [
    {
        title: 'Ana Sayfa',
        path: ROUTES.UI.LANDING,
        isSeparator: false,
        isActive: false,
    },
    {
        title: 'Kullanıcılar',
        path: ROUTES.UI.USERS,
        isSeparator: false,
        isActive: false,
    },
    {
        title: 'Kullanıcı Düzenle',
        path: '',
        isSeparator: false,
        isActive: true,
    }
];

// Validation schema for the form
const userEditSchema = Yup.object().shape({
    name: Yup.string().required('Ad alanı zorunludur'),
    surname: Yup.string().required('Soyad alanı zorunludur'),
    email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta alanı zorunludur'),
    phone_number: Yup.string().required('Telefon numarası alanı zorunludur'),
    role: Yup.string().required('Rol alanı zorunludur'),
    status: Yup.string().required('Durum alanı zorunludur'),
});

const UserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getUserById, updateUser, loading, error } = useUser();

    const [user, setUser] = useState(null);
    const [initialValues, setInitialValues] = useState({
        name: '',
        email: '',
        role: '',
        status: 'active',
        surname: '',
        phone_number: '',
    });

    // ✅ Foto state’leri
    const [picFile, setPicFile] = useState(null);
    const [picPreview, setPicPreview] = useState(null);
    const [removePic, setRemovePic] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUserById(id);
                if (userData) {
                    setUser(userData);
                    setInitialValues({
                        name: userData.name || '',
                        email: userData.email || '',
                        role: userData.role || 'user',
                        status: userData.status || 'active',
                        surname: userData.surname || '',
                        phone_number: userData.phone_number || '',
                    });
                    // mevcut avatarı preview'e çek
                    setPicPreview(userData.avatar_url || null);
                    setRemovePic(false);
                    setPicFile(null);
                }
            } catch (error) {
                console.error('Kullanıcı yüklenirken hata oluştu:', error);
                toast.error('Kullanıcı yüklenemedi');
            }
        };

        loadUser();
    }, [id]);

    // ✅ Foto işlemleri
    const openPicker = () => fileRef.current?.click();
    const clearPic = () => {
        setPicFile(null);
        setPicPreview(null);
        setRemovePic(true);
        if (fileRef.current) fileRef.current.value = '';
    };
    const handlePicChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!['image/jpeg','image/png','image/webp'].includes(f.type)) {
            toast.error('Sadece JPG/PNG/WEBP yükleyin');
            e.target.value = '';
            return;
        }
        if (f.size > 2*1024*1024) {
            toast.error('Maks 2MB');
            e.target.value = '';
            return;
        }
        setPicFile(f);
        setPicPreview(URL.createObjectURL(f));
        setRemovePic(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // ✅ FormData ile gönder
            const fd = new FormData();
            fd.append('name', values.name);
            fd.append('surname', values.surname);
            fd.append('email', values.email);
            fd.append('phone_number', values.phone_number);
            fd.append('role', values.role);
            // backend boolean cast: 1/0
            fd.append('status', values.status === 'active' ? '1' : '0');

            if (removePic) fd.append('remove_pic', '1');
            if (picFile) fd.append('pic', picFile);

            await updateUser(fd, id);
            toast.success('Kullanıcı başarıyla güncellendi');
            navigate(ROUTES.UI.USERS);
        } catch (error) {
            console.error('Kullanıcı güncellenirken hata oluştu:', error);
            toast.error('Kullanıcı güncellenemedi');
        } finally {
            setSubmitting(false);
        }
    };

    // Loading durumunu göster
    if (loading && !user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-fsh-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    // Hata durumunu göster
    if (error) {
        return (
            <div className="alert alert-danger">
                Hata: {error}
            </div>
        );
    }

    // Kare foto alanı stili
    const boxStyle = {
        width: 160,
        height: 160,
        border: '2px dashed #cfd3d7',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
    };
    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 6
    };

    return (
        <Content>
            <div className="d-flex flex-column gap-7 gap-lg-10">
                <div className="d-flex justify-content-between mb-5">
                    <h2 className="fw-bold">Kullanıcı Düzenle</h2>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(ROUTES.UI.USERS)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Kullanıcılara Dön
                    </button>
                </div>

                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Kullanıcı Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        <Formik
                            enableReinitialize={true}
                            initialValues={initialValues}
                            validationSchema={userEditSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="row mb-6">
                                        {/* ✅ Profil Fotoğrafı (kare alan + değiştir/kaldır) */}
                                        <div className="col-12 mb-4">
                                            <label className="form-label fw-bold">Profil Fotoğrafı</label>
                                            <div className="d-flex align-items-start gap-3">
                                                <div style={boxStyle}>
                                                    {picPreview ? (
                                                        <img src={picPreview} alt="preview" style={imgStyle} />
                                                    ) : (
                                                        <div className="text-center text-muted">
                                                            <div className="mb-1"><i className="bi bi-image" /></div>
                                                            <small>160×160 kare alan</small>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="d-flex flex-column gap-2">
                                                    <button type="button" className="btn btn-sm btn-primary" onClick={openPicker}>
                                                        <i className="bi bi-upload me-2" /> Fotoğraf Değiştir
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light-danger"
                                                        onClick={clearPic}
                                                        disabled={!picPreview && !user?.avatar_url}
                                                    >
                                                        <i className="bi bi-x-circle me-2" /> Kaldır
                                                    </button>
                                                    <input
                                                        ref={fileRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="d-none"
                                                        onChange={handlePicChange}
                                                    />
                                                    <div className="text-muted small">JPG / PNG / WEBP — max 2MB</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Ad</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                placeholder="Ad"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Soyad</label>
                                            <Field
                                                type="text"
                                                name="surname"
                                                className="form-control"
                                                placeholder="Soyad"
                                            />
                                            <ErrorMessage name="surname" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">E-posta</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="E-posta"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Telefon Numarası</label>
                                            <Field
                                                type="text"
                                                name="phone_number"
                                                className="form-control"
                                                placeholder="Telefon Numarası"
                                            />
                                            <ErrorMessage name="phone_number" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Rol</label>
                                            <Field
                                                as="select"
                                                name="role"
                                                className="form-select"
                                            >
                                                <option value="">Rol Seçiniz</option>
                                                <option value="user">Kullanıcı</option>
                                                <option value="admin">Yönetici</option>
                                                <option value="superadmin">Süper Yönetici</option>
                                            </Field>
                                            <ErrorMessage name="role" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Durum</label>
                                            <Field
                                                as="select"
                                                name="status"
                                                className="form-select"
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Pasif</option>
                                            </Field>
                                            <ErrorMessage name="status" component="div" className="text-danger mt-2" />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light me-3"
                                            onClick={() => navigate(ROUTES.UI.USERS)}
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="indicator-progress">
                                                    Lütfen bekleyin...
                                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                </span>
                                            ) : (
                                                'Kaydet'
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </KTCardBody>
                </KTCard>
            </div>
        </Content>
    );
};

const KullaniciDuzenle = () => {
    const intl = useIntl();
    return (
        <>
            <PageTitle breadcrumbs={userEditBreadCrumbs}>
                Kullanıcı Düzenle
            </PageTitle>
            <UserEditPage />
        </>
    );
};

export { KullaniciDuzenle };
export default KullaniciDuzenle;
