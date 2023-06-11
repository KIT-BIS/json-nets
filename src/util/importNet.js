import { importData } from '@/examples/recognition/net'
import {
  addPlace,
  addTransition,
  connect,
  setPlaceContent,
  setArcLabel,
  setTransitionContent
} from '@/components/jsonnets/net'

/**
 * Imports a net into the frame.
 * @param {Boolean} upload
 * @param {Object} uploadData
 */
export function importNet(upload = false, uploadData) {
  const data = upload ? uploadData : importData

  // Add all places to the net.
  data.places.forEach((place) => {
    addPlace(place.id)
    setPlaceContent(place.id, place.content, place.name)
  })
  // Add all transitions to the net.
  data.transitions.forEach((transition) => {
    addTransition(transition.id)
    setTransitionContent(transition.id, transition.content, transition.name)
  })
  // Connect all arcs. And set their labels.
  data.arcs.forEach((importArc) => {
    connect(importArc.fromId, importArc.toId, importArc.id)
    setArcLabel(importArc.id, importArc.label)
  })
}
