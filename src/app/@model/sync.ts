import { shortid } from '../@utils/string.utils';

export class SyncProviderAccount {
    public id: string;
    public provider: SyncProvider;
    public accessToken: string;
    public title: string;
    public uid: string;
    public accountId: string;
    public connectedAt: number;

    constructor(provider: SyncProvider, accessToken: string, title?: string) {
        this.id = shortid();
        this.provider = provider;
        this.accessToken = accessToken;
        this.title = title;
        this.connectedAt = Date.now();
    }
}

export enum SyncProvider {
    DROPBOX,
    GOOGLE_DRIVE,
    BAIDU,
    ONE_DRIVE
}

export class CloudFile {
    public path: string;
    public pathDisplay: string;
    public title: string;
    public isFolder: boolean;
    public readOnly: boolean;
    public subFolders: CloudFile[];

    constructor(path: string, title: string, readOnly: boolean) {
        this.path = path;
        this.title = title;
        this.readOnly = readOnly;
    }
}

export interface TokenObject {
    accessToken: string;
    uid: string;
    accountId: string;
}

export interface AccountObject {
    displayName: string;
}

export class CloudMapping {
    public syncAccountId: string;
    public path: string;
    public pathDisplay: string;
    public sharedLink: string;
    public lastUploaded: number;
    public lastDownloaded: number;
    public autoUpload: boolean;
    public readOnly: boolean;
    public serverModified: number;
    public clientModified: number;
}

export enum SyncObjectType {
    REQUEST,
    COLLECTION,
    OBJECT,
    PAGE,
}
