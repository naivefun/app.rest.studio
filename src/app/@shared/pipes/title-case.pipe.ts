import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'rsTitleCase' })
export class TitleCasePipe implements PipeTransform {
    public transform(input: string): string {
        if (!input) {
            return '';
        } else {
            input = _.trim(input);
            return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
        }
    }
}
