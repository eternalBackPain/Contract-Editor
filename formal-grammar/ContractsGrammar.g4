grammar ContractsGrammar;		

// ----------------- Parser Rules -----------------

start
    : block+ EOF
    ;

block
    : BEGIN_BLOCK block_name CLOSE_BRACE clause* END_BLOCK block_name CLOSE_BRACE
    ;

clause
    : hash_level title content? subclause*
    ;

subclause
    : hash_level title content? subclause*
    ;

content
    : (text | reference | inline_command)+
    ;

reference
    : DOUBLE_LCURLY reference_name DOUBLE_RCURLY
    ;

inline_command
    : AT command_name LBRACE command_parameters RBRACE
    ;

title
    : text
    ;

hash_level
    : HASH4
    | HASH3
    | HASH2
    | HASH1
    ;

command_parameters
    : ESCAPED_STRING (',' ESCAPED_STRING)*
    ;

block_name
    : identifier
    ;

reference_name
    : identifier
    ;

command_name
    : identifier
    ;

identifier
    : IDENTIFIER
    ;

text
    : TEXT
    ;

// ----------------- Lexer Rules -----------------

// Skip whitespace (like Lark's %ignore WS).
WS
    : [ \t\r\n]+ -> skip
    ;

// Tokens corresponding to "@begin{" and "@end{" lines:
BEGIN_BLOCK
    : '@begin{'
    ;
END_BLOCK
    : '@end{'
    ;

CLOSE_BRACE
    : '}'
    ;

DOUBLE_LCURLY
    : '{{'
    ;

DOUBLE_RCURLY
    : '}}'
    ;

AT
    : '@'
    ;

LBRACE
    : '{'
    ;

RBRACE
    : '}'
    ;

// Hash-level tokens:
HASH4
    : '####'
    ;
HASH3
    : '###'
    ;
HASH2
    : '##'
    ;
HASH1
    : '#'
    ;

// Matches strings like "Hello" or "Hello, \"world\""
ESCAPED_STRING
    : '"' ( '\\"' | ~["] )* '"'
    ;

// Allows letters, digits, underscores, apostrophes, hyphens, and spaces (any combination).
IDENTIFIER
    : [a-zA-Z0-9_\-' ]+
    ;

// Anything not {, }, or @ (repeated one or more times).
TEXT
    : (~[{}@])+ 
    ;