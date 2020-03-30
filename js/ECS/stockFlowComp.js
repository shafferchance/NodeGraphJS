import ECSComp from '../lib/ECSComp.js';

/*
    While all of these are extremely bare bone they represent a different instance
    of the class with different types, while checks could be put in place there is
    some overhead in enforcing the checks.

    Components are only supposed to be data buckets with ids, that is it. Any 
    mutation and action on data must be done via a system!
*/

class connComp extends ECSComp{
    constructor(entity, data = []) {
        super(entity, data);
    }
}

class flag extends ECSComp {
    constructor(entity, data = {}) {
        super(entity, data);
    }
}

class flowIn extends ECSComp {
    constructor(entity, data = {}) {
        super(entity, data);
    }
}

class flowOut extends ECSComp {
    constructor(entity, data = {}) {
        super(entity, data);
    }
}

class functComp extends ECSComp {
    // When using `{comp}.data` will still have to be due to superclass!
    constructor(entity, funct = {}) {
        super(entity, funct);
    }
} 

class sinkIn extends ECSComp {
    constructor(entity) {
        super(entity, {active: true});
    }
}

class sinkOut extends ECSComp {
    constructor(entity) {
        super(entity, {active: false});
    }
}

class stockComp extends ECSComp {
    constructor(entity, data = 0) {
        super(entity, data);
    }
}

const compFactory = {
    conn: (entity, conns) => {
        return new connComp(entity, conns);
    },
    flag: (entity, flags) => {
        return new flag(entity, flags);
    },
    flowI: (entity, data = {}) => {
        return new flowIn(entity, data);
    },
    flowO: (entity, data = {}) => {
        return new flowOut(entity, data);
    },
    funct: (entity, data = {}) => {
        return new functComp(entity, data);
    },
    sinkI: entity => {
        return new sinkIn(entity);
    },
    sinkO: entity => {
        return new sinkOut(entity);
    },
    stock: (entity, init = 0) => {
        return new stockComp(entity, init);
    }
}

export {
    compFactory,
    connComp,
    flag,
    flowIn,
    flowOut,
    functComp,
    sinkIn,
    sinkOut,
    stockComp
};