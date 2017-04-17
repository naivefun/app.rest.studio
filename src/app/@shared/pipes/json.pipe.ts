import { Pipe, PipeTransform } from '@angular/core';
import { stringifyJson, stringifyYaml } from '../../@utils/string.utils';

@Pipe({ name: 'rsJson' })
export class JsonPipe implements PipeTransform {
    public transform(input: string, indent: number = null, sortKeys: boolean = false): string {
        return stringifyJson(input, indent);
    }
}
