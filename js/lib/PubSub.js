// Built with help from 
// css-tricks.com/build-a-state-management-system-with-vanilla-javascript
export default class PubSub {
    constructor() {
        this.events = {};
    }

    cleanResponse(e, id) {
        return delete(this.events[e][id]);
    }

    publish(event, data = {}) {
        if(!this.events.hasOwnProperty(event)) {
            return [];
        }
        const res = this.events[event].map(cb => cb(data));
        delete(this.events[event])
        return res;
    }

    request(e, id, cb) {
        if(!this.events.hasOwnProperty(e)) {
            this.events[e] = {};
        }
        return this.events[e][id] = cb;
    }

    response(e, id, data) {
        if(!this.events.hasOwnProperty(e)) {
            if (!(this.events[e].hasOwnProperty(id))) {
                return null;
            }
        }
        console.log(`ID: ${id} on ${this.events[e]}`)
        const res = this.events[e][id](data);
        //console.log(res);
        return res;
    }

    subscribe(event, cb) {
        if(!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        return this.events[event].push(cb);
    }

    updateRequest(e, id, cb) {
        if(!this.events.hasOwnProperty(e)) {
            this.events[e] = {};
        }
        // Choose to set reference to null rather than use delete as
        // the delete keyword will only work if there are no remaining
        // references to the data
        this.events[e][id] = null;
        return this.events[e][id] = cb;
    }
}