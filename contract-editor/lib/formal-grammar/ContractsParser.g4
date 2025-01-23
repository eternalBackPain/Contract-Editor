parser grammar ContractsParser;		

options {
   tokenVocab = ContractsLexer;
}

//test easily using http://lab.antlr.org/ 
//with thanks to https://github.com/mike-lischke/vscode-antlr4/tree/d2a673818518de6cabfd26760ea593b09a8fd096

//TODO: add {{Reference}} and @define 

start
    : (block | new_lines)+ EOF
    ;

block
    : BEGIN_BLOCK OPEN_BRACE block_name CLOSE_BRACE block_content END_BLOCK OPEN_BRACE block_name CLOSE_BRACE
    ;

block_content
    : (heading1
    | heading2
    | heading3
    | heading4
    | body
    | new_lines)+
    ; 

heading4
    : heading4_head heading_body?
    ;
    
heading3
    : heading3_head heading_body?
    ;

heading2
    : heading2_head heading_body?
    ;

heading1
    : heading1_head heading_body?
    ;

heading4_head
    : HEADING4
    ;

heading3_head
    : HEADING3
    ;

heading2_head
    : HEADING2
    ;

heading1_head
    : HEADING1
    ;

heading_body
    : (body | new_lines)+
    ;

block_name
    : IDENTIFIER_TEXT
    ;

body
    : BODY_TEXT
    ;

new_lines
    : NEWLINES
    ;



