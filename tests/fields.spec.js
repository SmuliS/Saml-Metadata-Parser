const { expect } = require('chai');

const parser = require('../src/parser');

describe('SAMLMetadata', function () {
  beforeEach(function () {
    this.metadata = parser.fromFile(`${__dirname}/sample-data/sample.xml`);
  });

  afterEach(function () {
    delete this.metadata;
  });

  describe('entityID', function () {
    it('should exist', function () {
      expect(this.metadata.entity.entityID)
        .to.equal('https://example-idp-domain.com/adfs/services/trust');
    });
  });

  describe('ID', function () {
    it('should exist', function () {
      expect(this.metadata.entity.documentID)
        .to.equal('_5587436d-cd84-59b5-87be-4f31b40ec209');
    });
  });

  describe('IDPSSODescriptor', function () {
    it('should have it', function () {
      expect(this.metadata.IDPConfig).to.be.a('object');
    });

    describe('IDP configuration fields', function () {
      it('should include signing certificate', function () {
        expect(this.metadata.IDPConfig.signingKey).to.be.a('string');
      });

      it('should include encryption certificate', function () {
        expect(this.metadata.IDPConfig.encryptionKey).to.be.a('string');
      });

      it('should include SingleSignOn URL', function () {
        expect(this.metadata.IDPConfig.SingleSignOnURL)
          .to.equal('https://example-idp-domain.com/adfs/ls/');
      });

      it('should include SingleLogoutURL URL', function () {
        expect(this.metadata.IDPConfig.SingleLogoutURL)
          .to.equal('https://example-idp-domain.com/adfs/ls/');
      });
    });
  });
});
