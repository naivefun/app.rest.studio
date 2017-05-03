import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
    REQ_NON_STANDARD_HEADERS, REQ_STANDARD_HEADERS, RES_NON_STANDARD_HEADERS,
    RES_STANDARD_HEADERS
} from '../constants';
import { BaseDialogComponent } from './base-dialog.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
    selector: 'header-picker',
    template: `
        <div id="{{dialogId}}" class="modal fade">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Header Picker</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-end">
                            <div class="mr-auto p-2">
                                <a class="option" [ngClass]="{on: !responseMode}" (click)="toggleHeaders()">Request
                                    Headers</a>
                                <a class="option" [ngClass]="{on: responseMode}" (click)="toggleHeaders(true)">Response
                                    Headers</a>
                            </div>
                            <div class="p-2">
                                <input #filter class="form-control" placeholder="filter"
                                       (keyup)="filterWordsChanged($event.target.value)"/>
                            </div>
                        </div>

                        <hr/>
                        <div class="margin-v">
                            <div class="margin-v">
                                <div class="b">Standard Header</div>
                                <div class="row" style="line-height: 180%;">
                                    <div class="col-md-4"
                                         *ngFor="let header of (responseMode ? standardResponseHeaders : standardRequestHeaders)">
                                        <a class="option" [ngClass]="{on: header.on}"
                                           (click)="header.on = !header.on"><i
                                                class="fa fa-check" *ngIf="header.on"></i> {{header.header}}</a>
                                    </div>
                                </div>
                            </div>

                            <hr/>
                            <div class="margin-v">
                                <div class="b">Non Standard Header</div>
                                <div class="row" style="line-height: 180%;">
                                    <div class="col-md-4"
                                         *ngFor="let header of (responseMode ? nonStandardResponseHeaders : nonStandardRequestHeaders)">
                                        <a class="option" [ngClass]="{on: header.on}"
                                           (click)="header.on = !header.on"><i
                                                class="fa fa-check" *ngIf="header.on"></i> {{header.header}}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" (click)="ok()">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HeaderPickerComponent extends BaseDialogComponent implements OnInit {

    @Output() public onHeadersPicker = new EventEmitter<string[]>();

    public standardRequestHeaders: HeaderObject[] = [];
    public nonStandardRequestHeaders: HeaderObject[] = [];
    public standardResponseHeaders: HeaderObject[] = [];
    public nonStandardResponseHeaders: HeaderObject[] = [];

    public responseMode: boolean;

    private _standardRequestHeaders: HeaderObject[] = [];
    private _nonStandardRequestHeaders: HeaderObject[] = [];
    private _standardResponseHeaders: HeaderObject[] = [];
    private _nonStandardResponseHeaders: HeaderObject[] = [];
    private textChanged: Subject<string> = new Subject();
    private textChanged$: Observable<string> = this.textChanged.asObservable()
        .debounceTime(1000)
        .distinctUntilChanged();
    @ViewChild('filter')
    private filter: ElementRef;

    constructor(private cd: ChangeDetectorRef) {
        super(cd);
    }

    public ngOnInit() {
        this.init();
        this.textChanged$.subscribe(word => {
            console.debug('filter word ', word);
            this.filterHeaders(word);
            this.refresh(true);
        });
    }

    public init() {
        this.standardRequestHeaders = this._standardRequestHeaders = this.convertRawHeaders(REQ_STANDARD_HEADERS);
        this.nonStandardRequestHeaders = this._nonStandardRequestHeaders = this.convertRawHeaders(REQ_NON_STANDARD_HEADERS);
        this.standardResponseHeaders = this._standardResponseHeaders = this.convertRawHeaders(RES_STANDARD_HEADERS);
        this.nonStandardResponseHeaders = this._nonStandardResponseHeaders = this.convertRawHeaders(RES_NON_STANDARD_HEADERS);
    }

    public toggleHeaders(isResponse: boolean = false) {
        this.responseMode = isResponse;
    }

    public filterHeaders(filter: string) {
        this.standardRequestHeaders = this.doFilterHeaders(this._standardRequestHeaders, filter);
        this.nonStandardRequestHeaders = this.doFilterHeaders(this._nonStandardRequestHeaders, filter);
        this.standardResponseHeaders = this.doFilterHeaders(this._standardResponseHeaders, filter);
        this.nonStandardResponseHeaders = this.doFilterHeaders(this._nonStandardResponseHeaders, filter);
    }

    public doFilterHeaders(headers: any[], filter: string) {
        filter = _.trim(filter);
        if (filter) {
            headers = headers.filter(header => {
                return _.lowerCase(header.header).includes(filter);
            });
        }
        return headers;
    }

    public convertRawHeaders(rawHeaders: string[], filter?: string): HeaderObject[] {
        let headers = rawHeaders.map(header => {
            return { on: false, header };
        });
        filter = _.trim(filter);
        if (filter) {
            headers = headers.filter(header => {
                return _.lowerCase(header.header).includes(filter);
            });
        }

        return headers;
    }

    public selectedHeaders() {
        return [ ...this._standardRequestHeaders, ...this._nonStandardRequestHeaders,
            ...this._standardResponseHeaders, ...this._nonStandardResponseHeaders ]
            .filter(header => header.on && header.header)
            .map(header => header.header);
    }

    public show() {
        this.init();
        super.show();
        this.filter.nativeElement.value = '';
        setTimeout(() => {
            this.filter.nativeElement.focus();
        }, 700);
    }

    public ok() {
        this.onHeadersPicker.emit(this.selectedHeaders());
        this.hide();
    }

    public filterWordsChanged(word: string) {
        this.textChanged.next(word);
    }
}

export interface HeaderObject {
    header: string;
    on?: boolean;
}
