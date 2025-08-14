import axios from 'axios';

// CSRF token requirement removed as per requirement
// Using Laravel Sanctum for API authentication instead

const api = axios.create({
    baseURL: import.meta.env.VITE_LOCAL_API_URL, // .env -> VITE_LOCAL_API_URL=http://127.0.0.1:8000
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },

});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to check if an object contains File objects
const containsFileObjects = (obj) => {
    if (!obj) return false;

    // Check if it's a File object
    if (obj instanceof File) return true;

    // Check if it's an array containing File objects
    if (Array.isArray(obj)) {
        return obj.some(item => containsFileObjects(item));
    }

    // Check if it's an object with properties that might be File objects
    if (typeof obj === 'object') {
        return Object.values(obj).some(value => containsFileObjects(value));
    }

    return false;
};

// Helper function to convert data to FormData if it contains File objects
const convertToFormData = (data) => {
    if (!containsFileObjects(data)) return data;

    console.log('Converting data to FormData for file upload');

    const formData = new FormData();

    // Recursively add data to FormData
    const appendToFormData = (obj, prefix = '') => {
        if (!obj) return;

        if (obj instanceof File) {
            formData.append(prefix, obj);
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`${prefix}[${index}]`, item);
                } else if (typeof item === 'object' && item !== null) {
                    appendToFormData(item, `${prefix}[${index}]`);
                } else {
                    formData.append(`${prefix}[${index}]`, item);
                }
            });
            return;
        }

        if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                const newPrefix = prefix ? `${prefix}[${key}]` : key;

                if (value instanceof File) {
                    formData.append(newPrefix, value);
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (item instanceof File) {
                            formData.append(`${newPrefix}[${index}]`, item);
                        } else if (typeof item === 'object' && item !== null) {
                            appendToFormData(item, `${newPrefix}[${index}]`);
                        } else {
                            formData.append(`${newPrefix}[${index}]`, item);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    appendToFormData(value, newPrefix);
                } else {
                    formData.append(newPrefix, value);
                }
            });
        }
    };

    appendToFormData(data);
    return formData;
};

export const apiService = {
    get: api.get,
    post: (url, data, config = {}) => {
        const hasFiles = containsFileObjects(data);
        if (hasFiles) {
            const formData = convertToFormData(data);
            // Remove Content-Type header to let the browser set it with the boundary
            const formDataConfig = {
                ...config,
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                }
            };
            console.log('Sending form data with files');
            return api.post(url, formData, formDataConfig);
        }
        return api.post(url, data, config);
    },
    put: (url, data, config = {}) => {
        const hasFiles = containsFileObjects(data);
        if (hasFiles) {
            const formData = convertToFormData(data);
            // Remove Content-Type header to let the browser set it with the boundary
            const formDataConfig = {
                ...config,
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                }
            };
            console.log('Sending form data with files');
            return api.put(url, formData, formDataConfig);
        }
        return api.put(url, data, config);
    },
    delete: api.delete,
    patch: api.patch,
};
