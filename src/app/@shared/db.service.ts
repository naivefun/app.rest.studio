import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

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

    public get(id: string, db = DB.MAIN): Observable<any> {
        return Observable.fromPromise(this.getPromise(id, db));
    }

    public getPromise(id: string, db = DB.MAIN): Promise<any> {
        return this.db(db).get(id)
            .then(result => {
                console.debug('pouch get object result', result);
                return result;
            })
            .catch(error => {
                console.error('pouch get object error', error);
                if (error.status === 404) {
                    return null;
                }

                throw error;
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

    public savePromise(object: any, db: string, id: string = null): Promise<any> {
        if (!_.isObject(object))
            throw new Error('DB accepts object only');

        id = id || object.id || object._id;
        if (!id) {
            return this.db(db).post(object)
                .then(result => {
                    return object;
                }); // post will generate id
        } else {
            return this.getPromise(id, db)
                .then(doc => {
                    if (doc) {
                        object._rev = doc._rev;
                        object._id = id;
                    }
                    return this.db(db).put(object);
                })
                .then(result => {
                    object._rev = result.rev;
                    return object;
                })
                .catch(error => {
                    console.error('save/get object error:', error);
                    object._id = id;
                    return this.db(db).put(object);
                });
        }
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
