import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DefaultHttpRequest, HttpRequestParam } from '../../../@model/http/http-request';
import { DefaultHttpResponse, ResponseView } from '../../../@model/http/http-response';
import * as _ from 'lodash';
import { toAxiosOptions } from '../../../@utils/request.utils';
import { generateSchema } from '../../../@utils/schema.utils';
import { stringifyJson, stringifyYaml, tryParseAsObject } from '../../../@utils/string.utils';
import { TextMode } from '../../../@model/editor';

@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent implements OnChanges {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;

    @Output() public onClearResponse = new EventEmitter<string>();

    public bodyString: string;
    public bodyTextMode: TextMode = TextMode.JAVASCRIPT;
    public availableViews = [ResponseView.PREVIEW];
    public view = ResponseView.PREVIEW;
    public fullScreen = false;
    private responseObject: Object;
    private digestObject: Object;
    private previewRequest: any;
    private schema: Object;

    public ngOnChanges(changes: SimpleChanges): void {
        console.debug('ResponseViewerComponent response changes', changes);
        let request = changes['request'];
        if (request && request.currentValue) {
            this.toRequestPreview(request.currentValue);
        }
        let response = changes['response'];
        if (response && response.currentValue) {
            this.view = this.response.view || ResponseView.BODY;
            this.availableViews = [ResponseView.PREVIEW, ResponseView.BODY, ResponseView.HEADER];
            // TODO: try parse data
            let data = this.response.data;
            try {
                if (_.isObject(data)) {
                    this.responseObject = data;
                    this.bodyString = stringifyJson(data);
                } else if (_.isString(data)) {
                    this.responseObject = tryParseAsObject(data);
                    this.bodyString = data;
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
    }

    public switchView(view: ResponseView) {
        if (this.response) {
            this.response.view = view;
        }

        this.view = view;
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
        this.availableViews = [ResponseView.PREVIEW];
        this.view = ResponseView.PREVIEW;
    }

    private guessMode() {
        // TODO: detect from header Content-Type
        return TextMode.JAVASCRIPT;
    }
}
