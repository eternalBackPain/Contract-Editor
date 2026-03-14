lexer grammar ContractsLexer;

BEGIN_BLOCK: '@begin';
END_BLOCK: '@end';
OPEN_BRACE: '{' -> pushMode(IDENTIFIER_MODE);

HASH4: '####';
HASH3: '###';
HASH2: '##';
HASH1: '#';

HEADING4: HASH4 ~[\r\n]*;
HEADING3: HASH3 ~[\r\n]*;
HEADING2: HASH2 ~[\r\n]*;
HEADING1: HASH1 ~[\r\n]*;

BODY_TEXT: ~[#\r\n@{}]+ ( '\r'? '\n' ~[#\r\n@]+ )*;
NEWLINES: ('\r'? '\n')+;

mode IDENTIFIER_MODE;
IDENTIFIER_TEXT: ~[}\r\n]+;
CLOSE_BRACE: '}' -> popMode;

