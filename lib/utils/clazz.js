'use strict';

var clazzUtil = new function() {
	this.defineProperties = function(fields, fieldNames) {
		var self = this;
		fields = fields || {};
		fieldNames = fieldNames || ['context', 'setting'];
		fieldNames.forEach(function(fieldName) {
			if (typeof(fields[fieldName]) == 'object') {
				Object.defineProperty(self, fieldName, {
				    get: function() { return(fields[fieldName]) },
				    set: function() {}
				  });
			}
		})
	}
};

module.exports = clazzUtil;