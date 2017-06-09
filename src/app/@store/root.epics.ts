import { Injectable } from '@angular/core';
import { RequestsEpics } from '../requests/@store/epics';

@Injectable()
export class RootEpics {
    constructor(private requestsEpics: RequestsEpics) {
    }

    public create() {
        return [
            ...this.requestsEpics.create(),
        ];
    }
}
