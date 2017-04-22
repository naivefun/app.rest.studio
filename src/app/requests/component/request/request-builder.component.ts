import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { TextMode } from '../../../@model/editor';
import {
    BIN_BODY_MODES,
    BODY_MODES,
    BodyMode,
    DefaultHttpRequest,
    EDITOR_BODY_MODES,
    FORM_BODY_MODES,
    HTTP_METHODS,
    HttpMethod,
    ParamField
} from '../../../@model/http/http-request';
import { bodyMode2TextMode } from '../../../@utils/request.utils';
import { shortid } from '../../../@utils/string.utils';
import { queryString2Object } from '../../../@utils/url.utils';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html',
    styles: [ `
        .section {
            padding: 1em;
        }

        .section .header {
            padding-bottom: .2em;
            border-bottom: 1px solid #ddd;
            margin-bottom: .3em;
            padding-right: .5em;
        }
    ` ]
})
export class RequestBuilderComponent implements OnChanges {

    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Output() public onRequestUpdated = new EventEmitter<DefaultHttpRequest>();
    @Output() public onSendRequest = new EventEmitter<DefaultHttpRequest>();
    public methods = HTTP_METHODS;
    public off: any = {};
    public modes: BodyMode[] = BODY_MODES;
    public bodyEditor: string;
    public editorMode: TextMode;

    public _request: DefaultHttpRequest; // internal request
    @ViewChild('urlInput')
    private urlInput: ElementRef;

    public ngOnChanges(changes: SimpleChanges): void {
        let request = changes[ 'request' ];
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
        console.debug('disable', field, ParamField[ field ]);
    }

    public toggoleField(field: string) {
        this.off[ field ] = !!!this.off[ field ];
    }

    public run() {
        console.debug('value', this._request);
        this.onSendRequest.emit(this._request);
    }

    public reset(firstChange: boolean) {
        this._request = _.cloneDeep(this.request);
        setTimeout(() => {
            if (this.urlInput && this.urlInput.nativeElement) {
                this.urlInput.nativeElement.focus();
            }
        }, 100);
        this.setMode(this._request.mode);
    }

    public setMode(mode: BodyMode) {
        this._request.mode = mode;
        if (_.includes(FORM_BODY_MODES, mode)) {
            this.bodyEditor = 'form';
        } else if (_.includes(EDITOR_BODY_MODES, mode)) {
            this.bodyEditor = 'editor';
        } else if (_.includes(BIN_BODY_MODES, mode)) {
            this.bodyEditor = 'bin';
        } else {
            delete this.bodyEditor;
        }
        this.updateEditorMode();
    }

    public updateEditorMode() {
        this.editorMode = bodyMode2TextMode(this._request.mode);
    }

    public updateBody(text: string) {
        this._request.body = text;
    }

    public extractQuery() {
        let queryObject = queryString2Object(this._request.url);
        if (!_.isEmpty(queryObject)) {
            _.forOwn(queryObject, (value, key) => {
                if (value || key)
                    this.request.queryParams.push({
                        id: shortid(), off: false,
                        key, value
                    });
            });

            this.request.queryParams = _.clone(this.request.queryParams);
            this.request.url = this.request.url.split('?')[ 0 ];
        }
    }

    public selectHeaders() {
        throw new Error('not implemented');
    }

    public emitChanges() {
        this.onRequestUpdated.emit(this._request);
    }
}
