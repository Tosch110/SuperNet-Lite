var NRS = (function (NRS, $, undefined) {
    NRS.forms.spnSetAlias = function ($modal) {
        var data = NRS.getFormData($modal.find("form:first"));

        data.aliasURI = "acct:" + data.aliasURI + "@nxt";

        return {
            "requestType": "setAlias",
            "data": data
        };
    }

    return NRS;
}(NRS || {}, jQuery));