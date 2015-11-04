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