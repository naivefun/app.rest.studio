import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { DefaultHttpRequest } from '../@model/http/http-request';
import { CloudFile, CloudMapping, SyncObjectType, SyncProviderAccount } from '../@model/sync';
import { AlertService } from '../@shared/alert.service';
import { BaseComponent } from '../@shared/components/base.component';
import { CloudFilePickerComponent, SelectedPathObject } from '../@shared/components/cloud-file-picker.component';
import { TextEditorComponent } from '../@shared/components/text-editor.component';
import { ConfigService } from '../@shared/config.service';
import { DB, DbService } from '../@shared/db.service';
import { DefaultHttpClient } from '../@shared/http.service';
import { SyncService } from '../@shared/sync/sync.service';
import { parseJson } from '../@utils/string.utils';
import { State } from '../store/reducer';
import { getConnections } from '../store/selector';

@Component({
    selector: 'import',
    templateUrl: './import.component.html'
})
export class ImportComponent extends BaseComponent {
    public syncAccounts$: Observable<SyncProviderAccount[]>;
    public selectedPath: string;
    public content: string;

    private selectedSyncAccount: SyncProviderAccount;
    @ViewChild('pathPicker')
    private pathPicker: CloudFilePickerComponent;
    @ViewChild('editor')
    private editor: TextEditorComponent;

    constructor(public config: ConfigService,
                private syncService: SyncService,
                private alertService: AlertService,
                private httpClient: DefaultHttpClient,
                private db: DbService,
                private store: Store<State>) {
        super();
        this.syncAccounts$ = store.select(getConnections);
    }

    public loadDropboxFiles(path: string, account: SyncProviderAccount) {
        let syncProvider = this.syncService.syncProvider(
            account.provider, account.accessToken);
        syncProvider.listFiles(path)
            .then((files: CloudFile[]) => {
                console.debug('path', path, 'files', files);
            });
    }

    public loadDropboxFile(path: string, account: SyncProviderAccount) {
        let syncProvider = this.syncService.syncProvider(
            account.provider, account.accessToken);
        syncProvider.getFile(path)
            .then(content => {
                let request = parseJson(content);
                if (request) {
                    this.saveToLocal(request)
                        .then(result => {
                            console.debug('save to local result', result);
                        });
                }
            });
    }

    public saveToLocal(object: any) {
        let id = object.id, type: SyncObjectType = object.syncType;
        if (id) {
            return this.db.getPromise(id, DB.REQUESTS)
                .then(request => {
                    request = this.mergeRequest(request, object);
                    return this.db.savePromise(request, DB.REQUESTS);
                });
        } else {
            return this.db.savePromise(object, DB.REQUESTS);
        }
    }

    // should download file directly
    public pathSelected(pathObject: SelectedPathObject) {
        this.selectedPath = pathObject.path;
        this.selectedSyncAccount = pathObject.syncAccount;
        this.pathPicker.hide();
        this.downloadFile();
    }

    public selectPath() {
        this.pathPicker.show();
    }

    public getSelectedFileMetadata() {
        let provider = this.syncService.syncProvider(this.selectedSyncAccount.provider,
            this.selectedSyncAccount.accessToken);
        provider.getMetaData(this.selectedPath)
            .then(meta => {
                console.debug(JSON.stringify(meta));
            });
    }

    public downloadFile() {
        let provider = this.syncService.syncProvider(this.selectedSyncAccount.provider,
            this.selectedSyncAccount.accessToken);
        provider.getFile(this.selectedPath)
            .then((data: any) => {
                // this.content = JSON.stringify(content, null, 2);
                this.alertService.successQuick('Content is loaded');
                console.debug('data', data);
                if (_.isObject(data)) {
                    let id = data.id;
                    if (id) {
                        this.db.getPromise(id, DB.REQUESTS)
                            .then(req => {
                                req = this.mergeRequest(data, req);

                                // create cloud mapping
                                let mapping = new CloudMapping();
                                mapping.syncAccountId = this.selectedSyncAccount.id;
                                mapping.pathDisplay = this.selectedPath;
                                req.cloudMapping = mapping;

                                this.db.savePromise(req, DB.REQUESTS);
                                this.content = JSON.stringify(req, null, 2);
                            })
                            .catch(error => {
                                alert(error.message);
                            });
                    }
                }
            })
            .catch(error => {
                this.alertService.error(error.message);
                console.error('download file', error, error.code, error.message);
            });
    }

    public importEntity() {
        this.alertService.successQuick('import success');
    }

    public formatJson(text: string) {
        let object = parseJson(text);
        if (object && _.isObject(object)) {
            this.content = JSON.stringify(object, null, 2);
        }
    }

    public downloadSharedLink() {
        let request = new DefaultHttpRequest('https://www.dropbox.com/s/n6m5rwhryott7vv/hello.txt?raw=1');
        this.httpClient.execute(request)
            .then(result => {

            });
    }

    private mergeRequest(source: DefaultHttpRequest, target: DefaultHttpRequest) {
        if (!target) return source;
        [ 'title', 'description', 'url', 'method', 'timeout', 'mode',
            'body', 'createdAt' ].forEach(key => {
            target[ key ] = source[ key ];
        });
        [ 'queryParams', 'headerParams', 'formParams', 'pathParams', 'disabledFields' ]
            .forEach(key => {
                target[ key ] = source[ key ] || [];
            });
        return target;
    }
}
