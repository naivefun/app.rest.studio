import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { Observable } from 'rxjs';

export const DB = {
    MAIN: 'main',
    REQUESTS: 'requests'
};

@Injectable()
export class DbService {
    private _db = {};

    public get(id: string, name = DB.MAIN): Observable<any> {
        return Observable.fromPromise(this.getPromise(id, name));
    }

    public getPromise(id: string, name = DB.MAIN): Promise<any> {
        return this.db()
            .get(id);
    }

    // get cached db instance
    private db(name = DB.MAIN): any {
        if (!this._db) {
            this._db[name] = new PouchDB(name);
        }

        return this._db[name];
    }

    // ensure pouchdb id
    private ensureObject(object: any) {
        if (object) {
            // TODO: check _id
            return;
        }
    }
}
