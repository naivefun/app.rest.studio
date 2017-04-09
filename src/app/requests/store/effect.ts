import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { LoadRequestsSuccessAction, RequestsActions, RequestsActionTypes } from './action';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { DB, DbService } from '../../@shared/db.service';

@Injectable()
export class RequestsEffects {
    @Effect()
    public loadRequests$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.LOAD_REQUESTS)
        .switchMap(_ => {
            return this.db.all(DB.REQUESTS)
                .switchMap(requests => {
                    console.log('loaded requests:', requests);
                    return Observable.of(new LoadRequestsSuccessAction(requests));
                });
        });

    @Effect()
    public createRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.CREATE_REQUEST)
        .map(toPayload)
        .switchMap(request => {
            console.info('effect createRequest', request);
            return this.db.save(request, DB.REQUESTS)
                .switchMap(result => {
                    console.debug('create request result:', result);
                    return Observable.of(go('/requests/' + request.id));
                });
        });

    @Effect()
    public saveRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.SAVE_REQUEST)
        .map(toPayload)
        .switchMap(request => {
            console.info('effect saveRequest', request);
            return this.db.save(request, DB.REQUESTS)
                .switchMap(result => {
                    console.debug('save request result:', result);
                    return Observable.empty();
                });
        });

    @Effect()
    public deleteRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.DELETE_REQUEST)
        .map(toPayload)
        .switchMap(id => {
            console.info('effect deleteRequest', id);
            return this.db.delete(id, DB.REQUESTS)
                .switchMap(result => {
                    console.debug('delete request result:', result);
                    return Observable.empty();
                });
        });

    // TODO: when delete, redirect when necessary

    constructor(private db: DbService,
                private action$: Actions) {
    }
}
