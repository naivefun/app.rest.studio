import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { SelectRequestAction } from '../../store/action';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { getRequestsActiveRequest, getRequestsActiveResponse } from '../../../store/selector';
import { DefaultHttpResponse } from '../../../@model/http/http-response';
@Component({
    selector: 'requests-request',
    templateUrl: './request.component.html'
})
export class RequestsRequestComponent implements OnInit {
    public id: string;
    public request$: Observable<DefaultHttpRequest>;
    public response$: Observable<DefaultHttpResponse>;

    constructor(private store: Store<State>,
                private route: ActivatedRoute) {
        this.request$ = store.select(getRequestsActiveRequest);
        this.response$ = store.select(getRequestsActiveResponse);
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            console.debug('params', params);
            this.id = params['id'];
            if (this.id) {
                this.store.dispatch(new SelectRequestAction(this.id));
            }
        });
    }
}
