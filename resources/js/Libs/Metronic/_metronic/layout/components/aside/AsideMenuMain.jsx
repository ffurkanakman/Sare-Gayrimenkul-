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
                    to="/Projeler"
                    icon="element-11"
                    title="Projeler"
                    fontIcon="bi-clipboard-data"
                />
                <AsideMenuItem
                    to="/Kullanicilar"
                    icon="people"
                    title="Kullanıcılar"
                    fontIcon="bi-people"
                />
                <AsideMenuItem
                    to="/Musteriler"
                    icon="people"
                    title="Müşteriler"
                    fontIcon="bi-people"
                />
                <AsideMenuItem
                    to="/builder"
                    icon="switch"
                    title="Layout Builder"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/Teklif"
                    icon="bi bi-filetype-pdf"
                    title="Teklif"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/AraclarListesi"
                    icon="bi bi-card-list"
                    title="Araç Listesi"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/YeniMarkaEkle"
                    icon="bi bi-plus-circle"
                    title="Yeni Marka Ekle"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/SatisListesi"
                    icon="bi bi-receipt"
                    title="Satış Listesi"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/MarkalarListesi"
                    icon="bi bi-receipt"
                    title="Markalar Listesi"
                    fontIcon="bi-layers"
                />
                <AsideMenuItem
                    to="/ProformaFaturaListesi"
                    icon="bi bi-file-earmark-text"
                    title="Proforma Faturalar"
                    fontIcon="bi-layers"
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
