import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpRequestParam } from '../../../../@model/http/http-request';

@Component({
    selector: 'param-item',
    template: `
        <div class="row" style="padding: .25em 0;">
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="parameter key"
                       [(ngModel)]="param.key"
                       (click)="focus($event)"
                       (change)="emitChanges()"/>
            </div>
            <div class="col-md-7">
                <input type="text" class="form-control" placeholder="value"
                       [(ngModel)]="param.value"
                       (click)="focus($event)"
                       (change)="emitChanges()"/>
            </div>
            <div class="col-md-2 icons d-flex justify-content-center">
                <a class="ion-android-checkmark-circle link" [ngClass]="{off: param.off}"
                   (click)="toggle(param)"></a>
                <a class="ion-ios-copy-outline link" (click)="clone(param)"></a>
                <a class="ion-close link" (click)="delete(param)"></a>
            </div>
        </div>
    `
})
export class ParamItemComponent {
    @Input() public param: HttpRequestParam;
    @Output() public onChange = new EventEmitter<HttpRequestParam>();

    public emitChanges() {
        this.onChange.emit(this.param);
    }
}
