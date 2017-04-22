import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { RequestsComponent } from './requests/requests.component';
import { RequestsRequestComponent } from './requests/component/request/request.component';
import { ConnectComponent } from './connect/connect.component';
import { ImportComponent } from './import/import.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: '/requests', pathMatch: 'full' },
    {
        path: 'requests',
        component: RequestsComponent,
        children: [
            { path: ':id', component: RequestsRequestComponent }
        ]
    },
    { path: 'connect', component: ConnectComponent },
    { path: 'import', component: ImportComponent },
    { path: '**', component: NoContentComponent },
];
