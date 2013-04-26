/**
 * @fileOverview Excelsior Framework common functions
 * @author <a href="https://github.com/nys-its/excelsior">NYS-ITS</a>
 * @version 0.1.0
 */

/**
 * @namespace
 */
var EWF = {
    activateEventName: 'click',
    ua: navigator.userAgent,
    iOS: false,
    $body: null,
    $html: null,
    $window: null,
    imagePath: 'excelsior/images/' // Relative to project root
};

/**
 * Main initialization method
 */
EWF.init = function _init () {
    var screenMax;

    // Cache often-used queries
    EWF.$body = $('body');
    EWF.$html = $('html');
    EWF.$window = $(window);

    // Monitor-size classes
    screenMax = Math.max(screen.width, screen.height);
    if (screenMax <= 480) {
        EWF.$html.addClass('screen-max-mini');
    }
    else if (screenMax > 480 && screenMax < 768) {
        // Only Foundation's `small-` classes will ever take effect
        EWF.$html.addClass('screen-max-medium');
    }
    else if (screenMax >= 768) {
        // Foundation's `large-` classes may take effect
        EWF.$html.addClass('screen-max-large');
    }

    // Preload assets

    // Images referenced by CSS that aren't visible at page load but will likely appear in normal usage
    EWF.preloader.add('<img src="' + EWF.imagePath + 'close.svg" alt="">');
    EWF.preloader.add('<img src="' + EWF.imagePath + 'close-x-gray.svg" alt="">');
    EWF.preloader.add('<img src="' + EWF.imagePath + 'hamburger-no-dots.svg" alt="">');
    EWF.preloader.add('<img src="' + EWF.imagePath + 'nys-small.png" alt="">');
    EWF.preloader.add('<img src="' + EWF.imagePath + 'nys-banner-img.png" alt="">');

    EWF.preloader.init();
};

$(document).ready(function(){EWF.init();});

/**
 * Client- and environment-related properties
 */
