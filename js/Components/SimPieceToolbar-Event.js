import ComponentE from '../lib/Component-Event.js';
import SimPiece from './SimPiece-Event.js';

export default class Toolbar extends ComponentE {
    constructor(dest, props= {}) {
        super({
            element: dest,
        });
        this.id = this.idGen();
        if (props.hasOwnProperty('styles')) {
            if (Array.isArray(props['styles'])) {
                this.classList = props['styles'];
            } else {
                this.className = props['styles'];
            }
        }
    }

    render() {
        const div = document.createElement('div');
        if (this.classList !== undefined) {
            div.classList = this.classList;
        } else {
            div.className = this.className;
        }
        div.appendChild(
            buttFactory('Add SinkI', e => {
                simFactory(e.target.offsetParent, 'sinkI').render();
            }));
        div.appendChild(
            buttFactory('Add SinkO', e => {
                simFactory(e.target.offsetParent, 'sinkO').render();
            }));
        div.appendChild(
            buttFactory('Add FlowI', e => {
                simFactory(e.target.offsetParent, 'flowI').render();
            }));
        div.appendChild(
            buttFactory('Add FlowO', e => {
                simFactory(e.target.offsetParent, 'flowO').render();
            }));
        div.appendChild(
            buttFactory('Add Stock', e => {
                simFactory(e.target.offsetParent, 'stock').render();
            }));
        div.appendChild(
            buttFactory('Add Aux', e => {
                simFactory(e.target.offsetParent, 'aux').render();
            }));
        div.appendChild(
            buttFactory('Add AuxI', e => {
                simFactory(e.target.offsetParent, 'auxI').render();
            }));
        div.appendChild(
            buttFactory('List Connections', e => {
                const ids = document.querySelectorAll('.box');
                let conns = {};
                ids.forEach(idT => {
                    console.log(idT.id)
                    conns[idT.id] = this.observer
                                     .response(
                                        'requestConns',
                                        idT.id,
                                        {id: idT.id});
                });
                console.log(conns);
            }));
        this.element.appendChild(div);
    }
}

function buttFactory(name, cb) {
    const newButt = document.createElement('button');
    newButt.textContent = name;
    newButt.addEventListener('click', cb);
    return newButt;
}

function simFactory(dest, typeI) {
    return new SimPiece(dest, {type: typeI});
}