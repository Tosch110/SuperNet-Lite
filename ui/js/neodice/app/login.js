app.pages['login'] = function(params) {
	var nextPage = params.nextPage;
	var $btn = $('.btn-login');
	$btn.off();
	$btn.click(function() {
		var secretPhrase = $('#secretPhrase').val();
		if ($('#secretPhraseSave').is(':checked') === true) {
			app.savePassphrase(secretPhrase);
		}
   	    app.showPage(nextPage, { rerender: false, secretPhrase: secretPhrase });
	})	
};

app.showLoginModal = function(params) {
	var modal = $('#login');
	modal.modal();
	var nextPage = params.nextPage;
	var $btn = $('.btn_login');
	$btn.off();
	$btn.click(function() {
		var secretPhrase = $('#secretPhrase').val();
		if ($('#secretPhraseSave').is(':checked') === true) {
			app.savePassphrase(secretPhrase);
		}
		app.hideLoginModal();
		app.showPage(nextPage, { rerender: false, secretPhrase: secretPhrase });
	})
};

app.hideLoginModal = function() {
	$('#login').modal('hide');
};

/* Save passphrase in memory */
app.savePassphrase = function(secretPhrase) {
	app.vars.secretPhrase = secretPhrase;
};
