import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Content } from '../../../Libs/Metronic/_metronic/layout/components/Content';
import { KTCard, KTCardBody } from '../../../Libs/Metronic/_metronic/helpers';
import { useUser } from '../../../ServerSide/Hooks/useUser';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const accountSchema = Yup.object().shape({
    name: Yup.string().required('Ad alanı zorunludur'),
    surname: Yup.string().required('Soyad alanı zorunludur'),
    email: Yup.string().email('Geçerli bir e-posta giriniz').required('E-posta alanı zorunludur'),
    phone_number: Yup.string().required('Telefon numarası zorunludur'),
});

const AccountSettings = () => {
    // 🔹 auth'tan giriş yapan kullanıcıyı al
    const authUser = useSelector((state) => state.auth.user);

    // 🔹 user hook
    const { currentUser, getUserById, updateUser, loading } = useUser();

    const [initialValues, setInitialValues] = useState({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
    });

    const [picFile, setPicFile] = useState(null);
    const [picPreview, setPicPreview] = useState(null);
    const [removePic, setRemovePic] = useState(false);
    const fileRef = useRef(null);

    // 🔹 Sayfa açılınca / auth.id değişince kendi profilini çek
    useEffect(() => {
        (async () => {
            try {
                if (authUser?.id) {
                    await getUserById(authUser.id); // Redux'ta currentUser set edilir
                }
            } catch (e) {
                console.error(e);
                toast.error('Hesap bilgileri yüklenemedi');
            }
        })();
    }, [authUser?.id]);

    // 🔹 currentUser güncellenince formu doldur
    useEffect(() => {
        if (currentUser) {
            setInitialValues({
                name: currentUser.name || '',
                surname: currentUser.surname || '',
                email: currentUser.email || '',
                phone_number: currentUser.phone_number || '',
            });
            setPicPreview(currentUser.avatar_url || null);
            setRemovePic(false);
            setPicFile(null);
        }
    }, [currentUser]);

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
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
            toast.error('Sadece JPG/PNG/WEBP yükleyin');
            e.target.value = '';
            return;
        }
        if (f.size > 2 * 1024 * 1024) {
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
            const fd = new FormData();
            fd.append('name', values.name);
            fd.append('surname', values.surname);
            fd.append('email', values.email);
            fd.append('phone_number', values.phone_number);

            if (removePic) fd.append('remove_pic', '1');
            if (picFile) fd.append('pic', picFile);

            const idToUpdate = currentUser?.id || authUser?.id; // güvence
            await updateUser(fd, idToUpdate);
            toast.success('Hesap bilgileri güncellendi');
        } catch (err) {
            console.error(err);
            toast.error('Bilgiler güncellenemedi');
        } finally {
            setSubmitting(false);
        }
    };

    const boxStyle = {
        width: 160,
        height: 160,
        border: '2px dashed #cfd3d7',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
    };
    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 6,
    };

    // 🔹 İlk yüklemede basit bir loading durumu göster (opsiyonel)
    if (loading && !currentUser) {
        return (
            <Content>
                <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </Content>
        );
    }

    return (
        <Content>
            <div className="d-flex flex-column gap-7 gap-lg-10">
                <h2 className="fw-bold">Hesap Ayarları</h2>

                <KTCard className="mb-5 mb-xl-10">
                    <KTCardBody className="py-3">
                        <Formik
                            enableReinitialize={true}
                            initialValues={initialValues}
                            validationSchema={accountSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="row mb-6">
                                        <div className="col-12 mb-4">
                                            <label className="form-label fw-bold">Profil Fotoğrafı</label>
                                            <div className="d-flex align-items-start gap-3">
                                                <div style={boxStyle}>
                                                    {picPreview ? (
                                                        <img src={picPreview} alt="preview" style={imgStyle} />
                                                    ) : (
                                                        <div className="text-center text-muted">
                                                            <div className="mb-1">
                                                                <i className="bi bi-image" />
                                                            </div>
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
                                                        disabled={!picPreview && !currentUser?.avatar_url}
                                                    >
                                                        <i className="bi bi-x-circle me-2" /> Kaldır
                                                    </button>
                                                    <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handlePicChange} />
                                                    <div className="text-muted small">JPG / PNG / WEBP — max 2MB</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Ad</label>
                                            <Field type="text" name="name" className="form-control" placeholder="Ad" />
                                            <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Soyad</label>
                                            <Field type="text" name="surname" className="form-control" placeholder="Soyad" />
                                            <ErrorMessage name="surname" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">E-posta</label>
                                            <Field type="email" name="email" className="form-control" placeholder="E-posta" />
                                            <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-bold required">Telefon Numarası</label>
                                            <Field type="text" name="phone_number" className="form-control" placeholder="Telefon Numarası" />
                                            <ErrorMessage name="phone_number" component="div" className="text-danger mt-2" />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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

export default AccountSettings;
