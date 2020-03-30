import EventManager from './EventManager.js';

export default class ComponentE {
    constructor(props = {}) {
        this.index = this.accumulator(
            props['index'] !== undefined ? props['index'] : 0);
        this.element = props['element'] !== undefined ? props['element'] :
                            console.error("Parent element missing!");
        this.id = props['id'] !== undefined ? props['id'] : this.idGen();
        this.observer = EventManager.events; // Gives access to PubSub
        this.render = this.render || function () {};
        this.reRender = false;
        this.observer.subscribe('stateChange', () => {
            if (this.reRender === true) {
                console.log(`Re-rendering component ${id}`);
                this.render();
            }
        }); 
    }

    // Meh solution to not rescanning and mutating idicies of array on
    // connection mutation
    * accumulator (i) {
        while(i < Infinity) {
            yield i;
            i++;
        }
    }

    idGen() {
        return '_' + Math.random().toString(12).substring(2,9);
    }

    
}