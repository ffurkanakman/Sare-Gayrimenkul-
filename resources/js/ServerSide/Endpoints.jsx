export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_LOCAL_API_URL,
    HEADERS: {
        Accept: 'application/json',
    },
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/v1/Giris',
            REGISTER: '/api/v1/KayitOl', // Try a different API endpoint structure
        },
        PROJECTS: {
            PROJECTS: '/api/projects',
            SAVE_PROJECT: '/api/projects'
        },
        CLIENT: {
            CLIENTS: '/api/client',
            CLIENT: '/api/client'
        },
        USER: {
            USER: '/api/user',
            USER_UPDATE: '/api/user'
        },
        BRAND: {
            BRAND: 'api/vehicle-brands',
        },
        VEHICLE: {
            VEHICLE: 'api/vehicle',
        },
        SALES_OFFER: {
            SALES_OFFER: 'api/salesoffer',
        },
        PROFORMA_INVOICE: {
            PROFORMA_INVOICE: 'api/proformainvoices',
        },
        PROJECT_PARTS: {
            PROJECT_PARTS: 'api/projects/parts',
        }
    }
};
