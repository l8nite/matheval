// the Variables object is used to get/set variables for the equation
// supply your own by inheriting this and overriding load/save or get

var Variables = function() {
    Variables.super_.call(this);
    this.variables = {};
};

require('util').inherits(Variables, Object);

Variables.prototype.load = function(doneLoading) {
    doneLoading();
};

Variables.prototype.save = function(doneSaving) {
    doneSaving();
};

Variables.prototype.get = function(key) {
    if (this.has(key)) {
        return this.variables[key];
    }

    return undefined;
};

Variables.prototype.set = function(key, value) {
    this.variables[key] = value;
};

Variables.prototype.has = function(key) {
    return this.variables.hasOwnProperty(key);
};

module.exports.Variables = Variables;
