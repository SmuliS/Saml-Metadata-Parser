class SSODescriptor {
    /**
     * Create an IDP/SP SSODescriptor with easy accessor functions to its properties
     * @param {string} base - A JSON rappresenting the IPD/SP SSODescriptor
     */
    constructor(base) {
        this.base = base;
        if (this.base) {
            this.signingKey = SSODescriptor.getKey(
                this.base.KeyDescriptor,
                'signing',
            );
            this.encryptionKey = SSODescriptor.getKey(
                this.base.KeyDescriptor,
                'encryption',
            );
            if (this.base.SingleLogoutService) {
                this.SingleLogoutService = SSODescriptor.getEntrypoints(
                    this.base.SingleLogoutService,
                );
                this.SingleLogoutURL = this.SingleLogoutService.find(
                    item => item.index === 0,
                ).location;
            }
        }
    }

    static getKey(keyDescriptor, type) {
        if (keyDescriptor === undefined || keyDescriptor === null) {
            return null;
        }

        let keyDescriptorArray;
        if (!(keyDescriptor instanceof Array)) {
            keyDescriptorArray = [keyDescriptor];
        } else {
            keyDescriptorArray = keyDescriptor;
        }

        let obj =
            keyDescriptorArray.find(item => item.use === type) ||
            keyDescriptorArray[0];

        obj = obj.KeyInfo;
        obj = obj.X509Data;
        return obj.X509Certificate;
    }

    // getDefaultSingleLogoutURL() {
    //     for (let i = 0; i < Objectthis.SingleLogoutURL; i++)
    //         return null;
    // }

    static getEntrypoints(endpointsObject) {
        if (
            endpointsObject === undefined ||
            endpointsObject === null
        ) {
            return null;
        }

        const redirectBinding =
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect';
        const postBinding =
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST';
        const soapBinding =
            'urn:oasis:names:tc:SAML:2.0:bindings:SOAP';

        let newEndpointObject;

        if (!(endpointsObject instanceof Array)) {
            newEndpointObject = [endpointsObject];
        } else {
            newEndpointObject = endpointsObject;
        }

        let obj = newEndpointObject.find(
            item => item.Binding === redirectBinding,
        );
        const redirect = obj ? obj.Location : undefined;
        let redirectIndex;
        if (obj) {
            redirectIndex = obj.index ? obj.index : 0;
        }

        obj = newEndpointObject.find(
            item => item.Binding === postBinding,
        );
        const post = obj ? obj.Location : undefined;
        let postIndex;
        if (obj) {
            postIndex = obj.index ? obj.index : redirectIndex + 1;
        }

        obj = newEndpointObject.find(
            item => item.Binding === soapBinding,
        );
        const soap = obj ? obj.Location : undefined;
        let soapIndex;
        if (obj) {
            soapIndex = obj.index ? obj.index : postIndex + 1;
        }

        let i = -1;

        const entryPoints = [];

        entryPoints.push({
            binding: redirectBinding,
            location: redirect,
            index: redirectIndex || (i += 1),
        });
        entryPoints.push({
            binding: postBinding,
            location: post,
            index: postIndex || (i += 1),
        });
        entryPoints.push({
            binding: soapBinding,
            location: soap,
            index: soapIndex || (i += 1),
        });

        return entryPoints;
    }
}

module.exports = SSODescriptor;
