import {importData} from '../examples/paper/net';
import {addPlace, addTransition, connect, setPlaceContent,
  setEdgeLabel,
  setTransitionContent} from '../net/net';
import {setClickPosition} from '../visualization/net';
import {setPlaces, setTransisions, setEdges} from './exportNet';
/**
 * Imports a net into the frame.
 * @param {Boolean} upload
 * @param {Object} uploadData
 */
export function importNet(upload=false, uploadData) {
  const data = (upload) ? uploadData : importData;

  // Set the places, transitions and edges for later export.
  setPlaces(data.places);
  setTransisions(data.transitions);
  setEdges(data.edges);
  // Add all places to the net.
  data.places.forEach((place) => {
    setClickPosition(place.x, place.y);
    addPlace(place.id);
    setPlaceContent(place.id, place.data);
  });
  // Add all transitions to the net.
  data.transitions.forEach((transition) => {
    setClickPosition(transition.x, transition.y);
    addTransition(transition.id);
    setTransitionContent(transition.id, transition.content);
  });
  // Connect all edges.And set their labels.
  data.edges.forEach((edge) => {
    const edgeID = connect(edge.fromId, edge.toId);
    setEdgeLabel(edgeID, edge.label);
  } );
}
/**
 * Upload a file for import.
 * @param {Event} event
 */
export function uploadNet(event) {
  const input = event.target;

  const reader = new FileReader();
  reader.onload = function() {
    const text = reader.result;
    const data = JSON.parse(text);
    importNet(true, data);
    console.log(JSON.parse(text));
  };
  reader.readAsText(input.files[0]);
}
