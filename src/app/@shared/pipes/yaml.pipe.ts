import { Pipe, PipeTransform } from '@angular/core';
import { stringifyYaml } from '../../@utils/string.utils';

@Pipe({ name: 'rsYaml' })
export class YamlPipe implements PipeTransform {
    public transform(input: string): string {
        return stringifyYaml(input);
    }
}
