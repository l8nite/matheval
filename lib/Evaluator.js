var Parser = require('./Parser.js').Parser;

var T = require('./Token.js');
var Token = T.Token;
var Types = T.Types;

var Variables = require('./Variables.js').Variables;

var Evaluator = function(expression, variables) {
    this.evaluate(expression);
    this.variables = variables === undefined ? new Variables() : variables;
};

Evaluator.prototype.evaluate = function(expression, variables) {
    if (typeof expression === 'undefined' || !expression || !expression.length || /^\s*$/.test(expression)) {
        this.result = undefined;
    }
    else {
        if (variables !== undefined) {
            this.variables = variables;
        }
        this.parser = new Parser(expression);
        this.result = this.evaluateRPN();
    }

    return this.result;
};

module.exports.Evaluator = Evaluator;


Evaluator.prototype.evaluateRPN = function() {
    this.stack = [];

    var tokens = this.parser.tokens;
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        this['process' + token.type].call(this, token);
    }

    if (this.stack.length != 1) {
        throw new SyntaxError('Error evaluating expression');
    }

    return this.popAndResolve()[0];
};


Evaluator.prototype.pushNumber = function(number) {
    this.stack.push(new Token(Types.Number, number));
};

Evaluator.prototype.pushToken = function(token) {
    this.stack.push(token);
};

Evaluator.prototype.processNumber = Evaluator.prototype.pushToken;
Evaluator.prototype.processConstant = Evaluator.prototype.pushToken;
Evaluator.prototype.processVariable = Evaluator.prototype.pushToken;

Evaluator.prototype.processFunction = function(token) {
    var argc = this.stack.pop().value;
    var args = this.popAndResolve(argc).reverse();
    this.pushNumber(token.info.func.apply(null, args));
};

Evaluator.prototype.processOperator = function(token) {
    var info = token.info;

    // special-case for '=', since we don't want to popAndResolve the LHS
    if (info.operator === '=') {
        var R = (this.popAndResolve())[0];
        var L = this.stack.pop();

        if (L.isnt('Variable')) {
            throw new SyntaxError('Invalid LHS in assignment');
        }

        this.variables.set(L.value, R);
        this.pushNumber(R);
        return;
    }

    var opct = info.operands;
    var args = this.popAndResolve(opct).reverse();

    this.pushNumber(info.perform.apply(null, args));
};

// pops a numeric, constant, or variable token off the stack stack and
// attempts to resolve the value (if constant or variable) before returning
// takes optional count parameter for # of stack to pop
Evaluator.prototype.popAndResolve = function(cnt) {
    var count = cnt === undefined ? 1 : cnt;

    if (this.stack.length < count) {
        debugger;
        throw new SyntaxError('not enough operands');
    }

    var results = [];

    while (count > 0) {
        var token = this.stack.pop();
        if (token.is('Number')) {
            results.push(token.value);
        }
        else if (token.is('Constant')) {
            results.push(token.info);
        }
        else if (token.is('Variable')) {
            var key = token.value;
            if (!this.variables.has(key)) {
                throw new SyntaxError(key + ': undefined variable');
            }
            results.push(this.variables.get(key));
        }

        count--;
    }

    return results;
};
