export default class Net {
    transitions: Array<Object>
    places: Array<Object>
    arcs: Array<Object>

    constructor() {
        this.transitions = [];
        this.places = [];
        this.arcs = [];
    }
}