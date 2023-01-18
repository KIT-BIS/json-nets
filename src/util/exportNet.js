let _places = [];
let _transitions = [];
let _edges = [];
/**
 * Exports a new place
 * @param {Integer} x - Coordinates of the click event.
 * @param {Integer} y - Coordinates of the click event.
 * @param {Object} data - added schema and data
 * @param {String} id - id of the place
 */
export function addPlacesExportArray(x, y, id, name, content) {
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
export function removePlacesExportArray(id) {
  _places = _places.filter((place) => {
    return place.id !== id;
  });

  _edges = _edges.filter((edge) => {
    if (edge.type === 'preset') {
      return edge.fromId === id;
    } else if (edge.type === 'postset') {
      return edge.toId === id;
    }
  });

//  const edgesToRemove = _edges.filter((edge) => {
//    return edge.place.id === id;
//  });
//  edgesToRemove.forEach((edge) => {
//    disconnect(edge.id);
//  });
}

/**
 * Exports a new transition
 * @param {Integer} x - Coordinates of the click event.
 * @param {Integer} y - Coordinates of the click event.
 * @param {String} id - id of the transition
 * @param {String} content - content of the transition
 */
export function addTransitionsExportArray(x, y, id, name, content) {
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
export function removeTransitionExportArray(id) {
  _transitions = _transitions.filter((transition) => {
    return transition.id !== id;
  });

  _edges = _edges.filter((edge) => {
    if (edge.type === 'preset') {
      return edge.toId === id;
    } else if (edge.type === 'postset') {
      return edge.fromId === id;
    }
  });

//  edgesToRemove.forEach((edge) => {
//    disconnect(edge.id);
//  });

//  const newTransitionsList = _transitions.filter((transition) => {
//    if (transition.id === id) {
//      transitionToRemove = transition;
//      return false;
//    } else {
//      return true;
//    }
//  });
//  _transitions = newTransitionsList;
}

/**
 * Expors the net as a JSON file
 */
export function exportNet() {
  console.log(_places);
  console.log(_transitions);
  console.log(_edges);
  const exportData = {
    places: _places,
    transitions: _transitions,
    edges: _edges,
  };
  // Convert JSON string to BLOB.
  const json = JSON.stringify(exportData);
  download(json, 'export.json', 'application/json');
}

/**
 *
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
/**
 * Set the content of a place (expected to be an array of objects)
 * @param {String} placeID The place to set the content.
 * @param {Object} content New content of the place.
 * @param {String} name Name of the place.
 */
export function updatePlaceContentExportArray(placeID, content, name) {
  const place = _places.find((place) => place.id === placeID);
  place.content = content;
  place.name = name;
}
/**
 * Set the content of a transition (expected to be a string)
 * @param {String} transitionID
 * @param {String} content
 */
export function updateTransitionContentExportArray(transitionID, content, name) {
  const transition = _transitions.find(
      (transition) => transition.id === transitionID);
  transition.content = content;
  transition.name = name;
}


/**
 * Exports a new edge
 * @param {String} edgeID - Id of the edge
 * @param {String} fromId - Id from where to connect
 * @param {String} toId - Id where to connect
 * @param {String} type - Type of the edge
 */
export function addEdgesExportArray(edgeID, fromId, toId, type, label) {
  const edge = {
    id: edgeID,
    fromId,
    toId,
    type,
    label,
  };

  _edges.push(edge);
}
/**
 * Update the label of an edge
 * @param {String} edgeID
 * @param {Object} label
 */
export function updateEdgeLabelExportArray(edgeID, label) {
  const edge = _edges.find((edge) => edge.id === edgeID);
  edge.label = label;
}
/**
 * Removes an edge from the net.
 * @param {String} edgeID
 */
export function removeEdgesExportArray(edgeID) {
  const edges = _edges.filter((edge) => {
    return edge.id !== edgeID;
  });
  _edges = edges;
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
 * Sets the edges
 * @param {Array} edges
 */
export function setEdges(edges) {
  _edges = edges;
}
