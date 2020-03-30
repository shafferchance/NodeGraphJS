//import EventManager from './EventManager.js';
const EventManager = require('./EventManager-tst');

class testClass {
    constructor(props = {}) {
        this.id = '_' + Math.random().toString(12).substring(2,9);
        this.data = props.hasOwnProperty('data') ? props['data'] : 0;
        // Use of ternary to make this both inlined and more readable
        this.funct = props.hasOwnProperty('funct') ? props['funct'] : null;
        this.observer = props.hasOwnProperty('eventMngr') ? 
            props['eventMngr'].events : null;
        this.observer.request('requestOutput', this.id, request => {
            if(request.id !== this.id) { return; }
            request['result'] = this.output();
            return request;
        })
    }

    output() {
        if(this.funct !== null) {
            return this.funct(this.data);  
        }
        return this.data;
    }

    requestOutput(objId) {
        const response = this.observer.response(
                            'requestOutput',
                            objId,
                            {srcId: this.id, id: objId});
        this.data = response.result;
        return response;
        /*return new Promise((res, rej) => {
            this.observer.subscribe('sendResult', data => {

            })
        });*/
    }
}

const objs = [];
const eventMngr = new EventManager();
for (let i=0;i<=5;i++) {
    let num = Math.floor(Math.random() * Math.floor(100));
    objs.push(new testClass(
                    {
                        data: num,
                        eventMngr: eventMngr,
                    }));
}
for(let i=0;i<=3;i++) {
    console.log(
        `Object: ${i} data was: ${objs[i].data} and using Object ${i+1}`)
    objs[i].requestOutput(objs[i+1].id);
    console.log(`Object: ${i} data is now: ${objs[i].data}`);
}

objs.push(new testClass(
            {
                data: 200,
                eventMngr: eventMngr,
                funct: x => {return Math.pow(x, 2);}
            }));
console.log(`Object: ${objs.length-1} data before ${objs[objs.length-1].data} and using Object 0`);
objs[objs.length-1].requestOutput(objs[0].id);
console.log(`Object: ${objs.length-1} data after ${objs[objs.length-1].data}`);

console.log(`Object: 1 data before ${objs[1].data} and using object ${objs.length-1}`);
objs[1].requestOutput(objs[objs.length-1].id);
console.log(`Object: 1 data after ${objs[1].data}`);