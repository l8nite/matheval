var _ = require('underscore')._;

var Lexer = require('./Lexer.js').Lexer;
var T = require('./Token.js');
var Token = T.Token;
var Types = T.Types;

var Operators = require('./Operators.js').Operators;
var Constants = require('./Constants.js').Constants;
var Functions = require('./Functions.js').Functions;

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

    return this.tokens;
};

module.exports.Parser = Parser;

// convert infix to postfix using modified shunting yard algorithm
// http://en.wikipedia.org/wiki/Shunting-yard_algorithm
// identifies functions, constants, unary operations
Parser.prototype.infix2postfix = function(tokens, stack, outputQ) {
    this.argc = -1; // running argument counter for functions

    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        var next = i < tokens.length - 1 ? tokens[i + 1] : undefined;
        var prev = i > 0 ? tokens[i - 1] : undefined;

        if (this.argc === 0 && token.isnt('RightParen')) {
            this.argc = 1; // after this, only commas increase argc
        }

        _i2p_Handlers[token.type].call(this, outputQ, stack, token, prev, next);
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
    if (next && next.is('LeftParen')) {
        token.type = Types.Function;

        if (!_.has(Functions, token.value)) {
            throw new SyntaxError('Unknown function: ' + token.value);
        }

        token.info = Functions[token.value];

        stack.push(token);
        return;
    }

    if (_.has(Constants, token.value)) {
        token.type = Types.Constant;
        token.info = Constants[token.value];
    }
    else {
        token.type = Types.Variable;
    }

    outputQ.push(token);
};

// pop function arguments off the stack onto the queue
_i2p_Handlers['Comma'] = function(outputQ, stack, token) {
    this.argc++;

    // until the token at the top of the stack is a left-paren,
    // pop operators off the stack onto the output queue
    while (token = stack.pop()) {
        if (token.is('LeftParen')) {
            stack.push(token);
            break;
        }
        else {
            outputQ.push(token);
        }
    }

    // either the comma was misplaced or the parentheses were mismatched
    if (stack.peek() && stack.peek().isnt('LeftParen')) {
        throw new SyntaxError('Error parsing arguments');
    }
};

// parentheses go straight onto the stack
_i2p_Handlers['LeftParen'] = function(outputQ, stack, token) {
    stack.push(new Token(Types.Number, this.argc));
    this.argc = 0;
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
        }
        else {
            outputQ.push(token);
        }
    }

    // if the stack runs out without finding a left-paren, then the
    // parentheses were mismatched
    token = stack.peek();
    if (token && token.isnt('LeftParen')) {
        throw new SyntaxError('Expected (');
    }
    else {
        stack.pop(); // throw left-paren away
    }


    var argc = this.argc;
    if (stack.peek() === undefined || stack.peek().isnt('Number')) {
        throw new SyntaxError('malformed input');
    }
    this.argc = stack.pop().value;

    // pop function token onto output queue
    if (stack.peek() && stack.peek().is('Function')) {
        token = stack.pop();
        var eargc = token.info.argc;
        if ((eargc === -1 && argc === 0) || (eargc !== -1 && argc !== eargc)) {
            throw new SyntaxError(token.value + ': incorrect number of arguments (expected ' + eargc + ')');
        }
        // later: handle left-associative function argc?
        outputQ.push(new Token(Types.Number, argc));
        outputQ.push(token);
    }

    // throw right-paren away
};

// find unary operators, move higher precedence operators from stack to queue
_i2p_Handlers['Operator'] = function(outputQ, stack, token, prev) {
    // support unary minus by changing operator on the fly
    if (token.is('Operator', '-')) {
        if (prev === undefined || prev.is('LeftParen') || prev.is('Operator') || prev.is('Comma')) {
            token.value = 'Unary-';
        }
    }
    // same for unary plus
    else if (token.is('Operator', '+')) {
        if (prev === undefined || prev.is('LeftParen') || prev.is('Operator') || prev.is('Comma')) {
            token.value = 'Unary+';
        }
    }

    token.info = Operators[token.value];

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
    }
    else if (opA.precedence === opB.precedence && opA.associativity === 'L') {
        return true;
    }
};
