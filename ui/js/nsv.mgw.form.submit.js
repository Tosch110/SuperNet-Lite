var NRS = (function (NRS, $, undefined) {
    NRS.forms.mgwSendMessage = function ($modal) {
        var data = {
            "messageIsText": false,
            "message": $.trim($("#mgw_gen_deposit_addr_msg").val()),
            "recipient": $.trim($("#mgw_gen_deposit_addr_recipient").val()),
            "feeNXT": $.trim($("#mgw_gen_deposit_addr_fee").val()),
            "deadline": $.trim($("#mgw_gen_deposit_addr_deadline").val()),
            "secretPhrase": $.trim($("#mgw_gen_deposit_addr_password").val())
        };
        
        return {
            "requestType": "sendMessage",
            "data": data
        };
    }

    NRS.forms.mgwTransferAsset = function ($modal) {
        var data = NRS.getFormData($modal.find("form:first"));

        return {
            "requestType": "transferAsset",
            "data": data
        };
    }
    return NRS;
}(NRS || {}, jQuery));