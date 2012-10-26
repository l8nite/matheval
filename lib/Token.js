var _ = require('underscore')._;

var Types = {};
_.each(['Operator', 'Unary+', 'Unary-', '^', '*', '/', '%', '+', '-', '=', '(', ')', ',', 'Number', 'Symbol', 'Variable', 'Constant', 'Function', 'Whitespace'], function (type) {
    Types[type] = type;
});

var Token = function(type, value) {
    this.type = type;
    this.value = value;
};

Token.prototype.isOperator = function () {
    var Operators = require('./Operators.js');

    if (this.type === undefined) {
        return false;
    }

    if (this.type === Types.Operator) {
        return true;
    }

    if (_.contains(Operators.BinaryOperators, this.type)) {
        return true;
    }

    if (_.contains(Operators.UnaryOperators, this.type)) {
        return true;
    }

    return false;
};

Token.prototype.is = function(type, value) {
    if (this.type !== type) {
        return false;
    }

    if (arguments.length > 1 && this.value !== value) {
        return false;
    }

    return true;
};

module.exports.Token = Token;
module.exports.Types = Types;
