/**
 * based on odometer solution in
 * https://stackoverflow.com/questions/8936610/how-can-i-create-every-combination-possible-for-the-contents-of-two-arrays
 * @param {Array} arrayOfArrays
 * @return {Array}
 */
export function combineArrays(arrayOfArrays) {
  // First, handle some degenerate cases...

  if ( ! arrayOfArrays ) {
    // Or maybe we should toss an exception...?
    return [];
  }

  if ( ! Array.isArray( arrayOfArrays ) ) {
    // Or maybe we should toss an exception...?
    return [];
  }

  if ( arrayOfArrays.length == 0 ) {
    return [];
  }

  for ( let i = 0; i < arrayOfArrays.length; i++ ) {
    if ( ! Array.isArray(arrayOfArrays[i]) || arrayOfArrays[i].length == 0 ) {
      // If any of the arrays in array_of_arrays are not arrays or zero-length,
      // return an empty array...
      return [];
    }
  }

  // Done with degenerate cases...

  // Start "odometer" with a 0 for each array in array_of_arrays.
  const odometer = new Array( arrayOfArrays.length );
  odometer.fill( 0 );

  const output = [];

  let newCombination = formCombination( odometer, arrayOfArrays );

  output.push( newCombination );

  while ( odometerIncrement( odometer, arrayOfArrays ) ) {
    newCombination = formCombination( odometer, arrayOfArrays );
    output.push( newCombination );
  }

  return output;
}/* combineArrays() */


/**
 * Translate "odometer" to combinations from array_of_arrays
 * @param {Number} odometer
 * @param {Array} arrayOfArrays
 * @return {Array}
 */
function formCombination( odometer, arrayOfArrays ) {
  // In Imperative Programmingese (i.e., English):
  // let s_output = "";
  const output = [];
  for ( let i=0; i < odometer.length; i++ ) {
    // s_output += "" + array_of_arrays[i][odometer[i]];
    output.push(arrayOfArrays[i][odometer[i]]);
  }
  return output;
}/* formCombination() */

/**
 * @param {Number} odometer
 * @param {Array} arrayOfArrays
 * @return {Number}
 */
function odometerIncrement(odometer, arrayOfArrays) {
  // Basically, work you way from the rightmost digit of the "odometer"...
  // if you're able to increment without cycling that digit back to zero,
  // you're all done, otherwise,
  // cycle that digit to zero and go one digit to the
  // left, and begin again until you're able to increment a digit
  // without cycling it...simple, huh...?
  for ( let iOdometerDigit = odometer.length-1;
    iOdometerDigit >=0; iOdometerDigit-- ) {
    const maxee = arrayOfArrays[iOdometerDigit].length - 1;

    if ( odometer[iOdometerDigit] + 1 <= maxee ) {
      // increment, and you're done...
      odometer[iOdometerDigit]++;
      return true;
    } else {
      if ( iOdometerDigit - 1 < 0 ) {
        // No more digits left to increment, end of the line...
        return false;
      } else {
        // Can't increment this digit, cycle it to zero and continue
        // the loop to go over to the next digit...
        odometer[iOdometerDigit]=0;
        continue;
      }
    }
  }
}/* odometer_increment() */

