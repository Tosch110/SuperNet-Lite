var NRS = (function (NRS, $, undefined) {
    var isDebug = false;
    //var initNewbieURL = " http://jnxt.org";
    //var mgwServer = ["209.126.70.170", "209.126.70.156", "209.126.70.159"];
    var _password;
    var _token;
    var _publicKey;
    var hasCoinAddressFail = false;
    var msig_minutes = 0;

    //Insert new BTC/LTC/DOGE MGW Server IP's into Array
    var serverBTC = ['78.47.115.250', '78.47.58.62'];
    var randomBTC =  Math.round(Math.random() * (serverBTC.length - 1));

    //Insert new VRC/BITS/OPAL MGW Server IP's into Array
    var serverTwo = new Array('178.63.60.131');
    var randomTwo =  Math.round(Math.random() * (serverTwo.length - 1));

    var _bridge = [
    { "coin": "BTC", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "LTC", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "DOGE", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "BTCD", "bridge": "http://"+serverTwo[randomTwo], "msigAddr": "" },
    { "coin": "BITS", "bridge": "http://"+serverTwo[randomTwo], "msigAddr": "" },
    { "coin": "OPAL", "bridge": "http://"+serverTwo[randomTwo], "msigAddr": "" },
    { "coin": "VRC", "bridge": "http://"+serverTwo[randomTwo], "msigAddr": "" }
    //{ "coin": "VPN", "bridge": "http://178.63.60.131", "msigAddr": "" }
    ];

    var _coin = [
    { "coin": "BTC", "assetID": "12659653638116877017", "decimal": 8, "depositConfirmation": "3", "balance": 0, "minWithdraw": 0.001, "minDeposit": 0.001 },
    { "coin": "LTC", "assetID": "125609428220063838", "decimal": 4, "depositConfirmation": "10", "balance":0, "minWithdraw": 0.05, "minDeposit": 0.05 },
    { "coin": "DOGE", "assetID": "16344939950195952527", "decimal": 4, "depositConfirmation": "10", "balance":0, "minWithdraw": 500, "minDeposit": 500 },
    { "coin": "BTCD", "assetID": "6918149200730574743", "decimal": 4, "depositConfirmation": "10", "balance": 0, "minWithdraw": 0.5, "minDeposit": 0.5 },
    { "coin": "VRC", "assetID": "9037144112883608562", "decimal": 8, "depositConfirmation": "10", "balance": 0, "minWithdraw": 50, "minDeposit": 50 },
    { "coin": "OPAL", "assetID": "6775076774325697454", "decimal": 8, "depositConfirmation": "6", "balance": 0, "minWithdraw": 50, "minDeposit": 50 },
    { "coin": "BITS", "assetID": "13120372057981370228", "decimal": 6, "depositConfirmation": "20", "balance": 0, "minWithdraw": 500, "minDeposit": 500 }
    //{ "coin": "VPN", "assetID": "7734432159113182240", "decimal": 4, "depositConfirmation": "10", "balance": 0, "minWithdraw": 5000, "minDeposit": 5000 }
    ];

    var _coinMGW = [
    { "coin": "BTC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "LTC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "DOGE", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "BTCD", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "VRC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "OPAL", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "BITS", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" }
    //{ "coin": "VPN", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" }
    ];

    var _trustedMGW = [
    { "coin": "BTC", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "LTC", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "DOGE", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "BTCD", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "VRC", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "OPAL", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "BITS", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] }
    //{ "coin": "VPN", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] }
    ];

    //Workaround check for BTC/LTC/DOGE to have all three MGW servers checked for multisig address.
    var gateWayBTC = [false, false, false];
    var gateWayLTC = [false, false, false];
    var gateWayDOGE = [false, false, false];

    //If no address has been created, check every 10 minutes and create a new one if not exists.
    NRS.updateMissingMsig = function () {

        var under_maintenance = $('.coin_under_maintenance');

        if(under_maintenance.length > 0) {
            if (msig_minutes < 20) {

                msig_minutes++;
            } else {

                under_maintenance.each(function () {
                    var coin = $( this ).closest("div").attr("id");

                    //Initiate deposit check if coin is under maintenance
                    for(var searchcoin in _bridge) {

                        if(_bridge[searchcoin].coin == coin) {

                            sendNewbieInitRequest(searchcoin, 0);
                            return;
                        }

                    }

                });
                msig_minutes = 0;
            }
        }
    };

    NRS.setSuperNETPassword = function (password) {
        _password = password;
    };

    NRS.setSuperNETToken = function (token) {
        _token = token;
    };

    NRS.mgwv1init = function () {
        initActiveCoin();
    };

    NRS.spnInit = function () {
        getMsigDepositAddress();
    };

    NRS.publicKey = function() {

        NRS.sendRequest("getAccountId", {
            secretPhrase: _password
        }, function (account_response) {

            _publicKey = account_response.publicKey;

        }, false);
    };

    NRS.spnNewBlock = function () {
        getBalance();
        /*if (!NRS.serverConnect) {
            NRS.getServerStatus(NRS.state.lastBlockchainFeederHeight);
        }*/
    };

    NRS.onNxtDisconnected = function () {
        var result = _bridge.map(function (a) { return a.coin; });
        result.push("NXT");

        $.each(result, function (i, v) {
            var coinLight = $(".bg" + v.toLowerCase() + " .led-div");

            if (coinLight.hasClass("led-green")) {
                coinLight.removeClass("led-green").addClass("led-red");
                coinLight.tooltipster('content', $.t("offline"));
                coinLight.attr("data-i18n-tooltip", "offline");
            }
        });
    };

    function getMsigDepositAddress() {
        showDashboard();

        if (!NRS.isJay) {
            if (_bridge.length > 0) {
                sendNewbieInitRequest(0, 1);
            }
        }
    }

    function initActiveCoin() {

        $.each(_bridge, function (i, v) {
            var cointitle = $(".bg" + v.coin.toLowerCase() + " h4");
            cointitle.attr("data-i18n", "in_queue");
            cointitle.html($.t("in_queue"));
        });
    }

    function includeCSSfile(href) {
        var head_node = document.getElementsByTagName('head')[0];
        var link_tag = document.createElement('link');
        link_tag.setAttribute('rel', 'stylesheet');
        link_tag.setAttribute('type', 'text/css');
        link_tag.setAttribute('href', href);
        head_node.appendChild(link_tag);
    }

    function showDashboard() {
        getBalance();
        var bgnxt = $(".bgnxt h4");

        bgnxt.text(NRS.accountRS);
        bgnxt.removeAttr("data-i18n");

        showAutoConvertMsg();
        autoCheckCoinRecipient();

        $("#nxt_details_account_rs").html(NRS.accountRS);
        $("#nxt_details_publicKey").html(NRS.publicKey);
        $("#supernet_accountRS").html(NRS.accountRS);

        setTimeout(function () {
            NRS.hideDashboardElementinJay();
            $("#spn_dashboard").show();
            NRS.unlock();
        }, 500);
    }

    function getBalance() {
        NRS.sendRequest("getAccountAssets", {
            account: NRS.accountRS
        }, function (response) {
            if (response.accountAssets) {
                $.each(response.accountAssets, function (i, v) {
                    var coinDetails = $.grep(_coin, function (coinD) { return coinD.assetID == v.asset });

                    if (coinDetails.length > 0) {
                        var balance = NRS.convertToNXT(new BigInteger(v.unconfirmedQuantityQNT).multiply(new BigInteger(Math.pow(10, 8 - v.decimals).toString())));
                        coinDetails[0].balance = balance;
                    }
                });
            }

            $.each(_coin, function (i, v) {
                $(".bg" + v.coin.toLowerCase() + " h5 a").html(NRS.formatStyledAmount(NRS.convertToNQT(v.balance)));
            });
        });

        NRS.sendRequest("getAccount", {
            account: NRS.accountRS
        }, function (response) {
            if (response.unconfirmedBalanceNQT) {
                $("#account_balance").html(NRS.formatStyledAmount(response.unconfirmedBalanceNQT));
                $("#pubKey").hide();
            } else {
                $("#account_balance").html("0");

                $("#pubKey").show();
            }
        });
    }

    function sendNewbieInitRequest(index, tries) {

        var url = '';
        var coin = _bridge[index].coin;
        var key = "mgw-" + NRS.accountRS + "-" + coin;

        if (localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                var data = JSON.parse(localStorage[key]);
                if (processMsigJson(data, coin)) {
                    showDepositAddr(data, coin);

                    if (index + 1 < _bridge.length) {
                        sendNewbieInitRequest(++index, 1)
                    }
                    return;
                }
            }
        }

	    if (_bridge[index].coin === "BTC" || _bridge[index].coin === "LTC" || _bridge[index].coin === "DOGE") {
			
			// var timeout = 1000;
			url = _bridge[index].bridge +  ":7777/public?plugin=relay";
			url += "&method=busdata";
			url += "&servicename=MGW";
			url += "&serviceNXT=8119557380101451968";
			url += "&destplugin=MGW";
			url += "&submethod=msigaddr";
			url += "&coin=" + _bridge[index].coin;
			url += "&userNXT=" + NRS.accountRS;
			url += "&userpubkey=" + NRS.publicKey;
			// url += "&timeout=" + timeout;
			// url += "&buyNXT=10"; NOTE: Not sure if this is needed

	
		} else {
	
			url = _bridge[index].bridge + "/init/?requestType=newbie";
			url += "&coin=" + _bridge[index].coin;
			url += "&NXT=" + NRS.accountRS;
			url += "&pubkey=" + NRS.publicKey;
			//url += "&convertNXT=10";
		}

        //Log in Browser & console
        //console.log('Coin (Index): '+_bridge[index].coin+' ('+index +') .Try Number: '+tries+' Connection to: '+ url);

        sendNewbieAjaxRequest(url, tries, index);
    }



    function sendNewbieAjaxRequest(url, tries, index) {

        //console.log('URL: '+url);

        //Search for "coin" in the url string
        var searchcoin = url.search("coin")+5;
        //Find a max 4-letter coin
        var endstring = searchcoin + 4;
        //get element
        var coin = url.substring(searchcoin,endstring);

        //Subtract 1 if coin has 3 Character
        if(coin.substr(coin.length - 1) === '&') {
            coin = coin.substring(0, coin.length - 1);
        }

        var coinTitle = $(".bg" + coin.toLowerCase() + " h4");

        //If coin was under maintenance before.
        coinTitle.removeClass("coin_under_maintenance");
        coinTitle.parent().attr('id', coin);

        //log creating deposit address.
        //console.log('Coin: '+coin+' Tries: '+tries+ ' Link: '+url);

        //Change server if server does not respond.
        if(tries > 0) {
            if(coin === 'LTC' || coin === 'BTC' || coin === 'DOGE') {
                //Select another Server
                randomBTC =  Math.round(Math.random() * (serverBTC.length - 1));
                _bridge[index].bridge  = 'http://'+serverBTC[randomBTC];
            } else {
                randomTwo =  Math.round(Math.random() * (serverTwo.length - 1));
                _bridge[index].bridge  = 'http://'+serverTwo[randomTwo];
            }
        }

        if (tries > 2) {

            hasCoinAddressFail = true;

            coinTitle.removeAttr("data-i18n");
            coinTitle.removeClass( "generating_address" );
            coinTitle.text($.t("node_under_maintenance"));
            coinTitle.attr("data-i18n", "node_under_maintenance");
            coinTitle.addClass("coin_under_maintenance");

            var coinLight = $(".bg" + coin.toLowerCase() + " .led-div");
            if (coinLight.hasClass("led-green")) {
                coinLight.removeClass("led-green").addClass("led-red");
                coinLight.tooltipster('content', $.t("offline"));
                coinLight.attr("data-i18n-tooltip", "offline");
            }

            if (index + 1 < _bridge.length) {

                sendNewbieInitRequest(++index, 1);
            }
            else {
                if (hasCoinAddressFail) {
                    setTimeout(function () { sendNewbieInitRequest(0, 1); }, 600000); // 10 minutes
                }
            }
            return;
        }

        //dev
        //showDepositAddr(JSON.parse('[[{"requestType":"MGWaddr","sender":"423766016895692955","buyNXT":0,"created":1419586879,"M":2,"N":3,"NXTaddr":"3705364957971254799","RS":"NXT-X5JH-TJKJ-DVGC-5T2V8","address":"bThdNGHxZEe7LUD5waaSEWreAELsrtNjVp","redeemScript":"5221027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f2103395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d2102ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af253ae","coin":"BTCD","gatewayid":"0","pubkey":[{"address":"RCToyGor3Aq6n7gsZKRT4XiDEWFy4d4n9s","pubkey":"027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f","srv":"423766016895692955"},{"address":"RCnoTsLsZvhfAUPwNVPSx3nxAQXHSR51Cr","pubkey":"03395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d","srv":"12240549928875772593"},{"address":"RMU6LLrrE7CFFG7BWfjaycNnPzJtunJ7R3","pubkey":"02ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af2","srv":"8279528579993996036"}]},{"token":"4nbbkmqel5nl6fevock6k7gbpcfmt9fl3gsj4gf3e7rdefsd1scqo6ebidq37jg2bk1uu3jb0ontgc0lb2s3jhksg8f8bakogt02t8of52rgbbamvj6dk0d9bb3rvto7fjcqb7c2jfon3n11chbtophrjrma1i6q"}],[{"requestType":"MGWaddr","sender":"12240549928875772593","buyNXT":0,"created":1419586879,"M":2,"N":3,"NXTaddr":"3705364957971254799","RS":"NXT-X5JH-TJKJ-DVGC-5T2V8","address":"bThdNGHxZEe7LUD5waaSEWreAELsrtNjVp","redeemScript":"5221027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f2103395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d2102ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af253ae","coin":"BTCD","gatewayid":"1","pubkey":[{"address":"RCToyGor3Aq6n7gsZKRT4XiDEWFy4d4n9s","pubkey":"027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f","srv":"423766016895692955"},{"address":"RCnoTsLsZvhfAUPwNVPSx3nxAQXHSR51Cr","pubkey":"03395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d","srv":"12240549928875772593"},{"address":"RMU6LLrrE7CFFG7BWfjaycNnPzJtunJ7R3","pubkey":"02ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af2","srv":"8279528579993996036"}]},{"token":"phfmcvvc65ag4edesl43pith02t6r4c4c3e4s0t7gofh3p7p1scrin8k932ieug2n71lit3h6mtm0ff8l6m34lhq0v0icensk21n7irhr9lgavdvvtfqe2d917g303fgb958n220b406vvq58cu095d2a46upra2"}],[{"requestType":"MGWaddr","sender":"8279528579993996036","buyNXT":0,"created":1419586879,"M":2,"N":3,"NXTaddr":"3705364957971254799","RS":"NXT-X5JH-TJKJ-DVGC-5T2V8","address":"bThdNGHxZEe7LUD5waaSEWreAELsrtNjVp","redeemScript":"5221027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f2103395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d2102ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af253ae","coin":"BTCD","gatewayid":"2","pubkey":[{"address":"RCToyGor3Aq6n7gsZKRT4XiDEWFy4d4n9s","pubkey":"027d7ca4916cde17088707f2db07530f4b0f6e1191444e8a34719a384185b2b37f","srv":"423766016895692955"},{"address":"RCnoTsLsZvhfAUPwNVPSx3nxAQXHSR51Cr","pubkey":"03395682fb6fabda7e76b9a05cbd8386bc0c9175503d6be259bd4fcc57b32d535d","srv":"12240549928875772593"},{"address":"RMU6LLrrE7CFFG7BWfjaycNnPzJtunJ7R3","pubkey":"02ebfaf9ff68cc6147c200b336d9ef3c5c0cba60033abf393d09015215a9f53af2","srv":"8279528579993996036"}]},{"token":"u9pvu95ch7jei98kc641u51ms5p6u85cghl8lkefn4f22v3k1scqk0401fe7fcg2i9tt6bnip71dvtnkck9rfu393ia968ibgpjjfirlj8rgvgcl2sv5duprbj6ee2f54865kri8bslhv6vn165464drj7fv757f"}]]'),"BTCD");
        //return;
        //end dev

        coinTitle.attr("data-i18n", "generating_deposit_address");
        coinTitle.html($.t("generating_deposit_address") + ' <span class="loading_dots"><span>.</span><span>.</span><span>.</span></span>');

        $.ajax({
            url: url,
            dataType: 'text',
            type: 'GET',
            timeout:30000,
            crossDomain: true,
            success: function (data) {

                if (!IsJsonString(data)) {
                    data = removeWarningJsonReturn(data);
                }
                data = JSON.parse(data);

                if (isDebug) {
                    $.growl("data return : " + JSON.stringify(data), { "type": "success" });
                }

                //Edge cases / workarounds for new servers.
                if(coin === 'LTC' || coin === 'BTC' || coin === 'DOGE') {

                    //Get deposit address confirmed by all 3 servers
                    if(data[0].gatewayid !== undefined) {
                        switch(coin) {
                            case 'BTC':
                                gateWayBTC[data[0].gatewayid] = true;
                                if (gateWayBTC[0] === false || gateWayBTC[1] === false || gateWayBTC[2] === false) {
                                    sendNewbieInitRequest(index, 0);
                                }
                            break;
                            case 'LTC':
                                gateWayLTC[data[0].gatewayid] = true;
                                if (gateWayLTC[0] === false || gateWayLTC[1] === false || gateWayLTC[2] === false) {
                                    sendNewbieInitRequest(index, 0);
                                }
                            break;
                            case 'DOGE':
                                gateWayDOGE[data[0].gatewayid] = true;
                                if (gateWayDOGE[0] === false || gateWayDOGE[1] === false || gateWayDOGE[2] === false) {
                                    sendNewbieInitRequest(index, 0);
                                }
                            break;
                        }
                    }

                    //Try again if no response
                    if(data[0].address === undefined) {
                        sendNewbieInitRequest(index, tries++);
                    }

                    //Check char for Multisignature address
                    if (data[0].address.charAt(0) !== '3' && data[0].address.charAt(0) !== 'A' && data[0].address.charAt(0) !== '9') {
                        sendNewbieInitRequest(index, tries++);
                    }

                }

                if (processMsigJson(data, coin)) {
                    if (localStorage) {
                        localStorage["mgw-" + NRS.accountRS + "-" + coin] = JSON.stringify(data);
                    }

                    showDepositAddr(data, coin);

                    if (index + 1 < _bridge.length) {
                        sendNewbieInitRequest(++index, 1)
                    }
                } else {
                    setTimeout(function () { sendNewbieInitRequest(index, ++tries); }, 5000);
                }
            },
            error: function () {
                if (isDebug) {
                    $.growl("Error calling " + url + " API", { "type": "danger" });
                }

                setTimeout(function () { sendNewbieInitRequest(index, ++tries); }, 5000);
            }
        });

    }

    function showDepositAddr(data, coin) {

        //var coinAddr = "";
        var coinBridge = '';
        var error = '';
        var coinTitle = $(".bg" + coin.toLowerCase() + " h4");

        if(data[0].error !== undefined) {

            error = 'error: '+data[0].error;

        }

        if(data[0].error !== 'timeout') {

            if (data[0][0]) {

                coinBridge = $.grep(_bridge, function (coinD) { return coinD.coin == coin });
                coinTitle.text(data[0][0].address);
                coinTitle.removeAttr("data-i18n");
                coinBridge[0].msigAddr = data[0][0].address;

                onSuccessShowMsig(data[0][0].coin);

            } else {

              coin = data[0].coin;

                var address = data[0].address;

                coinBridge = $.grep(_bridge, function (coinD) { return coinD.coin == coin });
                coinTitle.text(address);
                coinTitle.removeAttr("data-i18n");
                coinBridge[0].msigAddr = address;

                onSuccessShowMsig(coin);
            }

        } else {

            coinTitle.removeAttr("data-i18n");
            coinTitle.text($.t("node_under_maintenance"));
            coinTitle.attr("data-i18n", "node_under_maintenance");
        }
    }

    function sentNXT() {
        if (isWithdrawValid("NXT")) {
            var $btn = $("#coinops_submit").button('loading');

            if (NRS.isJay) {
                var trf = Jay.sendMoney($.trim($("#field114cont").val()), $.trim($("#field113cont").val()));
                showJayCode(trf);
                $btn.button('reset');
            } else {
                NRS.sendRequest("sendMoney", {
                    secretPhrase: "",
                    feeNQT: "100000000",
                    deadline: "1440",
                    recipient: $.trim($("#field114cont").val()),
                    amountNXT: $.trim($("#field113cont").val())
                }, function (response) {
                    $btn.button('reset');
                    if (response.errorCode) {
                        $.growl(NRS.translateServerError(response), { "type": "danger" });
                    }

                    if (response.transaction) {
                        $("#modal-11 .md-close").click();
                        $.growl("Your coin sending operation has been submitted.", { "type": "success" });

                        setTimeout(function () {
                            getBalance();
                        }, 5000);
                    } else {
                        $.growl(NRS.translateServerError(response), { "type": "danger" });
                    }
                });
            }
        }
    }

    function sentMGWcoin(coin) {
        var message = '{"redeem":"' + coin + '","withdrawaddr":"' + $.trim($("#field114cont").val()) + '","InstantDEX":""}';
        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin });
        var coinMGW = $.grep(_coinMGW, function (coinD) { return coinD.coin == coin });

        if (isWithdrawValid(coinDetails[0].coin)) {
            var $btn = $("#coinops_submit").button('loading');
            var recipient = "";
            if ($.trim($("#field114cont").val()).match("NXT-")) {
                recipient = $.trim($("#field114cont").val());
                message = "";
            }
            else {
                recipient = coinMGW[0].accountRS;
            }

            if (NRS.isJay) {
                var JayMessage;
                if (message.length > 0) {
                    JayMessage = Jay.addAppendage(Jay.appendages.message, message);
                }
                var amountQNT = NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal);
                var trf = Jay.transferAsset(recipient, coinDetails[0].assetID, amountQNT, JayMessage);
                showJayCode(trf);
                $btn.button('reset');
            } else {
                NRS.sendRequest("transferAsset", {
                    secretPhrase: "",
                    messageIsText: "true",
                    message: message,
                    feeNQT: "100000000",
                    deadline: "1440",
                    recipient: recipient,
                    asset: coinDetails[0].assetID,
                    quantityQNT: NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal),
                    merchant_info: ""
                }, function (response) {
                    $btn.button('reset');
                    if (response.errorCode) {
                        $.growl(NRS.translateServerError(response), { "type": "danger" });
                    }

                    if (response.transaction) {
                        $("#modal-11 .md-close").click();
                        $.growl("Your coin sending operation has been submitted.", { "type": "success" });

                        setTimeout(function () {
                            getBalance();
                        }, 5000);
                    } else {
                        $("#field115cont").val("Unexpected Error");
                    }
                });
            }
        }
    }

    function sendMGWasset (coin, recipient) {
        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin });
        var message = $("#field115cont").val();
        var $btn = $("#coinops_submit").button('loading');

        if (NRS.isJay) {
            var JayMessage;
            if (message.length > 0) {
                JayMessage = Jay.addAppendage(Jay.appendages.message, message);
            }
            var amountQNT = NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal);
            var trf = Jay.transferAsset(recipient, coinDetails[0].assetID, amountQNT, JayMessage);
            showJayCode(trf);
            $btn.button('reset');
        } else {
            NRS.sendRequest("transferAsset", {
                secretPhrase: "",
                messageIsText: "true",
                message: message,
                feeNQT: "100000000",
                deadline: "1440",
                recipient: recipient,
                asset: coinDetails[0].assetID,
                quantityQNT: NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal),
                merchant_info: ""
            }, function (response) {
                $btn.button('reset');
                if (response.errorCode) {
                    $.growl(NRS.translateServerError(response), { "type": "danger" });
                }

                if (response.transaction) {
                    $("#modal-11 .md-close").click();
                    $.growl("Your coin sending operation has been submitted.", { "type": "success" });

                    setTimeout(function () {
                        getBalance();
                    }, 5000);
                } else {
                    $("#field115cont").val("Unexpected Error");
                }
            });
        }
    };

    function isWithdrawValid(coin) {
        var result = true;
        var modal = $("#modal-11");

        if (!isHasTargetAddress()) {
            return false;
        }

        if (!isValidTargetAddr()) {
            return false;
        }

        if (!isHasAmount()) {
            displayModalError(modal, $.t("please_specify_amount"));
            return false;
        }

        if (!NRS.isJay) {
            if (!isEnoughBalance(coin)) {
                displayModalError(modal, $.t("insufficient_coin").replace(/<coin>/g, coin));
                return false;
            }

            if (coin != "NXT") {
                if (NRS.accountInfo.unconfirmedBalanceNQT < 100000000) {
                    displayModalError(modal, $.t("sending_coin_required_nxt").replace(/<coin>/g, coin));
                    return false;
                }
            }
        }

        if (coin != "NXT") {
            var recipient = $.trim($("#field114cont").val());
            if (!recipient.toUpperCase().match("NXT-")) {
                if (!isAboveMinWithdraw(coin)) {
                    var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin.toUpperCase() });
                    displayModalError(modal, $.t("minimum_coin_send") + " " + coinDetails[0].minWithdraw + " " + coin.toUpperCase());
                    return false;
                }
            }
        }

        return result;
    }

    function isHasTargetAddress() {
        var modal = $("#modal-11");
        var result = true;
        if ($.trim($("#field114cont").val()) == "") {
            displayModalError(modal, $.t("please_specify_recipient"));
            result = false;
        }
        else {
            displayModalError(modal, "");
        }
        return result;
    }

    function isHasAmount() {
        var result = true;
        if ($.trim($("#field113cont").val()) == "" || parseFloat($.trim($("#field113cont").val())) == 0) {
            result = false;
        }
        return result;
    }

    function isEnoughBalance(coin) {
        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin.toUpperCase() });
        var result = true;
        var balanceNQT = 0;
        var balance = "";
        var withdrawAmountNQT = '';

        if (coin == "NXT") {
            withdrawAmountNQT = new Big(NRS.convertToNQT($("#field113cont").val()).toString());
            balance = NRS.accountInfo.unconfirmedBalanceNQT - 100000000;
            balance = new Big(balance.toString());
            if (balance.cmp(withdrawAmountNQT) == -1) {
                result = false;
            }
        } else {
            if (NRS.accountInfo.unconfirmedAssetBalances) {
                for (var i = 0; i < NRS.accountInfo.unconfirmedAssetBalances.length; i++) {
                    balance = NRS.accountInfo.unconfirmedAssetBalances[i];

                    if (balance.asset == coinDetails[0].assetID) {
                        balanceNQT = balance.unconfirmedBalanceQNT.toString();
                    }
                }
            }
            balanceNQT = new Big(balanceNQT.toString());
            withdrawAmountNQT = new Big(NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal).toString());
            if (balanceNQT.cmp(withdrawAmountNQT) == -1) {
                result = false;
            }
        }
        return result;
    }

    function isAboveMinWithdraw(coin) {
        var result = true;
        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin.toUpperCase() });

        var minWithdrawNQT = new Big(NRS.convertToNQT(coinDetails[0].minWithdraw).toString());
        var withdrawAmountNQT = new Big(NRS.convertToNQT($("#field113cont").val()).toString());

        if (withdrawAmountNQT.cmp(minWithdrawNQT) == -1) {
            result = false;
        }
        return result;
    }

    function getMGWaddr() {
        var resultTXID = [];

        NRS.sendRequest("getUnconfirmedTransactions", {
            account: NRS.accountRS
        }, function (response) {
            if (response.unconfirmedTransactions.length > 0) {
                $.each(response.unconfirmedTransactions, function (i, v) {
                    if (v.type == 1 && v.subtype == 0) {
                        //Arbitrary message

                        var msg = JSON.parse(v.attachment.message);
                        var coinSer = $.grep(_coinSer, function (coinSer) { return coinSer.coin == msg.coin });

                        for (var x = 0; x < coinSer[0].server.length; x++) {
                            if (v.sender == coinSer[0].server[x]) {
                                var addr = v.address;

                                if (isDebug) {
                                    $.growl("mgw addr for " + msg.coin + " : " + addr, { "type": "success" });
                                }
                            }
                        }
                    }
                });
            }
            else {
                //TODO
                //check AM
            }
        });
    }

    function getTxHistory(coin) {
        $("#tx_deposit_table").parent().addClass("data-loading").removeClass("data-empty");
        $("#tx_withdraw_table").parent().addClass("data-loading").removeClass("data-empty");
        $("#coin_fr,#coin_to").hide();
        var column_debit = $("#column_debit");
        var column_credit = $("#column_credit");

        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin });

        if (coin == "NXT") {
            column_debit.attr("data-i18n", "from");
            column_debit.text($.t("from"));
            column_credit.attr("data-i18n", "to");
            column_credit.text($.t("to"));
            NRS.sendRequest("getAccountTransactions", {
                account: NRS.accountRS,
                type: "0",
                subtype: "0"
            }, function (response) {
                if (response.errorCode) {
                    //empty history
                    NRS.dataLoadFinished($("#tx_deposit_table"));
                    NRS.dataLoadFinished($("#tx_withdraw_table"));
                    return;
                }

                if (response.transactions) {
                    var deposit = "";
                    var withdraw = "";

                    $.each(response.transactions, function (i, v) {
                        if (v.recipientRS == NRS.accountRS) {
                            deposit += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + v.senderRS + "</td><td>" + NRS.convertToNXT(v.amountNQT) + "</td></tr>";
                        }
                        //withdraw
                        if (v.senderRS == NRS.accountRS) {
                            withdraw += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + v.recipientRS + "</td><td>" + NRS.convertToNXT(v.amountNQT) + "</td></tr>";
                        }
                    });

                    setTimeout(function () {
                        $("#tx_deposit_table tbody").empty().append(deposit);
                        $("#tx_withdraw_table tbody").empty().append(withdraw);

                        NRS.dataLoadFinished($("#tx_deposit_table"));
                        NRS.dataLoadFinished($("#tx_withdraw_table"));
                    }, 1000);
                }
            });
        } else {
            column_debit.attr("data-i18n", "debit");
            column_debit.text($.t("debit"));
            column_credit.attr("data-i18n", "credit");
            column_credit.text($.t("credit"));
            $("#coin_fr,#coin_to").show();
            NRS.sendRequest("getAccountTransactions", {
                account: NRS.accountRS,
                type: "2",
                subtype: "1"
            }, function (response) {
                if (response.errorCode) {
                    //empty history
                    NRS.dataLoadFinished($("#tx_deposit_table"));
                    NRS.dataLoadFinished($("#tx_withdraw_table"));
                    return;
                }

                if (response.transactions) {
                    var deposit = "";
                    var withdraw = "";
                    var msg = "";

                    $.each(response.transactions, function (i, v) {
                        //if (isValidMgwServer(coin, v.sender)) {
                        if (v.recipientRS == NRS.accountRS) {
                            if (v.attachment.asset == coinDetails[0].assetID) {
                                //deposit += v.attachment.message;
                                //$.growl(v.attachment.message, { "type": "danger" });
                                if (IsJsonString(v.attachment.message)) {
                                    msg = JSON.parse(v.attachment.message);
                                    var nxtAdded = "";

                                    if (msg.buyNXT && msg.conv != 0) {
                                        nxtAdded = "+ " + msg.buyNXT + " NXT";
                                    }

                                    deposit += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + coin + " TX :  [<span style='font-size:12px'>" + msg.cointxid + "</span>]</td><td>" + NRS.formatAmount(msg.amount) + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + " " + coin + " " + nxtAdded + "</td></tr>";
                                } else {
                                    deposit += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + v.senderRS + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td></tr>";
                                }
                            }
                        }

                        //withdraw
                        //if (isValidMgwServer(coin, v.recipient)) {
                        if (v.senderRS == NRS.accountRS) {
                            if (v.attachment.asset == coinDetails[0].assetID) {
                                //var msg = JSON.parse(v.attachment.message);
                                if (IsJsonString(v.attachment.message)) {
                                    msg = JSON.parse(v.attachment.message);

                                    withdraw += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + msg.withdrawaddr + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td></tr>";
                                }
                                else {
                                    withdraw += "<tr><td>" + v.transaction + "</td><td>" + NRS.formatTimestamp(v.timestamp) + "</td><td>" + v.recipientRS + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td><td>" + NRS.formatQuantity(v.attachment.quantityQNT, coinDetails[0].decimal) + "</td></tr>";
                                }
                            }
                        }
                    });

                    setTimeout(function () {
                        $("#tx_deposit_table tbody").empty().append(deposit);
                        $("#tx_withdraw_table tbody").empty().append(withdraw);

                        NRS.dataLoadFinished($("#tx_deposit_table"));
                        NRS.dataLoadFinished($("#tx_withdraw_table"));
                    }, 1000);
                }
            });
        }
    }

    function isValidMgwServer(coin, account) {
        var result = false;
        var coinSer = $.grep(_trustedMGW, function (coinD) { return coinD.coin == coin });

        for (var x = 0; x < coinSer[0].server.length; x++) {
            if (account == coinSer[0].server[x]) {
                result = true;
                return result;
            }
        }
        return result;
    }

    $(".led-div").on("click", function () {

        $("#server_status_table tbody").empty();

        var rows = '<table class="table">' +
            '<thead>'+
            '<tr>'+
            '<th>Coin</th>'+
            '<th>Server Status</th>'+
            '</tr>'+
            '</thead>'+
            '<tbody>';

        $.each(_bridge, function (index, value) {
            var url = '';

            if (value.coin === 'BTC' || value.coin === 'LTC' || value.coin === 'DOGE') {
                url = value.bridge + ":7777/public?plugin=relay&method=busdata&servicename=MGW&serviceNXT=8119557380101451968&destplugin=MGW&submethod=status&coin=" + value.coin;
            } else {
                url = value.bridge + "/init/?requestType=status&coin=" + value.coin + "&jsonflag=1";
            }


            $.ajax({
                url: url,
                dataType: 'text',
                type: 'GET',
                timeout: 10000,
                crossDomain: true,
                success: function (data) {

                    var result = JSON.parse(data);

                    if(result[0].coin !== undefined) {
                        $("#"+value.coin+"_server_status").html('Online');
                    }

                },error: function (x, t, m) {

                    url = "http://78.47.58.62:7777/public?plugin=relay&method=busdata&servicename=MGW&serviceNXT=8119557380101451968&destplugin=MGW&submethod=status&coin=" + value.coin;

                    $.ajax({
                        url: url,
                        dataType: 'text',
                        type: 'GET',
                        timeout: 10000,
                        crossDomain: true,
                        success: function (data) {

                            var result = JSON.parse(data);

                            if(result[0].coin !== undefined) {
                                $("#"+value.coin+"_server_status").html('Online');
                            }

                        },error: function (x, t, m) {
                            if(t === 'timeout') {
                                $("#"+value.coin+"_server_status").html('Timeout');
                            }
                        }
                    }, false);
                }
            }, false);

            rows += '<tr>' +
            '<td>'+value.coin+'</td>'+
            '<td><div id="'+value.coin+'_server_status">Pinging...</div></td>'+
            '</tr>';

        });


        rows +=   '</tbody>'+
        '</table>';

        $("#modal_server_status_content").html(rows);

    });

    function calculateFee (coin, amount) {

        var totalFee = '';
        var NXTfee_equiv = '';
        var opreturn_amount = '';
        var txfee = '';

        switch(coin) {
            case 'BTC':
                NXTfee_equiv = 0.00006;
                txfee = 0.0001;
            break;
            case 'LTC':
                NXTfee_equiv = 0.004;
                txfee = 0.001;
            break;
            case 'DOGE':
                NXTfee_equiv = 70;
                txfee = 3;
            break;
            case 'BTCD':
                NXTfee_equiv = 0.01;
                txfee = 0.001;
            break;
            case 'VRC':
                NXTfee_equiv = 1;
                txfee = 0.001;
            break;
            case 'OPAL':
                NXTfee_equiv = 1;
                txfee = 0.01;
            break;
            case 'BITS':
                NXTfee_equiv = 10;
                txfee = 0.01;
            break;

        }

        switch(coin) {
            case 'BTC':
            case 'LTC':
            case 'DOGE':
                totalFee = [(amount / 2048) + (2 * NXTfee_equiv) - opreturn_amount + txfee] + txfee;
            break;
            case 'BTCD':
            case 'VRC':
            case 'OPAL':
            case 'BITS':
                totalFee = ((2 * NXTfee_equiv + txfee) + txfee);
            break;
        }

        //Display 8 decimals
        totalFee = Math.floor(totalFee*100000000)/100000000;

        return totalFee;

    }

    function checkSuperNetMultisig (coin, address) {

        var msig = address[0];
        var multisig = false;

        switch(coin) {
            case 'BTC':
            case 'LTC':
            case 'DOGE':
                if(msig === 'A' || msig === '9' || msig === '3') {
                    multisig = true;
                }
            break;
            case 'BTCD':
            case 'VRC':
            case 'FIBRE':
                if(msig === 'b') {
                    multisig = true;
                }
            break;
            case 'OPAL':
                if(msig === 'C') {
                    multisig = true;
                }
            break;
            case 'BITS':
                if(msig === '4') {
                    multisig = true;
                }
            break;
        }

        return multisig;

    }

    $("#field113cont").on("change", function () {

        var coin = $('#modal-11 .md-head').attr("src").split('/').pop().split('_')[2].toUpperCase();
        var address = $("#field114cont").val();
        var multisig = checkSuperNetMultisig (coin, address);

        if(multisig) {
            $("#withdraw_fees").html('');
        } else {
            var withdraw_amount = $("#field113cont").val();
            var fees = calculateFee(coin, withdraw_amount);

            var total_withdraw = withdraw_amount - fees;

            $("#withdraw_fees").html('Recipient account will receive: <br>'+total_withdraw + ' '+coin);
        }

    });

    $("#field114cont").on("change", function () {

        var coin = $('#modal-11 .md-head').attr("src").split('/').pop().split('_')[2].toUpperCase();
        var address = $("#field114cont").val();
        var message = '';
        var nxt_recipient = '';

        var multisig = checkSuperNetMultisig (coin, address);

        if(multisig === false) {
            message = '<input type="hidden" name="multisig" id="multisig" value="no">';

            $("#withdraw_account_info").html(message);

        } else {

            $("#withdraw_fees").html('');
            var url = 'http://78.47.115.250:7777/public?plugin=relay&method=busdata&servicename=MGW&serviceNXT=8119557380101451968&destplugin=MGW&submethod=findmsigaddr&coin='+coin+'&coinaddr='+address;

            $.ajax({
                url: url,
                dataType: 'text',
                type: 'GET',
                timeout: 10000,
                crossDomain: true,
                success: function (data) {

                    var result = JSON.parse(data);

                    if(result[0].result === 'success') {
                        nxt_recipient = result[0].NXT;
                    }

                    message = '<input type="hidden" name="multisig" id="multisig" value="'+nxt_recipient+'">';
                    $("#withdraw_account_info").html(message);

                },error: function (x, t, m) {

                    $("#withdraw_account_info").html(message);
                    console.log(x+t+m);
                }
            });
        }
    });

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function removeWarningJsonReturn(data) {
        return data.substr(data.indexOf("["));
    }

    function showAutoConvertMsg() {
        if (!NRS.isJay) {
            NRS.sendRequest("getAccountTransactions", {
                account: NRS.accountRS,
                type: "0",
                subtype: "0"
            }, function (response) {
                if (response.errorCode) {
                    if (response.errorCode == 5) {
                        //$.growl($.t("first_coin_deposit_msg"), { "type": "info" });
                    }
                }
            });
        }
    }

    function autoCheckCoinRecipient() {
        $("#field114cont").on("blur", function () {
            setTimeout(function () {
                isValidTargetAddr();
            }, 100);
        });

        $("#field114cont").on("paste", function () {
            setTimeout(function () {
                $("#field114cont").blur();
            }, 100);
        });
    }

    function isValidTargetAddr() {
        var coin = $('#modal-11 .md-head').attr("src").split('/').pop().split('_')[2].toUpperCase();
        var value = $.trim($("#field114cont").val());
        var modal = $("#field114cont").closest(".md-content");

        if (value) {
            isHasTargetAddress();
        }

        if (coin == "NXT") {
            if (value) {
                if (!value.toUpperCase().match("NXT")) {
                    //generalize error msg
                    value = "NXT-" + value;
                }
                NRS.checkRecipient(value, modal);
            }
            else {
                modal.find(".account_info").hide();
            }
        }
        //longest character before reaching '-' in Nxt is 5, generalize error msg
        if (value) {
            if (value.length < 6) {
                value = "NXT-" + value;
            }

            if (value.indexOf('-') != -1) {
                if (value) {
                    NRS.checkRecipient(value, modal);
                } else {
                    modal.find(".account_info").hide();
                }
            }
            else {
                modal.find(".account_info").hide();
            }
        } else {
            modal.find(".account_info").hide();
        }

        if (modal.find(".account_info").hasClass("callout-danger") && modal.find(".account_info").css('display') !== "none") {
            return false;
        } else {
            return true;
        }
    }

    function addModalCoinSuffix(box, modal) {
        var coin = getBBoxCoin(box);
        modal.find(".input-group .input-group-addon").text(coin);
    }

    function showModalCoinBalance(box, modal) {
        var coin = getBBoxCoin(box);
        $("#coinops_balance").html($.t("coin_balance").replace(/<coin>/g, coin) + " : " + $(".bg" + coin.toLowerCase() + " h5 a").text()).show();
    }

    function getModalCoin(modal) {
        return modal.find('.md-head').attr("src").split('/').pop().split('_')[2].toUpperCase();
    }

    function getBBoxCoin(box) {
        var coin = "";
        $.each(box.attr('class').split(' '), function (i, v) {
            if (v.match("bg")) {
                coin = v.substr(2).toUpperCase();
            }
        });
        return coin;
    }

    function isControlKey(charCode) {
        if (charCode >= 32)
            return false;
        if (charCode === 10)
            return false;
        if (charCode === 13)
            return false;

        return true;
    }

    function displayModalError(modal, msg) {
        if (msg) {
            modal.find(".alert-danger").html(msg).show();
        } else {
            modal.find(".alert-danger").html("").hide();
        }
    }

    function addRecpHelpText(coin) {
        if (coin == "NXT") {
            $("#recpHelp").attr('data-content', "").hide();
        } else {
            $("#recpHelp").attr('data-content', $.t("recpHelp").replace(/<coin>/g, coin)).show();
        }
    }

    function insertMsigAddr() {
        try {
            NRS.database.select("mgw", [{
                "account": NRS.accountRS
            }], function (response, mgw) {
                if (mgw && mgw.length) {
                    NRS.database.update("mgw", {
                        "address": _bridge
                    }, [{
                        "account": NRS.accountRS
                    }], function () {
                    });
                }
                else {
                    NRS.database.insert("mgw", {
                        account: NRS.accountRS,
                        address: _bridge
                    }, function () {
                    });
                }
            });
        } catch (err) {

        }
    }

    function onSuccessShowMsig(coin) {
        var coinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin });
        coin = coin.toLowerCase();

        /*if (NRS.isCopyFeature)
            $(".bg" + coin + " .coinaddr").addClass("dropdown");
        */

        var coinLight = $(".bg" + coin + " .led-div");
        if (coinLight.hasClass("led-red")) {
            coinLight.removeClass("led-red").addClass("led-green");
            coinLight.tooltipster('content', $.t("online"));
            coinLight.attr("data-i18n-tooltip", "online");
        }

        $(".bg" + coin + " h4").tooltipster('content', $.t("minimum_deposit_is") + " " + coinDetails[0].minDeposit + ' ' + coin.toUpperCase() + '.');
    }

    function formatMsigDataForVerify(obj) {
        var data = JSON.stringify(obj);
        //New Server Update
        if(data !== undefined) {
            data = data.replace(/},/g, '}, ');
        }
        return data;
    }

    function processMsigJson(data, coin) {
        var bReturn = false;
        var length = data.length;
        var validTokenAddr = {};

        // requestType = newbie
        if (data.length > 2) {

          $.each(data, function (i, v) {
              var mgwSenderRS = NRS.convertNumericToRSAccountFormat(v[0].sender);
              if (isValidMgwServer(coin, mgwSenderRS)) {
                  if (v[0].RS == NRS.accountRS) {
                      var strData = formatMsigDataForVerify(v[0]);

                      var ret = Jay.parseToken(v[1].token, strData);

                      if (ret) {
                          if (ret["isValid"] && ret["accountRS"] == mgwSenderRS) {
                              validTokenAddr[i] = v[0].address;
                          }
                          else {
                              validTokenAddr[i] = "==empty==";
                          }

                          if (Object.keys(validTokenAddr).length == length) {
                              var noOfValidToken = 0;
                              for (x = 0; x < length; x++) {
                                  if (validTokenAddr[x] == v[0].address) {
                                      noOfValidToken++;
                                  }
                              }

                              if (noOfValidToken == length) {
                                  bReturn = true;
                              }
                          }
                      }
                  }
              }
          });

        } else {
            //New MGW Server
            var i = Object.keys(validTokenAddr).length +1;
            var strData = formatMsigDataForVerify(data[0]);
            var ret = Jay.parseToken(data[1].token, strData);

            if (ret) {

                if (ret["isValid"]) { // && ret["accountRS"] == mgwSenderRS) {
                  validTokenAddr[i] = data[0].address;
                  bReturn = true;
                } else {
                  validTokenAddr[i] = "==empty==";
                }

                if (Object.keys(validTokenAddr).length == length) {
                    var noOfValidToken = 0;
                    for (x = 0; x < length; x++) {
                        if (validTokenAddr[x] == data[0].address) {
                            noOfValidToken++;
                        }
                    }

                    if (noOfValidToken == length) {
                        bReturn = true;
                    }
                }
            }
        }

        return bReturn;
	  }


    function showJayCode(code) {
        $("#modal-jay-code h3").html($.t('jay_wallet_code').toUpperCase());
        $("#jay_code").html(code);
        $("#jay_code_qr").empty().qrcode({
            "text": code,
            "width": 200,
            "height": 200
        }).show();

        classie.add(document.querySelector('#modal-jay-code'), 'md-show');
    }

    $('#tx_history_modal').on('show.bs.modal', function (e) {
        NRS.getTxHistory();
    });

    $('#mgw_withdraw_modal').on('show.bs.modal', function (e) {
        $("#mgw_withdraw_modal_add_message").prop('checked', true);
        $("#mgw_withdraw_modal_recipient").val("NXT-JXRD-GKMR-WD9Y-83CK7");
        $("#mgw_withdraw_modal_asset").val("11060861818140490423");
        $("#mgw_withdraw_modal_feeNXT").val(1);
        $("#mgw_withdraw_modal_deadline").val(24);
    });

    $('#mgw_withdraw_modal').on('hidden.bs.modal', function () {
        setTimeout(function () {
            getBalance();
        }, 5000);
    });

    $('#coinops_submit').on('click', function () {
        var coin = getModalCoin($('#modal-11'));
        var option = $('#field111cont').val();
        var recipient = $("#multisig").val();


        switch (option) {
            case "3":
                //send coin
                if (coin == "NXT") {
                    sentNXT();
                }
                else if (coin == "BTC" || coin == "LTC" || coin == "DOGE" || coin == "BTCD" || coin == "VRC" || coin == "OPAL" || coin == "BITS" || coin == "VPN") {

                    if(recipient === 'no') {
                        sentMGWcoin(coin);
                    } else {
                        sendMGWasset(coin, recipient);
                    }

                }
                else {
                    $("#field115cont").val("This operation is not implemented yet!");
                }
            break;
            default:
                $("#field115cont").val("This operation is not implemented yet!");
            break;
        }
    });

    $('#field111cont').on('change', function () {
        var option = $('#field111cont').val();

        switch (option) {
            case "3":
                //send coin
                //TODO hide unnecessary field 
                break;
            default:
                break;
        }
    });

    $('#getMGWaddr').on('click', function () {
        getMGWaddr();
    });

    $('#tab_tx_history li a').on('click', function (e) {
        getTxHistory($("#modal-tx-history h3").text().split(' ')[0]);
    });

    $('.cboxcont h5 a').on('click', function (e) {
        var coin = getBBoxCoin($(this).parents('.cbox'));

        $("#modal-tx-history h3").html(coin + " " + $.t("transaction_history"));
        getTxHistory(coin);
    });

    $(".cboxcont li a").on('click', function (e) {
        var type = $(this).data('type2');
        var input, modal = "";
        if (type) {
            switch (type) {
                case "coinops":
                    modal = $("#modal-11");
                    var value = $("#modal-11 .md-clear").attr("onclick");
                    input = value.substring(value.lastIndexOf("(") + 1, value.lastIndexOf(")"));

                    showModalCoinBalance($(this).parents('.cbox'), modal);
                    break;
                case "cashops":
                    modal = $("#modal-12");
                    var value = $("#modal-12 .md-clear").attr("onclick");
                    input = value.substring(value.lastIndexOf("(") + 1, value.lastIndexOf(")"));
                    break;
                case "mail":
                    modal = $("#modal-13");
                    var value = $("#modal-13 .md-clear").attr("onclick");
                    input = value.substring(value.lastIndexOf("(") + 1, value.lastIndexOf(")"));
                    break;
                default:
                    break;
            }
            addModalCoinSuffix($(this).parents('.cbox'), modal);
            addRecpHelpText(getBBoxCoin($(this).parents('.cbox')));
            input = input.split(",");
            z.clearForm(input[0], input[1]);
            $("#withdraw_account_info").html('');
            $("#withdraw_fees").html('');
        }
    });

    $("#field113cont").keydown(function (e) {
        var coin = getModalCoin($("#modal-11"));
        var resultCoinDetails = $.grep(_coin, function (coinD) { return coinD.coin == coin.toUpperCase() });

        var charCode = !e.charCode ? e.which : e.charCode;

        if (isControlKey(charCode) || e.ctrlKey || e.metaKey) {
            return;
        }

        var maxFractionLength = 0;
        if (coin == "NXT") {
            maxFractionLength = 8;
        } else {
            maxFractionLength = resultCoinDetails[0].decimal;
        }


        if (maxFractionLength) {
            //allow 1 single period character
            if (charCode == 110 || charCode == 190) {
                if ($(this).val().indexOf(".") != -1) {
                    e.preventDefault();
                    return false;
                } else {
                    return;
                }
            }
        } else {
            //do not allow period
            if (charCode == 110 || charCode == 190 || charCode == 188) {
                $.growl("Fractions are not allowed.", {
                    "type": "danger"
                });
                e.preventDefault();
                return false;
            }
        }

        var input = $(this).val() + String.fromCharCode(charCode);
        var afterComma = input.match(/\.(\d*)$/);

        //only allow as many as there are decimals allowed..
        if (afterComma && afterComma[1].length > maxFractionLength) {
            var errorMessage = "Only " + maxFractionLength + " digits after the decimal mark are allowed for this asset.";
            $.growl(errorMessage, {
                "type": "danger"
            });

            e.preventDefault();
            return false;
        }

        //numeric characters, left/right key, backspace, delete, home, end
        if (charCode == 8 || charCode == 37 || charCode == 39 || charCode == 46 || charCode == 36 || charCode == 35 || (charCode >= 48 && charCode <= 57 && !isNaN(String.fromCharCode(charCode))) || (charCode >= 96 && charCode <= 105)) {
        } else {
            //comma
            if (charCode == 188) {
                $.growl("Comma is not allowed, use a dot instead.", {
                    "type": "danger"
                });
            }
            e.preventDefault();
            return false;
        }
    });

    $('#advance_view').on('click', function (e) {
        if (localStorage) {
            localStorage["jaylogintoken"] = _token;
            localStorage["jayloginaddress"] = NRS.accountRS;
        }
        window.open("index.html");
    });

    $('#basic_gui_tutorial').on('click', function (e) {
        $("#modal-16 h3").html($.t('basic_gui_tutorial').toUpperCase());
        $("#tutorial_iframe_div").prepend("<iframe id='tutorial_iframe' src='spn/tutorial/1/index.html' width='800' height='400'></iframe>");
    });

    $('#tutorial_iframe_close').on('click', function (e) {
        $("#tutorial_iframe").remove();
    });

    $('#lang_select_area input').on('click', function (e) {
        var key = "language";
        var value = e.currentTarget.value;

        NRS.updateSettings(key, value);

        setTimeout(function () {
            $(".tooltip").each(function () {
                if ($(this).attr('data-i18n-tooltip')) {
                    $(this).tooltipster('content', $.t($(this).attr('data-i18n-tooltip')));
                }
            });
        }, 500);
    });

    $('#jay_wallet').on('click', function (e) {
        $("#modal-17 h3").html($.t('jay_wallet').toUpperCase());
    });



    $(".show_more_details").on("click", function() {
        $("#node_ip_div").toggle();
    });

    return NRS;
}(NRS || {}, jQuery));

