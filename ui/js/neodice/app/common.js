/* Show div with corresponding ID and call its controller */ 
app.showPage = function(page, params) {
	$('.page').hide();
	var $activePage = $('#page-' + page);
	$activePage.show();	
	if (!app.pages[page]) {
		console.error('Page %s is not defined', page);
		return;
	}
	app.pages[page](params);

	$("#spn_neodice_page").show();
};

/* Get user account from NRS config */
app.getUserAccount = function() {
	if (app.vars.debug) {
		return '11752402018584872999';
	}
    return NRS.account;
};

/* Poll chain till test callback return true or exceed maxTries */ 
app.pollForResult = function(options) {

	var opts = options.options || {}, tries = 0, maxTries = 600, interval = 1000;

    opts.requestType = options.requestType || 'getUnconfirmedTransactions';
	opts.account = options.account || app.getUserAccount();
	opts.transaction = options.transaction;

	if (app.vars.debug) {
		console.log('POST_TEST', opts);
		return Utils.mockServerData(opts, opts.success);
	}

	var defaultTest = function(pollResponse) {
		if (pollResponse) {
			return _.find(pollResponse.unconfirmedTransactions, function(tx) {
				return tx.referencedTransactionFullHash === opts.transaction.fullHash;
			}); 
		}
		else 
			return false;
	};

	var testFn = options.test || defaultTest;

	var poll = app.callChain.bind(null, opts, function(err, response) {
		tries++;
		if (err || tries > maxTries || testFn(response)) {
			clearInterval(timer);
		}
		if (tries > maxTries) {
			options.error('maxTries exceed');
		}
		if (testFn(response)) {
			var tx = testFn(response);

			if (tx && tx.attachment && tx.attachment.message) {
				var $rightPage = $('.page-details .content');
				$rightPage.find('.slider-comments').hide();
				$rightPage.find('.response').html(app.nl2br(tx.attachment.message)).show();
			}

			options.success(tx);
		}
	});	

	var timer = setInterval(poll, interval); 
};

/* Convert newlines to BRs */
app.nl2br = function(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

/* Initialize top navigation */
app.initNavigation = function() {
	var links = $('.neodice.nav a');
	links.click(function() {
		var link = $(this);
		var url = link.data('url');
		links.removeClass('active_a_btn');
		link.addClass('active_a_btn');
		var preventAbout = url.indexOf('about') === -1;
		if (preventAbout) {
			app.showPage(url, { rerender: true });
		}
	});
};

/* Call NXT API */
app.callChain = function(options, callback) {
	if (app.vars.debug) {
		console.log('POST_TEST', options);
		return Utils.mockServerData(options, callback);
	}
	var config = app.config;

	if (options.account && typeof options.account !='string') {
		console.error('Wrong account id in chain call (%s)', options.account);
	}
	if (app.vars.debug) {
		console.log('POST:/', options);
    }
	$.ajax({
		url: config.apiUrl,
		type: 'POST',
		data: options,
		success: function(responseText, status, request) {
			var data = JSON.parse(responseText), error;
			if (data.errorCode && data.errorCode > 0) {
				error = data.errorCode;
				//	            console.error('Chain error', error);
			}
			if (typeof data == 'string') {
				data = JSON.parse(data);
			}
			callback(error, data);
		}, error: function(err) {
			callback(err);
		}
	});
};

app.loadingWindowShow = function(opts) {
	$modal = $('#loadingWindow');
	$modal.find('.modal-body').html(opts.text);
	$modal.modal();
};

app.loadingWindowHide = function() {
	$('#loadingWindow').modal('hide');
};

app.warningWindowShow = function(opts) {
	$modal = $('#warningWindow');
	$modal.find('.modal-body').html(opts.text);
	$modal.modal();
};

app.updateBalance = function() {
	var config = app.config, balance = 0, text = '';
	app.callChain({
		requestType: 'getAccount',
		account: app.getUserAccount()
	}, function(err, response) {
		if (err) {
			return;
		}
		var pluckBalance = function(array, field) {
			var pluck = _.find(array, { asset: config.chipsAssetId });
			var value = pluck? parseInt(pluck[field]) / config.chipNQT: 0;
			var precise = 100000000;
			return parseInt(value*precise)/precise;
		};
		if (response.assetBalances) {
			var confirmed = pluckBalance(response.assetBalances, 'balanceQNT');
			var unconfirmed = pluckBalance(response.unconfirmedAssetBalances, 'unconfirmedBalanceQNT');
			balance = afterFloatPoint(confirmed, 2);
			text = 'NeoDICE chips';
		} else {
			text = 'n/a';
		}
/*
		if (unconfirmed == 0) {
			balance = confirmed;
		} else {
			balance = confirmed + ' (+' + (unconfirmed - confirmed) + ')';
		}
*/		var nav = $('.neodice.nav');
		nav.find('.amount').html(balance);
		nav.find('.color_blue').html(text);
	});
};

app.validateInputs = function() {
	$('.clear_a').numeric();
};

app.validateOptions = function(options) {
    return _.every(_.values(options)); // all values of the dictionary are not-empty
}
