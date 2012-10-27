var _ = require('underscore')._;

var Constants = {};
_.each(['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'], function(constant) {
    Constants[constant.toLowerCase()] = Math[constant];
});

module.exports.Constants = Constants;
