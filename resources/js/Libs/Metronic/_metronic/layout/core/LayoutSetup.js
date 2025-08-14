import { DefaultLayoutConfig } from './DefaultLayoutConfig';

const LAYOUT_CONFIG_KEY = import.meta.env.VITE_APP_BASE_LAYOUT_CONFIG_KEY || "LayoutConfig";

export function getLayout() {
    const ls = localStorage.getItem(LAYOUT_CONFIG_KEY);
    if (ls) {
        try {
            return JSON.parse(ls);
        } catch (er) {
            console.error(er);
        }
    }
    return DefaultLayoutConfig;
}

function setLayout(config) {
    try {
        localStorage.setItem(LAYOUT_CONFIG_KEY, JSON.stringify(config));
    } catch (er) {
        console.error(er);
    }
}

export function getEmptyCssClasses() {
    return {
        header: [],
        headerContainer: [],
        headerMobile: [],
        headerMenu: [],
        aside: [],
        asideMenu: [],
        asideToggle: [],
        toolbar: [],
        toolbarContainer: [],
        content: [],
        contentContainer: [],
        footerContainer: [],
        sidebar: [],
        pageTitle: [],
    };
}

export function getEmptyHTMLAttributes() {
    return {
        asideMenu: new Map(),
        headerMobile: new Map(),
        headerMenu: new Map(),
        headerContainer: new Map(),
        pageTitle: new Map(),
    };
}

export function getEmptyCSSVariables() {
    return {
        body: new Map(),
    };
}

export const LayoutSetup = {
    isLoaded: false,
    config: getLayout(),
    classes: getEmptyCssClasses(),
    attributes: getEmptyHTMLAttributes(),
    cssVariables: getEmptyCSSVariables(),

    initCSSClasses() {
        this.classes = getEmptyCssClasses();
    },

    initHTMLAttributes() {
        this.attributes = Object.assign({}, getEmptyHTMLAttributes());
    },

    initCSSVariables() {
        this.cssVariables = getEmptyCSSVariables();
    },

    initLayout(config) {
        if (config.main?.body?.backgroundImage) {
            document.body.style.backgroundImage = `url(${config.main.body.backgroundImage})`;
        }
    },

    initHeader(config) {
        this.classes.headerContainer.push(
            config.width === "fluid" ? "container-fluid" : "container-xxl"
        );

        if (config.fixed.desktop) {
            document.body.classList.add("header-fixed");
        }

        if (config.fixed.tabletAndMobile) {
            document.body.classList.add("header-tablet-and-mobile-fixed");
        }
    },

    initToolbar() {},

    initPageTitle(config) {
        if (!config.display) return;

        if (config.responsive) {
            this.classes.pageTitle.push("mb-5 mb-lg-0");
            this.attributes.pageTitle.set("data-kt-swapper", "true");
            this.attributes.pageTitle.set("data-kt-swapper-mode", "prepend");
            this.attributes.pageTitle.set(
                "data-kt-swapper-parent",
                `{default: '#kt_content_container', '${config.responsiveBreakpoint}: ${config.responsiveTarget}'`
            );
        }
    },

    initContent(config) {
        this.classes.contentContainer.push(
            config.width === "fluid" ? "container-fluid" : "container-xxl"
        );
    },

    initAside(config) {
        if (!config.display) return;

        if (config.fixed) {
            document.body.classList.add("aside-fixed");
        }

        if (config.minimized) {
            document.body.setAttribute("data-kt-aside-minimize", "on");
            this.classes.asideToggle.push("active");
        }

        if (config.secondaryDisplay) {
            document.body.classList.add("aside-secondary-enabled");
        } else {
            document.body.classList.add("aside-secondary-disabled");
        }
    },

    initAsideMenu() {},

    initFooter(config) {
        this.classes.footerContainer.push(
            `container-${config.width === "fluid" ? "fluid" : "xxl"}`
        );
    },

    initConfig(config) {
        if (config.main?.darkSkinEnabled) {
            document.body.classList.add("dark-skin");
        }

        this.initLayout(config);
        if (config.main?.type !== "default") return;

        this.initHeader(config.header);
        this.initPageTitle(config.pageTitle);
        this.initToolbar(config.toolbar);
        this.initContent(config.content);
        this.initAside(config.aside);
        this.initFooter(config.footer);
        this.initAsideMenu(config.aside);
    },

    updatePartialConfig(fieldsToUpdate) {
        const updatedConfig = { ...this.config, ...fieldsToUpdate };
        document.body.className = "";
        this.initCSSClasses();
        this.initCSSVariables();
        this.initHTMLAttributes();
        this.isLoaded = false;
        this.config = updatedConfig;
        this.initConfig(Object.assign({}, updatedConfig));
        this.isLoaded = true;
        return updatedConfig;
    },

    setConfig(config) {
        setLayout(config);
    },

    bootstrap() {
        this.updatePartialConfig(this.config);
    }
};

LayoutSetup.bootstrap();
