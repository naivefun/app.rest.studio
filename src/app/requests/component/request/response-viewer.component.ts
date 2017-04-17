import {
    AfterViewInit,
    Component, EventEmitter, HostBinding, Input,
    OnChanges, Output, SimpleChanges, ViewChild
}
    from '@angular/core';
import {
    DefaultHttpRequest, HttpRequestParam
}
    from '../../../@model/http/http-request';
import {
    DefaultHttpResponse, ResponseView
}
    from '../../../@model/http/http-response';
import * as _ from 'lodash';
import { toAxiosOptions } from '../../../@utils/request.utils';
import { generateSchema } from '../../../@utils/schema.utils';
import {
    isBinaryString, stringifyJson, stringifyYaml, tryParseAsObject
}
    from '../../../@utils/string.utils';
import { TextMode } from '../../../@model/editor';
import { TextEditorComponent } from '../../../@shared/components/text-editor.component';
import * as Clipboard from 'clipboard';
import * as dropbox from 'dropbox';
import * as gapi from 'googleapis';

declare var global_: any;
@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent implements OnChanges, AfterViewInit {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;

    @Output() public onClearResponse = new EventEmitter<string>();

    @ViewChild('editor')
    public editor: TextEditorComponent;

    public bodyString: string;
    public duration: number;
    public previewable: boolean; // TODO: html, image, downloadable
    public bodyTextMode: TextMode = TextMode.JAVASCRIPT;
    public availableViews = [ResponseView.REQUEST];
    public view = ResponseView.REQUEST;
    public shareView = false;
    @HostBinding('class.full-screen')
    public fullScreen = false;
    private responseObject: Object;
    private digestObject: Object;
    private previewRequest: any;
    private schema: Object;

    public ngAfterViewInit() {
        console.debug('dropbox', dropbox);
        return;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.debug('ResponseViewerComponent response changes', changes);
        let request = changes['request'];
        if (request && request.currentValue) {
            this.toRequestPreview(request.currentValue);
        }
        let response = changes['response'];
        if (response && response.currentValue) {
            if (this.response.timeSpan) {
                this.duration = this.response.timeSpan.end - this.response.timeSpan.start;
            }
            this.view = this.response.view || ResponseView.BODY;
            this.availableViews = [ResponseView.REQUEST, ResponseView.BODY, ResponseView.HEADER];
            this.bodyTextMode = this.guessMode(this.response.headers);
            this.previewable = _.includes([TextMode.HTML], this.bodyTextMode); // TODO: support image and file download
            let data = this.response.data;
            if (data)
                try {
                    if (_.isObject(data)) {
                        this.responseObject = data;
                        this.bodyString = stringifyJson(data);
                    } else if (_.isString(data)) {
                        if (_.includes([TextMode.JSON, TextMode.YAML], this.bodyTextMode)) {
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

        let copyable = new Clipboard('.copy');
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
            let result = {};
            params.forEach(param => {
                if (!param.off) {
                    result[param.key] = param.value;
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
        this.previewRequest = toAxiosOptions(request);
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
                    value[key] = truncate(value[key]);
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
        let dbx = new dropbox({clientId: 'eeiyjdaf41jyfy0'});
        let authUrl = dbx.getAuthenticationUrl('http://localhost:3000/assets/auth/dropbox.html');
        let win = window.open(authUrl, 'auth');
        global_.onReceiveDropboxToken = url => {
            win.close();
            alert(url);
        };

        // let access_token = 'wHN2W8bN5aAAAAAAAAAADQ_apZXph-pZymF7diebrOp8SWOvsqOxIW7U9arWzHH4';
        // let dbx = new dropbox({ accessToken: access_token });
        // dbx.filesListFolder({path: '', recursive: false, include_media_info: false,
        // include_deleted: false, include_has_explicit_shared_members: false})
        //     .then(function(response) {
        //         console.debug('response', response);
        //     })
        //     // NOTE: Need to explicitly specify type of error here, since TypeScript cannot infer it.
        //     // The type is mentioned in the TSDoc for filesListFolder, so hovering over filesListFolder
        //     // in a TS-equipped editor (e.g., Visual Studio Code) will show you that documentation.
        //     .catch(function(error) {
        //         console.error(error);
        //     });
        // dbx.filesUpload({path: '/app.rest.studio/hello.txt', contents: 'Hello world'})
        //     .then(function(response) {
        //         console.log(response);
        //     })
        //     .catch(function(error) {
        //         console.error(error);
        //     });
    }

    // endregion

    private getRenderObject() {
        return this.digestObject || this.responseObject;
    }

    private getSchema() {
        if (!this.schema && this.responseObject) {
            this.schema = generateSchema(this.responseObject, 'Response Schema');
        }
        return this.schema;
    }

    private reset() {
        delete this.bodyString;
        delete this.duration;
        this.availableViews = [ResponseView.REQUEST];
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
                return TextMode.HJSON;
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
