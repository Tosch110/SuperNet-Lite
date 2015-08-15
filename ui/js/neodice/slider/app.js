//====================================================

//define models & logic

app.models.slideOffsets = new Model(); //sliders percentage

app.models.result = new Model();   //bet results

app.models.settings = new Model();

function checkBetSize () {
	var result = app.models.result;
	var betSize = result.get("betSize");

	var newBetSize = betSize;

	if (betSize < result.get("minBet")) {
		newBetSize = Math.ceil(result.get("minBet"));
	}

	if (betSize > result.get("maxBet")) {
		newBetSize = Math.floor(result.get("maxBet"));
	}

	if (betSize != newBetSize) {
		setTimeout(function() {
			result.set("betSize", newBetSize);
		}, 10);
	}
}

function sliderInit () {
	var settings = app.models.settings;
	var slideOffsets = app.models.slideOffsets;
	var result = app.models.result;

	settings.set("leastChance", 1);
	settings.set("bestChance", 98);

	/*
	 Utils.getServerData(function(data){
	 //settings.set("serverData",data);

	 settings.set("minBet",data.bankrol.minbet);
	 settings.set("maxBet",data.bankrol.maxbet);
	 settings.set("yesterdaySecret",data.secret.yesterday);
	 settings.set("todaySecret",data.secret.todayhash);
	 });
	 */

	slideOffsets.on("percent1", function(percent) {
		slideOffsets.set("percent2", 100 - percent);
	});


	slideOffsets.on("percent2", function(percent) {
		slideOffsets.set("percent1", 100 - percent);
	});

	slideOffsets.on("percent1", function(percent) {
		var leastChance = settings.get("leastChance");
		var bestChance = settings.get("bestChance");

		var odds = Utils.calcOdds(percent, leastChance, bestChance);
		odds = afterFloatPoint(odds, 0);

		var bestGain = Utils.calcGain(odds);
		bestGain = afterFloatPoint(bestGain, 2);

		result.set("odds", odds);

		result.set("bestGain", bestGain);


		result.set("minBet", Utils.calcMinBet(odds));

		result.set("maxBet", Utils.calcMaxBet(odds));


		result.set("minBetUI", afterFloatPoint(result.get("minBet"), 0));

		result.set("maxBetUI", afterFloatPoint(result.get("maxBet"), 0));

		checkBetSize();
	});

	result.on("betSize", function(betSize) {
		checkBetSize();

		betSize = result.get("betSize");

		var bestGain = result.get("bestGain");

		var profit = (betSize * bestGain);

		result.set("profit", profit);
	});

	result.on("bestGain", function(bestGain) {
		var betSize = result.get("betSize");

		var profit = (betSize * bestGain);
		result.set("profit", profit);

		var payout = profit + betSize;
		result.set("payout", payout);

	});

	result.on("profit", function(val) {
		result.set("profitUI", afterFloatPoint(val, 1));
	});

	result.on("payout", function(val) {
		result.set("payoutUI", afterFloatPoint(val, 1));
	});

	result.on("odds", function(val) {
		result.set("oddsUI", afterFloatPoint(val, 0));
	});


	//====================================================

	//define views

	var slider1 = new SlideBar(slideOffsets, "percent1", "#chance-to-win-template", function(percent) {
		var leastChance = settings.get("leastChance");
		var bestChance = settings.get("bestChance");

		var odds = Utils.calcOdds(percent, leastChance, bestChance);

		return afterFloatPoint(odds, 0) + "%";
	}, "least chance", "best chance");

	var slider2 = new SlideBar(slideOffsets, "percent2", "#gain-template", function(percent) {
		percent = 100 - percent;

		var leastChance = settings.get("leastChance");
		var bestChance = settings.get("bestChance");

		var odds = Utils.calcOdds(percent, leastChance, bestChance);
		odds = afterFloatPoint(odds, 0);

		var bestGain = Utils.calcGain(odds);
		bestGain = afterFloatPoint(bestGain,2);

		return "x" + afterFloatPoint(bestGain, 2);

	}, "least gain", "best gain");


	$(".slideWrapper1").append(slider1.el);

	$(".slideWrapper2").append(slider2.el);


	$(".minBet").bindText(result, "minBetUI");
	$(".maxBet").bindText(result, "maxBetUI");
	$(".gain-ui").bindText(result, "gainUI");
	$(".yesterdaySecret").bindText(settings, "yesterdaySecret");
	$(".todaySecret").bindText(settings, "todaySecret");


	$(".betSize").bindText(result, "betSize");
	$(".oddSize").bindText(result, "oddsUI");
	$(".profit").bindText(result, "profitUI");
	$(".payout").bindText(result, "payoutUI");
	$(".chanceToWin").bindText(result, "oddsUI");

	$('.increase').click(function(e) {
		increaseBet();
	});

	$('.decrease').click(function(e) {
		decreaseBet();
	});

	//====================================================

	//set start ui settings

	slideOffsets.set("percent1", 50);

	result.set("betSize", 100);
}


function increaseBet () {
	var result = app.models.result;
	var bet = Number(result.get("betSize")) + 1;
	result.set("betSize", bet);
}

function decreaseBet () {
	var result = app.models.result;
	var bet = Number(result.get("betSize")) - 1;
	result.set("betSize", bet);
}
