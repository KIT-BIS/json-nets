import Konva from 'konva';
import {EVENT_ADD_PLACE, EVENT_ADD_TRANSITION,
  EVENT_CONNECT,
  EVENT_CHANGE_TOKEN,
  EVENT_REMOVE_PLACE,
  EVENT_REMOVE_TRANSITION,
  EVENT_DISCONNECT} from '../net/net';
import {MODE_CONNECT_START, MODE_CONNECT_FROM_TRANSITION,
  MODE_CONNECT_FROM_PLACE, MODE_ADD_TOKEN, MODE_REMOVE_TOKEN,
  MODE_REMOVE_NODE} from '../ui/ui';

/**
 * Creates a new net Visualization.
 * @param {Object} net The net to visualize.
 * @param {Object} ui Reference to user interface.
 */
export function Net(net, ui) {
  document.body.innerHTML = `<div id="container"></div>`;
  this.net = net;
  this.ui = ui;
  this.clickPosition = {x: 0, y: 0};
  this.lastClickedPlace = null;
  this.lastClickedTransition = null;
  this.connectors = [];
  net.register(this);

  const width = window.innerWidth;
  const height = window.innerHeight;

  this.stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
  });

  this.layer = new Konva.Layer();

  // add the layer to the stage
  this.stage.add(this.layer);
};

Net.prototype.toggleDraggable = function(toggle) {
  const transitions = this.layer.find('Rect');
  transitions.each((t) => {
    t.draggable(toggle);
  });
  const places = this.layer.find('Group');
  places.each((p) => {
    p.draggable(toggle);
  });
};
Net.prototype.updateLines = function(connectedNode) {
  const affectedCons = this.connectors.filter((conn) => {
    return conn.fromID === connectedNode || conn.toID === connectedNode;
  });
  affectedCons.forEach((conn) => {
    const from = this.stage.findOne('#' + conn.fromID);
    const to = this.stage.findOne('#' + conn.toID);
    conn.line.points(this.calculatePoints(from.position(), to.position()));
  });
  this.layer.batchDraw();
};
Net.prototype.calculatePoints = function(from, to) {
  const radius = 50;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(-dy, dx);

  const points = [
    from.x + -radius * Math.cos(angle + Math.PI),
    from.y + radius * Math.sin(angle + Math.PI),
    to.x + -radius * Math.cos(angle),
    to.y + radius * Math.sin(angle),
  ];
  return points;
};
Net.prototype.receiveNotification = function(event, payload) {
  if (event === EVENT_ADD_TRANSITION) {
    const rect = new Konva.Rect({
      x: this.clickPosition.x,
      y: this.clickPosition.y,
      width: 70,
      offsetX: 35,
      offsetY: 25,
      height: 50,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      id: payload,
    });

    rect.on('click', (event) => {
      if (this.ui.mode === MODE_CONNECT_START) {
        this.lastClickedTransition = payload;
        this.ui.setMode(MODE_CONNECT_FROM_TRANSITION);
      } else if (this.ui.mode === MODE_CONNECT_FROM_PLACE) {
        this.net.connect(this.lastClickedPlace, payload);
        this.ui.setMode(MODE_CONNECT_START);
      } else if (this.ui.mode === MODE_REMOVE_NODE) {
        this.net.removeTransition(payload);
      }
    });

    rect.on('dragmove', () => {
      this.updateLines(payload);
    });

    // add the shape to the layer
    this.layer.add(rect);
    this.layer.batchDraw();
  } else if (event === EVENT_ADD_PLACE) {
    const group = new Konva.Group({
      x: this.clickPosition.x,
      y: this.clickPosition.y,
      id: payload,
    });

    const text = new Konva.Text({
      text: '0',
      x: -3,
      y: -3,
    });
    const circle = new Konva.Circle({
      radius: 35,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
    });
    group.add(circle);
    group.add(text);

    circle.on('click', (event) => {
      if (this.ui.mode === MODE_CONNECT_START) {
        this.lastClickedPlace = payload;
        this.ui.setMode(MODE_CONNECT_FROM_PLACE);
      } else if (this.ui.mode === MODE_CONNECT_FROM_TRANSITION) {
        this.net.connect(this.lastClickedTransition, payload);
        this.ui.setMode(MODE_CONNECT_START);
      } else if (this.ui.mode === MODE_ADD_TOKEN) {
        this.net.addToken(payload);
      } else if (this.ui.mode === MODE_REMOVE_TOKEN) {
        this.net.removeToken(payload);
      } else if (this.ui.mode === MODE_REMOVE_NODE) {
        this.net.removePlace(payload);
      }
    });

    group.on('dragmove', () => {
      this.updateLines(payload);
    });

    this.layer.add(group);
    this.layer.batchDraw();
  } else if (event === EVENT_CONNECT) {
    const from = this.stage.findOne('#' + payload.from).position();
    const to = this.stage.findOne('#' + payload.to).position();

    const points = this.calculatePoints(from, to);

    const line = new Konva.Arrow({
      stroke: 'black',
      // id: connect.id,
      fill: 'black',
      points: points,
    });
    this.connectors.push({fromID: payload.from, toID: payload.to, line});
    this.layer.add(line);
    this.layer.batchDraw();
  } else if (event === EVENT_DISCONNECT) {
    this.connectors = this.connectors.filter((connector) => {
      if (connector.fromID === payload.from && connector.toID === payload.to ) {
        connector.line.destroy();
        return false;
      } else {
        return true;
      }
    });
  } else if (event === EVENT_CHANGE_TOKEN) {
    const place = this.stage.findOne('#' + payload.placeID);
    const text = place.findOne('Text');
    text.text(payload.num);
    this.layer.batchDraw();
  } else if (event === EVENT_REMOVE_PLACE) {
    const place = this.stage.findOne('#' + payload);
    place.destroy();
    this.layer.batchDraw();
  } else if (event === EVENT_REMOVE_TRANSITION) {
    const transition = this.stage.findOne('#' + payload);
    transition.destroy();
    this.layer.batchDraw();
  }
};
