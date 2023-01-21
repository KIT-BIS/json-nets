let _places = [];
let _transitions = [];
let _arcs = [];

/**
 * Exports a new place
 * @param {Integer} x - Coordinates of the click event.
 * @param {Integer} y - Coordinates of the click event.
 * @param {String} id - id of the place
 * @param {String} name - name of the place
 * @param {Object} content - added schema and data
 */
export function addPlaceToExportArray(x, y, id, name, content) {
  const place = {
    id,
    x,
    y,
    name,
    content,
  };
  _places.push(place);
}

/**
 * Removes a place from the net.
 * @param {String} id - id of the place
 */
export function removePlaceFromExportArray(id) {
  _places = _places.filter((place) => {
    return place.id !== id;
  });

  _arcs = _arcs.filter((arc) => {
    if (arc.type === 'preset') {
      return arc.fromId === id;
    } else if (arc.type === 'postset') {
      return arc.toId === id;
    }
  });
}

/**
 * Exports a new transition
 * @param {Integer} x - Coordinates of the click event.
 * @param {Integer} y - Coordinates of the click event.
 * @param {String} id - id of the transition
 * @param {String} name - name of the transition
 * @param {String} content - content of the transition
 */
export function addTransitionToExportArray(x, y, id, name, content) {
  const transition = {
    id,
    x,
    y,
    name,
    content,
  };
  _transitions.push(transition);
}

/**
 * Removes a transition from the net.
 * @param {String} id - id of the transition
 */
export function removeTransitionFromExportArray(id) {
  _transitions = _transitions.filter((transition) => {
    return transition.id !== id;
  });

  _arcs = _arcs.filter((arc) => {
    if (arc.type === 'preset') {
      return arc.toId === id;
    } else if (arc.type === 'postset') {
      return arc.fromId === id;
    }
  });
}

/**
 * Set the content of a place (expected to be an array of objects)
 * @param {String} placeID The place to set the content.
 * @param {Object} content New content of the place.
 * @param {String} name Name of the place.
 */
export function updatePlaceContentInExportArray(placeID, content, name) {
  const place = _places.find((place) => place.id === placeID);
  place.content = content;
  place.name = name;
}

/**
 * Set the content of a transition (expected to be a string)
 * @param {String} transitionID
 * @param {String} content
 * @param {String} name
 */
export function updateTransitionContentInExportArray(transitionID,
    content, name) {
  const transition = _transitions.find(
      (transition) => transition.id === transitionID);
  transition.content = content;
  transition.name = name;
}

/**
 * Exports an arc
 * @param {String} arcID - Id of the arc
 * @param {String} fromId - Id from where to connect
 * @param {String} toId - Id where to connect
 * @param {String} type - Type of the arc
 * @param {String|Object} label - Label of the arc
 */
export function addArcToExportArray(arcID, fromId, toId, type, label) {
  const arc = {
    id: arcID,
    fromId,
    toId,
    type,
    label,
  };

  _arcs.push(arc);
}

/**
 * Update the label of an arc
 * @param {String} arcID
 * @param {Object} label
 */
export function updateArcLabelInExportArray(arcID, label) {
  const arc = _arcs.find((arc) => arc.id === arcID);
  arc.label = label;
}

/**
 * Removes an arc from the net.
 * @param {String} arcID
 */
export function removeArcFromExportArray(arcID) {
  const arcs = _arcs.filter((arc) => {
    return arc.id !== arcID;
  });
  _arcs = arcs;
}

/**
 * Sets the places
 * @param {Array} places
 */
export function setPlaces(places) {
  _places = places;
}

/**
 * Sets the transitions
 * @param {Array} transitions
 */
export function setTransisions(transitions) {
  _transitions = transitions;
}

/**
 * Sets the arcs
 * @param {Array} arcs
 */
export function setArcs(arcs) {
  _arcs = arcs;
}

/**
 * Expors the net as a JSON file
 */
export function exportNet() {
  const exportData = {
    places: _places,
    transitions: _transitions,
    arcs: _arcs,
  };
  // Convert JSON string to BLOB.
  const json = JSON.stringify(exportData);
  download(json, 'export.json', 'application/json');
}

/**
 * Download json file.
 * @param {*} content
 * @param {*} fileName
 * @param {*} contentType
 */
function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
