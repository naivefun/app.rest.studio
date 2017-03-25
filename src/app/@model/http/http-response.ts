export class DefaultHttpResponse implements HttpResponse {
    public status: number;
    public statusText: string;
}

export interface HttpResponse {
    status: number;
    statusText?: string;
}
