import React, {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from "@/Libs/Metronic/_metronic/layout/core/index.js";
import {ThemeModeProvider} from "@/Libs/Metronic/_metronic/partials/index.js";
import {AuthInit} from "@/Libs/Metronic/app/modules/auth/index.js";
import {MasterInit} from "@/Libs/Metronic/_metronic/layout/MasterInit.js";

const PagesLoad = () => {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <LayoutProvider>
                <ThemeModeProvider>
                    <AuthInit>
                        <Outlet />
                        <MasterInit />
                    </AuthInit>
                </ThemeModeProvider>
            </LayoutProvider>
        </Suspense>
    )
}

export {PagesLoad}
