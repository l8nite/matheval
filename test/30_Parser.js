var should = require('should');
var _ = require('underscore')._;

var Token = require('../lib/Token.js').Token;
var Types = require('../lib/Token.js').Types;

var Parser = require('../lib/Parser.js').Parser;

describe('Parser', function() {
    describe('#Parser()', function() {
        it('should construct a new Parser', function() {
            var l = new Parser();
            l.should.be.an.instanceof(Parser);

            l.should.have.property('parse');
            l.parse.should.be.a('function');

            should.ok(l.hasOwnProperty('tokens'));
            should.deepEqual(l.tokens, []);
        });
    });

    describe('#tokenize(expression)', function() {
        it('should throw errors on functions with incorrect # of arguments', function() {
            (function() {
                (new Parser()).parse('sin(1,2)');
            }).should.
            throw ();
        });

        it('should parse "1 + 1" to "1 1 +"', function () {
            var p = new Parser('1 + 1');
            var expected = '1 1 +';
            var actual = _.pluck(p.tokens, 'value').join(' ');
            actual.should.equal(expected);
        });

        it('should parse "x = max(a, b, c+d, sin(pi+3))"', function() {
            var p = new Parser('x = max(a, b, c+d, sin(pi+3))');
            var expected = 'x a b c d + pi 3 + 1 sin 4 max =';
            var actual = _.pluck(p.tokens, 'value').join(' ');
            actual.should.equal(expected);
        });

        it('should handle right-associativity of exponentiation', function() {
            var p = new Parser('x**y^z');
            var expected = 'x y z ^ **';
            var actual = _.pluck(p.tokens, 'value').join(' ');
            actual.should.equal(expected);
        });

        it('should handle zero-argument functions', function() {
            var p = new Parser('x = random() * 1');
            var expected = 'x 0 random 1 * =';
            var actual = _.pluck(p.tokens, 'value').join(' ');
            actual.should.equal(expected);
        });
    });
});
