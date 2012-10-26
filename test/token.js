var should = require('should');
var _ = require('underscore')._;
var Token = require('../Token.js').Token;
var Types = require('../Token.js').Types;

describe('Token', function() {
    describe('#Token()', function() {
        it('should construct a new Token with undefined type and value by default', function() {
            var t = new Token();
            t.should.be.an.instanceof(Token);
            //t.should.have.property('type', undefined);
            //t.should.have.property('value', undefined);
            should.ok(t.hasOwnProperty('type'), 'has type property');
            should.strictEqual(t.type, undefined);
            should.ok(t.hasOwnProperty('value'), 'has value property');
            should.strictEqual(t.value, undefined);
        });

        it('should construct a new Token with undefined type and value when given an invalid type', function() {
            var t = new Token('Invalid input', 5);
            t.should.be.an.instanceof(Token);
            //t.should.have.property('type', undefined);
            //t.should.have.property('value', undefined);
            should.ok(t.hasOwnProperty('type'));
            should.strictEqual(t.type, undefined);
            should.ok(t.hasOwnProperty('value'));
            should.strictEqual(t.value, undefined);
        });

        it('should construct a new Token with given type and undefined value', function() {
            var t = new Token(Types.Operator);
            t.should.be.an.instanceof(Token);
            t.should.have.property('type', Types.Operator);
            //t.should.have.property('value', undefined);
            should.ok(t.hasOwnProperty('value'));
            should.strictEqual(t.value, undefined);
        });

        it('should construct a new Token with given type and value', function() {
            var t = new Token(Types.Operator, '+');
            t.should.be.an.instanceof(Token);
            t.should.have.property('type', Types.Operator);
            t.should.have.property('value', '+');
        });
    });

    describe('#is()', function() {
        var t = new Token(Types.Value, 3);
        t.is().should.be.false;
        t.is(Types.Operator).should.be.false;
        t.is(Types.Value).should.be.true;
        t.is(Types.Value, 4).should.be.false;
        t.is(Types.Value, 3).should.be.true;
        t.is(Types.Value, "3").should.be.false;
    });
});

describe('Types', function() {
    describe('#symbols()', function() {
        it('should contain the right enumerated values', function () {
            Types.symbols().should.have.length(8);
            Types.symbols().should.eql(_.map(['Operator', 'Value', 'Symbol', '(', ')', ',', 'Function', 'Unary-'], function(x) {
                return new Symbol(x);
            }));
        });
    });

    describe('type safety', function() {
        it('should allow strict comparison of enumerated values', function () {
            should.notStrictEqual(Types.Operator, Types.Number);
            should.strictEqual(Types.Operator, Types.Operator);
        });
    });
});
