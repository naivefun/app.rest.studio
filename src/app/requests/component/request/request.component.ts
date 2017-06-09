import { NgRedux, select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { DefaultHttpResponse } from '../../../@model/http/http-response';
import { SyncProviderAccount } from '../../../@model/sync';
import { DefaultHttpClient } from '../../../@shared/http.service';
import { IAppState } from '../../../@store/root.types';
import { RequestsActions } from '../../@store/actions';

@Component({
    selector: 'requests-request',
    templateUrl: './request.component.html'
})
export class RequestsRequestComponent implements OnInit {
    public id: string;
    @select((state: IAppState) => {
        for (let request of state.requests.requests) {
            if (request.id === state.requests.activeRequestId)
                return request;
        }
    })
    public request$: Observable<DefaultHttpRequest>;
    @select((state: IAppState) => {
        return state.requests.responses[state.requests.activeRequestId];
    })
    public response$: Observable<DefaultHttpResponse>;
    @select(['config', 'connectedAccounts'])
    public syncAccounts$: Observable<SyncProviderAccount[]>;

    public request: DefaultHttpRequest;

    constructor(private httpClient: DefaultHttpClient,
                private route: ActivatedRoute,
                private store: NgRedux<IAppState>,
                private actions: RequestsActions) {
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            console.debug('route params changed', params);
            this.id = params['id'];
            if (this.id) {
                this.store.dispatch(this.actions.selectRequest(this.id));
            }
        });
    }

    public updateRequest(request: DefaultHttpRequest) {
        this.store.dispatch(this.actions.updateRequest(request));
    }

    public sendRequest(request: DefaultHttpRequest) {
        this.store.dispatch(this.actions.saveRequest(request));
        this.httpClient.execute(request)
            .then(resp => {
                console.debug('onSendRequest result:', resp);
                resp.requestId = request.id;
                this.store.dispatch(this.actions.responseReceived(resp));
            });
    }

    public clearResponse(requestId: string) {
        this.store.dispatch(this.actions.clearResponse(requestId));
    }
}
