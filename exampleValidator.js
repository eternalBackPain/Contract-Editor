//npm install libxmljs
//npm install fs

const fs = require('fs');
const libxmljs = require('libxmljs');

// 1. Read the XSD schema
const xsdSchema = fs.readFileSync('ContractDocument.xsd', 'utf-8');

// 2. Parse the schema
const xsdDoc = libxmljs.parseXml(xsdSchema);

// 3. Parse the generated XML
const xmlDoc = libxmljs.parseXml(xmlString); // xmlString from the parser above

// 4. Validate
if (xmlDoc.validate(xsdDoc)) {
  console.log("XML is valid according to the schema!");
} else {
  console.log("XML Validation Errors:", xmlDoc.validationErrors);
}
