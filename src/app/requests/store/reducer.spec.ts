import { reducer } from './reducer';
import { RequestsInitialState } from './state';
import { LoadRequestsSuccessAction } from './action';

describe('Requests Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const action = {} as any;
            const result = reducer(undefined, action);
            expect(result).toEqual(RequestsInitialState);
        });
    });

    describe('load requests', () => {
        it('should contain at least one request', () => {
            const result = reducer(RequestsInitialState, new LoadRequestsSuccessAction([]));
            expect(result.requests.length).toBeGreaterThan(0);
            // expect(result.activeRequestId).not.toBeNull();
        });
    });

    describe('create request', () => {
        return;
    });

    describe('clone request', () => {
        return;
    });

    describe('update request', () => {
        return;
    });

    describe('delete request', () => {
        return;
    });

});
