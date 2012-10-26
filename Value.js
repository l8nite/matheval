var Token = require('./Token.js').Token;
var Types = require('./Token.js').Types;

var Value = function (value) {
    Value.super_.call(this, Types.Value, +value);
};

require('util').inherits(Value, Token);

module.exports.Value = Value;
