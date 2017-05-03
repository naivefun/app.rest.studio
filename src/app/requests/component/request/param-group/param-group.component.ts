import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HttpRequestParam } from '../../../../@model/http/http-request';
import * as _ from 'lodash';
import { BaseComponent } from '../../../../@shared/components/base.component';

@Component({
    selector: 'request-param-group',
    templateUrl: './param-group.component.html',
    styles: [ `
        .off input {
            color: #ddd;
            font-weight: 300;
        }

        .icons a {
            padding: 0 .5em;
            font-size: 1.15em;
        }

        .icons a.off {
            color: #ddd;
        }

        .icons a.off:hover {
            color: #999;
        }
    ` ]
})
export class ParamGroupComponent extends BaseComponent {
    @Output() public paramsUpdated = new EventEmitter<HttpRequestParam[]>();
    private _paramGroup: HttpRequestParam[] = [];

    get paramGroup() {
        return this._paramGroup;
    }

    @Input()
    set paramGroup(paramGroup: HttpRequestParam[]) {
        this._paramGroup = paramGroup || [];
    }

    public addWithTab(e) {
        alert('tab ' + e.target.value);
    }

    public add(e, cancel = false) {
        console.debug('blur', e);

        if (!cancel) {
            let key = _.trim(e.target.value);
            if (key) {
                this.paramGroup.push(new HttpRequestParam(key));
                this.emitChanges();
            }
        }

        e.target.value = '';
    }

    public delete(param: HttpRequestParam) {
        _.pull(this.paramGroup, param);
    }

    public clone(param: HttpRequestParam) {
        let clone = new HttpRequestParam(param.key);
        clone.off = param.off;
        let index = _.indexOf(this.paramGroup, param);
        this.paramGroup.splice(index + 1, 0, clone);
    }

    public emitChanges() {
        this.paramsUpdated.emit(this.paramGroup);
    }
}
