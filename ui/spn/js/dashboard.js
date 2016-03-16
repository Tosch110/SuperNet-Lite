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

var NRS = (function (NRS, $, undefined) {
    var isDebug = false;
    //var initNewbieURL = " http://jnxt.org";
    var _password;
    var _token;
    var _publicKey;
    var hasCoinAddressFail = false;

    //Insert new BTC/LTC/DOGE MGW Server IP's into Array
    var serverBTC = ['78.47.115.250', '78.47.58.62'];
    var randomBTC =  Math.round(Math.random() * (serverBTC.length - 1));

    var _bridge = [
    { "coin": "BTC", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "LTC", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "DOGE", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "BTCD", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    //{ "coin": "BITS", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "OPAL", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "VRC", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" },
    { "coin": "INFX", "bridge": "http://"+serverBTC[randomBTC], "msigAddr": "" }
    //{ "coin": "VPN", "bridge": "http://178.63.60.131", "msigAddr": "" }
    ];

    var _coin = [
    { "coin": "BTC", "assetID": "12659653638116877017", "decimal": 8, "depositConfirmation": "3", "balance": 0, "minWithdraw": 0.001, "maxWithdraw": 9.9, "minDeposit": 0.001 },
    { "coin": "LTC", "assetID": "125609428220063838", "decimal": 4, "depositConfirmation": "10", "balance":0, "minWithdraw": 0.05,"maxWithdraw": 499, "minDeposit": 0.05 },
    { "coin": "DOGE", "assetID": "16344939950195952527", "decimal": 4, "depositConfirmation": "10", "balance":0, "minWithdraw": 500,"maxWithdraw": 9999999, "minDeposit": 500 },
    { "coin": "BTCD", "assetID": "6918149200730574743", "decimal": 4, "depositConfirmation": "10", "balance": 0, "minWithdraw": 0.5,"maxWithdraw": 999, "minDeposit": 0.5 },
    { "coin": "VRC", "assetID": "9037144112883608562", "decimal": 8, "depositConfirmation": "10", "balance": 0, "minWithdraw": 50,"maxWithdraw": 49999, "minDeposit": 50 },
    { "coin": "OPAL", "assetID": "6775076774325697454", "decimal": 8, "depositConfirmation": "6", "balance": 0, "minWithdraw": 50,"maxWithdraw": 999999, "minDeposit": 50 },
    { "coin": "INFX", "assetID": "5378783389140157313", "decimal": 4, "depositConfirmation": "6", "balance": 0, "minWithdraw": 50,"maxWithdraw": 999999, "minDeposit": 50 }
    //{ "coin": "BITS", "assetID": "13120372057981370228", "decimal": 6, "depositConfirmation": "20", "balance": 0, "minWithdraw": 500,"maxWithdraw": 480000, "minDeposit": 500 }
    //{ "coin": "VPN", "assetID": "7734432159113182240", "decimal": 4, "depositConfirmation": "10", "balance": 0, "minWithdraw": 5000,"maxWithdraw": 80000, "minDeposit": 5000 }
    ];

    var _coinMGW = [
    { "coin": "BTC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "LTC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "DOGE", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "BTCD", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "VRC", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "OPAL", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" },
    { "coin": "INFX", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" }
    //{ "coin": "BITS", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" }
    //{ "coin": "VPN", "accountRS": "NXT-8RQH-HFUP-3AJ9-E2DB9" }
    ];

    var _trustedMGW = [
    { "coin": "BTC", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "LTC", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "DOGE", "server": ["NXT-GKRW-428K-XADP-5Q5UN", "NXT-7LT9-M4YX-3AK3-7Q59G", "NXT-XBWY-K4K2-S8UA-68BL5"] },
    { "coin": "BTCD", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "VRC", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "OPAL", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] },
    { "coin": "INFX", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] }
    //{ "coin": "BITS", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] }
    //{ "coin": "VPN", "server": ["NXT-M3PZ-B7U2-359G-4VXAJ", "NXT-4R55-GPLW-DRYV-HMVEK", "NXT-PPPK-GBAU-6U4V-9NSMX", "NXT-XXQB-S9RV-AZB4-9N4BB"] }
    ];

    //Workaround check for BTC/LTC/DOGE to have all three MGW servers checked for multisig address.
    var gateWayBTC = [false, false, false];
    var gateWayLTC = [false, false, false];
    var gateWayDOGE = [false, false, false];
    //var gateWayBITS = [false, false, false];
    var gateWayOPAL = [false, false, false];
    var gateWayBTCD = [false, false, false];
    var gateWayVRC = [false, false, false];
    var gateWayINFX = [false, false, false];

    NRS.setSuperNETPassword = function (password) {
        _password = password;
    };

    NRS.setSuperNETToken = function (token) {
        _token = token;
    };

    NRS.mgwv1init = function () {
        //initActiveCoin();
        //checkMSIGAdresses ();
    };

    NRS.spnInit = function () {
        getMsigDepositAddress();
        setInterval(function () {

            var createMsig = $(".create_msig");

            if(createMsig.hasClass("disabled")) {
                createMsig.removeClass("disabled");
                createMsig.html("Generate Address");

                createMsig.on("click", function () {

                    var coin = $(this).data("coin");
                    var index = $(this).data("bridgeid");
                    var lowcase_coin = coin.toLowerCase();
                    var fncoinaddr = $(".bg"+lowcase_coin+" .coinaddr h4");

                    fncoinaddr.html('<button class="create_msig btn btn-default btn-xs disabled" data-bridgeid="'+index+'" data-coin="'+coin+'">Generating address...</button>');

                    var url = getRelayUrl(_bridge[index].bridge, coin);

                    var getRelayMsig = getRelayMSIG(_bridge[index].bridge,url, coin, index, 1);
                });

            }
        }, 80000);
    };


    NRS.publicKey = function() {

        _publicKey = Jay.secretPhraseToPublicKey(_password);
        return _publicKey;

    };

    NRS.spnNewBlock = function () {
        getBalance();
        /*if (!NRS.serverConnect) {
            NRS.getServerStatus(NRS.state.lastBlockchainFeederHeight);
        }*/
    };

    function getMsigDepositAddress() {
        showDashboard();

        if (!NRS.isJay) {
            checkMSIGAdresses();
        }
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
            account: NRS.accountRS,
            "includeAssetInfo": true
        }, function (response) {

            if (response.accountAssets) {
                $.each(response.accountAssets, function (i, v) {
                    var coinDetails = $.grep(_coin, function (coinD) { return coinD.assetID == v.asset });

                    if (coinDetails.length > 0) {

                        var balance = v.unconfirmedQuantityQNT / Math.pow(10, coinDetails[0].decimal);
                        //var balance = NRS.convertToNXT(new BigInteger(v.unconfirmedQuantityQNT).multiply(new BigInteger(Math.pow(10, 8 - coinDetails[0].decimals).toString())));

                        coinDetails[0].balance = balance;
                    }
                });
            }

            $.each(_coin, function (i, v) {
                $(".bg" + v.coin.toLowerCase() + " h5 a").html(NRS.formatStyledAmount(NRS.convertToNQT(v.balance)));
            });
        });

        NRS.sendRequest("getAccount", {
            account: NRS.accountRS,
            "includeAssets" : "true",
            "includeCurrencies" : "true",
            "includeEffectiveBalance" : "true"
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

    function checkMSIGAdresses () {


        $.each(_bridge, function (index, coin_bridge) {

            var coin = _bridge[index].coin;
            var key = "mgw-" + NRS.accountRS + "-" + coin;
            var lowcase_coin = coin.toLowerCase();

            if (localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    var data = JSON.parse(localStorage[key]);
                    //console.log(data);
                    if(data[0].requestType === undefined) {
                        localStorage.removeItem(key);
                        $(".bg"+lowcase_coin+" .coinaddr h4").html('<button class="create_msig btn btn-default btn-xs" data-bridgeid="'+index+'" data-coin="'+coin+'">Generate address</button>');

                    } else {

                        if (processMsigJson(data, coin)) {
                            showDepositAddr(data, coin);

                        }
                    }
                } else {
                    $(".bg"+lowcase_coin+" .coinaddr h4").html('<button class="create_msig btn btn-default btn-xs" data-bridgeid="'+index+'" data-coin="'+coin+'">Generate address</button>');
                }
            }
        });

        $(".create_msig").on("click", function () {


            var coin = $(this).data("coin");
            var index = $(this).data("bridgeid");
            var lowcase_coin = coin.toLowerCase();
            var fncoinaddr = $(".bg"+lowcase_coin+" .coinaddr h4");

            fncoinaddr.html('<button class="create_msig btn btn-default btn-xs disabled" data-bridgeid="'+index+'" data-coin="'+coin+'">Generating address...</button>');

            var url = getRelayUrl(_bridge[index].bridge, coin);

            var getRelayMsig = getRelayMSIG(_bridge[index].bridge,url, coin, index, 1);

        });


    }

    function getRelayMSIG (bridge, url, coin, index, tries) {


        if (!localStorage["mgw-" + NRS.accountRS + "-" + coin]) {


            $.ajax({
                url: url,
                dataType: 'text',
                type: 'GET',
                timeout: 3000,
                crossDomain: true,
                success: function (data) {

                    if (!IsJsonString(data)) {
                        data = removeWarningJsonReturn(data);
                    }
                    data = JSON.parse(data);
                    //Get deposit address confirmed by all 3 servers
                    if(data[0].gatewayid !== undefined) {
                     switch(coin) {
                         case 'BTC':
                             gateWayBTC[data[0].gatewayid] = true;
                             if (gateWayBTC[0] === false || gateWayBTC[1] === false || gateWayBTC[2] === false) {
                                 setTimeout(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },3100);
                            }
                         break;
                         case 'LTC':
                             gateWayLTC[data[0].gatewayid] = true;
                             if (gateWayLTC[0] === false || gateWayLTC[1] === false || gateWayLTC[2] === false) {
                                 setTimeout(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },3100);
                            }
                         break;
                         case 'DOGE':
                             gateWayDOGE[data[0].gatewayid] = true;
                             if (gateWayDOGE[0] === false || gateWayDOGE[1] === false || gateWayDOGE[2] === false) {
                                 setTimeout(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },3100);
                             }
                         break;
                         case 'BTCD':
                             gateWayBTCD[data[0].gatewayid] = true;
                             if (gateWayBTCD[0] === false || gateWayBTCD[1] === false || gateWayBTCD[2] === false) {
                                 setTimeout(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },3100);
                             }
                         break;
                         case 'VRC':
                             gateWayVRC[data[0].gatewayid] = true;
                             if (gateWayVRC[0] === false || gateWayVRC[1] === false || gateWayVRC[2] === false) {
                                 setTimeout(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },3100);
                             }
                         break;
                         case 'INFX':
                             gateWayINFX[data[0].gatewayid] = true;
                             if (gateWayINFX[0] === false || gateWayINFX[1] === false || gateWayINFX[2] === false) {
                                 setInterval(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },2000);
                             }
                         break;
                         case 'OPAL':
                             gateWayOPAL[data[0].gatewayid] = true;
                             if (gateWayOPAL[0] === false || gateWayOPAL[1] === false || gateWayOPAL[2] === false) {
                                 setInterval(function () {
                                     getRelayMSIG(bridge,url,coin,index, tries++);
                                 },2000);
                             }
                         break;
                         }
                     }

                    if (processMsigJson(data, coin)) {
                        if (localStorage) {
                            localStorage["mgw-" + NRS.accountRS + "-" + coin] = JSON.stringify(data);
                        }
                        showDepositAddr(data, coin);
                    }
                },
                error: function () {


                    var tries_amount = serverBTC.length *4;
                    if(tries < tries_amount) {
                        $.each(serverBTC, function (index_server, value) {

                            var server_value = 'http://'+value;
                            if(server_value !== bridge) {
                                var url = getRelayUrl(server_value, coin);

                                setTimeout(function () { getRelayMSIG(server_value, url, coin,index, tries++); }, 3100);
                            }

                        });
                    }
                }
            });

        } else {

            var data = JSON.parse(localStorage["mgw-" + NRS.accountRS + "-" + coin]);
            if (data[0].requestType === undefined) {

                localStorage.removeItem("mgw-" + NRS.accountRS + "-" + coin);
                getRelayMSIG (bridge, url, coin, index, tries);

            }

        }


    }


    function getRelayUrl (bridge, coin) {


        var url = '';
        var key = "mgw-" + NRS.accountRS + "-" + coin;
        var serviceNXT = '';
        var timeout = 5000;
        var serviceName = '';

        if (coin === "BTC" || coin === "LTC" || coin === "DOGE") {
            serviceNXT = '8119557380101451968';
            serviceName = 'MGW';
        } else {
            serviceNXT= '979761099870142788';
            serviceName = 'MGWcc';
        }

        url = bridge +  ":7777/public?plugin=relay";
        url += "&method=busdata";
        url += "&servicename="+serviceName;
        url += "&serviceNXT="+serviceNXT;
        url += "&destplugin=MGW";
        url += "&submethod=msigaddr";
        url += "&coin=" + coin;
        url += "&userNXT=" + NRS.accountRS;
        url += "&userpubkey=" + NRS.publicKey;
        url += "&timeout=" + timeout;

        return url;
    }

    function showDepositAddr(data, coin) {

        var coinBridge = '';
        var error = '';
        var lowcase_coin = coin.toLowerCase();
        var coinTitle = $(".bg"+lowcase_coin+" .coinaddr h4");


        if(data[0].error !== undefined) {
            error = 'error: '+data[0].error;
        }

        if(data[0].error !== 'timeout') {

            if (data[0][0]) {

                coinBridge = $.grep(_bridge, function (coinD) { return coinD.coin == coin });
                coinTitle.html(data[0][0].address);
                coinBridge[0].msigAddr = data[0][0].address;

                onSuccessShowMsig(data[0][0].coin);

            } else {

              coin = data[0].coin;

                var address = data[0].address;

                coinBridge = $.grep(_bridge, function (coinD) { return coinD.coin == coin });
                coinTitle.html(address);
                coinBridge[0].msigAddr = address;

                onSuccessShowMsig(coin);
            }

        } else {

            $(".coinaddr").children().removeClass("disabled");
            $.growl("The servers seem to be busy, please try again in a few minutes", {
                "type": "danger"
            });
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
        var message = '{"withdrawaddr":"' + $.trim($("#field114cont").val()) + '"}';
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
                    feeNQT: "0",
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
                feeNQT: "0",
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
            //balanceNQT = new Big(coinDetails[0].balance.toString());
            //withdrawAmountNQT = new Big(NRS.convertToQNT($("#field113cont").val(), coinDetails[0].decimal).toString());

            if ($("#field113cont").val() > coinDetails[0].balance) {
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
            NRS.sendRequest("getBlockchainTransactions", {
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
            NRS.sendRequest("getBlockchainTransactions", {
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
            case 'INFX':
                NXTfee_equiv = 1;
                txfee = 0.01;
            break;
            case 'BITS':
                NXTfee_equiv = 10;
                txfee = 0.01;
            break;

        }

        totalFee = (((amount / 2048) + (2 * NXTfee_equiv) - opreturn_amount) + txfee) + txfee;

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
            case 'INFX':
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

    //Get rid of ' in number when copy-paste sending amount
    $('#field113cont').on('input change', function() {
        var amount_field = $("#field113cont").val();
        var am_rep = amount_field.replace(/'/g, '');
        $("#field113cont").val(am_rep);
    });


    //Sending amount, show fees if MGW, do not show when NXT or SuperNET Account
    $("#field113cont").change(function () {

        var coin = $('#modal-11 .md-head').attr("src").split('/').pop().split('_')[2].toUpperCase();
        var address = $("#field114cont").val();
        var multisig = false;
        //Check if recipient is NXT account
        if(address[0] === 'N' || coin === 'NXT') {
            multisig = true;
        } else {
            multisig = checkSuperNetMultisig (coin, address);
        }
        if(multisig) {
            $("#withdraw_fees").html('');
        } else {
            var withdraw_amount = $("#field113cont").val();
            var fees = calculateFee(coin, withdraw_amount);

            var total_withdraw = withdraw_amount - fees;

            $("#withdraw_fees").html('Recipient account will receive: <br>'+total_withdraw + ' '+coin);
        }

    });

    //Recipient field information
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
        coin = coinDetails[0].coin.toLowerCase();

        /*if (NRS.isCopyFeature)
            $(".bg" + coin + " .coinaddr").addClass("dropdown");
        */

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

        //send coin
        if (coin == "NXT") {
            sentNXT();
        }
        else if (coin == "BTC" || coin == "LTC" || coin == "DOGE" || coin == "BTCD" || coin == "VRC" || coin == "OPAL" || coin == "INFX" || coin == "BITS" || coin == "VPN") {

            if(recipient === 'no') {
                sentMGWcoin(coin);
            } else {
                sendMGWasset(coin, recipient);
            }

        }
        else {
            $("#field115cont").val("This operation is not implemented yet!");
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

    $(".gettxhistory").on("click", function () {
        var coin = getBBoxCoin($(this).parents('.cbox'));

        $("#modal-tx-history h3").html(coin + " " + $.t("transaction_history"));
        getTxHistory(coin);

    });

    $(".cboxcont li a").on('click', function (e) {
        var type = $(this).data('type2');
        var input,value, modal = "";
        if (type) {
            switch (type) {
                case "coinops":
                    modal = $("#modal-11");
                    value = $("#modal-11 .md-clear").attr("onclick");
                    input = value.substring(value.lastIndexOf("(") + 1, value.lastIndexOf(")"));

                    showModalCoinBalance($(this).parents('.cbox'), modal);
                    break;
                case "cashops":
                    modal = $("#modal-12");
                    value = $("#modal-12 .md-clear").attr("onclick");
                    input = value.substring(value.lastIndexOf("(") + 1, value.lastIndexOf(")"));
                    $("#cash_operation_coin").val($(this).data("type"));
                    break;
                case "mail":
                    modal = $("#modal-13");
                    value = $("#modal-13 .md-clear").attr("onclick");
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


        if($(this).val() > resultCoinDetails[0].maxWithdraw) {
            $(this).val(resultCoinDetails[0].maxWithdraw);
            $.growl("Maximum "+resultCoinDetails[0].coin + " withdraw is "+resultCoinDetails[0].maxWithdraw+" "+resultCoinDetails[0].coin, {
                "type": "danger"
            });
            e.preventDefault();
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

