// Generated from c:/Users/johnn/Documents/GitHub/Contract-Editor/contract-editor/lib/formal-grammar/ContractsParser.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import ContractsParserListener from './ContractsParserListener.js';
const serializedATN = [4,1,15,79,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,1,0,1,0,4,0,25,8,0,11,
0,12,0,26,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,
2,1,2,1,2,4,2,47,8,2,11,2,12,2,48,1,3,1,3,3,3,53,8,3,1,4,1,4,3,4,57,8,4,
1,5,1,5,3,5,61,8,5,1,6,1,6,3,6,65,8,6,1,7,1,7,4,7,69,8,7,11,7,12,7,70,1,
8,1,8,1,9,1,9,1,10,1,10,1,10,0,0,11,0,2,4,6,8,10,12,14,16,18,20,0,0,81,0,
24,1,0,0,0,2,30,1,0,0,0,4,46,1,0,0,0,6,50,1,0,0,0,8,54,1,0,0,0,10,58,1,0,
0,0,12,62,1,0,0,0,14,68,1,0,0,0,16,72,1,0,0,0,18,74,1,0,0,0,20,76,1,0,0,
0,22,25,3,2,1,0,23,25,3,20,10,0,24,22,1,0,0,0,24,23,1,0,0,0,25,26,1,0,0,
0,26,24,1,0,0,0,26,27,1,0,0,0,27,28,1,0,0,0,28,29,5,0,0,1,29,1,1,0,0,0,30,
31,5,1,0,0,31,32,5,3,0,0,32,33,3,16,8,0,33,34,5,15,0,0,34,35,3,4,2,0,35,
36,5,2,0,0,36,37,5,3,0,0,37,38,3,16,8,0,38,39,5,15,0,0,39,3,1,0,0,0,40,47,
3,12,6,0,41,47,3,10,5,0,42,47,3,8,4,0,43,47,3,6,3,0,44,47,3,18,9,0,45,47,
3,20,10,0,46,40,1,0,0,0,46,41,1,0,0,0,46,42,1,0,0,0,46,43,1,0,0,0,46,44,
1,0,0,0,46,45,1,0,0,0,47,48,1,0,0,0,48,46,1,0,0,0,48,49,1,0,0,0,49,5,1,0,
0,0,50,52,5,8,0,0,51,53,3,14,7,0,52,51,1,0,0,0,52,53,1,0,0,0,53,7,1,0,0,
0,54,56,5,9,0,0,55,57,3,14,7,0,56,55,1,0,0,0,56,57,1,0,0,0,57,9,1,0,0,0,
58,60,5,10,0,0,59,61,3,14,7,0,60,59,1,0,0,0,60,61,1,0,0,0,61,11,1,0,0,0,
62,64,5,11,0,0,63,65,3,14,7,0,64,63,1,0,0,0,64,65,1,0,0,0,65,13,1,0,0,0,
66,69,3,18,9,0,67,69,3,20,10,0,68,66,1,0,0,0,68,67,1,0,0,0,69,70,1,0,0,0,
70,68,1,0,0,0,70,71,1,0,0,0,71,15,1,0,0,0,72,73,5,14,0,0,73,17,1,0,0,0,74,
75,5,12,0,0,75,19,1,0,0,0,76,77,5,13,0,0,77,21,1,0,0,0,10,24,26,46,48,52,
56,60,64,68,70];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ContractsParser extends antlr4.Parser {

    static grammarFileName = "ContractsParser.g4";
    static literalNames = [ null, "'@begin'", "'@end'", "'{'", "'####'", 
                            "'###'", "'##'", "'#'", null, null, null, null, 
                            null, null, null, "'}'" ];
    static symbolicNames = [ null, "BEGIN_BLOCK", "END_BLOCK", "OPEN_BRACE", 
                             "HASH4", "HASH3", "HASH2", "HASH1", "HEADING4", 
                             "HEADING3", "HEADING2", "HEADING1", "BODY_TEXT", 
                             "NEWLINES", "IDENTIFIER_TEXT", "CLOSE_BRACE" ];
    static ruleNames = [ "start", "block", "block_content", "heading4", 
                         "heading3", "heading2", "heading1", "heading_body", 
                         "block_name", "body", "new_lines" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = ContractsParser.ruleNames;
        this.literalNames = ContractsParser.literalNames;
        this.symbolicNames = ContractsParser.symbolicNames;
    }



	start() {
	    let localctx = new StartContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, ContractsParser.RULE_start);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 24; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 24;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 1:
	                this.state = 22;
	                this.block();
	                break;
	            case 13:
	                this.state = 23;
	                this.new_lines();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 26; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===1 || _la===13);
	        this.state = 28;
	        this.match(ContractsParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	block() {
	    let localctx = new BlockContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, ContractsParser.RULE_block);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 30;
	        this.match(ContractsParser.BEGIN_BLOCK);
	        this.state = 31;
	        this.match(ContractsParser.OPEN_BRACE);
	        this.state = 32;
	        this.block_name();
	        this.state = 33;
	        this.match(ContractsParser.CLOSE_BRACE);
	        this.state = 34;
	        this.block_content();
	        this.state = 35;
	        this.match(ContractsParser.END_BLOCK);
	        this.state = 36;
	        this.match(ContractsParser.OPEN_BRACE);
	        this.state = 37;
	        this.block_name();
	        this.state = 38;
	        this.match(ContractsParser.CLOSE_BRACE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	block_content() {
	    let localctx = new Block_contentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, ContractsParser.RULE_block_content);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 46; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 46;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 11:
	                this.state = 40;
	                this.heading1();
	                break;
	            case 10:
	                this.state = 41;
	                this.heading2();
	                break;
	            case 9:
	                this.state = 42;
	                this.heading3();
	                break;
	            case 8:
	                this.state = 43;
	                this.heading4();
	                break;
	            case 12:
	                this.state = 44;
	                this.body();
	                break;
	            case 13:
	                this.state = 45;
	                this.new_lines();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 48; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 16128) !== 0));
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	heading4() {
	    let localctx = new Heading4Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, ContractsParser.RULE_heading4);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 50;
	        this.match(ContractsParser.HEADING4);
	        this.state = 52;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
	        if(la_===1) {
	            this.state = 51;
	            this.heading_body();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	heading3() {
	    let localctx = new Heading3Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, ContractsParser.RULE_heading3);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 54;
	        this.match(ContractsParser.HEADING3);
	        this.state = 56;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
	        if(la_===1) {
	            this.state = 55;
	            this.heading_body();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	heading2() {
	    let localctx = new Heading2Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, ContractsParser.RULE_heading2);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 58;
	        this.match(ContractsParser.HEADING2);
	        this.state = 60;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
	        if(la_===1) {
	            this.state = 59;
	            this.heading_body();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	heading1() {
	    let localctx = new Heading1Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, ContractsParser.RULE_heading1);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 62;
	        this.match(ContractsParser.HEADING1);
	        this.state = 64;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
	        if(la_===1) {
	            this.state = 63;
	            this.heading_body();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	heading_body() {
	    let localctx = new Heading_bodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, ContractsParser.RULE_heading_body);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 68; 
	        this._errHandler.sync(this);
	        var _alt = 1;
	        do {
	        	switch (_alt) {
	        	case 1:
	        		this.state = 68;
	        		this._errHandler.sync(this);
	        		switch(this._input.LA(1)) {
	        		case 12:
	        		    this.state = 66;
	        		    this.body();
	        		    break;
	        		case 13:
	        		    this.state = 67;
	        		    this.new_lines();
	        		    break;
	        		default:
	        		    throw new antlr4.error.NoViableAltException(this);
	        		}
	        		break;
	        	default:
	        		throw new antlr4.error.NoViableAltException(this);
	        	}
	        	this.state = 70; 
	        	this._errHandler.sync(this);
	        	_alt = this._interp.adaptivePredict(this._input,9, this._ctx);
	        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	block_name() {
	    let localctx = new Block_nameContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, ContractsParser.RULE_block_name);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 72;
	        this.match(ContractsParser.IDENTIFIER_TEXT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	body() {
	    let localctx = new BodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, ContractsParser.RULE_body);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 74;
	        this.match(ContractsParser.BODY_TEXT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	new_lines() {
	    let localctx = new New_linesContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, ContractsParser.RULE_new_lines);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 76;
	        this.match(ContractsParser.NEWLINES);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

ContractsParser.EOF = antlr4.Token.EOF;
ContractsParser.BEGIN_BLOCK = 1;
ContractsParser.END_BLOCK = 2;
ContractsParser.OPEN_BRACE = 3;
ContractsParser.HASH4 = 4;
ContractsParser.HASH3 = 5;
ContractsParser.HASH2 = 6;
ContractsParser.HASH1 = 7;
ContractsParser.HEADING4 = 8;
ContractsParser.HEADING3 = 9;
ContractsParser.HEADING2 = 10;
ContractsParser.HEADING1 = 11;
ContractsParser.BODY_TEXT = 12;
ContractsParser.NEWLINES = 13;
ContractsParser.IDENTIFIER_TEXT = 14;
ContractsParser.CLOSE_BRACE = 15;

ContractsParser.RULE_start = 0;
ContractsParser.RULE_block = 1;
ContractsParser.RULE_block_content = 2;
ContractsParser.RULE_heading4 = 3;
ContractsParser.RULE_heading3 = 4;
ContractsParser.RULE_heading2 = 5;
ContractsParser.RULE_heading1 = 6;
ContractsParser.RULE_heading_body = 7;
ContractsParser.RULE_block_name = 8;
ContractsParser.RULE_body = 9;
ContractsParser.RULE_new_lines = 10;

class StartContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_start;
    }

	EOF() {
	    return this.getToken(ContractsParser.EOF, 0);
	};

	block = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BlockContext);
	    } else {
	        return this.getTypedRuleContext(BlockContext,i);
	    }
	};

	new_lines = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(New_linesContext);
	    } else {
	        return this.getTypedRuleContext(New_linesContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterStart(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitStart(this);
		}
	}


}



class BlockContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_block;
    }

	BEGIN_BLOCK() {
	    return this.getToken(ContractsParser.BEGIN_BLOCK, 0);
	};

	OPEN_BRACE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ContractsParser.OPEN_BRACE);
	    } else {
	        return this.getToken(ContractsParser.OPEN_BRACE, i);
	    }
	};


	block_name = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Block_nameContext);
	    } else {
	        return this.getTypedRuleContext(Block_nameContext,i);
	    }
	};

	CLOSE_BRACE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ContractsParser.CLOSE_BRACE);
	    } else {
	        return this.getToken(ContractsParser.CLOSE_BRACE, i);
	    }
	};


	block_content() {
	    return this.getTypedRuleContext(Block_contentContext,0);
	};

	END_BLOCK() {
	    return this.getToken(ContractsParser.END_BLOCK, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterBlock(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitBlock(this);
		}
	}


}



