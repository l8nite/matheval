var _ = require('underscore')._;
var Token = require('./Token.js').Token;
var Types = require('./Token.js').Types;

var Operators = [ '^', '*', '/', '%', '+', '-' ];

var Operator = function (operator) {
    if (!_.contains(Operators, operator)) {
        operator = undefined;
    }

    Operator.super_.call(this, Types.Operator, operator);
};

require('util').inherits(Operator, Token);

module.exports.Operator = Operator;
module.exports.Operators = Operators;
