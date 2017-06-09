import { Action } from 'redux';

export interface SimpleAction<T> extends Action {
    payload?: T;
}

export function simpleAction<T>(type: string, payload: T = null): SimpleAction<T> {
    return { type, payload };
}

export interface IPayloadAction<P, M> extends Action {
    payload?: P;
    error?: any;
    meta?: M;
}
