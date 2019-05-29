function getKey(keyDescriptor, type) {
  return keyDescriptor
    .find(item => item.use === type)
    .KeyInfo
    .X509Data
    .X509Certificate;
}

function parseAttributes(attributes) {
  function transformAttribute(attribute) {
    return Object.assign(
      {},
      {
        key: attribute.Name,
        name: attribute.FriendlyName,
      },
    );
  }
  return attributes.map(transformAttribute);
}

function getEntrypoint(SingleSignOnService) {
  const redirectBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect';
  return SingleSignOnService
    .find(item => item.Binding === redirectBinding)
    .Location;
}

module.exports = class ISPSSODescriptor {
  constructor(metadata) {
    const base = metadata['md:EntityDescriptor'].IDPSSODescriptor;

    Object.defineProperty(
      this,
      'signingKey',
      { value: getKey(base.KeyDescriptor, 'signing') },
    );

    Object.defineProperty(
      this,
      'encryptionKey',
      { value: getKey(base.KeyDescriptor, 'encryption') },
    );

    Object.defineProperty(
      this,
      'attributes',
      { value: parseAttributes(base.Attribute) },
    );

    Object.defineProperty(
      this,
      'SingleSignOnURL',
      { value: getEntrypoint(base.SingleSignOnService) },
    );

    Object.defineProperty(
      this,
      'SingleLogoutURL',
      { value: getEntrypoint(base.SingleLogoutService) },
    );
  }
};
