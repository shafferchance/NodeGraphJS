import PubSub from '../lib/PubSub.js';

const STATUS = {
    RESTING: 'resting',
    MUTATION: 'mutation',
    ACTION: 'action',
}

export default class Store {
    constructor(params) {
        // In this case this being store is required for the proxy
        // to access the outer scope
        let self = this;
        self.actions = {};
        self.mutations = {};
        self.state = {};
        self.status = STATUS.RESTING;
        self.events = new PubSub();

        if (params.hasOwnProperty('actions')) {
            self.actions = params.actions;
        }

        if (params.hasOwnProperty('mutations')) {
            self.mutations = params.mutations;
        }
        console.log(params.state);
        self.state = new Proxy((params.state || {}), {
            /* opted to not use arrow as assigning this to block
               would lead to unexpected behaviors */
            set: function (state, key, value) {
                state[key] = value;
                console.log(`stateChange of ${key} to ${value}`);
                self.events.publish('stateChange', self.state);
                if (self.status != STATUS.MUTATION) {
                    console.warn(`You should use a mutation to set ${key}`);
                }
                self.status = STATUS.RESTING;
                return true;
            }
        });
    }

    dispatch(actionKey, payload) {
        if (typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist`);
            return false;
        }
        console.groupCollapsed(`ACTION: ${actionKey}`);
        this.status = STATUS.ACTION;
        this.actions[actionKey](this, payload);
        console.groupEnd();
        return true;
    }

    commit(mutationKey, payload) {
        if (typeof this.mutations[mutationKey] !==  'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }
        this.status = STATUS.MUTATION;
        let newState = this.mutations[mutationKey](this.state, payload);
        // Here is where the Memento model must take over and 
        // a custom object must be implemented
        self.state = Object.assign(this.state, newState);
        return true;
    }
}