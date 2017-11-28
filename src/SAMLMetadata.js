const EntityDescriptor = require('./EntityDescriptor');
const IDPSSODescriptor = require('./IDPSSODescriptor');

module.exports = class SAMLMetadata {
  constructor(metadata) {
    this.entity = new EntityDescriptor(metadata);
    this.IDPConfig = new IDPSSODescriptor(metadata);
  }

  addSPConfiguration(configuration) {
    this.serviceProviderConfig = configuration;
    return this;
  }

  get asPassportConfig() {
    if (!this.serviceProviderConfig) {
      throw Error('Missing service provider configuration');
    }
    return {
      callbackUrl: this.serviceProviderConfig.callbackUrl || null,
      entryPoint: this.IDPConfig.SingleSignOnURL,
      issuer: this.serviceProviderConfig.issuer || null,
      cert: this.IDPConfig.signingKey,
      privateCert: this.serviceProviderConfig.privateCert || null,
      decryptionPvk: this.IDPConfig.encryptionKey,
      signatureAlgorithm: 'sha1',
    };
  }
};
