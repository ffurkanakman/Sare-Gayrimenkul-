import React, { useEffect } from 'react';
import {Modal, Form, Button, Spinner} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IMaskInput } from 'react-imask';
import useCustomer from '../../../../ServerSide/Hooks/Customer/useCustomer';

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .required('Müşteri adı soyadı zorunludur')
        .min(3, 'Müşteri adı en az 3 karakter olmalıdır'),
    phone_number: Yup.string()
        .required('Telefon numarası zorunludur')
        .matches(/^\(\d{3}\) \d{3} \d{2} \d{2}$/, 'Geçerli bir telefon numarası giriniz'),
    description: Yup.string()
});

const CustomerModal = ({
    showModal,
    handleClose,
    customerId = null,
    onSuccess = () => {}
}) => {
    const {
        loading,
        error,
        createCustomer,
        updateCustomer,
        getCustomerById,
        currentCustomer
    } = useCustomer();

    // Initial values for Formik
    const initialValues = {
        name: '',
        phone_number: '',
        description: ''
    };

    // Load customer data if in edit mode
    useEffect(() => {
        if (customerId && showModal) {
            getCustomerById(customerId);
        }
    }, [customerId, showModal]);

    // Handle form submission
    const onSubmit = async (values, { resetForm }) => {
        let result;

        if (customerId) {
            // Update existing customer
            result = await updateCustomer(customerId, values);
        } else {
            // Create new customer
            result = await createCustomer(values);
        }

        if (result) {
            handleClose();
            onSuccess(result);
        }
    };

    // Get values from currentCustomer if in edit mode
    const getFormValues = () => {
        if (customerId && currentCustomer) {
            // Format the name for display (combine name and surname)
            const fullName = currentCustomer.surname
                ? `${currentCustomer.name} ${currentCustomer.surname}`
                : currentCustomer.name;

            return {
                name: fullName,
                phone_number: currentCustomer.phone_number || '',
                description: currentCustomer.description || ''
            };
        }
        return initialValues;
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {customerId ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && !customerId && (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {(!loading || customerId) && (
                    <Formik
                        initialValues={getFormValues()}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize={true}
                    >
                        {({ handleSubmit, handleChange, values, errors, touched }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Müşteri Adı Soyadı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={touched.name && !!errors.name}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Telefon Numarası</Form.Label>
                                    <div>
                                        <IMaskInput
                                            mask="(000) 000 00 00"
                                            value={values.phone_number}
                                            unmask={false}
                                            onAccept={(value) => {
                                                // Manually trigger handleChange since onAccept is different from onChange
                                                const event = {
                                                    target: {
                                                        name: 'phone_number',
                                                        value: value
                                                    }
                                                };
                                                handleChange(event);
                                            }}
                                            // Add bootstrap styling
                                            className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                                            name="phone_number"
                                            type="text"
                                            placeholder="(___) ___ __ __"
                                            disabled={loading}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" style={{ display: touched.phone && errors.phone ? 'block' : 'none' }}>
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Açıklama</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={touched.description && !!errors.description}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                                        İptal
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={loading}>
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
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            'Kaydet'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CustomerModal;
