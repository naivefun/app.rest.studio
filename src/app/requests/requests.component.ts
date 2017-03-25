import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { State } from '../store/reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../@model/http/http-request';
import { getRequestsActiveId, getRequestsRequests } from '../store/selector';
import { LoadRequestsAction } from './store/action';

@Component({
    selector: 'requests',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './requests.component.html'
})
export class RequestsComponent implements OnInit {
    public items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6];

    public requests$: Observable<DefaultHttpRequest[]>;
    public activeRequestId$: Observable<string>;

    constructor(private store: Store<State>) {
        this.requests$ = store.select(getRequestsRequests);
        this.activeRequestId$ = store.select(getRequestsActiveId);
    }

    public ngOnInit() {
        this.store.dispatch(new LoadRequestsAction());
    }
}
