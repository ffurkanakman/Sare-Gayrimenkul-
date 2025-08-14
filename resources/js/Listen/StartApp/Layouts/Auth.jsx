import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from "../../../Libs/Routes/config";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { LanguageService } from "@/Libs/i18n/languageConfig.jsx";


// const languages = LanguageService.getLanguages();

const AuthLayout = () => {
    const { t, i18n } = useTranslation();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const langMenuRef = useRef(null);

    useEffect(() => {
        document.body.style.backgroundImage = `url('/media/misc/auth-bg.png')`;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';

        // Cleanup function to reset body styles when the component unmounts
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundSize = '';
        };
    }, []);

    const handleToggleLangMenu = () => setIsLangMenuOpen(prev => !prev);

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        setSelectedLanguage(code);
        setIsLangMenuOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setIsLangMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <React.StrictMode>
            <ToastContainer position="top-right" />
            <div className="auth">
                <div className="card-area">
                    <div className="card-container">
                        <Outlet />
                    </div>
                </div>
            </div>
        </React.StrictMode>
    );
};

export default AuthLayout;
