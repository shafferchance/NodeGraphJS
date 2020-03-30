import Component from '../lib/Component';
import Store from '../store/store';
import Box from '../Components/Box';

export default class Container extends Component {
    constructor(dest) {
        super({
            Store,
            element: dest,
        });
    }

    render() {
        if (Store.state.items.length === 0) {
            this.element.innerHTML = `
                <p class="no-items">You've done nothing yet 
                &#x1f622;</p>`;
            return;
        }
        let id = generateId();
        this.element.innerHTML = `
            <div id=${id} class="container"></div>`;
        const child = document.getElementById(id);
        
    }
}