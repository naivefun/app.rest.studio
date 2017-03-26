import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultHttpRequest, HttpRequestParam } from '../../../@model/http/http-request';
import { DefaultHttpResponse } from '../../../@model/http/http-response';
import * as _ from 'lodash';

@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent implements OnChanges {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;

    private previewRequest: DefaultHttpRequest;

    public ngOnChanges(changes: SimpleChanges): void {
        let request = changes['request'];
        if (request && request.currentValue) {
            this.toRequestPreview(request.currentValue);
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

        this.previewRequest = req;
    }
}
