// Generated from c:/Users/johnn/Documents/GitHub/Contract-Editor/contract-editor/lib/formal-grammar/ContractsParser.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import ContractsParserListener from './ContractsParserListener.js';
const serializedATN = [4,1,15,95,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,
13,7,13,2,14,7,14,1,0,1,0,4,0,33,8,0,11,0,12,0,34,1,0,1,0,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,2,1,2,4,2,55,8,2,11,2,12,2,56,
1,3,1,3,3,3,61,8,3,1,4,1,4,3,4,65,8,4,1,5,1,5,3,5,69,8,5,1,6,1,6,3,6,73,
8,6,1,7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,1,11,1,11,4,11,85,8,11,11,11,12,11,
86,1,12,1,12,1,13,1,13,1,14,1,14,1,14,0,0,15,0,2,4,6,8,10,12,14,16,18,20,
22,24,26,28,0,0,93,0,32,1,0,0,0,2,38,1,0,0,0,4,54,1,0,0,0,6,58,1,0,0,0,8,
62,1,0,0,0,10,66,1,0,0,0,12,70,1,0,0,0,14,74,1,0,0,0,16,76,1,0,0,0,18,78,
1,0,0,0,20,80,1,0,0,0,22,84,1,0,0,0,24,88,1,0,0,0,26,90,1,0,0,0,28,92,1,
0,0,0,30,33,3,2,1,0,31,33,3,28,14,0,32,30,1,0,0,0,32,31,1,0,0,0,33,34,1,
0,0,0,34,32,1,0,0,0,34,35,1,0,0,0,35,36,1,0,0,0,36,37,5,0,0,1,37,1,1,0,0,
0,38,39,5,1,0,0,39,40,5,3,0,0,40,41,3,24,12,0,41,42,5,15,0,0,42,43,3,4,2,
0,43,44,5,2,0,0,44,45,5,3,0,0,45,46,3,24,12,0,46,47,5,15,0,0,47,3,1,0,0,
0,48,55,3,12,6,0,49,55,3,10,5,0,50,55,3,8,4,0,51,55,3,6,3,0,52,55,3,26,13,
0,53,55,3,28,14,0,54,48,1,0,0,0,54,49,1,0,0,0,54,50,1,0,0,0,54,51,1,0,0,
0,54,52,1,0,0,0,54,53,1,0,0,0,55,56,1,0,0,0,56,54,1,0,0,0,56,57,1,0,0,0,
57,5,1,0,0,0,58,60,3,14,7,0,59,61,3,22,11,0,60,59,1,0,0,0,60,61,1,0,0,0,
61,7,1,0,0,0,62,64,3,16,8,0,63,65,3,22,11,0,64,63,1,0,0,0,64,65,1,0,0,0,
65,9,1,0,0,0,66,68,3,18,9,0,67,69,3,22,11,0,68,67,1,0,0,0,68,69,1,0,0,0,
69,11,1,0,0,0,70,72,3,20,10,0,71,73,3,22,11,0,72,71,1,0,0,0,72,73,1,0,0,
0,73,13,1,0,0,0,74,75,5,8,0,0,75,15,1,0,0,0,76,77,5,9,0,0,77,17,1,0,0,0,
78,79,5,10,0,0,79,19,1,0,0,0,80,81,5,11,0,0,81,21,1,0,0,0,82,85,3,26,13,
0,83,85,3,28,14,0,84,82,1,0,0,0,84,83,1,0,0,0,85,86,1,0,0,0,86,84,1,0,0,
0,86,87,1,0,0,0,87,23,1,0,0,0,88,89,5,14,0,0,89,25,1,0,0,0,90,91,5,12,0,
0,91,27,1,0,0,0,92,93,5,13,0,0,93,29,1,0,0,0,10,32,34,54,56,60,64,68,72,
84,86];


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
                         "heading3", "heading2", "heading1", "heading4_head", 
                         "heading3_head", "heading2_head", "heading1_head", 
                         "heading_body", "block_name", "body", "new_lines" ];

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
	        this.state = 32; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 32;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 1:
	                this.state = 30;
	                this.block();
	                break;
	            case 13:
	                this.state = 31;
	                this.new_lines();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 34; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===1 || _la===13);
	        this.state = 36;
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
	        this.state = 38;
	        this.match(ContractsParser.BEGIN_BLOCK);
	        this.state = 39;
	        this.match(ContractsParser.OPEN_BRACE);
	        this.state = 40;
	        this.block_name();
	        this.state = 41;
	        this.match(ContractsParser.CLOSE_BRACE);
	        this.state = 42;
	        this.block_content();
	        this.state = 43;
	        this.match(ContractsParser.END_BLOCK);
	        this.state = 44;
	        this.match(ContractsParser.OPEN_BRACE);
	        this.state = 45;
	        this.block_name();
	        this.state = 46;
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
	        this.state = 54; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 54;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 11:
	                this.state = 48;
	                this.heading1();
	                break;
	            case 10:
	                this.state = 49;
	                this.heading2();
	                break;
	            case 9:
	                this.state = 50;
	                this.heading3();
	                break;
	            case 8:
	                this.state = 51;
	                this.heading4();
	                break;
	            case 12:
	                this.state = 52;
	                this.body();
	                break;
	            case 13:
	                this.state = 53;
	                this.new_lines();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 56; 
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
	        this.state = 58;
	        this.heading4_head();
	        this.state = 60;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
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



	heading3() {
	    let localctx = new Heading3Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, ContractsParser.RULE_heading3);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 62;
	        this.heading3_head();
	        this.state = 64;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
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



	heading2() {
	    let localctx = new Heading2Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, ContractsParser.RULE_heading2);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 66;
	        this.heading2_head();
	        this.state = 68;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
	        if(la_===1) {
	            this.state = 67;
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
	        this.state = 70;
	        this.heading1_head();
	        this.state = 72;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
	        if(la_===1) {
	            this.state = 71;
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



	heading4_head() {
	    let localctx = new Heading4_headContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, ContractsParser.RULE_heading4_head);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 74;
	        this.match(ContractsParser.HEADING4);
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



	heading3_head() {
	    let localctx = new Heading3_headContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, ContractsParser.RULE_heading3_head);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 76;
	        this.match(ContractsParser.HEADING3);
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



	heading2_head() {
	    let localctx = new Heading2_headContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, ContractsParser.RULE_heading2_head);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 78;
	        this.match(ContractsParser.HEADING2);
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



	heading1_head() {
	    let localctx = new Heading1_headContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, ContractsParser.RULE_heading1_head);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 80;
	        this.match(ContractsParser.HEADING1);
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
	    this.enterRule(localctx, 22, ContractsParser.RULE_heading_body);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 84; 
	        this._errHandler.sync(this);
	        var _alt = 1;
	        do {
	        	switch (_alt) {
	        	case 1:
	        		this.state = 84;
	        		this._errHandler.sync(this);
	        		switch(this._input.LA(1)) {
	        		case 12:
	        		    this.state = 82;
	        		    this.body();
	        		    break;
	        		case 13:
	        		    this.state = 83;
	        		    this.new_lines();
	        		    break;
	        		default:
	        		    throw new antlr4.error.NoViableAltException(this);
	        		}
	        		break;
	        	default:
	        		throw new antlr4.error.NoViableAltException(this);
	        	}
	        	this.state = 86; 
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
	    this.enterRule(localctx, 24, ContractsParser.RULE_block_name);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 88;
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
	    this.enterRule(localctx, 26, ContractsParser.RULE_body);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 90;
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
	    this.enterRule(localctx, 28, ContractsParser.RULE_new_lines);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 92;
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
ContractsParser.RULE_heading4_head = 7;
ContractsParser.RULE_heading3_head = 8;
ContractsParser.RULE_heading2_head = 9;
ContractsParser.RULE_heading1_head = 10;
ContractsParser.RULE_heading_body = 11;
ContractsParser.RULE_block_name = 12;
ContractsParser.RULE_body = 13;
ContractsParser.RULE_new_lines = 14;

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

	heading4_head() {
	    return this.getTypedRuleContext(Heading4_headContext,0);
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

	heading3_head() {
	    return this.getTypedRuleContext(Heading3_headContext,0);
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

	heading2_head() {
	    return this.getTypedRuleContext(Heading2_headContext,0);
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

	heading1_head() {
	    return this.getTypedRuleContext(Heading1_headContext,0);
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



class Heading4_headContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading4_head;
    }

	HEADING4() {
	    return this.getToken(ContractsParser.HEADING4, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading4_head(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading4_head(this);
		}
	}


}



class Heading3_headContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading3_head;
    }

	HEADING3() {
	    return this.getToken(ContractsParser.HEADING3, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading3_head(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading3_head(this);
		}
	}


}



class Heading2_headContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading2_head;
    }

	HEADING2() {
	    return this.getToken(ContractsParser.HEADING2, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading2_head(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading2_head(this);
		}
	}


}



class Heading1_headContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ContractsParser.RULE_heading1_head;
    }

	HEADING1() {
	    return this.getToken(ContractsParser.HEADING1, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.enterHeading1_head(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ContractsParserListener ) {
	        listener.exitHeading1_head(this);
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
ContractsParser.Heading4_headContext = Heading4_headContext; 
ContractsParser.Heading3_headContext = Heading3_headContext; 
ContractsParser.Heading2_headContext = Heading2_headContext; 
ContractsParser.Heading1_headContext = Heading1_headContext; 
ContractsParser.Heading_bodyContext = Heading_bodyContext; 
ContractsParser.Block_nameContext = Block_nameContext; 
ContractsParser.BodyContext = BodyContext; 
ContractsParser.New_linesContext = New_linesContext; 
