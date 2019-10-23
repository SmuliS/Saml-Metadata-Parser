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
                this.SingleLogoutURL =
                    this.SingleLogoutService.find(
                        item =>
                            item.binding ===
                            SSODescriptor.redirectBinding,
                    ).location ||
                    this.SingleLogoutService.find(
                        item =>
                            item.binding ===
                            SSODescriptor.postBinding,
                    ).location ||
                    this.SingleLogoutService.find(
                        item =>
                            item.binding ===
                            SSODescriptor.soapBinding,
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

        const entryPoints = [];

        let newEndpointObject;

        if (!(endpointsObject instanceof Array)) {
            newEndpointObject = [endpointsObject];
        } else {
            newEndpointObject = endpointsObject;
        }

        let obj = newEndpointObject.find(
            item => item.Binding === SSODescriptor.redirectBinding,
        );

        entryPoints.push({
            binding: SSODescriptor.redirectBinding,
            location: obj ? obj.Location : undefined,
            index: obj ? obj.index : undefined,
            responseLocation: obj ? obj.ResponseLocation : undefined,
            default: obj ? obj.default : false,
        });

        obj = newEndpointObject.find(
            item => item.Binding === SSODescriptor.postBinding,
        );

        entryPoints.push({
            binding: SSODescriptor.postBinding,
            location: obj ? obj.Location : undefined,
            index: obj ? obj.index : undefined,
            responseLocation: obj ? obj.ResponseLocation : undefined,
            default: obj ? obj.default : false,
        });

        obj = newEndpointObject.find(
            item => item.Binding === SSODescriptor.soapBinding,
        );

        entryPoints.push({
            binding: SSODescriptor.soapBinding,
            location: obj ? obj.Location : undefined,
            index: obj ? obj.index : undefined,
            responseLocation: obj ? obj.ResponseLocation : undefined,
            default: obj ? obj.default : false,
        });

        return entryPoints;
    }
}

SSODescriptor.redirectBinding =
    'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect';
SSODescriptor.postBinding =
    'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST';
SSODescriptor.soapBinding =
    'urn:oasis:names:tc:SAML:2.0:bindings:SOAP';

module.exports = SSODescriptor;
