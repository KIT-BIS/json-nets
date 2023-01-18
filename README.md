# Prototypical implementation of JSON-Nets

## Usage

You can select different editor modes:
- Create place: Click on the canvas to create a new place.
- Create transition: Click on the canvas to create  a new transition.
- Create arc: Click on two elements to connect them with an arc.
- Delete: Click on an element to delete it from the canvas.
- Move: Click and drag an element to move it.
- Pan: Click and drag the canvas.
- Inspect: Click on an element to change its inscription or marking.
- Step: Click on a transition to fire.

Different JSON technologies can be used for inscriptions:
- Places are inscribed with [JSON-Schema](https://json-schema.org/).
- Arcs from places to transitions are inscribed with a [JSONPath-filter](https://github.com/dchester/jsonpath).
- Transitions and arcs from transitions to places are inscribed with [Jsonnet](https://jsonnet.org/).
