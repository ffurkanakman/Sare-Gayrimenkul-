import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthChecked, setAuthenticated, setUser, setToken } from '../../Repo/Redux/Modules/authSlice';
import { ROUTES } from '../../Libs/Routes/config';
import LoadingScreen from '../LoadingScreen';
import { apiService } from '../../ServerSide/Load';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, isAuthChecked } = useSelector(state => state.auth);
    const [checking, setChecking] = useState(true);
    const location = useLocation();

    // Function to check authentication status
    const checkAuth = async () => {
        try {
            // Check if token exists in localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                dispatch(setAuthenticated(false));
                dispatch(setUser(null));
                dispatch(setToken(null));
                dispatch(setAuthChecked(true));
                return false;
            }

            // For now, we'll just assume the token is valid if it exists
            dispatch(setToken(token));
            dispatch(setAuthenticated(true));

            // Optionally, you can try to fetch the user data
            try {
                const response = await apiService.get('/api/v1/user');
                if (response.data.user) {
                    dispatch(setUser(response.data.user));
                }
            } catch (userError) {
                console.error('Error fetching user data:', userError);
                // Even if we can't fetch user data, we still consider the user authenticated
                // because they have a token
            }

            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            dispatch(setAuthenticated(false));
            dispatch(setUser(null));
            dispatch(setToken(null));
            return false;
        } finally {
            dispatch(setAuthChecked(true));
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            if (!isAuthChecked) {
                await checkAuth();
            }
            setChecking(false);
        };

        verifyAuth();
    }, [isAuthChecked, dispatch]);

    if (checking || loading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        // Redirect to login page with the return url
        return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
