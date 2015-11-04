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
    NRS.forms.mgwTransferAsset = function ($modal) {
        var data = NRS.getFormData($modal.find("form:first"));

        data.comment = '{"redeem":"' + "BTCD" + '","withdrawaddr":"' + $("#mgw_withdraw_modal_address").val() + '","InstantDEX":""}';
        data.message = '{"redeem":"' + "BTCD" + '","withdrawaddr":"' + $("#mgw_withdraw_modal_address").val() + '","InstantDEX":""}';
        data.quantityQNT = NRS.convertToQNT($("#mgw_withdraw_modal_total_amount").val(), 4);

        if (!$("#mgw_withdraw_modal_address").val().trim()) {
            $btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
            var $form = $modal.find("form:first");
            $form.find(".error_message").html("Please specify withdraw address").show();

            NRS.unlockForm($modal, $btn);
            return;
        }

        return {
            "requestType": "transferAsset",
            "data": data
        };
    }
    return NRS;
}(NRS || {}, jQuery));