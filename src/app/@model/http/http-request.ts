import { shortid } from '../../@utils/string.utils';
import { DefaultPair } from '../pair';

export class DefaultHttpRequest implements HttpRequest {

    public static defaultRequest() {
        // return new DefaultHttpRequest('http://www.mocky.io/v2/58e03f0e1000008914cc1603');
        return new DefaultHttpRequest('http://localhost:3000/');
    }

    public id: string;
    public title: string;
    public description: string;
    public url: string;
    public method: HttpMethod;

    public timeout: number;
    public maxContentLength: number;
    public withCredentials: boolean;
    public mode: BodyMode;

    public queryParams: HttpRequestParam[] = [];
    public headerParams: HttpRequestParam[] = [];
    public formParams: HttpRequestParam[] = [];
    public pathParams: HttpRequestParam[] = [];
    public file: DefaultFileReference; // if binary
    public files: DefaultFileReference[]; // if form uploads
    public body: string;

    public disabledFields: ParamField[] = [];

    public createdAt: number;

    constructor(url: string, method = HttpMethod.GET, title?: string) {
        this.id = shortid();
        this.title = title;
        this.url = url;
        this.method = method;
        this.createdAt = Date.now();
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

export enum BodyMode {
    NONE = <any> 'none',
    JSON = <any> 'json',
    FORM = <any> 'form',
    FORM_URL_ENCODED = <any> 'form-url-encoded',
    XML = <any> 'xml',
    YAML = <any> 'yaml',
    TEXT = <any> 'text',
    BINARY = <any> 'binary'
}

export const BODY_MODES = [
    BodyMode.NONE,
    BodyMode.JSON,
    BodyMode.FORM,
    BodyMode.FORM_URL_ENCODED,
    BodyMode.XML,
    BodyMode.YAML,
    BodyMode.TEXT,
    BodyMode.BINARY
];

export const FORM_BODY_MODES = [
    BodyMode.FORM,
    BodyMode.FORM_URL_ENCODED
];

export const BIN_BODY_MODES = [
    BodyMode.BINARY,
    ...FORM_BODY_MODES
];

export const EDITOR_BODY_MODES = [
    BodyMode.JSON,
    BodyMode.XML,
    BodyMode.YAML,
    BodyMode.TEXT
];

export class HttpRequestParam extends DefaultPair {
    constructor(key: string, value = null) {
        super(key, value);
    }
}

export enum ParamField {
    QUERY, HEADER, BODY, PATH
}

export interface FileReference {

}

export class DefaultFileReference implements FileReference {

}
