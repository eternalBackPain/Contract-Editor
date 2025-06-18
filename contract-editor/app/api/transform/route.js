import { readFileSync } from "fs";
import SaxonJS from "saxon-js";
import path from "path";

const xslPath = path.resolve(process.cwd(), "lib/xslt/transform.sef.json");
const xslText = readFileSync(xslPath, "utf-8");
// to compile the XSL to SEF for use with SaxonJS, use in the terminal (but not VSCode's terminal for some stupid reason) (and navigate to the lib/xslt directory first): npx xslt3 -xsl:transform.xsl -export:transform.sef.json -t -ns:##html5

export async function POST(req) {
  const { text: xml } = await req.json();
  const result = SaxonJS.transform({
    stylesheetText: xslText,
    sourceText: xml,
    destination: "serialized",
  });
  return new Response(
    JSON.stringify({ success: true, data: result.principalResult }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
