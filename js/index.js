import Toolbar from './Components/SimPieceToolbar-Event.js';

const body = document.getElementsByTagName('body')[0];

const toolbar = new Toolbar(body, {styles: "toolbar"});

toolbar.render();
