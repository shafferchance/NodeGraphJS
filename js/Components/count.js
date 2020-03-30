import Component from '../lib/Component.js';
import store from '../store/combined.js';

export default class Count extends Component {
    constructor(dest) {
        super({
            store,
            element: dest
        });
        this.id = this.idGene();
    }

    render() {
        let suffix = store.state.items.length !== 1 ? 's' : '';
        let emoji = store.state.items.length > 0 ? 'praise' : 'sad';

        const p = document.createElement('p');
        const span = document.createElement('span');
        const small = document.createElement('small');
        
        span.textContent = `${store.state.items.length}`;
        small.textContent = "You've done";
        p.id = this.id;
        p.appendChild(small);
        p.appendChild(span);

        small.textContent = `thing${suffix} today ${emoji}`;
        p.appendChild(small);
        const ele = document.getElementById(this.id);
        if (ele !== null) {
            this.element.replaceChild(p, ele);
        } else {
            this.element.appendChild(p);
        }
    }
}