(function () {
  // Determine click type
  if (Modernizr.touch) {
    EWF.activateEventName = 'tap';

    // Zepto.js Touch Events
    // (c) 2010-2012 Thomas Fuchs
    // Zepto.js may be freely distributed under the MIT license.
    // Modified to work with jQuery 1.9.1 by NYS-ITS
    (function(){
      var touch = {},
          touchTimeout, tapTimeout, swipeTimeout,
          longTapDelay = 750, longTapTimeout;

      function parentIfText(node) {
        return 'tagName' in node ? node : node.parentNode;
      }

      function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2),
            yDelta = Math.abs(y1 - y2);
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
      }

      function longTap() {
        longTapTimeout = null;
        if (touch.last) {
          touch.el.trigger('longTap');
          touch = {};
        }
      }

      function cancelLongTap() {
        if (longTapTimeout) {
          clearTimeout(longTapTimeout);
        }
        longTapTimeout = null;
      }

      function cancelAll() {
        if (touchTimeout) { clearTimeout(touchTimeout); }
        if (tapTimeout) { clearTimeout(tapTimeout); }
        if (swipeTimeout) { clearTimeout(swipeTimeout); }
        if (longTapTimeout) { clearTimeout(longTapTimeout); }
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
        touch = {};
      }

      $(document).ready(function(){
        var now, delta;

        $(document.body)
          .bind('touchstart', function(e){
            now = Date.now();
            if (!e.touches && e.originalEvent && e.originalEvent.touches) {
              e.touches = e.originalEvent.touches; // jQuery compatibility
            }
            delta = now - (touch.last || now);
            touch.el = $(parentIfText(e.touches[0].target));
            if (touchTimeout) {
              clearTimeout(touchTimeout);
            }
            touch.x1 = e.touches[0].pageX;
            touch.y1 = e.touches[0].pageY;
            if (delta > 0 && delta <= 250) {
              touch.isDoubleTap = true;
            }
            touch.last = now;
            longTapTimeout = setTimeout(longTap, longTapDelay);
          })
          .bind('touchmove', function(e){
            cancelLongTap();
            if (!e.touches && e.originalEvent && e.originalEvent.touches) {
              e.touches = e.originalEvent.touches; // jQuery compatibility
            }
            touch.x2 = e.touches[0].pageX;
            touch.y2 = e.touches[0].pageY;
            if (Math.abs(touch.x1 - touch.x2) > 10) {
              e.preventDefault();
            }
          })
          .bind('touchend', function(e){
             cancelLongTap();

            // swipe
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {

              swipeTimeout = setTimeout(function() {
                touch.el.trigger('swipe');
                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                touch = {};
              }, 0);
            }
            // normal tap
            else if ('last' in touch) {

              // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
              // ('tap' fires before 'scroll')
              tapTimeout = setTimeout(function() {

                // trigger universal 'tap' with the option to cancelTouch()
                // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                var event = $.Event('tap');
                event.cancelTouch = cancelAll;
                touch.el.trigger(event);

                // trigger double tap immediately
                if (touch.isDoubleTap) {
                  touch.el.trigger('doubleTap');
                  touch = {};
                }

                // trigger single tap after 250ms of inactivity
                else {
                  touchTimeout = setTimeout(function(){
                    touchTimeout = null;
                    touch.el.trigger('singleTap');
                    touch = {};
                  }, 250);
                }

              }, 0);
            }
          })
          .bind('touchcancel', cancelAll);

        $(window).bind('scroll', cancelAll);
      });

      ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
        $.fn[m] = function(callback){ return this.bind(m, callback); };
      });
    })();
    // End Zepto.js
  } // end if(Modernizr.touch)

  // Detect iOS
  if ( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(EWF.ua) && EWF.ua.indexOf( "AppleWebKit" ) > -1 ){
    EWF.iOS = true;

    /*! A fix for the iOS orientationchange zoom bug.
     Script by @scottjehl, rebound by @wilto.
     MIT / GPLv2 License.
     https://github.com/scottjehl/iOS-Orientationchange-Fix
    */
    (function(w){
      var doc = w.document;
      if( !doc.querySelector ){ return; }
      var meta = doc.querySelector( "meta[name=viewport]" ),
          initialContent = meta && meta.getAttribute( "content" ),
          disabledZoom = initialContent + ",maximum-scale=1",
          enabledZoom = initialContent + ",maximum-scale=10",
          enabled = true,
          x, y, z, aig;
      if( !meta ){ return; }
      function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
      }
      function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
      }
      function checkTilt( e ){
        aig = e.accelerationIncludingGravity;
        x = Math.abs( aig.x );
        y = Math.abs( aig.y );
        z = Math.abs( aig.z );
        // If portrait orientation and in one of the danger zones
        if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ) {
          if( enabled ) {
            disableZoom();
          }
        }
        else if( !enabled ){
          restoreZoom();
        }
      }

      w.addEventListener( "orientation change", restoreZoom, false );
      w.addEventListener( "devicemotion", checkTilt, false );
    })( window );

  } // end if(iOS)

}());

/**
 * Navigation Menu Setup
 */
