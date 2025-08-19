import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../../Load';
import useAuth from '../Auth/useAuth';

export const useMyCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState({});

    const { user } = useAuth();

    // Fetch my customers with pagination
    const fetchMyCustomers = async (page = 1) => {
        if (!user || !user.id) {
            console.error('User not authenticated or user ID not available');
            setError('Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.');
            return [];
        }

        try {
            setLoading(true);
            setError(null);

            // Add page parameter to the API request
            const response = await apiService.get(`/api/user/${user.id}/customers?page=${page}`);

            // The API returns { data: [...], pagination: {...} }
            let customersArray = [];

            // Handle different response structures
            if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                // Standard API response: { data: [...], pagination: {...} }
                customersArray = response.data.data.data;
                setPaginationData(response.data.data.pagination || {});
            } else if (Array.isArray(response.data.data)) {
                // Direct array response
                customersArray = response.data.data;
                setPaginationData({});
            } else {
                console.error('Unexpected API response format:', response.data);
                setError('Beklenmeyen API yanıt formatı. Lütfen yöneticinize başvurun.');
            }


            console.log('Extracted Customers Array:', customersArray);
            console.log('Pagination Data:', response.data?.pagination);

            setCustomers(customersArray);

            return customersArray;
        } catch (error) {
            console.error('Error fetching my customers:', error);
            const errorMessage = error.response?.data?.message || 'Müşterileriniz yüklenirken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Get customer by ID
    const getCustomerById = async (id) => {
        try {
            setLoading(true);
            setError(null);

            // First try to find the customer in the local state
            if (customers && customers.length > 0) {
                const customer = customers.find(c => c.id === parseInt(id));
                if (customer) {
                    setCurrentCustomer(customer);
                    return customer;
                }
            }

            // If not found locally, fetch from API
            const response = await apiService.get(`/api/customers/${id}`);

            // Extract customer data from response (might be nested in data property)
            const customerData = response.data && response.data.data ? response.data.data : response.data;

            setCurrentCustomer(customerData);
            return customerData;
        } catch (error) {
            console.error('Error fetching customer:', error);
            const errorMessage = error.response?.data?.message || 'Müşteri bilgileri yüklenirken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update customer status using the dedicated endpoint
     *
     * @param {number} id - The ID of the customer to update
     * @param {object} statusData - Object containing the status field (e.g., { status: 'pending' })
     * @returns {object|null} - The updated customer data or null if there was an error
     */
    const updateCustomerStatus = async (id, statusData) => {
        try {
            // Validate input
            if (!id) {
                console.error('Customer ID is required');
                toast.error('Müşteri ID\'si gereklidir');
                return null;
            }

            if (!statusData || !statusData.status) {
                console.error('Status is required');
                toast.error('Durum alanı gereklidir');
                return null;
            }

            setLoading(true);
            setError(null);

            // Use the dedicated status update endpoint
            const response = await apiService.put(`/api/customers/status/${id}`, statusData);

            // Extract customer data from response (might be nested in data property)
            const updatedCustomerData = response.data && response.data.data ? response.data.data : response.data;

            // Update the customers list with the updated customer
            setCustomers(prevCustomers =>
                prevCustomers.map(customer =>
                    customer.id === id ? updatedCustomerData : customer
                )
            );

            // Update currentCustomer if it's the one being updated
            if (currentCustomer && currentCustomer.id === id) {
                setCurrentCustomer(updatedCustomerData);
            }

            toast.success('Müşteri durumu başarıyla güncellendi');
            return updatedCustomerData;
        } catch (error) {
            console.error('Error updating customer status:', error);

            const responseErrors = error.response?.data?.errors;

            if (responseErrors) {
                // Handle validation errors
                Object.values(responseErrors).flat().forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                const errorMessage = error.response?.data?.message || 'Müşteri durumu güncellenirken bir hata oluştu';
                setError(errorMessage);
                toast.error(errorMessage);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if a message was sent to a customer today
     *
     * @param {number} id - The ID of the customer to check
     * @returns {Promise<object|null>} - The message status data or null if there was an error
     */
    const checkMessageStatus = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.get(`/api/customers/message-status/${id}`);

            // Extract data from response (might be nested in data property)
            const statusData = response.data && response.data.data ? response.data.data : response.data;

            return statusData;
        } catch (error) {
            console.error('Error checking message status:', error);
            const errorMessage = error.response?.data?.message || 'Mesaj durumu kontrol edilirken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get a preview of the message to be sent to a customer
     *
     * @param {number} id - The ID of the customer to send a message to
     * @returns {Promise<object|null>} - The message preview data or null if there was an error
     */
    const getMessagePreview = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.post(`/api/customers/message/${id}`, { preview: true });

            // Extract data from response (might be nested in data property)
            const previewData = response.data && response.data.data ? response.data.data : response.data;

            return previewData;
        } catch (error) {
            console.error('Error getting message preview:', error);
            const errorMessage = error.response?.data?.message || 'Mesaj önizlemesi alınırken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Send a message to a customer
     *
     * @param {number} id - The ID of the customer to send a message to
     * @returns {Promise<object|null>} - The result data or null if there was an error
     */
    const sendMessage = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.post(`/api/customers/message/${id}`);

            // Extract data from response (might be nested in data property)
            const resultData = response.data && response.data.data ? response.data.data : response.data;

            // Update the customers list with the updated customer
            if (resultData && resultData.customer) {
                setCustomers(prevCustomers =>
                    prevCustomers.map(customer =>
                        customer.id === id ? resultData.customer : customer
                    )
                );
            }

            toast.success('Mesaj başarıyla gönderildi');
            return resultData;
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = error.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        customers,
        paginationData,
        currentCustomer,
        loading,
        error,
        fetchMyCustomers,
        getCustomerById,
        updateCustomerStatus,
        checkMessageStatus,
        getMessagePreview,
        sendMessage
    };
};

export default useMyCustomer;
