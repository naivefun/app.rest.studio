import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DefaultHttpRequest, HTTP_METHODS, HttpMethod } from '../../../@model/http/http-request';
import * as _ from 'lodash';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html',
    styles: [`
        .section {
            padding: 1em;
        }
    `]
})
export class RequestBuilderComponent implements OnChanges {

    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Output() public requestUpdated = new EventEmitter<DefaultHttpRequest>();
    public methods = HTTP_METHODS;

    private _request: DefaultHttpRequest; // internal request
    @ViewChild('urlInput')
    urlInput: ElementRef;

    public ngOnChanges(changes: SimpleChanges): void {
        let request = changes['request'];
        if (request && request.currentValue) {
            this.reset(request.isFirstChange());
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

    public reset(firstChange: boolean) {
        this._request = _.cloneDeep(this.request);
        setTimeout(() => {
            if (this.urlInput && this.urlInput.nativeElement) {
                this.urlInput.nativeElement.focus();
            }
        }, 100);
    }

    public emitChanges() {
        this.requestUpdated.emit(this._request);
    }
}
