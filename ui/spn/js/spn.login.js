/******************************************************************************
 * Copyright © 2014-2015 The SuperNET Developers.                             *
 *                                                                            *
 * See the AUTHORS, DEVELOPER-AGREEMENT and LICENSE files at                  *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * SuperNET software, including this file may be copied, modified, propagated *
 * or distributed except according to the terms contained in the LICENSE file *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

/**
 * @duplicate from {nrs.login.js}
 */
var NRS = (function(NRS, $, undefined) {
	NRS.newlyCreatedAccount = false;

	NRS.allowLoginViaEnter = function() {
		$("#login_pin").keypress(function(e) {
			if (e.which == '13') {
				e.preventDefault();
                NRS.loginJayAccount();
			}
		});
	}

	NRS.showLoginOrWelcomeScreen = function() {
		if (NRS.hasLocalStorage && localStorage.getItem("logged_in")) {
			NRS.showLoginScreen();
		} else {
			NRS.showWelcomeScreen();
		}
	}

	NRS.showLoginScreen = function() {
		$("#account_phrase_custom_panel, #account_phrase_generator_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#account_phrase_custom_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_generator_panel :input:not(:button):not([type=submit])").val("");
		$("#login_panel").show();
		$("#import_nxt_phrase_panel").hide();
		setTimeout(function() {
			$("#login_password").focus()
		}, 10);
	}

	NRS.showWelcomeScreen = function() {
		$("#login_panel, account_phrase_custom_panel, #account_phrase_generator_panel, #account_phrase_custom_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#welcome_panel").hide();
		$("#login_panel").show();
		$("#import_nxt_phrase_panel").hide();
	}

	NRS.registerUserDefinedAccount = function() {
		$("#account_phrase_generator_panel, #login_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#account_phrase_custom_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_generator_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_custom_panel").show();
		$("#registration_password").focus();
	}

	NRS.registerAccount = function() {
		$("#login_panel, #welcome_panel").hide();
		$("#account_phrase_generator_panel").show();
		$("#account_phrase_generator_panel step_3 .callout").hide();

		var $loading = $("#account_phrase_generator_loading");
		var $loaded = $("#account_phrase_generator_loaded");

		if (window.crypto || window.msCrypto) {
			$loading.find("span.loading_text").html($.t("generating_passphrase_wait"));
		}

		$loading.show();
		$loaded.hide();

		if (typeof PassPhraseGenerator == "undefined") {
			$.when(
				$.getScript("js/crypto/3rdparty/seedrandom.js"),
				$.getScript("js/crypto/passphrasegenerator.js")
			).done(function() {
				$loading.hide();
				$loaded.show();

				PassPhraseGenerator.generatePassPhrase("#account_phrase_generator_panel");
			}).fail(function(jqxhr, settings, exception) {
				alert($.t("error_word_list"));
			});
		} else {
			$loading.hide();
			$loaded.show();

			PassPhraseGenerator.generatePassPhrase("#account_phrase_generator_panel");
		}
	}

	NRS.verifyGeneratedPassphrase = function() {
		var password = $.trim($("#account_phrase_generator_panel .step_3 textarea").val());

		if (password != PassPhraseGenerator.passPhrase) {
			$("#account_phrase_generator_panel .step_3 .callout").show();
		} else {
		    if (localStorage) {
		        //check pin
		        if (!$("#register_login_pin").val().length) {
		            $.growl($.t("enter_pin"), {
		                "type": "danger",
		                "offset": 10
		            });
		            return;
		        }
		        else {
		            NRS.JayNewAccount(password, $("#register_login_pin").val());
		        }
		    }
		    else {
		        NRS.newlyCreatedAccount = true;
		        NRS.login(password);
		        PassPhraseGenerator.reset();
		        $("#account_phrase_generator_panel textarea").val("");
		        $("#account_phrase_generator_panel .step_3 .callout").hide();
		    }
		}
	}

	$("#account_phrase_custom_panel form").submit(function(event) {
		event.preventDefault()

		var password = $("#registration_password").val();
		var repeat = $("#registration_password_repeat").val();

		var error = "";

		if (password.length < 35) {
			error = $.t("error_passphrase_length");
		} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
			error = $.t("error_passphrase_strength");
		} else if (password != repeat) {
			error = $.t("error_passphrase_match");
		}

		if (error) {
			$("#account_phrase_custom_panel .callout").first().removeClass("callout-info").addClass("callout-danger").html(error);
		} else {
			$("#registration_password, #registration_password_repeat").val("");
			NRS.login(password);
		}
	});

	NRS.login = function(password, callback) {
		if (!password.length) {
			$.growl($.t("error_passphrase_required_login"), {
				"type": "danger",
				"offset": 10
			});
			return;
		} else if (!NRS.isTestNet && password.length < 12 && $("#login_check_password_length").val() == 1) {
			$("#login_check_password_length").val(0);
			$("#login_error .callout").html($.t("error_passphrase_login_length"));
			$("#login_error").show();
			return;
		}

		//$("#login_password, #registration_password, #registration_password_repeat").val("");
		$("#login_check_password_length").val(1);

		NRS.lockLoginPanel();

		NRS.sendRequest("getBlockchainStatus", function(response) {
			if (response.errorCode) {
				$.growl($.t("error_server_connect"), {
					"type": "danger",
					"offset": 10
				});
				NRS.unlockLoginPanel();
				return;
			}

			NRS.state = response;

			//this is done locally..
			NRS.sendRequest("getAccountId", {
				"secretPhrase": password
			}, function(response) {
				if (!response.errorCode) {
					NRS.account = String(response.account).escapeHTML();
					NRS.accountRS = String(response.accountRS).escapeHTML();
					NRS.publicKey = NRS.getPublicKey(converters.stringToHexString(password));
				}

				if (!NRS.account) {
					$.growl($.t("error_find_account_id"), {
						"type": "danger",
						"offset": 10
					});
					NRS.unlockLoginPanel();
					return;
				} else if (!NRS.accountRS) {
					$.growl($.t("error_generate_account_id"), {
						"type": "danger",
						"offset": 10
					});
					NRS.unlockLoginPanel();
					return;
				}

				NRS.sendRequest("getAccountPublicKey", {
					"account": NRS.account
				}, function(response) {
					if (response && response.publicKey && response.publicKey != NRS.generatePublicKey(password)) {
						$.growl($.t("error_account_taken"), {
							"type": "danger",
							"offset": 10
						});
						NRS.unlockLoginPanel();
						return;
					}

					if ($("#remember_password").is(":checked")) {
						NRS.rememberPassword = true;
						$("#remember_password").prop("checked", false);
						NRS.setPassword(password);
						$(".secret_phrase, .show_secret_phrase").hide();
						$(".hide_secret_phrase").show();
					}

					$("#account_id").html(String(NRS.accountRS).escapeHTML()).css("font-size", "12px");

					var passwordNotice = "";

					if (password.length < 35) {
						passwordNotice = $.t("error_passphrase_length_secure");
					} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
						passwordNotice = $.t("error_passphrase_strength_secure");
					}

					if (passwordNotice) {
						$.growl("<strong>" + $.t("warning") + "</strong>: " + passwordNotice, {
							"type": "danger"
						});
					}

					if (NRS.state) {
						NRS.checkBlockHeight();
					}

					NRS.getAccountInfo(true, function() {
						if (NRS.accountInfo.currentLeasingHeightFrom) {
							NRS.isLeased = (NRS.lastBlockHeight >= NRS.accountInfo.currentLeasingHeightFrom && NRS.lastBlockHeight <= NRS.accountInfo.currentLeasingHeightTo);
						} else {
							NRS.isLeased = false;
						}

						//forging requires password to be sent to the server, so we don't do it automatically if not localhost
						if (!NRS.accountInfo.publicKey || NRS.accountInfo.effectiveBalanceNXT == 0 || !NRS.isLocalHost || NRS.downloadingBlockchain || NRS.isLeased) {
							$("#forging_indicator").removeClass("forging");
							$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");
							$("#forging_indicator").show();
							NRS.isForging = false;
						} else if (NRS.isLocalHost) {
							NRS.sendRequest("startForging", {
								"secretPhrase": password
							}, function(response) {
								if ("deadline" in response) {
									$("#forging_indicator").addClass("forging");
									$("#forging_indicator span").html($.t("forging")).attr("data-i18n", "forging");
									NRS.isForging = true;
								} else {
									$("#forging_indicator").removeClass("forging");
									$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");
									NRS.isForging = false;
								}
								$("#forging_indicator").show();
							});
						}
					});

					//NRS.getAccountAliases();


					if (NRS.isOutdated) {
						$.growl($.t("nrs_update_available"), {
							"type": "danger"
						});
					}

					if (!NRS.downloadingBlockchain) {
						NRS.checkIfOnAFork();
					}

					//NRS.setupClipboardFunctionality();

					if (callback) {
						callback();
					}

					NRS.checkLocationHash(password);

					$(window).on("hashchange", NRS.checkLocationHash);

					NRS.getInitialTransactions();

					NRS.spnInit();
				});
			});
		});
	}

	NRS.loginWithAccount = function (account) {
	    //this is done locally..
	    NRS.sendRequest("getAccount", {
	        "account": account
	    }, function (response) {
	        if (!response.errorCode) {
	            NRS.account = String(response.account).escapeHTML();
	            NRS.accountRS = String(response.accountRS).escapeHTML();
	            NRS.publicKey = String(response.publicKey).escapeHTML();
	        }

	        if (response.errorCode == 5) {
	            //new account with valid address, account & accountRS will only be returned from NRS 1.5 onwards
	            
	            NRS.accountRS = account;
	            //NRS.account = String(response.account).escapeHTML();
	            //NRS.accountRS = String(response.accountRS).escapeHTML();
	        }

	        //if (!NRS.account) {
	        //    $.growl($.t("error_find_account_id"), {
	        //        "type": "danger",
	        //        "offset": 10
	        //    });
	        //    return;
	        //} else 
	        if (!NRS.accountRS) {
	            $.growl($.t("error_find_account_id"), {
	                "type": "danger",
	                "offset": 10
	            });
	            return;
	        }

	        NRS.spnInit();
	    });
	}

	$("#logout_button_container").on("show.bs.dropdown", function(e) {
		if (!NRS.isForging) {
			e.preventDefault();
		}
	});

	NRS.showLockscreen = function() {
		if (NRS.hasLocalStorage && localStorage.getItem("logged_in")) {
			setTimeout(function() {
				$("#login_password").focus()
			}, 10);
		} else {
			NRS.showWelcomeScreen();
		}

		$("#center").show();
	}

	NRS.unlock = function() {
		if (NRS.hasLocalStorage && !localStorage.getItem("logged_in")) {
			localStorage.setItem("logged_in", true);
		}

		var userStyles = ["header", "sidebar", "boxes"];

		for (var i = 0; i < userStyles.length; i++) {
			var color = NRS.settings[userStyles[i] + "_color"];
			if (color) {
				NRS.updateStyle(userStyles[i], color);
			}
		}

		var contentHeaderHeight = $(".content-header").height();
		var navBarHeight = $("nav.navbar").height();

		//	$(".content-splitter-right").css("bottom", (contentHeaderHeight + navBarHeight + 10) + "px");

		$("#lockscreen").hide();
		$("body, html").removeClass("lockscreen");

		$("#login_error").html("").hide();

		$(document.documentElement).scrollTop(0);

		$("#spn_dashboard").show();
	}

	$("#logout_button").click(function(e) {
		if (!NRS.isForging) {
			e.preventDefault();
			NRS.logout();
		}
	});

	NRS.logout = function(stopForging) {
		if (stopForging && NRS.isForging) {
			$("#stop_forging_modal .show_logout").show();
			$("#stop_forging_modal").modal("show");
		} else {
			NRS.setDecryptionPassword("");
			NRS.setPassword("");
			window.location.reload();
		}
	}

	NRS.setPassword = function(password) {
		NRS.setEncryptionPassword(password);
		NRS.setServerPassword(password);
		NRS.setSuperNETPassword(password);
	}

	NRS.lockLoginPanel = function () {
	    $("#login_button").button('loading');
	    $("#login_button").prop('disabled', true);
	    $("#register_button").button('loading');
	    $("#register_button").prop('disabled', true);
	    $("#register_new_account").button('loading');
	    $("#register_new_account").prop('disabled', true);
	    $("#login_password").prop('disabled', true);
	    $("#registration_cancel").prop('disabled', true);

	    $("#import_jay_account").button('loading');
	    $("#btn_login_jay .fa-arrow-right").hide();
	    $("#btn_login_jay .fa-spinner").show();
	    $("#btn_login_jay").prop('disabled', true);
	}

	NRS.unlockLoginPanel = function () {
	    $("#login_button").button('reset');
	    $("#login_button").prop('disabled', false);
	    $("#register_button").button('reset');
	    $("#register_button").prop('disabled', false);
	    $("#register_new_account").button('reset');
	    $("#register_new_account").prop('disabled', false);
	    $("#login_password").prop('disabled', false);
	    $("#registration_cancel").prop('disabled', false);

	    $("#import_jay_account").button('reset');
	    $("#btn_login_jay .fa-arrow-right").show();
	    $("#btn_login_jay .fa-spinner").hide();
	    $("#btn_login_jay").prop('disabled', false);
	}

	NRS.showImportNxtPhrase = function () {
	    $("#import_login_password").val('');
	    $("#import_login_pin").val('');
	    $("#login_panel, #welcome_panel").hide();
	    $("#import_nxt_phrase_panel").show();
	    setTimeout(function () {
	        $("#import_login_password").focus();
	    }, 10);
	}

	NRS.importJayAccount = function () {
	    if (!$("#import_login_password").val().length) {
	        $.growl($.t("enter_passphrase"), {
	            "type": "danger",
	            "offset": 10
	        });
	        return;
	    }
	    if (!$("#import_login_pin").val().length) {
	        $.growl($.t("enter_pin"), {
	            "type": "danger",
	            "offset": 10
	        });
	        return;
	    }
	    NRS.JayNewAccount($("#import_login_password").val(), $("#import_login_pin").val());
	}

	return NRS;
}(NRS || {}, jQuery));