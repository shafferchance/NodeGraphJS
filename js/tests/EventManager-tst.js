//import PubSub from '../lib/PubSub.js';
const PubSub = require('../lib/PubSub');

function EventManager() {
    this.events = new PubSub();
}

// export default new EventManager();
module.exports = EventManager;