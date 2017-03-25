import { Component, Input } from '@angular/core';
import { DefaultHttpRequest } from '../../../@model/http/http-request';
import { DefaultHttpResponse } from '../../../@model/http/http-response';

@Component({
    selector: 'response-viewer',
    templateUrl: './response-viewer.component.html'
})
export class ResponseViewerComponent {
    @Input() public id: string;
    @Input() public request: DefaultHttpRequest;
    @Input() public response: DefaultHttpResponse;
}
