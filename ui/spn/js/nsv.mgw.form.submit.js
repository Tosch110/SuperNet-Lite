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