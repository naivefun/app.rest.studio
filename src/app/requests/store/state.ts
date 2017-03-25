import { DefaultHttpRequest } from '../../@model/http/http-request';
import { DefaultHttpResponse } from '../../@model/http/http-response';

export interface RequestsState {
    requests: DefaultHttpRequest[];
    responses: { [id: string]: DefaultHttpResponse };
    activeRequestId: string;

    // loading status
    loadingRequests: boolean;
    savingRequest: boolean;
}

export const RequestsInitialState: RequestsState = {
    requests: [],
    responses: {},
    activeRequestId: null,

    loadingRequests: false,
    savingRequest: false,
};
