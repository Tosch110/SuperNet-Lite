/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var ModalEffects = (function() {
	
	function init() {

		var overlay = document.querySelector( '.md-overlay' ),
			overlayFull = document.querySelector( '.md-overlayfull' );

		[].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {

			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
				close = modal.querySelector( '.md-close' ),
				head = $('#' + el.getAttribute( 'data-modal' ) + ' .md-head');
			
			function removeModal( hasPerspective ) {
				classie.remove( modal, 'md-show' );
				
				if (modal.id == "modal-16") {
				    $("#tutorial_iframe").remove();
				}

				if( hasPerspective ) {
					classie.remove( document.documentElement, 'md-perspective' );
				}
				
				$(".cd-3d-nav li").removeClass('cd-selected');
				$(".cd-3d-nav li:first").addClass('cd-selected');
				$(".cd-marker").css('left',0);
			}

			function removeModalHandler() {
				removeModal( classie.has( el, 'md-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'md-show' );
				if (classie.has ( modal, 'md-full')) {
					overlayFull.removeEventListener( 'click', removeModalHandler );
					overlayFull.addEventListener( 'click', removeModalHandler );
				} else {
					overlay.removeEventListener( 'click', removeModalHandler );
					overlay.addEventListener( 'click', removeModalHandler );
				}
				
				type = el.getAttribute( 'data-type' ),
				type2 = el.getAttribute( 'data-type2' );
				
				// Add Type
				if (type || type2) {
					if (!type2) {
						head.prop('src','spn/img/mod_topbar_'+type+'.svg');
					} else {
						head.prop('src','spn/img/mod_topbar_'+type+'_'+type2+'.svg');
					}
				} else {
					head.prop('src','');
				}
				
				var windowHeight = $(window).innerHeight();
				$('.md-content-inner').css('height', (windowHeight - 140)+'px');

				if( classie.has( el, 'md-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'md-perspective' );
					}, 25 );
				}
			});
			
			if (close) {
				close.addEventListener( 'click', function( ev ) {
					ev.stopPropagation();
					removeModalHandler();
				});
			}

		} );

	}

	init();

})();