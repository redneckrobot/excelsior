/*global EWF: false */
/*
 Additional Login needed for off canvas Menus
*/

$(document).ready(function() {

    // Add control div to the top of the global nav element
    $('<div id="menu-controls" class="menu-controls"><span id="sub-menu-title" class="sub-menu-title"></span><a href="#" id="menu-back" class="menu-back icon-left-open">Back</a></div>').prependTo('#global-nav');

    // Find the global Dom and look for all a that have a child ul
    $('#global-nav').find('a[href="#"]').each(function () {

        // Save off the link item just in case
        var $link = $(this),
            $subMenu = $link.next('ul'),
            // Active subnav class
            $activeMenu;

        // Check to see if there is a ul next to the anchor
        if ($subMenu.length) {

            $link.addClass('icon-right-open');

            // We have a sub menu item so create the click event
            $link.on(EWF.activateEventName, function (e) {
                var menuCheck;

                // Prevent default link action
                e.preventDefault();
                e.stopPropagation();

                // Check to see if the active-site-nav is there
                $activeMenu = $('#mobile-site-menu');

                if (!EWF.$body.hasClass($activeMenu.attr('data-active'))) {
                    // The menu is active so add the class
                    EWF.$body.addClass($activeMenu.attr('data-active'));
                    $activeMenu.addClass("active");
                }

                // Check to see if the direct submenu item already is active
                if (!$subMenu.hasClass('active-menu')) {

                    // Check to see if there is another already active menu item
                    menuCheck = $('.active-menu');

                    if (menuCheck.length) {
                        menuCheck.removeClass('active-menu');
                        menuCheck.siblings('a').removeClass('active');
                    }

                    // Set the link text in the title span
                    $('#sub-menu-title').text($link.text());

                    // Add the class of active to the active menu link
                    $link.addClass('active');

                    // Add a class to the menu.
                    $subMenu.addClass("active-menu");

                    EWF.$body.addClass('active-sub-menu');

                    // Add click off event handler on body
                    EWF.$body.on(EWF.activateEventName, function () {
                        // Find all occurances off active menu, active and active-sub-menu and remove them
                        EWF.$body.removeClass('active-sub-menu');
                        $('#global-nav .active').removeClass('active');
                        $('#global-nav .active-menu').removeClass('active-menu');
                    });

                }
                else {
                    // Menu is active
                    $subMenu.removeClass("active-menu");
                    EWF.$body.removeClass($activeMenu.attr('data-active');

                    // Remove off-canvas menu text
                    $('#sub-menu-title').text("");

                    // Remove active link class
                    $link.removeClass('active');
                }
            });
        }
    });

    // Bind for menu-back
    $('#menu-back').on(EWF.activateEventName, function (e) {
        var $numberOfSubs;

        // Prevent element default action
        e.preventDefault();
        e.stopPropagation();

        // Check to see if there is an active menu class
        $numberOfSubs = $('.active-menu');

        if ($numberOfSubs.length > 0) {
            // Find the last occuance of the active menu and hide it
            $numberOfSubs.last().removeClass('active-menu');

            // Remove active class from the active element
            $numberOfSubs.prev('a').removeClass('active');

            // See if there are other menus
            if ($('.active-menu').length === 0) {

                // Remove the sub-menu-title as no sub menus are open
                $('#sub-menu-title').text("");

                // Remove the active-sub-menu class from the body
                EWF.$body.removeClass('active-sub-menu');
            }
        }
    });
});
