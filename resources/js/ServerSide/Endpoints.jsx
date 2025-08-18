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
        USER: {
            USER: '/api/user',
            USER_UPDATE: '/api/user'
        },

    }
};
