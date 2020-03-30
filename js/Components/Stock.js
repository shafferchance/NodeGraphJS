import Component from '../lib/Component.js';
import store from '../store/combined.js';

export default class Stock extends Component{
    constructor(dest, initial = 0) {
        super({
            store,
            element: dest
        })
        this.in = [];
        this.out = [];
        this.value = initial;
    }

    addConn(conn) {
        this.conns.push(conn);
    }

    getConns() {
        return this.conns;
    }

    rmConn(conn) {
        this.conns.splice(this.conns.indexOf(conn),1);
    }
    
    getValue() {
        return this.value;
    }

    setValue(val) {
        this.value = val;
    }

    render() {
        const main = document.createElement('div');
        // const label = document.createElement('div');
        main.className = 'box';
        dest.appendChild(main);
    }
}