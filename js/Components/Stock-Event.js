import ComponentE from '../lib/Component-Event.js';

export default class Stock extends ComponentE{
    constructor(dest, initial = 0) {
        super({
            element: dest,
        })
        this.val = initial;
        this.conns = [];
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