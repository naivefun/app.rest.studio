import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import { Observable } from 'rxjs/Observable';
import { SyncProviderAccount, SyncProvider } from '../@model/sync';
import { getConnections } from '../store/selector';
import { SyncService } from '../@shared/sync/sync.service';
import { ConfigService } from '../@shared/config.service';
import { UpdateConfigAction } from '../store/config-reducer';
import * as _ from 'lodash';

declare const global_: any;

@Component({
    selector: 'connect',
    templateUrl: './connect.component.html'
})
export class ConnectComponent {
    public connections$: Observable<SyncProviderAccount[]>;
    public connections: SyncProviderAccount[];

    constructor(public config: ConfigService,
                private syncService: SyncService,
                private store: Store<State>) {
        this.connections$ = store.select(getConnections);
    }

    // TODO: abstract for all providers
    public connectDropbox() {
        let syncProvider = this.syncService.syncProvider(SyncProvider.DROPBOX);
        let authUrl = syncProvider.authUrl(this.syncService.redirectUri(SyncProvider.DROPBOX));

        let win = window.open(authUrl, 'auth');
        global_[ 'onReceiveDropboxToken' ] = url => {
            win.close();
            console.debug('dropbox url', url);

            let tokenObject = syncProvider.parseAuthToken(url);
            let syncAccount = new SyncProviderAccount(SyncProvider.DROPBOX, tokenObject.accessToken);
            syncAccount.accountId = tokenObject.accountId;
            syncAccount.id = syncAccount.uid = tokenObject.uid;
            syncProvider.getAccount()
                .then(account => {
                    syncAccount.title = account.displayName;
                    this.syncService.persistConnection(syncAccount)
                        .then(result => {
                            // show actual connected accounts for choose
                            console.debug('persist connection result', result);
                            this.store.dispatch(new UpdateConfigAction(this.config.localConfig));
                        });
                });
        };
    }

    public deleteAccount(con: SyncProviderAccount) {
        this.config.deleteSyncAccount(con);
    }
}
