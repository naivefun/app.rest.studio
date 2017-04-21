import { CloudSyncProvider, DropboxSyncProvider } from './dropbox.service';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { ConnectAccount, ConnectProvider } from '../../@model/sync/connect-account';

@Injectable()
export class SyncService {

    constructor(private config: ConfigService,
        private dropboxProvider: DropboxSyncProvider) {
    }

    public connectProvider(provider: ConnectProvider, accessToken?: string): CloudSyncProvider {
        switch (provider) {
            case ConnectProvider.DROPBOX:
            default:
                return new DropboxSyncProvider(this.config.dropboxClientId, accessToken);
        }
    }

    public redirectUri(provider: ConnectProvider): string {
        switch (provider) {
            case ConnectProvider.DROPBOX:
            default:
                return this.config.dropboxRedirectUri;
        }
    }

    public persistConnection(account: ConnectAccount) {
        return this.config.addConnectedAccount(account);
    }

    public disconnect(id: string) {
        return;
    }
}
