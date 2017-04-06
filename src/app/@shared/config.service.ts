import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    public chromeExtensionId: string;

    constructor() {
        console.debug('environment [ENV] =', ENV);
        switch (ENV) {
            case 'production':
            default:
                this.chromeExtensionId = 'cngieijppkdcnhanpjmephenodeapjgc';
        }
    }
}
