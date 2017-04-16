import { Injectable } from '@angular/core';
import { DbService, KEYS, DB } from './db.service';

@Injectable()
export class ConfigService {
    public chromeExtensionId: string;
    public localConfig: LocalConfig;

    constructor(private db: DbService) {
        console.debug('environment [ENV] =', ENV);
        switch (ENV) {
            case 'production':
            default:
                this.chromeExtensionId = 'cngieijppkdcnhanpjmephenodeapjgc'; // local
                this.chromeExtensionId = 'imegccjfohmaiflckepgcpeagepgcael'; // production
        }
    }

    public saveConfig() {
        return this.db.savePromise(this.localConfig || {}, DB.MAIN, KEYS.LOCAL_CONFIG);
    }

    // Do not cache because multi tabs might miss updates
    public getConfig() {
        return this.db.getPromise(KEYS.LOCAL_CONFIG, DB.MAIN)
            .then(config => {
                this.localConfig = config || {};
                return this.localConfig;
            });
    }
}

export interface LocalConfig {
    dropboxToken?: string;
}
