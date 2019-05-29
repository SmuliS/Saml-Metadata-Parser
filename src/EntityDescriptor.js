module.exports = class EntityDescriptor {
  constructor(metadata) {
    const base = metadata['md:EntityDescriptor'];
    Object.defineProperty(this, 'entityID', { value: base.entityID });
    Object.defineProperty(this, 'documentID', { value: base.ID });
  }
};
