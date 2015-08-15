/**
 * @depends {nrs.js}
 */
var NRS = (function(NRS, $, undefined) {
	NRS.normalVersion = {};
	NRS.betaVersion = {};
	NRS.isOutdated = false;

	NRS.checkAliasVersions = function() {
		if (NRS.downloadingBlockchain) {
			$("#nrs_update_explanation span").hide();
			$("#nrs_update_explanation_blockchain_sync").show();
			return;
		}
		if (NRS.isTestNet) {
			$("#nrs_update_explanation span").hide();
			$("#nrs_update_explanation_testnet").show();
			return;
		}

		//Get latest version nr+hash of normal version
		NRS.sendRequest("getAlias", {
		    "aliasName": "SPNliteversion"
		}, function(response) {
		    if (response.aliasURI && (response = response.aliasURI.split(" "))) {
		        var nrsVersionPart = response[0].split('.');
		        var nrsVersion = nrsVersionPart[0] + "." + nrsVersionPart[1] + "." + nrsVersionPart[2];
		        NRS.normalVersion.versionNr = nrsVersion;
		        NRS.normalVersion.supernetversionNr = response[0];
				NRS.normalVersion.hash = response[1];

				if (NRS.betaVersion.versionNr) {
					NRS.checkForNewVersion();
				}
			}
		});

		//Get latest version nr+hash of beta version
		NRS.sendRequest("getAlias", {
		    "aliasName": "SPNlitebetaversion"
		}, function(response) {
		    if (response.aliasURI && (response = response.aliasURI.split(" "))) {
		        var nrsBetaVersionPart = response[0].split('.');
		        var nrsBetaVersion = nrsBetaVersionPart[0] + "." + nrsBetaVersionPart[1] + "." + nrsBetaVersionPart[2];
		        NRS.betaVersion.versionNr = nrsBetaVersion;
		        NRS.betaVersion.supernetversionNr = response[0];
				NRS.betaVersion.hash = response[1];

				if (NRS.normalVersion.versionNr) {
					NRS.checkForNewVersion();
				}
			}
		});
	}

	NRS.checkForNewVersion = function() {
		var installVersusNormal, installVersusBeta, normalVersusBeta;

		if (NRS.normalVersion && NRS.normalVersion.supernetversionNr) {
		    installVersusNormal = NRS.versionCompare(NRS.spnliteversion, NRS.normalVersion.supernetversionNr);
		}
		if (NRS.betaVersion && NRS.betaVersion.supernetversionNr) {
		    installVersusBeta = NRS.versionCompare(NRS.spnliteversion, NRS.betaVersion.supernetversionNr);
		}

		$("#nrs_update_explanation > span").hide();

		$("#nrs_update_explanation_wait").attr("style", "display: none !important");

		$(".nrs_new_version_nr").html(NRS.normalVersion.supernetversionNr).show();
		$(".nrs_beta_version_nr").html(NRS.betaVersion.supernetversionNr).show();

		if (installVersusNormal == -1 && installVersusBeta == -1) {
			NRS.isOutdated = true;
			$("#nrs_update").html("Outdated!").show();
			$("#nrs_update_explanation_new_choice").show();
		} else if (installVersusBeta == -1) {
			NRS.isOutdated = false;
			$("#nrs_update").html("New Beta").show();
			$("#nrs_update_explanation_new_beta").show();
		} else if (installVersusNormal == -1) {
			NRS.isOutdated = true;
			$("#nrs_update").html("Outdated!").show();
			$("#nrs_update_explanation_new_release").show();
			$("#nrs_update_explanation_new_release > span").show();
			$("#nrs_update_explanation_new_release > button > span").show();
		} else {
			NRS.isOutdated = false;
			$("#nrs_update_explanation_up_to_date").show();
		}

		SPN.init();
	}

	NRS.versionCompare = function(v1, v2) {
		if (v2 == undefined) {
			return -1;
		} else if (v1 == undefined) {
			return -1;
		}

		//https://gist.github.com/TheDistantSea/8021359 (based on)
		var v1last = v1.slice(-1);
		var v2last = v2.slice(-1);

		if (v1last == 'e') {
			v1 = v1.substring(0, v1.length - 1);
		} else {
			v1last = '';
		}

		if (v2last == 'e') {
			v2 = v2.substring(0, v2.length - 1);
		} else {
			v2last = '';
		}

		var v1parts = v1.split('.');
		var v2parts = v2.split('.');

		function isValidPart(x) {
			return /^\d+$/.test(x);
		}

		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}

		v1parts = v1parts.map(Number);
		v2parts = v2parts.map(Number);

		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length == i) {
				return 1;
			}
			if (v1parts[i] == v2parts[i]) {
				continue;
			} else if (v1parts[i] > v2parts[i]) {
				return 1;
			} else {
				return -1;
			}
		}

		if (v1parts.length != v2parts.length) {
			return -1;
		}

		if (v1last && v2last) {
			return 0;
		} else if (v1last) {
			return 1;
		} else if (v2last) {
			return -1;
		} else {
			return 0;
		}
	}

	NRS.supportsUpdateVerification = function() {
		if ((typeof File !== 'undefined') && !File.prototype.slice) {
			if (File.prototype.webkitSlice) {
				File.prototype.slice = File.prototype.webkitSlice;
			}

			if (File.prototype.mozSlice) {
				File.prototype.slice = File.prototype.mozSlice;
			}
		}

		// Check for the various File API support.
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice || !window.Worker) {
			return false;
		}

		return true;
	}

	NRS.verifyClientUpdate = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var files = null;

		if (e.originalEvent.target.files && e.originalEvent.target.files.length) {
			files = e.originalEvent.target.files;
		} else if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length) {
			files = e.originalEvent.dataTransfer.files;
		}

		if (!files) {
			return;
		}

		$("#nrs_update_hash_progress").css("width", "0%");
		$("#nrs_update_hash_progress").show();

		var worker = new Worker("js/crypto/sha256worker.js");

		worker.onmessage = function(e) {
			if (e.data.progress) {
				$("#nrs_update_hash_progress").css("width", e.data.progress + "%");
			} else {
				$("#nrs_update_hash_progress").hide();
				$("#nrs_update_drop_zone").hide();

				if (e.data.sha256 == NRS.downloadedVersion.hash) {
					$("#nrs_update_result").html($.t("success_hash_verification")).attr("class", " ");
				} else {
					$("#nrs_update_result").html($.t("error_hash_verification")).attr("class", "incorrect");
				}

				$("#nrs_update_hash_version").html(NRS.downloadedVersion.supernetversionNr);
				$("#nrs_update_hash_download").html(e.data.sha256);
				$("#nrs_update_hash_official").html(NRS.downloadedVersion.hash);
				$("#nrs_update_hashes").show();
				$("#nrs_update_result").show();

				NRS.downloadedVersion = {};

				$("body").off("dragover.nrs, drop.nrs");
			}
		};

		worker.postMessage({
			file: files[0]
		});
	}

	NRS.downloadClientUpdate = function(version) {
		if (version == "release") {
			NRS.downloadedVersion = NRS.normalVersion;
		} else {
			NRS.downloadedVersion = NRS.betaVersion;
		}

		$("#nrs_update_iframe").attr("src", "https://bitbucket.org/longzai1988/supernetv1-lite/downloads/supernet-lite-" + NRS.downloadedVersion.supernetversionNr + "-beta.zip");
		$("#nrs_update_explanation").hide();
		$("#nrs_update_drop_zone").show();

		$("body").on("dragover.nrs", function (e) {
		    e.preventDefault();
		    e.stopPropagation();

		    if (e.originalEvent && e.originalEvent.dataTransfer) {
		        e.originalEvent.dataTransfer.dropEffect = "copy";
		    }
		});

		$("body").on("drop.nrs", function (e) {
		    NRS.verifyClientUpdate(e);
		});

		$("#nrs_update_drop_zone").on("click", function (e) {
		    e.preventDefault();

		    $("#nrs_update_file_select").trigger("click");

		});

		$("#nrs_update_file_select").on("change", function (e) {
		    NRS.verifyClientUpdate(e);
		});

		return false;
	}

	return NRS;
}(NRS || {}, jQuery));