app.pages['gamble'] = function(params) {

	if ($('.slideWrapper1 div').length == 0) {
		sliderInit();
	}

	if (params.secretPhrase) {
		app.gamble(params.secretPhrase);		
	}

	$btn = $('.btn_roll');
	$btn.off();
	$btn.click(function() {
		if (!app.vars.secretPhrase) {
			app.showLoginModal({ nextPage: 'gamble' });
		} else {
			app.gamble(app.vars.secretPhrase);
		}
	});
};

/* Take bet size and odds, send API call, poll for result */ 
app.gamble = function(secretPhrase) {

	var $rightPage = $('.page-details .content');
	$rightPage.show();
	$rightPage.find('.response').hide();
	$rightPage.find('.slider-comments').show();

	var amount = $('#betSize').val();
	var odds = $('.oddSize').val(); 
	var config = app.config;

	var opts = {
		requestType: 'transferAsset',
		secretPhrase: secretPhrase,
		recipient: config.banker,
		quantityQNT: amount * config.chipNQT,
		deadline: config.deadline,
		feeNQT: config.NQT,
		asset: config.chipsAssetId,
		messageToEncrypt: odds,
		messageToEncryptIsText: true
	};

	if (app.validateOptions() === false) {
		console.error('Cannod send, one or several options are empty or of invalid format', opts);
	}

	app.callChain(opts, function(err, response) {
		if (err) {
			var error = response.errorDescription || 'Unknown error';
			app.warningWindowShow({
				text: error
			});
			return;
		}
    	app.loadingWindowShow({ text: 'Rolling NeoDice<br/>It might take a minute...' });
		app.pollForResult({
			transaction: response,
			success: function(response) {
	            app.loadingWindowHide();
    		    app.showBetResults(response);
    		    app.updateBalance();
			},
			error: function() {
	            app.loadingWindowHide();
    		    console.error('Error while polling');
			}/*,
			test: function() {
				return 'testHash_jadkflkadjfkladkjaldkjldkgjakdjg';
			}*/
		});
	});

};

/* Display modal with bet result based on transaction's message */ 
app.showBetResults = function(response) {
  	var message = response.attachment.message;
	var $popupContent = $('#betResultWindow .modal-body');

	var luckyNumber = new RegExp(/Lucky Number: (\d+)?/gi).exec(message);
	luckyNumber = luckyNumber[1] || 'n/a';

	var result = response.attachment.quantityQNT > 0? 'Your bet has WON!': 'Your bet has lost';

	var balance = new RegExp(/balance after transaction: ([\d.]+)?/gi).exec(message);
	balance = balance[1] || 'n/a';

	$popupContent.find('.luckyNumber').html(luckyNumber);
	$popupContent.find('.result').html(result);
	$popupContent.find('.balance').html(balance);
	$('#betResultWindow').modal();
};