class Block_contentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_block_content;
    }

	heading1 = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Heading1Context);
	    } else {
	        return this.getTypedRuleContext(Heading1Context,i);
	    }
	};

	heading2 = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Heading2Context);
	    } else {
	        return this.getTypedRuleContext(Heading2Context,i);
	    }
	};

	heading3 = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Heading3Context);
	    } else {
	        return this.getTypedRuleContext(Heading3Context,i);
	    }
	};

	heading4 = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Heading4Context);
	    } else {
	        return this.getTypedRuleContext(Heading4Context,i);
	    }
	};

	body = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BodyContext);
	    } else {
	        return this.getTypedRuleContext(BodyContext,i);
	    }
	};

	new_lines = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(New_linesContext);
	    } else {
	        return this.getTypedRuleContext(New_linesContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterBlock_content(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitBlock_content(this);
		}
	}


}



class Heading4Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading4;
    }

	HEADING4() {
	    return this.getToken(ContractsParser.HEADING4, 0);
	};

	heading_body() {
	    return this.getTypedRuleContext(Heading_bodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading4(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading4(this);
		}
	}


}



class Heading3Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading3;
    }

	HEADING3() {
	    return this.getToken(ContractsParser.HEADING3, 0);
	};

	heading_body() {
	    return this.getTypedRuleContext(Heading_bodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading3(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading3(this);
		}
	}


}



