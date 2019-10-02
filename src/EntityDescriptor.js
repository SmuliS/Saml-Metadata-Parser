module.exports = class EntityDescriptor {
  constructor(metadata) {
    if (metadata != undefined && metadata.EntityDescriptor != undefined) {
      this.entityID = metadata.EntityDescriptor.entityID;
      this.documentID = metadata.EntityDescriptor.documentID;
    }
  }
};
