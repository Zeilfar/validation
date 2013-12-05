"use strict";

function doCheck(path, obj, main, errors) {
	var hasError = false;

	main.checkers.some(function (checker, i) {
		var error = checker(path, obj);
		if (error) {
			errors.push(error);
			hasError = true;
		}
		return hasError;
	});

	if (hasError) {
		return;
	}

	main.fields.forEach(function (field) {
		var p = path;
		if (p !== "") {
			p += ".";
		}
		p += field.name;
		doCheck(p, obj[field.name], field, errors);
	});
}

function validator() {
	var main = {
		checkers : [],
		fields : []
	};
	var path = [];
	path.unshift(main);

	return {
		field : function (fieldName) {
			var newNode = { name: fieldName, checkers : [], fields : [] };
			path[0].fields.push(newNode);
			path.unshift(newNode);
			return this;
		},
		verify : function (checker) {
			path[0].checkers.push(checker);
			return this;
		},
		parent : function () {
			path.shift();
			return this;
		},
		check : function (obj) {
			var errors = [];
			doCheck("", obj, main, errors);
			return errors;
		}
	};
}

module.exports = validator;
