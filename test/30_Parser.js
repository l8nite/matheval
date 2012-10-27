var should = require('should');
var _ = require('underscore')._;

var Token = require('../lib/Token.js').Token;
var Types = require('../lib/Token.js').Types;

var Parser = require('../lib/Parser.js').Parser;

describe('Parser', function() {
    var parser = new Parser();
    describe('#Parser()', function() {
        it('should construct a new Parser', function() {
            parser = new Parser();
            parser.should.be.an.instanceof(Parser);

            parser.should.have.property('parse');
            parser.parse.should.be.a('function');

            should.ok(parser.hasOwnProperty('tokens'));
            should.deepEqual(parser.tokens, []);
        });
    });

    describe('#tokenize(expression)', function() {
        it('should throw errors on functions with incorrect # of arguments', function() {
            (function() {
                parser.parse('sin(1,2)');
            }).should.
            throw ();
        });

        var validParses = {
            '1 + 1': '1 1 +',
            'x = max(a, b, c+d, sin(pi+3))': 'x a b c d + pi 3 + 1 sin 4 max =',
            'x**y^z': 'x y z ^ **',
            'x = random() * 1': 'x 0 random 1 * =',
            '-1 + -max(-1, -2)': '1 Unary- 1 Unary- 2 Unary- 2 max Unary- +',
        };

        _.each(validParses, function(value, key) {
            it('should parse "' + key + '" -> "' + value + '"', function () {
                parser.parse(key);
                var expected = value;
                var actual = _.pluck(parser.tokens, 'value').join(' ');
                actual.should.equal(expected);
            });
        });
    });
});
