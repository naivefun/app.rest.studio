import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultHttpRequest, HttpRequestParam } from '../../../@model/http/http-request';
import { DefaultHttpResponse, ResponseView } from '../../../@model/http/http-response';
import * as _ from 'lodash';
import { toAxiosOptions } from '../../../@utils/request.utils';
import { generateSchema } from '../../../@utils/schema.utils';

@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent implements OnChanges {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;

    public availableViews = [ResponseView.PREVIEW];
    public view = ResponseView.PREVIEW;
    private responseObject: Object;
    private previewRequest: any;
    private schema: Object;

    public ngOnChanges(changes: SimpleChanges): void {
        console.debug('response changes', changes);
        let request = changes['request'];
        if (request && request.currentValue) {
            this.toRequestPreview(request.currentValue);
        }
        let response = changes['response'];
        if (response && response.currentValue) {
            this.view = this.response.view || ResponseView.BODY;
            this.availableViews = [ResponseView.PREVIEW, ResponseView.BODY, ResponseView.HEADER];
            // TODO: try parse data
            try {
                // this.responseObject = JSON.parse(this.response.data);
                this.responseObject = {
                    username: '',
                    password: '',
                    age: 123
                };
                this.schema = this.getSchema();
                this.availableViews.push(ResponseView.SCHEMA);
            } catch (_) {
                console.debug('response data is not object', this.response.data);
            }
        } else {
            this.availableViews = [ResponseView.PREVIEW];
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

    private getSchema() {
        if (!this.schema && this.responseObject) {
            this.schema = generateSchema(this.responseObject, 'Response Schema');
        }
        return this.schema;
    }
}
