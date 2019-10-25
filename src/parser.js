const fs = require('fs');
const https = require('https');

const XMLParser = require('xml2json');

const SAMLMetadata = require('./SAMLMetadata');

const isValidRespone = res =>
    res.statusCode === 200 &&
    res.headers['content-type'] === 'application/samlmetadata+xml';

const fromString = xmlString => {
    const XMLParseOptions = {
        object: true,
        coerce: true,
        sanitize: true,
    };

    const metadataObj = XMLParser.toJson(xmlString, XMLParseOptions);

    return new SAMLMetadata(metadataObj);
};

const fromFile = path => {
    const xmlStr = fs.readFileSync(path, 'utf8');
    return fromString(xmlStr);
};

const fromURL = URL =>
    new Promise((resolve, reject) =>
        https.get(URL, res => {
            if (!isValidRespone(res)) {
                reject();
            }
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(fromString(data));
            });
        }),
    );

module.exports = {
    fromString,
    fromFile,
    fromURL,
};
