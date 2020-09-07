import './style.scss';
import '../node_modules/@fortawesome/fontawesome-free/js/all.js';
import {init as initNet} from './visualization/net';
import {init as initUI} from './ui/ui';

initUI();
initNet();
