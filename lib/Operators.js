var _ = require('underscore')._;

var Operators = {
    '**': {
        operator: '**',
        operands: 2,
        precedence: 40,
        associativity: 'R',
        apply: function(L, R) {
            return Math.pow(L, R);
        }
    },
    '^': {
        operator: '^',
        operands: 2,
        precedence: 40,
        associativity: 'R',
        apply: function(L, R) {
            return Math.pow(L, R);
        }
    },
    '*': {
        operator: '*',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L * R;
        }
    },
    '/': {
        operator: '/',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L / R;
        }
    },
    '%': {
        operator: '%',
        operands: 2,
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L % R;
        }
    },
    '+': {
        operator: '+',
        operands: 2,
        precedence: 20,
        associativity: 'L',
        apply: function(L, R) {
            return L + R;
        }
    },
    '-': {
        operator: '-',
        operands: 2,
        precedence: 20,
        associativity: 'L',
        apply: function(L, R) {
            return L - R;
        }
    },
    '=': {
        operator: '=',
        operands: 2,
        precedence: 10,
        associativity: 'R',
        apply: function() {
            throw new Error();
        }
    },
    'Unary+': {
        operator: '+',
        operands: 1,
        precedence: 50,
        associativity: 'R',
        apply: function(R) {
            return R;
        }
    },
    'Unary-': {
        operator: '-',
        operands: 1,
        precedence: 50,
        associativity: 'R',
        apply: function(R) {
            return -R;
        }
    }
};

module.exports.Operators = Operators;

// the Operators table stores a "special" operator for Unary +/-
// but we don't want to lex the actual token "Unary-" or "Unary+"
var LexableOperators = _.reject(_.keys(Operators), function (key) {
    return key === 'Unary-' || key === 'Unary+';
});

module.exports.LexableOperators = LexableOperators;