$(document).ready(function(){

  if (!EWF.$body) {
    EWF.$body = $('body');
  }

  // Standard Gov Banner display code
  $('#gov-link-3').on(EWF.activateEventName, function(e) {
    e.preventDefault();
    EWF.$body.addClass('active-gov-bar-search');
  });

  // Active Elements
  $('[data-active]').on(EWF.activateEventName, function(e) {

    // Prevent Defaults
    e.preventDefault();

    // Stop the click from moving up.
    e.stopPropagation();

    // Active attribute class
    var $clickedElm = $(this),
        activeClass = $clickedElm.attr('data-active'),
        $activeElm = $('.active'),
        selectedClass = 'active';

    /**
     * Closes pre-existing active items
     * @param {object} active The active element
     */
    function removeOtherActive(active) {

      // Get the old active class to remove from the body tag
      var activeClass = active.attr('data-active');

      // Remove the old active class
      EWF.$body.removeClass(activeClass);

      // Remove the active class from the old active item
      active.removeClass('active');

    }

    /**
     * Special functionality determined by the data-active value
     * @param {object} activeElm The active element
     */
    function specialEvents(activeElm) {
      if (activeElm === 'active-site-search') {
        $('#site-search-box').focus();
      }

      if (activeElm === 'active-site-menu') {
        // Check to see if off canvas is being used
        if (EWF.$body.hasClass('off-canvas') && EWF.$body.hasClass('active-site-menu')) {
          // Get the screen size and set it has a min-height
          //document.getElementsByTagName("body").style.minHeight = screen.height + "px";
          EWF.$body.css('min-height',screen.height+'px');
        }
        else {
          // Remove min height
          EWF.$body.css('min-height','');
        }
      }
    }

    // Check to see if there is already and active item
    if ($activeElm.length > 0) {
      // Check to make sure its not the same as the currently clicked item
      if ($activeElm.attr('data-active') !== $clickedElm.attr('data-active')) {
        removeOtherActive($activeElm);
      }
    }

    // Check to see if the item is active
    if (EWF.$body.hasClass(activeClass)) {
      // Remove active state class from header
      EWF.$body.removeClass(activeClass);
      // Remove active state class from the clicked element
      $clickedElm.removeClass(selectedClass);
      // Remove any stray body click event
      EWF.$body.off(EWF.activateEventName);
    }
    else {
      // Add active state class from header
      EWF.$body.addClass(activeClass);

      // Add active state class from clicked element
      $clickedElm.addClass(selectedClass);

      // Setup the on click function to close open drop down if the user clicks outside the active element.
      EWF.$body.on(EWF.activateEventName, function(e) {
        var activeElm = $('.active'),
            clicked = $(this);

        // Check for active elements
        if (activeElm.length > 0 && e.target.tagName !== "INPUT") {
          // Since we have an active element get the body class we need
          var activeClass = activeElm.attr('data-active');

          // Remove the active element class
          EWF.$body.removeClass(activeClass);

          // Remove active from the active element
          activeElm.removeClass('active');

          // Remove this click event
          EWF.$body.off(EWF.activateEventName);
        }
      });
    }

    // Check to see if anything special has to happen based on data-active value
    specialEvents(activeClass);
  });
});

/**
 * @namespace Asset Preloader
 */
EWF.preloader = {
    container: null, // The container <div>
    assets: []       // Assets to be preloaded (HTML strings); this can be prepopulated
};

/**
 * Creates an off-screen container for preloaded assets and adds any assets present in the queue.
 * Should be called at document.ready
 */
EWF.preloader.init = function _EWF_preloader_init () {
    // Create container
    EWF.preloader.container = document.createElement('div');
    EWF.preloader.container.className = 'hide-off-screen';
    document.body.appendChild(EWF.preloader.container);

    // Load anything that's already in the queue
    EWF.preloader.assets.forEach(function(i) {
        EWF.preloader.add(i);
    });

    // Empty the queue
    EWF.preloader.assets = [];
};

/**
 * Adds an asset to the preload container
 * May be called before or after preload.setup() has run
 * @param {string} html HTML string to be added to the page
 */
EWF.preloader.add = function _EWF_preloader_add (html) {
    if (!html || typeof html !== 'string') { return false; }

    // If the container has already been set up, add this asset immediately
    if (EWF.preloader.container) {
        EWF.preloader.container.innerHTML += html;
    }
    // Otherwise, queue it to load when setup() is run
    else {
        EWF.preloader.assets.push(html);
    }
};

/**
 * Plugins
 */

try {
    /**
     * Simple array-reversal plugin
     */
    $.fn.reverse = [].reverse;
} catch (e) { }
