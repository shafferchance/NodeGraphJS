import PubSub from './PubSub';
import Archetype from './Archetype.js';

export default class EntityMngr {
    constructor(world, prevTypes = {}) {
        // Eventually will stored Array of Struct that are entities with 
        // same components
        if (prevTypes !== {}) {
            this.archeFact = new Archetype(prevTypes);
        } else {
            this.archeFact = new Archetype();
        }
        this.entityArche = {};
        this.world = world;
        this.maxEntities = 100000;
        this.version = BigInt(0);
    }

    // Blantantly avoiding use of async/await due to how new the feature is browser side
    createOrAddEntity(entity, archetype='') {
        return new Promise((res, rej) => {
            if (this.archeFact.checkArchetype(entity, archetype)
                            .then(e => {return e})
                            .catch(_ => {return false})) {
                this.entityArche[archetype].push(entity);
                res('Successfully added');
            } 
            this.archeFact.createArchetype(entity.components).then(e => {
                this.entityArche[e] = [entity];
                res('Successfully created archetype and added');
            });
            rej('Something went wrong with creating/adding the entity!');
        });
    }

    deleteEntity(entity) {
        return new Promise((res, rej) => {
            this.getEntityArche(entity.id, entity.archetype)
                .then(idx => {
                    this.entityArche[entity.archetype].splice(idx, 1);
                    res(`Successfully delete entity ${entity.id}`)
                }).catch(_ => {
                    rej(`Entity ${entity.id} does not exist!`);
                });
        });
    }

    filterEntities(type, criteria) {
        return new Promise((res, rej) => {
            let marked = [];
            switch(type) {
                case 'components':
                    
                    break;
                case 'dirty':
                    
                    break;
                default:
                    break;
            }
        });
    }

    getEntity(id) {
        return new Promise((res, rej) => {
            let archeSearchPromise = [];
            for (let arche of this.entityArche) {
                archeSearchPromise.push(this.getEntityArche(id, arche));
            }
            Promise.all(archeSearchPromise.map(p => p.catch(() => undefined)))
                   .then(allRes => {
                // May eventually add some validation that there are no repeats!
                const idx = allRes.findIndex(val => val > -1);
                if (idx === -1) {
                    rej("Entity does not exist!");
                }
                res(idx);
            });
        });
    }

    getEntityArche(id, archetype) {
        return new Promise((res, rej) => {
            const idx = this.entityArche[archetype]
                            .findIndex(e => {return e.id === id});
            if (idx === -1) {
                rej(`Entity ${id} was not found in the archetype`);
            }
            res(idx);
        });
    }
}