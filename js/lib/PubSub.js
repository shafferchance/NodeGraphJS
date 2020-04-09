// Built with help from 
// css-tricks.com/build-a-state-management-system-with-vanilla-javascript
export default class PubSub {
    constructor() {
        this.events = {};
    }

    /**
     * Will remove the member from the even object. 
     * 
     * Warning: This will only work if all references have been removed from
     *          the events obj!
     * 
     * @param {String} e - Name of Event
     * @param {String} id - ID of member
     */
    cleanResponse(e, id) {
        return delete(this.events[e][id]);
    }

    /**
     * This will publish any change to all subscribers of an event. The callbacks
     * are stored at subscription time.
     * 
     * @param {String} event - Name of event to create
     * @param {*} data - Data to send in execution of callback stored in subscribers
     */
    publish(event, data = {}) {
        if(!this.events.hasOwnProperty(event)) {
            return [];
        }
        const res = this.events[event].map(cb => cb(data));
        delete(this.events[event])
        return res;
    }

    /**
     * Will take in UNIQUE event name and assign any ids to that event, 
     * however they assigned ids will still need to provide their own cb.
     * 
     * @param {String} e - Name of event
     * @param {String} id - ID of element to add to eve
     * @param {Function} cb - Function to run alongside event
     */
    request(e, id, cb) {
        if(!this.events.hasOwnProperty(e)) {
            this.events[e] = {};
        }
        return this.events[e][id] = cb;
    }

    /**
     * Execs callback function stored by id on event. Allows for talking to 
     * any element that is stored under the same event without a direct ref
     * other than ID.
     * 
     * @param {String} e - Name of event
     * @param {String} id - ID of element that is desired to have cb with data executed
     * @param {*} data - This is the data is will be passed as parameter to members stored cb
     */
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

    /**
     * Will assign to array identified by event, callbacks are stored and
     * will be executed on publish. There is NO intersubscriber communication
     * with this model!
     * 
     * @param {String} event - Name of event to subscribe to
     * @param {Function} cb - Callback to be fired when new data published
     */
    subscribe(event, cb) {
        if(!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        return this.events[event].push(cb);
    }

    /**
     * Will take in an event and UNIQUE ID to find member than replace the
     * current stored callback with the one send in the updateRequest.
     * 
     * @param {String} e - Name of Event to mutate members of
     * @param {String} id - ID of of member to mutate
     * @param {Function} cb - New callback function to assign to member
     */
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