import { Pipe, PipeTransform } from '@angular/core';
import { stringifyJson, stringifyYaml } from '../../@utils/string.utils';
import * as _ from 'lodash';

@Pipe({ name: 'rsSortKeys' })
export class SortKeysPipe implements PipeTransform {
    public transform(input: Object): Object {
        input = _(input).toPairs().sortBy(0).fromPairs().value();
        return input;
    }
}
