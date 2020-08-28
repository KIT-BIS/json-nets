import './style.css';
import {net} from './net/net';
import {Net as Visualization} from './visualization/net';
import {ui} from './ui/ui';

const visualization = new Visualization(net, ui);
ui.init(net, visualization);

window.net = net;
window.visualization = visualization;
window.ui = ui;
