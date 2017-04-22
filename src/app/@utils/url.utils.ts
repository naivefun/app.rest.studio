import * as _ from 'lodash';
import * as URI from 'urijs';

export function object2QueryString(data: Object) {
    if (_.isObject(data)) {
        let uri = new URI('');
        uri.addSearch(data);
        let query = _.trim(uri.toString());
        if (query.startsWith('?')) {
            return query.substr(1);
        }
        return query;
    } else if (_.isString(data)) {
        return _.trim(data);
    }

    return '';
}

export function queryString2Object(url: string): Object {
    let result = URI.parse(url);
    if (result && result.query) {
        return URI.parseQuery(result.query);
    }

    return {};
}

export function extractPathlets(url: string): string[] {
    let result: string[] = [];
    if (url) {
        let regx = /[(]{1}:([\w\-_]+)[)]{1}|[\/]{1}:([\w\-_]+)[\/]{0,1}/g;
        url = url.split('?')[0];
        let match = regx.exec(url);
        while (match !== null) {
            let token = match[1] || match[2];
            if (!_.includes(result, token))
                result.push(token);
            match = regx.exec(url);
        }
    }

    return result;
}

/**
 * convert :name or (:name) to {{name}}
 * @param url
 * @returns {string}
 */
export function convertToTemplate(url: string) {
    if (url) {
        let regx = /[(]{1}:([\w\-_]+)[)]{1}|[\/]{1}:([\w\-_]+)[\/]{0,1}/g;
        url = url.replace(regx, extractPathToken);
    }
    return url;
}

export function ensureUrl(pathOrUrl: string, baseUrl?: string): string {
    if (!pathOrUrl && !baseUrl) throw new Error('empty url and base url');
    pathOrUrl = _.trim(pathOrUrl);
    baseUrl = _.trim(baseUrl);
    if (pathOrUrl.toLowerCase().startsWith('http')) return pathOrUrl;

    let ensureSchema = (str: string) => {
        if (str) {
            if (!str.startsWith('http')) {
                str = 'http://' + str;
            }
        }

        return str;
    };

    if (!baseUrl) {
        return 'http://' + pathOrUrl;
    } else {
        baseUrl = ensureSchema(baseUrl);
        if (!pathOrUrl) return baseUrl;
        let endsWithSlash = baseUrl.endsWith('/'), startsWithSlash = pathOrUrl.startsWith('/');
        if (endsWithSlash && startsWithSlash) {
            pathOrUrl = pathOrUrl.substr(1);
        } else if (!endsWithSlash && !startsWithSlash) {
            pathOrUrl = '/' + pathOrUrl;
        }

        return baseUrl + pathOrUrl;
    }
}

function extractPathToken(token: string) {
    if (token.startsWith('(')) {
        token = token.substring(2, token.length - 1);
    } else if (token.startsWith('/')) {
        if (token.endsWith('/')) {
            token = token.substring(2, token.length - 1);
            return `/{{${token}}}/`;
        } else {
            token = token.substr(2);
            return `/{{${token}}}`;
        }
    } else {
        token = token.substr(1);
    }

    return `{{${token}}}`;
}

export function parseHashParams(str: string) {
    let result = {};
    if (str.includes('#')) {
        let hashes = str.split('#')[1];
        let pairs = hashes.split('&');
        pairs.forEach(pair => {
            if (pair.includes('=')) {
                let arr = pair.split('=');
                result[arr[0]] = arr[1];
            }
        });
    }
    return result;
}
