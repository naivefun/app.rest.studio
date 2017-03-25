import { Component, Input } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { CreateRequestAction, DeleteRequestAction, SelectRequestAction } from '../../store/action';

@Component({
    selector: 'requests-sidebar',
    templateUrl: './sidebar.component.html'
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
