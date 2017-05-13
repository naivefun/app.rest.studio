import { Injectable } from '@angular/core';
import { SyncProviderAccount, SyncProvider } from '../../@model/sync';
import { ConfigService } from '../config.service';
import { CloudSyncProvider, DropboxSyncProvider } from './dropbox.service';
import { DB, DbService } from '../db.service';

@Injectable()
export class SyncService {

    constructor(private config: ConfigService) {
    }

    /**
     * get vendor provider
     * @param provider
     * @param accessToken
     * @returns {DropboxSyncProvider}
     */
    public syncProvider(provider: SyncProvider, accessToken?: string): CloudSyncProvider {
        switch (provider) {
            case SyncProvider.DROPBOX:
            default:
                return new DropboxSyncProvider(this.config.dropboxClientId, accessToken);
        }
    }

    /**
     * get vendor redirect uri for OAuth
     * @param provider
     * @returns {string}
     */
    public redirectUri(provider: SyncProvider): string {
        switch (provider) {
            case SyncProvider.DROPBOX:
            default:
                return this.config.dropboxRedirectUri;
        }
    }

    /**
     * save sync account to config
     * @param syncAccount
     * @returns {any}
     */
    public saveConnection(syncAccount: SyncProviderAccount) {
        return this.config.addSyncAccount(syncAccount);
    }

    /**
     * remove local account from config
     * @param id
     */
    public disconnect(id: string) {
        return this.config.deleteSyncAccount(id);
    }
}
