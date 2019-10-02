function getKey(keyDescriptor, type, prefix) {
  var obj = keyDescriptor.find(item => item.use === type);
  obj = obj[prefix + 'KeyInfo']
  obj = obj[prefix + 'X509Data']
  return obj[prefix + 'X509Certificate']

}

function getEntrypoints(SingleSignOnService) {
  const redirectBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect';
  const postBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST';
  const soapBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:SOAP';
  return [
    SingleSignOnService.find(item => item.Binding === redirectBinding).Location,
    SingleSignOnService.find(item => item.Binding === postBinding).Location,
    SingleSignOnService.find(item => item.Binding === soapBinding).Location
  ];
}

module.exports = class ISPSSODescriptor {
  constructor(metadata) {
    if (metadata != undefined && metadata.EntityDescriptor != undefined) {
      this.entityID = metadata.EntityDescriptor.entityID;
      const base = metadata.EntityDescriptor.IDPSSODescriptor;
      var prefix = "";
      for (var key in metadata.EntityDescriptor) {
        console.log("key" + key)
        if (metadata.EntityDescriptor[key] == 'http://www.w3.org/2000/09/xmldsig#') {
          prefix = key;
          break;
        }
      }
      if (prefix != "" && prefix != undefined) {
        prefix = prefix.split(':')[1] + ":";
      }
      this.signingKey = getKey(base.KeyDescriptor, 'signing', prefix);
      this.encryptionKey = getKey(base.KeyDescriptor, 'encryption', prefix);
      this.SingleSignOnURL = getEntrypoints(base.SingleSignOnService);
      this.SingleLogoutURL = getEntrypoints(base.SingleLogoutService);
    }
  }
};
