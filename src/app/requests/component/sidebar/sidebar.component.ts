import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { CreateRequestAction, DeleteRequestAction, SelectRequestAction, UpRequestAction } from '../../store/action';
import { OnPushComponent } from '../../../@shared/components/base.component';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
    selector: 'requests-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [`
        a.btn-create-request {
            display: block;
            text-align: center;
            padding: .5em;
            background-color: #e8e8e8;
            color: #bbb;
            font-weight: 400;
            transition-property: all;
            transition-duration: .3s;
        }

        a.btn-create-request:hover {
            background-color: #2c93e1;
            color: #fff;
            background: linear-gradient(to bottom, #086ed5, #055db5);
        }

        li {
            display: block;
            position: relative;
            padding: .4em .5em;
            word-wrap: break-word;
            line-height: 130%;
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            max-height: 54px;
            text-overflow: ellipsis;
        }

        li a {
            display: table-cell;
            color: #999;
        }

        li span {
            display: table-cell;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 20px;
            font-size: 14px;
        }

        li:hover {
            background-color: #eee;
        }

        li.active {
            background-color: #fff;
            color: #055db5;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }

        li.active a {
            color: #055db5;
        }

        li .title {
            flex-grow: 100;
        }

        li .menu {
            display: none;
            padding: 0 .25em;
        }

        .menu a {
            padding: 0 .25em;
            /*display: inline-flex;*/
        }

        li:hover .menu {
            display: flex;
            justify-items: center;
            align-items: center;
        }
    `]
})
export class RequestsSidebarComponent extends OnPushComponent implements OnChanges {
    @Input() public requests: DefaultHttpRequest[] = [];
    @Input() public activeRequestId: string;

    constructor(private store: Store<State>,
                private router: Router,
                private cd: ChangeDetectorRef) {
        super(cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.onChange(changes, 'requests', value => {
            console.debug('requests', this.requests, 'id', this.activeRequestId);
            if (!_.isEmpty(this.requests)) {
                let requestId = this.activeRequestId || this.requests[0].id;
                this.router.navigate([`/requests/${requestId}`]);
                this.selectRequest(requestId);
            }
        });
    }

    public createRequest() {
        let request = DefaultHttpRequest.defaultRequest();
        this.store.dispatch(new CreateRequestAction(request));
    }

    public selectRequest(id: string) {
        this.activeRequestId = id; // ? should remove
        this.store.dispatch(new SelectRequestAction(id));
    }

    public deleteRequest(id: string, e: any) {
        if (e) e.stopPropagation();
        this.store.dispatch(new DeleteRequestAction(id));
    }

    public upRequest(id: string, e: any) {
        if (e) e.stopPropagation();
        this.store.dispatch(new UpRequestAction(id));
    }

    public goToRequest(request: DefaultHttpRequest) {
        this.router.navigate([`/requests/${request.id}`]);
    }
}
