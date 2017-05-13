import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { EffectsModule } from '@ngrx/effects';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import '../styles/headings.css';

import '../styles/styles.scss';
import { AlertService } from './@shared/alert.service';
import { ChromeService } from './@shared/chrome.service';
import { CloudFilePickerComponent } from './@shared/components/cloud-file-picker.component';
import { CloudMappingComponent } from './@shared/components/cloud-mapping.component';
import { HeaderPickerComponent } from './@shared/components/header-picker.component';
import { PathSelectorComponent } from './@shared/components/path-selector.component';
import { SpinnerComponent } from './@shared/components/spinner.component';
import { StatusButtonComponent } from './@shared/components/status-button.component';
import { TextEditorComponent } from './@shared/components/text-editor.component';
import { ConfigService } from './@shared/config.service';
import { DbService } from './@shared/db.service';
import { DefaultHttpClient } from './@shared/http.service';
import { CodePipe } from './@shared/pipes/code.pipe';
import { JsonPipe } from './@shared/pipes/json.pipe';
import { ObjectToPairsPipe } from './@shared/pipes/object-to-pairs.pipe';
import { PathFilenamePipe } from './@shared/pipes/path-filename';
import { SafeHtmlPipe } from './@shared/pipes/safe-html.pipe';
import { SortKeysPipe } from './@shared/pipes/sort-keys.pipe';
import { TitleCasePipe } from './@shared/pipes/title-case.pipe';
import { YamlPipe } from './@shared/pipes/yaml.pipe';
import { SyncService } from './@shared/sync/sync.service';
import { AboutComponent } from './about';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { AppState, InternalStateType } from './app.service';
import { ConnectComponent } from './connect/connect.component';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { HomeComponent } from './home';
import { XLargeDirective } from './home/x-large';
import { ImportComponent } from './import/import.component';
import { NoContentComponent } from './no-content';
import { ParamGroupComponent } from './requests/component/request/param-group/param-group.component';
import { ParamItemComponent } from './requests/component/request/param-group/param-item.component';
import { RequestBuilderComponent } from './requests/component/request/request-builder.component';
import { RequestsRequestComponent } from './requests/component/request/request.component';
import { ResponseViewerComponent } from './requests/component/request/response-viewer.component';
import { ShareResourceComponent } from './requests/component/request/share-resource/share-resource.component';
import { RequestsSidebarComponent } from './requests/component/sidebar/sidebar.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsEffects } from './requests/store/effect';
import { reducer } from './store/reducer';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    ConfigService,
    ChromeService,
    DefaultHttpClient,
    DbService,
    SyncService,
    AlertService,
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
    bootstrap: [ AppComponent ],
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
        CloudMappingComponent,
        CloudFilePickerComponent,
        PathSelectorComponent,
        HeaderPickerComponent,

        // shared,
        TextEditorComponent,
        SpinnerComponent,
        StatusButtonComponent,
        ShareResourceComponent,
        ParamItemComponent,

        // pipes
        TitleCasePipe,
        CodePipe,
        YamlPipe,
        JsonPipe,
        SortKeysPipe,
        ObjectToPairsPipe,
        PathFilenamePipe,
        SafeHtmlPipe
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
