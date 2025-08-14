export const DefaultLayoutConfig = {
    main: {
        type: 'default',
        darkSkinEnabled: true,
        primaryColor: '#04C8C8',
        pageBgWhite: false,
        iconType: 'duotone',
    },
    illustrations: {
        componentName: 'illustrations',
        set: 'sketchy-1',
    },
    loader: {
        display: false,
        type: 'default', // default|spinner-message|spinner-logo
    },
    scrolltop: {
        display: true,
    },
    header: {
        display: true,
        width: 'fixed', // fixed|fluid
        fixed: {
            desktop: true,
            tabletAndMobile: true,
        },
        menuIcon: 'font',
        menu: false,
    },
    megaMenu: {
        display: false,
    },
    aside: {
        menu: 'main',
        secondaryDisplay: true,
        minimized: false,
        minimize: true,
        display: true,
        fixed: true,
        menuIcon: 'svg',
    },
    content: {
        width: 'fixed', // fixed|fluid
        layout: 'default',
    },
    toolbar: {
        display: false,
        width: 'fluid',
        fixed: {
            desktop: true,
            tabletAndMobileMode: false,
        },
    },
    footer: {
        width: 'fixed', // fixed|fluid
    },
    pageTitle: {
        display: true,
        breadCrumbs: true,
        description: false,
        responsive: true,
        responsiveBreakpoint: 'lg',
        responsiveTarget: '#kt_toolbar_container',
    },
}
