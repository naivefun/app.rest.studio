import { provideReduxForms } from '@angular-redux/form';
import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgModule } from '@angular/core';
import { createLogger } from 'redux-logger';
import { RootEpics } from './root.epics';
import { rootReducer } from './root.reducer';
import { IAppState } from './root.types';

@NgModule({
    imports: [NgReduxModule, NgReduxRouterModule],
    providers: [RootEpics],
})
export class StoreModule {
    constructor(public store: NgRedux<IAppState>,
                devTools: DevToolsExtension,
                ngReduxRouter: NgReduxRouter,
                rootEpics: RootEpics) {
        store.configureStore(
            rootReducer,
            {},
            [createLogger(), ...rootEpics.create()],
            devTools.isEnabled() ? [devTools.enhancer()] : []
        );

        ngReduxRouter.initialize();

        provideReduxForms(store);
    }
}
