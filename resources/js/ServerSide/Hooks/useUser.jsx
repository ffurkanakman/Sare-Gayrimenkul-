import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setUsers,
    setCurrentUser
}  from '../../Repo/Redux/Modules/userSlice.jsx';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';


export const useUser = () => {
    const dispatch = useDispatch();
    const { users, currentUser, loading, error } = useSelector(state => state.user);

    const setUser = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.USER.USER);

            // Sadece data kısmını dispatch et
            dispatch(setUsers(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getUserById = async (id) => {
        try {
            dispatch(setLoading(true));

            // First try to find the user in the local state
            if (users && users.length > 0) {
                const user = users.find(u => u.id === parseInt(id));
                if (user) {
                    dispatch(setCurrentUser(user));
                    return user;
                }
            }

            // If not found locally, fetch from API
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.USER.USER}/${id}`);

            // Set the current user in the store
            dispatch(setCurrentUser(response.data.data));

            return response.data.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error('Kullanıcı yüklenemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateUser = async (user, id) => {
        try {
            dispatch(setLoading(true));

            const isFormData = typeof FormData !== 'undefined' && user instanceof FormData;

            if (isFormData) {
                // 🔑 PUT + FormData bazı PHP kurulumlarında sorun çıkarır.
                // En stabil çözüm: POST ile gönderip method override kullanmak.
                user.append('_method', 'PUT');
                const response = await apiService.post(
                    `${API_CONFIG.ENDPOINTS.USER.USER_UPDATE}/${id}`,
                    user,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                return response.data;
            } else {
                const response = await apiService.put(
                    `${API_CONFIG.ENDPOINTS.USER.USER_UPDATE}/${id}`,
                    user
                );
                return response.data;
            }

        } catch (error) {
            dispatch(setError(error.message));
            toast.error('Kullanıcı Düzenlenemedi.');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createUser = async (user) => {
        try {
            dispatch(setLoading(true));

            const isFormData = typeof FormData !== 'undefined' && user instanceof FormData;
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.USER.USER,
                user,
                { headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined }
            );

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error('Kullanıcı Eklenemedi.');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteUser = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.USER.USER}/${id}`);

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error('Kullanıcı Silinemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    };

    return {
        users,
        currentUser,
        loading,
        error,
        setUser,
        getUserById,
        updateUser,
        createUser,
        deleteUser
    };
};

export default useUser;
