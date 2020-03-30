export default class ArchetypeFactory {
    constructor(types) {
        this.archetypes = {};
        if (types !== undefined) {
            this.archetypes = types;
        }
    }

    addArchetype(archetype, comps) {
        return new Promise((res, rej) => {
            if (archetype in this.archetypes) {
                rej("Already exist!");
            }
            this.archetypes[archetype] = comps;
            res(true);
        });
    }

    checkArchetype(entity, archetype = '') {
        /*
            Using promise here due to the synchronous nature of iteration.
            While this seem dumb, this will allow a bunch of queries to be
            put into a promise all and be executed with concurrency!
        */
        return new Promise((res, rej) => {
            if (archetype !== '') {
                if (this.archetypes[archetype].every(e => e in entity.components)) {
                    res(true);
                }
                rej('Does not exist');
            } else {
                for (let entry in this.archetypes) {
                    if (this.archetypes[entry].every(e => e in entity.components)) {
                        res(true);
                    }
                    rej('Does not exist');
                }
            }
        });
    }

    createArchetype(components) {
        return new Promise((res, rej) => {
            // This checks if archetype exist
            this.getArchetype(components)
                .then(e => rej(e))
                .catch(_ => {
                    const id = this.idGene();
                    this.addArchetype(id, components)
                        .then(res(id))
                        .catch(e => console.error(e));
                });
        });
    }

    exportArchetypes() {
        return JSON.stringify(this.archetypes);
    }

    idGene() {
        return '_' + Math.random().toString(12).substring(2,9);
    }

    getArchetype(components) {
        return new Promise((res, rej) => {
            for (let entry in this.archetypes) {
                if(this.archetypes[entry] === components) {
                    res(entry);
                }
            }
            rej('Does not exist');
        });
    }
}