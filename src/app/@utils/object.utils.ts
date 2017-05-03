import * as _ from 'lodash';

export function sortKeys(input: Object) {
    if (_.isObject(input)) {
        return _(input).toPairs().sortBy(0).fromPairs().value();
    }
}

export function sortByKeys(input: Object, keys: string[]) {
    let copy = _.cloneDeep(input);
    let result = {};
    keys.forEach(key => {
        if (!_.isUndefined(copy[ key ])) {
            result[ key ] = _.cloneDeep(copy[ key ]);
            delete copy[ key ];
        }
    });
    Object.keys(copy).forEach(key => {
        result[ key ] = _.cloneDeep(copy[ key ]);
    });
    return result;
}

export function isNumber(input: any) {
    return _.isNumber(input) && !_.isNaN(input);
}

export function compressObject(input: Object, options: CompressObjectOptions = new CompressObjectOptions(),
                               keysData?: CompressKeysData) {
    if (_.isObject) {
        let handler = (container, key, value) => {
            if (keysData && _.includes(keysData.keysToRemove, key)) {
                delete container[ key ];
            } else if (options.removeUnderscoreProperties && _.startsWith(key, '_')) {
                delete container[ key ];
            } else if (_.isObject(value)) {
                if (options.removeEmptyObject && _.isEmpty(value)) {
                    delete container[ key ];
                }
            } else if (_.isArray(value)) {
                if (options.removeEmptyArray && value.length === 0) {
                    delete container[ key ];
                }
            } else if (_.isBoolean(value)) {
                if (options.removeFalse && !value) {
                    delete container[ key ];
                }
            } else if (value === undefined) {
                if (options.removeUndefined) {
                    delete container[ key ];
                }
            } else if (value === null || _.isNaN(value)) {
                if (options.removeNull) {
                    delete container[ key ];
                }
            } else if (keysData && keysData.defaultValues && options.removeDefaultValues) {
                if (keysData.defaultValues[ key ] === value) {
                    delete container[ key ];
                }
            }
        };

        walkObject(input, handler);
    }

    return input;
}

// TODO
export function compressCloudRequest() {
    return;
}

export function walkObject(input: Object,
                           handler: (container: Object, key: string, value: any) => void) {
    if (_.isObject(input)) {
        for (let key of Object.keys(input)) {
            let value = input[ key ];
            if (_.isArray(value)) {
                for (let item of value) {
                    walkObject(item, handler);
                }
            } else if (_.isObject(value)) {
                walkObject(value, handler);
            }

            if (handler) {
                handler(input, key, input[ key ]);
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

export interface CompressKeysData {
    defaultValues?: Object;
    keysToRemove?: string[];
}
