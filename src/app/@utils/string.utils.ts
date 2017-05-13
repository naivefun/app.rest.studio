import * as shortId from 'shortid';
import * as Hjson from 'hjson';
import * as Yaml from 'js-yaml';
import * as _ from 'lodash';
declare const hljs: any;

export function shortid(prefix = '', suffix = '') {
    return `${prefix}${shortId.generate()}${suffix}`;
}

/**
 * try parse text as JSON, YAML, XML
 * @param text
 * @param shouldWarn
 * @returns parsed object or undefined
 */
export function tryParseAsObject(text: string, shouldWarn = false): Object {
    let parsed = parseJson(text);
    if (!parsed) {
        parsed = parseYaml(text);
    }
    return parsed;
}

export function parseJson(text: string, shouldWarn = false): Object {
    try {
        return Hjson.parse(text);
    } catch (_) {
        if (shouldWarn)
            console.error('text is not JSON', text);
    }
}

export function parseYaml(text: string, shouldWarn = false): Object {
    try {
        return Yaml.safeLoad(text);
    } catch (_) {
        if (shouldWarn)
            console.error('text is not YAML', text);
    }
}

export function stringifyJson(object: Object, indent = 2): string {
    return JSON.stringify(object, null, indent);
}

export function stringifyYaml(object: Object, indent = 2, sortKeys = false): string {
    return Yaml.safeDump(object, { indent, sortKeys });
}

export function formatJSON(text: string, indent = 2): string {
    let object = parseJson(text);
    if (object) {
        return stringifyJson(object);
    }
    return text;
}

export function formatYaml(text: string, indent = 2, sortKeys = false): string {
    let object = parseYaml(text);
    if (object) {
        return stringifyYaml(object, indent, sortKeys);
    }
    return text;
}

export function highlightCode(text: string, languageSubset?: string[]) {
    let result = hljs.highlightAuto(text, languageSubset);
    console.debug('highlightCode result:', result);
    return result.value;
}

export function isBinaryString(text: string) {
    return /[\x00-\x08\x0E-\x1F]/.test(text);
}

export function isBlank(text: string) {
    if (_.isString(text)) {
        return _.trim(text).length === 0;
    }

    throw new Error('text is not string: ' + text);
}