class Heading2Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading2;
    }

	HEADING2() {
	    return this.getToken(ContractsParser.HEADING2, 0);
	};

	heading_body() {
	    return this.getTypedRuleContext(Heading_bodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading2(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading2(this);
		}
	}


}



class Heading1Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading1;
    }

	HEADING1() {
	    return this.getToken(ContractsParser.HEADING1, 0);
	};

	heading_body() {
	    return this.getTypedRuleContext(Heading_bodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading1(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading1(this);
		}
	}


}



class Heading_bodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading_body;
    }

	body = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BodyContext);
	    } else {
	        return this.getTypedRuleContext(BodyContext,i);
	    }
	};

	new_lines = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(New_linesContext);
	    } else {
	        return this.getTypedRuleContext(New_linesContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading_body(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading_body(this);
		}
	}


}



class Block_nameContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_block_name;
    }

	IDENTIFIER_TEXT() {
	    return this.getToken(ContractsParser.IDENTIFIER_TEXT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterBlock_name(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitBlock_name(this);
		}
	}


}



class BodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_body;
    }

	BODY_TEXT() {
	    return this.getToken(ContractsParser.BODY_TEXT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitBody(this);
		}
	}


}



class New_linesContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_new_lines;
    }

	NEWLINES() {
	    return this.getToken(ContractsParser.NEWLINES, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterNew_lines(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitNew_lines(this);
		}
	}


}




ContractsParser.StartContext = StartContext; 
ContractsParser.BlockContext = BlockContext; 
ContractsParser.Block_contentContext = Block_contentContext; 
ContractsParser.Heading4Context = Heading4Context; 
ContractsParser.Heading3Context = Heading3Context; 
ContractsParser.Heading2Context = Heading2Context; 
ContractsParser.Heading1Context = Heading1Context; 
ContractsParser.Heading_bodyContext = Heading_bodyContext; 
ContractsParser.Block_nameContext = Block_nameContext; 
ContractsParser.BodyContext = BodyContext; 
ContractsParser.New_linesContext = New_linesContext; 
