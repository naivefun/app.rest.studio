import { Injectable } from '@angular/core';
import { DefaultHttpRequest } from '../@model/http/http-request';
import { DefaultHttpResponse, TimeSpan } from '../@model/http/http-response';
import { toAxiosOptions } from '../@utils/request.utils';
import { AxiosError, AxiosResponse } from 'axios';
import { parseResponse, parseResponseError } from '../@utils/response.utils';
import { shortid } from '../@utils/string.utils';
import * as _ from 'lodash';

export interface ExtensionService {
    postMessage(message: ExtensionMessage);
    onMessageReceived(message: ExtensionResponse);
    onPortDisconnected();
    ping();
}

@Injectable()
export class ChromeService implements ExtensionService {

    public connected: boolean;

    private port: any;
    private chrome: any;
    private requests: any = {};

    private retryInterval: number;

    constructor() {
        if (!_.isUndefined(window['chrome'])) {
            this.chrome = window['chrome'];
            if (this.chrome.runtime) {
                this.init();
            }
        }
    }

    public sendRequest(request: DefaultHttpRequest): Promise<DefaultHttpResponse> {
        let options = toAxiosOptions(request);
        let message = new ExtensionMessage();
        message.type = ExtensionMessageType.HTTP_REQUEST;
        message.payload = options;

        return this.prepareRequestMessage(message, request)
            .then(_ => {
                return new Promise<DefaultHttpResponse>((resolve, reject) => {
                    this.postMessage(message);
                    this.requests[message.id] = { resolve, reject };
                    let timeout = (request.timeout || 60000) + 100;
                    setTimeout(() => {
                        reject('timeout');
                        delete this.requests[message.id];
                    }, timeout);
                });
            });
    }

    public ping() {
        let message = new ExtensionMessage();
        this.postMessage(message);
        console.debug('sending ping');
    }

    public onMessageReceived(message: ExtensionResponse) {
        this.connected = true;
        switch (message.type) {
            case ExtensionMessageType.PING:
                break;
            case ExtensionMessageType.HTTP_REQUEST:
                let payload: HttpResponsePayload = message.payload;
                let response: DefaultHttpResponse;
                if (payload.response) {
                    response = parseResponse(payload.response);
                } else if (payload.error) {
                    response = parseResponseError(payload.error);
                }

                response.cookies = payload.cookies;
                response.timeSpan = payload.timeSpan;

                let savedPromise = this.requests[message.id];
                if (savedPromise) {
                    delete this.requests[message.id];
                    savedPromise.resolve(response);
                }
                break;
            default:
                break;
        }
    }

    public onPortDisconnected() {
        delete this.port;
        delete this.connected;

        let error = this.chrome.runtime.lastError;
        let gap = 1000;
        if (error && error.message) {
            console.debug('disconnected: ', error.message);
            gap = 15000;
        }

        if (this.connected || this.retryInterval > 50) {
            return;
        }

        let interval = setInterval(() => {
            clearInterval(interval);
            this.retryInterval = this.retryInterval + 1;
            this.init();
        }, gap);
    }

    public postMessage(message: ExtensionMessage) {
        if (this.connected) {
            this.port.postMessage(message);
            console.debug('posted message', message);
        }
    }

    private prepareRequestMessage(message: ExtensionMessage, request: DefaultHttpRequest) {
        // TODO: handle form -> data uri
        return Promise.resolve(message);
    }

    private init() {
        this.requests = {};
    }

    private connect(extensionId: string) {
        this.port = this.chrome.runtime.connect(extensionId, { name: 'REST.Studio' });
        if (this.port) {
            this.port.onMessage.addListener(this.onMessageReceived.bind(this));
            this.port.onDisconnect.addListener(this.onPortDisconnected.bind(this));
            this.ping();
        }
    }
}

export class ExtensionMessage {
    public id: string;
    public type: ExtensionMessageType;
    public payload: any;
    public timeout: number;

    constructor(type: ExtensionMessageType = ExtensionMessageType.PING) {
        this.type = type;
        this.id = shortid();
    }
}

export class ExtensionResponse {
    public id: string;
    public type: ExtensionMessageType;
    public payload: any;
}

export interface HttpResponsePayload {
    response: AxiosResponse;
    error: AxiosError;
    cookies: any[];
    timeSpan: TimeSpan;
}

export enum ExtensionMessageType {
    PING = <any> 'PING',
    HTTP_REQUEST = <any> 'HTTP_REQUEST'
}
