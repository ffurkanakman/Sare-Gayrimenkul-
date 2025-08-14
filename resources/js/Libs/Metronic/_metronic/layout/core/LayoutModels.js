export const LayoutModels = {
    // Temel model şablonları
    loaderDefaults: {
        display: true,
        type: 'default' // 'default' | 'spinner-message' | 'spinner-logo'
    },

    scrollTopDefaults: {
        display: true
    },

    headerDefaults: {
        display: true,
        width: 'fixed', // 'fixed' | 'fluid'
        left: 'menu', // 'menu' | 'page-title'
        fixed: {
            desktop: true,
            tabletAndMobile: true
        },
        menuIcon: 'svg', // 'svg' | 'font'
        menu: true
    },

    megaMenuDefaults: {
        display: true
    },

    asideDefaults: {
        display: true,
        theme: 'dark', // 'dark' | 'light'
        menu: 'main', // 'main' | 'documentation'
        fixed: true,
        minimized: false,
        minimize: true,
        hoverable: true,
        menuIcon: 'svg', // 'svg' | 'font'
        secondaryDisplay: false
    },

    contentDefaults: {
        width: 'fixed', // 'fixed' | 'fluid'
        layout: 'default' // 'default' | 'docs'
    },

    footerDefaults: {
        width: 'fixed' // 'fixed' | 'fluid'
    },

    sidebarDefaults: {
        display: true,
        toggle: true,
        shown: true,
        content: 'general', // 'general' | 'user' | 'shop'
        bgColor: 'bg-body', // 'bg-body' | 'bg-info'
        displayFooter: true,
        displayFooterButton: true
    },

    toolbarDefaults: {
        display: true,
        width: 'fixed', // 'fixed' | 'fluid'
        fixed: {
            desktop: true,
            tabletAndMobileMode: true
        },
        layout: 'toolbar1', // 'toolbar1' | 'toolbar2' | 'toolbar3' | 'toolbar4' | 'toolbar5'
        layouts: {
            toolbar1: {
                height: '55px',
                heightAndTabletMobileMode: '55px'
            },
            toolbar2: {
                height: '75px',
                heightAndTabletMobileMode: '65px'
            },
            toolbar3: {
                height: '55px',
                heightAndTabletMobileMode: '55px'
            },
            toolbar4: {
                height: '65px',
                heightAndTabletMobileMode: '65px'
            },
            toolbar5: {
                height: '75px',
                heightAndTabletMobileMode: '65px'
            }
        }
    },

    pageTitleDefaults: {
        display: true,
        breadCrumbs: true,
        description: true,
        layout: 'default', // 'default' | 'select'
        direction: 'row', // 'row' | 'column'
        responsive: true,
        responsiveBreakpoint: 'lg', // 'lg' | 'md' | '300px'
        responsiveTarget: ''
    },

    mainDefaults: {
        body: {
            backgroundImage: '',
            class: ''
        },
        primaryColor: '',
        darkSkinEnabled: false,
        type: 'default', // 'blank' | 'default' | 'none'
        pageBgWhite: true,
        iconType: 'duotone' // 'duotone' | 'solid' | 'outline'
    },

    illustrationsDefaults: {
        componentName: 'illustrations',
        set: 'sketchy-1' // 'dozzy-1' | 'sigma-1' | 'sketchy-1' | 'unitedpalms-1'
    },

    cssClassesDefaults: {
        header: [],
        headerContainer: [],
        headerMobile: [],
        headerMenu: [],
        aside: [],
        asideMenu: [],
        asideToggle: [],
        sidebar: [],
        toolbar: [],
        toolbarContainer: [],
        content: [],
        contentContainer: [],
        footerContainer: [],
        pageTitle: []
    },

    htmlAttributesDefaults: {
        asideMenu: new Map(),
        headerMobile: new Map(),
        headerMenu: new Map(),
        headerContainer: new Map(),
        pageTitle: new Map()
    },

    cssVariablesDefaults: {
        body: new Map()
    }
};

export default LayoutModels;
