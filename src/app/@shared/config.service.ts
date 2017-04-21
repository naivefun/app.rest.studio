import { Injectable } from '@angular/core';
import { DbService, KEYS, DB } from './db.service';
import { ConnectAccount } from '../@model/sync/connect-account';
import * as _ from 'lodash';

@Injectable()
export class ConfigService {
    public chromeExtensionId: string;
    public localConfig: LocalConfig;
    public dropboxClientId: string;
    public dropboxRedirectUri: string;

    constructor(private db: DbService) {
        console.debug('environment [ENV] =', ENV);
        switch (ENV) {
            case 'production':
            default:
                this.chromeExtensionId = 'cngieijppkdcnhanpjmephenodeapjgc'; // local
                this.chromeExtensionId = 'imegccjfohmaiflckepgcpeagepgcael'; // production
                this.dropboxClientId = 'eeiyjdaf41jyfy0';
                this.dropboxRedirectUri = 'http://localhost:3000/assets/auth/dropbox.html';
        }
    }

    public saveConfig() {
        this.localConfig = this.localConfig || new LocalConfig();
        return this.db.savePromise(this.localConfig, DB.MAIN, KEYS.LOCAL_CONFIG);
    }

    // Do not cache because multi tabs might miss updates
    public getConfig(cacheOk = true) {
        if (cacheOk && this.localConfig) return Promise.resolve(this.localConfig);
        return this.db.getPromise(KEYS.LOCAL_CONFIG, DB.MAIN)
            .then(config => {
                if (!config) {
                    // create config if not exist
                    return this.saveConfig()
                        .then(result => this.localConfig);
                } else {
                    this.localConfig = config;
                    return this.localConfig;
                }
            });
    }

    public getConnectedAccount(id: string) {
        if (this.localConfig) {
            return this.localConfig.connectedAccounts.find(act => act.id === id);
        }
    }

    public addConnectedAccount(account: ConnectAccount) {
        return this.getConfig(false)
            .then((config: LocalConfig) => {
                // remove existing account with same uid
                config.connectedAccounts =
                    config.connectedAccounts.filter(acct => acct.id !== account.id);
                config.connectedAccounts.push(account);
                this.localConfig = config;
                return this.saveConfig();
            });
    }

    public deleteConnectedAccount(account: ConnectAccount) {
        return this.getConfig(false)
            .then((config: LocalConfig) => {
                config.connectedAccounts = config.connectedAccounts
                    .filter(acc => acc.id !== account.id);
                this.localConfig = config;
                return this.saveConfig();
            });
    }
}

export class LocalConfig {
    public connectedAccounts: ConnectAccount[];

    constructor() {
        this.connectedAccounts = [];
    }
}
