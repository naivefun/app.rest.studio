import { Subscription } from 'rxjs';
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { HeaderTab } from './headers/page-header.component';

export class BaseComponent implements OnChanges, OnDestroy {
    private _subscriptions: { [key: string]: Subscription } = {};

    public ngOnChanges(changes: SimpleChanges): void {
        console.info(this.constructor.name, changes);
    }

    public onChange(changes: SimpleChanges, field: string,
                    consumer: (value, previousValue, change) => void,
                    allowNull = false) {
        let change = changes[field];
        if (change) {
            if (consumer && (allowNull || change.currentValue)) {
                consumer(change.currentValue, change.previousValue, change);
            }
        }
    }

    public ngOnDestroy(): void {
        if (this._subscriptions) {
            Object.keys(this._subscriptions).forEach(key => {
                let sub = this._subscriptions[key];
                if (sub && !sub.closed) sub.unsubscribe();
            });
        }
    }

    public stopPropagation(e: Event) {
        if (e) e.stopPropagation();
    }
}

export class OnPushComponent extends BaseComponent {
    private changeDetectorRef: ChangeDetectorRef;

    constructor(cd: ChangeDetectorRef) {
        super();
        this.changeDetectorRef = cd;
    }

    public refresh(detach?: boolean) {
        if (this.changeDetectorRef)
            if (detach) {
                this.changeDetectorRef.detach();
                this.changeDetectorRef.detectChanges();
                this.changeDetectorRef.reattach();
                console.info('detach refreshed');
            } else {
                this.changeDetectorRef.markForCheck();
                console.info('mark refreshed');
            }
    }
}

export class EditableComponent<T> extends OnPushComponent {

    public view: EditableView;
    public originObject: T;
    public editingObject: T;
    public displayObject: T;

    constructor(cd: ChangeDetectorRef, view: EditableView = EditableView.READ) {
        super(cd);
        this.view = view;
    }
}

export enum EditableView {
    READ = 0, EDIT = 1
}
