import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { RequestsComponent } from './requests/requests.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: '/requests', pathMatch: 'full' },
    { path: 'requests', component: RequestsComponent },
    { path: '**', component: NoContentComponent },
];
