import { shortid } from '../../@utils/string.utils';

export class ConnectAccount {
    public id: string;
    public provider: ConnectProvider;
    public accessToken: string;
    public title: string;
    public uid: string;
    public accountId: string;
    public connectedAt: number;

    constructor(provider: ConnectProvider, accessToken: string, title: string = undefined) {
        this.id = shortid();
        this.provider = provider;
        this.accessToken = accessToken;
        this.title = title;
        this.connectedAt = Date.now();
    }
}

export enum ConnectProvider {
    DROPBOX,
    GOOGLE_DRIVE
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
