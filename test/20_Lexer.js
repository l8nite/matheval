var should = require('should');
var _ = require('underscore')._;

var Token = require('../lib/Lexer/Token.js').Token;
var Types = require('../lib/Lexer/Token.js').Types;
var Lexer = require('../lib/Lexer/Lexer.js').Lexer;
var Operators = require('../lib/Operators.js').LexableOperators;

var testLexSingleToken = function(type, value, expression) {
    return function() {
        var l = new Lexer();

        if (expression === undefined) {
            expression = value;
        }

        l.tokenize(expression);
        l.tokens.should.have.length(1);
        l.tokens[0].should.have.property('type', type);
        l.tokens[0].should.have.property('value', value);
    };
};

describe('Lexer', function() {
    describe('#Lexer()', function() {
        it('should construct a new Lexer', function() {
            var l = new Lexer();
            l.should.be.an.instanceof(Lexer);

            l.should.have.property('peek');
            l.peek.should.be.a('function');

            l.should.have.property('next');
            l.next.should.be.a('function');

            l.should.have.property('tokenize');
            l.tokenize.should.be.a('function');

            should.ok(l.hasOwnProperty('expression'));
            should.strictEqual(l.expression, undefined);

            l.should.have.property('index', 0);

            should.ok(l.hasOwnProperty('tokens'));
            should.deepEqual(l.tokens, []);
        });
    });

    describe('#tokenize(expression)', function() {
        _.each(Operators,
            function(operator) {
                it("should tokenize '" + operator + "'",
                    testLexSingleToken(Types.Operator, operator)
                );
            }
        );

        it('should ignore whitespace', testLexSingleToken(Types.Operator, '+', '   +   '));

        _.each(['0', '1', '0.1', '.1', '1e1', '1.1e1', '11', '1.01'], function(number) {
            it("should tokenize '" + number + "'", testLexSingleToken(Types.Number, + number));
        });

        _.each(['_', 'x', '_x', '_X', 'x_', 'X_', 'x1', 'X1', 'x.y', 'X.Y', 'x.Y', 'X.y'], function(symbol) {
            it("should tokenize '" + symbol + "'", testLexSingleToken(Types.Symbol, symbol));
        });

        it('should tokenize left parens', testLexSingleToken(Types.LeftParen, '('));
        it('should tokenize right parens', testLexSingleToken(Types.RightParen, ')'));
        it('should tokenize commas', testLexSingleToken(Types.Comma, ','));

        it('should throw errors on unlexable garbage', function() {
            (function() {
                (new Lexer()).tokenize('05.2');
            }).should.
            throw ();
        });

        it('should tokenize "1+sin(1/f)**3.01e-6"', function () {
            var l = new Lexer('+1+sin(1/f)**3.01e-6');
            l.tokens.should.have.length(11);
        });
    });
});

