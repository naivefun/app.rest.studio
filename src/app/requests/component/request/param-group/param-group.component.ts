import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HttpRequestParam } from '../../../../@model/http/http-request';
import * as _ from 'lodash';

@Component({
    selector: 'request-param-group',
    templateUrl: './param-group.component.html'
})
export class ParamGroupComponent {
    @Input() public paramGroup: HttpRequestParam[];
    @Output() public paramsUpdated = new EventEmitter<HttpRequestParam[]>();

    public add(e, cancel = false) {
        if (!cancel) {
            let key = _.trim(e.target.value);
            if (key) {
                this.paramGroup.push(new HttpRequestParam(key));
                this.emitChanges();
            }
        }

        e.target.value = '';
    }

    public emitChanges() {
        this.paramsUpdated.emit(this.paramGroup);
    }
}
