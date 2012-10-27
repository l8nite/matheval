var _ = require('underscore')._;

var Types = {};
_.each(['Operator', 'LeftParen', 'RightParen', 'Comma', 'Number', 'Symbol', 'Whitespace'], function (type) {
    Types[type] = type;
});

var Token = function(type, value) {
    this.type = undefined;
    this.value = undefined;

    if (_.has(Types, type)) {
        this.type = type;
        this.value = value;
    }
};

Token.prototype.is = function(type, value) {
    if (this.type === undefined) {
        return false;
    }

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

