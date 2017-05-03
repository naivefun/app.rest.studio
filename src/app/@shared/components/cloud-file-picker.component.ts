import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { CloudFile, SyncProviderAccount } from '../../@model/sync';
import { SyncService } from '../sync/sync.service';
import { BaseDialogComponent } from './base-dialog.component';

@Component({
    selector: 'cloud-file-picker',
    templateUrl: './cloud-file-picker.component.html'
})
export class CloudFilePickerComponent extends BaseDialogComponent implements OnChanges {
    @Input() public syncAccounts: SyncProviderAccount[];
    @Input() public defaultPath: string;
    @Input() public folderOnly: boolean;
    @Input() public fileOnly: boolean;
    @Input() public fileExtension: string;
    @Output() public onPathSelected = new EventEmitter<SelectedPathObject>();

    public files: CloudFile[];
    public selectedFile: CloudFile;
    public selectedPath: string = '';
    public pathHistory: string[] = [];
    private historyIndex: number = 0;
    private selectedAccount: SyncProviderAccount;
    private cache: { [path: string]: CloudFile[] } = {};

    constructor(private syncService: SyncService,
                private cd: ChangeDetectorRef) {
        super(cd);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this.onChange(changes, 'syncAccounts', value => {
            if (!_.isEmpty(this.syncAccounts)) {
                this.selectedAccount = this.syncAccounts[ 0 ];
                this.cache = {};
                this.listFiles('');
            }
        });
    }

    // TODO: cache loaded files
    public listFiles(path: string, cacheOk = true, updateHistory = true) {
        let onFileInfoLoaded = (files: CloudFile[]) => {
            this.selectedPath = path;
            this.files = this.filterFiles(files);
            if (updateHistory) {
                this.pushHistoryPath(path);
            }
            this.refresh(true);
        };

        if (cacheOk) {
            let cachedFiles = this.cache[ path ];
            if (!_.isEmpty(cachedFiles)) {
                onFileInfoLoaded(cachedFiles);
                return;
            }
        }

        this.getSyncProvider().listFiles(path)
            .then((files: CloudFile[]) => {
                files = this.filterFiles(files);
                onFileInfoLoaded(files);
                this.cache[ path ] = files;
            });
    }

    public onMenuPathSelected(path: string) {
        this.listFiles(path);
    }

    public createFolder() {
        let folderName = prompt('Please input folder name');
        if (folderName) {
            this.getSyncProvider().createFolder(this.selectedPath + '/' + folderName)
                .then(success => {
                    this.listFiles(this.selectedPath, false);
                });
        }
    }

    public selectPath(path?: string) {
        path = path || this.selectedPath;
        this.onPathSelected.emit({
            path,
            syncAccount: this.selectedAccount
        });
    }

    public pushHistoryPath(path: string) {
        this.pathHistory = _.slice(this.pathHistory, 0, this.historyIndex + 1);
        this.pathHistory.push(path);
        this.historyIndex = Math.min(this.pathHistory.length - 1, this.historyIndex + 1);
        console.debug('history', this.pathHistory);
    }

    public back() {
        this.historyIndex = this.historyIndex - 1;
        this.historyIndex = Math.max(0, this.historyIndex);
        this.listFiles(this.pathHistory[ this.historyIndex ], true, false);
    }

    public forward() {
        this.historyIndex = Math.min(this.pathHistory.length - 1, this.historyIndex + 1);
        this.listFiles(this.pathHistory[ this.historyIndex ], true, false);
    }

    public reload() {
        this.listFiles(this.selectedPath, false, false);
    }

    private getSyncProvider() {
        let syncProvider = this.syncService.syncProvider(
            this.selectedAccount.provider, this.selectedAccount.accessToken);
        return syncProvider;
    }

    private filterFiles(files: CloudFile[]) {
        if (this.folderOnly) {
            return files.filter(file => file.isFolder);
        } else if (this.fileExtension) {
            return files.filter(file => {
                return file.isFolder ||
                    file.pathDisplay.endsWith(this.fileExtension);
            });
        }
        return files;
    }
}

export interface SelectedPathObject {
    path: string;
    syncAccount: SyncProviderAccount;
}
