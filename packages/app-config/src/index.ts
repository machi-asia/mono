export interface AppConfig {
  id: string;
  name: string;
  underDevelopment: boolean;
  appUrl: string;
}

export type AppId = "home" | "create" | "rimworld" | "admin";

export const APPS_CONFIG: Record<AppId, AppConfig> = {
  home: {
    id: "home",
    name: "Home",
    underDevelopment: false,
    appUrl: "https://itemlist.online",
  },
  create: {
    id: "create",
    name: "Create",
    underDevelopment: false,
    appUrl: "https://create.itemlist.online",
  },
  rimworld: {
    id: "rimworld",
    name: "RimWorld",
    underDevelopment: true,
    appUrl: "https://rimworld.itemlist.online",
  },
  admin: {
    id: "admin",
    name: "Admin Portal",
    underDevelopment: false,
    appUrl: "https://admin.itemlist.online",
  },
};

export const SUPABASE_CONFIG = {
  url: "https://zyatzdkapdqngwyhiqqn.supabase.co",
  anonKey: "sb_publishable_xwwMB4HT0zXrWgEhPN63yA_xBNK00YR",
};

export function isAppUnderDevelopment(appId: AppId | string): boolean {
  return Boolean(APPS_CONFIG[appId as AppId]?.underDevelopment);
}

export function getAppConfig(appId: AppId | string): AppConfig | undefined {
  return APPS_CONFIG[appId as AppId];
}
