import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import * as Clipboard from 'clipboard';
import * as dropbox from 'dropbox';
import * as _ from 'lodash';
import { TextMode } from '../../../@model/editor';
import { DefaultHttpRequest, HttpRequestParam } from '../../../@model/http/http-request';
import { DefaultHttpResponse, ResponseView } from '../../../@model/http/http-response';
import { CloudMapping, SyncProviderAccount } from '../../../@model/sync';
import { BaseComponent } from '../../../@shared/components/base.component';
import { TextEditorComponent } from '../../../@shared/components/text-editor.component';
import { ConfigService, LocalConfig } from '../../../@shared/config.service';
import { CloudSyncProvider } from '../../../@shared/sync/dropbox.service';
import { SyncService } from '../../../@shared/sync/sync.service';
import { compressObject, sortByKeys, sortKeys } from '../../../@utils/object.utils';
import { toAxiosOptions } from '../../../@utils/request.utils';
import { generateSchema } from '../../../@utils/schema.utils';
import { stringifyJson, stringifyYaml, tryParseAsObject } from '../../../@utils/string.utils';
import * as Fuse from 'fuse.js';
import { SelectedPathObject } from '../../../@shared/components/cloud-file-picker.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DB, DbService } from '../../../@shared/db.service';
import { AlertService } from '../../../@shared/alert.service';
import { translateHttpError } from '../../../@utils/error.utils';

