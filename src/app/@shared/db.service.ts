import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
import { Observable } from 'rxjs';
import { shortid } from '../@utils/string.utils';
import { AlertService } from './alert.service';

export const DB = {
    MAIN: 'main',
    REQUESTS: 'requests'
};

export const KEYS = {
    LOCAL_CONFIG: 'local-config'
};

@Injectable()
export class DbService {
    private _db = {};

    constructor(private alertService: AlertService) {
    }

    public get(id: string, db = DB.MAIN): Observable<any> {
        return Observable.fromPromise(this.getPromise(id, db));
    }

    /**
     * never throws error
     * @param id
     * @param db
     * @return either object or null
     */
    public getPromise(id: string, db = DB.MAIN): Promise<any> {
        return this.db(db).get(id)
            .then(result => {
                console.debug('[db] pouch get object result', result);
                return result;
            })
            .catch(error => {
                return null;
            });
    }

    public all(db: string, keys: string[] = null, includeDocs = true): Observable<any[]> {
        return Observable.fromPromise(this.allPromise(db, keys, includeDocs));
    }

    public allPromise(db: string, keys: string[], includeDocs = true): Promise<any[]> {
        let options: any = { include_docs: includeDocs };
        if (keys && keys.length) options.keys = keys;
        return this.db(db).allDocs(options).then(result => {
            return result.rows.filter(row => row.doc).map(row => row.doc);
        });
    }

    public save(object: any, db: string, id: string = null): Observable<any> {
        return Observable.fromPromise(this.savePromise(object, db, id));
    }

    public savePromise(object: any, db: string, id?: string): Promise<any> {
        if (!_.isObject(object))
            throw new Error('[db] DB accepts object only');

        id = id // explicit id
            || object._id // respect existing id
            || object.id // if refresh object without _id
            || shortid(); // create new id
        object._id = id; // ensure _id is set for pouchdb
        console.debug('[db] saving object', object);
        return this.getPromise(id, db)
            .then(doc => {
                if (doc) {
                    object._rev = doc._rev; // set _rev to avoid conflicts
                } else {
                    delete object._rev;
                }
                return this.db(db).put(object);
            })
            // save success
            .then(result => {
                object._rev = result.rev; // new revision
                console.debug('[db] object is saved', object);
                return object;
            })
            // save error
            .catch(error => {
                console.error('[db] save/get object error:', error);
                this.alertService.error(error.message);
                throw error;
            });
    }

    public delete(id: string, db: string) {
        return Observable.fromPromise(this.deletePromise(id, db));
    }

    public deletePromise(id: string, db: string): Promise<any> {
        return this.getPromise(id, db)
            .then(doc => {
                return this.db(db).remove(doc);
            });
    }

    // get cached db instance
    private db(dbName = DB.MAIN): any {
        if (!this._db[ dbName ]) {
            this._db[ dbName ] = new PouchDB(dbName);
        }

        return this._db[ dbName ];
    }

    // ensure pouchdb id
    private ensureObject(object: any) {
        if (object) {
            // TODO: check _id
            return;
        }
    }
}
