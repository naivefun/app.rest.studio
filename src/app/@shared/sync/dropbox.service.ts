import { CloudFile, ConnectAccount, ConnectProvider } from '../../@model/sync/connect-account';
import { Injectable } from '@angular/core';
import { parseQueryString } from '../../@utils/url.utils';
import * as Dropbox from 'dropbox';

export interface CloudSyncProvider {
    authUrl(redirectUri: string): string;
    extractAccessToken(url: string): string;
    extractIdentity(url: string): string;
    isActive(): Promise<boolean>;
    saveFile(path: string, content: string, mimeType: string): Promise<boolean>;
    getFile(path: string): Promise<string>;
    listFiles(path: string): Promise<any[]>;
    getAccount();
}

import axios from 'axios';

export class DropboxSyncProvider implements CloudSyncProvider {
    private endpointPrefix: string = 'https://api.dropboxapi.com/2';
    private dpx: any;
    private clientId: string;
    private accessToken: string;

    constructor(clientId: string, accessToken?: string) {
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.createInstance(this.accessToken);
    }

    public authUrl(redirectUri: string): string {
        let authUrl = this.dpx.getAuthenticationUrl(redirectUri);
        return authUrl;
    }

    public extractIdentity(url: string): any {
        let parsed: any = parseQueryString(url);
        this.createInstance(parsed['access_token']);
        return parsed;
    }

    public extractAccessToken(url: string): string {
        let parsed: any = this.extractIdentity(url);
        let accessToken = parsed['access_token'];
        this.createInstance(accessToken);
        return accessToken;
    }

    public isActive(): Promise<Boolean> {
        return Promise.resolve(true);
    }

    public saveFile(path: string, content: string, mimeType: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public getFile(path: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public listFiles(path: string): Promise<any[]> {
        return this.dpx.filesListFolder({ path })
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
                    file.isFolder = entry['.tag'].includes('folder');
                    files.push(file);
                }
                return files;
            });
    }

    public getAccount() {
        let url = this.url('/users/get_current_account');
        return this.call(url, 'post')
            .then(response => {
                console.debug('current account', response);
                return response.data;
            });
    }

    private call(url: string, method = 'get') {
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
        return axios({ method, url, headers });
    }

    private url(path: string) {
        return `${this.endpointPrefix}${path}`;
    }

    private createInstance(accessToken?: string) {
        this.dpx = new Dropbox({ 
            clientId: this.clientId,
            accessToken
        });
    }
}
