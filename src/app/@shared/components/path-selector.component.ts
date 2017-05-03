import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'path-selector',
    template: `
        <a class="link ion-folder" (click)="selectPath('')" *ngIf="segments?.length"> </a>
        <ng-template ngFor let-seg [ngForOf]="segments" ; let-i="index" *ngIf="segments?.length">
            <span>/</span>
            <a class="link" (click)="select(i + 1, seg)">{{seg}}</a>
        </ng-template>
    `
})
export class PathSelectorComponent implements OnChanges {
    @Input() public path: string;
    @Output() public onPathSelected = new EventEmitter<string>();
    public segments: string[] = [];
    public selectedIndex: number = 0;

    public ngOnChanges(changes: SimpleChanges): void {
        let pathChange = changes[ 'path' ];
        if (pathChange && _.isString(pathChange.currentValue)) {
            this.parsePath(pathChange.currentValue);
        }
    }

    public select(index: number, seg: string) {
        if (index === this.selectedIndex) return;

        let segments = this.segments.slice(0, index);
        let path = '/' + segments.join('/');
        this.selectedIndex = index;
        this.selectPath(path);
    }

    public selectPath(path: string) {
        if (!path) this.segments = [];
        this.onPathSelected.emit(path);
    }

    private parsePath(path: string) {
        this.segments = path.split('/').filter(seg => _.trim(seg));
    }

}
