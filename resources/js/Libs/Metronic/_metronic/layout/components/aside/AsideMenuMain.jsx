import { IntlProvider } from "react-intl";
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";
import {ROUTES} from "@/Libs/Routes/config.jsx";

const AsideMenuMain = () => {
    const messages = {
        "MENU.DASHBOARD": "Gösterge Paneli",
    };

    return (
        <IntlProvider messages={messages} locale="tr" defaultLocale="tr">
            <>
                <AsideMenuItem
                    to="/dashboard"
                    icon="color-swatch"
                    title="Gösterge Paneli"
                    fontIcon="bi-app-indicator"
                />
                <AsideMenuItem
                    to="/Musteriler"
                    icon="people"
                    title="Müşteriler"
                    fontIcon="bi-people"
                />
                <AsideMenuItem
                    to="/Musterilerim"
                    icon="user-tick"
                    title="Müşterilerim"
                    fontIcon="bi-person-check"
                />
                <AsideMenuItem
                    to="/Firmalar"
                    icon="shop"
                    title="Firmalar"
                    fontIcon="bi-buildings"
                />
                <div className="menu-item">
                    <div className="menu-content pt-8 pb-2">
                        <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                            Ayarlar
                        </span>
                    </div>
                </div>

                <AsideMenuItemWithSub
                    to="/settings"
                    title="Ayarlar"
                    icon="setting-2"
                    fontIcon="bi-gear"
                >
                    <AsideMenuItem
                        to="/settings/notifications"
                        title="Bildirim Ayarları"
                        hasBullet={true}
                    />
                    <AsideMenuItem
                        to={ROUTES.UI.ACCOUNT_SETTINGS}
                        title="Hesap Ayarları"
                        hasBullet={true}
                    />
                </AsideMenuItemWithSub>
            </>
        </IntlProvider>
    );
};

export { AsideMenuMain };
