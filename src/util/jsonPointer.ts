import * as JSONPointer from 'json-pointer';
import type { JSONComplex } from './jsonOperations';

// TODO: find proper pattern how to deal with errors/exceptions

export function getFragment(document: JSONComplex, pathExpression: string) {
  // const json = JSON.parse(document);
  // console.log(pathExpression)
  // console.log(document)
  return JSONPointer.get(document, pathExpression);
}

export function isValidForPathExpression(document: JSONComplex, pathExpression: string) {
  // const json = JSON.parse(document);
  return JSONPointer.has(document, pathExpression);
}

export function getDepth(pathExpression: string) {
  if (pathExpression === '/' || pathExpression === '') {
    return 0;
  }
  return JSONPointer.parse(pathExpression).length;
}

// selects first node in path expression
export function getEnvPathExpression(pathExpression: string) {
  if (pathExpression === '/' || pathExpression === '') {
    return '';
  }
  return JSONPointer.compile([JSONPointer.parse(pathExpression)[0]]);
}

export function getParentPathExpression(pathExpression: string) {
  if (pathExpression === '/' || pathExpression === '') {
    return ''
  }
  const tokens = JSONPointer.parse(pathExpression);
  if (tokens.length > 1) {
    tokens.pop();
    return JSONPointer.compile(tokens); 
  } else {
    return '';
  }
}

export function getKey(pathExpression: string): string {
  if (pathExpression === '/' || pathExpression === '') {
    return '';
  }
  const key = JSONPointer.parse(pathExpression).pop();
  if (key) {
    return key
  } else {
    return '';
  }
}

export function concatPathExpressions(pathExpression: string, token: string) {
  const tokens = JSONPointer.parse(pathExpression)
  tokens.push(token);
  return JSONPointer.compile(tokens)
}

export function sortByOrder(pathExpressions: Array<string>, document: JSONComplex) {
  // const json = JSON.parse(document);
  return pathExpressions.sort((a, b) => {
    if (a === b) {
      return 0
    } else if (getDepth(a) > getDepth(b)){
      return 1;
    } else if (getDepth(a) < getDepth(b)) {
      return -1;
    } else {
      // depth is equal
      const parentAExpr = getParentPathExpression(a);
      const parentBExpr = getParentPathExpression(b);
      if (parentAExpr !== parentBExpr) {
        return 0
      } else {
        //same parent
        // console.log(parentAExpr)
        // 
        const parent = getFragment(document, parentAExpr);
        if (Array.isArray(parent)) {
          // todo: may be necessary to check if keys are actually number
          const bKey = Number(getKey(b))
          const aKey = Number(getKey(a))
          if (aKey < bKey) {
            return -1
          } else {
            // b greater than a, equality not possible in this branch
            return 1
          }
        } else {
          // is object
          // Todo: in some tests, path expressions are still storted
          // which is not wrong but weird
          // need more extensive tests for these functions at one point
          return 0
        }
      }
    }
  })
}

//TODO: maybe I need pair wise check for an array of Expressions?
export function checkForConflict(pathExpressionA: string, pathExpressionB: string) {
  if (pathExpressionA === pathExpressionB) {
    return true;
  }
  const tokensA = JSONPointer.parse(pathExpressionA);
  const tokensB = JSONPointer.parse(pathExpressionB);
  if (tokensA.length <= tokensB.length) {
    let conflict = true;
    for (let i = 0; i < tokensA.length; i++) {
      if (tokensA[i] !== tokensB[i]) {
        conflict = false;
        break;
      }
    }
    return conflict;
  } else {
    let conflict = true;
    for (let i = 0; i < tokensB.length; i++) {
      if (tokensA[i] !== tokensB[i]) {
        conflict = false;
        break;
      }
    }
    return conflict;
  }
}

export function pairwiseCheckForConflict(pathExpressions: Array<string>) {
  // https://stackoverflow.com/questions/12104226/pairwise-combinations-of-entries-in-a-javascript-array
  let pairwise = pathExpressions.sort().reduce(
    (acc, item, i, arr) => acc.concat(
      // ts get's thrown off her, but so far it works as intended...
      //@ts-ignore
      arr.slice(i + 1).map(_item => [item, _item])
    ),
  []);
  
  // let conflict = false;
  for (let i = 0; i < pairwise.length; i++) {
    if(checkForConflict(pairwise[i][0], pairwise[i][1])) {
      // todo: could return all potential conflicts?
      return pairwise[i];
    }
  }
  return false;
  

}