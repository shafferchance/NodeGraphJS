import store from './store.js';

let state = {
    items: [
        'hey we did it...',
    ]
}

let actions = {
    addItem(context, payload) {
        context.commit('addItem', payload);
    },
    clearItem(context, payload) {
        context.commit('clearItem', payload);
    },
    renderItem(_, payload) {
        payload.render();
    }
};

let mutations = {
    addItem(state, payload) {
        state.items.push(payload);
        return state;
    },
    clearItem(state, payload) {
        state.items.splice(payload.index, 1);
        return state;
    }
};

export default new store({state, actions, mutations});