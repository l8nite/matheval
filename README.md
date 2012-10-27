_matheval_ is a node.js library that evaluates simple math expressions.
Supports variables, parentheses, basic functions.

## Example

    var matheval = require('matheval');

    matheval.evaluate('x = 1', console.log); // prints 1
    matheval.evaluate('x + 1', console.log); // prints 2

## Installation

    $ npm install matheval

## Notes
evaluate() calls are queued and processed in order

You can override Variables.js to supply your own variables
(for example, you can load them from a database or something)

    var matheval = require('matheval');

    var MyVars = function () {
    };

    require('util').inherits(MyVars, matheval.Variables);

    MyVars.prototype.load = function (doneLoading) {
        // populate this.variables hash
        doneLoading();
    };

    MyVars.prototype.save = function (doneSaving) {
        // save this.variables hash
        doneSaving();
    };

unary minus is higher precedence than exponentiation, so -1**-2 === (-1)**(-2), not -(1**(-2))

## Testing

The tests rely on [mocha](http://visionmedia.github.com/mocha/) and [should](https://github.com/visionmedia/should.js/)

To run them:

    $ mocha

