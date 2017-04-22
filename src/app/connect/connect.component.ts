import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import { Observable } from 'rxjs/Observable';
import { ConnectAccount, ConnectProvider } from '../@model/sync/connect-account';
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
    public connections$: Observable<ConnectAccount[]>;
    public connections: ConnectAccount[];

    constructor(public config: ConfigService,
                private syncService: SyncService,
                private store: Store<State>) {
        this.connections$ = store.select(getConnections);
    }

    public connectDropbox() {
        let connectProvider = this.syncService.connectProvider(ConnectProvider.DROPBOX);
        let authUrl = connectProvider.authUrl(this.syncService.redirectUri(ConnectProvider.DROPBOX));

        let win = window.open(authUrl, 'auth');
        global_['onReceiveDropboxToken'] = url => {
            win.close();
            console.debug('dropbox url', url);

            let identity: any = connectProvider.extractIdentity(url);
            let connectAccount = new ConnectAccount(ConnectProvider.DROPBOX, identity['access_token']);
            connectAccount.accountId = identity['account_id'];
            connectAccount.id = connectAccount.uid = identity['uid'];
            connectProvider.getAccount()
                .then(account => {
                    console.debug('account', account);
                    console.debug('saving account', connectAccount);
                    connectAccount.title = account.name.display_name;
                    this.syncService.persistConnection(connectAccount)
                        .then(result => {
                            // show actual connected accounts for choose
                            console.debug('persist connection result', result);
                            this.store.dispatch(new UpdateConfigAction(this.config.localConfig));
                        });
                });
        };
    }

    public deleteAccount(con: ConnectAccount) {
        this.config.deleteConnectedAccount(con);
    }
}
