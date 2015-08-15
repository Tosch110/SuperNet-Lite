var NRS = (function (NRS, $, undefined) {
    NRS.spnAutoLogin = false;

    NRS.autoLogin = function () {
        if (localStorage) {
            if (localStorage.hasOwnProperty("jaylogintoken") && localStorage.hasOwnProperty("jayloginaddress")) {
                var address = localStorage["jayloginaddress"];
                var account = findAccount(address);
                var password = decryptSecretPhrase(account.cipher, localStorage["jaylogintoken"], account.checksum);

                localStorage.removeItem("jaylogintoken");
                localStorage.removeItem("jayloginaddress");

                if (password) {
                    NRS.spnAutoLogin = true;
                    showAutoLoginPanel();
                    setTimeout(function () {
                        NRS.login(password);
                    }, 1000);
                }
            }
        }
    };

    function showAutoLoginPanel() {
        $("#spn_auto_login").show();
        $("#login_panel").hide();
        $("#welcome_panel").hide();
        $("#account_phrase_custom_panel").hide();
        $("#account_phrase_generator_panel").hide();
        $("#custom_passphrase_link").hide();
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
    return NRS;
}(NRS || {}, jQuery));