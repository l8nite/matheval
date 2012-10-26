var should = require('should');

var Token = require('../Token.js').Token;
var Operator = require('../Operator.js').Operator;
var Types = require('../Token.js').Types;

describe('Operator', function() {
    describe('#Operator()', function() {
        it('should construct a new Token with type Operator', function() {
            var o = new Operator();
            o.should.be.an.instanceof(Operator);
            o.should.be.an.instanceof(Token);
            o.should.have.property('type', Types.Operator);
            should.ok(o.hasOwnProperty('value'));
            should.strictEqual(o.value, undefined);
        });

        it('should have undefined value when given invalid values', function() {
            var o = new Operator("not a number");
            should.strictEqual(o.value, undefined);
        });

        it('should have value property', function() {
            var o = new Operator('+');
            o.should.have.property('value', '+');
        });
    });
});
