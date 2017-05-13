/*
 * Angular 2 decorators and services
 */
import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import * as _ from 'lodash';
import { DefaultHttpRequest, HttpRequestParam } from './@model/http/http-request';
import { DefaultHttpClient } from './@shared/http.service';
import { Store } from '@ngrx/store';
import { State } from './store/reducer';
import { ConfigService } from './@shared/config.service';
import { UpdateConfigAction } from './store/config-reducer';

declare const chrome: any, $: any;
/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
    public name = 'app.rest.studio';
    public extensionNotInstalled: boolean;

    constructor(public appState: AppState,
                private config: ConfigService,
                private store: Store<State>) {
    }

    public ngOnInit() {
        console.log('Initial App State');
        setTimeout(() => {
            this.extensionNotInstalled = !chrome.app.isInstalled;
            setTimeout(() => {
                $('[data-toggle="tooltip"]').tooltip();
            }, 50);
        }, 2000);

        this.config.getConfig()
            .then(config => this.store.dispatch(new UpdateConfigAction(config)));
    }

    public ngAfterViewInit() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    public installExtension() {
        chrome.webstore.install(undefined, success => {
            console.debug('extension installation success:', success);
        }, error => {
            console.debug('extension installation error:', error);
        });
    }

}
