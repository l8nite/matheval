var should = require('should');

var Token = require('../Token.js').Token;
var Value = require('../Value.js').Value;
var Types = require('../Token.js').Types;

describe('Value', function() {
    describe('#Value()', function() {
        it('should construct a new Token with type Value', function() {
            var v = new Value();
            v.should.be.an.instanceof(Value);
            v.should.be.an.instanceof(Token);
            v.should.have.property('type', Types.Value);
            should.ok(v.hasOwnProperty('value'));
            isNaN(v.value).should.be.ok;
        });

        it('should have NaN as value when given invalid values', function() {
            var v = new Value("not a number");
            isNaN(v.value).should.be.ok;
        });

        it('should have value property', function() {
            var v = new Value(2);
            v.should.have.property('value', 2);
        });

        it('should type-convert values', function() {
            var v = new Value("3");
            v.should.have.property('value', 3);
        });
    });
});
