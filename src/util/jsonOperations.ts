import { getFragment, getKey, getParentPathExpression, isValidForPathExpression } from "./jsonPointer";

export type JSONValue =
    JSONSimple
    | JSONObject
    | JSONArray;

export type JSONSimple = 
    string
    | number
    | boolean
    | null;

export type JSONComplex = 
   JSONArray 
   | JSONObject


export type JSONObject =  { [x: string]: JSONValue }
export type JSONArray = Array<JSONValue>;
export type JSONMarking = Array<JSONObject>


// is graceful in interpreting key as array index: 0x => 0
// returns the modified array/object
// (strictly speaking this isn't necessary, since arrays/object are passed by reference)
// should I actually create an array/object clone?
export function remove(key: string | number, complexValue: JSONComplex) {
    if (!Array.isArray(complexValue)) {
        if (!(typeof complexValue === 'object' && complexValue !== null)) {
            throw Error('should be object or array')
        }
    }

    if (Array.isArray(complexValue)) {
        if (complexValue.length === 0) {
            return complexValue;
        }

        let index;
        if (typeof key === 'string') {
            index = parseInt(key)
            if (isNaN(index)) {
                complexValue.pop()
                return complexValue;
            }
        } else {
            index = key;
        }

        if (index >= complexValue.length || index < 0) {
            complexValue.pop();
            return complexValue;
        } else {
            complexValue.splice(index,1)
            return complexValue;
        }
    } else {
        delete complexValue[key];
        return complexValue;
    }
}

// since simple values are passed by value, I should always work with the return value I guess?
// todo: rethink logic ... (also in diss) - probably makes sense to only insert into complex values
// and catch other possibilities earlier
export function insert(key: string | number, value: JSONValue, toInsert: JSONValue) {
    if (!Array.isArray(value)) {
        if (!(typeof value === 'object' && value !== null)) {
            return toInsert;
        }
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            value.push(toInsert);
            return value;
        }

        let index;
        if (typeof key === 'string') {
            index = parseInt(key)
            if (isNaN(index)) {
                value.push(toInsert)
                return value;
            }
        } else {
            index = key;
        }

        if (index >= value.length || index < 0) {
            value.push(toInsert);
            return value;
        } else {
            value.splice(index, 0, toInsert)
            return value;
        }
    } else {
        value[key] = toInsert;
        return value;
    }
}

// TODO: to enable parallel operations I guess I need to leverage pass by reference...
// also for pathExpression operations
export function deepRemove(pathExpression: string, complexValue: JSONComplex) {
    if (!isValidForPathExpression(complexValue, pathExpression)) {
            throw Error('value not valid for path expression')
    }

    const parentPathExpression = getParentPathExpression(pathExpression);
    const key = getKey(pathExpression);
    const parent = getFragment(complexValue, parentPathExpression);
    // console.log('before:')
    // console.log(JSON.stringify(parent))
    // console.log(JSON.stringify(complexValue))
    remove(key, parent);
    // console.log('after:') // console.log(JSON.stringify(parent))
    // console.log(JSON.stringify(complexValue))
    return complexValue;

}


export function deepInsert(pathExpression: string, complexValue: JSONComplex, key: string | number, toInsert: JSONValue) {
    if (!isValidForPathExpression(complexValue, pathExpression)) {
        throw Error('value not valid for path expression')
    }

    const parent = getFragment(complexValue, pathExpression);
    if (isComplex(parent)) {
        insert(key, parent, toInsert);
        return complexValue;
    } else {
        // TODO: too complex thought train?
        // also this way, insert operation can probably work only on complex Values
        // maybe the activation rule should say that I am only allowed to select complex values for insertions ... yes. ... this is the way
        const parentsParentPath = getParentPathExpression(pathExpression)
        const parentsKey = getKey(pathExpression);
        const parentsParent = getFragment(complexValue, parentsParentPath);
        parentsParent[parentsKey] = toInsert;
        return complexValue;
    }

}

export function isComplex(value: JSONValue) {
    if (!Array.isArray(value)) {
        if (!(typeof value === 'object' && value !== null)) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }

}