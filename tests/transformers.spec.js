const { expect } = require('chai');

const parser = require('../src/parser');

const SAMPLE_METADATA_PATH = `${__dirname}/sample-data/sample.xml`;

describe('asPassportConfig', function () {
  describe('when service provider configuration NOT provided', function () {
    beforeEach(function () {
      this.metadata = parser.fromFile(SAMPLE_METADATA_PATH);
    });

    it('should throw error', function () {
      expect(() => this.metadata.asPassportConfig)
        .to.throw('Missing service provider configuration');
    });
  });

  describe('when service provider configuration provided', function () {
    beforeEach(function () {
      const SPConfiguration = {
        callbackUrl: 'this-is-a-mock-callback-url',
        issuer: 'https://example.com/slug/metadata.xml',
      };
      this.metadata = parser.fromFile(SAMPLE_METADATA_PATH).addSPConfiguration(SPConfiguration);
    });

    it('should have callbackUrl', function () {
      expect(this.metadata.asPassportConfig.callbackUrl)
        .to.equal('this-is-a-mock-callback-url');
    });

    it('should have entrypoint', function () {
      expect(this.metadata.asPassportConfig.entryPoint)
        .to.equal('https://example-idp-domain.com/adfs/ls/');
    });

    it('should have issuer', function () {
      expect(this.metadata.asPassportConfig.issuer)
        .to.equal('https://example.com/slug/metadata.xml');
    });

    it('should have cert', function () {
      expect(this.metadata.asPassportConfig.cert)
        .to.have.lengthOf.above(500);
    });

    it('should have signatureAlgorithm', function () {
      expect(this.metadata.asPassportConfig.signatureAlgorithm)
        .to.equal('sha1');
    });
  });
});
