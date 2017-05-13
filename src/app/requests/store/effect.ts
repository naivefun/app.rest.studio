import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DefaultHttpRequest } from '../../@model/http/http-request';
import { AlertService } from '../../@shared/alert.service';
import { DB, DbService } from '../../@shared/db.service';
import { LoadRequestsSuccessAction, RequestsActionTypes } from './action';

@Injectable()
export class RequestsEffects {
    @Effect()
    public loadRequests$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.LOAD_REQUESTS)
        .switchMap(__ => {
            return this.db.all(DB.REQUESTS)
                .switchMap(requests => {
                    return Observable.of(new LoadRequestsSuccessAction(requests));
                });
        });

    @Effect()
    public createRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.CREATE_REQUEST)
        .map(toPayload)
        .switchMap(request => {
            return this.db.save(request, DB.REQUESTS)
                .switchMap(result => {
                    return Observable.of(go('/requests/' + request.id));
                });
        });

    @Effect()
    public saveRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.SAVE_REQUEST, RequestsActionTypes.UPDATE_REQUEST)
        .switchMap((action: Action) => {
            let request = action.payload;
            return this.db.save(request, DB.REQUESTS)
                .switchMap(result => {
                    if (action.type === RequestsActionTypes.SAVE_REQUEST)
                        this.success('request saved');
                    return Observable.empty();
                })
                .catch(err => {
                    this.error('failed to save request', err);
                    return Observable.empty();
                });
        });

    @Effect()
    public deleteRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.DELETE_REQUEST)
        .map(toPayload)
        .switchMap(id => {
            return this.db.delete(id, DB.REQUESTS)
                .switchMap(result => {
                    this.success('request deleted');
                    return Observable.empty();
                });
        });

    @Effect()
    public upRequest$: Observable<Action> = this.action$
        .ofType(RequestsActionTypes.UP_REQUEST)
        .map(toPayload)
        .switchMap(id => {
            return this.db.get(id, DB.REQUESTS)
                .switchMap((request: DefaultHttpRequest) => {
                    request.createdAt = Date.now();
                    return this.db.save(request, DB.REQUESTS)
                        .switchMap(result => Observable.empty());
                });
        });

    // TODO: when delete, redirect when necessary

    constructor(private db: DbService,
                private alertService: AlertService,
                private action$: Actions) {
    }

    private success(text: string) {
        this.alertService.successQuick(text);
    }

    private error(text: string, err: any) {
        this.alertService.error(`${text}: ${err.message}`);
    }
}
