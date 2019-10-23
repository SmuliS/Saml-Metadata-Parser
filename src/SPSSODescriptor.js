const SSODescriptor = require('./SSODescriptor');

module.exports = class SPSSODescriptor extends SSODescriptor {
    constructor(base) {
        super(base);
        if (this.base) {
            this.AssertionConsumerService = SPSSODescriptor.getEntrypoints(
                this.base.AssertionConsumerService,
            );
        }
    }
};
