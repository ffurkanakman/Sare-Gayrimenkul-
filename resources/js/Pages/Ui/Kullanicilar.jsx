import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../Libs/Metronic/_metronic/layout/core';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { KTCard, KTCardBody } from '../../Libs/Metronic/_metronic/helpers';
import { Link } from 'react-router-dom';
import { useUser } from '../../ServerSide/Hooks/useUser.jsx';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const usersBreadCrumbs = [
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
        isActive: true,
    }
];

const UsersPage = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // useUser hook'unu kullan
    const { users, loading, error, setUser, updateUser, deleteUser } = useUser();

    // Component mount olduğunda users getir
    useEffect(() => {
        setUser();
    }, []);

    // Get current users
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // <-- düzeltildi
    const currentUsers = users ? users.slice(indexOfFirstItem, indexOfLastItem) : [];

    console.log("gelen users: ", users);
    console.log("su anki sayfadaki veriler: ", currentUsers);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    // Calculate total pages
    const totalPages = users ? Math.ceil(users.length / itemsPerPage) : 0;

    // --- ROL ETİKETİ ÇEVİRİSİ ---
    const getRoleLabel = (r) => {
        if (!r) return 'Kullanıcı';
        switch (String(r).toLowerCase()) {
            case 'admin': return 'Yönetici';
            case 'user':  return 'Satış Temsilcisi';
            default:      return r;
        }
    };

    // --- SİLME: Tek modal, onayda direkt sil ---
    const handleDelete = async (id) => {
        const wasLastOnPage = currentUsers.length === 1 && currentPage > 1;

        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: 'Bu kullanıcı kalıcı olarak silinecek.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil',
            cancelButtonText: 'Vazgeç',
            reverseButtons: true,
            confirmButtonColor: '#d33',
            showLoaderOnConfirm: true,                 // 🔹 butonda loader
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {                  // 🔹 onaylanınca direkt sil
                try {
                    await deleteUser(id);
                    await setUser();                   // listeyi yenile
                } catch (e) {
                    Swal.showValidationMessage(
                        e?.response?.data?.message || e?.message || 'Silinemedi'
                    );
                }
            },
        });

        if (result.isConfirmed) {
            if (wasLastOnPage) setCurrentPage((p) => p - 1);
            await Swal.fire({
                icon: 'success',
                title: 'Silindi',
                timer: 1200,
                showConfirmButton: false
            });
        }
    };
    // --- SİLME son ---

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

    return (
        <>
            <KTCard className='mb-5 mb-xl-8'>
                <div className='card-header border-0 pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                        <span className='card-label fw-bold fs-3 mb-1'>Kullanıcı Listesi</span>
                        <span className='text-muted mt-1 fw-semibold fs-7'>
              Toplam {users ? users.length : 0} kullanıcı
            </span>
                    </h3>
                    <div className='card-toolbar'>
                        <Link to={ROUTES.UI.NEW_USER} className='btn btn-sm btn-primary'>
                            <i className='bi bi-plus-lg me-2'></i>
                            Yeni Kullanıcı Ekle
                        </Link>
                    </div>
                </div>
                <KTCardBody className='py-3'>
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-50px">ID</th>
                                <th className="min-w-120px">Ad</th>
                                <th className="min-w-120px">Soyad</th>
                                <th className="min-w-140px">E-posta</th>
                                <th className="min-w-120px">Telefon</th>
                                <th className="min-w-120px">Rol</th>
                                <th className="min-w-120px">Durum</th>
                                <th className="min-w-100px text-end">İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentUsers && currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                      <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {user.id}
                      </span>
                                    </td>

                                    {/* ✅ Ad sütunu: avatar + ad */}
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <div className='symbol symbol-40px me-3'>
                                                <img
                                                    src={user.avatar_url || '/placeholder-avatar.png'}
                                                    alt={user.name}
                                                    style={{ width: 40, height: 40, borderRadius: '999px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-6'>
                            {user.name}
                          </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                      <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {user.surname}
                      </span>
                                    </td>
                                    <td>
                      <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {user.email}
                      </span>
                                    </td>
                                    <td>
                      <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {user.phone_number}
                      </span>
                                    </td>
                                    <td>
                      <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {getRoleLabel(user.role)}
                      </span>
                                    </td>
                                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-light-success' : 'badge-light-danger'}`}>
                        {user.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                                    </td>
                                    <td className='text-end'>
                                        <div className="d-flex justify-content-end">
                                            <Link
                                                to={`/KullaniciGoruntule/${user.id}`}
                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                            >
                                                <i className='bi bi-eye fs-4'></i>
                                            </Link>
                                            <Link
                                                to={`/KullaniciDuzenle/${user.id}`}
                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                            >
                                                <i className='bi bi-pencil fs-4'></i>
                                            </Link>
                                            {/* Sil butonu */}
                                            <button
                                                type='button'
                                                onClick={() => handleDelete(user.id)}
                                                className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                                title='Sil'
                                            >
                                                <i className='bi bi-trash fs-4'></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {users && users.length > 0 && (
                        <div className='d-flex flex-stack flex-wrap pt-10'>
                            <div className='fs-6 fw-bold text-gray-700'>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} entries
                            </div>

                            <ul className='pagination'>
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : 'previous'}`}>
                                    <a
                                        href='#'
                                        className='page-link'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) paginate(currentPage - 1);
                                        }}
                                    >
                                        <i className='previous'></i>
                                    </a>
                                </li>

                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <a
                                            href='#'
                                            className='page-link'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                paginate(index + 1);
                                            }}
                                        >
                                            {index + 1}
                                        </a>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : 'next'}`}>
                                    <a
                                        href='#'
                                        className='page-link'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) paginate(currentPage + 1);
                                        }}
                                    >
                                        <i className='next'></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </KTCardBody>
            </KTCard>
        </>
    );
};

const Kullanicilar = () => {
    const intl = useIntl();
    return (
        <>
            <PageTitle breadcrumbs={usersBreadCrumbs}>
                Kullanıcılar
            </PageTitle>
            <UsersPage />
        </>
    );
};

export { Kullanicilar };
export default Kullanicilar;
