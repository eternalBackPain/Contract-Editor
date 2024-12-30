grammar ContractMarkup;

/* 
   ----------------------------
   PARSER RULES
   ----------------------------
*/

/**
 * The document must contain at least one block or outside block text.
 */
document
    : ( block
      | outsideBlockText
      )+ EOF
    ;

/**
 * A block must have content (at least one clause, definition, or free text).
 */
block
    : BLOCK_BEGIN blockContent BLOCK_END
    ;

/**
 * Block content must include at least one valid element.
 */
blockContent
    : ( clause
      | defineStatement
      | freeTextStatement
      | emptyLine
      )+
    ;

/**
 * Outside block text must include at least one free-text line or empty line.
 */
outsideBlockText
    : (freeTextStatement | emptyLine)+
    ;

/**
 * A clause (like "# Title") followed by zero or more lines belonging to it.
 */
clause
    : headingLine clauseContentLine*
    ;

/**
 * Heading lines like "# Title" or "## Sub-title".
 */
headingLine
    : HEADING
    ;

/**
 * Clause content can include sub-headings, definitions, or free-text lines.
 */
clauseContentLine
    : defineStatement
    | subHeading
    | freeTextStatement
    | emptyLine
    ;

/**
 * A sub-heading with optional nested content lines.
 */
subHeading
    : HEADING clauseContentLine*
    ;

/**
 * A define statement like "@define{...}" with optional body text.
 */
defineStatement
    : DEFINE_COMMAND defineBody
    ;

/**
 * The body of a definition can contain one or more free-text lines.
 */
defineBody
    : freeTextStatement*
    ;

/**
 * A free-text line, optionally followed by newlines.
 */
freeTextStatement
    : FREE_TEXT (NEWLINE+ | EOF)
    ;

/**
 * Represents completely blank lines (just newlines).
 */
emptyLine
    : NEWLINE+
    ;

/* 
   ----------------------------
   LEXER RULES
   ----------------------------
*/

/**
 * Matches @begin{something}.
 */
BLOCK_BEGIN
    : '@begin{' ~[}]* '}'
    ;

/**
 * Matches @end{something}.
 */
BLOCK_END
    : '@end{' ~[}]* '}'
    ;

/**
 * Matches @define{...}.
 */
DEFINE_COMMAND
    : '@define{' ~[}]* '}'
    ;

/**
 * Matches headings (#, ##, ###) with optional text.
 */
HEADING
    : '#'+ ~[\r\n]*
    ;

/**
 * Matches any free-text content that isn't a special token.
 */
FREE_TEXT
    : ~[\r\n#@]+ (~[\r\n])*
    ;

/**
 * Matches one or more newlines.
 */
NEWLINE
    : [\r\n]+
    ;

/**
 * Skips whitespace (spaces, tabs).
 */
WS
    : [ \t]+ -> channel(HIDDEN)
    ;
