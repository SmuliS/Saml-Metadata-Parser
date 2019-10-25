const fs = require('fs');

const { expect } = require('chai');

const { describe, beforeEach, it } = require('mocha');

const nock = require('nock');

const parser = require('../src/parser');
const SAMLMetadata = require('../src/SAMLMetadata');

const SAMPLE_METADATA_PATH = `${__dirname}/sample-data/sample.xml`;

describe('Parser', () => {
    describe('#fromFile', () => {
        it('should resolve metadata object', () => {
            expect(
                parser.fromFile(SAMPLE_METADATA_PATH),
            ).to.be.an.instanceof(SAMLMetadata);
        });
    });

    describe('#fromString', () => {
        let XMLString;
        beforeEach(() => {
            XMLString = fs.readFileSync(SAMPLE_METADATA_PATH, 'utf8');
        });

        it('should resolve metadata object', () => {
            expect(parser.fromString(XMLString)).to.be.an.instanceof(
                SAMLMetadata,
            );
        });
    });

    describe('#fromURL', () => {
        const metadataURL =
            'https://example.com/FederationMetadata/2007-06/FederationMetadata.xml';

        beforeEach(() => {
            nock('https://example.com')
                .get(
                    '/FederationMetadata/2007-06/FederationMetadata.xml',
                )
                .reply(
                    200,
                    fs.readFileSync(SAMPLE_METADATA_PATH, 'utf8'),
                    {
                        'Content-Type':
                            'application/samlmetadata+xml',
                    },
                );
        });

        it('should return a promise', () => {
            expect(parser.fromURL(metadataURL)).to.be.a('promise');
        });

        it('should resolve metadata object', done => {
            parser.fromURL(metadataURL).then(returnValue => {
                expect(returnValue).to.be.an.instanceof(SAMLMetadata);
                done();
            });
        });
    });
});
