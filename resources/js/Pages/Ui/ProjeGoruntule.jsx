import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody, KTIcon } from '../../Libs/Metronic/_metronic/helpers';
import { Content } from '../../Libs/Metronic/_metronic/layout/components/Content';
import { useProject } from '../../ServerSide/Hooks/useProject.jsx';
import { toast } from 'react-toastify';

const projectDetailsBreadCrumbs = [
    {
        title: 'Ana Sayfa',
        path: ROUTES.UI.LANDING,
        isSeparator: false,
        isActive: false,
    },
    {
        title: 'Projeler',
        path: ROUTES.UI.PROJECTS,
        isSeparator: false,
        isActive: false,
    },
    {
        title: 'Proje Detayları',
        path: '',
        isSeparator: false,
        isActive: true,
    }
];

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProjectById, loading, error } = useProject();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const projectData = await getProjectById(id);
                if (projectData) {
                    setProject(projectData);
                }
            } catch (error) {
                console.error('Proje yüklenirken hata oluştu:', error);
                toast.error('Proje yüklenemedi');
            }
        };

        loadProject();
    }, [id]);

    // Function to get status badge class based on status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Completed':
            case 'Tamamlandı':
                return 'badge-light-success';
            case 'In Progress':
            case 'Devam Ediyor':
                return 'badge-light-primary';
            case 'Pending':
            case 'Beklemede':
                return 'badge-light-warning';
            default:
                return 'badge-light-info';
        }
    };

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

    // Proje bulunamadı durumunu göster
    if (!project) {
        return (
            <div className="alert alert-warning">
                Proje bulunamadı.
            </div>
        );
    }

    return (
        <Content>
            <div className="d-flex flex-column gap-7 gap-lg-10">
                <div className="d-flex justify-content-between mb-5">
                    <h2 className="fw-bold">Proje Detayları: {project.name}</h2>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(ROUTES.UI.PROJECTS)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Projelere Dön
                    </button>
                </div>

                {/* Proje Genel Bilgileri */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Proje Genel Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        <div className="row mb-7">
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Proje Kodu</div>
                                <div className="fs-5 text-dark">{project.name}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Proje Tipi</div>
                                <div className="fs-5 text-dark">{project.project_type}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Durum</div>
                                <div className="fs-5">
                                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Toplam Ücret</div>
                                <div className="fs-5 text-dark">₺{project.price}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Oluşturulma Tarihi</div>
                                <div className="fs-5 text-dark">{project.created_at}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Son Güncelleme</div>
                                <div className="fs-5 text-dark">{project.updated_at}</div>
                            </div>
                        </div>
                    </KTCardBody>
                </KTCard>

                {/* Müşteri Bilgileri */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Müşteri Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        {project.client ? (
                            <div className="row mb-7">
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">Firma Adı</div>
                                    <div className="fs-5 text-dark">{project.client.company_name}</div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">Yetkili Adı Soyadı</div>
                                    <div className="fs-5 text-dark">{project.client.authorized_person}</div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">Telefon</div>
                                    <div className="fs-5 text-dark">{project.client.phone || 'Belirtilmedi'}</div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">E-posta</div>
                                    <div className="fs-5 text-dark">{project.client.email || 'Belirtilmedi'}</div>
                                </div>
                                <div className="col-lg-8 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">Adres</div>
                                    <div className="fs-5 text-dark">{project.client.address || 'Belirtilmedi'}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0">
                                Bu proje için müşteri bilgisi bulunamadı.
                            </div>
                        )}
                    </KTCardBody>
                </KTCard>

                {/* Araç Bilgileri */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Araç Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        {project.vehicle_information ? (
                            <div>
                                <div className="row mb-7">
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Marka</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.brand}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Model</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.model}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Seri No</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.serial_number || 'Belirtilmedi'}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Şasi No</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.chassis_number || 'Belirtilmedi'}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Saat</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.hours || 'Belirtilmedi'}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="fw-bold text-gray-600 mb-1">Model Yılı</div>
                                        <div className="fs-5 text-dark">{project.vehicle_information.model_year || 'Belirtilmedi'}</div>
                                    </div>
                                </div>

                                {/* Araç Fotoğrafları */}
                                {project.vehicle_information.photos && project.vehicle_information.photos.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="fw-bold mb-3">Araç Fotoğrafları</h4>
                                        <div className="d-flex flex-wrap gap-5">
                                            {project.vehicle_information.photos.map((photo, index) => (
                                                <div key={index} className="position-relative">
                                                    <img
                                                        src={`/storage/${photo}`}
                                                        alt={`Araç fotoğrafı ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0">
                                Bu proje için araç bilgisi bulunamadı.
                            </div>
                        )}
                    </KTCardBody>
                </KTCard>

                {/* Servis Bilgileri */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Servis Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        <div className="row mb-7">
                            <div className="col-12 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Yapılacak İşlemler</div>
                                <div className="fs-5 text-dark">{project.notes || 'Belirtilmedi'}</div>
                            </div>
                            <div className="col-12 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Yapılan İşlemler</div>
                                <div className="fs-5 text-dark">{project.done_jobs || 'Belirtilmedi'}</div>
                            </div>
                            <div className="col-12 mb-4">
                                <div className="fw-bold text-gray-600 mb-1">Açıklama</div>
                                <div className="fs-5 text-dark">{project.description || 'Belirtilmedi'}</div>
                            </div>
                        </div>
                    </KTCardBody>
                </KTCard>

                {/* Parça Bilgileri */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Parça Bilgileri</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        {project.parts && project.parts.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                                    <thead>
                                        <tr className="fw-bold text-muted">
                                            <th className="min-w-150px">Parça Adı</th>
                                            <th className="min-w-100px">Adet</th>
                                            <th className="min-w-100px">Birim Fiyat</th>
                                            <th className="min-w-100px">Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.parts.map((part, index) => (
                                            <tr key={index}>
                                                <td>{part.name}</td>
                                                <td>{part.quantity}</td>
                                                <td>₺{part.unit_price}</td>
                                                <td>₺{part.total_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0">
                                Bu proje için parça bilgisi bulunamadı.
                            </div>
                        )}
                    </KTCardBody>
                </KTCard>

                {/* Satış Yetkilisi */}
                <KTCard className="mb-5 mb-xl-10">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Satış Yetkilisi</span>
                        </h3>
                    </div>
                    <KTCardBody className="py-3">
                        {project.sales_person ? (
                            <div className="row mb-7">
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="fw-bold text-gray-600 mb-1">Adı Soyadı</div>
                                    <div className="fs-5 text-dark">{project.sales_person.name}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0">
                                Bu proje için satış yetkilisi bilgisi bulunamadı.
                            </div>
                        )}
                    </KTCardBody>
                </KTCard>
            </div>
        </Content>
    );
};

const ProjeGoruntule = () => {
    const intl = useIntl();
    return (
        <>
            <PageTitle breadcrumbs={projectDetailsBreadCrumbs}>
                Proje Detayları
            </PageTitle>
            <ProjectDetailsPage />
        </>
    );
};

export { ProjeGoruntule };
export default ProjeGoruntule;
