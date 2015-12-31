var NRS = (function (NRS, $, undefined) {
    NRS.spnliteversion = "2.0.9";
    NRS.isJay = false;
    var server = "http://localhost:7876"; /*http://localhost:7876*/
    var peerExplorerUrl = "http://peerexplorer.com/api_openapi_hallmark_version_jsonp";
    var nxtPeersUrl = "http://nxtpeers.com/api/cors/jsonp.php";
    var totalPeerIP = 0;
    var hasUserServer = false;

    NRS.getServerIP = function (result) {
        var r = $.Deferred();

        if (server) {
            hasUserServer = true;
            $("#node_ip_div").show();
        }

        if (localStorage) {
            if (localStorage.hasOwnProperty("spn_node")) {
                if (!server) {
                    server = localStorage["spn_node"];
                }
            }
        }

        if (server) {
            NRS.server = server;

            $.ajax({
                url: NRS.server + "/nxt?requestType=getBlockchainStatus",
                timeout: 10000,
                success: function (data) {
                    if (localStorage) { localStorage["spn_node"] = NRS.server.toString(); }
                    setTimeout(function () { r.resolve(0); }, 1000);
                    return r;
                },
                error: function (data) {
                    if (hasUserServer) {
                        console.log("Server " + server + " doesn't have CORS enabled! If you want to use Nxt localhost: Download Nxt: http://nxt.org Activate CORS in your Nxt (nxt/conf) config file. 1) Set nxt.apiServerCORS=true and nxt.uiServerCORS=true 2) Start Nxt 3) reload this page");
                    }
                    
                    server = "";
                    if (localStorage) { localStorage.removeItem("spn_node"); }
                    NRS.getServerIP().done(NRS.onSuccessGetServer);
                }
            });
        }
        else {
            if (result) {
                if (result.length == 0) {

                    $.ajax({
                        type: 'GET', url: nxtPeersUrl, async: false, jsonpCallback: 'nxtpeers', contentType: "application/json", dataType: 'jsonp', timeout: 30000,
                        success: function (nxtPeersResult) {

                            totalPeerIP = nxtPeersResult.peers.length;
                            var random = Math.floor((Math.random() * (nxtPeersResult.peers.length - 1)) + 0);
                            NRS.server = "http://" + nxtPeersResult.peers[random] + ":7876";

                            $.ajax({
                                url: NRS.server + "/nxt?requestType=getBlockchainStatus",
                                timeout: 10000,
                                success: function (data) {
                                    if (localStorage) { localStorage["spn_node"] = NRS.server.toString(); }
                                    setTimeout(function () { r.resolve(totalPeerIP - nxtPeersResult.peers.length + 1); }, 1000);
                                },
                                error: function (data) {
                                    if (localStorage) { localStorage.removeItem("spn_node"); }
                                    nxtPeersResult.peers.splice(random, 1);
                                    NRS.getServerIP(nxtPeersResult.peers).done(NRS.onSuccessGetServer);
                                }
                            });
                        },
                        error: function (json) {
                            //TODO
                        }
                    });

                    if(NRS.server === '') {
                        $.growl("No server available!", { "type": "danger" });
                    }
                }
                else {
                    var random = Math.floor((Math.random() * (result.length - 1)) + 0);
                    NRS.server = "http://" + result[random] + ":7876";

                    $.ajax({
                        url: NRS.server + "/nxt?requestType=getBlockchainStatus",
                        timeout: 10000,
                        success: function (data) {
                            if (localStorage) { localStorage["spn_node"] = NRS.server.toString(); }
                            setTimeout(function () { r.resolve(totalPeerIP - result.length + 1); }, 1000);
                        },
                        error: function (data) {
                            if (localStorage) { localStorage.removeItem("spn_node"); }
                            result.splice(random, 1);
                            NRS.getServerIP(result).done(NRS.onSuccessGetServer);
                        }
                    });
                }
            } else {
                $.ajax({
                    type: 'GET', url: peerExplorerUrl, async: false, jsonpCallback: 'peerexplorer', contentType: "application/json", dataType: 'jsonp', timeout: 30000,
                    success: function (peerExplorerResult) {
                        totalPeerIP = peerExplorerResult.peers.length;
                        var random = Math.floor((Math.random() * (peerExplorerResult.peers.length - 1)) + 0);
                        NRS.server = "http://" + peerExplorerResult.peers[random] + ":7876";

                        $.ajax({
                            url: NRS.server + "/nxt?requestType=getBlockchainStatus",
                            timeout: 10000,
                            success: function (data) {
                                if (localStorage) { localStorage["spn_node"] = NRS.server.toString(); }
                                setTimeout(function () { r.resolve(totalPeerIP - peerExplorerResult.peers.length + 1); }, 1000);
                            },
                            error: function (data) {
                                if (localStorage) { localStorage.removeItem("spn_node"); }
                                peerExplorerResult.peers.splice(random, 1);
                                NRS.getServerIP(peerExplorerResult.peers).done(NRS.onSuccessGetServer);
                            }
                        });
                    },
                    error: function (json) {
                        //TODO
                    }
                });
            }
        }
        
        return r;
    };

    NRS.onSuccessGetServer = function (tries) {
        NRS.hideLoginElementinJay();
        $("#spn_waiting_server").hide();
        $("#login_panel").show();
        
        NRS.sendRequest("getBlockchainStatus", {
        }, function (response) {
            var myCurrentServer = NRS.server.substring(NRS.server.lastIndexOf("/") + 1, NRS.server.lastIndexOf(":"));
            $("#node_ip").html('<a href="'+NRS.server+'/nxt?requestType=getPeer&peer='+myCurrentServer+'" target="_blank">'+myCurrentServer+'</a>');
            //$.growl("Tries : " + tries + "<br/>Server : " + NRS.server + "<br/>Block height : " + response.lastBlockchainFeederHeight, { "type": "success" });
        });

        NRS.init();

        if (NRS.getURLfilename() == "supernet.html") {
            NRS.mgwv1init();
        }

        if (NRS.getURLfilename() == "index.html") {
            NRS.autoLogin();
        }

        NRS.checkSuperNETVersion();


        if (localStorage) {
            if (localStorage["accounts"]) {
                var accounts = JSON.parse(localStorage["accounts"]);

                if (accounts && accounts.length > 0) {
                    setTimeout(function () {
                        $("#login_pin").focus();
                    }, 10);
                }
            }
        }
    };
    
    NRS.hideLoginElementinJay = function () {
        if (NRS.isJay) {
            $("#login_password").hide();
            $("#login_account").show();
            $("#login_button").hide();
            $("#login_button_account").show();
            $("#register_button").hide();
            $("#login_account").val("").mask("NXT-****-****-****-*****");
            $("#div_jay_account_list").hide();
            $("#login_pin_div").hide();
            $("#import_nxt").hide();
        }
    }

    NRS.checkSuperNETVersion = function() {

        NRS.sendRequest("getAlias", {
            aliasName: 'SuperNETLiteVersion'
        }, function (response) {

            if (response.aliasName) {
                if(response.accountRS == 'NXT-XGNC-YULH-4WR6-HW3R2') {

                    NRS.officialVersion = response.aliasURI;

                    var versionCheckOnline = NRS.officialVersion.split('.');
                    var versionCheckRunning = NRS.spnliteversion.split('.');

                    if(versionCheckOnline[0] > versionCheckRunning[0]) {

                        $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' - new: <a href="http://www.supernet.org/" target="_blank">'+NRS.officialVersion+'</a> <small>Please update! Major Update</small>');

                    } else {

                        if(versionCheckOnline[1] > versionCheckRunning[1]) {

                            $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' - new: <a href="http://www.supernet.org/" target="_blank">'+NRS.officialVersion+'</a> <small>Please update. minor Update</small>');

                        } else {

                            if(versionCheckOnline[2] > versionCheckRunning[2]) {

                                $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' - new: <a href="http://www.supernet.org/" target="_blank">'+NRS.officialVersion+'</a> <small>Please update</small>');

                            } else if(versionCheckOnline[2] === versionCheckRunning[2]) {

                                $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' <i class="fa fa-check text-success"></i>');

                            } else {
                                $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' <i class="fa fa-check text-success"></i> You are beyond official Release.');
                            }
                        }
                    }

                }  else {
                    $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' <i class="fa fa-remove text-warning">Failed checking Version. Changed Account?</i>');
                }
            } else {
                $('#superNETClientVersion').html('SuperNET Version: '+NRS.spnliteversion+' <i class="fa fa-remove text-warning">Failed checking Version</i>');
            }
        });

    }

    NRS.hideDashboardElementinJay = function () {
        if (NRS.isJay) {
            $("#top_menu_trigger").css('visibility', 'hidden');
            $(".bgbtc").hide();
            $(".bgDOGE").hide();
            $(".bgbtcd h4").css('visibility', 'hidden');
            $(".bgbits h4").css('visibility', 'hidden');
            $(".bgopal h4").css('visibility', 'hidden');
            $(".bgvrc h4").css('visibility', 'hidden');
        }
    }

    NRS.listJayAccounts = function () {
        if (localStorage) {
            if (NRS.isSuperNETPage()) {
                $("#login_password").hide();
                NRS.loadJayAccounts();
            }
            else {
                $("#login_password").show();
            }
            
            $("#login_button").hide();
            $("#import_nxt").show();
            $("#register_pin_number_div").show();
        }
        else {
            //no local storage, login via passphrase with old style
            $("#login_password").show();
            $("#login_button").show();
            $("#div_jay_account_list").hide();
            $("#import_nxt").hide();
            $("#register_pin_number_div").hide();
        }
    }

    NRS.loadJayAccounts = function(){
        clearJayAccountList();

        if (localStorage["accounts"]) {
            var accounts = JSON.parse(localStorage["accounts"]);
            $("#div_jay_account_list").show();
            if (accounts && accounts.length > 0) {
                for (var a = 0; a < accounts.length; a++) {
                    var account = accounts[a]["accountRS"];
                    $('#jay_account_list')
                        .append($("<li style='width:300px'></li>")
                            .append($("<a></a>")
                                .attr("href", "#")
                                .attr("style", "display: inline-block;width: 270px;")
                                .attr("onClick", "NRS.onSelectJayAccount('" + account + "')")
                                .text(account))
                            .append($('<button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="fa fa-times"></i></button>')
                                .attr("onClick", "NRS.onDeleteJayAccount('" + account + "')")
                                .attr("style", "margin-right:5px"))
                        );
                }

                NRS.onSelectJayAccount(accounts[0]["accountRS"]);
            }
            else {
                //no jay account
                $("#div_jay_account_list").hide();
                $("#login_pin_div").hide();
            }
        }
        else {
            //no jay account
            $("#div_jay_account_list").hide();
            $("#login_pin_div").hide();
        }
    }

    function clearJayAccountList() {
        $("#jay_account_list").html("");
    }
    
	return NRS;
}(NRS || {}, jQuery));