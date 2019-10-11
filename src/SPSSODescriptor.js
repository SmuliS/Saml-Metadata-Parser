

module.exports = class SPSSODescriptor {
    constructor(metadata) {
        const base = metadata.EntityDescriptor.SPSSODescriptor;
        if (base) {
            this.signingKey = this.getKey(base["KeyDescriptor"], 'signing');
            this.encryptionKey = this.getKey(base["KeyDescriptor"], 'encryption');
            this.SingleSignOnURL = this.getEntrypoints(base["AssertionConsumerService"]);
            this.SingleLogoutURL = this.getEntrypoints(base["SingleLogoutService"]);
        }
    }


    getKey(keyDescriptor, type) {
        var obj = keyDescriptor.find(item => item.use === type);
        obj = obj['KeyInfo']
        obj = obj['X509Data']
        return obj['X509Certificate']

    }

    getEntrypoints(endpointsObject) {
        const redirectBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect';
        const postBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST';
        const soapBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:SOAP';

        if (!(endpointsObject instanceof Array)) {
            endpointsObject = [endpointsObject];
        }
        
        var obj = endpointsObject.find(item => item.Binding === redirectBinding);
        var redirect = obj ? obj.Location : null;
        var redirectIndex = obj ? obj.index : null;
        obj = endpointsObject.find(item => item.Binding === postBinding);
        var post = obj ? obj.Location : null;
        var postIndex = obj ? obj.index : null;
        obj = endpointsObject.find(item => item.Binding === soapBinding);
        var soap = obj ? obj.Location : null;
        var soapIndex = obj ? obj.index : null;

        var entryPoints = {};
        entryPoints[soapBinding] = { location: soap, index: soapIndex };
        entryPoints[redirectBinding] = { location: redirect, index: redirectIndex };
        entryPoints[postBinding] = { location: post, index: postIndex };

        return entryPoints;
    }
};
