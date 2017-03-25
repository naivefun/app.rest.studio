import { shortid } from '../@utils/string.utils';

export interface Pair {
    key: string;
    value?: any;
}

export class DefaultPair implements Pair {
    public id: string;
    public key: string;
    public value: any;
    public off: boolean;

    constructor(key: string, value = null) {
        this.id = shortid();
        this.key = key;
        this.value = value;
        this.off = false;
    }
}
