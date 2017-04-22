import axios from 'axios';
import * as Dropbox from 'dropbox';
import { CloudFile } from '../../@model/sync/connect-account';
import { parseHashParams } from '../../@utils/url.utils';

export interface CloudSyncProvider {
    authUrl(redirectUri: string): string;
    extractAccessToken(url: string): string;
    extractIdentity(url: string): string;
    isActive(): Promise<boolean>;
    saveFile(path: string, content: string, mimeType: string): Promise<any>;
    getFile(path: string): Promise<string>;
    createSharedLink(path: string): Promise<string>;
    listFiles(path: string): Promise<CloudFile[]>;
    getAccount();
}

export class DropboxSyncProvider implements CloudSyncProvider {
    private endpointPrefix: string = 'https://api.dropboxapi.com/2';
    private dpx: any;
    private clientId: string;
    private accessToken: string;

    constructor(clientId: string, accessToken?: string) {
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.createInstance();
    }

    public authUrl(redirectUri: string): string {
        let authUrl = this.dpx.getAuthenticationUrl(redirectUri);
        return authUrl;
    }

    public extractIdentity(url: string): any {
        let parsed: any = parseHashParams(url);
        this.accessToken = parsed[ 'access_token' ];
        this.createInstance();
        return parsed;
    }

    public extractAccessToken(url: string): string {
        let parsed: any = this.extractIdentity(url);
        let accessToken = parsed[ 'access_token' ];
        return accessToken;
    }

    public isActive(): Promise<Boolean> {
        return Promise.resolve(true);
    }

    public saveFile(path: string, content: string, mimeType: string): Promise<any> {
        let url = this.url('/files/upload', true);
        return this.call(url, 'post', content, {
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({ path, mode: { '.tag': 'overwrite' } })
        });
    }

    public createSharedLink(path: string): Promise<string> {
        let url = this.url('/sharing/create_shared_link');
        return this.call(url, 'post', { path })
            .then(response => {
                console.debug('create shared link result', response);
                return response.url;
            });
    }

    public getFile(path: string): Promise<string> {
        let url = this.url('/files/download', true);
        return this.call(url, 'post', undefined, {
            'Dropbox-API-Arg': JSON.stringify({ path })
        });
    }

    public listFiles(path: string): Promise<CloudFile[]> {
        let url = this.url('/files/list_folder');
        return this.call(url, 'post', { path })
            .then(response => {
                console.debug('list files response', response);
                let files: CloudFile[] = [];
                for (let entry of response.entries) {
                    let readOnly = false;
                    if (entry.sharing_info) {
                        readOnly = entry.sharing_info.read_only;
                    }
                    let file = new CloudFile(path, entry.name, readOnly);
                    file.pathDisplay = entry.path_display;
                    file.isFolder = entry[ '.tag' ].includes('folder');
                    files.push(file);
                }
                return files;
            });
    }

    public getAccount() {
        let url = this.url('/users/get_current_account');
        return this.call(url, 'post')
            .then(account => {
                console.debug('current account', account);
                return account;
            });
    }

    private call(url: string, method = 'get', data?: any, headers?: any): Promise<any> {
        headers = headers || {};
        headers[ 'Authorization' ] = `Bearer ${this.accessToken}`;
        if (!headers[ 'Content-Type' ]) {
            headers[ 'Content-Type' ] = 'application/json';
        }

        console.debug('calling with', method, url, headers, data);
        return <Promise<any>> (axios({ method, url, headers, data })
            .then(response => response.data));
    }

    private url(path: string, content = false) {
        if (content) {
            return 'https://content.dropboxapi.com/2' + path;
        }
        return `${this.endpointPrefix}${path}`;
    }

    private createInstance() {
        console.debug('createInstance with token', this.accessToken, this.clientId);
        this.dpx = new Dropbox({
            clientId: this.clientId,
            accessToken: this.accessToken
        });
    }
}
