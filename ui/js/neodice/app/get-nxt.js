app.pages['getNXT'] = function(params) {
	if (params.secretPhrase) {
		app.getNXT(params.secretPhrase);
	}
	$btn = $('.btn_get_nxt');
	$btn.off;
	$btn.click(function() {
		if (!app.vars.secretPhrase) {
			app.showLoginModal({ nextPage: 'getNXT' });
		} else {
			app.getNXT(app.vars.secretPhrase);
		}
	});
};

/* Send NXT to Banker's account, poll for referenced transaction with chips inside */ 
app.getNXT = function(secretPhrase) {
	var amount = parseInt($('#amountNC').val());
	var config = app.config;

	var opts = {
		requestType: 'transferAsset',
		asset: config.chipsAssetId,
		secretPhrase: secretPhrase,
		recipient: config.banker,
		quantityQNT: amount * config.chipNQT,
		deadline: config.deadline,
		feeNQT: config.NQT
	};

	app.callChain(opts, function(err, response) {
		if (err) {
			return;
		}
		app.loadingWindowShow({ text: 'Getting NXT.<br/>It&apos;ll take a minute...' });
		app.pollForResult({
			transaction: response,
			success: function(response) {
    		    app.loadingWindowHide();
    		    app.showGetNXTResult(response);
    		    app.updateBalance();    		    
			},
			error: function() {
    		    app.loadingWindowHide();
    		    console.error('Error while polling');
			}
		});
	});
}

/* Display modal with acquired NXT amount */ 
app.showGetNXTResult = function(response) {
  	var message = response.attachment.message;
  	var config = app.config;

	var $popupContent = $('#getNXTResultWindow .modal-body');

	var amount = parseInt(response.amountNQT) / config.NQT;
	var result = amount > 0? 'You&apos;ve got '+ amount +' NXT!': 'Something went wrong, please try again later';

	var balance = new RegExp(/balance after transaction: ([\d.]+)?/gi).exec(message);
	balance = balance[1] || 'n/a'

	$popupContent.find('.result').html(result);
	$popupContent.find('.balance').html(balance);
	$('#getNXTResultWindow').modal();
};


$('.page').find('.inc').click(function() {
	var input = $(this).siblings('.clear_a');
	var value = parseInt(input.val());
	value++;
	input.val(value);
});

$('.page').find('.dec').click(function() {
	var input = $(this).siblings('.clear_a');
	var value = parseInt(input.val());
	value--;
	input.val(value);
});