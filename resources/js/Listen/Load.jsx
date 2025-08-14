import React, { memo, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Loader from "../Components/Loader";
import { useAuth } from "../ServerSide/Hooks/Auth/useAuth.jsx";
import {useSelector} from "react-redux";

const Load = lazy(() => import('./StartApp/Load'));

const LoadingSpinner = memo(() => (
    <>
        <Loader/>
    </>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Wrap the entire application with Router
const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

// Create a separate component for the content that needs Router context
const AppContent = () => {
    // Now useAuth is used within Router context
    const { checkAuth } = useAuth();
    const isAuthChecked = useSelector(state => state.auth.isAuthChecked);
    const isLoading = useSelector(state => state.auth.loading);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            if (!isAuthChecked && mounted) {
                try {
                    await checkAuth();
                } catch (error) {
                    mounted && console.error('Auth kontrolü sırasında hata:', error);
                }
            }
        };

        initAuth();
        return () => { mounted = false; };
    }, [isAuthChecked]); // Removed checkAuth from dependencies to prevent infinite loop

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Load />
        </Suspense>
    );
};

export default memo(App);
