function removeElementFromArray(element, array, field) {
	
	var comparisonFunc = function () {
		if (typeof(field) != "undefined") {
			return function(element, arrayElement, field) {
				if (element[field] == arrayElement[field]) {
					return true;
				}	
			}
		}
		else {
			return function(element, arrayElement, field) {
				if (element == arrayElement) {
					return true;
				}	
			}
		}
		
	}();


	for (var i = 0; i < array.length; i++) {
		var splice = comparisonFunc(element, array[i], field);
		
		if (splice) {
			array.splice(i, 1);
			return true;
		}
	}
	
}

function countElementInArray(element, array, field) {
	var comparisonFunc = function () {
		if (typeof(field) != "undefined") {
			return function(element, arrayElement, field) {
				if (element[field] == arrayElement[field]) {
					return true;
				}	
			}
		}
		else {
			return function(element, arrayElement, field) {
				if (element == arrayElement) {
					return true;
				}	
			}
		}
		
	}();

	var count = 0;
	for (var i = 0; i < array.length; i++) {
		var doCount = comparisonFunc(element, array[i], field);
		
		if (doCount) {
			count += 1;
		}
	}

	return count;

}

function getElementFromArray(element, array, field) {
	var comparisonFunc = function () {
		if (typeof(field) != "undefined") {
			return function(element, arrayElement, field) {
				if (element[field] == arrayElement[field]) {
					return true;
				}	
			}
		}
		else {
			return function(element, arrayElement, field) {
				if (element == arrayElement) {
					return true;
				}	
			}
		}
		
	}();

	var obj = {
		bool: false,
		data: {}
	}
	for (var i = 0; i < array.length; i++) {
		var isFound = comparisonFunc(element, array[i], field);
		
		if (isFound) {
			obj.bool = true;
			obj.data = element;
		}
	}

	return obj;
}

function searchArrayForElement(key, array, field) {
	var comparisonFunc = function () {
		if (typeof(field) != "undefined") {
			return function(key, arrayElement, field) {
				if (key == arrayElement[field]) {
					return true;
				}	
			}
		}
		else {
			return function(key, arrayElement, field) {
				if (key == arrayElement) {
					return true;
				}	
			}
		}
		
	}();

	var obj = {
		bool: false,
		data: {}
	}
	for (var i = 0; i < array.length; i++) {
		var thisEl = array[i];
		var isFound = comparisonFunc(key, thisEl, field);
		
		if (isFound) {
			obj.bool = true;
			obj.data = thisEl;
		}
	}

	return obj;
}

function retrieveFieldFromObjectArray(key, array) {

	var arr = [];

	if (array instanceof Array) {
		
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			if (obj) {
				var string = obj[key];
				arr.push(string);	
			}
			
		}
	}

	return arr;
}