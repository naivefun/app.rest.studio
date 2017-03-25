import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { RequestsComponent } from './requests/requests.component';
import { RequestsRequestComponent } from './requests/component/request/request.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: '/requests', pathMatch: 'full' },
    {
        path: 'requests',
        component: RequestsComponent,
        children: [
            { path: ':id', component: RequestsRequestComponent }
        ]
    },
    { path: '**', component: NoContentComponent },
];
