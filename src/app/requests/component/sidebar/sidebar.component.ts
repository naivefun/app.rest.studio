import { Component, Input } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { CreateRequestAction, DeleteRequestAction, SelectRequestAction } from '../../store/action';

@Component({
    selector: 'requests-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [`
        a.btn-create-request {
            display: block;
            text-align: center;
            padding: .5em;
            background-color: slategray;
            color: #ddd;
            font-weight: 400;
            transition-property: all;
            transition-duration: .3s;
        }

        a.btn-create-request:hover {
            background-color: darkslategray;
            color: #fff;
        }

        li {
            padding: .4em .5em;
            word-wrap: break-word;
            line-height: 130%;
            transition-property: all;
            transition-duration: .2s;
        }

        li.active {
            background-color: #287ec3;
            color: #efefef;
        }

        li.active a {
            color: #efefef;
        }
    `]
})
export class RequestsSidebarComponent {
    @Input() public requests: DefaultHttpRequest[] = [];
    @Input() public activeRequestId: string;

    constructor(private store: Store<State>) {
    }

    public createRequest() {
        let request = new DefaultHttpRequest('http://www.yahoo.com');
        this.store.dispatch(new CreateRequestAction(request));
    }

    public selectRequest(id: string) {
        this.store.dispatch(new SelectRequestAction(id));
    }

    public deleteRequest(id: string) {
        this.store.dispatch(new DeleteRequestAction(id));
    }
}
