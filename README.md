# SAML Metadata parser

### Installation

```
npm install saml-metadata-parser
```

### Usage

##### Parser
The parser is responsible of converting different kind of inputs into `SAMLMetadata` objects.

**parser.fromFile(filePath)**
Parameters: path to a `*.xml` file
Returns: an instance of `SAMLMetadata` object

**parser.fromString(XMLString)**
Parameters: string representation of a `*.xml` file
Returns: an instance of `SAMLMetadata` object

**parser.fromURL(URL)**
Parameters: URL which resolves a metadata.xml (e.g. https://adfs.example.com/FederationMetadata/2007-06/FederationMetadata.xml)
Returns: a Promise, which resolves an instance of `SAMLMetadata` object

##### SAMLMetadata
A SAMLMetadata object is responsible for storing all necessary metadata information. In addition, it can transform the metadata into different formats, such as [passport-saml](https://github.com/bergie/passport-saml#config-parameter-details)

**addSPConfiguration()**
Parameters: object including service provider configurations
Returns: instance of the `SAMLMetadata` object

**asPassportConfig**
Parameters: *None* (the function is getter)
Returns: SAML configuration in [passport-saml format](https://github.com/bergie/passport-saml#config-parameter-details)


### Contributors

- [Samuli Suortti](https://github.com/smulis)

### License

[The MIT License](http://opensource.org/licenses/MIT)
