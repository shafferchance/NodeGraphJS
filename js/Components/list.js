import Component from '../lib/Component.js';
import store from '../store/combined.js';

export default class List extends Component {
    constructor(dest) {
        super({
            store,
            element: dest
        });
        this.id = this.idGene();
        this.zero = false;
    }

    render() {
        const frag = document.createDocumentFragment();
        if (store.state.items.length === 0) {
            const p = document.createElement('p');
            p.className = "no-items";
            p.textContent = "You've done nothing yet :sad:";
            this.zero = true;
            //this.element.appendChild(p);
            frag.appendChild(p);
        } else if (this.zero === true) {
            const none = document.getElementsByClassName("no-items");
            for (let obj of none) {
                this.element.removeChild(obj);
            }
            this.zero = false;
        }

        const ul = document.createElement('ul');
        let count = 0;
        ul.className = "app__items";
        ul.id = this.id;

        store.state.items.map(item => {
            const li = document.createElement('li');
            const del = document.createElement('button');

            li.textContent = item;
            li.className = `${count}`;
            li.appendChild(del);
            
            del.textContent = "del";
            del.addEventListener('click', e => {
                e.preventDefault();
                store.dispatch('clearItem', { index: li.className });
            });
            
            count++;
            ul.appendChild(li);
        });
        frag.appendChild(ul);

        const ele = document.getElementById(this.id);
        if (ele !== null) {
            this.element.replaceChild(frag, ele);
        } else {
            this.element.appendChild(frag);
        }
    }
};