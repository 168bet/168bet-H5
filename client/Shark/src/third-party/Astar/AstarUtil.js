function partial(caller,fn) {
	var
		slice = Array.prototype.slice,
		args = slice.call(arguments, 2)
		;

	return function () {
		return fn.apply( caller, args.concat( slice.call(arguments) ) );
	};
}

function forEach(caller,func, array) {
	for (var i = 0; i < array.length; i += 1) {
		func.call(caller,array[i]);
	}
}

function map(caller,func, array) {
	var result = [];
	forEach(caller,function (el) {
		result.push( func.call(caller,el) );
	}, array);
	return result;
}

function filter(caller,func, array) {
	var resultArray = [];

	for (var i = 0; i < array.length; i += 1) {
		if (func.call(caller,array[i])) {
			resultArray.push(array[i]);
		}
	}

	return resultArray;
}

function every(caller,func, array) {

	for (var i = 0; i < array.length; i += 1) {
		if ( !( func.call(caller,array[i]) ) ) {
			return false;
		}
	}

	return true;
}

function any(caller,func, array) {

	for (var i = 0; i < array.length; i += 1) {
		if ( func.call(caller,array[i]) ) {
			return true;
		}
	}

	return false;
}

function flatten(caller,arrays) {
	var result = [];

	forEach(caller,function (el) {
		forEach(caller, function (el) {
			result.push(el);
		}, el );
	}, arrays);

	return result;
}

var BinaryHeap = function (scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
};

BinaryHeap.prototype = {
	push: function (what) {
		this.content.push(what);
		this.bubbleUp(this.content.length - 1);
	},
	pop: function () {
		var
			result = this.content[0],
			end = this.content.pop()
			;
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	},
	remove: function (elem) {
		var max = this.content.length;
		for (var i = 0; i < max; i += 1) {
			if (this.content[i] === elem) {
				var end = this.content.pop();
				if (i !== max - 1) {
					this.content[i] = end;
					if (scoreFunction(end) < scoreFunction(elem)) {
						this.bubbleUp(i);
					}
					else {
						this.sinkdown(i);
					}
				}
				return;
			}
		}
		throw new Error("Node not found.");
	},
	getSize: function () {
		return this.content.length;
	},
	bubbleUp: function (n) {
		var element = this.content[n];

		while (n > 0) {
			var
				parentIndex = Math.floor((n + 1) / 2) - 1,
				parent = this.content[parentIndex]
				;

			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentIndex] = element;
				this.content[n] = parent;

				n = parentIndex;
			}
			else {
				break;
			}
		}
	},
	sinkDown: function (n) {
		var
			element = this.content[n],
			elementScore = this.scoreFunction(element),
			max = this.content.length
			;

		while (true) {
			var
				indexChild2N = (n + 1) * 2,
				indexChildN = indexChild2N - 1
				;

			var swap = null;

			if (indexChildN < max) {
				var
					childN = this.content[indexChildN],
					childNScore = this.scoreFunction(childN)
					;

				if (elementScore > childNScore) {
					swap = indexChildN;
				}
			}
			if (indexChild2N < max) {
				var
					child2N = this.content[indexChild2N],
					child2NScore = this.scoreFunction(child2N)
					;

				if (child2NScore < (swap === null ? elementScore : childNScore)) {
					swap = indexChild2N;
				}
			}

			if (swap !== null) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}
			else {
				break;
			}
		}
	},

	clear:function(){
		this.content = [];
		this.scoreFunction = null;
	}
};