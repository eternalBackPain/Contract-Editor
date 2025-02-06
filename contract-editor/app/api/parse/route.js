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

    // 3) SET UP LISTENER
    class CustomListener extends ContractsParserListener {
      constructor() {
        super();
        this.HTMLOutput = [];
      }

      enterStart(ctx) {}
      exitStart(ctx) {}
      enterBlock(ctx) {}
      exitBlock(ctx) {}
      enterBlock_content(ctx) {}
      exitBlock_content(ctx) {}

      enterHeading4(ctx) {
        const heading = ctx.getChild(0).getText();
        this.HTMLOutput.push("<h4>" + heading.substring(4) + "</h4>");
      }

      exitHeading4(ctx) {}

      enterHeading3(ctx) {
        const heading = ctx.getChild(0).getText();
        this.HTMLOutput.push("<h3>" + heading.substring(3) + "</h3>");
      }

      exitHeading3(ctx) {}

      enterHeading2(ctx) {
        const heading = ctx.getChild(0).getText();
        this.HTMLOutput.push("<h2>" + heading.substring(2) + "</h2>");
      }

      exitHeading2(ctx) {}

      enterHeading1(ctx) {
        const heading = ctx.getChild(0).getText();
        this.HTMLOutput.push("<h1>" + heading.substring(1) + "</h1>");
      }

      exitHeading1(ctx) {}

      enterHeading_body(ctx) {
        this.HTMLOutput.push("<p>");
      }

      exitHeading_body(ctx) {
        this.HTMLOutput.push(ctx.getText() + "</p>");
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
    const html = listener.HTMLOutput.join(""); // Join the array of HTML strings into a single string

    // 4) RETURN RESPONSE
    return new Response(JSON.stringify({ success: true, data: html }), {
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
