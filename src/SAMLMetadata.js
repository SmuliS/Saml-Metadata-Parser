const EntityDescriptor = require('./EntityDescriptor');
const IDPSSODescriptor = require('./IDPSSODescriptor');
const SPSSODescriptor = require('./SPSSODescriptor');
const { inplaceRemovePrefixFromObject } = require('./Utils');

module.exports = class SAMLMetadata {
    constructor(metadata) {
        inplaceRemovePrefixFromObject(metadata);
        const entDesc = metadata.EntityDescriptor;
        if (entDesc) {
            this.entity = new EntityDescriptor(entDesc);
            this.IDPConfig = entDesc.IDPSSODescriptor
                ? new IDPSSODescriptor(entDesc.IDPSSODescriptor)
                : undefined;

            this.SPConfig = entDesc.SPSSODescriptor
                ? new SPSSODescriptor(entDesc.SPSSODescriptor)
                : undefined;
        } else {
            throw new Error('Invalid Metadata!');
        }
    }

    addSPConfiguration(configuration) {
        this.serviceProviderConfig = configuration;
        return this;
    }

    get asPassportConfig() {
        const ssoUrl = this.IDPConfig.SingleSignOnURL;

        if (!this.serviceProviderConfig) {
            throw Error('Missing service provider configuration');
        }

        return {
            callbackUrl:
                this.serviceProviderConfig.callbackUrl || null,
            entryPoint: ssoUrl,
            issuer: this.serviceProviderConfig.issuer || null,
            cert: this.IDPConfig.signingKey,
            privateCert:
                this.serviceProviderConfig.privateCert || null,
            decryptionPvk: this.IDPConfig.encryptionKey,
            signatureAlgorithm: 'sha1',
        };
    }
};
