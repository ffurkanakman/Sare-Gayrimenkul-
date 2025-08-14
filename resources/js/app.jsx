import ReactDOM from "react-dom/client";
import React, { Suspense } from "react";
import ListenLoad from "./Listen/Load.jsx";
import { ReduxProvider } from "./Repo/Redux/Load.jsx";
import Loader from "./Components/Loader"; // Loader komponenti import edin
import { MetronicI18nProvider } from "./Libs/Metronic/_metronic/i18n/Metronici18n";
import { I18nProvider } from "./Libs/Metronic/_metronic/i18n/i18nProvider";



// import './Libs/Metronic/_metronic/assets/fonticon/fonticon.css'
// import './Libs/Metronic/_metronic/assets/keenicons/duotone/style.css'
// import './Libs/Metronic/_metronic/assets/keenicons/outline/style.css'
// import './Libs/Metronic/_metronic/assets/keenicons/solid/style.css'

// Loader için stil tanımı
const loaderStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 9999
};

const rootElement = document.getElementById('fsh');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <Suspense fallback={
            <div style={loaderStyle}>
                <Loader />
            </div>
        }>
            <ReduxProvider>
                <MetronicI18nProvider>
                    <I18nProvider>
                        <ListenLoad/>
                    </I18nProvider>
                </MetronicI18nProvider>
            </ReduxProvider>
        </Suspense>
    );
}

