import { type } from '../../@utils/store.utils';
import { Action } from '@ngrx/store';
import { DefaultHttpRequest } from '../../@model/http/http-request';

export const RequestsActionTypes = {
    CREATE_REQUEST: type('CREATE_REQUEST'),
    SELECT_REQUEST: type('SELECT_REQUEST'),
    SAVE_REQUEST: type('SAVE_REQUEST'),
    SAVE_REQUEST_SUCCESS: type('SAVE_REQUEST_SUCCESS'),
    DELETE_REQUEST: type('DELETE_REQUEST'),
    DELETE_REQUEST_SUCCESS: type('DELETE_REQUEST_SUCCESS'),
    LOAD_REQUESTS: type('LOAD_REQUESTS'),
    LOAD_REQUESTS_SUCCESS: type('LOAD_REQUESTS_SUCCESS')
};

export type RequestsActions =
    CreateRequestAction |
    SaveRequestAction |
    DeleteRequestAction |
    LoadRequestsAction
    ;

// region Action Definition
export class CreateRequestAction implements Action {
    public type = RequestsActionTypes.CREATE_REQUEST;

    constructor(public payload: DefaultHttpRequest) {
    }
}

export class SelectRequestAction implements Action {
    public type = RequestsActionTypes.SELECT_REQUEST;

    constructor(public payload: string) {
    }
}

export class SaveRequestAction implements Action {
    public type = RequestsActionTypes.SAVE_REQUEST;

    constructor(public payload: DefaultHttpRequest) {
    }
}

export class DeleteRequestAction implements Action {
    public type = RequestsActionTypes.DELETE_REQUEST;

    constructor(public payload: string) {
    }
}

export class LoadRequestsAction implements Action {
    public type = RequestsActionTypes.LOAD_REQUESTS;

    constructor(public payload?: any) {
    }
}

export class LoadRequestsSuccessAction implements Action {
    public type = RequestsActionTypes.LOAD_REQUESTS_SUCCESS;

    constructor(public payload: DefaultHttpRequest[]) {
    }
}
// endregion
