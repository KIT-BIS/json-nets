export const MODE_NONE = 'MODE_NONE';
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE';
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION';
export const MODE_REMOVE_NODE = 'MODE_REMOVE_NODE';
export const MODE_MOVE = 'MODE_MOVE';
export const MODE_CONNECT_START = 'MODE_CONNECT_START';
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE';
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION';
export const MODE_ADD_TOKEN = 'MODE_ADD_TOKEN';
export const MODE_REMOVE_TOKEN = 'MODE_REMOVE_TOKEN';

export const ui = {
  mode: MODE_NONE,
  setMode: function(mode) {
    if (mode === MODE_MOVE) {
      this.visualization.toggleDraggable(true);
    } else if (this.mode === MODE_MOVE) {
      this.visualization.toggleDraggable(false);
    }

    this.mode = mode;
  },
  init: function(net, visualization) {
    this.net = net;
    this.visualization = visualization;
    this.createButton('Add Places', 10, 20, () => {
      this.setMode(MODE_ADD_PLACE);
    });
    this.createButton('Add Transitions', 10, 70, () => {
      this.setMode(MODE_ADD_TRANSITION);
    });
    this.createButton('Delete Node', 10, 120, () => {
      this.setMode(MODE_REMOVE_NODE);
    });
    this.createButton('Connect', 10, 170, () => {
      this.setMode(MODE_CONNECT_START);
    });
    this.createButton('Move', 10, 220, () => {
      this.setMode(MODE_MOVE);
    });
    this.createButton('Add Token', 10, 270, () => {
      this.setMode(MODE_ADD_TOKEN);
    });
    this.createButton('Remove Token', 10, 320, () => {
      this.setMode(MODE_REMOVE_TOKEN);
    });
    this.createButton('Step', 10, 370, () => {
      this.setMode(MODE_NONE);
      net.step();
    });
    this.createButton('NOP', 10, 420, () => {
      this.setMode(MODE_NONE);
    });
    document.addEventListener('click', (event) => {
      if (this.mode === MODE_ADD_PLACE) {
        this.visualization.clickPosition = {x: event.clientX, y: event.clientY};
        this.net.addPlace();
      } else if (this.mode === MODE_ADD_TRANSITION) {
        this.visualization.clickPosition = {x: event.clientX, y: event.clientY};
        this.net.addTransition();
      } else if (this.mode === MODE_CONNECT_START) {
        // NOP handled by net visualization.
      } else if (this.mode === MODE_MOVE) {
        // NOP
      }
    });
  },
  createButton: function(name, x, y, callback) {
    const button = document.createElement('button');
    button.innerText = name;
    button.style = `position: absolute; left: ${x}px; top: ${y}px;`;

    button.addEventListener('click', (event) => {
      callback();
      event.stopPropagation();
    });
    document.body.append(button);
  },
};

