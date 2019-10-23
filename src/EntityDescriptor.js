module.exports = class EntityDescriptor {
    constructor(base) {
        this.entityID = base ? base.entityID : undefined;
        this.documentID = base ? base.ID : undefined;
    }
};
