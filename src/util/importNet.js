import {importData} from '@/examples/recognition/net';
import {addPlace, addTransition, connect, setPlaceContent,
  setArcLabel,
  setTransitionContent} from '@/components/jsonnets/net';
// import {setClickPosition} from '@/components/canvas/net';
// import {setPlaces, setTransisions, addArcToExportArray} from './exportNet';
/**
 * Imports a net into the frame.
 * @param {Boolean} upload
 * @param {Object} uploadData
 */
export function importNet(upload=false, uploadData) {
  const data = (upload) ? uploadData : importData;

  // Set the places, transitions and edges for later export.
  // setPlaces(data.places);
  // setTransisions(data.transitions);
  // setEdges(data.edges);

  // Add all places to the net.
  data.places.forEach((place) => {
    // setClickPosition(place.x, place.y);
    addPlace(place.id);
    setPlaceContent(place.id, place.content, place.name);
  });
  // Add all transitions to the net.
  data.transitions.forEach((transition) => {
    // setClickPosition(transition.x, transition.y);
    addTransition(transition.id);
    setTransitionContent(transition.id, transition.content, transition.name);
  });
  // Connect all arcs. And set their labels.
  data.arcs.forEach((importArc) => {
    connect(importArc.fromId, importArc.toId, importArc.id);
    setArcLabel(importArc.id, importArc.label);
    // addArcToExportArray(importArc.id, importArc.fromId, importArc.toId,
        // importArc.type,
        // importArc.label);
  } );
}

