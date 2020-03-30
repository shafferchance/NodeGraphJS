import Component from '../lib/Component.js';
import store from '../store/combined.js';

export default class TextInput extends Component {
    constructor(props) {
        super({
            store,
            element: props.dest
        });
        if (props.hasOwnProperty('effect')) {
            this.effect = props.effect;
        }
        this.id = this.idGene();
    }

    setRendered(effects) {
        this.effect += effects;
    }

    render() {
        const formEle = document.createElement('form');
        const inputEle = document.createElement('input');
        const submitEle = document.createElement('button');

        formEle.id = this.id;
        submitEle.type = 'submit';
        submitEle.textContent = 'Submit';

        formEle.addEventListener('submit', e => {
            e.preventDefault();
            let val = inputEle.value.trim();
            if (val.length) {
                store.dispatch('addItem', val);
                inputEle.value = '';
                inputEle.focus();

                if (this.effect !== undefined) {
                    // May make each render asynchronous eventually
                    for (let ele of this.effect) {
                        ele.render();
                    }
                }
            }
        });

        formEle.appendChild(inputEle);
        formEle.appendChild(submitEle);

        const ele = document.getElementById(this.id);
        if (ele !== null) {
            this.element.replaceChild(formEle, ele);
        } else {
            this.element.appendChild(formEle);
        }
    }
}
