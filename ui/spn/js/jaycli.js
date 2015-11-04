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
    NRS.JayNewAccount = function (secretPhrase, key) {
        var account = newAccount(secretPhrase, key);

        if(storeAccount(account) ) {
            NRS.setSuperNETToken(key);
            NRS.login(secretPhrase);
        } else {
            NRS.unlockLoginPanel();
        }
    }
    
    NRS.loginJayAccount = function () {
        NRS.lockLoginPanel();

        var address = $("#jay_account").html();

        if(address === 'NXT Account ID') {

            NRS.unlockLoginPanel();
            $.growl('Please choose your Account', { "type": "danger" });

        } else {

            var account = findAccount(address);
            var password = decryptSecretPhrase(account.cipher, $("#login_pin").val(), account.checksum);

            if (password) {
                NRS.setSuperNETToken($("#login_pin").val());
                NRS.login(password);
            }
            else {
                NRS.unlockLoginPanel();

                $.growl($.t("error_pin_number"), { "type": "danger" });
                $("#login_pin").val('');
            }

        }


    }

    NRS.onSelectJayAccount = function (account) {
        $("#jay_account").html(account);
        $("#login_pin_div").show();

        setTimeout(function () {
            $("#login_pin").focus();
        }, 10);
    }

    NRS.onDeleteJayAccount = function (address) {
        var accounts = JSON.parse(localStorage["accounts"]);
        for (var a = 0; a < accounts.length; a++) {
            if (accounts[a]["accountRS"] == address) {
                accounts.splice(a, 1);
            }
        }
        localStorage["accounts"] = JSON.stringify(accounts);

        NRS.loadJayAccounts();
    }

    function newAccount(secretPhrase, key) {
        var accountData = {};
        accountData["secretPhrase"] = secretPhrase;
        accountData["publicKey"] = converters.byteArrayToHexString(getPublicKey(accountData["secretPhrase"]));
        accountData["accountRS"] = getAccountIdFromPublicKey(accountData["publicKey"], true);
        accountData["key"] = key;
        accountData["cipher"] = encryptSecretPhrase(accountData["secretPhrase"], key).toString();
        accountData["checksum"] = converters.byteArrayToHexString(simpleHash(converters.stringToByteArray(accountData["secretPhrase"])));
        return accountData;
    }

    function storeAccount(account) {
        var sto = [];
        var value = true;
        if (localStorage["accounts"]) {
            sto = JSON.parse(localStorage["accounts"]);



            var result = $.grep(sto, function(e){ return e.accountRS == account.accountRS; });

            if (result.length > 0) {
                $.growl("You already have that account listed.", {
                    "type": "danger",
                    "offset": 10
                });
                value = false;
            }
        }
        var acc = {};
        acc["accountRS"] = account["accountRS"];
        acc["publicKey"] = account["publicKey"];
        acc["cipher"] = account["cipher"];
        acc["checksum"] = account["checksum"];
        sto.push(acc);

        if(value) {
            localStorage["accounts"] = JSON.stringify(sto);
        }
        return value;
    }

    function getAccountIdFromPublicKey(publicKey, RSFormat) {
        var hex = converters.hexStringToByteArray(publicKey);

        _hash.init();
        _hash.update(hex);

        var account = _hash.getBytes();

        account = converters.byteArrayToHexString(account);

        var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

        var accountId = byteArrayToBigInteger(slice).toString();

        if (RSFormat) {
            var address = new NxtAddress();

            if (address.set(accountId)) {
                return address.toString();
            } else {
                return "";
            }
        } else {
            return accountId;
        }
    }

    function encryptSecretPhrase(phrase, key) {
        var rkey = prepKey(key);
        return CryptoJS.AES.encrypt(phrase, rkey);
    }

    function decryptSecretPhrase(cipher, key, checksum) {
        var rkey = prepKey(key);
        var data = CryptoJS.AES.decrypt(cipher, rkey);

        if (converters.byteArrayToHexString(simpleHash(converters.hexStringToByteArray(data.toString()))) == checksum)
            return converters.hexStringToString(data.toString());
        else return false;
    }

    function prepKey(key) {
        var rounds = 1000;
        var digest = key;
        for (var i = 0; i < rounds; i++) {
            digest = converters.byteArrayToHexString(simpleHash(digest));
        }
        return digest;
    }

    function findAccount(address) {
        if (localStorage) {
            var accounts = JSON.parse(localStorage["accounts"]);
            if (accounts && accounts.length > 0) {
                for (var a = 0; a < accounts.length; a++) {
                    if (accounts[a]["accountRS"] == address) return accounts[a];
                }
            }
        }

        return false;
    }

    return NRS;

}(NRS || {}, jQuery));