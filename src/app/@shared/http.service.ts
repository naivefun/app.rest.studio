import { DefaultHttpResponse } from '../@model/http/http-response';
import { toAxiosOptions } from '../@utils/request.utils';
import { DefaultHttpRequest } from '../@model/http/http-request';
import { parseResponse, parseResponseError } from '../@utils/response.utils';
import axios from 'axios';
import { ChromeService } from './chrome.service';
import { Injectable } from '@angular/core';

export interface HttpClient {
    execute(request: DefaultHttpRequest): Promise<DefaultHttpResponse>;
}

@Injectable()
export class DefaultHttpClient implements HttpClient {

    constructor(private chromeService: ChromeService) {
        console.info('chromeService', chromeService);
    }

    public execute(request: DefaultHttpRequest): Promise<DefaultHttpResponse> {
        if (this.chromeService.connected) {
            return this.chromeService.sendRequest(request);
        }

        let options = toAxiosOptions(request);
        // TODO: merge environment
        console.debug('axios options', options);
        let start = Date.now();
        return new Promise(resolve => {
            axios.request(options)
                .then(resp => {
                    let response = parseResponse(resp);
                    response.cookies = [];
                    response.timeSpan = {
                        start,
                        end: Date.now()
                    };
                    console.debug('direct request from app', response);
                    resolve(response);
                })
                .catch(err => {
                    let response = parseResponseError(err);
                    response.cookies = [];
                    response.timeSpan = {
                        start,
                        end: Date.now()
                    };
                    resolve(response);
                });
        });
    }

}
