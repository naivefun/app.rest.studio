import { shortid } from '../../@utils/string.utils';

export class DefaultHttpRequest implements HttpRequest {
    public id: string;
    public title: string;
    public url: string;
    public method: HttpMethod;

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
