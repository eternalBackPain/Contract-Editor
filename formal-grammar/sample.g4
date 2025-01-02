// To generate parser: 
//  `C:\antlr4\sample>antlr4 Expr.g4`
//  or, for js parser:
//  `C:\antlr4\sample>antlr4 -Dlanguage=JavaScript Expr.g4`

// To compile the java parser: `C:\antlr4\sample>compile Expr*.js
// To compile the js parser, use npm package https://www.npmjs.com/package/antlr4

// see https://www.youtube.com/watch?v=pa8qG0I10_I&ab_channel=D.KAl on how to set up ANTLR4

grammar Expr;		
prog:	(expr NEWLINE)* ;
expr:	expr ('*'|'/') expr
    |	expr ('+'|'-') expr
    |	INT
    |	'(' expr ')'
    ;
NEWLINE : [\r\n]+ ;
INT     : [0-9]+ ;