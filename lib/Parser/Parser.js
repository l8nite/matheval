var _ = require('underscore')._;

var Lexer = require('../Lexer/Lexer.js').Lexer;
var Token = require('../Token.js').Token;
var Types = require('../Token.js').Types;

var Operators = require('../Operators.js').Operators;
var Constants = require('../Constants.js').Constants;
var Functions = require('../Functions.js').Functions;

var Parser = function(expression) {
    this.parse(expression);
};

Parser.prototype.parse = function(expression) {
    this.tokens = [];

    if (expression === undefined) {
        return undefined;
    }

    // try to lex the expression
    var lexer = new Lexer(expression);

    if (lexer.tokens.length === 0) {
        return undefined;
    }

    // give our stack array a helper peek() function
    var stack = [];
    stack.peek = function() {
        if (this.length === 0) {
            return undefined;
        }

        return this[this.length - 1];
    };

    // copy lexer tokens because we'll be modifying them
    var tokens = _.map(lexer.tokens, function(t) {
        return t.clone();
    });

    // pay attention: input = tokens, output = this.tokens
    this.infix2postfix(tokens, stack, this.tokens);
};

module.exports.Parser = Parser;

// convert infix to postfix using modified shunting yard algorithm
// http://en.wikipedia.org/wiki/Shunting-yard_algorithm
// identifies functions, constants, unary operations
Parser.prototype.infix2postfix = function(tokens, stack, outputQ) {
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        var next = i < tokens.length - 1 ? tokens[i + 1] : undefined;
        var prev = i > 0 ? tokens[i - 1] : undefined;

        _i2p_Handlers[token.type](outputQ, stack, token, prev, next);
    }

    while (token = stack.pop()) {
        if (token.is('LeftParen')) {
            throw new SyntaxError('Unexpected (');
        }

        if (token.is('RightParen')) {
            throw new SyntaxError('Unexpected )');
        }

        outputQ.push(token);
    }

    return outputQ;
};

var _i2p_Handlers = {};

// if the token is a number, then add it to the output queue
_i2p_Handlers['Number'] = function(outputQ, stack, token) {
    outputQ.push(token);
};

// identify functions, constants, or variables
_i2p_Handlers['Symbol'] = function(outputQ, stack, token, prev, next) {
    if (next.is('LeftParen')) {
        token.type = Types.Function;

        if (!_.has(Functions, token.value)) {
            throw new SyntaxError('Unknown function: ' + token.value);
        }

        stack.push(token);
        return;
    }

    if (_.has(Constants, token.value)) {
        token.type = Types.Constant;
    } else {
        token.type = Types.Variable;
    }

    outputQ.push(token);
};

// pop function arguments off the stack onto the queue
_i2p_Handlers['Comma'] = function(outputQ, stack, token) {
    // until the token at the top of the stack is a left-paren,
    // pop operators off the stack onto the output queue
    while (token = stack.pop()) {
        if (token.is('LeftParen')) {
            stack.push(token);
            break;
        } else {
            outputQ.push(token);
        }
    }

    // either the comma was misplaced or the parentheses were mismatched
    if (!stack.peek().is('LeftParen')) {
        throw new SyntaxError('Error parsing arguments');
    }

    // update argument count of the function
    var leftparen = stack.pop();

    if (!stack.peek().is('Function')) {
        throw new SyntaxError('Expected function call');
    }

    stack.push(leftparen);
};

// parentheses go straight onto the stack
_i2p_Handlers['LeftParen'] = function(outputQ, stack, token) {
    stack.push(token);
};

// find matching parentheses, while doing so move operators to the stack
_i2p_Handlers['RightParen'] = function(outputQ, stack, token) {

    // until the token at the top of the stack is a left-paren,
    // pop operators off the stack onto the output queue
    while (token = stack.pop()) {
        if (token.is('LeftParen')) {
            stack.push(token);
            break;
        } else {
            outputQ.push(token);
        }
    }

    // if the stack runs out without finding a left-paren, then the
    // parentheses were mismatched
    token = stack.peek();
    if (!token.is('LeftParen')) {
        throw new SyntaxError('Expected (');
    } else {
        stack.pop(); // throw left-paren away
    }

    // pop function token onto output queue
    if (stack.peek().is('Function')) {
        token = stack.pop();
        outputQ.push(token);
    }

    // throw right-paren away
};

// find unary operators, move higher precedence operators from stack to queue
_i2p_Handlers['Operator'] = function(outputQ, stack, token, prev) {

    // support unary minus by changing operator on the fly
    if (token.is('Operator', '-')) {
        if (prev === undefined || prev.is('LeftParen') || prev.is('Operator')) {
            token.value = 'Unary-';
        }
    }
    // same for unary plus
    else if (token.is('Operator', '+')) {
        if (prev === undefined || prev.is('LeftParen') || prev.is('Operator')) {
            token.value = 'Unary+';
        }
    }

    // while there is an operator token at the top of the stack which is
    // higher precedence than us, pop it off the stack onto the queue
    while (takesPrecedence(token, stack.peek())) {
        outputQ.push(stack.pop());
    }

    // then push us onto the stack
    stack.push(token);
};

// return true if b takes precdence over a
var takesPrecedence = function(a, b) {
    if (b === undefined) {
        return false;
    }

    if (b.type !== Types.Operator) {
        return false;
    }

    var opA = Operators[a.value];
    var opB = Operators[b.value];

    if (opA.precedence < opB.precedence) {
        return true;
    } else if (opA.precedence === opB.precedence && opA.associativity === 'L') {
        return true;
    }
};
