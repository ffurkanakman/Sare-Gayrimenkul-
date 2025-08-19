import React, {useState, useEffect} from 'react';
import {PageTitle} from '../../../Libs/Metronic/_metronic/layout/core';
import {ROUTES} from "../../../Libs/Routes/config";
import {KTCard, KTCardBody} from "@/Libs/Metronic/_metronic/helpers/index.js";
import useMyCustomer from '../../../ServerSide/Hooks/Customer/useMyCustomer';
import {Spinner, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import Pagination from '../../../Components/Pagination';
import StatusChangeModal from './Modals/StatusChangeModal';

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
        fetchMyCustomers,
        checkMessageStatus,
        getMessagePreview,
        sendMessage
    } = useMyCustomer();

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [sentMessages, setSentMessages] = useState({});
    const [sendingMessage, setSendingMessage] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch my customers on component mount or when page changes
    useEffect(() => {
        fetchMyCustomers(currentPage);
    }, [currentPage]);

    // Check message status for all customers when they are loaded
    useEffect(() => {
        if (Array.isArray(customers) && customers.length > 0) {
            const checkAllCustomers = async () => {
                const messageStatuses = {};

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
        fetchMyCustomers();
    };

    // Call customer directly
    const handleCallCustomer = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    return (
        <KTCard className="mb-5 mb-xl-10">
            <div className="card-header border-0 pt-5">
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Müşterilerim</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>
                        Toplam {paginationData?.total || customers.length} müşteri
                    </span>
                </h3>
            </div>

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
                                onClick={() => fetchMyCustomers()}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Yenile
                            </Button>
                        </div>
                    </div>
                )}

                {loading && customers.length === 0 ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="fsh-primary" />
                        <p className="mt-3">Müşteriler yükleniyor...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="text-muted">Henüz müşteriniz bulunmamaktadır.</div>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={() => fetchMyCustomers()}
                        >
                            <i className='bi bi-arrow-clockwise me-2'></i>
                            Yenile
                        </Button>
                    </div>
                ) : (
                    <div className="row g-6 g-xl-9">
                        {customers.map((customer) => (
                            <div className="col-md-6 col-xxl-4" key={customer.id}>
                                <div className="card">
                                    <div className="card-body d-flex flex-column py-9 px-5">
                                        <div className="fs-4 text-gray-800 fw-bold mb-0">{customer.name}</div>
                                        <div className="fw-semibold text-gray-500 mb-6">{customer.description || '-'}</div>

                                        <div className="d-flex flex-wrap mb-5">
                                            <div className="border border-dashed rounded min-w-90px py-3 px-4 mx-2 mb-3">
                                                <div className="fs-6 fw-semibold text-gray-500">Telefon</div>
                                                <div className="fs-6 fw-bold text-gray-700">{customer.phone_number}</div>
                                            </div>
                                            <div className="border border-dashed rounded min-w-90px py-3 px-4 mx-2 mb-3">
                                                <div className="fs-6 fw-semibold text-gray-500">Durum</div>
                                                <div className="fs-6 fw-bold">
                                                    <span className={`badge py-2 px-3 ${customer.status.badge}`}>
                                                        {customer.status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-stack mt-auto">
                                            <button
                                                className="btn btn-sm btn-light-primary btn-flex btn-center me-2"
                                                onClick={() => handleCallCustomer(customer.phone_number)}
                                            >
                                                <i className="bi bi-telephone-fill fs-4 me-2"></i>
                                                <span className="indicator-label">Hemen Ara</span>
                                            </button>

                                            <button
                                                className="btn btn-sm btn-light-info btn-flex btn-center me-2"
                                                onClick={() => handleStatusShow(customer.id)}
                                            >
                                                <i className="bi bi-layers fs-4 me-2"></i>
                                                <span className="indicator-label">Durum Değiştir</span>
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
                                                <button
                                                    className={`btn btn-sm ${sentMessages[customer.id] ? 'btn-light-success' : 'btn-fsh-primary'} btn-flex btn-center`}
                                                    onClick={() => handleSendMessage(customer.id)}
                                                    disabled={sendingMessage || sentMessages[customer.id]}
                                                >
                                                    {sentMessages[customer.id] ? (
                                                        <>
                                                            <i className='bi bi-check2-all fs-4 me-2'></i>
                                                            <span className="indicator-label">Gönderildi</span>
                                                        </>
                                                    ) : sendingMessage ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            <span className="indicator-label">Gönderiliyor</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className='bi bi-envelope-arrow-up fs-4 me-2'></i>
                                                            <span className="indicator-label">Mesaj Gönder</span>
                                                        </>
                                                    )}
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {customers.length > 0 && paginationData && (
                    <div className="mt-6">
                        <Pagination
                            data={Array(paginationData.total).fill({})}
                            currentPage={paginationData.current_page}
                            itemsPerPage={itemsPerPage}
                            paginate={paginate}
                            itemName="müşteri"
                            showInfo={true}
                        />
                    </div>
                )}
            </KTCardBody>
        </KTCard>
    );
};

const MyCustomers = () => {
    return (
        <>
            <PageTitle breadcrumbs={usersBreadCrumbs}>
                Müşterilerim
            </PageTitle>
            <Content />
        </>
    );
};

export default MyCustomers;
