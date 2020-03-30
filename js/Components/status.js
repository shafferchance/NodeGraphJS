import Component from '../lib/Component.js';
import store from '../store/combined.js';

export default class Status extends Component {
    constructor(dest) {
        super({
            store,
            element: dest,
        });
        this.id = this.idGene();
    }

    render() {
        let suffix = store.state.items.length !== 1 ? 's' : '';
        const span = document.createElement('span');
        span.id = this.id;
        span.textContent = `${store.state.items.length} item${suffix}`;
        const ele = document.getElementById(this.id);
        if (ele !== null) {
            this.element.replaceChild(span, ele);
        } else {    
            this.element.appendChild(span);
        }
    }
}