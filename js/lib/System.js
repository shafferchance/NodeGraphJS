export default class System {
    constructor(world = '', entityMgr = '') {
        this.world = world;
        this.entityMngr = entityMgr;
    }

    setEntityMngr(entityMgnr) {
        this.entityMngr = entityMgnr;
    }

    setWorld(world) {
        this.world = world;
    }
}