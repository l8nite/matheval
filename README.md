_matheval_ is a node.js library that evaluates simple math expressions.
Supports variables, parentheses, basic functions.

## Example

    var matheval = require('matheval');
    var context = new matheval.Context();

    matheval.evaluate('x = 1', console.log); // prints 1
    matheval.evaluate('x + 1', console.log); // prints 2

## Installation

    $ npm install matheval
