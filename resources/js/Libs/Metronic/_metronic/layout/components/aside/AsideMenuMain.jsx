import { IntlProvider } from "react-intl";
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";

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
                    to="/Musteriler"
                    icon="people"
                    title="Müşterilerim"
                    fontIcon="bi-people"
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
                        to="/settings/account"
                        title="Hesap Ayarları"
                        hasBullet={true}
                    />
                </AsideMenuItemWithSub>
            </>
        </IntlProvider>
    );
};

export { AsideMenuMain };
