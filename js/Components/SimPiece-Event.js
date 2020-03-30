import ComponentE from '../lib/Component-Event.js';

export default class SimPiece extends ComponentE {
    constructor(dest, props = {}) {   
        super({
            element: dest
        });
        this.id = this.idGen();
        this.conns = props['conns'] !== undefined ? props['conns'] : [];
        this.props = props;
        this.props["limit"] = 0;
        this.subscribe();
    }

    init() {
        this.observer.response(
            'updateConns',
            this.id,
            {id: this.id});
    }

    nextElement() {
        for (const conn in this.conns) {
            const split = conn.split('-');
            if (split[2] === 1 && split[1].match(/sink.|stock|flow./g)) {
                return split[0];
            }
        }
    }

    async requestOutput(reqObjId) {
        console.log(reqObjId);
        let ids = this.conns;
        if (reqObjId !== this.id && reqObjId) {
            ids = await this.requestConns(reqObjId);
        }
        console.log(ids);
        const waitRes = await this.waitForInput(Array.isArray(ids) ? ids : ids.result);
        console.log(waitRes);
        if (Array.isArray(waitRes)) {
            let preReq = [];
            let result = [];
            for (const entry of waitRes) {
                if (this.props.limit <= 10) {
                    //preReq.push(this.requestOutput(entry.id));
                    console.log(entry);
                    preReq.push(this.requestOutput(entry));
                }
            }
            this.props.limit++;
            // Where the recursive magic happens!
            const output = await Promise.all(preReq);
            console.log(output);
            if (result === []) {
                result.concat(output);
            } else if (output === result) {
                return result;
            }
            //console.log(results);
            return output;
            //console.log(results);
        } else if (waitRes === true) {
            const response = this.observer.response(
                'requestOutput',
                reqObjId === undefined ? this.id : reqObjId,
                {srcId: this.id, id: reqObjId === undefined ? this.id : reqObjId});
            return response !== null ? response : `Object with ${id} not found`;    
        } else {
            return `error with ${reqObjId === undefined ? this.id : reqObjId}`; 
            // There was an error so the message will be passed
            // back down the chain to the original call
        }
    }

    requestConns(reqObjId) {
        return new Promise((res, rej) => {
            const response = this.observer.response(
                                'requestConns',
                                reqObjId,
                                {srcId: this.id, id: reqObjId});
            response !== null ? res(response) : rej(`Object with ${id} not found`);
        });
    }

    /**
     * This method is the initial registeration onf the methods at
     * instaniation of each componet. Allowing each comp to have unique
     * methods and communication with direct relationship, while 
     * maintaining encapsulation and keeping memory use down.
     */
    subscribe() {
        this.observer.request('requestOutput', this.id, request => {
            if (request.id !== this.id) { return; }
            request['result'] = this.props.funct ?
                                this.props.funct() : 
                                    this.props.val ?
                                    this.props.val : false;
            return request;
        });
        this.observer.request('requestConns', this.id, request => {
            if (request.id !== this.id) { return; }
            request['result'] = this.conns;
            return request;
        });
        this.observer.request('updateConns', this.id, request => {
            if (request.hasOwnProperty('delete')) {
                const regEx = new RegExp(
                    `${request.id}-\w+-${request.delete}-.`);
                this.conns.splice(
                    this.conns.findIndex(
                        x => x.match(regEx)), 1);
                request['result'] = this.conns;
                return request;
            }
            request.data = request.data.replace(
                'type',
                this.props.type);
            request.data = request.data.replace(
                'idx', 
                this.index.next().value);
            this.conns.push(request.data);
            request['result'] = this.conns;
            return request;
        });
    }

    // Technicall not async anymore, I'm keeping it async since async/await
    // and the JS engine would wrap the call in a Promise.resolve
    waitForInput(conns) {        
        let promises = [];
        /*function* inputs(iterable) {
            let idx = 0;
            while (idx <= iterable.length) {
                yield [iterable.id, iterable.result];
                idx++;
            }
        }*/
        // 1 - Input and 0 - Output
        for (const i of conns) {
            const split = i.split('-');
            //console.log(split);
            if (split[2] === "1") {
                promises.push(split[0]);
            }
        }

        if (promises.length === 0) {
            return true;
        }
        return promises;
    }

