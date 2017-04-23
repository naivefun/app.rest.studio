import { Injectable } from '@angular/core';
import { SyncProviderAccount, SyncProvider } from '../../@model/sync';
import { ConfigService } from '../config.service';
import { CloudSyncProvider, DropboxSyncProvider } from './dropbox.service';

@Injectable()
export class SyncService {

    constructor(private config: ConfigService) {
    }

    public syncProvider(provider: SyncProvider, accessToken?: string): CloudSyncProvider {
        switch (provider) {
            case SyncProvider.DROPBOX:
            default:
                return new DropboxSyncProvider(this.config.dropboxClientId, accessToken);
        }
    }

    public redirectUri(provider: SyncProvider): string {
        switch (provider) {
            case SyncProvider.DROPBOX:
            default:
                return this.config.dropboxRedirectUri;
        }
    }

    public persistConnection(syncAccount: SyncProviderAccount) {
        return this.config.addSyncAccount(syncAccount);
    }

    public disconnect(id: string) {
        return;
    }
}
