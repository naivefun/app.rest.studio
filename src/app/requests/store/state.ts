import { DefaultHttpRequest } from '../../@model/http/http-request';
import { DefaultHttpResponse } from '../../@model/http/http-response';

export interface RequestsState {
    requests: DefaultHttpRequest[];
    pages: any[];
    entities: any[];
    collections: any[];
    responses: { [id: string]: DefaultHttpResponse };

    activeRequestId: string;
    activePageId: string;
    activeEntityId: string;
    activeCollectionId: string;

    // loading status
    loadingRequests: boolean;
    savingRequest: boolean;
}

export const RequestsInitialState: RequestsState = {
    requests: [],
    pages: [],
    entities: [],
    collections: [],
    responses: {},

    activeRequestId: null,
    activePageId: null,
    activeEntityId: null,
    activeCollectionId: null,

    loadingRequests: false,
    savingRequest: false,
};
