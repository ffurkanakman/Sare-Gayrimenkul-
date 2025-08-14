import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-fsh-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
