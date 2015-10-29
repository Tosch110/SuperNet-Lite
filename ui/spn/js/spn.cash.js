var NRS = (function (NRS, $, undefined) {

    NRS.cash = {};

    NRS.coinOperations = {

        operators : {

            coinomat : {


                url : 'https://www.coinomat.com/api/v1/',
                options : {

                    EUR : {
                        VISAMASTER : {
                            name : "VISAMASTER",
                            display : "Visa/Master"
                        }
                    },
                    USD : {

                        PERFECT : {
                            name : "PERFECT",
                            display : "Perfekt Money"
                        },
                        EGOPAY : {
                            name : "EGOPAY",
                            display : "Ego Pay"
                        },
                        OKPAY : {
                            name : "OKPAY",
                            display : "OK Pay"
                        },
                        VISAMASTER : {
                            name : "VISAMASTER",
                            display : "Visa/Master"
                        },
                        BTCE : {
                            name : "BTCE",
                            display : "BTC-e USD code"
                        }

                    }

                }

            },
            coinimal : {

                url: 'https://www.coinimal.com/supernet/trade',
                options : {

                    EUR : {
                        VISAMASTER : function () { return 'Visa/Master'; }
                    },
                    USD : {

                        PERFECT : function () { return 'Perfect'; },
                        EGOPAY : function () { return 'EgoPay'; },
                        OKPAY : function () { return 'OkPay'; },
                        VISAMASTER : function () { return 'Visa/Master'; },
                        BTCE : function () { return "BTCE"; }

                    }

                }


            }

        }
    };


    return NRS;
}(NRS || {}, jQuery));