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
        this.renderRect = this.store.state.renderLayerDimm;
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
            const split = conn.connStr.split('-');
            if (split[2] === 1 && split[1].match(/sink.|stock|flow./g)) {
                return split[0];
            }
        }
    }

    requestOutput(reqObjId) {
        return new Promise((res, rej) => {
                console.log(reqObjId);
            let ids = this.conns.filter(ele => ele.connStr);
            if (reqObjId !== this.id && reqObjId) {
                ids = this.requestConns(reqObjId);
            }
            ids
            .then(results => this.waitForInput(Array.isArray(results) ? ids : ids.result))
            .then(waitRes => {
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
                    Promise.all(preReq)
                           .then(allRes => {
                                if (result === []) {
                                    result.concat(allRes);
                                } else if (allRes === result) {
                                    res(result);
                                }
                                //console.log(results);
                                res(output);
                                //console.log(results);
                           });
                } else if (waitRes === true) {
                    const response = this.observer.response(
                        'requestOutput',
                        reqObjId === undefined ? this.id : reqObjId,
                        {srcId: this.id, id: reqObjId === undefined ? this.id : reqObjId});
                    res(response !== null ? response : `Object with ${id} not found`);    
                } else {
                    rej(`error with ${reqObjId === undefined ? this.id : reqObjId}`); 
                    // There was an error so the message will be passed
                    // back down the chain to the original call
                }
            });
        });
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
                        x => x.connStr.match(regEx)), 1);
                request['result'] = this.conns;
                return request;
            }
            request.data.connStr = request.data.connStr.replace(
                'type',
                this.props.type);
            request.data.connStr = request.data.connStr.replace(
                'idx', 
                this.index.next().value);
            this.conns.push(request.data);
            this.store.commit("mutateConnection", {
                type: request.data.connStr[request.data.connStr.length - 1] === "1" ? "output" : "input",
                box: this.id,
                connObj: request.data.connObj
            });
            request['result'] = this.conns;
            // console.log(request);
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
            // May convert to regex replace
            box.style.left = x - box.offsetWidth / 2 + 'px';
            box.style.top = y - box.offsetHeight / 2 + 'px';
        }

        function moveConns(conns, io, x, y) {
            // console.log(conns);
            // console.log(x);
            // console.log(io);
            for (const ele of conns) {
                // console.log(ele);
                // const old = ele.pathString.split(" ").map(ele => Number(ele));
                // let [newX, newY] = [
                //     (ele.x1 - x) < 0 ? -1*(ele.x1 - x) : (ele.x1 - x),
                //      (ele.y1 - y) < 0 ? -1*(ele.y1 - y) : (ele.y1 - y)];
                // console.log(newX, newY);
                if (io === 1) {
                    ele.movePath({
                        x1: x, y1: y
                    });
                    // console.log(ele);
                    // ele.x1 = ele.x1 + newX; ele.y1 = ele.y1 + newY;
                    // ele.cx1 = ele.cx1 + newX; ele.cy1 = ele.cy1 + newY;
                    // ele.cx2 = ele.cx2 + newX;
                    continue;
                }
                ele.movePath({
                    x2: x, y2: y
                });
                // console.log(ele.pathString);
                // ele.x2 = ele.x2 + newX; ele.y2 = ele.y2 + newY;
                // ele.cx2 = ele.cx2 + newX; ele.cy2 = ele.cy2 + newY;
                // ele.cx1 = ele.cx1 + newX;
            }
        }

        const onMove = e => {   
            // console.log(e);
            // let canvas = document.querySelector("canvas");
            let conns = this.store.state.conns[box.id];
            // this.store.state.context2D.clearRect(0, 0, canvas.width, canvas.height);
            moveAt(e.clientX, e.clientY);
            if (conns !== undefined) {
                // console.log(conns)
                for (const ele in conns) {
                    if (conns[ele].length > 0) {
                        // console.log(ele);
                        moveConns(
                            conns[ele],
                            ele === "input" ? 0 : 1,
                            e.clientX, 
                            e.clientY);
                        // this.store.state.context2D.beginPath();
                        // this.store.state.context2D.moveTo(conns[ele].x1,conns[ele].y1);
                        // this.store.state.context2D.bezierCurveTo(
                        //     conns[ele].cx1, 
                        //     conns[ele].cy1,
                        //     conns[ele].cx2,
                        //     conns[ele].cy2,
                        //     conns[ele].x2,
                        //     conns[ele].y2);
                        // this.store.state.context2D.context.stroke();
                    }
                }
            }
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
                    // const drawLine = draw => {
                    //     const srcX = startPointRect.left - startPointRect.width / 2;
                    //     const srcY = startPointRect.top - startPointRect.height / 2;

                    //     const length = Math.sqrt(
                    //         (draw.clientX - srcX < 0 ?
                    //             srcX - draw.clientX : draw.clientX - srcX) ** 2 +
                    //         (draw.clientY - srcY < 0 ?
                    //             srcY - draw.clientY : draw.clientY - srcY) ** 2);
                        
                    //     const angle = Math.atan2(
                    //         (draw.clientY - srcY),
                    //         (draw.clientX - srcX))
                    //         * (180/Math.PI);

                    //     line.style.top = '9px';
                    //     line.style.left = '235px';
                    //     line.style.width = `${length}px`;
                    //     line.style.transform = `rotate(${angle}deg)`;
                    //     line.style.webkitTransform =
                    //                         `rotate(${angle}deg)`;
                    //     line.style.transformOrigin = `top left`;
                    // }

                    const updateInfo = e => {
                        document.removeEventListener('mousemove', updateLine);
                        document.removeEventListener('mouseup', updateInfo);
                        if (e.target.offsetParent !== null) {
                            this.observer.response(
                                'updateConns', 
                                box.id,
                                {srcId: box.id, 
                                    id: e.target.offsetParent.id,
                                data: {
                                    connStr: `${e.target
                                          .offsetParent.id}-type-idx-1`,
                                    connObj: line
                                }});
                            this.observer.response(
                                'updateConns',
                                e.target.offsetParent.id,
                                {srcId: e.target.offsetParent.id,
                                    id: box.id,
                                data: {
                                    connStr: `${box.id}-type-idx-0`,
                                    connObj: line
                                }});
                        } else {
                            // this.store.state.context2D.fillStyle = "white";
                            // this.store.state.context2D.bezierCurveTo(
                            //     old.cx1, old.cy1, old.cx2, old.cy2, old.x2, old.y2);
                            // this.store.state.context2D.stroke();
                            svg.removeChild(line.path);
                        }
                    }

                    const updateLine = e => {
                        e.preventDefault();
                        //drawLine(e);
                        let [x2, y2] = [e.clientX - this.renderRect.left, e.clientY - this.renderRect.top - 20];
                        line.movePath({
                            x1: x, y1: y,
                            cx1: x + 75, cy1: y,
                            cx2: x2 - 75, cy2: y2,
                            x2: x2, y2: y2});
                        // let pathString = `M ${x} ${y} C ${x + 75} ${y} ${x2 - 75} ${y2} ${x2} ${y2}`;
                        // line.setAttribute("d", pathString);
                        // context.bezierCurveTo(
                        //     old.lx1, old.ly1,
                        //     old.lx2, old.ly2,
                        //     old.lx3, old.ly3
                        // );
                        // context.fillStyle="white";
                        // context.stroke();
                        // context.beginPath();
                        // context.moveTo(x,y);
                        // context.bezierCurveTo(
                        //     old.cx1, old.cy1, old.cx2, old.cy2, old.x2, old.y2);
                        // context.strokeStyle = "white";
                        // context.fillStyle = "white";
                        // context.stroke();
                        // context.beginPath();
                        // context.strokeStyle = "black";
                        // context.moveTo(x,y);
                        // context.bezierCurveTo(
                        //     x + 75, 
                        //     y,
                        //     x2 - 75,
                        //     y2,
                        //     x2,
                        //     y2);
                        // context.stroke();
                        // old.cx1 = x + 75; old.cy1 = y; old.cx2 = x2 -75; old.cy2 = y2;
                        // old.x2 = x2; old.y2 = y2;
                            // x + 50, y,
                            // x2 - 50, y2,
                            // x2, y2);
                    }
                    /* 
                        The variable placement should not matter as the 
                        JS compiler will "hoist" variable to the top level
                        of their current context. Although, when using
                        `let` rather than `var` the variable is only hoisted
                        to the top of the scope due to the "hijacking" nature
                        of the `let` declaration. 
                    */ 
                    // let context = this.store.state.context2D;
                    // May change this out later to use one in global state
                    let [x, y] = [e.clientX - this.renderRect.left, e.pageY - this.renderRect.top - 20];
                    // let context = this.store.state.context2D;
                    // let old = {
                    //     x1: x, y1: y, cx1: 0, cy1: 0, cx2: 0, cy2: 0, x2: 0, y2: 0
                    // }
                    let svg = document.querySelector("svg");
                    
                    // console.log(context);
                    console.log(e);

                    
                    console.log("Node clicked");
                    e.preventDefault();
                    console.log(`X: ${x}, Y:${y}`);
                    const line = new BezierPath();
                    svg.appendChild(line.path);
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

function BezierPath(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
    this.x1 = x1; this.y1 = y1;
    this.cx1 = cx1; this.cy1 = cy1;
    this.cx2 = cx2; this.cy2 = cy2;
    this.x2 = x2; this.y2 = y2;

    this.pathString = `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "black");
    this.path.setAttribute("fill","transparent");
    this.path.setAttribute("d", this.pathString);

    return this;
}

BezierPath.prototype.movePath = function (newVals) {
    // console.log(newVals);
    for(const ele of Object.keys(newVals)) {
        // console.log(this[ele], ele);
        if (this.hasOwnProperty(ele) === false) {continue;}
        this[ele] = newVals[ele];
    }

    this.pathString = `M ${this.x1} ${this.y1} C ${this.cx1} ${this.cy1} ${this.cx2} ${this.cy2} ${this.x2} ${this.y2}`;
    this.path.setAttribute("d",this.pathString);
    return this.path;
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