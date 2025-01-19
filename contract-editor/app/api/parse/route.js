import antlr4 from 'antlr4';
import ContractsLexer from '../../../lib/formal-grammar/ContractsLexer.js';
import ContractsParser from '../../../lib/formal-grammar/ContractsParser.js';
import ContractsParserListener from '../../../lib/formal-grammar/ContractsParserListener.js';

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
      enterHeading_body(ctx) {
        console.log("Entering heading body:", ctx.getText());
      }

      exitHeading_body(ctx) {
        console.log("Exiting heading body:", ctx.getText());
      }
      
      enterHeading1(ctx) {
        console.log("Entering heading1:", ctx.getText());
      }

      exitHeading1(ctx) {
        console.log("Exiting heading1:", ctx.getText());
      }
      
      enterBlock_content(ctx) {
        console.log("Entering block content:", ctx.getText());
      }

      exitBlock_content(ctx) {
        console.log("Exiting block content:", ctx.getText());
      }
      
      enterBlock(ctx) {
        console.log("Entering block:", ctx.getText());
      }

      exitBlock(ctx) {
        console.log("Exiting block:", ctx.getText());
      }

      enterStart(ctx) {
        console.log("Entering start rule:", ctx.getText());
      }

      exitStart(ctx) {
        console.log("Exiting start rule:", ctx.getText());
      }
    }

    const listener = new CustomListener();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree); // Walk the parse tree with the listener

    // 4) RETURN RESPONSE
    return new Response(JSON.stringify({ success: true, data: text }), {
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
