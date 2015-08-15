var NSV = (function(NSV, $, undefined) {	

 	var NSV_div_ad_out = [];
 	var NSV_div_send_out = [];
	var NSV_div_ad_mess_only = false;

	var NSV_div_send_acc_array = [];
	var NSV_div_send_additional_accounts = [];
	var NSV_div_cur_ass_issued_amount;

	var NSV_div_send_out_err = [];
	var NSV_div_send_out_nxt;
	var NSV_div_send_out_asset;
	var NSV_div_send_out_amount;
	var NSV_div_unquant_out_mult;
	var NSV_div_dividend_message;
	var NSV_div_send_mess_only = false;

	var NSV_shareswap_unredeemed = [];
	var NSV_shareswap_repl_asset;
	var NSV_shareswap_repl_unquant_mult;

	$('#nsv_shareswap_modal').on('hidden.bs.modal', function (e) {
		NSV.shareswap_init();		
	})			

	$('#nsv_div_send_modal').on('hidden.bs.modal', function (e) {
		NSV.div_send_init();		
	})

	$('#nsv_div_ad_modal').on('hidden.bs.modal', function (e) {
		NSV.div_ad_init();		
	})

	NSV.div_ad_init  = function () {
		$("#nsv_div_ad_error_message").hide();
		$("#nsv_div_ad_succ_message").hide();
		$("#nsv_div_ad_warn_message").hide();		
	};	
	
	NSV.div_ad_calc = function () {
		//document.getElementById("nsv_div_ad_asset").value = "5891091872276542613";
		//document.getElementById("nsv_div_ad_amount").value = "1.1";
		//document.getElementById("nsv_div_ad_accounts_list").value = "4041247669959173505,4975043625210111092,NXT-7SBH-9MKB-RGD2-DJZ4P,18207579877024762691,NXT-SK7E-TLUA-SLN6-8PV6N,NXT-KTJL-2UWL-E5LX-4NSFH";
		//document.getElementById("nsv_div_ad_asset").value = "9545582885005657403";
		//document.getElementById("nsv_div_ad_accounts_list").value = "11172957060703226301, 5588186576153043339, 14914915909760784907";
		//document.getElementById("nsv_div_ad_send_mess").value = "Happy New Year";
		
		NSV.div_ad_init();
		
		NSV_div_ad_out = [];		
		
		if (NRS.downloadingBlockchain) {
			$("#nsv_div_ad_error_message").html("Please wait until the blockchain has finished downloading.");
			$("#nsv_div_ad_error_message").show();
			return;
		} else if (NRS.state.isScanning) {
			$("#nsv_div_ad_error_message").html("The blockchain is currently being rescanned. Please wait a minute and then try submitting again.");
			$("#nsv_div_ad_error_message").show();
			return;
		}		

		document.getElementById("nsv_div_ad_gen_but").disabled=true;		
		
        //var btn = $("#nsv_div_ad_calc_but");
		//btn.button('loading');
		
		var asset = $("#nsv_div_ad_asset").val();
		asset = $.trim(asset);	

		var amount = $("#nsv_div_ad_amount").val();
		amount = $.trim(amount);	
		
		var account_list = $("#nsv_div_ad_accounts_list").val();
		account_list = $.trim(account_list);
		
		var output = "";
		var output_err = "";
		var account_err = [];
		var qnt_amt = 0;
		
		var opt_message = $("#nsv_div_ad_send_mess").val();
		opt_message = $.trim(opt_message);
		
		NSV_div_ad_mess_only = false;
		if (amount === "0") {
			NSV_div_ad_mess_only = true;
			//This is just for sending messages
			var account_array = account_list.split(',');
			var aa_len = account_array.length;
			for (var i=0; i<aa_len; ++i) {
				var data_obj = new Object();
				data_obj.asset = asset;
				data_obj.recipient = account_array[i];
				data_obj.quantityQNT = qnt_amt;
				NSV_div_ad_out.push(data_obj);
			}
			var is_err = false;
			var is_warning = false;
			output = "Message to be sent: " + opt_message + "\n";
			for (i=0; i<aa_len; ++i) {
				var act_acc = account_array[i];
				NSV.getAccountError(act_acc, function(response) {	
					if (response.type =="info") {
						output = output.concat("Set to send message to ", account_array[i], "\n");
					}
					else if (response.type=="danger") {
						is_err = true;
						output = output.concat("******Problem with account (",account_array[i], "). Please correct that account and retry.******\n");
					}
					else if (response.type=="warning"){
						is_warning = true;
						output = output.concat("Set to send message to ", account_array[i], " **Warning: account has no public key**\n");
						}
					else {
						is_err = true;						
						output = output.concat("Unknown bug. Please report.\n");
					}
				});					
			}
			if (is_err) {
				$("#nsv_div_ad_error_message").html("<b>Error!</b>: Problems with your list of accounts. See errors below.");
				$("#nsv_div_ad_error_message").show();
			
			} else if (is_warning) {
				$("#nsv_div_ad_warn_message").html("<b>Warning!</b>: Some accounts have had no outward transaction (and may be completely unknown). Please double check. If satisfied, hit <b>Activate Distribution</b>.");
				$("#nsv_div_ad_warn_message").show();
				document.getElementById("send_div_ad_fee").value = aa_len;
				document.getElementById("nsv_div_ad_gen_but").disabled=false;
					
			}
			else {
				$("#nsv_div_ad_succ_message").html("Calculation Succeeded. Hit <b>Activate Distribution</b> to proceed with the below distributions.");
				$("#nsv_div_ad_succ_message").show();					
				document.getElementById("send_div_ad_fee").value = aa_len;
				document.getElementById("nsv_div_ad_gen_but").disabled=false;	
			}						
			document.getElementById("nsv_div_ad_disp_results").value = output;
			
		} else {
			if (!(/^\d+$/.test(asset))) {
				$('#nsv_div_ad_error_message').html("Asset ID is invalid.");
				$('#nsv_div_ad_error_message').show();
				//btn.button('reset');
				return;
			}
			else {
				NRS.sendRequest("getAsset", {
					"asset": asset
				}, function(response) {
					if (response.errorCode) {
						$('#nsv_div_ad_error_message').html("Incorrect Asset ID.");
						$('#nsv_div_ad_error_message').show();
						//btn.button('reset');
						return;
					} else {
						var dec1 = response.decimals;
					}
					if (amount === "") {
						$("#nsv_div_ad_error_message").html("<b>Error!</b>: Amount must be set.");
						$("#nsv_div_ad_error_message").show();
						return;
					
					}				
					try { 
						qnt_amt = NRS.convertToQNT(amount,dec1);
					}
					catch(err) {
						$("#nsv_div_ad_error_message").html("<b>Error!</b>: Amount not set correctly.");
						$("#nsv_div_ad_error_message").show();
						return;
					}
						
					var account_array = account_list.split(',');
					var aa_len = account_array.length;
					for (var i=0; i<aa_len; ++i) {
						var data_obj = new Object();
						data_obj.asset = asset;
						data_obj.recipient = account_array[i];
						data_obj.quantityQNT = qnt_amt;
						NSV_div_ad_out.push(data_obj);
					}
					var is_err = false;
					var is_warning = false;
					if (opt_message !== "") {
						output = "Message sent with asset: " + opt_message + "\n";
					}
					for (i=0; i<aa_len; ++i) {
						var act_acc = account_array[i];
						NSV.getAccountError(act_acc, function(response) {	
							if (response.type =="info") {
								output = output.concat("Set to distribute ", amount, " units to ", account_array[i], "\n");
							}
							else if (response.type=="danger") {
								is_err = true;
								output = output.concat("******Problem with account (",account_array[i], "). Please correct that account and retry.******\n");
							}
							else if (response.type=="warning"){
								is_warning = true;
								output = output.concat("Set to distribute ", amount, " units to ", account_array[i], " **Warning: account has no public key**\n");
								}
							else {		
								output = output.concat("Unknown bug. Please report.\n");
							}
						});					
					}
					if (is_err) {
						$("#nsv_div_ad_error_message").html("<b>Error!</b>: Problems with your list of accounts. See errors below.");
						$("#nsv_div_ad_error_message").show();
					
					} else if (is_warning) {
						$("#nsv_div_ad_warn_message").html("<b>Warning!</b>: Some accounts have had no outward transaction (and may be completely unknown). Please double check. If satisfied, hit <b>Activate Distribution</b>.");
						$("#nsv_div_ad_warn_message").show();
						document.getElementById("send_div_ad_fee").value = aa_len;
						document.getElementById("nsv_div_ad_gen_but").disabled=false;
							
					}
					else {
						$("#nsv_div_ad_succ_message").html("Calculation Succeeded. Hit <b>Activate Distribution</b> to proceed with the below distributions.");
						$("#nsv_div_ad_succ_message").show();					
						document.getElementById("send_div_ad_fee").value = aa_len;
						document.getElementById("nsv_div_ad_gen_but").disabled=false;	
					}						
					document.getElementById("nsv_div_ad_disp_results").value = output;


				
					
					//btn.prop('disabled', false);
				},false);
			}
			//btn.button('reset');
		}

	};

	NSV.div_ad_gen = function () {
		/*document.getElementById("nsv_div_ad_asset").value = "589109187227654261";

		document.getElementById("nsv_div_ad_amount").value = "7";
		document.getElementById("nsv_div_ad_accounts_list").value = "4041247669959173505,4975043625210111092";*/	
		$("#nsv_div_ad_succ_message").hide();
		$("#nsv_div_ad_warn_message").hide();
		$("#nsv_div_ad_error_message").hide();

		var err_message = "";
		
		
		var opt_message = $("#nsv_div_ad_send_mess").val();
		opt_message = $.trim(opt_message);
		
		document.getElementById("nsv_div_ad_gen_but").disabled=true;
        var genbtn = $("#nsv_div_ad_gen_but");
		genbtn.button('loading');

		if (!NRS.rememberPassword) {
			secret = document.getElementById("nsv_div_ad_password").value;
			secret = $.trim(secret);
			if (secret === "") {
				err_message = "Secret Phrase not specified";
			} else {						
				var accountId = NRS.getAccountId(secret);
				//var accountId = NRS.generateAccountId(secret);
				if (accountId != NRS.account) {
					err_message = "Secret Phrase doesn't match";
				}
			}
		} else {
			secret = NRS._password;
		}
		

		
		var int_loop = 0;
		var len = NSV_div_ad_out.length;
		var no_errors = true;
		var asset_found = false;
		if (!NSV_div_ad_mess_only) {
			var assets_needed = parseFloat(NSV_div_ad_out[0].quantityQNT)*len;
			
			
			if (NRS.accountInfo.assetBalances) {
				$.each(NRS.accountInfo.assetBalances, function(key, assetBalance) {
					if (assetBalance.asset == NSV_div_ad_out[0].asset) {
						var confirmedBalance = parseFloat(assetBalance.balanceQNT);
						if ((confirmedBalance) <  assets_needed) {
							err_message = "Not enough assets. You have ".concat(confirmedBalance," quant assets. You need ", assets_needed," quant assets");
							//maybe convert quant assets back to normal, the two places they are printed

						}
						asset_found = true;
					}
				});
				if (!asset_found) {
					err_message = "This account doesn't have any of those assets to distribute.";

				}
			}
			else {
				err_message = "This account doesn't seem to have any assets to distribute.";
			} 
		}
		if (NRS.accountInfo.unconfirmedBalanceNQT) {
			var balance = parseFloat(NRS.accountInfo.unconfirmedBalanceNQT);
			if (balance < len) {
				err_message = "You don't have enough Nxt in this account for this distribution. ".concat(String(len),"NXT needed.");
			}
		}
		else {
			err_message = "This account doesn't seem to have any funds.";
		}
		if (err_message !== "") {
			$('#nsv_div_ad_error_message').html(err_message);
			$('#nsv_div_ad_error_message').show();	
			genbtn.button('reset');
			return;
		}
		if (NSV_div_ad_mess_only) {
			var out_message = "------------Sending Message ".concat("------------\n");
			document.getElementById("nsv_div_ad_disp_results").value = out_message;
			
			var pres_req = new Object ();
			pres_req.secretPhrase=secret;
			pres_req.message=opt_message;
			pres_req.feeNQT="100000000";
			pres_req.deadline="1440";
		
			
			for (var i=0;i<len;++i) {
				var tmp_sm_acc = NSV_div_ad_out[i].recipient;
				var tmp_sm_amt = NSV_div_ad_out[i].quantityQNT;
				pres_req.recipient=tmp_sm_acc;
				pres_req.quantityQNT=tmp_sm_amt;

				NRS.sendRequest("sendMessage", pres_req, function(response) {
					if (response.errorCode) {
						out_message = out_message.concat("Encountered a problem. ",String(response.errorDescription),"\n"); 
						document.getElementById("nsv_div_ad_disp_results").value = out_message;
						no_errors=false;
						
					} else {
						out_message = out_message.concat("Successful TX: ",response.transaction,"\n");				
						document.getElementById("nsv_div_ad_disp_results").value = out_message;
					}
					int_loop++;
					if (int_loop == len) { 
						if (no_errors) {
							out_message = out_message.concat("------------All messages sent------------\n");	
							document.getElementById("nsv_div_ad_disp_results").value = out_message;
						}
						genbtn.button('reset');
						
					}
				},false);
			}
		} else {
			var out_message = "------------Distributing asset ".concat(NSV_div_ad_out[0].asset," ------------\n");			
			document.getElementById("nsv_div_ad_disp_results").value = out_message;
			
			var pres_req = new Object ();
			pres_req.secretPhrase=secret;
			pres_req.asset= NSV_div_ad_out[0].asset;
			pres_req.message=opt_message;
			pres_req.feeNQT="100000000";
			pres_req.deadline="1440";
		
			
			for (var i=0;i<len;++i) {
				var tmp_sm_acc = NSV_div_ad_out[i].recipient;
				var tmp_sm_amt = NSV_div_ad_out[i].quantityQNT;
				pres_req.recipient=tmp_sm_acc;
				pres_req.quantityQNT=tmp_sm_amt;

				NRS.sendRequest("transferAsset", pres_req, function(response) {
					if (response.errorCode) {
						out_message = out_message.concat("Encountered a problem. ",String(response.errorDescription),"\n"); 
						document.getElementById("nsv_div_ad_disp_results").value = out_message;
						no_errors=false;
						
					} else {
						out_message = out_message.concat("Successful TX: ",response.transaction,"\n");				
						document.getElementById("nsv_div_ad_disp_results").value = out_message;
					}
					int_loop++;
					if (int_loop == len) { 
						if (no_errors) {
							out_message = out_message.concat("------------All transactions processed successfully------------\n");	
							document.getElementById("nsv_div_ad_disp_results").value = out_message;
						}
						genbtn.button('reset');
						
					}
				},false);
			}
		}

	
	};

	NSV.getAccountError = function(accountId, callback) {
		NRS.sendRequest("getAccount", {
			"account": accountId
		}, function(response) {
			if (response.publicKey) {
				callback({
					"type": "info",
					"message": "The recipient account has a public key and a balance of " + NRS.formatAmount(response.unconfirmedBalanceNQT, false, true) + " NXT.",
					"account": response
				});
			} else {
				if (response.errorCode) {
					if (response.errorCode == 4) {
						callback({
							"type": "danger",
							"message": "The recipient account is malformed, please adjust." + (!(/^(NXT\-)/i.test(accountId)) ? " If you want to type an alias, prepend it with the @ character." : ""),
							"account": null
						});
					} else if (response.errorCode == 5) {
						callback({
							"type": "warning",
							"message": "The recipient account is an unknown account, meaning it has never had an incoming or outgoing transaction. Please double check your recipient address before submitting.",
							"account": response
						});
					} else {
						callback({
							"type": "danger",
							"message": "There is a problem with the recipient account: " + String(response.errorDescription).escapeHTML(),
							"account": null
						});
					}
				} else {
					callback({
						"type": "warning",
						"message": "The recipient account does not have a public key, meaning it has never had an outgoing transaction. The account has a balance of " + NRS.formatAmount(response.unconfirmedBalanceNQT, false, true) + " NXT. Please double check your recipient address before submitting.",
						"account": response
					});
				}
			}
		},false);
	};

	NSV.div_send_gettime = function(inp_date) {
		
		var d1 = new Date(inp_date);
		if (d1) {
			var nxt_gen = new Date("November 24, 2013, 12:00:00 UTC");
			var nxt_gen_sec = nxt_gen.getTime()/1000;
			var entry_time_sec = d1.getTime()/1000;
			var res = entry_time_sec - nxt_gen_sec; 
			return(res);
		} else {
			return d1;
		}
	};	

	NSV.div_send_init  = function () {
		document.getElementById("nsv_div_send_nodist_acc").value="ISSUER";
		$("#nsv_div_send_error_message").hide();
		$("#nsv_div_send_succ_message").hide();
		$("#nsv_div_send_warn_message").hide();		
		document.getElementById("nsv_div_send_outasset").disabled=true;	
		document.getElementById("nsv_div_send_nodist_acc").disabled=true;
		document.getElementById("nsv_div_send_timestamp").disabled=true;		
	};
	
	NSV.div_send_act_adv = function () {
		if (document.getElementById("nsv_div_send_adv_checkbox").checked) {
			document.getElementById("nsv_div_send_mess").disabled=false;							
			document.getElementById("nsv_div_send_outasset").disabled=false;	
			document.getElementById("nsv_div_send_nodist_acc").disabled=false;
			document.getElementById("nsv_div_send_timestamp").disabled=false;
			//document.getElementById("nsv_div_send_timestamp").value="June 17, 2013, 00:00:00 UTC";
			document.getElementById("nsv_div_send_nodist_acc").value="ISSUER";
		} else {
			document.getElementById("nsv_div_send_mess").disabled=true;				
			document.getElementById("nsv_div_send_outasset").disabled=true;	
			document.getElementById("nsv_div_send_nodist_acc").disabled=true;
			document.getElementById("nsv_div_send_timestamp").disabled=true;
			//document.getElementById("nsv_div_send_timestamp").value="";
			document.getElementById("nsv_div_send_nodist_acc").value="ISSUER";
		}
	};
	
	NSV.div_send_calc_dividends = function () {
		//document.getElementById("nsv_div_send_asset").value = "9545582885005657403";
		//document.getElementById("nsv_div_send_amount").value = "3";
		//document.getElementById("nsv_div_send_timestamp").value = "1 July, 2014, 15:00:00 UTC";
		
		$("#nsv_div_send_error_message").hide();
		$("#nsv_div_send_succ_message").hide();
		$("#nsv_div_send_warn_message").hide();
		document.getElementById("nsv_div_send_disp_results").value = "";
		
		NSV_div_send_acc_array = [];
		
		if (NRS.downloadingBlockchain) {
			$("#nsv_div_send_error_message").html("Please wait until the blockchain has finished downloading.");
			$("#nsv_div_send_error_message").show();
			return;
		} else if (NRS.state.isScanning) {
			$("#nsv_div_send_error_message").html("The blockchain is currently being rescanned. Please wait a minute and then try submitting again.");
			$("#nsv_div_send_error_message").show();
			return;
		}		

		document.getElementById("nsv_div_send_gen_but").disabled=true;		
		
        var btn = $("#nsv_div_send_calc_but");
		btn.button('loading');
		
		var asset = $("#nsv_div_send_asset").val();
		asset = $.trim(asset);	

		var amount = $("#nsv_div_send_amount").val();
		amount = $.trim(amount);	
		
		var outasset = $.trim($("#nsv_div_send_outasset").val());

		var list_nodist_acc = $.trim($("#nsv_div_send_nodist_acc").val());

		var opt_message = $.trim($("#nsv_div_send_mess").val());
		
		var output = "";
		var output_err = "";
		var account_err = [];

		var activate_timestamp = 0;
		var issued_time;
		var time_in;
		
		var err_message = "";
		var outasset_dec1;
		var qnt_amt;
		
		NSV_div_send_out_nxt = true;
		NSV_div_send_mess_only = false;
		
		var issued_account;
		var issued_amount;				
		var asset_dec1;
		var outasset_name,asset_name;
		var aa_len;
		var no_dist_arr = [];
		var block_height = 	0;
		var block_height_now = 	0;
		var mode_recent_block = true;	
		var present_time;
				
		if (!(/^\d+$/.test(asset))) {
			$('#nsv_div_send_error_message').html("Asset ID is invalid.");
			$('#nsv_div_send_error_message').show();
			btn.button('reset');
	  		return;
		}
		else {
			NRS.sendOutsideRequest("/nxt?requestType=" + "getAsset", {
				"asset": asset
			}, function(response) {
				if (response.errorCode) {
					$('#nsv_div_send_error_message').html("Incorrect Asset ID.");
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				} else {
					issued_account = response.accountRS;
					issued_amount = response.quantityQNT;				
					asset_dec1 = response.decimals;
					asset_name = response.name;

				}

				if (outasset !== "") {				
					if (!(/^\d+$/.test(outasset))) {
						err_message = "Out Asset ID is invalid. Either enter a valid ID or leave blank to pay in Nxt.";

					}
					else {
						NRS.sendOutsideRequest("/nxt?requestType=" + "getAsset", {
							"asset": outasset
						}, function(response) {
							if (response.errorCode) {
								err_message = "Incorrect Out Asset ID. Either enter a valid ID or leave blank to pay in Nxt.";	
							} else {				
								outasset_dec1 = response.decimals;
								outasset_name = response.name;
								NSV_div_send_out_nxt = false;
								NSV_div_send_out_asset = outasset;
							}				
						},false);
					}
				}
				
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				}
			
				if (amount === "") {
					err_message = "<b>Error!</b>: Amount must be set (Set=0 to just send a message).";
				}
				try {
					if (NSV_div_send_out_nxt) {
						outasset_dec1 = 8;
						qnt_amt = NRS.convertToNQT(amount);	
					} else {
						qnt_amt = NRS.convertToQNT(amount,outasset_dec1);
					}
				}
				catch(err) {
					err_message = "<b>Error!</b>: Amount not set correctly.";
				}
				if (amount === "0") {
					NSV_div_send_mess_only = true;
					if (opt_message === "") {
						//needs a message if there's no amount
						err_message = "<b>Error!</b>: If amount is zero, then a message must be specified."
					}
				}
				
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				}				
				//assetID =transaction ID which issued it. This has the timestamp info
				NRS.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {"transaction": asset}, function(response) {				
					if (response.errorCode) {
						err_message = "Unknown error, couldn't getTransaction for asset issuing block.";
						return;
					} else {
						issued_time = response.timestamp;
					}
				},false);
				NRS.sendOutsideRequest("/nxt?requestType=" + "getTime", {}, function(response) {
					if (response.errorCode) {
						err_message = "Unknown error, couldn't getTime.";
					} else {
						present_time = response.time;
						time_in = $.trim(document.getElementById("nsv_div_send_timestamp").value); 
						if (time_in === "") {
							activate_timestamp = present_time;
						} else {
							activate_timestamp = NSV.div_send_gettime(time_in);
							if (!activate_timestamp) {
								activate_timestamp = present_time;
								error_message = "Invalid timestamp.";
							} else {
								if (activate_timestamp > present_time) {
									err_message = "Timestamp is in future, must use one in the past.";
								} else if (activate_timestamp < issued_time) {
									err_message = "Timestamp is set to before asset is issued, please use a later date.";
								}
							}
						}
					}
				},false);
				
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				}
				NRS.sendOutsideRequest("/nxt?requestType=" + "getBlock", {"timestamp": present_time}, function(response) {
					if (response.errorCode) {
						err_message = "Unknown error, couldn't getBlock.";
					} else {
						block_height_now = response.height;
					}

				},false);
	
				if (time_in !== "") {
					NRS.sendOutsideRequest("/nxt?requestType=" + "getBlock", {"timestamp": activate_timestamp}, function(response) {
						if (response.errorCode) {
							err_message = "Unknown error, couldn't getBlock.";
						} else {
							block_height = response.height;
						}
					},false);
					if (block_height + 1430 < block_height_now) {    //1440 blocks, but reduce to 1430 to give some allowance
						mode_recent_block = false;
					} else { 
						mode_recent_block = true;
					}					
				} else {
					block_height = block_height_now;
					mode_recent_block = true;
				}
				
				
				
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				}
				
				if (list_nodist_acc !== "") {
					if (list_nodist_acc !== "ISSUER") {
						var account_array = list_nodist_acc.split(',');
						for (i=0; i<account_array.length; ++i) {
							var act_acc = account_array[i];
							NRS.sendOutsideRequest("/nxt?requestType=" + "getAccount", {
								"account": act_acc
							}, function(response) {
								if (response.errorCode) {
									err_message = "Invalid input or account in 'Accounts not to be Distributed to'";
									return;
								} else {
									no_dist_arr.push(response.accountRS);
								}									
							},false);				
						}
					} else {
						no_dist_arr.push(issued_account);
					}
				}	
				
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
					btn.button('reset');
					return;
				}

				var tot_assets = parseInt(issued_amount,10);
				NSV_div_cur_ass_issued_amount = tot_assets;

				if (mode_recent_block) {
					no_dist_arr.push("NXT-MRCC-2YLS-8M54-3CMAJ"); //genesis account
					
					NRS.sendOutsideRequest("/nxt?requestType=" + "getAssetAccounts", {
						"asset": asset, "height": block_height
					}, function(response) {
						if (response.errorCode) {
							err_message = "Unknown bug. Problem accessing getAssetAccounts.";
							return;
							
						} else {
							var asset_acc_arr = response.accountAssets;
							for (var n=0;n<asset_acc_arr.length;n++) {
								var asset_obj = new Object();
								asset_obj.account = asset_acc_arr[n].accountRS;		
								//asset_obj.amount = parseInt(asset_acc_arr[n].unconfirmedQuantityQNT,10);
								asset_obj.amount = parseInt(asset_acc_arr[n].quantityQNT,10);							
								NSV_div_send_acc_array.push(asset_obj);
							}
						}
					},false);				
				
				} else {
				
					$("#nsv_div_send_warn_message").html("Calculation can take several minutes, for fast calculation use a recent timestamp. Progress 0%");
					$("#nsv_div_send_warn_message").show();
					
					var init_object = new Object();
					init_object.account = issued_account;		
					init_object.amount = NSV_div_cur_ass_issued_amount;
					NSV_div_send_acc_array.push(init_object);		
					
					NRS.sendOutsideRequest("/nxt?requestType=" + "getTrades", {
						"asset": asset
					}, function(response) {
						if (response.errorCode) {
							err_message = "Unknown bug. Problem accessing trades.";
							return;
							
						} else {
							var trade_arr = response.trades;
							for (var i=0;i<trade_arr.length;i++) {
								if (trade_arr[i].timestamp <= activate_timestamp) {
									var tmp_tran_ask = trade_arr[i].askOrder;
									var tmp_tran_bid = trade_arr[i].bidOrder;							
									var trade_amt = parseInt(trade_arr[i].quantityQNT,10);
									var sender, recip,sender_amt,recip_amt;
									NRS.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {
										"transaction": tmp_tran_ask, "_extra":tmp_tran_bid
									}, function(response,input) {
										tmp2_tran_bid = input._extra;
										if (response.errorCode) {
											err_message = "Unknown bug. Problem accessing askOrder.";
											return;
											
										} else {
											sender = response.senderRS;
											sender_amt = parseInt(response.attachment.quantityQNT,10);
										}

										NRS.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {
											"transaction": tmp2_tran_bid
										}, function(response) {
											if (response.errorCode) {
												err_message = "Unknown bug. Problem accessing bidOrder.";
												return;
												
											} else {
												recip = response.senderRS;	
												recip_amt = parseInt(response.attachment.quantityQNT,10);
											}
											NSV.div_send_add_acc(recip,trade_amt);
											NSV.div_send_add_acc(sender,trade_amt*-1);
												
											},false);

									},false);	

								}
							}
						}
					},false);

					if (err_message === "") {				
						err_message = NSV.div_send_get_transactions(asset,NSV_div_send_acc_array,issued_time,activate_timestamp);
					}
					if (err_message !== "") {
						$('#nsv_div_send_error_message').html(err_message);
						$('#nsv_div_send_error_message').show();
						btn.button('reset');
						return;
					}
				}	
	
				for (var i=0; i<NSV_div_send_acc_array.length; ++i) {
					if (NSV_div_send_acc_array[i].amount === 0) {
						NSV_div_send_acc_array.splice(i,1);
						i--;						
						continue;
					}
					for (var k=0; k<no_dist_arr.length; k++) {
						if (NSV_div_send_acc_array[i].account == no_dist_arr[k]) {
							NSV_div_send_acc_array.splice(i,1);
							i--;
							break;
						}
					}
				}
				
				var tot2_assets = 0;				
				for (i=0; i<NSV_div_send_acc_array.length; ++i) {
					tot2_assets += NSV_div_send_acc_array[i].amount;
				}	
				$("#nsv_div_send_warn_message").hide();

				$("#nsv_div_ad_succ_message").html("Calculation Succeeded. Hit <b>Activate Distribution</b> to proceed with the below distributions.");
				$("#nsv_div_ad_succ_message").show();							

				
				aa_len = NSV_div_send_acc_array.length;
				NSV_div_send_acc_array.sort(function(a,b) {return b.amount - a.amount; });
				
				document.getElementById("nsv_div_send_fee").value = aa_len;

				var unquant_mult = Math.pow(10,asset_dec1);				
				NSV_div_unquant_out_mult = Math.pow(10,outasset_dec1);
				var mult = qnt_amt/tot2_assets;
				NSV_div_send_out_amount = qnt_amt;
				if (NSV_div_send_mess_only) {
					NSV_div_dividend_message = "Message from asset " + asset_name + "(" + String(asset) + ")";								
				} else {
					NSV_div_dividend_message = "Dividend from asset " + asset_name + "(" + String(asset) + ")";				
				}	
				if (opt_message !== "") {
					NSV_div_dividend_message = NSV_div_dividend_message + ": " + opt_message;					
				}
				//var prt_issued_amount = String(NSV_div_cur_ass_issued_amount/unquant_mult);
				
				if (NSV_div_send_acc_array[aa_len-1] < 0) {
					err_message = "Negative balances in calculation. Try again. If that fails, forward the output log to the developer.";
				}
				output = output.concat(asset_name, " (",String(asset),") Total issued assets: ", String(tot_assets/unquant_mult), ", Assets to be distributed to: ", String(tot2_assets/unquant_mult), "\n");
				if (NSV_div_send_out_nxt) {
					if (NSV_div_send_mess_only) {
						output = output.concat("Summary of proposed message to ", String(aa_len)," assetholders\n");
					} else {
						output = output.concat("Summary of proposed distribution of  ", amount, "NXT to ", String(aa_len)," assetholders\n");						
					}
				} else {
					if (NSV_div_send_mess_only) {
						output = output.concat("Summary of proposed message to ", String(aa_len)," assetholders\n");
					} else {					
						output = output.concat("Summary of proposed distribution of ", amount, " [",outasset_name, "] assets to ", String(aa_len)," assetholders\n");
					}
				}
				var datetime = NSV.timestamp_to_time(activate_timestamp);
				output = output.concat("Based on ownership at timestamp ", String(activate_timestamp)," (", datetime, ")\n");
				output = output.concat("Message included-->",NSV_div_dividend_message,"\n");
				output = output.concat("----------------------\n");
				output = output.concat("Number of assets, Account, Payout amount\n");

				for (i=0; i<aa_len; ++i) {
					var print_amount = NSV_div_send_acc_array[i].amount/unquant_mult;
					NSV_div_send_acc_array[i].amount = Math.round(NSV_div_send_acc_array[i].amount*mult);					
					output = output.concat(print_amount,", ",NSV_div_send_acc_array[i].account,", ", String(NSV_div_send_acc_array[i].amount/NSV_div_unquant_out_mult),"\n");
				}

				$("#nsv_div_send_warn_message").hide();
				document.getElementById("nsv_div_send_disp_results").value = output;
				if (err_message === "") {
					$("#nsv_div_send_succ_message").html("Calculation Succeeded. Hit <b>Activate Dividends</b> to proceed with the below distributions.");
					$("#nsv_div_send_succ_message").show();
					document.getElementById("nsv_div_send_gen_but").disabled=false;
				} else {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();
				}
								
			});
		}
		btn.button('reset');


	};

	NSV.div_send_gen_dividends = function () {
		//document.getElementById("nsv_div_send_asset").value = "589109187227654261";
		//document.getElementById("nsv_div_send_amount").value = "7";
		
		$("#nsv_div_send_succ_message").hide();
		$("#nsv_div_send_warn_message").hide();
		$("#nsv_div_send_error_message").hide();
		
		document.getElementById("nsv_div_send_disp_results").value = "";
		document.getElementById("nsv_div_send_gen_but").disabled=true;
        //var genbtn = $("#nsv_div_send_gen_but");
		//genbtn.button('loading');
		
		var err_message = "";
		var secret;
		var balance, out_message, tmp_sm_acc, tmp_sm_amt, tmp_sm_amt2;
		if (!NRS.rememberPassword) {
			secret = document.getElementById("nsv_div_send_password").value;
			secret = $.trim(secret);
			if (secret === "") {
				err_message = "Secret Phrase not specified";
			} else {						
				var accountId = NRS.getAccountId(secret);
				//var accountId = NRS.generateAccountId(secret);
				if (accountId != NRS.account) {
					err_message = "Secret Phrase doesn't match";
				}
			}
		} else {
			secret = NRS._password;
		}
			
		if (err_message !== "") {
			$('#nsv_div_send_error_message').html(err_message);
			$('#nsv_div_send_error_message').show();	
			//genbtn.button('reset');
			return;
		}
		var int_loop = 0;
		var no_errors = true;
		var asset_found = false;

		var tot_amount = $("#nsv_div_send_amount").val();
		tot_amount = $.trim(tot_amount);	
		
		if (NSV_div_send_mess_only) {
			var len = NSV_div_send_acc_array.length;
			var total_cost = len*100000000;
			
			if (NRS.accountInfo.unconfirmedBalanceNQT) {
				balance = parseFloat(NRS.accountInfo.unconfirmedBalanceNQT);
				if (balance < total_cost) {
					err_message = "You don't have enough Nxt in this account for this distribution. ".concat(String(len),"NXT needed.");
				}
			}
			else {
				err_message = "This account doesn't seem to have any funds.";
			}
			if (err_message !== "") {
				$('#nsv_div_send_error_message').html(err_message);
				$('#nsv_div_send_error_message').show();	
				return;
			}
			out_message = "Sending message-->" + NSV_div_dividend_message + "\n";
			out_message = out_message + "Account, TX\n";
			
			
			for (var i=0;i<len;++i) {
				var pro_pct = Math.round(0 + ((100*i)/len));
				var warn_mess = "Progress ".concat(String(pro_pct),"%");
				$("#nsv_div_send_warn_message").html(warn_mess);
				$("#nsv_div_send_warn_message").show();
				tmp_sm_acc = NSV_div_send_acc_array[i].account;
				document.getElementById("nsv_div_send_disp_results").value = out_message;	  
				NRS.sendRequest("sendMessage", {"secretPhrase":secret,feeNQT:"100000000",deadline:"1440","recipient":tmp_sm_acc,"message":NSV_div_dividend_message}, function(response, input) {
					if (response.errorCode) {
						out_message = out_message.concat("***",input.recipientRS,", Encountered a problem. ",String(response.errorDescription),"\n"); 
						document.getElementById("nsv_div_send_disp_results").value = out_message;
						no_errors=false;
						
					} else {
						out_message = out_message.concat(input.recipientRS,", ",response.transaction,"\n");				
						document.getElementById("nsv_div_send_disp_results").value = out_message;
					}				
					int_loop++;
					if (int_loop == len) { 
						if (no_errors) {
							out_message = out_message.concat("------------All transactions processed------------\n");	
							document.getElementById("nsv_div_send_disp_results").value = out_message;
							$("#nsv_div_send_succ_message").html("Dividends sent");
							$("#nsv_div_send_succ_message").show();
						} else {
							$('#nsv_div_send_error_message').html("All transactions may not have been successful. Check output log below, and check your output transactions.");
							$('#nsv_div_send_error_message').show();	
						}
					}
						
					
				},false);
			}		
		} else {
			for (var j=0; j < NSV_div_send_acc_array.length; j++) {
				if (NSV_div_send_acc_array[j].amount === 0) {
					NSV_div_send_acc_array.splice(j,1);
					j--;
				}
			}
			var len = NSV_div_send_acc_array.length;
			
			if (NSV_div_send_out_nxt) {
				var tot_quant = NRS.convertToNQT(tot_amount);
				var total_cost = len*100000000 + parseInt(tot_quant,10);
				
				if (NRS.accountInfo.unconfirmedBalanceNQT) {
					balance = parseFloat(NRS.accountInfo.unconfirmedBalanceNQT);
					if (balance < total_cost) {
						err_message = "You don't have enough Nxt in this account for this distribution. ".concat(String(len),"NXT needed.");
					}
				}
				else {
					err_message = "This account doesn't seem to have any funds.";
				}
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();	
					return;
				}
				out_message = "Amount paid, Account, TX\n";
				document.getElementById("nsv_div_send_disp_results").value = out_message;
				
				
				for (var i=0;i<len;++i) {
					var pro_pct = Math.round(0 + ((100*i)/len));
					var warn_mess = "Progress ".concat(String(pro_pct),"%");
					$("#nsv_div_send_warn_message").html(warn_mess);
					$("#nsv_div_send_warn_message").show();
					tmp_sm_acc = NSV_div_send_acc_array[i].account;
					tmp_sm_amt = String(NSV_div_send_acc_array[i].amount);		
					document.getElementById("nsv_div_send_disp_results").value = out_message;	  
					NRS.sendRequest("sendMoney", {"secretPhrase":secret,feeNQT:"100000000",deadline:"1440","recipient":tmp_sm_acc,"amountNQT":tmp_sm_amt,"message":NSV_div_dividend_message}, function(response, input) {
						tmp_sm_amt2 = String(parseInt(input.amountNQT, 10 )/NSV_div_unquant_out_mult);				
						if (response.errorCode) {
							out_message = out_message.concat("***",tmp_sm_amt2,", ",input.recipientRS,", Encountered a problem. ",String(response.errorDescription),"\n"); 
							document.getElementById("nsv_div_send_disp_results").value = out_message;
							no_errors=false;
							
						} else {
							out_message = out_message.concat(tmp_sm_amt2,", ",input.recipientRS,", ",response.transaction,"\n");				
							document.getElementById("nsv_div_send_disp_results").value = out_message;
						}				
						int_loop++;
						if (int_loop == len) { 
							if (no_errors) {
								out_message = out_message.concat("------------All transactions processed------------\n");	
								document.getElementById("nsv_div_send_disp_results").value = out_message;
								$("#nsv_div_send_succ_message").html("Dividends sent");
								$("#nsv_div_send_succ_message").show();
							} else {
								$('#nsv_div_send_error_message').html("All transactions may not have been successful. Check output log below, and check your output transactions.");
								$('#nsv_div_send_error_message').show();	
							}
						}
							
						
					},false);
				}
			
			} else {
			
				if (NRS.accountInfo.assetBalances) {
					$.each(NRS.accountInfo.assetBalances, function(key, assetBalance) {
						if (assetBalance.asset == NSV_div_send_out_asset) {
							var confirmedBalance = parseFloat(assetBalance.balanceQNT);
							if ((confirmedBalance) <  NSV_div_send_out_amount) {
								err_message = "Not enough assets. You have ".concat(confirmedBalance," quant assets. You need ", NSV_div_send_out_amount," quant assets");
								//maybe convert quant assets back to normal, the two places they are printed

							}
							asset_found = true;
						}
					});
					if (!asset_found) {
						err_message = "This account doesn't have any of those assets to distribute.";

					}
				}
				else {
					err_message = "This account doesn't seem to have any assets to distribute.";
				} 

				if (NRS.accountInfo.unconfirmedBalanceNQT) {
					balance = parseFloat(NRS.accountInfo.unconfirmedBalanceNQT);
					if (balance < (len*100000000)) {
						err_message = "You don't have enough Nxt in this account to pay the fees for this distribution. ".concat(String(len),"NXT needed.");
					}
				}
				else {
					err_message = "This account doesn't seem to have any funds.";
				}
				if (err_message !== "") {
					$('#nsv_div_send_error_message').html(err_message);
					$('#nsv_div_send_error_message').show();	
					//genbtn.button('reset');
					return;
				}
				out_message = "Assets paid, Account, TX\n";
				document.getElementById("nsv_div_send_disp_results").value = out_message;
				
				
				for (i=0;i<len;++i) {
					pro_pct = Math.round(0 + ((100*i)/len));
					warn_mess = "Progress ".concat(String(pro_pct),"%");
					$("#nsv_div_send_warn_message").html(warn_mess);
					$("#nsv_div_send_warn_message").show();			
					tmp_sm_acc = NSV_div_send_acc_array[i].account;	
					tmp_sm_amt = String(NSV_div_send_acc_array[i].amount);						
					document.getElementById("nsv_div_send_disp_results").value = out_message;
					NRS.sendRequest("transferAsset", {"secretPhrase":secret,feeNQT:"100000000",deadline:"1440","recipient":tmp_sm_acc,"quantityQNT":tmp_sm_amt,"asset":NSV_div_send_out_asset,"message":NSV_div_dividend_message}, function(response, input) {
						tmp_sm_amt2 = String(parseInt(input.quantityQNT, 10 )/NSV_div_unquant_out_mult);
						if (response.errorCode) {
							out_message = out_message.concat("***",tmp_sm_amt2,", ",input.recipientRS,", Encountered a problem. ",String(response.errorDescription),"\n"); 
							document.getElementById("nsv_div_send_disp_results").value = out_message;
							no_errors=false;						
						} else {
							out_message = out_message.concat(tmp_sm_amt2,", ",input.recipientRS,", ",response.transaction,"\n");				
							document.getElementById("nsv_div_send_disp_results").value = out_message;
						}
						int_loop++;
						if (int_loop == len) { 
							if (no_errors) {
								out_message = out_message.concat("------------All transactions processed------------\n");	
								document.getElementById("nsv_div_send_disp_results").value = out_message;
								$("#nsv_div_send_succ_message").html("Dividends sent");
								$("#nsv_div_send_succ_message").show();
							} else {
								$('#nsv_div_send_error_message').html("All transactions may not have been successful. Check output log below, and check your output transactions.");
								$('#nsv_div_send_error_message').show();	
							}						
						}
					},false);
				}						
			}
		}
		$("#nsv_div_send_warn_message").hide();			
		document.getElementById("nsv_div_send_gen_but").disabled=true;
	
	};
	

	NSV.div_send_add_acc = function(account,ch_amount ) {
		for (var k =0; k<NSV_div_send_acc_array.length; k++) {
			if (account == NSV_div_send_acc_array[k].account) {
				NSV_div_send_acc_array[k].amount += ch_amount;
				return;
			}
		}
		var asset_object = new Object();
		asset_object.account = account;		
		asset_object.amount = ch_amount;
		NSV_div_send_acc_array.push(asset_object);
	};	

	NSV.div_send_push_newacc = function(account ) {	
		var asset_object = new Object();
		asset_object.account = account;		
		asset_object.amount = 0;
		NSV_div_send_acc_array.push(asset_object);
		NSV_div_send_additional_accounts.push(asset_object);
	};

	NSV.div_send_check_arr = function(account ) {
		for (var ind=0; ind<NSV_div_send_acc_array.length; ind++) {
			if (account == NSV_div_send_acc_array[ind].account) { 
				return ind;
				}
		}
		return -1;
	};	
			
	
	NSV.div_send_get_transactions = function(cur_asset, asset_array,initial_time,final_time) {
		NSV_div_send_additional_accounts = [];
		len = asset_array.length;
		str_init_time = String(initial_time);
		err_message2 = ""; 
		for (var i=0; i<len; i++) {
			var pro_pct = Math.round(20 + ((60*i)/len));
			var warn_mess = "This calculation can take several minutes, please be patient. Progress ".concat(String(pro_pct),"%");
			$("#nsv_div_send_warn_message").html(warn_mess);
			var tmp_acc = asset_array[i].account;
			NRS.sendOutsideRequest("/nxt?requestType=" + "getAccountTransactionIds", {
				"account":tmp_acc , "type":"2", "subtype":"1","timestamp":str_init_time
			}, function(response,input) {
				if (response.errorCode) {
					err_message2 = "Unknown bug. Problem accessing getAccountTransactionIds.";
					return;					
				} else {
					tran_arr = response.transactionIds;
					tran_len = tran_arr.length;
					var tmp2_acc = input.account;
					for (var j=0; j<tran_len; j++) {
						var tmp_tran = tran_arr[j];
						NSV.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {
							"transaction": tmp_tran, "_extra":tmp2_acc
						}, function(response, input) {
							var cur_account = input._extra;
							var cur_index = NSV.div_send_check_arr(cur_account);							
							if (response.errorCode) {
								err_message2 = "Unknown bug. Problem accessing getTransaction.";
								return;					
							} else if (response.attachment.asset) {
								if (response.timestamp <= final_time) {
									if (cur_asset == response.attachment.asset) {
										if (response.recipientRS == cur_account) {
											NSV_div_send_acc_array[cur_index].amount += parseInt(response.attachment.quantityQNT,10);
											if (NSV.div_send_check_arr(response.senderRS) == -1) {
												NSV.div_send_push_newacc(response.senderRS)
											}
										}
												
										
										if (response.senderRS == cur_account) {
											NSV_div_send_acc_array[cur_index].amount -= parseInt(response.attachment.quantityQNT,10);
											if (response.recipientRS != "NXT-MRCC-2YLS-8M54-3CMAJ") {	//genesis (1739068987193023818)										
												if (NSV.div_send_check_arr(response.recipientRS) == -1) {
														NSV.div_send_push_newacc(response.recipientRS)
													}
											} else {
												NSV_div_cur_ass_issued_amount -= parseInt(response.attachment.quantityQNT,10);

											}
										}
										
									}
								}
							
							} else {
								err_message2 = "Unknown bug. Unexpected Transaction Parsed.";						
								return;
							}	
							
						},false);						 										
				
					}
				}						
			},false);	
		}
		if (err_message2 === "") {
			if (NSV_div_send_additional_accounts.length > 0) {
				err_message2 = NSV.div_send_get_transactions(cur_asset,NSV_div_send_additional_accounts,initial_time,final_time);
			}
		} else {
			return err_message2;
		}
		return err_message2;
		
	};


	//Share swap functions	
	NSV.shareswap_init  = function () {
		$("#nsv_shareswap_error_message").hide();
		$("#nsv_shareswap_succ_message").hide();
		
		document.getElementById("nsv_shareswap_but").disabled=true;	
	};	
	

	NSV.shareswap_calc = function() {

		
		var NSV_redeemed_assets = [];
		var warnings = false;

	
		if (NRS.downloadingBlockchain) {
			$("#nsv_shareswap_error_message").html("Please wait until the blockchain has finished downloading.");
			$("#nsv_shareswap_error_message").show();
			return;
		} else if (NRS.state.isScanning) {
			$("#nsv_shareswap_error_message").html("The blockchain is currently being rescanned. Please wait a minute and then try submitting again.");
			$("#nsv_shareswap_error_message").show();
			return;
		}	
		
		$('#nsv_shareswap_error_message').hide();
		$('#nsv_shareswap_succ_message').hide();	
		var err_message = "";
		var asset1_dec;
		var asset2_dec;

		NSV_shareswap_unredeemed = [];
		NSV_shareswap_repl_asset = "";
	
		var asset1 = document.getElementById("nsv_shareswap_asset1").value;
		var redeem_ac = document.getElementById("nsv_shareswap_redeem_ac").value;
		var asset2 = document.getElementById("nsv_shareswap_asset2").value;
		var ratio = document.getElementById("nsv_shareswap_ratio").value;
		
		//redeem_ac = "NXT-HTM9-BEPZ-28NP-A4AEK";
		//asset1 = "3574526501061878636";
		//asset2 = "18052454258090117553";
		//ratio = ".7";

		if (ratio === "") {
			err_message = "Ratio not specified";		
		} else {
			if (isNaN(ratio)) {
				err_message = "Ratio doesn't seem to be a number";
			} else {
				var ratio_atens = Math.pow(10,ratio.length - ratio.indexOf('.') - 1);
				var ratio_int = parseFloat(ratio)*ratio_atens;
			}
		}
		if (asset2 === "") {
			err_message = "Replacement asset not specified";
		} else if (!(/^\d+$/.test(asset2))) {
			err_message = "Asset ID is Invalid for Replacement Asset";
		}
		else {
			NRS.sendRequest("getAsset", {
				"asset": asset2
			}, function(response) {
				if (response.errorCode) {
					err_message = "Incorrect Asset ID for Replacement Asset";
				} else {
					asset2_dec = response.decimals;
				}					
			},false);			
		}
		
		if (asset1 === "") {
			err_message = "Original asset not specified";
		} else if (!(/^\d+$/.test(asset1))) {
			err_message = "Asset ID is Invalid for Original Asset";
		}
		else {
			NRS.sendRequest("getAsset", {
				"asset": asset1
			}, function(response) {
				if (response.errorCode) {
					err_message = "Incorrect Asset ID for Original Asset";
				} else {
					asset1_dec = response.decimals;
				}					
			},false);			
		}
		if (err_message !== "") {
			$('#nsv_shareswap_error_message').html(err_message);
			$('#nsv_shareswap_error_message').show();
			return;
		}	
		var unquant1_mult = Math.pow(10,asset1_dec);
		var unquant2_mult = Math.pow(10,asset2_dec);

		if (redeem_ac === "") {
			err_message = "Original asset not specified";
		} else {
			NRS.sendOutsideRequest("/nxt?requestType=" + "getAccountTransactionIds", {
				"account":redeem_ac , "type":"2", "subtype":"1"
			}, function(response,input) {
				if (response.errorCode) {
					err_message = "Reddem acccont doesn't seem valid.";
					return;					
				} else {
					var tran_arr = response.transactionIds;
					var tran_len = tran_arr.length;
					for (var j=0; j<tran_len; j++) {
						var tmp_tran = tran_arr[j];
						NSV.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {
							"transaction": tmp_tran
						}, function(response, input) {
							if (response.errorCode) {
								err_message = "Unknown bug. Problem accessing getTransaction.";
							} else if (response.recipientRS == redeem_ac) {
								if (response.attachment.asset == asset1) {
									var received_obj = {};
									received_obj.sender = response.senderRS;
									received_obj.amount = response.attachment.quantityQNT;
									received_obj.tran = response.transaction;
									NSV_redeemed_assets.push(received_obj);
								}
							}															
						},false);						 													
					}								
				}						
			},false);			
		}
		var out_message = "Redeem account: " + redeem_ac + ", Original Asset: " + asset1 +  "\n";
		out_message = out_message + "Replacement asset: " + asset2 + ", Ratio: " + ratio +  "\n";
		if (NSV_redeemed_assets.length === 0) {
			out_message = out_message + "No transactions found.\n";
		} else {
			out_message = out_message + "Assets Sent, Account, Sending TX, Assets Recieved, Recieving TX\n";				
			for (var k=0; k<NSV_redeemed_assets.length; k++) {
				var break_loop = false;
				NRS.sendOutsideRequest("/nxt?requestType=" + "getAccountTransactionIds", {
					"account":NSV_redeemed_assets[k].sender , "type":"2", "subtype":"1"
				}, function(response,input) {
					if (response.errorCode) {
						err_message = "Unknown error. One of the Sender Accounts doesn't seem valid.";
						return;					
					} else {
						var tran_arr = response.transactionIds;
						var tran_len = tran_arr.length;
						for (var j=0; j<tran_len; j++) {
							var tmp_tran = tran_arr[j];
							NSV.sendOutsideRequest("/nxt?requestType=" + "getTransaction", {
								"transaction": tmp_tran
							}, function(response, input) {
								if (response.errorCode) {
									err_message = "Unknown bug. Problem accessing getTransaction.";
								} else if (response.attachment.message == NSV_redeemed_assets[k].tran) { 
									if (response.attachment.asset == asset2) {
										NSV_redeemed_assets[k].amountSent = response.attachment.quantityQNT;
										NSV_redeemed_assets[k].tranSent = response.transaction;
										break_loop = true;
									}
								}															
							},false);						 													
							if (break_loop) {
								break;
							}
							
						}								
					}						
				},false);
				
				
				if (NSV_redeemed_assets[k].tranSent) {
					var unquant_asset1 = parseInt(NSV_redeemed_assets[k].amount,10)/unquant1_mult;
					var unquant_asset2 = parseInt(NSV_redeemed_assets[k].amountSent,10)/unquant2_mult;
					out_message = out_message + unquant_asset1.toString() + ", " + NSV_redeemed_assets[k].sender + ", " + NSV_redeemed_assets[k].tran + ", " + unquant_asset2.toString() + ", " + NSV_redeemed_assets[k].tranSent + "\n";

					var expected_asset_amt = Math.round(parseInt(NSV_redeemed_assets[k].amount,10)*ratio_int/ratio_atens)/unquant1_mult;
					
					if (Math.abs(expected_asset_amt/unquant_asset2-1) > 0.0001 ) {
						out_message = out_message + "****WARNING, AMOUNT SENT DOESN'T MATCH******EXPECTED: " + expected_asset_amt.toString() + " ACTUAL: " + unquant_asset2.toString() + "\n";
						warnings = true;
					}
				} else {
					NSV_shareswap_unredeemed.push(NSV_redeemed_assets[k]);
				}
			}
			out_message = out_message + "-----------------------\n";
			
			var total_replacement_assets = 0;
			var num_tobe_swapped = NSV_shareswap_unredeemed.length;
			for (var i=0; i<num_tobe_swapped; i++) {
				unquant_asset1 = parseInt(NSV_shareswap_unredeemed[i].amount,10)/unquant1_mult;
				
				var adjusted_ratio = Math.pow(10,asset2_dec-asset1_dec)*ratio_int;
				var send_amt = parseInt(NSV_shareswap_unredeemed[i].amount,10)*adjusted_ratio;
				NSV_shareswap_unredeemed[i].amount = Math.round(send_amt/ratio_atens);
				var asset_send_unquant = Math.round(send_amt/ratio_atens)/unquant2_mult;
				out_message = out_message + unquant_asset1.toString() + ", " + NSV_shareswap_unredeemed[i].sender + ", " + NSV_shareswap_unredeemed[i].tran + ", (" + asset_send_unquant.toString() +  "), UNSWAPPED\n";
				total_replacement_assets += asset_send_unquant;
			}
			out_message = out_message + "-----------------------\n";
			if (num_tobe_swapped > 0) {
				out_message = out_message + "NXT needed for transactions: " + num_tobe_swapped.toString() + ", Replacement Assets needed: " + total_replacement_assets.toString() + "\n";
				document.getElementById("nsv_shareswap_but").disabled=false;	
			} else {
				out_message = out_message + "No transactions required\n";
			}
			NSV_shareswap_repl_asset = asset2;
			NSV_shareswap_repl_unquant_mult = unquant2_mult;
		}
		if (warnings) {
			out_message = out_message + "***********Check warnings above, amounts don't match up\n";
		}
		document.getElementById("nsv_shareswap_details").value = out_message;		
		
		if (err_message !== "") {
			$('#nsv_shareswap_error_message').html(err_message);
			$('#nsv_shareswap_error_message').show();
			return;
		}	
	};	
	
	NSV.shareswap_activate = function() {
		var err_message = "";
		var secret;
		
		if (!NRS.rememberPassword) {
			secret = document.getElementById("nsv_shareswap_password").value;
			secret = $.trim(secret);
			if (secret === "") {
				err_message = "Secret Phrase not specified";
			} else {						
				var accountId = NRS.getAccountId(secret);
				if (accountId != NRS.account) {
					err_message = "Secret Phrase doesn't match";
				}
			}
		} else {
			secret = NRS._password;
		}
		if (err_message !== "") {
			$('#nsv_shareswap_error_message').html(err_message);
			$('#nsv_shareswap_error_message').show();
			return;
		}		
		var out_message = "Sending Replacement assets(" + NSV_shareswap_repl_asset + ")...\n";
		out_message = out_message + "Amount, Account, Tran ID\n"
		document.getElementById("nsv_shareswap_details").value = out_message;
		
		for (var i=0; i<NSV_shareswap_unredeemed.length; i++) {
			var tmp_acc = NSV_shareswap_unredeemed[i].sender;
			var tmp_amt = NSV_shareswap_unredeemed[i].amount;
			var tmp_mess = NSV_shareswap_unredeemed[i].tran;		
			NRS.sendRequest("transferAsset", {"secretPhrase":secret,feeNQT:"100000000",deadline:"1440","recipient":tmp_acc,"quantityQNT":tmp_amt,"asset":NSV_shareswap_repl_asset, "message":tmp_mess}, function(response, input) {
				if (response.errorCode) {
					out_message = out_message + "***ERROR, can't send to Account " + input.recipient + ", " + response.errorDescription + "\n";
					document.getElementById("nsv_shareswap_details").value = out_message;

				} else {
					var amt_unmult = parseInt(input.quantityQNT, 10)/NSV_shareswap_repl_unquant_mult;
					out_message = out_message + amt_unmult. toString() + ", " + input.recipientRS + ", " + response.transaction + "\n";
					document.getElementById("nsv_shareswap_details").value = out_message;
				}
			},false);		
		}
		
		document.getElementById("nsv_shareswap_but").disabled=true;	

	};	
	
	//copied from nrs.server and increased size of timeout due to problems with GetTransaction. Maybe not needed but...
	//Have left it the same since it's very bad to miss transactions for this script and the extra time shouldn't matter.
	NSV.sendOutsideRequest = function(url, data, callback, async) {
		if ($.isFunction(data)) {
			async = callback;
			callback = data;
			data = {};
		} else {
			data = data || {};
		}

		$.support.cors = true;

		$.ajax({
			url: url,
			crossDomain: true,
			dataType: "json",
			type: "GET",
			timeout: 3000000,
			async: (async === undefined ? true : async),
			data: data
		}).done(function(json) {
			if (json.errorCode && !json.errorDescription) {
				json.errorDescription = (json.errorMessage ? json.errorMessage : "Unknown error occured.");
			}
			if (callback) {
				callback(json, data);
			}
		}).fail(function(xhr, textStatus, error) {
			if (callback) {
				callback({
					"errorCode": -1,
					"errorDescription": error
				}, {});
			}
		});
	}	

	
    return NSV;
}(NSV || {}, jQuery));
