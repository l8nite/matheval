var _ = require('underscore')._;

var Token = require('./Token.js').Token;
var Value = require('./Value.js').Value;
var Operator = require('./Operator.js').Operator;
var Symbol = require('./Symbol.js').Symbol;

var Lexer = function(expression) {
    this.toke(expression);
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

Lexer.prototype.toke = function(expression) {
    this.index = 0;
    this.tokens = [];

    if (expression === undefined) {
        this.expression = undefined;
        return false;
    }

    this.expression = new String(expression);

    this.expression.index = 0;

    this.expression.peek = function() {
        return this.index < this.length ? this.charAt(this.index) : undefined;
    };

    this.expression.next = function() {
        return this.index < this.length ? this.charAt(this.index++) : undefined;
    };

    while (this.expression.peek()) {
        var token = this._scan();

        if (token === undefined) {
            throw new SyntaxError("Can't read token at index: " + this.stridx);
        }

        this.tokens.push(token);
    }
};

module.exports.Lexer = Lexer;

// var Types = new Enum('Operator', 'Value', '(', ')', ',', 'Symbol');
Lexer.prototype._scan = function() {
    var expression = this.expression;

    // skip white space
    var peek;
    while ((peek = expression.peek()) === ' ') {
        expression.index++;
    }

    switch (peek) {
        case '(':
        case ')':
        case ',':
            return new Token(Types[peek]);
        default:
            return undefined;
    }
};
