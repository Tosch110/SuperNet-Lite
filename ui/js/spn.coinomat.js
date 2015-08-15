var SPN = (function (SPN, $, undefined) {
    SPN.coinomatToken = "";
    var webURL = "https://www.coinomat.com/";
    var URL = "https://www.coinomat.com/api/v1/";
    var xrate;
    var hasPublicKey = false;
    var exchangerWalletFrom;
    var timer;

    $(document).ready(function () {
        $("#spn_coinomat_fr").select2({
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) { return m; }
        });

        $("#spn_coinomat_to").select2({
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) { return m; }
        });
    });

    $("#spn_coinomat").click(function () {
        setDefaultCoinomatExchangePair();
        getExchangeRate(true);
        create_tunnel();

        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(function () {
            refreshCoinomat();
        }, 60000);
    });

    $("#spn_coinomat_fr, #spn_coinomat_to").on("change", function (e) {
        $("#spn_coinomat_wallet_addr_to").val("");
        $("#spn_coinomat_perfect_code_input").val("");
        getExchangeRate(true);
        create_tunnel();
    });

    function refreshCoinomat(){
        if (NRS.currentPage == "spn_coinomat") {
            getExchangeRate(false);
            create_tunnel();
        }
    }
    function getExchangeRate(isFirstTime) {
        toggleLoadingMessage(true)
        var f = $("#spn_coinomat_fr").select2("val");
        var t = $("#spn_coinomat_to").select2("val");

        $.ajax({
            url: URL + 'get_xrate.php?f=' + f + '&t=' + t,
            dataType: 'jsonp',
            type: 'GET',
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if (data.xrate) {
                    xrate = data;
                    xrate.xrate_global = data.xrate * data.out_prec.correction / data.in_prec.correction;
                    var xrate_unit = xrate.xrate_global * parseFloat(data.in_def);
                    xrate_unit = utoFixed(xrate_unit,(data.out_prec.dec));

                    if (!data.out_prec.fee) {
                        data.out_prec.fee = 0.0;
                    }
                    xrate.out_prec.fee = data.out_prec.fee;
                    var nv = xrate_unit - data.out_prec.fee;
                    nv = utoFixed(nv,data.out_prec.dec);

                    if(isFirstTime){
                        $("#spn_coinomat_amount_fr").val(data.in_def);
                    }
                    $('#spn_coinomat_amount_fr').prop('disabled', false);
                    if (!isNaN(nv) && (nv > 0)) {
                        if (isFirstTime) {
                            $("#spn_coinomat_amount_to").val(nv);
                        }
                        else {
                            var xrate_custom = xrate.xrate_global * parseFloat($("#spn_coinomat_amount_fr").val());
                            xrate_custom = xrate_custom - data.out_prec.fee;
                            xrate_custom = utoFixed(xrate_custom,(data.out_prec.dec));

                            $("#spn_coinomat_amount_to").val(xrate_custom);
                        }
                        $("#spn_coinomat_main_exchange").removeClass('disabled');
                    }
                    else {
                        $("#spn_coinomat_amount_to").val(0);
                    }

                    var fcurrencyunits = "";
                    var tcurrencyunits = "";
                    switch (f) {
                        case "PERFECT": case "EGOPAY": case "OKPAY": case "COINO": {
                            fcurrencyunits = " USD";
                            break;
                        }
                    }
                    switch (t) {
                        case "PERFECT": case "EGOPAY": case "OKPAY": case "COINO": {
                            tcurrencyunits = " USD";
                            break;
                        }
                    }
                    $("#spn_coinomat_exchange_message").removeClass('alert-danger').addClass('alert-success').html("Exchange rates : " + data.in_def + " " + f + fcurrencyunits + " = " + xrate_unit + " " + t + tcurrencyunits + (data.extra_note == null ? "" : data.extra_note) + " <br/>Exchange limits : Minimum " + data.in_min + " " + f + fcurrencyunits + ", Maximum " + utoFixed(data.in_max, data.in_prec.dec) + " " + f + fcurrencyunits).show();
                    check_exchange_limits();
                    toggleWalletToInput(true);
                }
                else {
                    if (data.error) {
                        $("#spn_coinomat_amount_fr").val(0);
                        $("#spn_coinomat_amount_to").val(0);
                        $("#spn_coinomat_main_exchange").addClass('disabled');
                        $('#spn_coinomat_amount_fr').prop('disabled', true);
                        $("#div_spn_coinomat_amount_fr").removeClass("has-success has-feedback").removeClass("has-error");
                        $("#spn_coinomat_amount_fr_fail").hide();
                        $("#spn_coinomat_amount_fr_success").hide();
                        $("#spn_coinomat_exchange_message").removeClass('alert-success').addClass('alert-danger').html("Error : " + data.error);
                        toggleWalletToInput(false);
                    }
                }

                toggleLoadingMessage(false);
            }
        });
    }
    $("#spn_coinomat_amount_fr").keydown(function (e) {
        var charCode = !e.charCode ? e.which : e.charCode;

        if (isControlKey(charCode) || e.ctrlKey || e.metaKey) {
            return;
        }

        var maxFractionLength = xrate.in_prec.dec;

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
            var errorMessage = "Only " + maxFractionLength + " digits after the decimal mark are allowed.";
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
    $("#spn_coinomat_amount_fr").keyup(function (e) {
        update_to_val();
    });
    $("#spn_coinomat_wallet_addr_to").keyup(function (e) {
        var t = $("#spn_coinomat_to").select2("val");
        switch (t) {
            case "EGOPAY": case "OKPAY": {
                if (validateEmail($("#spn_coinomat_wallet_addr_to").val().trim())) {
                    create_tunnel();
                }
                break;
            }
            default:{
                create_tunnel();
            }
        }
    });
    $('#spn_coinomat_exchanger_modal').on('show.bs.modal', function () {
        create_tunnel();
        activateNXT();
    })
    $('#spn_coinomat_exchanger_modal').on('hidden.bs.modal', function () {
        setTimeout(function () {
            create_tunnel();
        }, 10000);
    });
    $('#send_money_modal').on('hidden.bs.modal', function () {
        $('#send_money_recipient').prop('readonly', false);
        $('#send_money_message').prop('readonly', false);
        $("#send_money_recipient").siblings(".recipient_selector").show();
        $("#send_money_recipient").parent().addClass("input-group");
    });
    
    function getCardList() {
        var cardlistURL = "cardlist.php?nxt=" + SPN.coinomatToken;
        var cardListRefresh = "<span class='glyphicon glyphicon-refresh' style='float:right;color:green;cursor:pointer' onclick='SPN.refreshBankCards()'></span>";
        var selectedCardID = $('input[name=bankcard]:checked', '#spn_coinomat_visamaster_bankcard').val();

        $("#spn_coinomat_visamaster_bankcard").html("");
        $.ajax({
            url: URL + cardlistURL,
            dataType: 'jsonp',
            type: 'GET',
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if(data.card_list.length>0){
                    $.each(data.card_list, function (index, value) {
                        if (index == 0) {
                            var chkhtml = '<div class="checkbox"><label><input type="radio" name="bankcard" ' + (selectedCardID == value.bk_id ? 'checked="true"' : '') + ' value="' + value.bk_id + '" onclick="SPN.rdBankCard_OnClick(this)"> ' + value.card_number + '</label>' + cardListRefresh + '</div>';
                        }
                        else {
                            var chkhtml = '<div class="checkbox"><label><input type="radio" name="bankcard" ' + (selectedCardID == value.bk_id ? 'checked="true"' : '') + ' value="' + value.bk_id + '" onclick="SPN.rdBankCard_OnClick(this)"> ' + value.card_number + '</label></div>';
                        }

                        $("#spn_coinomat_visamaster_bankcard").append(chkhtml);
                    });
                }else
                {
                    $("#spn_coinomat_visamaster_bankcard").html("<h5>You don't have any registered bank card " + cardListRefresh + " </h5>");
                }
            },
            error: function (data) {
                $("#spn_coinomat_visamaster_bankcard").html("<h5>You don't have any registered bank card " + cardListRefresh + " </h5>");
            }
        });
    }
    function activateNXT() {
        var activateURL = "NXT_activate.php?NXT_account=" + NRS.accountRS + "&nxt_public_key=" + NRS.publicKey;
        
        NRS.sendRequest("getAccountPublicKey", {
            "account": NRS.accountRS
        }, function (response) {
            if (!response.publicKey)
            {
                $.ajax({
                    url: URL + activateURL,
                    dataType: 'jsonp',
                    type: 'GET',
                    timeout: 30000,
                    crossDomain: true,
                    success: function (data) {
                        $("#spn_coinomat_exchanger_pubkey_message").addClass('alert-success').removeClass('alert-danger').html("Your public key is automatically registered with Coinomat.");
                    },
                    error: function (data) {
                        $("#spn_coinomat_exchanger_pubkey_message").addClass('alert-danger').removeClass('alert-success').html("There is error registered your public key with Coinomat.");
                    }
                });
            }
            else {
                hasPublicKey = true;
                $("#spn_coinomat_exchanger_pubkey_message").hide();
            }
        });
    }
    function create_tunnel() {
        toggleCoinomatExchangerLoading(true,false);
        toggleTransactionHistoryLoading(true,false);
        var f = $("#spn_coinomat_fr").select2("val");
        var t = $("#spn_coinomat_to").select2("val");
        var tunnelURL = "create_tunnel.php?currency_from=" + f + "&currency_to=" + t;
        var walletAddr = $("#spn_coinomat_wallet_addr_to").val().trim();
        var PerfectCode = $("#spn_coinomat_perfect_code_input").val().trim();

        //TODO
        switch (t) {
            case "NXT": case "COINO": {
                tunnelURL += "&wallet_to=" + NRS.accountRS;
                break;
            }
            case "BTC": case "LTC": case "PPC": {
                tunnelURL += "&wallet_to=" + walletAddr;
                break;
            }
            case "PERFECT": {
                if (PerfectCode != "") {
                    tunnelURL += "&pmid_to=" + walletAddr + "&confirm_code=" + PerfectCode;
                } else
                {
                    tunnelURL += "&pmid_to=" + walletAddr;
                }
                break;
            }
            case "EGOPAY": {
                tunnelURL += "&epid_to=" + walletAddr;
                break;
            }
            case "OKPAY": {
                tunnelURL += "&okid_to=" + walletAddr;
                break;
            }
            case "VISAMASTER": {
                var bkid = $('input[name=bankcard]:checked', '#spn_coinomat_visamaster_bankcard').val();
                if (bkid) {
                    tunnelURL += "&bkid_to=" + bkid.trim() + "&nxt=" + SPN.coinomatToken;
                }
                break;
            }
            case "USD": {
                tunnelURL += "&nxt=" + SPN.coinomatToken;
                break;
            }
        }

        $.ajax({
            url: URL + tunnelURL,
            dataType: 'jsonp',
            type: 'GET',
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if (data.ok && data.tunnel_id && data.k1 && data.k2) {
                    get_tunnel(data.tunnel_id, data.k1, data.k2);
                    $("#spn_coinomat_open_web_a").data("coinomat-tunnelid", data.tunnel_id);
                    $("#spn_coinomat_open_web_a").data("coinomat-k", data.k1 + data.k2);
                    $("#spn_coinomat_pay_USD").data("coinomat-tunnelid", data.tunnel_id);
                    $("#spn_coinomat_pay_USD").data("coinomat-k", data.k1 + data.k2);
                }
                else {
                    if (data.error) {
                        $("#spn_coinomat_exchanger_error_message").html(data.error);
                        toggleCoinomatExchangerLoading(false,true);
                        toggleTransactionHistoryLoading(false, false);
                    }
                }
            }
        });
    }
    function get_tunnel(id, k1, k2) {
        var t = $("#spn_coinomat_to").select2("val");
        var f = $("#spn_coinomat_fr").select2("val");
        $("#spn_coinomat_in_address_qr_code").hide();
        $("#spn_coinomat_usd_div").hide();
        $("#spn_coinomat_main_exchange").removeAttr('disabled');
        var getTunnelURL;
        if (t == "VISAMASTER" || f == "USD" || t == "USD") {
            getTunnelURL = "get_tunnel.php?xt_id=" + id + "&k1=" + k1 + "&k2=" + k2 + "&history=1&nxt=" + SPN.coinomatToken;
        }
        else {
            getTunnelURL = "get_tunnel.php?xt_id=" + id + "&k1=" + k1 + "&k2=" + k2 + "&history=1";
        }
        
        $.ajax({
            url: URL + getTunnelURL,
            dataType: 'jsonp',
            type: 'GET',
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if (data.tunnel) {
                    var rate = data.tunnel.in_def * data.tunnel.xrate_fixed * data.tunnel.out_prec.correction / data.tunnel.in_prec.correction;
                    var amountReceived = parseFloat(rate) - parseFloat(data.tunnel.out_prec.fee);

                    amountReceived = utoFixed(parseFloat(amountReceived), (data.tunnel.out_prec.dec));
                    exchangerWalletFrom = data.tunnel.wallet_from;

                    $("#spn_coinomat_in_address_label").text("Please send " + data.tunnel.currency_from + " to this address: ");
                    if (data.tunnel.wallet_from.note) {
                        $("#spn_coinomat_in_address_note_div").show();
                        $("#spn_coinomat_in_address").text(data.tunnel.wallet_from.wallet);
                        $("#spn_coinomat_in_address_note").text(data.tunnel.wallet_from.note);
                        $("#btn_send_coinousd").data("recipient", data.tunnel.wallet_from.wallet);
                        $("#btn_send_coinousd").data("note", data.tunnel.wallet_from.note);
                    }
                    else
                    {
                        $("#spn_coinomat_in_address_note_div").hide();
                        $("#spn_coinomat_in_address").text(data.tunnel.wallet_from);
                    }
                    
                    $("#spn_coinomat_out_address_label").text("All funds paid to above address will be converted and sent to: ");
                    switch (data.tunnel.currency_to) {
                        case "PERFECT":
                            if (data.tunnel.wallet_to.confirm != "") {
                                $("#spn_coinomat_out_address").html("Perfect Money account : " + data.tunnel.wallet_to.pmid + "<br/>Each Perfect Money transaction will be protected with a code that you have chosen.");
                            } else
                            {
                                $("#spn_coinomat_out_address").html("Perfect Money account : " + data.tunnel.wallet_to.pmid);
                            }
                            break;
                        case "EGOPAY":
                            $("#spn_coinomat_out_address").text("EgoPay account : " + data.tunnel.wallet_to.epid);
                            break;
                        case "OKPAY":
                            $("#spn_coinomat_out_address").text("OKPay account : " + data.tunnel.wallet_to.okid);
                            break;
                        case "VISAMASTER":
                            $("#spn_coinomat_out_address").text("Visa/Mastercard : " + data.tunnel.wallet_to.bknum);
                            break;
                        case "USD":
                            $("#spn_coinomat_out_address").text("Coinomat USD account : " + data.tunnel.wallet_to.to_account);
                            break;
                        default:
                            $("#spn_coinomat_out_address").text(data.tunnel.wallet_to);
                            break;
                    }
                    
                    var fcurrencyunits = "";
                    var tcurrencyunits = "";

                    switch (data.tunnel.currency_to) {
                        case "PERFECT": case "EGOPAY": case "OKPAY": case "COINO": {
                            tcurrencyunits = " USD";
                            break;
                        }
                    }

                    switch (data.tunnel.currency_from) {
                        case "BTC": case "LTC": case "PPC": {
                            var strText;
                            if (data.tunnel.currency_from == "BTC") {
                                strText = "bitcoin:";
                            }
                            else if (data.tunnel.currency_from == "LTC") {
                                strText = "litecoin:";
                            }
                            else if (data.tunnel.currency_from == "PPC") {
                                strText = "peercoin:";
                            }
                            $("#spn_coinomat_in_address_qr_code").empty().qrcode({
                                "text": strText + data.tunnel.wallet_from,
                                "width": 150,
                                "height": 150
                            });
                            $("#spn_coinomat_in_address_qr_code").show();
                            break;
                        }
                        case "PERFECT": case "EGOPAY": case "OKPAY": case "COINO": {
                            fcurrencyunits = " USD";
                            break;
                        }
                        case "USD": {
                            if (data.tunnel.balance) {
                                var refresh = "<span class='glyphicon glyphicon-refresh' style='float:right;color:green;cursor:pointer' onclick='SPN.refreshUSD()'></span>";

                                $("#spn_coinomat_usd_balance").html("$ " + data.tunnel.balance.amount + " " + refresh);
                                $("#spn_coinomat_usd_balance").data("balance", data.tunnel.balance.amount);
                            }

                            if (data.tunnel.balance.need_verification) {
                                $("#spn_coinomat_usd_verify_div h5").css("color","red").html("Not Verified");
                                $("#spn_coinomat_usd_verify_div").show();
                                $("#usd_verify").show();
                                $("#usd_add").hide();
                                $("#spn_coinomat_main_exchange").attr('disabled', 'disabled');
                            } else {
                                $("#spn_coinomat_usd_verify_div h5").css("color","green").html("Verified");
                                $("#spn_coinomat_usd_verify_div").show();
                                $("#usd_verify").hide();
                                $("#usd_add").show();
                                $("#spn_coinomat_main_exchange").removeAttr('disabled');
                                check_USD_fund();
                            }

                            $("#spn_coinomat_usd_div").show();
                            $("#spn_coinomat_in_address_label").text("Exchange Description");
                            $("#spn_coinomat_in_address").html("Pay <b>" + $("#spn_coinomat_amount_fr").val() + " " + data.tunnel.currency_from + fcurrencyunits + "</b> for <b>" + $("#spn_coinomat_amount_to").val() + " " + data.tunnel.currency_to + tcurrencyunits + "</b>");

                            break;
                        }
                    }

                    $("#spn_coinomat_exchanger_message").html("Exchange rates : " + data.tunnel.in_def + " " + data.tunnel.currency_from + fcurrencyunits + " = " + amountReceived + " " + data.tunnel.currency_to + tcurrencyunits + " <br/>Exchange limits : Minimum " + data.tunnel.in_min + " " + data.tunnel.currency_from + fcurrencyunits + ", Maximum " + utoFixed(data.tunnel.in_max, data.tunnel.in_prec.dec) + " " + data.tunnel.currency_from + fcurrencyunits + "<br/><br/>This rate is valid for 30 minutes from now ").show();
                    $("#spn_coinomat_exchanger_error_message").hide();
                    toggleCoinomatExchangerLoading(false,false);
                    showTransactionHistory(data, data.tunnel.currency_to);
                }
            }
        });
    }
    function showTransactionHistory(data, currency_to) {
        var rows = "";

        if (data.history.length > 0) {
            //$("#spn_coinomat_history_in").html("In, " + data.history[0].currency_in);
            $("#spn_coinomat_history_in").html("In, " + data.tunnel.currency_from);
            $("#spn_coinomat_history_out").html("Out, " + currency_to);

            $.each(data.history, function (i, v) {
                var ex_rate, out, status;
                (parseFloat(v.xrate_fixed) == 0 ? ex_rate = utoFixed(data.tunnel.xrate_fixed,data.tunnel.out_prec.dec) : ex_rate = v.xrate_fixed);
                (v.amount_out == "" ? out = "" : out = v.amount_out);
                if (v.state_in_text) status = v.state_in_text;
                if (v.state_in_text == "unconfirmed") status = "waiting for confirmation";

                if (status == "") status = v.state_out_text;
                rows += "<tr><td>" + v.op_id + "</td><td>" + v.added + "</td><td>" + v.amount_in + "</td><td>" + ex_rate + "</td><td>" + out + "</td><td>" + status + "</td></tr>";
            });
            $("#spn_coinomat_history").removeClass('data-empty');
            $("#spn_coinomat_history table tbody").empty().append(rows);
        }
        else {
            $("#spn_coinomat_history").addClass('data-empty');
        }

        toggleTransactionHistoryLoading(false,true);
    }
    function check_exchange_limits() {
        var a_val = parseFloat($("#spn_coinomat_amount_fr").val());

        $("#spn_coinomat_amount_fr_fail").attr('data-content', "Mininum : " + xrate.in_min + " " + $("#spn_coinomat_fr").select2("val") + " <br> Maximum : " + utoFixed(xrate.in_max,xrate.in_prec.dec) + " " + $("#spn_coinomat_fr").select2("val"));

        if (xrate && !isNaN(a_val) && ((a_val >= xrate.in_min) && (a_val <= xrate.in_max))) {
            toggleAmountFromValidation(true);
        }
        else {
            toggleAmountFromValidation(false);
        }

        check_USD_fund();
    }
    function check_USD_fund() {
        var f = $("#spn_coinomat_fr").select2("val");
        var status = $("#spn_coinomat_usd_verify_div h5").text();
        if (f == "USD" ) {
            if(status == "Verified"){
                var a_val = parseFloat($("#spn_coinomat_amount_fr").val());
                var balance = $("#spn_coinomat_usd_balance").data("balance");

                if (a_val > balance) {
                    $("#spn_coinomat_amount_fr_fail").attr('data-content', "You don't have enough fund");
                    toggleAmountFromValidation(false);
                    $("#spn_coinomat_main_exchange").addClass('disabled');
                }
                else {
                    toggleAmountFromValidation(true);
                    $("#spn_coinomat_main_exchange").removeClass('disabled');
                }
            } else {
                toggleAmountFromValidation(false);
                $("#spn_coinomat_amount_fr_fail").attr('data-content', "You are not verified yet");
                $("#spn_coinomat_main_exchange").addClass('disabled');
            }
        }
    }
    function update_to_val() {
        var xrate_unit = xrate.xrate_global * parseFloat($("#spn_coinomat_amount_fr").val());
        xrate_unit = utoFixed(xrate_unit,xrate.out_prec.dec);
        var nv = xrate_unit - xrate.out_prec.fee;
        nv = utoFixed(nv,xrate.out_prec.dec);

        if (!isNaN(nv) && (nv > 0))
        {
            $("#spn_coinomat_amount_to").val(nv);
            check_exchange_limits();
        }
        else {
            $("#spn_coinomat_amount_to").val(0);
            toggleAmountFromValidation(false);
        }


    }
    function toggleAmountFromValidation(isTrue) {
        if (isTrue) {
            $("#div_spn_coinomat_amount_fr").addClass("has-success has-feedback").removeClass("has-error");
            $("#spn_coinomat_main_exchange").removeClass('disabled');
            $("#spn_coinomat_amount_fr_fail").hide();
            $("#spn_coinomat_amount_fr_success").show();
        }
        else
        {
            $("#div_spn_coinomat_amount_fr").addClass("has-error has-feedback").removeClass("has-success");
            $("#spn_coinomat_main_exchange").addClass('disabled');
            $("#spn_coinomat_amount_fr_fail").show();
            $("#spn_coinomat_amount_fr_success").hide();
        }
    }
    function toggleLoadingMessage(isLoading) {
        if (isLoading) {
            $("#spn_coinomat_exchange_message").hide();
            $("#spn_coinomat_loading").show();
            
        }else
        {
            $("#spn_coinomat_exchange_message").show();
            $("#spn_coinomat_loading").hide();
        }
    }
    function toggleCoinomatExchangerLoading(isLoading,hasError) {
        if (isLoading) {
            $("#spn_coinomat_exchanger_loading").show();
            $("#spn_coinomat_exchanger_content > div").hide();
        } else {
            var f = $("#spn_coinomat_fr").select2("val");

            $("#spn_coinomat_exchanger_loading").hide();
            $("#spn_coinomat_exchanger_content > div").show();
            (hasPublicKey ? $("#spn_coinomat_exchanger_pubkey_message").hide() : $("#spn_coinomat_exchanger_pubkey_message").show());
            if (hasError) {
                $("#spn_coinomat_exchanger_content > div").hide();
                $("#spn_coinomat_exchanger_error_message").show();
            }
            else
            {
                (f == "NXT" ? $("#spn_coinomat_send_nxt_div").show() : $("#spn_coinomat_send_nxt_div").hide());
                (f == "COINO" ? $("#spn_coinomat_send_coinousd_div").show() : $("#spn_coinomat_send_coinousd_div").hide());
                (f == "USD" ? $("#spn_coinomat_usd_div").show() : $("#spn_coinomat_usd_div").hide());
                $("#spn_coinomat_exchanger_error_message").hide();
            }

            switch (f) {
                case "PERFECT": case "EGOPAY": case "OKPAY":
                    $("#spn_coinomat_exchanger_content > .form-group").hide();
                    $("#spn_coinomat_open_web_div").show();
                    break;
                default:
                    $("#spn_coinomat_open_web_div").hide();
                    break;
            }
        }
    }
    function toggleTransactionHistoryLoading(isLoading, isExchangeRate) {
        if (isLoading) {
            $("#spn_coinomat_history").addClass('data-loading');
        }
        else {
            if (isExchangeRate) {
                var f = $("#spn_coinomat_fr").select2("val");
                var t = $("#spn_coinomat_to").select2("val");

                $("#spn_coinomat_tx_history_header").html("Transactions History");
                if (f != t) {
                    if (t == "NXT" || t == "COINO" || t == "USD") {
                        $("#spn_coinomat_tx_history_header").html($("#spn_coinomat_tx_history_header").html() + ": " + f + "/" + t + ": " + NRS.accountRS);
                    }
                    else if (t == "VISAMASTER") {
                        var bankcard = $('input[name=bankcard]:checked', '#spn_coinomat_visamaster_bankcard').parent().text();

                        if (bankcard) {
                            $("#spn_coinomat_tx_history_header").html($("#spn_coinomat_tx_history_header").html() + ": " + f + "/" + t + ": " + bankcard);
                        } else {
                            $("#spn_coinomat_tx_history_header").html("Transactions History");
                        }
                    }
                    else {
                        $("#spn_coinomat_tx_history_header").html($("#spn_coinomat_tx_history_header").html() + ": " + f + "/" + t + ": " + $("#spn_coinomat_wallet_addr_to").val().trim());
                    }
                }
            }
            else {
                $("#spn_coinomat_tx_history_header").html("Transactions History");
                $("#spn_coinomat_history table tbody").empty();
                $("#spn_coinomat_history").addClass('data-empty');
            }
            
            $("#spn_coinomat_history").removeClass('data-loading');
        }
    }
    function toggleWalletToInput(isExchangeRate) {
        $("#spn_coinomat_perfect_code_div").hide();
        $("#spn_coinomat_manage_bankcards_div").hide();
        $("#spn_coinomat_visamaster_to_div").hide();

        if (isExchangeRate) {
            var t = $("#spn_coinomat_to").select2("val");
            var f = $("#spn_coinomat_fr").select2("val");

            if (t == "NXT" || t == "COINO" || t == "USD") {
                $("#spn_coinomat_wallet_addr_to_div").hide();
            } else {
                $("#spn_coinomat_wallet_addr_to_div").show();
                $("#spn_coinomat_wallet_addr_to_label_div").show();

                switch (t) {
                    case "PERFECT": $("#spn_coinomat_wallet_addr_to_label").html(t + " Money ID");
                        $("#spn_coinomat_perfect_code_div").show();
                        break;
                    case "EGOPAY": $("#spn_coinomat_wallet_addr_to_label").html(t + " account ID (email)");
                        break;
                    case "VISAMASTER":
                        $("#spn_coinomat_wallet_addr_to_label_div").hide();
                        $("#spn_coinomat_visamaster_to_div").show();
                        $("#spn_coinomat_manage_bankcards_div").show();
                        getCardList();
                        break;
                    default: $("#spn_coinomat_wallet_addr_to_label").html(t + " Wallet Address");
                        break;
                }
            }

            if (f == "USD") {
                $("#spn_coinomat_wallet_addr_fr_div").show();
            } else {
                $("#spn_coinomat_wallet_addr_fr_div").hide();
            }
        } else {
            $("#spn_coinomat_wallet_addr_to_div").hide();
            $("#spn_coinomat_wallet_addr_fr_div").hide();
        }
    }
    function setDefaultCoinomatExchangePair() {
        $("#spn_coinomat_fr").select2("val", "BTC");
        $("#spn_coinomat_to").select2("val", "NXT");
    }
    function format(currency) {
        if (!currency.id) return currency.text;
        return "<img src='img/coinomat/" + currency.id + ".png'/> " + currency.text;
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
    function utoFixed(num, fixed) {
        fixed = fixed || 0;
        fixed = Math.pow(10, fixed);
        return Math.round(num * fixed) / fixed;
    }
    function validateEmail(email) {
        var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (filter.test(email)) {
            return true;
        }
        else {
            return false;
        }
    }

    SPN.coinomatExchange = function () {
        var t = $("#spn_coinomat_to").select2("val");

        if (t == "NXT" || t == "COINO" || t == "USD") {
            $('#spn_coinomat_exchanger_modal').modal('show');
        }
        else
        {
            if (t == "VISAMASTER") {
                if ($('input[name=bankcard]:checked', '#spn_coinomat_visamaster_bankcard').val()) {
                    $('#spn_coinomat_exchanger_modal').modal('show');
                }
                else {
                    $.growl("Please choose your destination bank card", {
                        "type": "danger"
                    });
                }
            } else {
                if ($("#spn_coinomat_wallet_addr_to").val().trim() == "") {
                    $.growl("Please specify your destination wallet address", {
                        "type": "danger"
                    });
                } else {
                    $('#spn_coinomat_exchanger_modal').modal('show');
                }
            } 
        }
    }
    SPN.coinomatSendNxt = function () {
        $('#send_money_modal').modal('show');
        $('#send_money_recipient').val(exchangerWalletFrom.wallet);
        $('#send_money_recipient').prop('readonly', true);
        $('#send_money_message').val(exchangerWalletFrom.note);
        $('#send_money_message').prop('readonly', true);
        $('#send_money_add_message').prop('checked', true);
        $('#send_money_modal').find(".optional_message").show();

        $("#send_money_recipient").siblings(".recipient_selector").hide();
        $("#send_money_recipient").parent().removeClass("input-group");

        setTimeout(function () {
            $('#send_money_amount').focus();
        }, 800);
    }
    SPN.openCoinomatWebsite = function () {
        window.open(webURL + "p/" + $("#spn_coinomat_open_web_a").data("coinomat-tunnelid") + "/" + $("#spn_coinomat_open_web_a").data("coinomat-k") + "?amount=" + $("#spn_coinomat_amount_fr").val().trim());
    }
    SPN.manageBankCards = function () {
        window.open(webURL + "login.php?redir=/settings.php%23cards&logout=1&nxt=" + SPN.coinomatToken);
    }
    SPN.verifyUSD = function () {
        window.open(webURL + "login.php?redir=/settings.php%23verification&logout=1&nxt=" + SPN.coinomatToken);
    }
    SPN.addUSD = function () {
        window.open(webURL + "login.php?redir=/deposit.php?w=USD&logout=1&nxt=" + SPN.coinomatToken);
    }
    SPN.reverseCoin = function () {
        var f = $("#spn_coinomat_fr").select2("val");
        var t = $("#spn_coinomat_to").select2("val");

        $("#spn_coinomat_fr").select2("val", t);
        $("#spn_coinomat_to").select2("val", f);

        getExchangeRate(true);
        create_tunnel();
    }
    $("#spn_coinomat_pay_USD").click(function () {
        var $btn = $(this);
        $btn.button('loading');
        
        $.ajax({
            url: URL + 'pay_from_balance.php?nxt=' + SPN.coinomatToken + '&xt=' + $("#spn_coinomat_pay_USD").data("coinomat-tunnelid") + '&amount=' + $("#spn_coinomat_amount_fr").val(),
            dataType: 'jsonp',
            type: 'GET',
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if (data.ok) {
                    $('#spn_coinomat_exchanger_modal').modal('hide');
                    $.growl("Your exchange request has been submitted.", {
                        "type": "success"
                    });
                } else {
                    $('#spn_coinomat_exchanger_modal').modal('hide');
                    $.growl("Your exchange request failed.", {
                        "type": "danger"
                    });
                }
                $btn.button('reset');
            },
            error: function (data) {
                $('#spn_coinomat_exchanger_modal').modal('hide');
                $.growl("Your exchange request failed.", {
                    "type": "danger"
                });
                $btn.button('reset');
            }
        });
    });
    SPN.refreshBankCards = function () {
        refreshCoinomat();
    }
    SPN.refreshUSD = function () {
        refreshCoinomat();
    }
    SPN.rdBankCard_OnClick = function (e) {
        create_tunnel();
    }
    return SPN;
}(SPN || {}, jQuery));