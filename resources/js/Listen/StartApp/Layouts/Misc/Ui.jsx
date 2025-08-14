import React, {useEffect} from "react";
import {Link, Outlet, useLocation} from 'react-router-dom';
import {PageDataProvider} from "@/Libs/Metronic/_metronic/layout/core/index.js";
import {AsideDefault} from "@/Libs/Metronic/_metronic/layout/components/aside/AsideDefault.jsx";
import {HeaderWrapper} from "@/Libs/Metronic/_metronic/layout/components/header/HeaderWrapper.jsx";
import {Content} from "@/Libs/Metronic/_metronic/layout/components/Content.jsx";
import {Footer} from "@/Libs/Metronic/_metronic/layout/components/Footer.js";
import {ActivityDrawer, DrawerMessenger, InviteUsers, UpgradePlan} from "@/Libs/Metronic/_metronic/partials/index.js";
import {RightToolbar} from "@/Libs/Metronic/_metronic/partials/layout/RightToolbar.js";
import {ScrollTop} from "@/Libs/Metronic/_metronic/layout/components/ScrollTop.js";


import {getCSSVariableValue} from '@/Libs/Metronic/_metronic/assets/ts/_utils';
import {
    DrawerComponent, MenuComponent, ScrollComponent,
    ScrollTopComponent, SwapperComponent,
    ToggleComponent
} from "@/Libs/Metronic/_metronic/assets/ts/components/index.js";

const Ui = () => {

    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            ToggleComponent.reinitialization();
            ScrollTopComponent.reinitialization();
            DrawerComponent.reinitialization();
            MenuComponent.reinitialization();
            ScrollComponent.reinitialization();
            SwapperComponent.reinitialization();
        }, 500)
    }, [location.key])


    return (
        <PageDataProvider>
            <div className='d-flex flex-column flex-root'>
                {/* begin::Page */}
                <div className='page d-flex flex-row flex-column-fluid'>
                    <AsideDefault />
                    {/* begin::Wrapper */}
                    <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
                        <HeaderWrapper />

                        {/* begin::Content */}
                        <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
                            <Content>
                                <Outlet />
                            </Content>
                        </div>
                        {/* end::Content */}
                        <Footer />
                    </div>
                    {/* end::Wrapper */}
                </div>
                {/* end::Page */}
            </div>

            {/* begin:: Drawers */}
            <ActivityDrawer />
            <RightToolbar />
            <DrawerMessenger />
            {/* end:: Drawers */}

            {/* begin:: Modals */}
            <InviteUsers />
            <UpgradePlan />
            {/* end:: Modals */}
            <ScrollTop />
        </PageDataProvider>
    );
};

export default Ui;
