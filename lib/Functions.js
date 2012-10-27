var _ = require('underscore')._;

var Functions = {};
_.each(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin', 'sqrt', 'tan'], function(func) {
    Functions[func] = {
        'func': Math[func],
        'argc': 1,
    };
});

// fix up function argument counts
Functions['max'].argc = -1; // variable
Functions['min'].argc = -1; // variable
Functions['random'].argc = 0;
Functions['atan2'].argc = 2;
Functions['pow'].argc = 2;

module.exports.Functions = Functions;
