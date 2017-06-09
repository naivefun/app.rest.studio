import { Injectable } from '@angular/core';
import { createEpicMiddleware } from 'redux-observable';
import { AlertService } from '../../@shared/alert.service';
import { DB, DbService } from '../../@shared/db.service';
import { translateDbError } from '../../@utils/error.utils';
import { RequestsActions } from './actions';

@Injectable()
export class RequestsEpics {

    constructor(private db: DbService,
                private alert: AlertService,
                private actions: RequestsActions) {
    }

    public create() {
        return [
            createEpicMiddleware(this.loadRequestsEpic()),
            createEpicMiddleware(this.createRequestEpic()),
            createEpicMiddleware(this.saveRequestEpic()),
        ];
    }

    private loadRequestsEpic() {
        return action$ => action$
            .ofType(RequestsActions.LOAD_REQUESTS)
            .switchMap(_ => this.db.all(DB.REQUESTS))
            .map(requests => this.actions.loadRequestsSuccess(requests))
            .catch(error => {
                this.alert.error(translateDbError(error));
                return this.actions.loadRequestsError(error);
            });
    }

    private createRequestEpic() {
        return action$ => action$
            .ofType(RequestsActions.CREATE_REQUEST)
            .switchMap(action => this.db.save(action.payload, DB.REQUESTS))
            .map(result => this.actions.loadRequests());
    }

    private saveRequestEpic() {
        return action$ => action$
            .ofType(RequestsActions.SAVE_REQUEST, RequestsActions.UPDATE_REQUEST)
            .switchMap(action => this.db.save(action.payload, DB.REQUESTS));
    }
}
