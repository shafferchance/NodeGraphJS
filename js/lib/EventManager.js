import PubSub from '../lib/PubSub.js';

const STATUS = {
    RESTING: 0,
    MUTATION: 1,
    ACTION: 2,
}
/**
 *   This class is responsible for the PubSub and Global State of the 
 * entire application. This is accomplished by using several PubSub
 * methods and some state management checks via Proxy and a Status 
 * "enum" to ensure mutation and action of state will not conflict.
 *    While this may appear to not need parameter the following can be
 * overrided or ommited:
 * @param {Object} actions Object of functions for what to call to act on state
 * @param {Boolean} debug Will increase console output if desired
 * @param {Object} mutations Object of functions for mutating state 
 * @param {Object} state The initial state of the application may be set
 * 
 *    The events and status are to not be touched by the develop and 
 * will be mutated when deemed necessary by the system. As the Events
 * class variable is the connection to the PubSub system.
 *    If a person were to look at the source they would see that all the 
 * above have been initialized and the instance is exported. This allows
 * the program to import this file and bring the instance preventing the
 * need for storing the instataniation manually, it will still take memory.
 */
class EventManager {
    constructor (params = {}) {
        this.actions = params['actions'] !== undefined ? 
                            params['actions'] : {};
        this.debug = params['debug'] !== undefined ? params['debug'] : false;
        this.events = new PubSub();
        this.mutations = params['mutations'] !== undefined ? 
                            params['mutations'] : {};
        this.state = {};
        this.status = STATUS.RESTING;
        this.state = new Proxy((params.state || {}), {
            set: (state, key, value) => {
                state[key] = value; // Verifying valid params passed
                console.log(this);
                this.events.publish('stateChange', this.state)
                if (this.status !== STATUS.MUTATION) {
                    console.warn(`You should use a mutation to set ${key}`);
                }
                self.status = STATUS.RESTING;
                return true;
            }
        });
    }
    
    dispatch (actionKey, payload) {
        if (typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey}" doesn't exist`);
            return false;
        }
        console.groupCollapsed(`ACTION: ${actionKey}`);
        this.status = STATUS.ACTION;
        this.actions[actionKey](this, payload);
        console.groupEnd(`ACTION: ${actionKey}`);
        return true;
    }

    commit(mutationKey, payload) {
        if (typeof this.mutations[mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }
        this.status = STATUS.MUTATION;
        const newState = this.mutations[mutationKey](this.state, payload);
        // delta crdt system will go here when implemented
        this.state = Object.assign(this.state, newState);
        return true;
    }
}

export default new EventManager({
    debug: true,
    state: {
        context2D: {},
        startPoint: '',
        currentLoc: '',
        simRunning: false,
        renderLayerDimm: {},
        result: 0,
    },
    actions: {
        changeRenderLayerDimm(context, payload) {
            context.commit('changeRenderLayerDimm', payload);
        },
        change2DContext(context, payload) {
            context.commit('change2DContext', payload);
        },
        changeCurrentLoc(context, payload) {
            context.commit('changeCurrentLoc', payload);
        },
        changeResult(context, payload) {
            context.commit('changeResult', payload);
        },
        changeSimStatus(context, payload) {
            context.commit('changeSimStatus', payload);
        },
        changeStartPoint(context, payload) {
            context.commit('changeStart', payload);
        },
    },
    mutations: {
        changeRenderLayerDimm(state, payload) {
            state.renderLayerDimm = payload;
            return state;
        },
        change2DContext(state, payload) {
            state.context2D = payload;
            return state;
        },
        changeResult(state, payload) {
            state.result = payload;
            return state;
        },     
        changeSimStatus(state, payload) {
            state.simRunning = payload;
            return state;
        },
        changeStart(state, payload) {
            state.startPoint = payload;
            return state;
        },
    }
})