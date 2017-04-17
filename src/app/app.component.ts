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

    constructor(public appState: AppState) {
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state, _.trim(null));
        setTimeout(() => {
            this.extensionNotInstalled = !chrome.app.isInstalled;
            setTimeout(() => {
                $('[data-toggle="tooltip"]').tooltip();
            }, 50);
        }, 2000);
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

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
