import * as _ from 'lodash';

export function sortKeys(input: Object) {
    if (_.isObject(input)) {
        return _(input).toPairs().sortBy(0).fromPairs().value();
    }
}

export function isNumber(input: any) {
    return _.isNumber(input) && !_.isNaN(input);
}

export function compressObject(input: Object, options: CompressObjectOptions = new CompressObjectOptions(),
    defaultValues?: Object) {
    if (_.isObject) {
        let handler = (container, key, value) => {
            if (options.removeUnderscoreProperties && _.startsWith(key, '_')) {
                delete container[key];
            } else if (_.isObject(value)) {
                if (options.removeEmptyObject && _.isEmpty(value)) {
                    delete container[key];
                }
            } else if (_.isArray(value)) {
                if (options.removeEmptyArray && value.length === 0) {
                    delete container[key];
                }
            } else if (_.isBoolean(value)) {
                if (options.removeFalse && !value) {
                    delete container[key];
                }
            } else if (value === undefined) {
                if (options.removeUndefined) {
                    delete container[key];
                }
            } else if (value === null || value === NaN) {
                if (options.removeNull) {
                    delete container[key];
                }
            } else if (defaultValues && options.removeDefaultValues) {
                if (defaultValues[key] === value) {
                    delete container[key];
                }
            }
        };

        walkObject(input, handler);
    }

    return input;
}

export function walkObject(input: Object,
    handler: (container: Object, key: string, value: any) => void) {
    if (_.isObject(input)) {
        for (let key of Object.keys(input)) {
            let value = input[key];
            if (_.isArray(value)) {
                for (let item of value) {
                    walkObject(item, handler);
                }
            } else if (_.isObject(value)) {
                walkObject(value, handler);
            }

            if (handler) {
                handler(input, key, input[key]);
            }
        }
    }
}

export class CompressObjectOptions {
    public removeFalse: boolean = true;
    public removeEmptyArray: boolean = true;
    public removeEmptyObject: boolean = true;
    public removeUnderscoreProperties: boolean = true;
    public removeNull: boolean = true;
    public removeUndefined: boolean = true;
    public removeDefaultValues: boolean = true;
}
