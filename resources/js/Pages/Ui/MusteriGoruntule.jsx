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
import Swal from 'sweetalert2';

const MusteriGoruntule = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { id } = useParams();
    const { getClient, deleteClient, loading } = useClient();
    const [client, setClient] = useState(null);

    // Create breadcrumbs dynamically with client name
    const clientViewBreadCrumbs = [
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
            title: client ? `${client.company_name || client.name}` : 'Müşteri Detayı',
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

    // Handle client deletion
    const handleDelete = () => {
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClient(id)
                    .then(() => {
                        Swal.fire(
                            'Silindi!',
                            'Müşteri başarıyla silindi.',
                            'success'
                        );
                        // Navigate back to clients list after deletion
                        navigate(ROUTES.UI.CLIENTS);
                    })
                    .catch((error) => {
                        console.error('Müşteri silinirken hata oluştu:', error);
                        Swal.fire(
                            'Hata!',
                            'Müşteri silinirken bir hata oluştu.',
                            'error'
                        );
                    });
            }
        });
    };

    if (loading || !client) {
        return (
            <>
                <PageTitle breadcrumbs={clientViewBreadCrumbs}>Müşteri Detayı</PageTitle>
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
            <PageTitle breadcrumbs={clientViewBreadCrumbs}>Müşteri Detayı</PageTitle>
            <Content>
                <div className="card mb-5 mb-xl-10">
                    <div className="card-header border-0">
                        <div className="card-title m-0">
                            <h3 className="fw-bold m-0">Müşteri Bilgileri</h3>
                        </div>
                        <div className="card-toolbar">
                            <button
                                type="button"
                                className="btn btn-sm btn-light-primary me-2"
                                onClick={() => navigate(ROUTES.UI.EDIT_CLIENT.replace(':id', id))}
                            >
                                <KTIcon iconName='pencil' className='fs-3' />
                                Düzenle
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-light-danger"
                                onClick={handleDelete}
                            >
                                <KTIcon iconName='trash' className='fs-3' />
                                Sil
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-9">
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">Firma Adı</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">{client.company_name || '-'}</span>
                            </div>
                        </div>
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">Yetkili Kişi</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">{client.authorized_person || client.name || '-'}</span>
                            </div>
                        </div>
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">Telefon</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">{client.phone || '-'}</span>
                            </div>
                        </div>
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">E-posta</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">{client.email || '-'}</span>
                            </div>
                        </div>
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">Adres</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">{client.address || '-'}</span>
                            </div>
                        </div>
                        <div className="row mb-7">
                            <label className="col-lg-4 fw-semibold text-muted">Oluşturulma Tarihi</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">
                                    {client.created_at ? new Date(client.created_at).toLocaleString('tr-TR') : '-'}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <label className="col-lg-4 fw-semibold text-muted">Son Güncelleme</label>
                            <div className="col-lg-8">
                                <span className="fw-bold fs-6 text-gray-800">
                                    {client.updated_at ? new Date(client.updated_at).toLocaleString('tr-TR') : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(ROUTES.UI.CLIENTS)}
                    >
                        <KTIcon iconName='arrow-left' className='fs-3 me-2' />
                        Müşteri Listesine Dön
                    </button>
                </div>
            </Content>
        </>
    );
};

export default MusteriGoruntule;
