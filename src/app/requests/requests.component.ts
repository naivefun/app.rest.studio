import { NgRedux, select } from '@angular-redux/store';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../@model/http/http-request';
import { IAppState } from '../@store/root.types';
import { RequestsActions } from './@store/actions';

@Component({
    selector: 'requests',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './requests.component.html'
})
export class RequestsComponent implements OnInit {
    public items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6];

    @select(['requests', 'requests'])
    public readonly requests$: Observable<DefaultHttpRequest[]>;
    @select(['requests', 'activeRequestId'])
    public readonly activeRequestId$: Observable<string>;

    constructor(private store: NgRedux<IAppState>,
                private actions: RequestsActions) {
    }

    public ngOnInit() {
        this.store.dispatch(this.actions.loadRequests());
    }
}
