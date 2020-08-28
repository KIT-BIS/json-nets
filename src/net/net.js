import {Place} from './place';
import {Transition} from './transition';
import {Token} from './token';

export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE';
export const EVENT_ADD_TRANSITION = 'EVENT_ADD_TRANSITION';
export const EVENT_CHANGE_TOKEN = 'EVENT_CHANGE_TOKEN';
export const EVENT_CONNECT = 'EVENT_CONNECT';
export const EVENT_DISCONNECT = 'EVENT_DISCONNECT';
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE';
export const EVENT_REMOVE_TRANSITION = 'EVENT_REMOVE_TRANSITION';
export const EVENT_REMOVE_EDGE = 'EVENT_REMOVE_EDGE';

export const net = {
  transitions: [],
  places: [],
  observer: null,
  addPlace: function() {
    const newPlace = new Place();
    this.places.push(newPlace);
    this.notify(EVENT_ADD_PLACE, newPlace._id);
  },
  addTransition: function() {
    const newTransition = new Transition();
    this.transitions.push(newTransition);
    this.notify(EVENT_ADD_TRANSITION, newTransition._id);
  },
  removePlace: function(placeID) {
    this.places = this.places.filter((place) => {
      place._id !== placeID;
    });
    this.notify(EVENT_REMOVE_PLACE, placeID);

    this.transitions.forEach((transition) => {
      transition.preset.forEach((place) => {
        if (place._id === placeID) {
          this.notify(EVENT_DISCONNECT, {from: place._id, to: transition._id});
        }
      });
      transition.postset.forEach((place) => {
        if (place._id === placeID) {
          this.notify(EVENT_DISCONNECT, {from: transition._id, to: place._id});
        }
      });
    });
  },
  removeTransition: function(transitionID) {
    let transitionToRemove = null;
    this.transitions = this.transitions.filter((transition) => {
      if (transition._id === transitionID) {
        transitionToRemove = transition;
        return false;
      } else {
        return true;
      }
    });
    this.notify(EVENT_REMOVE_TRANSITION, transitionID);

    transitionToRemove.preset.forEach((place) => {
      this.notify(EVENT_DISCONNECT, {from: place._id,
        to: transitionToRemove._id});
    });
    transitionToRemove.postset.forEach((place) => {
      this.notify(EVENT_DISCONNECT, {from: transitionToRemove._id,
        to: place._id});
    });
  },
  addToken: function(placeID) {
    const place = this.places.find((place) => place._id === placeID);
    place.tokens.push(new Token());
    this.notify(EVENT_CHANGE_TOKEN, {placeID, num: place.tokens.length});
  },
  removeToken: function(placeID) {
    const place = this.places.find((place) => place._id === placeID);
    place.tokens.pop();
    this.notify(EVENT_CHANGE_TOKEN, {placeID, num: place.tokens.length});
  },
  connect: function(fromID, toID) {
    const nodes = this.places.concat(this.transitions);
    const from = nodes.find((node) => node._id === fromID);
    const to = nodes.find((node) => node._id === toID);
    if (from instanceof Place) {
      if (to instanceof Place) {
        console.log('Can\'t connect Place with Place.');
      } else if (to instanceof Transition) {
        to.preset.push(from);
      } else {
        console.log('Can only connect Places and Transitions.');
      }
    } else if (from instanceof Transition) {
      if (to instanceof Transition) {
        console.log('Can\'t connect Transition with Transition.');
      } else if (to instanceof Place) {
        from.postset.push(to);
      } else {
        console.log('Can only connect Places and Transitions.');
      }
    }
    this.notify(EVENT_CONNECT, {from: from._id, to: to._id});
  },
  step: function() {
    const alifeTransitions = [];
    this.transitions.forEach((transition) => {
      let isAlive = true;
      if (transition.preset.length < 1) {
        isAlive = false;
      }
      if (transition.preset.some((place) => place.tokens.length < 1)) {
        isAlive = false;
      }
      if (isAlive) {
        alifeTransitions.push(transition);
      }
    });
    alifeTransitions.forEach((transition) => {
      let hadConflict = false;
      transition.preset.forEach((place) => {
        if (place.tokens.length < 1) {
          hadConflict = true;
          return;
        }
        this.removeToken(place._id);
      });
      transition.postset.forEach((place) => {
        if (!hadConflict) {
          this.addToken(place._id);
        }
      });
    });
  },
  register: function(observer) {
    console.log(observer);
    this.observer = observer;
  },
  notify: function(event, payload) {
    this.observer.receiveNotification(event, payload);
  },
};
