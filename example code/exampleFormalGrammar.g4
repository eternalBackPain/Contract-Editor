grammar ContractsGrammar;		

//test easily using http://lab.antlr.org/ 

// ----------------- Parser Rules -----------------
start
    : block+ EOF
    ;

block
    : BEGIN_BLOCK OPEN_BRACE block_name CLOSE_BRACE block_content END_BLOCK OPEN_BRACE block_name CLOSE_BRACE
    ;

block_content
    : (heading4
    | heading3
    | heading2
    | heading1
    | body
    | new_lines)+
    ; 

heading4
    : HEADING4
    ;
    
heading3
    : HEADING3
    ;

heading2
    : HEADING2
    ;

heading1
    : HEADING1
    ;
    
body
    : INLINE_TEXT
    ;

new_lines
    : NEWLINES
    ;

block_name
    : INLINE_TEXT
    ;

BEGIN_BLOCK: '@begin';
END_BLOCK: '@end';
OPEN_BRACE: '{';
CLOSE_BRACE: '}';

HEADING4: '####' ~[\r\n]*;
HEADING3: '###' ~[\r\n]*;
HEADING2: '##' ~[\r\n]*;
HEADING1: '#' ~[\r\n]*;
INLINE_TEXT: ~[@{}\r\n]+;
NEWLINES: ('\r'? '\n')+;

