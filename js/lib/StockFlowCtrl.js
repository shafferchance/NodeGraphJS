import EventManager from './EventManager.js';

const status = {
    idle: 'idle',
    waiting: 'waiting',
    finished: 'finsished',
}

export default class StockFlowCtrl {
    constructor(children) {
        this.observer = EventManager.events;
        this.sinkI = children["sinkI"];
        this.flowI = children["flowI"];
        this.stock = children["stock"];
        this.flowO = children["flowO"];
        this.observer.subscribe('requestOutput', request => {
            if (request.id !== this.id) { return; }
            //switch()
            //request['result'] = 
        });
    }

    async run() {
        await this.typeCheck();

    }

    requestOutput(id) {
        return new Promise((res, rej) => {
            // Have to find better way to do see, maybe center it around
            // engine?
            this.engine.events.publish('outputReq', id);
        });
    }

    typeCheck() {
        return new Promise((res, rej) => {
            /* 
                Well in JS this is wierd but essentially this gives access
                to variables within the current scope bind is not needed
                due to being in class with arrow function assigning context
                of this for us :)
            */
            for(const i in this) {
                if(i.match(/sink[I,O]|stock/g) !== null && 
                        Array.isArray(i) === true) {
                    rej(`Invalid param passed for ${i}!`);
                } else if(Array.isArray(i) === false && i !== 'engine') {
                    rej(`Invalid param passed for ${i}`); 
                }
                continue;
            }
            res("All initial value types are valid");
        });
    }

    waitForInput(element) {
        return new Promise((res, rej) => {
            if (element.type === 'sink') {
                res(`Sink has no input!`);
            }
            let conns = {};
            // May break asynchronity :/
            for (const i in element.conns) {
                const split = i.split('-');
                if (split[1] === 0) {
                    conns[split[0]] = false;
                }
            }

        });
    }
}