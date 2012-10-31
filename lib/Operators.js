var _ = require('underscore')._;

var Operators = {
    '**': {
        operator: '**',
        operands: 2,
        precedence: 40,
        associativity: 'R',
        perform: function(L, R) {
            return Math.pow(L, R);
        }
    },
    '^': {
        operator: '^',
        operands: 2,
        precedence: 40,
        associativity: 'R',
        perform: function(L, R) {
            return Math.pow(L, R);
        }
    },
    '*': {
        operator: '*',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        perform: function(L, R) {
            return L * R;
        }
    },
    '/': {
        operator: '/',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        perform: function(L, R) {
            if (R === 0) {
                throw new SyntaxError("illegal division by zero");
            }
            return L / R;
        }
    },
    '%': {
        operator: '%',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        perform: function(L, R) {
            if (R === 0) {
                throw new SyntaxError("illegal modulo zero");
            }
            return ((L%R)+R)%R; // bug in javascript if L is negative
        }
    },
    '+': {
        operator: '+',
        operands: 2,
        precedence: 20,
        associativity: 'L',
        perform: function(L, R) {
            return Number(L) + Number(R);
        }
    },
    '-': {
        operator: '-',
        operands: 2,
        precedence: 20,
        associativity: 'L',
        perform: function(L, R) {
            return L - R;
        }
    },
    '=': {
        operator: '=',
        operands: 2,
        precedence: 10,
        associativity: 'R',
        perform: function() {
            throw new Error();
        }
    },
    'Unary+': {
        operator: '+',
        operands: 1,
        precedence: 50,
        associativity: 'R',
        perform: function(R) {
            return R;
        }
    },
    'Unary-': {
        operator: '-',
        operands: 1,
        precedence: 50,
        associativity: 'R',
        perform: function(R) {
            return -R;
        }
    }
};

module.exports.Operators = Operators;

// the Operators table stores a "special" operator for Unary +/-
// but we don't want to lex the actual token "Unary-" or "Unary+"
var LexableOperators = _.reject(_.keys(Operators), function(key) {
    return key === 'Unary-' || key === 'Unary+';
});

module.exports.LexableOperators = LexableOperators;
