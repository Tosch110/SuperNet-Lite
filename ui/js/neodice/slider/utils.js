var Utils = {
	mockServerData: function(options, callback) {
		var data;
		switch (options.requestType) {
			case 'getAccount':
				data = {
					"unconfirmedBalanceNQT": "2501162882344",
					"effectiveBalanceNXT": 13983,
					"currentLessee": "7114946486381367146",
					"currentLeasingHeightTo": 281179,
					"forgedBalanceNQT": "0",
					"balanceNQT": "2501162882344",
					"publicKey": "73080c6a224062660184f10ebb7fb431d4593...",
					"requestProcessingTime": 2,
					"assetBalances": [
						{
							"balanceQNT": "96651298",
							"asset": "4551058913252105307"
						}
					],
					"guaranteedBalanceNQT": "1398383666344",
					"unconfirmedAssetBalances": [
						{
							"unconfirmedBalanceQNT": "96651298",
							"asset": "4551058913252105307"
						}
					],
					"currentLesseeRS": "NXT-TMVC-69YC-SJB4-8YCH7",
					"accountRS": "NXT-4VNQ-RWZC-4WWQ-GVM8S",
					"name": "mystical",
					"account": "17013046603665206934",
					"currentLeasingHeightFrom": 279739
				};
				break;
			case 'transferAsset':
				data = {
					"signatureHash": "f622557588bc82942984286e431c978e687783b32db6a68a1c554b2e11349751",
					"unsignedTransactionBytes": "0211c9ebda013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b...",
					"transactionJSON": {
						"senderPublicKey": "57fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b473beec228f79ff93c",
						"signature": "33d0fccf1f19d18b4ca97d2636cf62f7a801c07628d1bbb1d6084dc3ca658d...",
						"feeNQT": "100000000",
						"type": 2,
						"fullHash": "c8f25b15b48fb5efd3341fb369627d00f8fefb59dc18016ba0c482b6de7cad59",
						"version": 1,
						"ecBlockId": "3925493493266246517",
						"signatureHash": "f622557588bc82942984286e431c978e687783b32db6a68a1c554b2e11349751",
						"attachment": {
							"version.AssetTransfer": 1,
							"quantityQNT": "1000",
							"asset": "17554243582654188572"
						},
						"senderRS": "NXT-L6FM-89WK-VK8P-FCRBB",
						"subtype": 1,
						"amountNQT": "0",
						"sender": options.recipient,
						"recipientRS": "NXT-4VNQ-RWZC-4WWQ-GVM8S",
						"recipient": "17013046603665206934",
						"ecBlockHeight": 288416,
						"deadline": options.deadline,
						"transaction": "17272869949464638152",
						"timestamp": 31124425,
						"height": 2147483647
					},
					"broadcasted": true,
					"requestProcessingTime": 4968,
					"transactionBytes": "0211c9ebda013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b473b...",
					"fullHash": "c8f25b15b48fb5efd3341fb369627d00f8fefb59dc18016ba0c482b6de7cad59",
					"transaction": "17272869949464638152"
				};
				break;
			case 'sendMoney':
				data = {
					"signatureHash": "b35eae7d2f01639810d37694138aa0a86fbbf8a9bf58c2be4f2a5b8f0f30b3f7",
					"unsignedTransactionBytes": "001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143...",
					"transactionJSON": {
						"senderPublicKey": "57fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b473beec228f79ff93c",
						"signature": "5f0378b7390ff5a815eadd1354de533eef682f139362b153576e2207320a6...",
						"feeNQT": options.feeNQT,
						"type": 0,
						"fullHash": "3a304584f20cf3d2cbbdd9698ff9a166427005ab98fbe9ca4ad6253651ee81f1",
						"version": 1,
						"ecBlockId": "17321329645912574173",
						"signatureHash": "b35eae7d2f01639810d37694138aa0a86fbbf8a9bf58c2be4f2a5b8f0f30b3f7",
						"senderRS": "NXT-L6FM-89WK-VK8P-FCRBB",
						"subtype": 0,
						"amountNQT": options.amountNQT,
						"sender": options.recipient,
						"recipientRS": "NXT-4VNQ-RWZC-4WWQ-GVM8S",
						"recipient": "17013046603665206934",
						"ecBlockHeight": 275727,
						"deadline": options.deadline,
						"transaction": "15200507403046301754",
						"timestamp": 29796934,
						"height": 2147483647
					},
					"broadcasted": true,
					"requestProcessingTime": 8475,
					"transactionBytes": "001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143...",
					"fullHash": "3a304584f20cf3d2cbbdd9698ff9a166427005ab98fbe9ca4ad6253651ee81f1",
					"transaction": "15200507403046301754"
				};
				break;
			default:
				data = {error: 1, message: 'unhandled server requestType'};
		}

		setTimeout(function() {
			callback(null, data);
		}, 100);

		//setTimeout(function() {
		//	callback(null, {
		//		"secret" : {
		//			"yesterday": "238472938e729423",
		//			"todayhash": "9238472932342323"
		//		},
		//		"bankrol": {
		//			"total" : 12345,
		//			"minbet": 50,
		//			"maxbet": 1000
		//		}
		//	});
		//}, 100)
	},

	calcGain: function(odds) {

		var edge = 0.01;

		return (100 / odds) * (1 - edge);

	},

	calcOdds: function(percent, leastChance, bestChance) {

		return (percent * (bestChance - leastChance) / 100) + leastChance;
	},

	calcMinBet: function(odds) {

		var edge = 0.01;
		var transactionFee = 1;

		var minbet = Math.ceil((2 * transactionFee * odds) / (100 * (1 - edge) - odds));
		return (minbet < 2) ? 2 : minbet;
	},

	calcMaxBet: function(odds) {

		var edge = 0.01;
		var bankroll = 2000000;

		return bankroll * (odds / 100) / ((1 - edge) * 100);
	}
};


function afterFloatPoint (num, howMuch) {
	return Number((num).toFixed(howMuch));
}


$.fn.bindText = function(model, property) {
	var self = this;

	self.text(model.get(property));
	self.val(model.get(property));


	model.on(property, function(val) {
		self.text(val);
		self.val(val);
	});

	self.on("change keyup", function() {
		model.set(property, self.val());
	});
};
