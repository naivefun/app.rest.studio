import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'rsPathFilename' })
export class PathFilenamePipe implements PipeTransform {
    public transform(input: string): string {
        let paths = input.split('/');
        return _.last(paths);
    }
}
