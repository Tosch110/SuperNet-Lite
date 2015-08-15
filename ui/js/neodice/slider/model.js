function Model () {
	var obj = {};
	var listeners = {};

	this.get = function(key) {
		return obj[key];
	};

	this.set = function(key, val) {
		if (obj[key] == val) {
			return;
		}

		obj[key] = val;

		if (listeners[key]) {
			listeners[key].forEach(function(callback) {
				callback(val);
			});
		}
	};

	this.on = function(key, callback) {
		if (!listeners[key]) {
			listeners[key] = [];
		}

		listeners[key].push(callback);
	};

	this.getProps = function() {
		return obj;
	};

	this.getListeners = function() {
		return listeners;
	};
}
