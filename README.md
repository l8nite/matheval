_matheval_ is a node.js library that evaluates simple math expressions.
Supports variables, parentheses, basic functions.

## Example

    var evaluate = require('matheval').evaluate;

    evaluate('x = 1', console.log); // prints 1
    evaluate('x + 1', console.log); // prints 2

## Installation

    $ npm install matheval

## Variables
You can override Variables.js to supply your own variables (for example, you can load them from a database or something)

    var evaluate = require('./matheval.js').evaluate;
    var Variables = require('./matheval.js').Variables;

    var v = new Variables();

    evaluate('x = 1', v, function(result) {
        console.log(result);
        evaluate('x + 1', v, console.log);
    });

## Notes

unary minus is higher precedence than exponentiation, so -1**-2 === (-1)**(-2), not -(1**(-2))

exponentiation is right-associative, so 3**3**3 is 3**27, not 9**3

## Testing

The tests rely on [mocha](http://visionmedia.github.com/mocha/) and [should](https://github.com/visionmedia/should.js/)

To run them:

    $ npm test

