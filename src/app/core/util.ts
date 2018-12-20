export function stringify(object:object, pretty = true):string {
    if (pretty)
        return JSON.stringify(object, null, '    ');
    else
        return JSON.stringify(object);
}

