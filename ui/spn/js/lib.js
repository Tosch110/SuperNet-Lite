z = {
    /**
     * clearForm
     * Set All Field to Blank
     */
    clearForm: function(str,numField) {
        for(var i=1; i<=numField; i++) {
            var tmpField = $("#field"+String(str)+i+'cont');
            if (tmpField.is('select')) {
                $("#field" + String(str) + i + 'cont option:first-child').attr("selected", "selected");
            } else {
                tmpField.val('');
            }
        }

        //clear possible alert
        if (str == 11) {
            $("#modal-" + str + " .alert-danger").hide();
        }
        $("#modal-" + str + " .callout").hide();
        $("#modal-" + str + " .md-submit").button('reset');
    }
};