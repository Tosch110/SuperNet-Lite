var SPN = (function (SPN, $, undefined) {
    SPN.isCoinConnect = false;
    var coinAddress = "";
    var isCoinAddressAvailable = true;
    var isCoinAddressOwn = false;

    $("#spn_landing").click(function () {
        verifyVersion();
		verifyBlockchainStatus();
    });

    $("#spn_dashboard").click(function () {
        verifyCoinConnect();
    });
    
    SPN.init = function () {
        verifyVersion();
        verifyBlockchainStatus();
        verifyCoinConnect();
    }

    function verifyBlockchainStatus() {
        if (NRS.downloadingBlockchain) {
            $("#spn_message").addClass("alert-success").removeClass("alert-danger").html($.t("status_blockchain_downloading")).show();
            return;
        } else if (NRS.state.isScanning) {
            $("#spn_message").addClass("alert-success").removeClass("alert-danger").html($.t("error_form_blockchain_rescanning")).show();
            return;
        }
    }

    function verifyVersion() {
        if (NRS.isOutdated) {
            $('#supernet_page .caption p a').addClass('disabled');
            $('#spn_message').addClass("alert-danger").removeClass("alert-success").html("A new SuperNET release is available. Please update from your dashboard to continue using SuperNET features.").show();
        }
        else {
            $('#supernet_page .caption p a').removeClass('disabled');
            $('#spn_message').hide();
        }
    }

    function verifyCoinConnect() {
        if (!SPN.isCoinConnect) {
            $('#spn_dashboard_page section div button').addClass('disabled');
            $("#spn_register_coin_alias_message").hide();
            $("#spn_dashboard_message").html("You are not connecting to any coin QT wallet, some basic coin functionality will be disabled").show();
        } else {
            $('#spn_dashboard_page section div button').removeClass('disabled');
            $("#spn_dashboard_message").hide();
            
            getCoinAddress();
            checkCoinAddressRegisterStatus();
        }
    }

    function checkCoinAddressRegisterStatus() {
        NRS.sendRequest("getAlias", {
            "aliasName": coinAddress
        }, function (response) {
            if (response.accountRS) {
                isCoinAddressAvailable = false;

                if (response.accountRS === NRS.accountRS) {
                    isCoinAddressOwn = true;
                }

                $("#btn_spn_register_coin_alias_modal").addClass('disabled');
                if (isCoinAddressOwn) {
                    $("#spn_register_coin_alias_message").addClass('bg-success').removeClass('bg-danger').html("You already own your coin address alias").show();
                } else {
                    $("#spn_register_coin_alias_message").addClass('bg-danger').removeClass('bg-success').html("Your coin address alias is registered by others").show();
                }
            }
            else {
                $("#spn_register_coin_alias_message").hide();
                $("#btn_spn_register_coin_alias_modal").removeClass('disabled');
            }
        });
    }

    $('#spn_register_coin_alias_modal').on('show.bs.modal', function () {
        if (coinAddress) {
            $("#spn_register_alias_alias").val(coinAddress);
            $("#spn_register_alias_uri").val(NRS.accountRS);
        }
    });
   
    function getCoinAddress() {
        var uri = new URI(location.search);
        uri.search(function (data) {
            coinAddress = data.address;
        });
    }
    return SPN;
}(SPN || {}, jQuery));