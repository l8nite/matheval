var _ = require('underscore')._;

var Functions = {};
_.each(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin', 'sqrt', 'tan'], function (func) {
    Functions[func] = Math[func];
});

module.exports.Functions = Functions;
