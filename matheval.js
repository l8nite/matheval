var Evaluator = require('./lib/Evaluator.js').Evaluator;
var Variables = require('./lib/Variables.js').Variables;

module.exports.Variables = Variables;
module.exports.Evaluator = Evaluator;

var _evaluator = new Evaluator();
var _variables = new Variables();

module.exports.evaluate = function(expression) {
    var callback;
    var variables;

    if (arguments.length === 2) {
        if (typeof arguments[1] === 'function') {
            callback = arguments[1];
            variables = _variables;
        }
        else {
            variables = arguments[1];
            callback = undefined;
        }
    }
    else if (arguments.length === 3) {
        variables = arguments[1];
        callback = arguments[2];
    }

    if (callback !== undefined && typeof variables.load === 'function') {
        variables.load(function doneLoading() {
            var result = _evaluator.evaluate(expression, variables);
            if (typeof variables.save === 'function') {
                variables.save(function doneSaving() {
                    callback(result);
                });
            }
            else {
                callback(result);
            }
        });
    }
    else if (callback !== undefined) {
        var result = _evaluator.evaluate(expression, variables);
        callback(result);
        return result;
    }
    else {
        var result = _evaluator.evaluate(expression, variables);
        return result;
    }
};
