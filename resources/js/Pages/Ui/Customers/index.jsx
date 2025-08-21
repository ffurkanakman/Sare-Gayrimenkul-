import React, {useState, useEffect, useMemo} from 'react';
import {PageTitle} from '../../../Libs/Metronic/_metronic/layout/core';
import {ROUTES} from "../../../Libs/Routes/config.jsx";
import {KTCard, KTCardBody} from "../../../Libs/Metronic/_metronic/helpers/index.js";
import {Link} from "react-router-dom";
import CustomerModal from './Modals/CustomerModal';
import StatusChangeModal from './Modals/StatusChangeModal';
import useCustomer from '../../../ServerSide/Hooks/Customer/useCustomer';
import {Spinner, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import Pagination from '../../../Components/Pagination';

// 👇 sadece bu import eklendi
import useUser from '../../../ServerSide/Hooks/useUser';

const usersBreadCrumbs = [
    {
        title: 'Ana Sayfa',
        path: ROUTES.UI.LANDING,
        isSeparator: false,
        isActive: false,
    }
];

const Content = () => {
    const {
        customers,
        paginationData,
        loading,
        error,
        fetchCustomers,
        deleteCustomer,
        checkMessageStatus,
        getMessagePreview,
        sendMessage
    } = useCustomer();

    // 👇 sadece bu satırlar eklendi (users'ı almak için)
    const { users, setUser: fetchAllUsers } = useUser();
    useEffect(() => {
        fetchAllUsers(); // users tablosunu 1 kez çek
    }, []);
    const usersById = useMemo(() => {
        const map = new Map();
        (users || []).forEach(u => map.set(Number(u.id), u));
        return map;
    }, [users]);

    const [showModal, setShowModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [sentMessages, setSentMessages] = useState({});
    const [sendingMessage, setSendingMessage] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch customers on component mount or when page changes
    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage]);

    // Add safety check to ensure customers is an array
    const customersArray = Array.isArray(customers) ? customers : [];

    // Log customers data for debugging
    useEffect(() => {
        console.log("Customers data:", customers);
        if (!Array.isArray(customers)) {
            console.error("Warning: customers is not an array", customers);
        }
    }, [customers]);

    // Log pagination data for debugging
    useEffect(() => {
        console.log("Pagination data:", paginationData);
    }, [paginationData]);

    // Check message status for all customers when they are loaded
    useEffect(() => {
        if (Array.isArray(customers) && customers.length > 0) {
            const checkAllCustomers = async () => {
                const messageStatuses = {};

                // Check message status for each customer
                for (const customer of customers) {
                    try {
                        const status = await checkMessageStatus(customer.id);
                        if (status && status.sent_today) {
                            messageStatuses[customer.id] = true;
                        }
                    } catch (error) {
                        console.error(`Error checking message status for customer ${customer.id}:`, error);
                    }
                }

                setSentMessages(messageStatuses);
            };

            checkAllCustomers();
        }
    }, [customers]);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle sending a message to a customer
    const handleSendMessage = async (customerId) => {
        // Check if a message was already sent today
        if (sentMessages[customerId]) {
            toast.info('Bu müşteriye bugün zaten bir mesaj gönderilmiş.');
            return;
        }

        try {
            setSendingMessage(true);

            // Get message preview
            const preview = await getMessagePreview(customerId);

            if (!preview || !preview.message) {
                toast.error('Mesaj önizlemesi alınamadı.');
                return;
            }

            // Show confirmation with message preview
            const result = await Swal.fire({
                title: 'Mesaj Gönder',
                html: `
                    <div class="text-start">
                        <p><strong>Müşteri:</strong> ${preview.customer.name}</p>
                        <p><strong>Telefon:</strong> ${preview.customer.phone_number}</p>
                        <p><strong>Durum:</strong> ${preview.customer.status.label}</p>
                        <hr />
                        <p><strong>Mesaj:</strong></p>
                        <div class="alert alert-light-primary p-3">${preview.message}</div>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Gönder',
                cancelButtonText: 'İptal'
            });

            if (result.isConfirmed) {
                // Send the message
                const response = await sendMessage(customerId);

                if (response) {
                    // Update sent messages state
                    setSentMessages(prev => ({
                        ...prev,
                        [customerId]: true
                    }));

                    Swal.fire(
                        'Gönderildi!',
                        'Mesaj başarıyla gönderildi.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Mesaj gönderilirken bir hata oluştu.');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCustomerId(null);
    };

    const handleShow = (customerId = null) => {
        setSelectedCustomerId(customerId);
        setShowModal(true);
    };

    const handleStatusClose = () => {
        setShowStatusModal(false);
        setSelectedCustomerId(null);
    };

    const handleStatusShow = (customerId) => {
        setSelectedCustomerId(customerId);
        setShowStatusModal(true);
    };

    const handleSuccess = () => {
        // Refresh the customers list after successful operation
        fetchCustomers();
    };

    const handleDelete = (customerId) => {
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu müşteriyi silmek istediğinize emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCustomer(customerId).then(success => {
                    if (success) {
                        Swal.fire(
                            'Silindi!',
                            'Müşteri başarıyla silindi.',
                            'success'
                        );
                    }
                });
            }
        });
    };

    return (
        <KTCard className="mb-5 mb-xl-10">
            <div className="card-header border-0 pt-5">
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Müşteri Listesi</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>
                        Toplam {paginationData?.total} müşteri
                     </span>
                </h3>
                <div className='card-toolbar'>
                    <button onClick={() => handleShow()} className='btn btn-sm btn-fsh-primary'>
                        <i className='bi bi-plus-lg me-2'></i>
                        Yeni Müşteri Ekle
                    </button>
                </div>
            </div>

            {/* Customer Modal */}
            <CustomerModal
                showModal={showModal}
                handleClose={handleClose}
                customerId={selectedCustomerId}
                onSuccess={handleSuccess}
            />

            {/* Status Change Modal */}
            <StatusChangeModal
                showModal={showStatusModal}
                handleClose={handleStatusClose}
                customerId={selectedCustomerId}
                onSuccess={handleSuccess}
            />

            <KTCardBody>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {!Array.isArray(customers) && !loading && (
                    <div className="alert alert-warning" role="alert">
                        <strong>Uyarı:</strong> Müşteri verisi beklenmeyen bir formatta. Lütfen sayfayı yenileyin veya yöneticinize başvurun.
                        <div className="mt-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => fetchCustomers()}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Yenile
                            </Button>
                        </div>
                    </div>
                )}

                {loading && customersArray.length === 0 ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="fsh-primary" />
                        <p className="mt-3">Müşteriler yükleniyor...</p>
                    </div>
                ) : customersArray.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="text-muted">Henüz müşteri bulunmamaktadır.</div>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={() => fetchCustomers()}
                        >
                            <i className='bi bi-arrow-clockwise me-2'></i>
                            Yenile
                        </Button>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-50px">Sıra</th>
                                <th className="min-w-120px">Ad - Soyad</th>
                                <th className="min-w-120px">Telefon</th>
                                <th className="min-w-200px">Açıklama</th>
                                <th className="min-w-200px">Yetkili</th>
                                <th className="min-w-200px">Durum</th>
                                <th className="min-w-100px text-end">İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customersArray.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>
                                            <span className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                                {paginationData?.from ? paginationData.from + index : index + 1}
                                            </span>
                                    </td>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <div className='d-flex justify-content-start flex-column'>
                                                    <span className='text-dark fw-bold text-hover-fsh-primary fs-6'>
                                                        {customer.name}
                                                    </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                            <span className='text-dark fw-bold text-hover-fsh-primary d-block fs-6'>
                                                {customer.phone_number}
                                            </span>
                                    </td>
                                    <td>
                                            <span className='text-dark d-block fs-7'>
                                                {customer.description || '-'}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="symbol symbol-50px me-3">
                                                {(() => {
                                                    // 1) API’den gelen manager_info avatarları
                                                    const avatarFromCustomer =
                                                        // customer?.manager_info?.avatar_url ||
                                                        // customer?.manager_info?.profile_photo_url ||
                                                        customer?.manager_info?.pic;

                                                    // 2) users tablosundan fallback (ID ile)
                                                    const managerId =
                                                        // customer?.manager_info?.id ||
                                                        customer?.user_id;
                                                    const managerUser =
                                                        usersById.get(Number(managerId));

                                                    // users tarafında görsel "pic" alanında olabilir
                                                    const avatarFromUsers =
                                                        // managerUser?.avatar_url ||
                                                        // managerUser?.profile_photo_url ||
                                                        managerUser?.pic;

                                                    const avatar =
                                                        avatarFromCustomer ||
                                                        avatarFromUsers ||
                                                        'https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-2.jpg';

                                                    return (
                                                        <img
                                                            src={avatar}
                                                            className="rounded-circle object-fit-cover"
                                                            alt="yetkili"
                                                        />
                                                    );
                                                })()}
                                            </div>

                                            <div className="d-flex justify-content-start flex-column">
                                                {(() => {
                                                    // İsim için de users fallback'ı
                                                    const managerId =
                                                        // customer?.manager_info?.id ||
                                                        customer?.user_id;
                                                    const managerUser =
                                                        usersById.get(Number(managerId));
                                                    const managerName =
                                                        // customer?.manager_info?.name ||
                                                        managerUser?.name ||
                                                        '-';

                                                    return (
                                                        <>
                                                            <span className="text-gray-800 fw-bold text-hover-primary mb-1 fs-6">
                                                                {managerName}
                                                            </span>
                                                            <span className="text-gray-500 fw-semibold d-block fs-7">
                                                                Sare Gayrimenkul
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge py-3 px-4 fs-7 ${customer.status.badge}`}> { customer.status.label }</span>
                                    </td>
                                    <td className='text-end'>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                onClick={() => handleShow(customer.id)}
                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                title='Düzenle'
                                            >
                                                <i className='bi bi-pencil fs-4'></i>
                                            </button>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-message-${customer.id}`}>
                                                        {sentMessages[customer.id]
                                                            ? 'Bu müşteriye bugün mesaj gönderildi'
                                                            : 'Mesaj Gönder'}
                                                    </Tooltip>
                                                }
                                            >
                                                    <span>
                                                        <button
                                                            onClick={() => handleSendMessage(customer.id)}
                                                            className={`btn btn-icon ${sentMessages[customer.id] ? 'btn-light-success' : 'btn-fsh-primary'} btn-sm mx-1`}
                                                            disabled={sendingMessage || sentMessages[customer.id]}
                                                        >
                                                            {sentMessages[customer.id] ? (
                                                                <i className='bi bi-check2-all fs-4'></i>
                                                            ) : sendingMessage ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            ) : (
                                                                <i className='bi bi-envelope-arrow-up fs-4'></i>
                                                            )}
                                                        </button>
                                                    </span>
                                            </OverlayTrigger>
                                            <button
                                                onClick={() => handleStatusShow(customer.id)}
                                                className='btn btn-icon btn-info btn-sm mx-1'
                                                title='Durumu Değiştir'
                                            >
                                                <i className='bi bi-layers fs-4'></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {paginationData && (
                            <Pagination
                                data={Array(paginationData.total).fill({})}
                                currentPage={paginationData.current_page}
                                itemsPerPage={itemsPerPage}
                                paginate={paginate}
                                itemName="müşteri"
                                showInfo={true}
                            />
                        )}
                    </div>
                )}

            </KTCardBody>

        </KTCard>
    )
}

const Customers = () => {
    return (
        <>
            <PageTitle breadcrumbs={usersBreadCrumbs}>
                Müşteriler
            </PageTitle>
            <Content />
        </>
    );
};

export default Customers;

