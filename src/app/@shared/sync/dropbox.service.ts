import axios from 'axios';
import * as Dropbox from 'dropbox';
import { AccountObject, CloudFile, TokenObject } from '../../@model/sync';
import { parseHashParams } from '../../@utils/url.utils';

// TODO: create types instead of `any`
// TODO: replace axios with wrapped http client
export interface CloudSyncProvider {
    authUrl(redirectUri: string): string;
    parseAuthToken(url: string): TokenObject;
    isActive(): boolean; // access token is present
    updateAccessToken(accessToken: string);

    // vendor apis
    getMetaData(path: string): Promise<any>;
    getFile(path: string): Promise<string>;
    saveFile(path: string, content: string, mimeType?: string): Promise<any>;
    createSharedLink(path: string): Promise<string>;
    listFiles(path: string): Promise<CloudFile[]>;
    createFolder(path: string): Promise<boolean>;
    getAccount(): Promise<AccountObject>;
}

export class DropboxSyncProvider implements CloudSyncProvider {
    private baseUrl: string = 'https://api.dropboxapi.com/2';
    private contentBaseUrl: string = 'https://content.dropboxapi.com/2';
    private dpx: any;
    private clientId: string;
    private accessToken: string;

    constructor(clientId: string, accessToken?: string) {
        this.clientId = clientId;
        this.updateAccessToken(accessToken);
    }

    public authUrl(redirectUri: string): string {
        let authUrl = this.dpx.getAuthenticationUrl(redirectUri);
        return authUrl;
    }

    public parseAuthToken(url: string): TokenObject {
        let parsed: any = parseHashParams(url);
        this.updateAccessToken(parsed[ 'access_token' ]);
        return {
            uid: parsed[ 'uid' ],
            accountId: parsed[ 'account_id' ],
            accessToken: this.accessToken
        };
    }

    public isActive(): boolean {
        return !!this.accessToken;
    }

    public updateAccessToken(accessToken: string) {
        this.accessToken = accessToken;
        this.createInstance();
    }

    public saveFile(path: string, content: string, mimeType: string = 'application/json'): Promise<any> {
        let url = this.contentUrl('/files/upload');
        return this.callContent(url, content, { path, mode: { '.tag': 'overwrite' } });
    }

    public createSharedLink(path: string): Promise<string> {
        let url = this.url('/sharing/create_shared_link');
        return this.post(url, { path })
            .then(response => {
                console.debug('create shared link result', response);
                return response.url;
            });
    }

    public getFile(path: string): Promise<string> {
        let url = this.contentUrl('/files/download');
        return this.callContent(url, undefined, { path });
    }

    public getMetaData(path: string): Promise<any> {
        let url = this.url('/files/get_metadata');
        return this.post(url, { path });
    }

    public createFolder(path: string): Promise<boolean> {
        let url = this.url('/files/create_folder');
        return this.post(url, { path });
    }

    // TODO: support pages or load more
    public listFiles(path: string): Promise<CloudFile[]> {
        let url = this.url('/files/list_folder');
        return this.post(url, { path })
            .then(response => {
                console.debug('list files response', response);
                let files: CloudFile[] = [];
                for (let entry of response.entries) {
                    let readOnly = false;
                    if (entry.sharing_info) {
                        readOnly = entry.sharing_info.read_only;
                    }
                    let file = new CloudFile(entry.path, entry.name, readOnly);
                    file.pathDisplay = entry.path_display;
                    file.isFolder = entry[ '.tag' ].includes('folder');
                    files.push(file);
                }
                return files;
            });
    }

    public getAccount(): Promise<AccountObject> {
        let url = this.url('/users/get_current_account');
        return this.post(url)
            .then(account => {
                console.debug('current account', account);
                return {
                    displayName: account.name.display_name
                };
            });
    }

    private post(url, data?: any, headers?: any): Promise<any> {
        return this.call(url, 'post', data, headers);
    }

    private get(url, data?: any, headers?: any): Promise<any> {
        return this.call(url, 'get', data, headers);
    }

    // TODO: replace axios with abstract HTTP utils
    private call(url: string, method = 'get', data?: any, headers?: any): Promise<any> {
        headers = headers || {};
        if (this.accessToken) {
            headers[ 'Authorization' ] = `Bearer ${this.accessToken}`;
        } else console.error('calling dropbox with empty access_token', url, data, headers);

        if (!headers[ 'Content-Type' ]) {
            headers[ 'Content-Type' ] = 'application/json';
        }

        console.debug('calling dropbox with', method, url, headers, data);
        return <Promise<any>> (axios({ method, url, headers, data })
            .then(response => {
                console.debug('[dropbox call]', method, url, data, headers, response);
                return response.data;
            }));
    }

    private callContent(url: string, content: any, apiArg: any): Promise<any> {
        return this.call(url, 'post', content, {
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify(apiArg)
        });
    }

    private url(path: string) {
        return `${this.baseUrl}${path}`;
    }

    private contentUrl(path: string) {
        return `${this.contentBaseUrl}${path}`;
    }

    private createInstance() {
        console.debug('createInstance with token', this.accessToken, this.clientId);
        this.dpx = new Dropbox({
            clientId: this.clientId,
            accessToken: this.accessToken
        });
    }

    private translateError(error: Error) {
        return `${error.name} ${error.message}`;
    }
}
