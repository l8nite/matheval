var should = require('should');
var _ = require('underscore')._;
var Token = require('../lib/Token.js').Token;
var Types = require('../lib/Token.js').Types;

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
        var t = new Token(Types.Number, 3);
        t.is().should.be.false;
        t.is(Types.Operator).should.be.false;
        t.is(Types.Number).should.be.true;
        t.is(Types.Number, 4).should.be.false;
        t.is(Types.Number, 3).should.be.true;
        t.is(Types.Number, "3").should.be.false;
    });
});

describe('Types', function() {
    it('should contain the right enumerated values', function() {
        _.keys(Types).should.have.length(10);
        var types = ['Operator', 'LeftParen', 'RightParen', 'Comma', 'Number', 'Symbol', 'Variable', 'Function', 'Constant', 'Whitespace'];
        _.each(types, function(t) {
            Types.should.have.property(t, t);
        });
    });

    it('should allow strict comparison of enumerated values', function() {
        should.notStrictEqual(Types.Operator, Types.Number);
        should.strictEqual(Types.Operator, Types.Operator);
    });
});
