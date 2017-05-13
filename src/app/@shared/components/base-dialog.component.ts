import { BaseComponent, OnPushComponent } from './base.component';
import { shortid } from '../../@utils/string.utils';
import { ChangeDetectorRef } from '@angular/core';

declare const $: any;

export class BaseDialogComponent extends OnPushComponent {
    public dialogId: string;

    constructor(cd: ChangeDetectorRef) {
        super(cd);
        this.dialogId = shortid();
        setTimeout(() => {
            let modal: any = $(`#${this.dialogId}`);
            modal.on('hidden.bs.modal', e => {
                console.log('dialog: ', this.dialogId, 'is closed');
            });
        }, 5000);
    }

    public show() {
        let modal: any = $(`#${this.dialogId}`);
        modal.modal('show');
    }

    public hide() {
        let modal: any = $(`#${this.dialogId}`);
        modal.modal('hide');
    }
}
