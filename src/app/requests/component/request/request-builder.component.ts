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
    HttpRequestParam,
    ParamField
} from '../../../@model/http/http-request';
import { HeaderPickerComponent } from '../../../@shared/components/header-picker.component';
import { bodyMode2TextMode } from '../../../@utils/request.utils';
import { shortid } from '../../../@utils/string.utils';
import { queryString2Object } from '../../../@utils/url.utils';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html',
    styles: [`
        .section {
            padding: 1em;
        }

        .section .header {
            padding-bottom: .2em;
            border-bottom: 1px solid #ddd;
            margin-bottom: .3em;
            padding-right: .5em;
            font-family: Raleway;
            font-weight: 600;
            font-size: 12px;
            color: #555;
        }
    `]
})
export class RequestBuilderComponent implements OnChanges {

    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Output() public onRequestUpdated = new EventEmitter<DefaultHttpRequest>();
    @Output() public onSendRequest = new EventEmitter<DefaultHttpRequest>();
    public iRequest: DefaultHttpRequest; // internal request

    public $BodyEditor = BodyEditor;
    public methods = HTTP_METHODS;
    public off: any = {};
    public modes: BodyMode[] = BODY_MODES;
    public bodyEditor: BodyEditor;
    public editorMode: TextMode;

    @ViewChild('urlInput')
    private urlInput: ElementRef;
    @ViewChild('headerPicker')
    private headerPicker: HeaderPickerComponent;

    public ngOnChanges(changes: SimpleChanges): void {
        let request = changes['request'];
        if (request && request.currentValue) {
            this.reset(request.isFirstChange());
        }

        console.debug('[requestBuilder] changes', changes);
    }

    // region UI
    public disableField(field: string) {
        console.debug('disable', field, ParamField[field]);
    }

    public toggleField(field: string) {
        this.off[field] = !!!this.off[field];
    }

    public setBodyMode(mode: BodyMode) {
        this.iRequest.mode = mode;
        if (_.includes(FORM_BODY_MODES, mode)) {
            this.bodyEditor = BodyEditor.FORM;
        } else if (_.includes(EDITOR_BODY_MODES, mode)) {
            this.bodyEditor = BodyEditor.EDITOR;
        } else if (_.includes(BIN_BODY_MODES, mode)) {
            this.bodyEditor = BodyEditor.BIN;
        } else {
            delete this.bodyEditor;
        }

        this.editorMode = bodyMode2TextMode(this.iRequest.mode);
    }

    // endregion

    // region update request
    public setMethod(method: HttpMethod) {
        this.iRequest.method = method;
        this.emitChanges();
    }

    public updateBody(text: string) {
        this.iRequest.body = text;
        this.emitChanges();
    }

    public updateDescription(text: string) {
        this.iRequest.description = text;
        this.emitChanges();
    }

    public extractQuery() {
        let queryObject = queryString2Object(this.iRequest.url);
        if (!_.isEmpty(queryObject)) {
            _.forOwn(queryObject, (value, key) => {
                if (key)
                    this.request.queryParams.push({
                        id: shortid(), off: false,
                        key, value
                    });
            });

            this.iRequest.queryParams = _.cloneDeep(this.request.queryParams);
            this.iRequest.url = this.request.url.split('?')[0];
            this.emitChanges();
        }
    }

    // endregion

    // region events
    public run() {
        console.debug('[RequestBuilder] to run request', this.iRequest);
        this.onSendRequest.emit(this.iRequest);
    }

    public addHeaders(headerNames: string[]) {
        if (!_.isEmpty(headerNames)) {
            headerNames.forEach(name => {
                this.iRequest.headerParams.push(new HttpRequestParam(name));
            });
            this.emitChanges();
        }
    }

    public pickHeaders() {
        this.headerPicker.show();
    }

    public emitChanges() {
        this.onRequestUpdated.emit(this.iRequest);
    }

    // endregion

    private reset(firstChange: boolean) {
        // realtime update break input focus
        // if request is not switch, skip reset
        if (this.iRequest && this.iRequest.id === this.request.id) {
            return;
        }

        this.iRequest = _.cloneDeep(this.request);
        this.setBodyMode(this.iRequest.mode);
        if (firstChange) {
            setTimeout(() => {
                if (this.urlInput && this.urlInput.nativeElement) {
                    this.urlInput.nativeElement.focus();
                }
            }, 100);
        }
    }
}

enum BodyEditor {
    FORM,
    EDITOR,
    BIN
}
