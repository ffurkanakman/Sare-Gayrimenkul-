// src/components/Loader.jsx
import React from "react";

const Loader = ({ message = "Yükleniyor..." }) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                {/* Dönen Animasyon */}
                <div className="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
                {/* İsteğe bağlı mesaj */}
                <p className="text-gray-600 text-sm font-medium">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
