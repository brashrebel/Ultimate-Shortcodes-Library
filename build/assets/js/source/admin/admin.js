/**
 * Functionality for the Render admin, globally.
 *
 * @since 1.0.0
 *
 * @global Render_Data
 *
 * @package Render
 * @subpackage Modal
 */
(function ($) {

    // Tracking data buttons
    $(document).on('render-init-pointers', function () {

        // Make sure this function doesn't fire until the pointer has been initialized
        setTimeout(function () {

            var $tracking_container = $('#render-tracking-message');

            // Bail if not present on page
            if (!$tracking_container.length) {
                return;
            }

            // Get our buttons
            var $allow = $tracking_container.find('.render-button'),
                $no_allow = $allow.siblings('.button');

            $allow.click(function () {
                send_ajax(true);
            });

            $no_allow.click(function () {
                send_ajax(false);
            });

            function send_ajax(allow) {

                // Loading
                $tracking_container.wrapInner('<span class="render-temp-wrap"></span>');
                $tracking_container.append('<span class="render-tracking-cover"><span class="spinner"></span></span>');
                $tracking_container.find('.render-tracking-cover').fadeIn(300);

                var data = {
                    action: 'render_tracking_ajax',
                    allow: allow
                };

                $.post(ajaxurl, data, function (response) {
                    console.log(response);

                    if (response.fail) {
                        return;
                    }

                    // Set the appropriate HTML
                    var html = response.allow === 'true' ? Render_Data.l18n.tracking_allow : Render_Data.l18n.tracking_noallow;
                    $tracking_container.find('.render-temp-wrap').html(html);
                    $tracking_container.find('.render-tracking-cover').fadeOut(300, function () {
                        $(this).remove();
                    });

                    // Animate the close button to the middle so people know to click it
                    var $close = $tracking_container.closest('.wp-pointer-content').find('.close');
                    $close.animate({
                        left: (($close.closest('.wp-pointer-buttons').width() / 2 ) - ($close.width() / 2)) * -1
                    }, 300);
                });
            }
        }, 1);
    });

    /**
     * Shows an error in the console.
     *
     * @since 1.1-beta-2
     *
     * @param {string} message The message to log.
     */
    window['render_log_error'] = function (message) {

        console.log(
            '%c ERROR: ' + message,
            'color: #f00;'
        );
    }
})(jQuery);

// Sort by depth plugin
jQuery.fn.sortByDepth = function () {
    var ar = this.map(function () {
            return {length: jQuery(this).parents().length, elt: this}
        }).get(),
        result = [],
        i = ar.length;


    ar.sort(function (a, b) {
        return a.length - b.length;
    });

    while (i--) {
        result.push(ar[i].elt);
    }
    return jQuery(result);
};

// Get unique array
Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}