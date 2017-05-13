export function translateHttpError(error: any) {
    if (error) {
        if (error.response) {
            return `${error.message}: ${error.response.statusText}`;
        }

        return error.message;
    }
}

export function translateDbError(error: any) {
    return 'Datastore error: ' + error.message;
}
