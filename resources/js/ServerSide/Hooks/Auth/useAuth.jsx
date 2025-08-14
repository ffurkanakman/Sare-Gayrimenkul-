import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    setUser,
    setToken,
    setAuthenticated,
    setLoading,
    setError,
    logout as logoutAction,
    setAuthChecked
} from '../../../Repo/Redux/Modules/authSlice';
import { apiService } from '../../Load';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../Libs/Routes/config';
import { API_CONFIG } from '../../Endpoints';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);
    const [loginError, setLoginError] = useState(null);

    // Login function
    // login fonksiyonu içinde sadece şu haliyle bırakıyoruz:
    const login = async (credentials) => {
        try {
            dispatch(setLoading(true));
            setLoginError(null);

            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

            if (response.data.token) {
                dispatch(setToken(response.data.token));
                dispatch(setUser(response.data.user));
                dispatch(setAuthenticated(true));
                localStorage.setItem('token', response.data.token);

                return true; // Sadece başarılı olduğunu döner
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
            setLoginError(errorMessage);
            toast.error(errorMessage);
            dispatch(setError(errorMessage));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };


    // Register function
    const register = async (userData) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);

            if (response.data?.token && response.data?.user) {
                toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');

                dispatch(setToken(response.data.token));
                dispatch(setUser(response.data.user));
                dispatch(setAuthenticated(true));
                localStorage.setItem('token', response.data.token);

                setTimeout(() => {
                    navigate(ROUTES.UI.LANDING);
                }, 1500); // 1.5 saniye sonra yönlendir
                return true;
            }



            const message = response.data?.message || 'Kayıt işlemi tamamlanamadı';
            toast.warning(message);
            return false;
        } catch (error) {
            console.error('Register error:', error);

            const responseErrors = error.response?.data?.errors;

            if (responseErrors) {
                // Laravel'den gelen tüm validation hatalarını döndür
                Object.values(responseErrors).flat().forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                const errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.errors?.error ||
                    'Kayıt olurken bir hata oluştu';

                toast.error(errorMessage);
                dispatch(setError(errorMessage));
            }

            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Logout function

    const logout = async () => {
        try {
            dispatch(setLoading(true));

            if (isAuthenticated) {
                await apiService.post('/api/v1/Cikis');
            }

            dispatch(logoutAction());
            localStorage.removeItem('token');

            // ✅ Toast için flag bırak
            sessionStorage.setItem('logoutToastPending', '1');

            // ✅ Geçişi yumuşat: 100ms sonra replace: true ile yönlendir
            setTimeout(() => {
                navigate(ROUTES.AUTH.LOGIN, { replace: true });
            }, 100);

            return true;
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Çıkış yapılırken bir hata oluştu");
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };





    // Forgot password function
    const forgotPassword = async (email) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post('/api/v1/forgot-password', { email });

            toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            const errorMessage = error.response?.data?.message || 'Şifre sıfırlama işlemi sırasında bir hata oluştu';
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Reset password function
    const resetPassword = async (data) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post('/api/v1/reset-password-token', data);

            toast.success('Şifreniz başarıyla sıfırlandı');
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            const errorMessage = error.response?.data?.message || 'Şifre sıfırlama işlemi sırasında bir hata oluştu';
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Check if user is authenticated
    const checkAuth = useCallback(async () => {
        try {
            dispatch(setLoading(true));

            // If we already have a user and token, consider authenticated
            if (user && token) {
                dispatch(setAuthChecked(true));
                return true;
            }

            // Check if we have a token in localStorage
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                dispatch(setAuthChecked(true));
                return false;
            }

            // Set token from localStorage
            dispatch(setToken(storedToken));

            // Validate token by fetching user data
            const response = await apiService.get('/api/v1/me');

            if (response.data) {
                dispatch(setUser(response.data));
                dispatch(setAuthenticated(true));
                dispatch(setAuthChecked(true));
                return true;
            }

            dispatch(setAuthChecked(true));
            return false;
        } catch (error) {
            console.error('Auth check error:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            dispatch(logoutAction());
            dispatch(setAuthChecked(true));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, user, token]);

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        loginError,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        checkAuth
    };
};

export default useAuth;
