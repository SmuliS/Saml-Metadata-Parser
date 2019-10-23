const SSODescriptor = require('./SSODescriptor');

module.exports = class IDPSSODescriptor extends SSODescriptor {
    constructor(base) {
        super(base);
        if (this.base) {
            this.SingleSignOnService = SSODescriptor.getEntrypoints(
                this.base.SingleSignOnService,
            );
            this.SingleSignOnURL =
                this.SingleSignOnService.find(
                    item =>
                        item.binding ===
                        IDPSSODescriptor.redirectBinding,
                ).location ||
                this.SingleSignOnService.find(
                    item =>
                        item.binding === IDPSSODescriptor.postBinding,
                ).location ||
                this.SingleSignOnService.find(
                    item =>
                        item.binding === IDPSSODescriptor.soapBinding,
                ).location;
        }
    }
};
