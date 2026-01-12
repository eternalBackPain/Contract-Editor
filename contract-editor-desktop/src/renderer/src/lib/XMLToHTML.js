// In command prompt, use the following command to compile the XSLT into a SEF file:
// cd C:\Users\johnn\Documents\GitHub\Contract-Editor\contract-editor-desktop\src\renderer\src\lib
// npx xslt3 -xsl:xslt/xml-to-html.xsl -export:xslt/xml-to-html.sef.json -nogo -t
// Then, copy the resulting sef.json into resources/xslt

const IPC_MISSING_MESSAGE = "XML transform IPC is not available.";

export async function XMLtoHTML(xmlString) {
  if (!xmlString || typeof xmlString !== "string") return "";

  const api = globalThis?.api;
  if (!api?.transformXmlToHtml) {
    console.error(IPC_MISSING_MESSAGE);
    return "";
  }

  return api.transformXmlToHtml(xmlString);
}