declare var global_: any, Dropbox: any, $: any;
@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent extends BaseComponent implements OnChanges, AfterViewInit {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;
    @Input() public syncAccounts: SyncProviderAccount[];

    @Output() public onClearResponse = new EventEmitter<string>();
    @Output() public onRequestUpdated = new EventEmitter<DefaultHttpRequest>();

    @ViewChild('editor')
    public editor: TextEditorComponent;
    @ViewChild('cloudPathInput')
    public cloudPathInput: ElementRef;

    public bodyString: string;
    public duration: number;
    public bodyTextMode: TextMode = TextMode.JSON;
    public availableViews = [ ResponseView.REQUEST ];
    public view = ResponseView.REQUEST;
    public shareView = false;
    public noOfConnections = 0;
    public defaultMapping: CloudMapping;
    public uploading: boolean;
    public downloading: boolean;
    @HostBinding('class.full-screen')
    public fullScreen = false;
    public creatingMapping: boolean;
    private responseObject: Object;
    private digestObject: Object;
    private previewRequest: any;
    private schema: Object;

    constructor(private config: ConfigService,
                private db: DbService,
                private alertService: AlertService,
                private syncService: SyncService) {
        super();
    }

    public ngAfterViewInit() {
        console.debug('dropbox', dropbox);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        console.debug('ResponseViewerComponent response changes', changes);
        let request = changes[ 'request' ];
        if (request && request.currentValue) {
            this.defaultMapping = this.request.cloudMapping;
            this.toRequestPreview(request.currentValue);
        }
        let response = changes[ 'response' ];
        if (response && response.currentValue) {
            if (this.response.timeSpan) {
                this.duration = this.response.timeSpan.end - this.response.timeSpan.start;
            }
            this.view = this.response.view || ResponseView.BODY;
            this.availableViews = [ ResponseView.REQUEST, ResponseView.BODY, ResponseView.HEADER ];
            this.bodyTextMode = this.guessMode(this.response.headers);

            let data = this.response.data;
            if (data)
                try {
                    if (_.isObject(data)) {
                        this.responseObject = data;
                        this.bodyString = stringifyJson(data);
                    } else if (_.isString(data)) {
                        if (_.includes([ TextMode.JSON, TextMode.YAML ], this.bodyTextMode)) {
                            this.responseObject = tryParseAsObject(data);
                        }

                        this.bodyString = data;
                        console.debug('mode', this.response.headers, this.bodyTextMode);
                        console.debug('isBinary string', /[\x00-\x08\x0E-\x1F]/.test(data));
                    } else {
                        delete this.responseObject;
                        delete this.bodyString;
                    }

                    if (this.responseObject) {
                        this.schema = this.getSchema();
                        this.availableViews.push(ResponseView.SCHEMA);
                    }
                } catch (_) {
                    console.debug('response data is not object', data);
                }
        } else {
            this.reset();
        }

        this.onChange(changes, 'syncAccounts', value => {
            this.noOfConnections = _.size(value);
        });

        let copyable = new Clipboard('.copy');
    }

    public updateMapping(mapping: CloudMapping) {
        this.request.cloudMapping = mapping;
    }

    public onSyncPathUpdated(pathInfo: SelectedPathObject) {
        let mapping = this.request.cloudMapping = this.request.cloudMapping || new CloudMapping();
        mapping.path = pathInfo.path;
        mapping.syncAccountId = pathInfo.syncAccount.id;
    }

    public switchView(view: ResponseView) {
        if (this.response) {
            this.response.view = view;
        }

        this.view = view;
    }

    public toggleFullScreen() {
        this.fullScreen = !this.fullScreen;
        setTimeout(() => {
            this.editor.onWindowResize();
        }, 50);
    }

    public filterJson(e) {
        let keywords = _.trim(e.target.value);
        if (keywords) {
            let fuse = new Fuse([ this.responseObject ], {});
            let result = fuse.search(keywords);
            this.bodyString = stringifyJson(result);
            alert(this.bodyString);
        }
    }

    /**
     * remove extra fields [id, ...] for preview
     * @param request
     * @returns {DefaultHttpRequest}
     */
    public toRequestPreview(request: DefaultHttpRequest) {
        let req: any = {};
        req.method = request.method;
        req.url = request.url;
        let ripParams = (params: HttpRequestParam[]) => {
            if (_.isEmpty(params)) return undefined;
            let result = {};
            params.forEach(param => {
                if (!param.off) {
                    result[ param.key ] = param.value;
                }
            });
            return result;
        };

        req.queryParams = ripParams(request.queryParams);
        req.headerParams = ripParams(request.headerParams);
        req.formParams = ripParams(request.formParams);
        req.pathParams = ripParams(request.pathParams);

        if (_.isEmpty(req.queryParams)) delete req.queryParams;
        if (_.isEmpty(req.headerParams)) delete req.headerParams;
        if (_.isEmpty(req.formParams)) delete req.formParams;
        if (_.isEmpty(req.pathParams)) delete req.pathParams;

        // this.previewRequest = req;
        // this.previewRequest = toAxiosOptions(request);
        console.debug('toRequestPreview', req);
        this.previewRequest = compressObject(_.cloneDeep(req), undefined,
            {
                keysToRemove: [ 'defaultBindId', 'sharedLink', 'cloudMapping' ]
            });
    }

    public sharedRequest(minified = true) {
        return '';
    }

    public clearResponse() {
        this.onClearResponse.emit(this.request.id);
    }

    public viewAsJson() {
        if (this.responseObject) {
            this.bodyString = stringifyJson(this.getRenderObject());
            this.bodyTextMode = TextMode.JAVASCRIPT;
        }
    }

    public viewAsYaml() {
        if (this.responseObject) {
            this.bodyString = stringifyYaml(this.getRenderObject());
            this.bodyTextMode = TextMode.YAML;
        }
    }

    public viewAsHtml() {
        this.bodyTextMode = TextMode.HTML;
    }

    public viewAsXml() {
        this.bodyTextMode = TextMode.XML;
    }

    /**
     * truncate array
     * @param upTo
     */
    public digest(upTo = 2) {
        let truncate = (value) => {
            if (_.isArray(value)) {
                let val = _.take(value, upTo);
                _.forEach(val, item => {
                    truncate(item);
                });
                return val;
            } else if (_.isObject(value)) {
                _.keys(value).forEach(key => {
                    value[ key ] = truncate(value[ key ]);
                });
            }
            return value;
        };

        if (this.responseObject) {
            this.digestObject = _.cloneDeep(this.responseObject);
            this.digestObject = truncate(this.digestObject);
            this.viewAsJson();
        }
    }

    // region share
    public shareRequest() {
        this.shareView = true;
    }

    public copyShare() {
        return;
    }

    public downloadShare() {
        return;
    }

    public googleShare() {
        return;
    }

    public dropboxShare() {
        return;
    }

    public saveToCloud() {
        let path = this.cloudPathInput.nativeElement.value;
        let provider = this.getProvider(this.request.defaultBindId);
        if (provider) {
            let content = JSON.stringify(sortKeys(
                compressObject(this.request, undefined,
                    {
                        defaultValues: { method: 'GET' },
                        keysToRemove: [ 'defaultBindId', 'sharedLink' ]
                    })
            ));
            provider.saveFile(path, content, 'application/json')
                .then(result => {
                    console.debug('save file result', result);
                });
        }
    }

    public saveMapping(mapping: CloudMapping) {
        this.request.cloudMapping = mapping;
        this.onRequestUpdated.emit(this.request);
        delete this.creatingMapping;
    }

    public downloadFromCloud() {
        let path = this.cloudPathInput.nativeElement.value;
        let provider = this.getProvider(this.request.defaultBindId);
        if (provider) {
            provider.getFile(path)
                .then(result => {
                    console.debug('download file result', result);
                });
        }
    }

    public showFilePicker() {
        $('#cloud-file-picker').modal('show');
    }

    public generateSahredLink() {
        let path = this.cloudPathInput.nativeElement.value;
        let provider = this.getProvider(this.request.defaultBindId);
        if (provider) {
            provider.createSharedLink(path)
                .then(url => {
                    // TODO: persist to DB & Upload again
                    this.request.sharedLink = url;
                });
        }
    }

    public deleteMapping() {
        delete this.request.cloudMapping;
        this.onRequestUpdated.emit(this.request);
    }

    public upload(mapping?: CloudMapping) {
        mapping = mapping || this.request.cloudMapping;
        this.uploading = true;
        this.getSyncProvider(mapping.syncAccountId)
            .then(provider => {
                let content = JSON.stringify(sortByKeys(
                    compressObject(_.cloneDeep(this.request), undefined,
                        {
                            defaultValues: { method: 'GET' },
                            keysToRemove: [ 'defaultBindId', 'sharedLink', 'cloudMapping' ]
                        }),
                    [ 'id', 'title', 'url', 'method', 'headerParams' ]
                ), null, 2);
                return provider.saveFile(mapping.pathDisplay, content)
                    .then(result => Promise.resolve(true));
            })
            .then(result => {
                this.alertService.successQuick('uploaded ' + result);
                this.uploading = false;
            })
            .catch(error => {
                this.alertService.error(translateHttpError(error));
                this.uploading = false;
            });
    }

    public download(mapping?: CloudMapping) {
        mapping = mapping || this.request.cloudMapping;
        this.downloading = true;
        this.getSyncProvider(mapping.syncAccountId)
            .then(provider => {
                return provider.getFile(mapping.pathDisplay)
                    .then((data: any) => {
                        if (_.isObject(data)) {
                            let id = data.id;
                            if (id) {
                                return this.db.getPromise(id, DB.REQUESTS)
                                    .then(req => {
                                        req = this.mergeRequest(data, req);
                                        return this.db.savePromise(req, DB.REQUESTS)
                                            .then(result => {
                                                this.onRequestUpdated.emit(req);
                                                return result;
                                            });
                                    });
                            } else throw new Error('object id is missing');
                        }
                    });
            })
            .then(result => {
                this.alertService.successQuick('Content is loaded');
                this.downloading = false;
            })
            .catch(error => {
                this.alertService.error(error.message);
                this.downloading = false;
            });
    }

    public mergeRequest(source: DefaultHttpRequest, target: DefaultHttpRequest) {
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

    // endregion

    private getProvider(id: string): CloudSyncProvider {
        let conn = this.syncAccounts.find(con => con.id === id);
        if (conn) {
            let provider = this.syncService.syncProvider(conn.provider, conn.accessToken);
            return provider;
        }
    }

    private getRenderObject() {
        return this.digestObject || this.responseObject;
    }

    private getSchema() {
        if (!this.schema && this.responseObject) {
            this.schema = generateSchema(this.responseObject, 'Response Schema');
        }
        return this.schema;
    }

    private getSyncProvider(accountId: string): Promise<CloudSyncProvider> {
        return this.config.getConfig()
            .then((config: LocalConfig) => {
                let account = config.connectedAccounts.find(_account => _account.id === accountId);
                let provider = this.syncService.syncProvider(account.provider, account.accessToken);
                return provider;
            });
    }

    private reset() {
        delete this.bodyString;
        delete this.duration;
        this.availableViews = [ ResponseView.REQUEST ];
        this.view = ResponseView.REQUEST;
    }

    private guessMode(headers: Object): TextMode {
        let contentType;
        _.forOwn(headers, (value, key) => {
            if (_.trim(_.lowerCase(key)) === 'content type') {
                contentType = _.lowerCase(value);
                return false;
            }
        });

        console.debug('contentType value', contentType);
        if (contentType) {
            let contains = (target) => _.includes(contentType, target);
            if (contains('json'))
                return TextMode.JSON;
            else if (contains('xml'))
                return TextMode.XML;
            else if (contains('html'))
                return TextMode.HTML;
            else if (contains('markdown'))
                return TextMode.MARKDOWN;
            else if (contains('yaml'))
                return TextMode.YAML;
            else if (contains('css'))
                return TextMode.CSS;
        }

        return TextMode.TEXT; // TODO: detect binary/stream
    }
}
