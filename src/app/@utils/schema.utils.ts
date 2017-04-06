import * as GenerateSchema from 'generate-schema';

export function generateSchema(object: Object, title: string) {
    let schema = GenerateSchema.json(title, object);
    console.debug('generateSchema', object, schema);
    return schema;
}
