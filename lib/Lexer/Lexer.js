var _ = require('underscore')._;

var Token = require('./Token.js').Token;
var Types = require('./Token.js').Types;

var Operators = require('../Operators.js').LexableOperators;

var Lexer = function(expression) {
    this.tokenize(expression);
};

Lexer.prototype.peek = function() {
    if (this.index >= this.tokens.length) {
        return undefined;
    }

    return this.tokens[this.index];
};

Lexer.prototype.next = function() {
    if (this.index >= this.tokens.length) {
        return undefined;
    }

    return this.tokens[this.index++];
};

Lexer.prototype.tokenize = function(expression) {
    this.index = 0;
    this.tokens = [];

    if (expression === undefined) {
        this.expression = undefined;
        return false;
    }

    this.expression = new String(expression);

    this.expression.advance = function() {
        this.index++;
        this.peek = this.index < this.length ? this.charAt(this.index) : undefined;
        this.next = this.index < this.length - 1 ? this.charAt(this.index + 1) : undefined;
    };

    this.expression.index = -1;
    this.expression.advance();


    while (this.expression.peek) {
        var token = this.scanToken();

        if (token === undefined && this.expression.peek) {
            throw new SyntaxError("Unexpected character at index: " + this.expression.index);
        }

        if (token.type !== Types.Whitespace) {
            this.tokens.push(token);
        }
    }
};

module.exports.Lexer = Lexer;


Lexer.prototype.scanToken = function() {
    var expression = this.expression;

    var peek = expression.peek;

    if (peek === '(') {
        expression.advance();
        return new Token(Types.LeftParen, peek);
    }

    if (peek === ')') {
        expression.advance();
        return new Token(Types.RightParen, peek);
    }

    if (peek === ',') {
        expression.advance();
        return new Token(Types.Comma, peek);
    }

    if (isWhitespace(peek)) {
        return this.scanWhitespaceToken();
    }

    if (isOperatorStart(peek)) {
        return this.scanOperatorToken();
    }

    if (isSymbolStart(peek)) {
        return this.scanSymbolToken();
    }

    if (isNumberStart(peek)) {
        return this.scanNumberToken();
    }

    return undefined;
};


Lexer.prototype.scanWhitespaceToken = function() {
    var expression = this.expression;
    var start = expression.index;

    while (isWhitespace(expression.peek)) {
        expression.advance();
    }

    return new Token(Types.Whitespace, expression.substr(start, expression.index - start));
};

Lexer.prototype.scanOperatorToken = function() {
    var expression = this.expression;
    var operator = expression.peek;

    while (_.contains(Operators, operator + expression.next)) {
        operator = operator + expression.next;
        expression.advance();
    }

    expression.advance();

    return new Token(Types.Operator, operator);
};

Lexer.prototype.scanSymbolToken = function() {
    var expression = this.expression;
    var start = expression.index;

    while (isSymbolPart(expression.next)) {
        expression.advance();
    }
    expression.advance();

    return new Token(Types.Symbol, expression.substr(start, expression.index - start));
};

Lexer.prototype.scanNumberToken = function() {
    var expression = this.expression;
    var start = expression.index;

    // no leading zeroes
    var isLeadingZero = (expression.peek === '0' && isDigit(expression.next));
    if (isLeadingZero) {
        return undefined;
    }

    // integer part
    while (isDigit(expression.next)) {
        expression.advance();
    }

    // look for fractional part
    if (expression.next !== '.') {
        expression.advance();
        return new Token(Types.Number, + expression.substr(start, expression.index - start));
    }
    else {
        expression.advance();
    }

    var isTrailingDecimalPoint = !isDigit(expression.next);

    if (isTrailingDecimalPoint) {
        return undefined;
    }
    else {
        expression.advance();
    }

    while (isDigit(expression.next)) {
        expression.advance();
    }

    // look for exponential part
    if ('eE'.indexOf(expression.next) < 0) {
        expression.advance();
        return new Token(Types.Number, + expression.substr(start, expression.index - start));
    }
    else {
        expression.advance();
    }

    if ('+-'.indexOf(expression.next) >= 0) {
        expression.advance();
    }

    if (!isDigit(expression.next)) {
        return undefined;
    }
    else {
        expression.advance();
    }

    while (isDigit(expression.next)) {
        expression.advance();
    }

    expression.advance();

    return new Token(Types.Number, + expression.substr(start, expression.index - start));
};


/*
 * Helper Functions
 */
var isWhitespace = function(peek) {
    return (peek === '\u0009') || (peek === ' ') || (peek === '\u00A0');
};

var isLetter = function(peek) {
    return (peek >= 'a' && peek <= 'z') || (peek >= 'A' && peek <= 'Z');
};

var isDigit = function(peek) {
    return (peek >= '0') && (peek <= '9');
};

var operatorStartCharacters = _.map(Operators, function(operator) {
    return operator.charAt(0);
}).join('');

var isOperatorStart = function(peek) {
    return operatorStartCharacters.indexOf(peek) >= 0;
};

var isSymbolStart = function(peek) {
    return peek === '_' || isLetter(peek);
};

var isSymbolPart = function(peek) {
    return isSymbolStart(peek) || isDigit(peek) || peek === '.';
};

var isNumberStart = function(peek) {
    return peek === '.' || isDigit(peek);
};
