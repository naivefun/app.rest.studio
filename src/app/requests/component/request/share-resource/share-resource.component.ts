import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CloudMapping } from '../../../../@model/sync';
import { BaseComponent } from '../../../../@shared/components/base.component';
import { ResourceType } from '../../../../@model/core';

@Component({
    selector: 'share-resource',
    templateUrl: './share-resource.component.html'
})
export class ShareResourceComponent extends BaseComponent implements OnChanges {
    @Input() public resourceType: ResourceType = ResourceType.REQUEST;
    @Input() public resourceObject: Object;
    @Input() public mapping: CloudMapping;

    public creatingMapping: boolean;
    public uploading: boolean;
    public downloading: boolean;

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    private beforeUpload() {
        switch (this.resourceType) {
            default:
        }
    }

    private afterDownload(downloadedData: any) {
        switch (this.resourceType) {
            default:
        }
    }
}
