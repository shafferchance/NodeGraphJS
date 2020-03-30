import Component from '../lib/Component-proof.js/index.js';
import store from '../store/combined.js';

export default class Flow extends Component{
    constructor(dest, initial = 0, funct = {}) {
        super({
            store,
            element: dest
        })
        this.conns = [];
        this.funct = funct;
        this.value = initial;
    }

    addConn(conn) {
        this.conns.push(conn);
    }

    getConns() {
        return this.conns;
    }

    rmConn(conn) {
        this.conns.splice(this.conns.indexOf(conn));
    }

    getFunction() {
        return this.funct;
    }

    getValue() {
        return this.value;
    }

    setFunct(funct) {
        this.funct = funct;
    }

    setValue(val) {
        this.value = val;
    }

    render() {
        const main = document.createElement('div');
        // const label = document.createElement('label');
        main.className = 'circle';
        dest.appendChild(main);
    }
}