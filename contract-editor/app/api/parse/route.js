import antlr4 from "antlr4";
import ContractsLexer from "../../../lib/formal-grammar/ContractsLexer.js";
import ContractsParser from "../../../lib/formal-grammar/ContractsParser.js";
import ContractsParserListener from "../../../lib/formal-grammar/ContractsParserListener.js";

export async function POST(request) {
  try {
    // 1) READ INCOMING REQUEST JSON
    const data = await request.json();
    const { text } = data;

    // 2) PARSE TEXT
    const chars = new antlr4.InputStream(text); // Convert input text to ANTLR InputStream
    const lexer = new ContractsLexer(chars); // Create lexer
    const tokens = new antlr4.CommonTokenStream(lexer); // Create token stream
    const parser = new ContractsParser(tokens); // Create parser
    const tree = parser.start();

    // 2A) ESCAPE <, >, AND & CHARACTERS (havent used this yet, but might be useful later)
    function escapeXML(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // 3) SET UP LISTENER
    class CustomListener extends ContractsParserListener {
      constructor() {
        super();
        this.XMLOutput = [];
      }

      enterStart(ctx) {}
      exitStart(ctx) {}

      enterBlock(ctx) {
        this.XMLOutput.push("<Block>");
      }
      exitBlock(ctx) {
        this.XMLOutput.push("</Block>");
      }

      enterBlock_content(ctx) {}
      exitBlock_content(ctx) {}

      enterHeading4(ctx) {
        const heading = ctx.getChild(0).getText();
        this.XMLOutput.push(
          "<HeadingLevel4>" + heading.substring(5) + "</HeadingLevel4>"
        );
      }
      exitHeading4(ctx) {}

      enterHeading3(ctx) {
        const heading = ctx.getChild(0).getText();
        this.XMLOutput.push(
          "<HeadingLevel3>" + heading.substring(4) + "</HeadingLevel3>"
        );
      }
      exitHeading3(ctx) {}

      enterHeading2(ctx) {
        const heading = ctx.getChild(0).getText();
        this.XMLOutput.push(
          "<HeadingLevel2>" + heading.substring(3) + "</HeadingLevel2>"
        );
      }
      exitHeading2(ctx) {}

      enterHeading1(ctx) {
        const heading = ctx.getChild(0).getText();
        this.XMLOutput.push(
          "<HeadingLevel1>" + heading.substring(2) + "</HeadingLevel1>"
        );
      }
      exitHeading1(ctx) {}

      enterHeading_body(ctx) {
        this.XMLOutput.push("<Paragraph>");
      }

      exitHeading_body(ctx) {
        this.XMLOutput.push(ctx.getText() + "</Paragraph>");
      }

      enterBlock_name(ctx) {}
      exitBlock_name(ctx) {}
      enterBody(ctx) {}
      exitBody(ctx) {}
      enterNew_lines(ctx) {}
      exitNew_lines(ctx) {}
    }

    const listener = new CustomListener(); // instantiate new listener class
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree); // Walk the parse tree with the listener
    const body = listener.XMLOutput.join("");

    const xmlDecl = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    const rootOpen = `<document>`;
    const xmlContent = xmlDecl + rootOpen + body + `</document>`;

    // 4) RETURN RESPONSE
    return new Response(JSON.stringify({ success: true, data: xmlContent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
