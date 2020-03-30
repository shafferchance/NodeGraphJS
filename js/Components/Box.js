import Component from '../lib/Component';
import Store from '../store/store';

export default class Box extends Component {
    constructor(dest) {
        super({
            Store,
            element: dest
        });
    }

    render() {
        if (Store.state.items.length === 0) {
            this.element.innerHTML = `<p class ="no-items">
                You've done nothign yet &#x1f622;</p>`;
            return;
        }

        self.element.innerHTML = `
            <div id=${generateId()} class="box"></div>`;
    }
}