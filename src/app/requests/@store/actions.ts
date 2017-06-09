import { Injectable } from '@angular/core';
import { DefaultHttpRequest } from '../../@model/http/http-request';
import { DefaultHttpResponse } from '../../@model/http/http-response';
import { SimpleAction, simpleAction } from '../../@store/action.types';

@Injectable()
export class RequestsActions {
    public static readonly LOAD_REQUESTS = 'LOAD_REQUESTS';
    public static readonly LOAD_REQUESTS_SUCCESS = 'LOAD_REQUESTS_SUCCESS';
    public static readonly LOAD_REQUESTS_ERROR = 'LOAD_REQUESTS_ERROR';
    public static readonly LOAD_REQUEST = 'LOAD_REQUESTS';

    public static readonly CREATE_REQUEST = 'CREATE_REQUEST';
    public static readonly CREATE_REQUEST_SUCCESS = 'CREATE_REQUEST_SUCCESS';
    public static readonly SAVE_REQUEST = 'SAVE_REQUEST';
    public static readonly SAVE_REQUEST_SUCCESS = 'SAVE_REQUEST_SUCCESS';
    public static readonly UPDATE_REQUEST = 'UPDATE_REQUEST';
    public static readonly UPDATE_REQUEST_SUCCESS = 'UPDATE_REQUEST_SUCCESS';

    public static readonly SELECT_REQUEST = 'SELECT_REQUEST';
    public static readonly DELETE_REQUEST = 'DELETE_REQUEST';
    public static readonly RESPONSE_RECEIVED = 'RESPONSE_RECEIVED';
    public static readonly CLEAR_RESPONSE = 'CLEAR_RESPONSE';

    public clearResponse(id: string): SimpleAction<string> {
        return simpleAction(RequestsActions.CLEAR_RESPONSE, id);
    }

    public saveRequest(request: DefaultHttpRequest): SimpleAction<DefaultHttpRequest> {
        return simpleAction(RequestsActions.SAVE_REQUEST, request);
    }

    public responseReceived(response: DefaultHttpResponse): SimpleAction<DefaultHttpResponse> {
        return simpleAction(RequestsActions.RESPONSE_RECEIVED, response);
    }

    public updateRequest(request: DefaultHttpRequest): SimpleAction<DefaultHttpRequest> {
        return simpleAction(RequestsActions.UPDATE_REQUEST, request);
    }

    public createRequest(request: DefaultHttpRequest): SimpleAction<DefaultHttpRequest> {
        return simpleAction(RequestsActions.CREATE_REQUEST, request);
    }

    public createRequestSuccess(): SimpleAction<any> {
        return simpleAction(RequestsActions.CREATE_REQUEST_SUCCESS);
    }

    public selectRequest(id: string): SimpleAction<string> {
        return simpleAction(RequestsActions.SELECT_REQUEST, id);
    }

    public deleteRequest(id: string): SimpleAction<string> {
        return simpleAction(RequestsActions.DELETE_REQUEST, id);
    }

    public loadRequests(): SimpleAction<any> {
        return simpleAction(RequestsActions.LOAD_REQUESTS);
    }

    public loadRequestsSuccess(requests: DefaultHttpRequest[]): SimpleAction<DefaultHttpRequest[]> {
        return simpleAction(RequestsActions.LOAD_REQUESTS_SUCCESS, requests || []);
    }

    public loadRequestsError(error: Error): SimpleAction<Error> {
        return simpleAction(RequestsActions.LOAD_REQUESTS_ERROR, error);
    }

    public loadRequest(id: string): SimpleAction<string> {
        return simpleAction(RequestsActions.LOAD_REQUEST, id);
    }
}
