import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody, KTIcon } from '../../Libs/Metronic/_metronic/helpers';
import { Content } from '../../Libs/Metronic/_metronic/layout/components/Content';
import { useUser } from '../../ServerSide/Hooks/useUser.jsx';
import { toast } from 'react-toastify';

const userDetailsBreadCrumbs = [
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
        title: 'Kullanıcı Detayları',
        path: '',
        isSeparator: false,
        isActive: true,
    }
];

const UserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getUserById, loading, error } = useUser();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUserById(id);
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Kullanıcı yüklenirken hata oluştu:', error);
                toast.error('Kullanıcı yüklenemedi');
            }
        };

        loadUser();
    }, [id]);

    // Loading durumunu göster
    if (loading) {
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

    // Kullanıcı bulunamadı durumunu göster
    if (!user) {
        return (
            <div className="alert alert-warning">
                Kullanıcı bulunamadı.
            </div>
        );
    }

    // Fotoğraf kutusu stili
    const boxStyle = {
        width: 120,
        height: 120,
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
                    <h2 className="fw-bold">Kullanıcı Detayları</h2>
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
                        <div className="row mb-7">
                            {/* ✅ Profil Fotoğrafı */}
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Profil Fotoğrafı</div>
                                <div style={boxStyle}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="avatar" style={imgStyle} />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <div className="mb-1"><i className="bi bi-image" /></div>
                                            <small>Fotoğraf yok</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">ID</div>
                                <div className="fs-5 text-dark">{user.id}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Ad</div>
                                <div className="fs-5 text-dark">{user.name}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Soyad</div>
                                <div className="fs-5 text-dark">{user.surname}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">E-posta</div>
                                <div className="fs-5 text-dark">{user.email}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Telefon Numarası</div>
                                <div className="fs-5 text-dark">{user.phone_number}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Rol</div>
                                <div className="fs-5 text-dark">{user.role || 'Kullanıcı'}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Durum</div>
                                <div className="fs-5">
                                    <span className={`badge ${user.status === 'active' ? 'badge-light-success' : 'badge-light-danger'}`}>
                                        {user.status === 'active' ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Oluşturulma Tarihi</div>
                                <div className="fs-5 text-dark">{user.created_at}</div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/KullaniciDuzenle/${user.id}`)}
                            >
                                <i className="bi bi-pencil me-2"></i>
                                Düzenle
                            </button>
                        </div>
                    </KTCardBody>
                </KTCard>
            </div>
        </Content>
    );
};

const KullaniciGoruntule = () => {
    const intl = useIntl();
    return (
        <>
            <PageTitle breadcrumbs={userDetailsBreadCrumbs}>
                Kullanıcı Detayları
            </PageTitle>
            <UserDetailsPage />
        </>
    );
};

export { KullaniciGoruntule };
export default KullaniciGoruntule;
