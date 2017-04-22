import { BodyMode, DefaultFileReference, DefaultHttpRequest, HttpRequestParam } from '../@model/http/http-request';
import { TextMode } from '../@model/editor';
import { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';
import { object2QueryString } from './url.utils';

const APP_PREFIX = 'application';
/**
 * by default, does not handle form-data
 * @param request
 * @param handleFormAndBinary
 * @returns {AxiosRequestConfig}
 */
export function toAxiosOptions(request: DefaultHttpRequest, handleFormAndBinary = true): AxiosRequestConfig {
    let config: AxiosRequestConfig = {};
    config.url = request.url;
    config.method = (request.method || 'GET') + '';
    config.timeout = request.timeout || 60 * 1000;
    config.maxContentLength = request.maxContentLength || Number.MAX_SAFE_INTEGER;
    config.withCredentials = _.isUndefined(request.withCredentials) ? false : request.withCredentials;

    // TODO: query
    if (!_.isEmpty(request.queryParams)) {
        let queryObject = requestParamsToObject(request.queryParams);
        let queryString = object2QueryString(queryObject);
        if (_.includes(config.url, '?')) {
            if (config.url.endsWith('?')) {
                config.url = `${config.url}${queryString}`;
            } else if (config.url.endsWith('&')) {
                config.url = `${config.url}${queryString}`;
            } else {
                config.url = `${config.url}&${queryString}`;
            }
        } else {
            config.url = `${config.url}?${queryString}`;
        }
    }

    // TODO: header

    // TODO: form

    return config;
}

export function loadFileAsDataURL(ref: DefaultFileReference) {
    return null;
}

export function requestParamsToObject(params: HttpRequestParam[]): Object {
    let result = {};
    _.forEach((params || []), (param: HttpRequestParam) => {
        if (!param.off) {
            let key = _.trim(param.key);
            if (key)
                result[param.key] = param.value;
        }
    });
    return result;
}

export function ensureRequest(request: DefaultHttpRequest): DefaultHttpRequest {
    request = request || DefaultHttpRequest.defaultRequest();
    return request;
}

export function bodyMode2TextMode(bodyMode: BodyMode): TextMode {
    switch (bodyMode) {
        case BodyMode.JSON:
            return TextMode.JAVASCRIPT;
        case BodyMode.HJSON:
            return TextMode.HJSON;
        case BodyMode.XML:
            return TextMode.XML;
        case BodyMode.YAML:
            return TextMode.YAML;
        default:
            return TextMode.TEXT;
    }
}

export function bodyMode2ContentType(bodyMode: BodyMode) {
    switch (bodyMode) {
        case BodyMode.XML:
            return `${APP_PREFIX}/xml`;
        case BodyMode.FORM:
            return 'multipart/form-data';
        case BodyMode.FORM_URL_ENCODED:
            return `${APP_PREFIX}/x-www-form-urlencoded`;
        default:
            return `${APP_PREFIX}/json`;
    }
}
