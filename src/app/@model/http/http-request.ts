import { shortid } from '../../@utils/string.utils';
import { DefaultPair } from '../pair';

export class DefaultHttpRequest implements HttpRequest {
    public id: string;
    public title: string;
    public url: string;
    public method: HttpMethod;

    public queryParams: HttpRequestParam[] = [];
    public headerParams: HttpRequestParam[] = [];
    public formParams: HttpRequestParam[] = [];
    public pathParams: HttpRequestParam[] = [];

    constructor(url: string, method = HttpMethod.GET, title?: string) {
        this.id = shortid();
        this.title = title;
        this.url = url;
        this.method = method;
    }
}

export interface HttpRequest {
    url: string;
    method: HttpMethod;
}

export enum HttpMethod {
    GET = <any> 'GET',
    POST = <any> 'POST',
    PUT = <any> 'PUT',
    DELETE = <any> 'DELETE',
    OPTIONS = <any> 'OPTIONS',
}

export const HTTP_METHODS = [
    HttpMethod.GET,
    HttpMethod.POST,
    HttpMethod.PUT,
    HttpMethod.DELETE,
    HttpMethod.OPTIONS,
];

export class HttpRequestParam extends DefaultPair {
    constructor(key: string, value = null) {
        super(key, value);
    }
}

export enum ParamField {
    QUERY, HEADER, FORM, PATH
}
