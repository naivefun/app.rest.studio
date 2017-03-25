import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { SelectRequestAction } from '../../store/action';
@Component({
    selector: 'requests-request',
    templateUrl: './request.component.html'
})
export class RequestsRequestComponent implements OnInit {
    private id: string;

    constructor(private store: Store<State>,
                private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            console.debug('params', params);
            this.id = params['id'];
            if (this.id) {
                this.store.dispatch(new SelectRequestAction(this.id));
            }
        });
    }
}
