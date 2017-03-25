import * as shortId from 'shortid';

export function shortid(prefix = '', suffix = '') {
    return `${prefix}${shortId.generate()}${suffix}`;
}
