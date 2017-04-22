import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { highlightCode } from '../../@utils/string.utils';
import { Pair } from '../../@model/pair';

@Pipe({ name: 'rsToPairs' })
export class ObjectToPairsPipe implements PipeTransform {
    public transform(object: Object): Pair[] {
        let pairs: Pair[] = [];
        _.forOwn(object, (value, key) => {
            pairs.push({ value, key });
        });
        return pairs;
    }
}
