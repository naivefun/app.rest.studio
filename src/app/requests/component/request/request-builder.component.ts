import { Component, Input } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';

@Component({
    selector: 'request-builder',
    templateUrl: './request-builder.component.html'
})
export class RequestBuilderComponent {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
}
