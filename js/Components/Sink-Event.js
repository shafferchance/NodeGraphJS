import ComponentE from '../lib/Component-Event.js';

export default class Sink extends ComponentE {
    constructor(dest, input) {
        super({element: dest});
        this.conns = []; // Use the following form for event based, rather
                         // then ECS way: id-type-flow
        this.input = input; // 0 signifies Input and 1 signifies Output
        this.output = () => { return false; }
        this.subscribe();       
    }
}