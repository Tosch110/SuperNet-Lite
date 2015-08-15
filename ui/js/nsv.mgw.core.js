var MGW = (function (MGW, $, undefined) {
    var isSearchingAM = false;

    var mgwCoinDetails = [
    { "coin": "BTC", "assetID": "17554243582654188572", "decimal": "8", "depositConfirmation": "6" },
    //{ "coin": "LTC", "assetID": "2881764795164526882", "decimal": "4", "depositConfirmation": "6" },
    { "coin": "BTCD", "assetID": "11060861818140490423", "decimal": "4", "depositConfirmation": "10" },
    { "coin": "VIA", "assetID": "275548135983837356", "decimal": "4", "depositConfirmation": "10" },
    { "coin": "DOGE", "assetID": "2303962892272487643", "decimal": "4", "depositConfirmation": "5" },
    { "coin": "BC", "assetID": "7117580438310874759", "decimal": "4", "depositConfirmation": "5" }
    ];

    var mgwCoinFees = [
    { "coin": "BTC", "minDeposit": 0.0005, "minWithdraw": 0.0005, "mgwFees": 0.0001, "blockchainFees": 0.0001 },
    //{ "coin": "LTC", "minDeposit": 0.05, "minWithdraw": 0.05, "mgwFees": 0.01, "blockchainFees": 0.001 },
    { "coin": "BTCD", "minDeposit": 0.05, "minWithdraw": 0.05, "mgwFees": 0.01, "blockchainFees": 0.0001 },
    { "coin": "VIA", "minDeposit": 1, "minWithdraw": 1, "mgwFees": 0.18, "blockchainFees": 0.006 },
    { "coin": "DOGE", "minDeposit": 1155, "minWithdraw": 1155, "mgwFees": 230, "blockchainFees": 1 },
    { "coin": "BC", "minDeposit": 4, "minWithdraw": 4, "mgwFees": 0.6, "blockchainFees": 0.01 }
    ];

    var mgwCoinMultigateway = [
    { "coin": "BTC", "accountRS": "NXT-3TKA-UH62-478B-DQU6K" },
    //{ "coin": "LTC", "accountRS": "NXT-JXRD-GKMR-WD9Y-83CK7" },
    { "coin": "BTCD", "accountRS": "NXT-JXRD-GKMR-WD9Y-83CK7" },
    { "coin": "VIA", "accountRS": "NXT-HHDX-PVDT-TV54-ADBHC" },
    { "coin": "DOGE", "accountRS": "NXT-HHDX-PVDT-TV54-ADBHC" },
    { "coin": "BC", "accountRS": "NXT-HHDX-PVDT-TV54-ADBHC" }
    ];

    var mgwCoinMgwServer = [
    { "coin": "BTC", "server": ["8593269027165738667", "2986384496629142530", "2406158154854548637", "12736719038753962716"] },
    //{ "coin": "LTC", "server": ["423766016895692955", "12240549928875772593", "8279528579993996036", "5723512772332443130", "15740288657919119263"] },
    { "coin": "BTCD", "server": ["423766016895692955", "12240549928875772593", "8279528579993996036", "5723512772332443130", "15740288657919119263"] },
    { "coin": "VIA", "server": ["14055196676487904531", "14515002426250828177", "4683763953228439523"] },
    { "coin": "DOGE", "server": ["14055196676487904531", "14515002426250828177", "4683763953228439523"] },
    { "coin": "BC", "server": ["14055196676487904531", "14515002426250828177", "4683763953228439523"] }
    ];

    var mgwCoinDepositJson = [
    { "coin": "BTC", "jsonAM": '{"BTC":""}', "gateway": "94c8f273" },
    //{ "coin": "LTC", "jsonAM": '{"BTC":"","LTC":"","DOGE":"","DRK":"","CGB":""}', "gateway": "faeedbba" },
    { "coin": "BTCD", "jsonAM": '{"BTCD":""}', "gateway": "faeedbba" },
    { "coin": "VIA", "jsonAM": '{"VIA":"","DOGE":"","BC":""}', "gateway": "a11c7c21" },
    { "coin": "DOGE", "jsonAM": '{"VIA":"","DOGE":"","BC":""}', "gateway": "a11c7c21" },
    { "coin": "BC", "jsonAM": '{"VIA":"","DOGE":"","BC":""}', "gateway": "a11c7c21" }
    ];

    var mgwCoinDepositAddr = [
    { "coin": "BTC", "depositAddr": "" },
    //{ "coin": "LTC", "depositAddr": "" },
    { "coin": "BTCD", "depositAddr": "" },
    { "coin": "VIA", "depositAddr": "" },
    { "coin": "DOGE", "depositAddr": "" },
    { "coin": "BC", "depositAddr": "" }
    ];

    var mgwCoin = "";
    var mgwCoinAssetID = "";
    var mgwCoinDecimal = 0;
    var mgwCoinBalance = 0;
    var mgwCoinUnconfirmedBalance = 0;

    var tour = null;

    $(document).ready(function () {
        $("#mgw_coinlist").select2({
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) { return m; }
        });
    });

    MGW.initAfterLogin = function () {
        MGW.changeCoin("BTC");
        MGW.refreshMGW(true);

    }
    MGW.newBlockInit = function () {
        MGW.refreshMGW(NRS.lastBlockHeight % 10 == 0)
    }

    MGW.initTour = function () {
        tour = new Tour({
            steps: [
            {
                orphan: true,
                backdrop: true,
                title: "Welcome to Multigateway Tour",
                content: "Click <a href='http://nxtra.org/faucet/' target='_blank'>here</a> to start your tour with some free NXT.<br/><br/>Your account ID is: <br/><b>" + NRS.accountRS + "</b>"
            },
            {
                element: "#mgw_coinlist_div",
                placement: 'left',
                title: "Supported Coin List",
                content: "Click here for a list of supported coins in Multigateway."
            },
            {
                element: "#mgw_deposit_top_label",
                placement: 'right',
                title: "Deposit Address",
                content: "When the searching is completed, generate your MGW converting account to deposit your preferred coin and start trading in asset exchange."
            },
            {
                element: "#mgw_balance_div",
                placement: 'right',
                title: "Asset Balance",
                content: "Trade with your balance shown here."
            }
            ,
            {
                element: "#sidebar_asset_exchange",
                placement: 'top',
                title: "Asset Exchange",
                content: "Experience your first trading in asset exchange."
            },
            {
                element: "#mgw_withdraw_top_label",
                placement: 'left',
                title: "Withdraw Account Balance",
                content: "Send your MGW account balance to your personal coin wallet."
            }
            ]
        });

        tour.init();
    }


    MGW.initCoinDetails = function () {
        var result = $.grep(mgwCoinDetails, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });
        mgwCoinAssetID = result[0].assetID;
        mgwCoinDecimal = parseInt(result[0].decimal);

        $("#mgw_coin_asset_id").text(result[0].assetID);
        $("#mgw_coin_confirmation").text(result[0].depositConfirmation);
        
        $("#mgw_coin_tab").html("<img src='img/mgw/" + mgwCoin + ".png'/> " + mgwCoin);
        $("#mgw_coin_asset_id_label").text("mgw" + mgwCoin + " Asset ID");
        $("#mgw_coin_withdraw_addr").attr("placeholder", mgwCoin + " Wallet Address");
        $("#mgw_coin_withdraw_confirmation").attr("src", "img/mgw/" + mgwCoin + ".png");

        for (var x = 1; x <= 22; x++) {
            $("#mgw_coin" + x).text(mgwCoin);
        }
    }
    MGW.initCoinFees = function () {
        var result = $.grep(mgwCoinFees, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });
        $("#mgw_coin_blockchain_fee").attr("placeholder", result[0].blockchainFees);
        $("#mgw_coin_mgw_fee").attr("placeholder", result[0].mgwFees);
        $("#mgw_coin_min_withdraw").text(result[0].minWithdraw);

        for (var x = 1; x <= 2; x++) {
            $("#mgw_coin_min_deposit" + x).text(result[0].minDeposit);
        }
    }
    MGW.initCoinAssetBalance = function () {
        mgwCoinBalance = 0;
        mgwCoinUnconfirmedBalance = 0;
        try {
            for (var i = 0; i < NRS.accountInfo.assetBalances.length; i++) {
                if (NRS.accountInfo.assetBalances[i].asset == mgwCoinAssetID) {
                    mgwCoinBalance = NRS.convertToNXT(new BigInteger(NRS.accountInfo.assetBalances[i].balanceQNT.toString()).multiply(new BigInteger(Math.pow(10, 8 - mgwCoinDecimal).toString())));
                }
            }

            for (var i = 0; i < NRS.accountInfo.unconfirmedAssetBalances.length; i++) {
                var balance = NRS.accountInfo.unconfirmedAssetBalances[i];

                if (balance.asset == mgwCoinAssetID) {
                    mgwCoinUnconfirmedBalance = NRS.convertToNXT(new BigInteger(balance.unconfirmedBalanceQNT.toString()).multiply(new BigInteger(Math.pow(10, 8 - mgwCoinDecimal).toString())));
                }
            }
            $("#mgw_coin_balance").text(mgwCoinBalance);
            $("#mgw_coin_unconfirmed_balance").text(mgwCoinUnconfirmedBalance);

            var array = mgwCoinUnconfirmedBalance.toString().split('.');
            if (array.length > 1) {
                $("#mgw_coin_asset_balance").text(array[0]);
                $("#mgw_coin_asset_balance_decimal").text("." + array[1]);
            }
            else {
                $("#mgw_coin_asset_balance").text(array[0]);
                $("#mgw_coin_asset_balance_decimal").text('');
            }
        }
        catch (ex) {
            mgwCoinBalance = 0;
            mgwCoinUnconfirmedBalance = 0;
            $("#mgw_coin_asset_balance").text('0');
            $("#mgw_coin_asset_balance_decimal").text('');
            $("#mgw_coin_balance").text('0');
            $("#mgw_coin_unconfirmed_balance").text('0');
        }
    }
    MGW.initDepositAddr = function (bIsStartSearch) {
        var result = $.grep(mgwCoinDepositAddr, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });
        var resultTXID = [];

        if (!isSearchingAM) {
            if (bIsStartSearch) {
                isSearchingAM = true;
                if (result[0].depositAddr == "") {
                    $("#mgw_coin_gendeposit_loading_div").show();
                    $("#mgw_coin_gendeposit_div").hide();
                    $("#mgw_coin_deposit_addr_div").hide();
                }

                var mgwAccount = MGW.getMGWdistinctAccount();

                $.each(mgwAccount, function (mgwAccountIndex, mgwAccountValue) {
                    $.ajax({
                        url: '/nxt?requestType=getAccountTransactionIds&account=' + mgwAccountValue + '&timestamp=0&type=1&subtype=0',
                        dataType: 'json',
                        async: false,
                        success: function (result) {
                            $.each(result["transactionIds"], function (txidIndex, txidValue) {
                                resultTXID.push(txidValue);
                            });
                        }
                    });
                });

                MGW.loopAM(resultTXID, 0);
            }
            else {
                MGW.initDepositAddrDone();
            }
        }
    }
    MGW.getMGWdistinctAccount = function () {
        var result = [];

        $.each(mgwCoinMultigateway, function (i, v) {
            if ($.inArray(v["accountRS"], result) == -1) result.push(v["accountRS"]);
        });
        return result;
    }
    MGW.initDepositAddrDone = function () {
        var result = $.grep(mgwCoinDepositAddr, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });

        if (result[0].depositAddr != "") {
            $("#mgw_coin_gendeposit_loading_div").hide();
            $("#mgw_coin_gendeposit_div").hide();
            $("#mgw_coin_deposit_addr_div").show();

            $("#mgw_coin_deposit_addr").text(result[0].depositAddr);
        }
        else {
            $("#mgw_coin_gendeposit_loading_div").hide();
            $("#mgw_coin_gendeposit_div").show();
            $("#mgw_coin_deposit_addr_div").hide();

            $("#mgw_coin_deposit_addr").text("");
        }

        $("#mgw_coin_deposit_pct").css('width', 0 + '%');
        $("#mgw_coin_deposit_pct").html(0 + '%');
    }

    MGW.refreshMGW = function (bIsStartSearch) {
        MGW.refreshAsset();
        MGW.initDepositAddr(bIsStartSearch);
    }
    MGW.refreshAsset = function () {
        MGW.initializeShowLoading();

        setTimeout(function () {
            MGW.initCoinAssetBalance();

            MGW.initializeHideLoading();
        }, 1500);
    }

    MGW.initializeShowLoading = function () {
        $("#mgw_coin_asset_balance_loading").show();
        $("#mgw_coin_asset_balance").hide();
        $("#mgw_coin_asset_balance_decimal").hide();
    }
    MGW.initializeHideLoading = function () {
        $("#mgw_coin_asset_balance_loading").hide();
        $("#mgw_coin_asset_balance").show();
        $("#mgw_coin_asset_balance_decimal").show();
    }

    MGW.loopAM = function (array, count) {
        bCont = true;
        var pct = Math.round((count / array.length) * 100);

        $("#mgw_coin_deposit_pct").css('width', pct + '%');
        $("#mgw_coin_deposit_pct").html(pct + '%');

        try {
            $.ajax({
                url: '/nxt?requestType=getTransaction&transaction=' + array[count],
                dataType: 'json',
                async: true,
                success: function (data) {
                    try {
                        if (count < array.length) {
                            var strHex = data.attachment.message;
                            strHex = strHex.toString().substring(64);
                            var strMsg = converters.hexStringToString(strHex);

                            var jsonMsg = $.parseJSON(strMsg);

                            if (jsonMsg.NXTaddr == NRS.account) {
                                var result = $.grep(mgwCoinDepositAddr, function (_mgwCoin) { return _mgwCoin.coin == jsonMsg.coin });
                                if (result.length == 1) {
                                    var resultServer = $.grep(mgwCoinMgwServer, function (_mgwCoinServer) { return _mgwCoinServer.coin == jsonMsg.coin });

                                    for (var x = 0; x < resultServer[0].server.length; x++) {
                                        if (data.sender == resultServer[0].server[x]) {
                                            result[0].depositAddr = jsonMsg.address;
                                        }
                                        else {
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            bCont = false;
                            MGW.initDepositAddrDone();
                        }

                        if (bCont) {
                            MGW.loopAM(array, count + 1);
                        }
                        else
                        {
                            isSearchingAM = false;
                        }
                    }
                    catch (ex) {
                        MGW.loopAM(array, count + 1);
                    }
                }
            });
        }catch (ex) {
            
        }
    }

    $("#mgw_demo_btn").click(function () {
        MGW.initTour();
        tour.restart();
    });

    $("#a_mgw").click(function () {
        MGW.refreshMGW(false);

        MGW.initTour();
        setTimeout(function () {
            tour.start();
        }, 1000);
    });
    $("#mgw_coinlist").on("change", function (e) {
        MGW.changeCoin(e.val);
        MGW.refreshMGW(false);
    });
    $("#mgw_coin_withdraw_amount").keydown(function (e) {
        
        var resultCoinDetails = $.grep(mgwCoinDetails, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });

        var charCode = !e.charCode ? e.which : e.charCode;

        if (isControlKey(charCode) || e.ctrlKey || e.metaKey) {
            return;
        }

        var maxFractionLength = resultCoinDetails[0].decimal;

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
            var errorMessage = "Only " + resultCoinDetails[0].decimal + " digits after the decimal mark are allowed for this asset.";
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
    $("#mgw_coin_withdraw_amount").keyup(function (e) {
        var result = $.grep(mgwCoinFees, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });

        var blockchainFeesNQT = new Big(NRS.convertToNQT(result[0].blockchainFees));
        var mgwFeesNQT = new Big(NRS.convertToNQT(result[0].mgwFees));

        var minFeesNQT = blockchainFeesNQT.plus(mgwFeesNQT);
        var withdrawAmountNQT = new Big(NRS.convertToNQT($("#mgw_coin_withdraw_amount").val()));
        
        if (withdrawAmountNQT.cmp(minFeesNQT) == 1) {
            var total = withdrawAmountNQT.minus(minFeesNQT);
            $("#mgw_coin_mgw_total_received").val(NRS.convertToNXT(total.toString()));
        }
        else {
            $("#mgw_coin_mgw_total_received").val('0');
        }
    });
    $('#mgw_gen_deposit_addr_modal').on('show.bs.modal', function () {
        var result = $.grep(mgwCoinMultigateway, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });
        $("#mgw_gen_deposit_addr_recipient").val(result[0].accountRS);

        var msg = MGW.getGenDepositBytes();
        $("#mgw_gen_deposit_addr_msg").val(msg);
    })
    $('#mgw_gen_deposit_addr_modal').on('shown.bs.modal', function () {
        $('#mgw_gen_deposit_addr_password').focus();
    })
    $('#mgw_withdraw_modal').on('hidden.bs.modal', function () {
        setTimeout(function () {
            MGW.refreshAsset();
        }, 5000);

        $("#mgw_coin_withdraw_amount").val("");
        $("#mgw_coin_mgw_total_received").val("0");
    })

    MGW.changeCoin = function (coin) {
        mgwCoin = coin;

        MGW.initCoinDetails();
        MGW.initCoinFees();

        MGW.clearField();
    }
    MGW.getGenDepositBytes = function () {
        var result = $.grep(mgwCoinDepositJson, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });
        
        var sig = result[0].gateway;
        var size = "";
        var nxt64bits = nsv_mgw_hexConverter.decToHex(NRS.account);
        var funcid = "67000000";
        var gatewayid = "00000000";
        var timestamp = "00000000";
        var jsonflag = "01000000";
        var json_AM = result[0].jsonAM;
        var json_AM_hex = converters.stringToHexString(json_AM);
        
        nxt64bits = nsv_mgw_padZero(nxt64bits, 16);
        nxt64bits = nsv_mgw_reverseHex(nxt64bits);

        size = 48 + (json_AM_hex.toString().length / 2) + 1;
        size = nsv_mgw_hexConverter.decToHex(size.toString());
        size = nsv_mgw_padZero(size, 8);
        size = nsv_mgw_reverseHex(size);

        var msg = sig + size + nxt64bits + funcid + gatewayid + timestamp + jsonflag + json_AM_hex;

        return msg;
    }
    MGW.withdrawCoin = function () {
        var result = $.grep(mgwCoinFees, function (_mgwCoin) { return _mgwCoin.coin == mgwCoin });

        var minWithdrawNQT = new Big(NRS.convertToNQT(result[0].minWithdraw).toString());
        var withdrawAmountNQT = new Big(NRS.convertToNQT($("#mgw_coin_withdraw_amount").val()).toString());
        var mgwCoinUnconfirmedBalanceNQT = new Big(NRS.convertToNQT(mgwCoinUnconfirmedBalance).toString());

        if ($.trim($("#mgw_coin_withdraw_addr").val()) == "") {
            $.growl("Please specify your " + mgwCoin + " address", {
                "type": "danger"
            });
        }
        else if (withdrawAmountNQT.cmp(minWithdrawNQT) == -1) {
            $.growl("Minimum withdraw is " + result[0].minWithdraw + " " + mgwCoin + ".", {
                "type": "danger"
            });
        }
        else if (mgwCoinUnconfirmedBalanceNQT.cmp(withdrawAmountNQT) == -1) {
            $.growl("You have insufficient " + mgwCoin + " to withdraw", {
                "type": "danger"
            });
        }
        else {
            if (NRS.accountInfo.unconfirmedBalanceNQT >= 100000000) {
                var resultMGW = $.grep(mgwCoinMultigateway, function (_mgwCoin2) { return _mgwCoin2.coin == mgwCoin });
                var resultCoinDetails = $.grep(mgwCoinDetails, function (_mgwCoin3) { return _mgwCoin3.coin == mgwCoin });

                $("#mgw_withdraw_modal_address").text($.trim($("#mgw_coin_withdraw_addr").val()));
                $("#mgw_withdraw_modal_total_received").text($("#mgw_coin_mgw_total_received").val() + " " + mgwCoin);
                $("#mgw_withdraw_modal_message").val('{"redeem":"' + mgwCoin + '","withdrawaddr":"' + $.trim($("#mgw_coin_withdraw_addr").val()) + '","InstantDEX":""}');
                $("#mgw_withdraw_modal_comment").val('{"redeem":"' + mgwCoin + '","withdrawaddr":"' + $.trim($("#mgw_coin_withdraw_addr").val()) + '","InstantDEX":""}');
                $("#mgw_withdraw_modal_quantityQNT").val(NRS.convertToQNT($("#mgw_coin_withdraw_amount").val(), mgwCoinDecimal));
                $("#mgw_withdraw_modal_feeNXT").val(1);
                $("#mgw_withdraw_modal_deadline").val(24);
                $("#mgw_withdraw_modal_add_message").prop('checked', true);

                $("#mgw_withdraw_modal_recipient").val(resultMGW[0].accountRS);
                $("#mgw_withdraw_modal_asset").val(resultCoinDetails[0].assetID);

                $('#mgw_withdraw_modal').modal('show');
            }
            else {
                $.growl("Withdraw " + mgwCoin + " required 1 NXT", {
                    "type": "danger"
                });
            }
        }
    }

    MGW.clearField = function () {
        $("#mgw_coin_withdraw_addr").val("");
        $("#mgw_coin_withdraw_amount").val("");
        $("#mgw_coin_mgw_total_received").val("0");
    }
    function format(coin) {
        if (!coin.id) return coin.text;
        return "<img src='img/mgw/" + coin.id + ".png'/> " + coin.text;
    }
    function isControlKey(charCode) {
        if (charCode >= 32)
            return false;
        if (charCode == 10)
            return false;
        if (charCode == 13)
            return false;

        return true;
    }
    return MGW;
}(MGW || {}, jQuery));