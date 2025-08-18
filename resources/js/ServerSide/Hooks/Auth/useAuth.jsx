// resources/js/ServerSide/Hooks/Auth/useAuth.jsx
import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    setUser,
    setToken,
    setAuthenticated,
    setLoading,
    setError,
    logout as logoutAction,
    setAuthChecked,
} from '../../../Repo/Redux/Modules/authSlice'

import { apiService } from '../../Load'
import { ROUTES } from '../../../Libs/Routes/config'
import { API_CONFIG } from '../../Endpoints'

export const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth)
    const [loginError, setLoginError] = useState(null)

    // /me çağrısını tek yere topladık
    const fetchMe = useCallback(async () => {
        const res = await apiService.get('/api/v1/me', { withCredentials: true })
        // BEKLENEN: { status:true, data:{...UserResource} }  || bazen direkt { ...UserResource }
        const me = (res && res.data && (res.data.data || res.data)) || null
        if (!me) throw new Error('Me response empty')

        // user'ı TAM HALİYLE yaz (avatar_url, pic vs. kaybolmasın)
        dispatch(setUser(me))
        dispatch(setAuthenticated(true))
        return me
    }, [dispatch])

    // LOGIN
    const login = async (credentials) => {
        try {
            dispatch(setLoading(true))
            setLoginError(null)

            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials)

            const tok = response && response.data && response.data.token
            if (!tok) {
                toast.error('Giriş başarısız: token alınamadı')
                return false
            }

            dispatch(setToken(tok))
            localStorage.setItem('token', tok)

            // Login dönüşündeki user eksik olabilir → /me ile kesinle
            await fetchMe()
            dispatch(setAuthenticated(true))
            return true
        } catch (err) {
            console.error('Login error:', err)
            const errorMessage = err?.response?.data?.message || 'Giriş yapılırken bir hata oluştu'
            setLoginError(errorMessage)
            toast.error(errorMessage)
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    // REGISTER
    const register = async (userData) => {
        try {
            dispatch(setLoading(true))

            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData)

            const tok = response && response.data && response.data.token
            if (!tok) {
                const message = (response && response.data && response.data.message) || 'Kayıt işlemi tamamlanamadı'
                toast.warning(message)
                return false
            }

            toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...')
            dispatch(setToken(tok))
            localStorage.setItem('token', tok)

            await fetchMe()
            dispatch(setAuthenticated(true))

            setTimeout(() => navigate(ROUTES.UI.LANDING), 1500)
            return true
        } catch (err) {
            console.error('Register error:', err)
            const responseErrors = err?.response?.data?.errors
            if (responseErrors) {
                Object.values(responseErrors).flat().forEach((msg) => toast.error(String(msg)))
            } else {
                const errorMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.errors?.error ||
                    'Kayıt olurken bir hata oluştu'
                toast.error(errorMessage)
                dispatch(setError(errorMessage))
            }
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    // LOGOUT
    const logout = async () => {
        try {
            dispatch(setLoading(true))

            if (isAuthenticated) {
                await apiService.post('/api/v1/Cikis', {}, { withCredentials: true })
            }

            dispatch(logoutAction())
            localStorage.removeItem('token')

            sessionStorage.setItem('logoutToastPending', '1')
            setTimeout(() => navigate(ROUTES.AUTH.LOGIN, { replace: true }), 100)

            return true
        } catch (err) {
            console.error('Logout error:', err)
            toast.error('Çıkış yapılırken bir hata oluştu')
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    // FORGOT PASSWORD
    const forgotPassword = async (email) => {
        try {
            dispatch(setLoading(true))
            const response = await apiService.post('/api/v1/forgot-password', { email })
            toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi')
            return response.data
        } catch (err) {
            console.error('Forgot password error:', err)
            const errorMessage = err?.response?.data?.message || 'Şifre sıfırlama işleminde hata'
            toast.error(errorMessage)
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    // RESET PASSWORD
    const resetPassword = async (data) => {
        try {
            dispatch(setLoading(true))
            const response = await apiService.post('/api/v1/reset-password-token', data)
            toast.success('Şifreniz başarıyla sıfırlandı')
            return response.data
        } catch (err) {
            console.error('Reset password error:', err)
            const errorMessage = err?.response?.data?.message || 'Şifre sıfırlama işleminde hata'
            toast.error(errorMessage)
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    // AUTH CHECK
    const checkAuth = useCallback(async () => {
        try {
            dispatch(setLoading(true))

            if (user && token) {
                dispatch(setAuthChecked(true))
                return true
            }

            const storedToken = localStorage.getItem('token')
            if (!storedToken) {
                dispatch(setAuthChecked(true))
                return false
            }

            dispatch(setToken(storedToken))

            await fetchMe()
            dispatch(setAuthChecked(true))
            return true
        } catch (err) {
            console.error('Auth check error:', err)
            localStorage.removeItem('token')
            dispatch(logoutAction())
            dispatch(setAuthChecked(true))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, user, token, fetchMe])

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
        checkAuth,
        fetchMe,
    }
}

export default useAuth
