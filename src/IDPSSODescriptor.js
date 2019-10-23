const SSODescriptor = require('./SSODescriptor');

module.exports = class IDPSSODescriptor extends SSODescriptor {
    constructor(base) {
        super(base);
        if (this.base) {
            this.SingleSignOnService = SSODescriptor.getEntrypoints(
                this.base.SingleSignOnService,
            );
            this.SingleSignOnURL = this.SingleLogoutService.find(
                item => item.index === 0,
            ).location;
        }
    }
};
