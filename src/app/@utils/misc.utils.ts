import * as _ from 'lodash';

export function retry(predict: () => boolean, run: Function, info?: any, maxRetries = 20, interval = 50) {
    let doRetry = (_predict: () => boolean, _run: Function, _info?: any,
                   _maxRetries = 20, _interval = 50) => {
        if (_maxRetries <= 0) {
            console.debug('maxRetries is 0, cancel retry');
            return;
        }

        console.debug('retry counter', _maxRetries, _info);
        if (_predict()) {
            _run();
        } else {
            setTimeout(() => {
                doRetry(_predict, _run, _info, _maxRetries - 1, _interval);
            }, _interval);
        }
    };

    info = _.truncate(info || '', { length: 100 }).replace(/\n/g, '');
    doRetry(predict, run, info, maxRetries, interval);
}

export function delay(interval: number, func: Function) {
    if (func) {
        setTimeout(() => {
            func();
        }, interval);
    }
}
