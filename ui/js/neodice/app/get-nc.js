app.pages['getNC'] = function(params) {
	if (params.secretPhrase) {
		app.getNC(params.secretPhrase);
	}
	$btn = $('.btn_buy_nc');
	$btn.off();
	$btn.click(function() {
		if (!app.vars.secretPhrase) {
			app.showLoginModal({ nextPage: 'getNC' });
		} else {
			app.getNC(app.vars.secretPhrase);
		}
	});
};

/* Send NXT to Banker's account, poll for referenced transaction with chips inside */ 
app.getNC = function(secretPhrase) {
	var amount = parseInt($('#amountNXT').val());
	var config = app.config;

	var opts = {
		requestType: 'sendMoney',
		secretPhrase: secretPhrase,
		recipient: config.banker,
		amountNQT: amount * config.NQT,
		deadline: config.deadline,
		feeNQT: config.NQT
	};

	app.callChain(opts, function(err, response) {
		if (err) {
			return;
		}
		app.loadingWindowShow({ text: 'Getting NeoChips.<br/>It&apos;ll take a minute...' });
		app.pollForResult({
			transaction: response,
			success: function(response) {
    		    app.loadingWindowHide();
    		    app.showGetNCResult(response);
    		    app.updateBalance();    		    
			},
			error: function() {
    		    app.loadingWindowHide();
    		    console.error('Error while polling');
			}
		});
	});
};

/* Display modal with acquired NC amount */ 
app.showGetNCResult = function(response) {
  	var message = response.attachment.message;
  	var config = app.config;

	var $popupContent = $('#getNCResultWindow .modal-body');

	var result = parseInt(response.attachment.quantityQNT) > 0? 'You&apos;ve got '+ parseInt(response.attachment.quantityQNT)/config.NQT +' NeoDice chips!': 'Something went wrong, please try again later';

	var balance = new RegExp(/balance after transaction: ([\d.]+)?/gi).exec(message);
	balance = balance[1] || 'n/a';

	$popupContent.find('.result').html(result);
	$popupContent.find('.balance').html(balance);
	$('#getNCResultWindow').modal();
};
