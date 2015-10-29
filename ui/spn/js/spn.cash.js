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