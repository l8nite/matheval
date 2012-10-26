var should = require('should');

var Token = require('../Token.js').Token;
var Types = require('../Token.js').Types;
var lalue = require('../Value.js').Value;
var Lexer = require('../Lexer.js').Lexer;
var Operator = require('../Operator.js').Operator;
var Operators = require('../Operator.js').Operators;

describe('Lexer', function() {
    describe('#Lexer()', function() {
        it('should construct a new Lexer', function() {
            var l = new Lexer();
            l.should.be.an.instanceof(Lexer);

            l.should.have.property('peek');
            l.peek.should.be.a('function');

            l.should.have.property('next');
            l.next.should.be.a('function');

            l.should.have.property('toke');
            l.toke.should.be.a('function');

            should.ok(l.hasOwnProperty('expression'));
            should.strictEqual(l.expression, undefined);

            l.should.have.property('index', 0);
            should.ok(l.hasOwnProperty('tokens'));
            should.deepEqual(l.tokens, []);
        });
    });

    describe('#toke(expression)', function() {
        it('should tokenize operators', function () {
            _.each(Operators, function (operator) {
                testLexSingleToken(Types.Operator, operator);
            });
        });

        it('should ignore whitespace', function () {
            testLexSingleToken(Types.Operator, '+', '   +   ');
        });

        it('should tokenize numbers', function () {
            _.each(['0', '1', '0.1', '.1', '1e1', '1.1e1', '11', '1.01'], function (number) {
                testLexSingleToken(Types.Value, +number);
            });
        });

        it('should tokenize symbols', function () {
            _.each(['_', 'x', '_x', '_X', 'x_', 'X_', 'x1', 'X1', 'x.y', 'X.Y', 'x.Y', 'X.y'], function (symbol) {
                testLexSingleToken(Types.Symbol, symbol);
            });
        });

        it('should tokenize constants', function () {
            testLexSingleToken(Types.Symbol, Math.PI, 'pi');
        });

        it('should tokenize parens and commas', function () {
            testLexSingleToken(Types['('], '(');
            testLexSingleToken(Types[')'], ')');
            testLexSingleToken(Types[','], ',');
        });
    });
});

var testLexSingleToken = function (type, value, expression) {
    var l = new Lexer();
    l.toke(expression || "" + value);
    l.tokens.should.have.length(1);
    l.tokens[0].should.have.property('type', type);
    l.tokens[0].should.have.property('value', value);
};
