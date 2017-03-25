const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
    if (typeCache[<string> label]) {
        throw new Error(`Action Type "${label}" is not unique`);
    }

    typeCache[<string> label] = true;
    return <T> label;
}

export function mergeState(state: Object, properties: Object): any {
    let merged = Object.assign({}, state || {}, properties || {});
    return merged;
}
