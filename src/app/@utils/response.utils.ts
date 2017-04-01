import { DefaultHttpResponse } from '../@model/http/http-response';
import { AxiosError, AxiosResponse } from 'axios';

export function parseResponse(response: AxiosResponse): DefaultHttpResponse {
    if (response) {
        let resp = new DefaultHttpResponse();
        resp.status = response.status;
        resp.statusText = response.statusText;
        resp.data = response.data;
        resp.headers = response.headers;
        resp.config = response.config;
        return resp;
    }
}

export function parseResponseError(error: AxiosError): DefaultHttpResponse {
    if (error) {
        let resp = new DefaultHttpResponse();
        if (error.response) {
            resp = parseResponse(error.response);
        }

        resp.config = error.config;
        resp.errorMessage = error.message;
        return resp;
    }
}
