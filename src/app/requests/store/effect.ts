import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { LoadRequestsSuccessAction, RequestsActions, RequestsActionTypes } from './action';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';

@Injectable()
export class RequestsEffects {
    @Effect()
    public loadRequests$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.LOAD_REQUESTS)
        .switchMap(_ => {
            return Observable.of(new LoadRequestsSuccessAction([]));
        });

    // @Effect()
    // public createRequest$: Observable<Action> = this.action$
    //     .ofType(RequestsActionTypes.CREATE_REQUEST)
    //     .map(toPayload)
    //     .switchMap(request => {
    //         // TODO: go to new url
    //         // return go('');
    //         return null;
    //     });

    // TODO: when delete, redirect when necessary

    constructor(private action$: Actions) {
    }
}
