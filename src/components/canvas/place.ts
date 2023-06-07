//@ts-ignore
// import * as joint from 'jointjs/src/core.mjs';
import * as pn from 'jointjs/src/shapes/pn.mjs';

export default class Place extends pn.Place {
    constructor() {
        super();
        this.attr('.label', {
            'text': 'ready',
            'fill': '#7c68fc'
        })
        this.attr('.root', {
            'stroke': '#9586fd',
            'stroke-width': 3
        });
        this.attr('.tokens > circle', {
            'fill': '#7a7e9b'
        });
    }

    defaults() {
        return {
            ...super.defaults,
            //attrs: Object.assign(super.defaults.attrs,{
            //    '.label': {
            //        'text': 'ready',
            //        'fill': '#7c68fc'
            //    },
            //    '.root': {
            //        'stroke': '#9586fd',
            //        'stroke-width': 3
            //    },
            //    '.tokens > circle': {
            //        'fill': '#7a7e9b'
            //    }
            // }),
//            tokens: 1
        }
    }

}