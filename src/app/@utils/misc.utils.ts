import * as _ from 'lodash';

export function retry(predict: () => boolean, run: Function, info?: any, maxRetries = 20, interval = 50) {
    let doRetry = (predict: () => boolean, run: Function, info?: any, maxRetries = 20, interval = 50) => {
        if (maxRetries <= 0) {
            console.debug('maxRetries is 0, cancel retry');
            return;
        }

        console.debug('retry counter', maxRetries, info);
        if (predict()) {
            run();
        } else {
            setTimeout(() => {
                doRetry(predict, run, info, maxRetries - 1, interval);
            }, interval);
        }
    };

    info = _.truncate(info || '', { length: 100 }).replace(/\n/g, '');
    doRetry(predict, run, info, maxRetries, interval)
}

export function delay(interval: number, func: Function) {
    if (func) {
        setTimeout(() => {
            func();
        }, interval);
    }
}
