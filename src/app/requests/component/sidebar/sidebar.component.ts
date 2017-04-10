import { Component, Input } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { CreateRequestAction, DeleteRequestAction, SelectRequestAction, UpRequestAction } from '../../store/action';

@Component({
    selector: 'requests-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [`
        a.btn-create-request {
            display: block;
            text-align: center;
            padding: .5em;
            background-color: #e8e8e8;
            color: #bbb;
            font-weight: 400;
            transition-property: all;
            transition-duration: .3s;
        }

        a.btn-create-request:hover {
            background-color: #2c93e1;
            color: #fff;
        }

        li {
            display: block;
            padding: .4em .5em;
            word-wrap: break-word;
            line-height: 130%;
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            /*transition-property: all;*/
            /*transition-duration: .2s;*/
        }

        li a {
            display: table-cell;
            color: #999;
        }

        li span {
            display: table-cell;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 20px;
            font-size: 14px;
        }

        li:hover {
            background-color: #eee;
        }

        li.active {
            background-color: #fff;
            color: #2c93e1;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }

        li.active a {
            color: #2c93e1;
        }
    `]
})
export class RequestsSidebarComponent {
    @Input() public requests: DefaultHttpRequest[] = [];
    @Input() public activeRequestId: string;

    constructor(private store: Store<State>) {
    }

    public createRequest() {
        let request = DefaultHttpRequest.defaultRequest();
        this.store.dispatch(new CreateRequestAction(request));
    }

    public selectRequest(id: string) {
        this.store.dispatch(new SelectRequestAction(id));
    }

    public deleteRequest(id: string) {
        this.store.dispatch(new DeleteRequestAction(id));
    }

    public upRequest(id: string) {
        this.store.dispatch(new UpRequestAction(id));
    }
}