    render() {
        // Creating elements
        const box = document.createElement("div");
        const attribs = document.createElement("div");
        const add = document.createElement("div");

        // Element properties
        box.id = this.id;
        box.classList.add("box");
        box.classList.add(this.props.type === undefined ? 'aux' : this.props.type);
        attribs.className = "attribs";
        add.className = "add";
        add.innerHTML = "&#8853";

        // Assigning
        box.appendChild(attribs);
        box.appendChild(add);

        function moveAt(x, y) {
            box.style.left = x - box.offsetWidth / 2 + 'px';
            box.style.top = y - box.offsetHeight / 2 + 'px';
        }

        function onMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        box.addEventListener('mousedown', e => {
            switch(e.target.classList[0]) {
                case 'add':
                    e.preventDefault();
                    box.children[0].appendChild(
                        getAttribEle(box.children[0]));
                    break;
                case 'box':
                    e.preventDefault();
                    document.addEventListener('mousemove', onMove);
                    box.style.position = 'absolute';
                    box.style.zIndex = 100;
                    box.onmouseup = () => {
                        document.removeEventListener('mousemove', onMove);
                    }
                    break;
                case 'nodeO':
                    const drawLine = draw => {
                        const srcX = startPointRect.left - startPointRect.width / 2;
                        const srcY = startPointRect.top - startPointRect.height / 2;

                        const length = Math.sqrt(
                            (draw.clientX - srcX < 0 ?
                                srcX - draw.clientX : draw.clientX - srcX) ** 2 +
                            (draw.clientY - srcY < 0 ?
                                srcY - draw.clientY : draw.clientY - srcY) ** 2);
                        
                        const angle = Math.atan2(
                            (draw.clientY - srcY),
                            (draw.clientX - srcX))
                            * (180/Math.PI);

                        line.style.top = '9px';
                        line.style.left = '235px';
                        line.style.width = `${length}px`;
                        line.style.transform = `rotate(${angle}deg)`;
                        line.style.webkitTransform =
                                            `rotate(${angle}deg)`;
                        line.style.transformOrigin = `top left`;
                    }

                    const updateInfo = e => {
                        document.removeEventListener('mousemove', updateLine);
                        document.removeEventListener('mouseup', updateInfo);
                        if (e.target.offsetParent !== null) {
                            this.observer.response(
                                'updateConns', 
                                box.id,
                                {srcId: box.id, 
                                    id: e.target.offsetParent.id,
                                data: `${e.target
                                          .offsetParent.id}-type-idx-1`});
                            this.observer.response(
                                'updateConns',
                                e.target.offsetParent.id,
                                {srcId: e.target.offsetParent.id,
                                    id: box.id,
                                data: `${box.id}-type-idx-0`});
                        } else {
                            startPoint.removeChild(line);
                        }
                    }

                    const updateLine = e => {
                        e.preventDefault();
                        drawLine(e);
                    }
                    /* 
                        The variable placement should not matter as the 
                        JS compiler will "hoist" variable to the top level
                        of their current context. Although, when using
                        `let` rather than `var` the variable is only hoisted
                        to the top of the scope due to the "hijacking" nature
                        of the `let` declaration. 
                    */ 
                    console.log("Node clicked");
                    e.preventDefault();
                    const startPoint = e.target;
                    const startPointRect = startPoint.getBoundingClientRect();
                    const line = document.createElement('div');
                    line.className = 'line';
                    line.style.position = 'absolute';
                    e.target.appendChild(line);
                    document.addEventListener('mousemove', updateLine);
                    document.addEventListener('mouseup', updateInfo);
                    break;
                default:
                    // Here until populated will probably be error handling...
                    break;
            }
        });

        box.addEventListener('dblclick', e => {
            e.preventDefault();
            console.log("Attempting cancel...");
            box.removeEventListener('mousemove', onMove);
        });
        this.element.appendChild(box);
    }
    
}

function getAttribEle(parent='') {
    const ele = document.createElement("div");
    const nodeI = document.createElement('div');
    const nodeO = document.createElement('div');
    const span = document.createElement('span');
    const label = document.createElement('input');
    const input = document.createElement('input');

    // input settings
    input.type = "text";
    input.placeholder = "Please enter a value!";
    label.type = "text";
    label.placeholder = "Alias";
    label.className = "label";

    // span settings
    span.textContent = "|";

    // node div settings
    nodeI.className = "nodeI";
    nodeI.innerHTML = "&#10061;";
    nodeO.className = "nodeO";
    nodeO.innerHTML = "&#10061;";

    // Main div settings
    if (parent !== '') {
        ele.classList.add(parent.children.length);
    }
    ele.classList.add('input');

    ele.appendChild(nodeI);
    ele.appendChild(label);
    ele.appendChild(span);
    ele.appendChild(input);
    ele.appendChild(nodeO);
    return ele;
}