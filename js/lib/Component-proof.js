import Store from '../store/store.js';

export default class Component {
    constructor(props = {}) {
        this.id = '';
        this.reRender = false;
        this.render = this.render || function () {};
        if (props.store instanceof Store) {
            props.store.events.subscribe('stateChange', () => {
                console.log(props.store.state);
                this.render();
            });
        }

        if (props.hasOwnProperty('element')) {
            this.element = props.element;   
        }
    }

    idGene() {
        return '_' + Math.random().toString(12).substring(2,9);
    }

    mount(newEle) {
        return new Promise((res, rej) => {
            const ele = document.getElementById(this.id);
            if (ele !== null) {
                this.element.replaceChild(newEle, ele);
                res({res: true, msg:"Successfully re-mounted!"});
            } else {
                this.element.appendChild(newEle);
                res({res: true, msg: "Successfully mounted"});
            }
            rej("Element is not to be re-rendered!");
        });
    }

    /*
        Come up with a systen to parse where to put things
        and how to arrange the information passed. May need
        to refer to the transpiler research to get working
        correctly. As well as build a factory around that
        ideal.
    */

    // TODO: Edit to allow element instantiation from here
    /*createElement(type, config, ...args) {
        const props = Object.assign({}, config);
        const rawChildren = args.length > 0 ? args : [];
        props.children = rawChildren
                    .filter(c => c != null && c !== false)
                    .map(c => c instanceof Object ? c :
                                this.createTextElement(c));
        return { type, props };
    }

    createTextElement(txt) {
        // `this` keyword should not be required due to the
        // of an arrow f(x) to invoke the method
        return this.createElement("TEXT_NODE", {value: txt});
    }*/
}