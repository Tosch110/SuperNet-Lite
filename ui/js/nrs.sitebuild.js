/**
 * @depends {3rdparty/jquery-2.1.0.js}
 */
var NRS = (function(NRS, $, undefined) {

    NRS.loadLockscreenHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("body").prepend(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadHeaderHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("body").prepend(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadSidebarHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("#sidebar").append(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadSidebarContextHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("body").append(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadPageHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("#content").append(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadModalHTML = function(path, options) {
    	jQuery.ajaxSetup({ async: false });
    	$.get(path, '', function (data) { $("body").append(data); });
    	jQuery.ajaxSetup({ async: true });
    }

    NRS.loadPageHTMLTemplates = function(options) {
        //Not used stub, for future use
    }

    NRS.loadModalHTMLTemplates = function (options) {
        jQuery.ajaxSetup({ async: false });
        
        var html = "";
        var template = undefined;

        html = $('div#recipient_modal_template').html();
        template = Handlebars.compile(html);
        $('div[data-replace-with-modal-template="recipient_modal_template"]').each(function (i) {
            var name = $(this).closest('.modal').attr('id').replace('_modal', '');
            var context = { name: name };
            $(this).replaceWith(template(context));
        });
        $('div#recipient_modal_template').hide();

        html = $('div#add_message_modal_template').html();
        template = Handlebars.compile(html);
        $('div[data-replace-with-modal-template="add_message_modal_template"]').each(function (i) {
            var name = $(this).closest('.modal').attr('id').replace('_modal', '');
            var context = { name: name };
            $(this).replaceWith(template(context));
        });
        $('div#add_message_modal_template').hide();

        html = $('div#secret_phrase_modal_template').html();
        template = Handlebars.compile(html);
        $('div[data-replace-with-modal-template="secret_phrase_modal_template"]').each(function (i) {
            var name = $(this).closest('.modal').attr('id').replace('_modal', '');
            var context = { name: name };
            $(this).replaceWith(template(context));
        });
        $('div#secret_phrase_modal_template').hide();

        html = $('div#advanced_modal_template').html();
        template = Handlebars.compile(html);
        $('div[data-replace-with-modal-template="advanced_modal_template"]').each(function (i) {
            var name = $(this).closest('.modal').attr('id').replace('_modal', '');
            var context = { name: name };
            $(this).replaceWith(template(context));
        });
        $('div#advanced_modal_template').hide();

        html = $('div#advanced_modal_no_fee_deadline_template').html();
        template = Handlebars.compile(html);
        $('div[data-replace-with-modal-template="advanced_modal_no_fee_deadline_template"]').each(function (i) {
            var name = $(this).closest('.modal').attr('id').replace('_modal', '');
            var context = { name: name };
            $(this).replaceWith(template(context));
        });
        $('div#advanced_modal_no_fee_deadline_template').hide();

        jQuery.ajaxSetup({ async: true });
    }

return NRS;
}(NRS || {}, jQuery));