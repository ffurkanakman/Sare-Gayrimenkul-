import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody, KTIcon } from '../../Libs/Metronic/_metronic/helpers';
import { Toolbar } from '../../Libs/Metronic/_metronic/layout/components/toolbar/Toolbar';
import { Content } from '../../Libs/Metronic/_metronic/layout/components/Content';
import { useClient } from '../../ServerSide/Hooks/useClient';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const clientsBreadCrumbs = [
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
        isActive: true,
    }
];

const Musteriler = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { clients, fetchClients, deleteClient, loading } = useClient();
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch clients when component mounts
    useEffect(() => {
        fetchClients();
    }, []);

    // Handle client deletion
    const handleDelete = (id) => {
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

    // Filter clients based on search term
    const filteredClients = clients?.filter(client => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            (client.name && client.name.toLowerCase().includes(searchTermLower)) ||
            (client.company_name && client.company_name.toLowerCase().includes(searchTermLower)) ||
            (client.authorized_person && client.authorized_person.toLowerCase().includes(searchTermLower)) ||
            (client.email && client.email.toLowerCase().includes(searchTermLower)) ||
            (client.phone && client.phone.toLowerCase().includes(searchTermLower))
        );
    });

    return (
        <>
            <PageTitle breadcrumbs={clientsBreadCrumbs}>Müşteriler</PageTitle>
            <Content>
                <div className="card">
                    <div className="card-header border-0 pt-6">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                                <input
                                    type="text"
                                    className="form-control form-control-solid w-250px ps-14"
                                    placeholder="Müşteri Ara"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-toolbar">
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate(ROUTES.UI.NEW_CLIENT)}
                                >
                                    <KTIcon iconName='plus' className='fs-2' />
                                    Yeni Müşteri
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body py-4">
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Yükleniyor...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-row-dashed fs-6 gy-5">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th>ID</th>
                                            <th>Firma Adı</th>
                                            <th>Yetkili Kişi</th>
                                            <th>Telefon</th>
                                            <th>E-posta</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 fw-semibold">
                                        {filteredClients && filteredClients.length > 0 ? (
                                            filteredClients.map((client) => (
                                                <tr key={client.id}>
                                                    <td>{client.id}</td>
                                                    <td>{client.company_name || '-'}</td>
                                                    <td>{client.authorized_person || client.name || '-'}</td>
                                                    <td>{client.phone || '-'}</td>
                                                    <td>{client.email || '-'}</td>
                                                    <td>
                                                        <div className='d-flex justify-content-end flex-shrink-0'>
                                                            <button
                                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                                onClick={() => navigate(ROUTES.UI.VIEW_CLIENT.replace(':id', client.id))}
                                                            >
                                                                <KTIcon iconName='eye' className='fs-3' />
                                                            </button>
                                                            <button
                                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                                onClick={() => navigate(ROUTES.UI.EDIT_CLIENT.replace(':id', client.id))}
                                                            >
                                                                <KTIcon iconName='pencil' className='fs-3' />
                                                            </button>
                                                            <button
                                                                className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                                                onClick={() => handleDelete(client.id)}
                                                            >
                                                                <KTIcon iconName='trash' className='fs-3' />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    {searchTerm ? 'Arama kriterlerine uygun müşteri bulunamadı.' : 'Henüz müşteri bulunmamaktadır.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </>
    );
};

export default Musteriler;
