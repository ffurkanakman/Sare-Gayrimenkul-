import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../../Load';

export const useCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState({});

    // Fetch customers with pagination
    const fetchCustomers = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            // Add page parameter to the API request
            const response = await apiService.get(`/api/customers?page=${page}`);

            // Check if response.data has a data property (API might return {status, message, data} structure)
            const customersArray = Array.isArray(response.data)
                ? response.data
                : (response.data && Array.isArray(response.data.data))
                    ? response.data.data
                    : [];


            setCustomers(customersArray);
            setPaginationData(response.data?.pagination);
            console.log('Pagination Data:', paginationData);
            return customersArray;
        } catch (error) {
            console.error('Error fetching customers:', error);
            const errorMessage = error.response?.data?.message || 'Müşteriler yüklenirken bir hata oluştu';
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

    // Create a new customer
    const createCustomer = async (customerData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.post('/api/customers', customerData);

            // Extract customer data from response (might be nested in data property)
            const newCustomerData = response.data && response.data.data ? response.data.data : response.data;

            // Update the customers list with the new customer
            setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);

            toast.success('Müşteri başarıyla eklendi');
            return newCustomerData;
        } catch (error) {
            console.error('Error creating customer:', error);

            const responseErrors = error.response?.data?.errors;

            if (responseErrors) {
                // Handle validation errors
                Object.values(responseErrors).flat().forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                const errorMessage = error.response?.data?.message || 'Müşteri eklenirken bir hata oluştu';
                setError(errorMessage);
                toast.error(errorMessage);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing customer
    const updateCustomer = async (id, customerData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.put(`/api/customers/${id}`, customerData);

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

            toast.success('Müşteri bilgileri başarıyla güncellendi');
            return updatedCustomerData;
        } catch (error) {
            console.error('Error updating customer:', error);

            const responseErrors = error.response?.data?.errors;

            if (responseErrors) {
                // Handle validation errors
                Object.values(responseErrors).flat().forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                const errorMessage = error.response?.data?.message || 'Müşteri güncellenirken bir hata oluştu';
                setError(errorMessage);
                toast.error(errorMessage);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete a customer
    const deleteCustomer = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await apiService.delete(`/api/customers/${id}`);

            // Remove the deleted customer from the customers list
            setCustomers(prevCustomers =>
                prevCustomers.filter(customer => customer.id !== id)
            );

            // Clear currentCustomer if it's the one being deleted
            if (currentCustomer && currentCustomer.id === id) {
                setCurrentCustomer(null);
            }

            toast.success('Müşteri başarıyla silindi');
            return true;
        } catch (error) {
            console.error('Error deleting customer:', error);
            const errorMessage = error.response?.data?.message || 'Müşteri silinirken bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update customer status using the dedicated endpoint
     * This method uses a special endpoint that bypasses the validation in CustomersRequest
     * It should only be used for status updates, not for general customer updates
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
        fetchCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        updateCustomerStatus,
        deleteCustomer,
        checkMessageStatus,
        getMessagePreview,
        sendMessage
    };
};

export default useCustomer;
