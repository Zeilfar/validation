function doCheck(obj, main, errors){
	var hasError = false;

	main.checkers.some(function(checker, i){
		var e = checker(obj);
		if(e){
			errors.push(e);
			hasError = true;
		}
		return hasError;
	});

	if(hasError){
		return ;
	}

	main.fields.forEach(function(field){
		doCheck(obj[field.name], field, errors);
	});
}

function validator(){
	var main = { checkers : [], fields : [] };
	var path = [];
	path.unshift(main);

	var u = {
		field : function(fieldName){
			var newNode = { name: fieldName, checkers : [], fields : [] };
			path[0].fields.push( newNode );
			path.unshift( newNode );
			return u;
		},
		verify : function( checker){
			path[0].checkers.push(checker);
			return u;
		},
		parent : function(){
			path.shift();
			return u;
		},
		check : function(obj){
			var errors =[];
			doCheck(obj, main, errors);
			return errors;
		}
	};

	return u;
}

module.exports = validator;