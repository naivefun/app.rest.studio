import { AxiosRequestConfig } from './axios';

export class DefaultHttpResponse implements HttpResponse {
    public status: number;
    public statusText: string;
    public data?: any;
    public cookies?: any[];
    public headers: Object;
    public timeSpan?: TimeSpan;

    public requestId: string;
    public errorMessage?: any;
    public config?: AxiosRequestConfig;
    public view: ResponseView;
}

export interface HttpResponse {
    status: number;
    statusText?: string;
    data?: any;
    cookies?: any[];
    headers: Object;
    time?: TimeSpan;

    errorMessage?: any;
    config?: AxiosRequestConfig;
}

export interface TimeSpan {
    start: number;
    end: number;
}

export enum ResponseView {
    REQUEST = <any> 'request',
    BODY = <any> 'body',
    HEADER = <any> 'header',
    SCHEMA = <any> 'schema',
    ERROR = <any> 'error'
}
