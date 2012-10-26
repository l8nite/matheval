var _ = require('underscore')._;

var BinaryOperators = {
    '^': {
        operator: '^',
        precedence: 40,
        associativity: 'R',
        apply: function(L, R) {
            return Math.pow(L, R);
        }
    },
    '*': {
        operator: '*',
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L * R;
        }
    },
    '/': {
        operator: '/',
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L / R;
        }
    },
    '%': {
        operator: '%',
        precedence: 30,
        associativity: 'L',
        apply: function(L, R) {
            return L % R;
        }
    },
    '+': {
        operator: '+',
        precedence: 20,
        associativity: 'L',
        apply: function(L, R) {
            return L + R;
        }
    },
    '-': {
        operator: '-',
        precedence: 20,
        associativity: 'L',
        apply: function(L, R) {
            return L - R;
        }
    },
    '=': {
        operator: '=',
        precedence: 10,
        associativity: 'R',
        apply: function() {
            throw new Error();
        }
    },
};

var UnaryOperators = {
    '+': {
        operator: '+',
        precedence: 50,
        associativity: 'R',
        apply: function(R) {
            return R;
        }
    },
    '-': {
        operator: '-',
        precedence: 50,
        associativity: 'R',
        apply: function(R) {
            return -R;
        }
    }
};

module.exports.BinaryOperators = BinaryOperators;
module.exports.UnaryOperators = UnaryOperators;
