import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'status-button',
    template: `
        <a class="{{clz}}" [ngClass]="{disabled: loading}" (click)="clicked()" *ngIf="!buttonMode">
            {{loading ? loadingTitle : title}}
            <spinner [size]="12" [color]="'tomato'" *ngIf="loading"></spinner>
        </a>

        <button class="btn btn-primary" [ngClass]="{'btn-sm': small, disabled: loading}" *ngIf="buttonMode">
            {{title}}
            <spinner *ngIf="loading"></spinner>
        </button>
    `
})
export class StatusButtonComponent implements OnChanges {
    @Input() public buttonMode: boolean;
    @Input() public title: string;
    @Input() public loadingTitle: string;
    @Input() public clz: string;
    @Input() public small: boolean;
    @Input() public loading: boolean = false;
    @Input() public disabled: boolean = false;

    @Output() public onClick = new EventEmitter<void>();

    public ngOnChanges(changes: SimpleChanges) {
        console.debug('status button changes', changes);
    }

    public clicked() {
        if (!this.loading && !this.disabled)
            this.onClick.emit();
    }
}
