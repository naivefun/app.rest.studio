import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { SelectRequestAction, UpdateRequestAction } from '../../store/action';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { getRequestsActiveRequest, getRequestsActiveResponse } from '../../../store/selector';
import { DefaultHttpResponse } from '../../../@model/http/http-response';
import * as _ from 'lodash';

@Component({
    selector: 'requests-request',
    templateUrl: './request.component.html'
})
export class RequestsRequestComponent implements OnInit {
    public id: string;
    public request$: Observable<DefaultHttpRequest>;
    public response$: Observable<DefaultHttpResponse>;

    public request: DefaultHttpRequest;

    constructor(private store: Store<State>,
                private route: ActivatedRoute) {
        this.request$ = store.select(getRequestsActiveRequest);
        this.response$ = store.select(getRequestsActiveResponse);

        this.request$.subscribe(request => this.request = request);
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

    public onRequestUpdated(request: DefaultHttpRequest) {
        if (this.request.url !== request.url) {
            this.store.dispatch(new UpdateRequestAction(request));
        } else {
            this.request = _.cloneDeep(request);
        }
    }
}
