grammar ContractsGrammar;		

//test easily using http://lab.antlr.org/ 
//STARTING SIMPLE
//changing body to INLINE_TEXT for some reason throws an error

// ----------------- Parser Rules -----------------
start
    : block+ EOF
    ;

block
    : BEGIN_BLOCK OPEN_BRACE block_name CLOSE_BRACE block_content END_BLOCK OPEN_BRACE block_name CLOSE_BRACE
    ;

block_content
    : (new_lines | body)+
    ; 

body
    : TEST NEWLINES
    ;

new_lines
    : NEWLINES
    ;

block_name
    : IDENTIFIER
    ;

TEST: 'test';
BEGIN_BLOCK: '@begin';
END_BLOCK: '@end';
OPEN_BRACE: '{';
CLOSE_BRACE: '}';
HASH: '#';
WHITESPACE: (' ')+;
NEWLINES: ('\r'? '\n')+;
IDENTIFIER: [a-zA-Z0-9_\-' ]+;
INLINE_TEXT: ~[{}@\r\n]+;

