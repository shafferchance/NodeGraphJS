export default class ECSComp {
    constructor(entity, data) {
        this.data = data;
        if (typeof entity === 'object') {
            this.entity = entity.id;
        } else {
            this.entity = entity;
        }
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}