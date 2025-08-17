import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import useCustomer from '../../../../ServerSide/Hooks/Customer/useCustomer';
import { apiService } from '../../../../ServerSide/Load';
import { toast } from 'react-toastify';

const StatusChangeModal = ({
    showModal,
    handleClose,
    customerId,
    onSuccess = () => {}
}) => {
    const {
        loading,
        error,
        updateCustomerStatus,
        getCustomerById,
        currentCustomer
    } = useCustomer();

    const [selectedStatus, setSelectedStatus] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [statusError, setStatusError] = useState(null);

    // Load customer data and available statuses when modal opens
    useEffect(() => {
        if (customerId && showModal) {
            getCustomerById(customerId);

            // Fetch statuses from the backend
            apiService.get('/api/customers/statuses')
                .then(response => {
                    // Extract data from response (might be nested in data property)
                    const data = response.data && response.data.data ? response.data.data : response.data;
                    setStatuses(data);
                    if (currentCustomer?.status?.value) {
                        setSelectedStatus(currentCustomer.status.value);
                    }
                })
                .catch(error => {
                    console.error('Error fetching statuses:', error);
                    const errorMessage = error.response?.data?.message || 'Durum listesi yüklenirken bir hata oluştu';
                    setStatusError(errorMessage);
                });
        }
    }, [customerId, showModal]);

    // Update selectedStatus when currentCustomer changes
    useEffect(() => {
        if (currentCustomer?.status?.value) {
            setSelectedStatus(currentCustomer.status.value);
        }
    }, [currentCustomer]);

    // Reset error state when modal is closed
    useEffect(() => {
        if (!showModal) {
            setStatusError(null);
        }
    }, [showModal]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStatus) {
            setStatusError('Lütfen bir durum seçiniz');
            return;
        }

        try {
            setStatusError(null);
            // Use the dedicated status update method
            const result = await updateCustomerStatus(customerId, { status: selectedStatus });

            if (result) {
                // Find the label for the selected status
                const statusLabel = statuses[selectedStatus]?.label || selectedStatus;
                toast.success(`Müşteri durumu "${statusLabel}" olarak güncellendi`);
                handleClose();
                onSuccess(result);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            const errorMessage = error.response?.data?.message || 'Durum güncellenirken bir hata oluştu';
            setStatusError(errorMessage);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Durumu Değiştir
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && !currentCustomer && (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {statusError && (
                    <div className="alert alert-danger" role="alert">
                        {statusError}
                    </div>
                )}

                {currentCustomer && (
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <h5 className="mb-2">Müşteri: {currentCustomer.name}</h5>
                            <p className="text-muted mb-0">
                                Mevcut Durum:
                                <span className={`badge ms-2 py-2 px-3 ${currentCustomer.status?.badge}`}>
                                    {currentCustomer.status?.label}
                                </span>
                            </p>
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label>Yeni Durum</Form.Label>
                            <Form.Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Durum Seçiniz</option>
                                {Object.entries(statuses).map(([value, status]) => (
                                    <option key={value} value={value}>
                                        {status.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose} disabled={loading}>
                                İptal
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading || !selectedStatus || selectedStatus === currentCustomer.status?.value}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Güncelleniyor...
                                    </>
                                ) : (
                                    'Durumu Güncelle'
                                )}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default StatusChangeModal;
