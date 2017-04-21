import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, RouterModule } from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';

import '../styles/styles.scss';
import '../styles/headings.css';
import { RequestsComponent } from './requests/requests.component';
import { RequestsSidebarComponent } from './requests/component/sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { RequestsEffects } from './requests/store/effect';
import { RouterStoreModule } from '@ngrx/router-store';
import { RequestsRequestComponent } from './requests/component/request/request.component';
import { RequestBuilderComponent } from './requests/component/request/request-builder.component';
import { ResponseViewerComponent } from './requests/component/request/response-viewer.component';
import { ParamGroupComponent } from './requests/component/request/param-group/param-group.component';
import { TitleCasePipe } from './@shared/pipes/title-case.pipe';
import { CodePipe } from './@shared/pipes/code.pipe';
import { ChromeService } from './@shared/chrome.service';
import { DefaultHttpClient } from './@shared/http.service';
import { ConfigService } from './@shared/config.service';
import { YamlPipe } from './@shared/pipes/yaml.pipe';
import { TextEditorComponent } from './@shared/components/text-editor.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DbService } from './@shared/db.service';
import { JsonPipe } from './@shared/pipes/json.pipe';
import { SortKeysPipe } from './@shared/pipes/sort-keys.pipe';
import { SyncService } from './@shared/sync/dropbox.service';
import { DropboxSyncProvider } from './@shared/sync/sync.service';
import { ConnectComponent } from './connect/connect.component';
import { ImportComponent } from './import/import.component';
import { ObjectToPairsPipe } from './@shared/pipes/object-to-pairs.pipe';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    ConfigService,
    ChromeService,
    DefaultHttpClient,
    DbService,
    SyncService,
    DropboxSyncProvider
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        NoContentComponent,
        RequestsComponent,
        RequestsRequestComponent,
        RequestsSidebarComponent,
        RequestBuilderComponent,
        ResponseViewerComponent,
        ParamGroupComponent,
        ConnectComponent,
        ImportComponent,

        // shared,
        TextEditorComponent,

        // pipes
        TitleCasePipe,
        CodePipe,
        YamlPipe,
        JsonPipe,
        SortKeysPipe,
        ObjectToPairsPipe
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
        // store
        StoreModule.provideStore(reducer),
        EffectsModule.run(RequestsEffects),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension()
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public appState: AppState) {
    }

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
