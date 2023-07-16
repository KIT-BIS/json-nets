// functions for handling JSON / consistent error handling
// as I will probably have to parse JSON data often
export function parseJSON(jsonString: string) {
    // todo: error functions
    return JSON.parse(jsonString)
}