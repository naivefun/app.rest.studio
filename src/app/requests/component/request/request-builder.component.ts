import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DefaultHttpRequest, HTTP_METHODS, HttpMethod, ParamField } from '../../../@model/http/http-request';
import * as _ from 'lodash';
import { DefaultHttpClient } from '../../../@shared/http.service';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html',
    styles: [`
        .section {
            padding: 1em;
        }

        .toolbar a.item {
            font-size: .85em;
            cursor: pointer;
            border-radius: .25em;
            background-color: #efefef;
            color: slategray;
            padding: .3em .5em;
            margin: 0 .15em;
            transition-duration: .2s;
            transition-property: all;
        }

        .toolbar a.item:hover {
            font-weight: bold;
        }

        .toolbar a.item.on {
            background-color: #31a0c9;
            color: #fff;
        }
    `]
})
export class RequestBuilderComponent implements OnChanges {

    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Output() public requestUpdated = new EventEmitter<DefaultHttpRequest>();
    @Output() public sendRequest = new EventEmitter<DefaultHttpRequest>();
    public methods = HTTP_METHODS;
    public off: any = {};

    private _request: DefaultHttpRequest; // internal request
    @ViewChild('urlInput')
    private urlInput: ElementRef;

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

    public disableField(field: string) {
        console.debug('disable', field, ParamField[field]);
    }

    public toggoleField(field: string) {
        this.off[field] = !!!this.off[field];
    }

    public run() {
        console.debug('value', this._request);
        this.sendRequest.emit(this._request);
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
