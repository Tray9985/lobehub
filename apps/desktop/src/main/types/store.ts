import type {
  DataSyncConfig,
  NetworkProxySettings,
  UpdateChannel,
} from '@lobechat/electron-client-ipc';

export interface ElectronMainStore {
  appTrayVisible: boolean;
  dataSyncConfig: DataSyncConfig;
  encryptedCfTokens: {
    clientId?: string;
    clientSecret?: string;
  };
  encryptedTokens: {
    accessToken?: string;
    expiresAt?: number;
    lastRefreshAt?: number;
    refreshToken?: string;
  };
  gatewayDeviceDescription: string;
  gatewayDeviceId: string;
  gatewayDeviceName: string;
  gatewayEnabled: boolean;
  gatewayUrl: string;
  locale: string;
  localFileWorkspaceRoots: string[];
  networkProxy: NetworkProxySettings;
  shortcuts: Record<string, string>;
  storagePath: string;
  themeMode: 'dark' | 'light' | 'system';
  updateChannel: UpdateChannel;
}

export type StoreKey = keyof ElectronMainStore;
