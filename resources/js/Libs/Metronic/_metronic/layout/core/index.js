// Layout yapılandırmaları
import { DefaultLayoutConfig } from './DefaultLayoutConfig'
import { LayoutSetup, getLayout } from './LayoutSetup'
import { LayoutModels } from './LayoutModels'
import { LayoutProvider, useLayout } from './LayoutProvider'

// Sayfa bileşenleri ve veri yönetimi
import {
    PageDescription,
    PageTitle,
    PageDataProvider,
    usePageData,
    PageLink
} from './PageData'

// Splash screen bileşeni
import {
    MetronicSplashScreenProvider as MetronicSplashScreen,
    LayoutSplashScreen
} from './MetronicSplashScreen'

export {
    // Layout exports
    DefaultLayoutConfig,
    LayoutSetup,
    LayoutModels,
    LayoutProvider,
    useLayout,
    getLayout,

    // Page data exports
    PageDescription,
    PageTitle,
    PageDataProvider,
    usePageData,
    PageLink,

    // Splash screen exports
    MetronicSplashScreen,
    LayoutSplashScreen
}
