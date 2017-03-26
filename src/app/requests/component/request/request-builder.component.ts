import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DefaultHttpRequest, HTTP_METHODS, HttpMethod } from '../../../@model/http/http-request';
import * as _ from 'lodash';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html'
})
export class RequestBuilderComponent implements OnChanges {

    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Output() public requestUpdated = new EventEmitter<DefaultHttpRequest>();
    public methods = HTTP_METHODS;

    private _request: DefaultHttpRequest; // internal request

    public ngOnChanges(changes: SimpleChanges): void {
        let request = changes['request'];
        if (request && request.currentValue) {
            this.reset();
        }

        console.debug('[requestBuilder] changes', changes);
    }

    public setMethod(method: HttpMethod) {
        this._request.method = method;
        this.emitChanges();
    }

    public run() {
        console.debug('value', this._request);
    }

    public reset() {
        this._request = _.cloneDeep(this.request);
    }

    public emitChanges() {
        this.requestUpdated.emit(this._request);
    }
}
