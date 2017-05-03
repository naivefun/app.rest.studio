import { Injectable } from '@angular/core';
import Noty from 'noty';

@Injectable()
export class AlertService {

    public info(text: string) {
        this.alert(text);
    }

    public successQuick(text: string) {
        this.alert(text, 'success', 1200);
    }

    public success(text: string) {
        this.alert(text, 'success', 2400);
    }

    public error(text: string) {
        this.alert(text, 'error', 12000);
    }

    public alert(text: string, type = 'info', timeout = 5000) {
        new Noty({
            text, type, timeout
        }).show();
    }
}
