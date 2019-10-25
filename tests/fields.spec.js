const { expect } = require('chai');

const { describe, beforeEach, afterEach, it } = require('mocha');

const parser = require('../src/parser');

describe('SAMLMetadata', () => {
    beforeEach(() => {
        this.metadata = parser.fromFile(
            `${__dirname}/sample-data/sample.xml`,
        );
    });

    afterEach(() => {
        delete this.metadata;
    });

    describe('entityID', () => {
        it('should exist', () => {
            expect(this.metadata.entity.entityID).to.equal(
                'https://example-idp-domain.com/adfs/services/trust',
            );
        });
    });

    describe('ID', () => {
        it('should exist', () => {
            expect(this.metadata.entity.documentID).to.equal(
                '_5587436d-cd84-59b5-87be-4f31b40ec209',
            );
        });
    });

    describe('IDPSSODescriptor', () => {
        it('should have it', () => {
            expect(this.metadata.IDPConfig).to.be.a('object');
        });

        describe('IDP configuration fields', () => {
            it('should include signing certificate', () => {
                expect(this.metadata.IDPConfig.signingKey).to.be.a(
                    'string',
                );
            });

            it('should include encryption certificate', () => {
                expect(this.metadata.IDPConfig.encryptionKey).to.be.a(
                    'string',
                );
            });

            it('should include SingleSignOn URL', () => {
                expect(
                    this.metadata.IDPConfig.SingleSignOnURL,
                ).to.equal('https://example-idp-domain.com/adfs/ls/');
            });

            it('should include SingleLogoutURL URL', () => {
                expect(
                    this.metadata.IDPConfig.SingleLogoutURL,
                ).to.equal('https://example-idp-domain.com/adfs/ls/');
            });
        });
    });
});
