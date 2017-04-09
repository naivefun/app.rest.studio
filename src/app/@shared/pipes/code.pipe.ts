import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { highlightCode } from '../../@utils/string.utils';

@Pipe({ name: 'rsCode' })
export class CodePipe implements PipeTransform {
    public transform(input: string): string {
        return highlightCode(input);
    }
}
