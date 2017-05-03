import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { CloudMapping, SyncProviderAccount } from '../../@model/sync';
import { BaseComponent } from './base.component';
import { CloudFilePickerComponent, SelectedPathObject } from './cloud-file-picker.component';
import { isBlank } from '../../@utils/string.utils';

@Component({
    selector: 'cloud-mapping',
    templateUrl: './cloud-mapping.component.html'
})
export class CloudMappingComponent extends BaseComponent implements OnChanges {
    @Input() public requestId: string;
    @Input() public mapping: CloudMapping;
    @Input() public syncAccounts: SyncProviderAccount[];
    @Output() public onMappingUpdated = new EventEmitter<CloudMapping>();
    @Output() public onSave = new EventEmitter<CloudMapping>();

    public folder: string = '';
    public fileName: string = '';

    @ViewChild('pathPicker')
    private pathPicker: CloudFilePickerComponent;

    public ngOnChanges(changes: SimpleChanges): void {
        console.info(this.constructor.name, changes);
        this.onChange(changes, 'mapping', value => {
            this.parsePath(this.mapping.pathDisplay);
        });
    }

    public selectPath() {
        this.pathPicker.show();
    }

    public pathSelected(pathObject: SelectedPathObject) {
        this.ensureMapping();
        this.parsePath(pathObject.path);

        this.mapping.pathDisplay = pathObject.path;
        this.mapping.syncAccountId = pathObject.syncAccount.id;
        this.onMappingUpdated.emit(this.mapping);
        this.pathPicker.hide();
    }

    public setPath(e) {
        this.ensureMapping();
        this.mapping.pathDisplay = e.target.value;
        this.onMappingUpdated.emit(this.mapping);
    }

    public save() {
        this.mapping.pathDisplay = `${this.folder}/${this.fileName}`;
        this.onSave.emit(this.mapping);
    }

    private ensureMapping() {
        this.mapping = this.mapping || new CloudMapping();
        if (!this.mapping.syncAccountId && !_.isEmpty(this.syncAccounts)) {
            this.mapping.syncAccountId = this.syncAccounts[ 0 ].id;
        }
    }

    private parsePath(path: string) {
        if (!isBlank(path)) {
            if (path.endsWith('.json')) {
                let slices = _.split(path, '/');
                this.fileName = _.last(slices);
                slices.pop();
                this.folder = slices.join('/');
            } else {
                this.folder = path;
            }
        }
    }
}
