// resources/js/Libs/Metronic/_metronic/helpers/assetHelpers.ts
import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../assets/ts/layout";

export const toAbsoluteUrl = (pathname: string): string => {
    if (!pathname) return "";
    if (/^(?:https?:)?\/\//i.test(pathname) || /^data:/i.test(pathname)) return pathname;
    const base = String(import.meta.env.BASE_URL ?? "/");
    const cleanBase = base.replace(/\/+$/, "");
    const cleanPath = String(pathname).replace(/^\/+/, "");
    return `${cleanBase}/${cleanPath}`;
};

export const useIllustrationsPath = (illustrationName: string): string => {
    const { config } = useLayout();
    const dot = illustrationName?.lastIndexOf(".") ?? -1;
    const ext = dot >= 0 ? illustrationName.slice(dot) : "";
    const name = dot >= 0 ? illustrationName.slice(0, dot) : illustrationName;
    const themed = ThemeModeComponent.getMode() === "dark" ? `${name}-dark` : name;
    const setName = config?.illustrations?.set ?? "default";
    return toAbsoluteUrl(`media/illustrations/${setName}/${themed}${ext}`);
};
