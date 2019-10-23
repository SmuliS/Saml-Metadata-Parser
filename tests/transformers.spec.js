const { expect } = require('chai');

const { describe, beforeEach, it } = require('mocha');

const parser = require('../src/parser');

const SAMPLE_METADATA_PATH = `${__dirname}/sample-data/sample.xml`;

describe('asPassportConfig', () => {
    describe('when service provider configuration NOT provided', () => {
        beforeEach(() => {
            this.metadata = parser.fromFile(SAMPLE_METADATA_PATH);
        });

        it('should throw error', () => {
            expect(() => this.metadata.asPassportConfig).to.throw(
                'Missing service provider configuration',
            );
        });
    });

    describe('when service provider configuration provided', () => {
        beforeEach(() => {
            const SPConfiguration = {
                callbackUrl: 'this-is-a-mock-callback-url',
                issuer: 'https://example.com/slug/metadata.xml',
            };
            this.metadata = parser
                .fromFile(SAMPLE_METADATA_PATH)
                .addSPConfiguration(SPConfiguration);
        });

        it('should have callbackUrl', () => {
            expect(
                this.metadata.asPassportConfig.callbackUrl,
            ).to.equal('this-is-a-mock-callback-url');
        });

        it('should have entrypoint', () => {
            expect(
                this.metadata.asPassportConfig.entryPoint,
            ).to.equal('https://example-idp-domain.com/adfs/ls/');
        });

        it('should have issuer', () => {
            expect(this.metadata.asPassportConfig.issuer).to.equal(
                'https://example.com/slug/metadata.xml',
            );
        });

        it('should have cert', () => {
            expect(
                this.metadata.asPassportConfig.cert,
            ).to.have.lengthOf.above(500);
        });

        it('should have signatureAlgorithm', () => {
            expect(
                this.metadata.asPassportConfig.signatureAlgorithm,
            ).to.equal('sha1');
        });
    });
});
