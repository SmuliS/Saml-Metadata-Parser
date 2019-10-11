module.exports = class EntityDescriptor {
    constructor(metadata) {
        this.entityID = metadata["EntityDescriptor"] ? metadata["EntityDescriptor"].entityID : undefined;
        this.documentID = metadata["EntityDescriptor"] ? metadata["EntityDescriptor"].documentID : undefined;
    }
};
