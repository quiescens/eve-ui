// all related globals are prefixed with "eveui_" to try to avoid collision
// for clarity and consistency:
// " are only used for html attribute values
// ' are used for javascript values
// ` used whenever interpolation is required

// config stuff ( can be overridden in a script block placed immediately after the script tag for this script )
var eveui_use_localstorage = 4000000;
var eveui_preload_initial = 50;
var eveui_preload_interval = 10;
var eveui_mode = 'multi_window'; // expand_all, expand, multi_window, modal
var eveui_allow_edit = false;
var eveui_fit_selector = '[href^=fitting],[data-dna]';
var eveui_item_selector = '[href^=item],[data-itemid]';
var eveui_char_selector = '[href^=char],[data-charid]';
function eveui_urlify( dna ) { return 'https://o.smium.org/loadout/dna/' + encodeURI( dna ); }
function eveui_autocomplete_endpoint( str ) { return 'https://zkillboard.com/autocomplete/typeID/' + encodeURI( str ) + '/'; }
/* icons from https://github.com/primer/octicons */
var eveui_style = `
	<style>
		.eveui_window {
			position: fixed;
			line-height: 1;
			background: #eee;
			border: 1px solid;
			opacity: 0.95;
			display: flex;
			flex-direction: column;
		}
		.eveui_modal_overlay {
			cursor: pointer;
			position: fixed;
			background: #000;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 10;
			opacity: 0.5;
		}
		.eveui_title {
			width: 100%;
			background: #ccc;
			cursor: move;
			white-space: nowrap;
			margin-right: 2em;
		}
		.eveui_scrollable {
			padding-right: 17px;
			text-align: left;
			overflow: auto;
		}
		.eveui_content {
			display: inline-block;
			margin: 2px;
			max-width: 30em;
		}
		.eveui_content div {
			display: flex;
		}
		.eveui_content table {
			border-collapse: collapse;
		}
		.eveui_content td {
			vertical-align: top;
			padding: 0 2px;
		}
		.eveui_flexgrow {
			flex-grow: 1;
		}
		.eveui_fit_header {
			align-items: center;
		}
		.eveui_line_spacer {
			line-height: 0.5em;
		}
		.eveui_right {
			text-align: right;
		}
		.eveui_icon {
			display: inline-block;
			margin: 1px;
			vertical-align: middle;
			height: 1em;
			width: 1em;
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
		.eveui_item_icon {
			height: 20px;
			width: 20px;
		}
		.eveui_ship_icon {
			height: 32px;
			width: 32px;
		}
		.eveui_close_icon {
			cursor: pointer;
			position: absolute;
			top: 0;
			right: 0;
			background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjciIHk9Ii0xIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC0zLjMxMzUgNy45OTk1KSIgd2lkdGg9IjIiIGhlaWdodD0iMTcuOTk5Ii8+CjxyZWN0IHg9IjciIHk9Ii0wLjk5OSIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MSAtMC43MDcxIDAuNzA3MSAtMC43MDcxIDcuOTk4OCAxOS4zMTQyKSIgd2lkdGg9IjIiIGhlaWdodD0iMTcuOTk5Ii8+PC9zdmc+Cg==);
		}
		.eveui_info_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTQ0OCAzODRjMzUgMCA2NC0yOSA2NC02NHMtMjktNjQtNjQtNjQtNjQgMjktNjQgNjQgMjkgNjQgNjQgNjR6IG0wLTMyMGMtMjQ3IDAtNDQ4IDIwMS00NDggNDQ4czIwMSA0NDggNDQ4IDQ0OCA0NDgtMjAxIDQ0OC00NDgtMjAxLTQ0OC00NDgtNDQ4eiBtMCA3NjhjLTE3NyAwLTMyMC0xNDMtMzIwLTMyMHMxNDMtMzIwIDMyMC0zMjAgMzIwIDE0MyAzMjAgMzIwLTE0MyAzMjAtMzIwIDMyMHogbTY0LTMyMGMwLTMyLTMyLTY0LTY0LTY0cy0zMiAwLTY0IDAtNjQgMzItNjQgNjRoNjRzMCAxNjAgMCAxOTIgMzIgNjQgNjQgNjQgMzIgMCA2NCAwIDY0LTMyIDY0LTY0aC02NHMwLTE2MCAwLTE5MnoiIC8+Cjwvc3ZnPgo=);
		}
		.eveui_plus_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTM4NCA0NDhWMTkySDI1NnYyNTZIMHYxMjhoMjU2djI1NmgxMjhWNTc2aDI1NlY0NDhIMzg0eiIgLz4KPC9zdmc+Cg==);
		}
		.eveui_minus_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgNDQ4djEyOGg1MTJWNDQ4SDB6IiAvPgo8L3N2Zz4K);
		}
		.eveui_more_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgNTc2aDEyOHYtMTI4aC0xMjh2MTI4eiBtMC0yNTZoMTI4di0xMjhoLTEyOHYxMjh6IG0wIDUxMmgxMjh2LTEyOGgtMTI4djEyOHogbTI1Ni0yNTZoNTEydi0xMjhoLTUxMnYxMjh6IG0wLTI1Nmg1MTJ2LTEyOGgtNTEydjEyOHogbTAgNTEyaDUxMnYtMTI4aC01MTJ2MTI4eiIgLz4KPC9zdmc+Cg==);
		}
		.eveui_edit_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTcwNCA2NEw1NzYgMTkybDE5MiAxOTIgMTI4LTEyOEw3MDQgNjR6TTAgNzY4bDAuNjg4IDE5Mi41NjJMMTkyIDk2MGw1MTItNTEyTDUxMiAyNTYgMCA3Njh6TTE5MiA4OTZINjRWNzY4aDY0djY0aDY0Vjg5NnoiIC8+Cjwvc3ZnPgo=);
		}
		.eveui_copy_icon {
			cursor: pointer;
			background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTcwNCA4OTZoLTY0MHYtNTc2aDY0MHYxOTJoNjR2LTMyMGMwLTM1LTI5LTY0LTY0LTY0aC0xOTJjMC03MS01Ny0xMjgtMTI4LTEyOHMtMTI4IDU3LTEyOCAxMjhoLTE5MmMtMzUgMC02NCAyOS02NCA2NHY3MDRjMCAzNSAyOSA2NCA2NCA2NGg2NDBjMzUgMCA2NC0yOSA2NC02NHYtMTI4aC02NHYxMjh6IG0tNTEyLTcwNGMyOSAwIDI5IDAgNjQgMHM2NC0yOSA2NC02NCAyOS02NCA2NC02NCA2NCAyOSA2NCA2NCAzMiA2NCA2NCA2NCAzMyAwIDY0IDAgNjQgMjkgNjQgNjRoLTUxMmMwLTM5IDI4LTY0IDY0LTY0eiBtLTY0IDUxMmgxMjh2LTY0aC0xMjh2NjR6IG00NDgtMTI4di0xMjhsLTI1NiAxOTIgMjU2IDE5MnYtMTI4aDMyMHYtMTI4aC0zMjB6IG0tNDQ4IDI1NmgxOTJ2LTY0aC0xOTJ2NjR6IG0zMjAtNDQ4aC0zMjB2NjRoMzIwdi02NHogbS0xOTIgMTI4aC0xMjh2NjRoMTI4di02NHoiIC8+Cjwvc3ZnPgo=);
		}
		.copy_only {
			position: absolute;
			display:inline-block;
			line-height: 0;
			font-size: 0;
		}
		.nocopy::after {
			content: attr(data-content);
		}
		.nowrap {
			white-space: nowrap;
		}
		.float_left {
			float: left;
		}
		.float_right {
			float: right;
		}
	</style>
	`;

eveui_mark( 'script start' );
// variables
var eveui_x = 0;
var eveui_y = 0;
var eveui_drag = null;
var eveui_drag_x = 0;
var eveui_drag_y = 0;
var eveui_zindex = 100;
var eveui_preload_timer;
var eveui_fit_preload = eveui_preload_initial;
var eveui_cache = {};
var eveui_eve_version = undefined;

if( typeof( Storage ) === 'undefined' ) {
	eveui_use_localstorage = -1;
}

function eveui_init() {
	eveui_mark( 'eve version request' );
	$.ajax(
		`https://crest-tq.eveonline.com/`,
		{
			dataType: 'json',
			cache: true,
		}
		).done(	function(data) {
			eveui_eve_version = data.serverVersion;
			eveui_mark( 'eve version response ' + eveui_eve_version );
			if( eveui_use_localstorage > 0 ) {
				var localstorage_cache = JSON.parse( localStorage.getItem( 'eveui_cache' ) );
				$.each( localstorage_cache, function( k, v ) {
					if ( k.startsWith( 'EVE' ) ) {
						// version key
						if ( k === eveui_eve_version ) {
							$.extend( eveui_cache, v );
						} else {
							delete localstorage_cache[ k ];
						}
					} else {
						// timestamp key
						if ( Number( k ) > Date.now() ) {
							$.extend( eveui_cache, v );
						} else {
							delete localstorage_cache[ k ];
						}
					}
				});
				localStorage.setItem( 'eveui_cache', JSON.stringify( localstorage_cache ) );
				eveui_mark( 'eveui_cache loaded' );
			}

			// insert required DOM elements / styles
			$( 'head' ).append( eveui_style );

			// click handlers to create/close windows
			$( document ).on( 'click', '.eveui_window .eveui_close_icon', function(e) {
				$( this ).parent().remove();
				if ( $( '.eveui_window' ).length == 0 ) {
					$( '.eveui_modal_overlay' ).remove();
				}
			});
			$( document ).on( 'click', '.eveui_modal_overlay', function(e) {
				$( '.eveui_window' ).remove();
				$( this ).remove();
			});

			$( document ).on( 'click', eveui_fit_selector, function(e) {
				e.preventDefault();

				eveui_fit_preload = eveui_preload_initial;

				// hide window if it already exists
				if ( this.eveui_window && document.contains( this.eveui_window[0] ) ) {
					this.eveui_window.remove();
					return;
				}

				var dna = $( this ).attr( 'data-dna' ) || this.href.substring(this.href.indexOf( ':' ) + 1);
				var eveui_name = $( this ).attr( 'data-title' ) || $( this ).text().trim();

				switch ( eveui_mode ) {
					case 'modal':
					case 'multi_window':
						// create loading placeholder
						this.eveui_window = eveui_new_window( 'Fit' );
						eveui_mark( 'fit window created' );

						this.eveui_window.attr( 'data-eveui-dna', dna );
						$( 'body' ).append( this.eveui_window );
						break;
					case 'expand':
						$( this ).attr( 'data-eveui-expand', 1 );
						eveui_expand_fits();
						break;
				}

				eveui_fit_window( dna, eveui_name );
				$( window ).trigger( 'resize' );
			});

			$( document ).on( 'click', eveui_item_selector, function(e) {
				e.preventDefault();

				// hide window if it already exists
				if ( this.eveui_window && document.contains( this.eveui_window[0] ) ) {
					this.eveui_window.remove();
					return;
				}

				var item_id = $( this ).attr( 'data-itemid' ) || this.href.substring(this.href.indexOf( ':' ) + 1);

				// create loading placeholder
				this.eveui_window = eveui_new_window( 'Item' );
				this.eveui_window.attr( 'data-eveui-itemid', item_id );
				switch ( eveui_mode ) {
					default:
						$( 'body' ).append( this.eveui_window );
						break;
				}

				eveui_mark( 'item window created' );

				// load required items and set callback to display
				eveui_cache_request( 'inventory/types/' + item_id ).done( function() {
					var eveui_window = $( `.eveui_window[data-eveui-itemid="${ item_id }"]` );
					var html = '';
					html += '<table class="nowrap">';
					var item = eveui_cache[ 'inventory/types/' + item_id ];
					html += `<tr><td>${ item.name }`;
					for ( var i in item.dogma.attributes ) {
						var attr = item.dogma.attributes[i];
						html += '<tr>';
						html += '<td>' + attr.attribute.name;
						html += '<td>' + attr.value;
					}
					html += '</table>';

					eveui_window.find( '.eveui_content' ).html(html);

					$( window ).trigger( 'resize' );

					eveui_mark( 'item window populated' );
				}).fail( function() {
					var eveui_window = $( `.eveui_window[data-eveui-itemid="${ item_id }"]` );
					eveui_window.remove();
				});
				$( window ).trigger( 'resize' );
			});

			$( document ).on( 'click', eveui_char_selector, function(e) {
				e.preventDefault();

				// hide window if it already exists
				if ( this.eveui_window && document.contains( this.eveui_window[0] ) ) {
					this.eveui_window.remove();
					return;
				}

				var char_id = $( this ).attr( 'data-charid' ) || this.href.substring(this.href.indexOf( ':' ) + 1);

				// create loading placeholder
				this.eveui_window = eveui_new_window( 'Character' );
				this.eveui_window.attr( 'data-eveui-charid', char_id );
				switch ( eveui_mode ) {
					default:
						$( 'body' ).append( this.eveui_window );
						break;
				}

				eveui_mark( 'char window created' );

				// load required chars and set callback to display
				eveui_cache_request( 'characters/' + char_id ).done( function() {
					var character = eveui_cache[ 'characters/' + char_id ];
					var eveui_window = $( `.eveui_window[data-eveui-charid="${ char_id }"]` );
					var html = '';
					html += '<table>';
					html += `
						<tr><td colspan="2">
						<img class="float_left" src="https://imageserver.eveonline.com/Character/${ character.id }_128.jpg" height="128" width="128" />
						${ character.name }
						<hr />
						<img class="float_left" src="https://imageserver.eveonline.com/Corporation/${ character.corporation.id_str }_64.png" height="64" width="64" />
						Member of ${ character.corporation.name }
						<tr><td>Bio:<td>${ character.description.replace( /<font[^>]+>/g, '<font>' ) }
						`;
					html += '</table>';

					eveui_window.find( '.eveui_content' ).html(html);

					$( window ).trigger( 'resize' );

					eveui_mark( 'char window populated' );
				}).fail( function() {
					var eveui_window = $( `.eveui_window[data-eveui-charid="${ char_id }"]` );
					eveui_window.remove();
				});
				$( window ).trigger( 'resize' );
			});

			$( document ).on( 'click', '.eveui_minus_icon', function(e) {
				e.preventDefault();
				var item_id = $( this ).closest( '[data-eveui-itemid]' ).attr( 'data-eveui-itemid' );
				var dna = $( this ).closest( '[data-eveui-dna]' ).attr( 'data-eveui-dna' );

				var re = new RegExp( ':' + item_id + ';(\\d+)' );
				var new_quantity = parseInt( dna.match( re )[1] ) - 1;
				if ( new_quantity > 0 ) { 
					dna = dna.replace( re, ':' + item_id + ';' + new_quantity );
				} else {
					dna = dna.replace( re, '' );
				}

				$( this ).closest( '[data-eveui-dna]' ).attr( 'data-eveui-dna', dna );
				eveui_fit_window( dna );
			});

			$( document ).on( 'click', '.eveui_plus_icon', function(e) {
				e.preventDefault();
				var item_id = $( this ).closest( '[data-eveui-itemid]' ).attr( 'data-eveui-itemid' );
				var dna = $( this ).closest( '[data-eveui-dna]' ).attr( 'data-eveui-dna' );

				var re = new RegExp( `:${ item_id };(\\d+)` );
				var new_quantity = parseInt( dna.match( re )[1] ) + 1;
				if ( new_quantity > 0 ) { 
					dna = dna.replace( re, `:${ item_id };${ new_quantity }` );
				} else {
					dna = dna.replace( re, '' );
				}

				$( this ).closest( '[data-eveui-dna]' ).attr( 'data-eveui-dna', dna );
				eveui_fit_window( dna );
			});

			$( document ).on( 'click', '.eveui_more_icon', function(e) {
				e.preventDefault();
				var item_id = $( this ).closest( '[data-eveui-itemid]' ).attr( 'data-eveui-itemid' );
				var dna = $( this ).closest( '[data-eveui-dna]' ).attr( 'data-eveui-dna' );

				var eveui_window = $( `
					<span class="eveui_window" style="position:absolute">
						<span class="eveui_close_icon" />
						<span class="eveui_content">
							Autocomplete goes here
						</span>
					</span>
					` );
				eveui_window.css( 'z-index', eveui_zindex++ );
				$( this ).parent().after( eveui_window );
			});

			$( document ).on( 'click', '.eveui_copy_icon', function(e) {
				eveui_copy( $( this ).closest( '.eveui_window' ) );
			});

			// custom window drag handlers
			$( document ).on( 'mousedown', '.eveui_window', function(e) {
				$( this ).css( 'z-index', eveui_zindex++ );;
			});

			$( document ).on( 'mousedown', '.eveui_title', function(e) {
				e.preventDefault();
				eveui_drag = $( this ).parent();
				eveui_drag_x = eveui_x - eveui_drag.position().left;
				eveui_drag_y = eveui_y - eveui_drag.position().top;
				eveui_drag.css( 'z-index', eveui_zindex++ );;
			});

			$( document ).on( 'mousemove', function(e) {
				eveui_x = e.clientX;
				eveui_y = e.clientY;
				if ( eveui_drag === null ) {
					return;
				}
				eveui_drag.css( 'left', eveui_x - eveui_drag_x );
				eveui_drag.css( 'top', eveui_y - eveui_drag_y );
			});

			$( document ).on( 'mouseup', function(e) {
				eveui_drag = null;
			});

			$( window ).on( 'resize', function(e) {
				$( '.eveui_window' ).each( function() {
					var eveui_window = $( this );
					var eveui_content = eveui_window.find( '.eveui_content' );
					if ( eveui_content.height() > window.innerHeight - 50 ) {
						eveui_window.css( 'height', window.innerHeight - 50 );
					} else {
						eveui_window.css( 'height', '' );
					}
					if ( eveui_content.width() > window.innerWidth - 20 ) {
						eveui_window.css( 'width', window.innerWidth - 20 );
					} else {
						eveui_window.css( 'width', '' );
					}
					if ( eveui_window[0].getBoundingClientRect().bottom > window.innerHeight ) {
						eveui_window.css( 'top', window.innerHeight - eveui_window.height() - 10 );
					}
					if ( eveui_window[0].getBoundingClientRect().right > window.innerWidth ) {
						eveui_window.css( 'left', window.innerWidth - eveui_window.width() - 10 );
					}
				});
				if ( eveui_mode == 'modal' ) {
					var eveui_window = $( '[data-eveui-modal]' );
					eveui_window.css( 'top', window.innerHeight / 2 - eveui_window.height() / 2 );
					eveui_window.css( 'left', window.innerWidth / 2 - eveui_window.width() / 2 );
				}
			});

			$( document ).ready( function() {
				eveui_mark( 'expanding fits' );
				eveui_expand_fits();
			});

			eveui_mark( 'event handlers set' );

			// lazy preload timer
			eveui_preload_timer = setTimeout( eveui_lazy_preload, eveui_preload_interval );
			eveui_mark( 'preload timer set' );
		}).fail( function( xhr ) {
			eveui_mark( 'eve version request failed' );
			setTimeout( eveui_init, 10000 );

	});
}
eveui_init();

function eveui_new_window( title = '&nbsp;' ) {
	var eveui_window = $( `
		<span class="eveui_window">
			<div class="eveui_title">${ title }</div>
			<span class="eveui_icon eveui_close_icon" />
			<span class="eveui_scrollable">
				<span class="eveui_content">
					Loading...
				</span>
			</span>
		</span>
	` );
	if ( eveui_mode === 'modal' && $( '.eveui_modal_overlay' ).length === 0 ) {
		$( 'body' ).append( `<div class="eveui_modal_overlay" />` );
		eveui_window.attr( 'data-eveui-modal', 1 );
	}
	eveui_window.css( 'z-index', eveui_zindex++ );
	eveui_window.css( 'left', eveui_x + 10 );
	eveui_window.css( 'top', eveui_y - 10 );
	return eveui_window;
}

function eveui_mark( mark: string ) {
	// log script time with annotation for performance metric
	console.log( 'eveui: ' + performance.now().toFixed(3) + ' ' + mark);
}

function eveui_generate_fit( dna: string, eveui_name?: string ) {
	// generates and displays a fit
	var high_slots = {};
	var med_slots = {};
	var low_slots = {};
	var rig_slots = {};
	var subsystem_slots = {};
	var other_slots = {};

	var items = dna.split( ':' );

	// ship name and number of slots
	var ship_id = parseInt( items.shift() );
	var ship = eveui_cache[ 'inventory/types/' + ship_id ];
	for ( var i in ship.dogma.attributes ) {
		var attr = eveui_cache[ 'inventory/types/' + ship_id ].dogma.attributes[i];
		if ( attr.attribute.name == 'hiSlots' ) {
			ship[attr.attribute.name] = attr.value;
		} else if ( attr.attribute.name == 'medSlots' ) {
			ship[attr.attribute.name] = attr.value;
		} else if ( attr.attribute.name == 'lowSlots' ) {
			ship[attr.attribute.name] = attr.value;
		} else if ( attr.attribute.name == 'rigSlots' ) {
			ship[attr.attribute.name] = attr.value;
		} else if ( attr.attribute.name == 'maxSubSystems' ) {
			ship[attr.attribute.name] = attr.value;
		}
	}

	// categorize items into slots
	outer: for ( var item in items ) {
		if ( items[item].length == 0 ) {
			continue;
		}
		var match = items[item].split( ';' );
		var item_id = match[0];
		var quantity = parseInt( match[1] );

		for ( var i in eveui_cache[ 'inventory/types/' + item_id ].dogma.effects ) {
			if ( eveui_cache[ 'inventory/types/' + item_id ].dogma.effects[i].effect.name == 'hiPower') {
				high_slots[ item_id ] = quantity;
				continue outer;
			} else if ( eveui_cache[ 'inventory/types/' + item_id ].dogma.effects[i].effect.name == 'medPower') {
				med_slots[ item_id ] = quantity;
				continue outer;
			} else if ( eveui_cache[ 'inventory/types/' + item_id ].dogma.effects[i].effect.name == 'loPower') {
				low_slots[ item_id ] = quantity;
				continue outer;
			} else if ( eveui_cache[ 'inventory/types/' + item_id ].dogma.effects[i].effect.name == 'rigSlot') {
				rig_slots[ item_id ] = quantity;
				continue outer;
			} else if ( eveui_cache[ 'inventory/types/' + item_id ].dogma.effects[i].effect.name == 'subSystem') {
				subsystem_slots[ item_id ] = quantity;
				continue outer;
			}
		}
		other_slots[ item_id ] = quantity;
	}

	function item_rows( fittings, slots_available?: number ) {
		// generates table rows for listed slots
		var html = '';
		var slots_used = 0;

		for ( var item_id in fittings ) {
			slots_used += fittings[ item_id ];
			if ( slots_available ) {
				html += `
					<tr class="copy_only">
					<td>
						${ ( eveui_cache[ 'inventory/types/' + item_id ].name + '<br />').repeat(fittings[ item_id ] ) }
					<tr class="nocopy" data-eveui-itemid="${ item_id }">
						<td><img src="https://imageserver.eveonline.com/Type/${ item_id }_32.png" class="eveui_icon eveui_item_icon" />
						<td class="eveui_right">${ fittings[ item_id ] }
						<td>${ eveui_cache[ 'inventory/types/' + item_id ].name }
					`;
			} else {
				html += `
					<tr class="copy_only">
					<td>
						${ eveui_cache[ 'inventory/types/' + item_id ].name } x${ fittings[ item_id ] }
					<tr class="nocopy" data-eveui-itemid="${ item_id }">
						<td><img src="https://imageserver.eveonline.com/Type/${ item_id }_32.png" class="eveui_icon eveui_item_icon" />
						<td class="eveui_right">${ fittings[ item_id ] }
						<td>${ eveui_cache[ 'inventory/types/' + item_id ].name }
					`;
			}
			html += `
				<td class="eveui_right nowrap"><span data-itemid="${ item_id }" class="eveui_icon eveui_info_icon" />
				`;
			if ( eveui_allow_edit ) {
				html += `
					<span class="eveui_icon eveui_plus_icon" />
					<span class="eveui_icon eveui_minus_icon" />
					<span class="eveui_icon eveui_more_icon" />
					`;
			}
		}

		if ( typeof ( slots_available ) != 'undefined' ) {
			if ( slots_available > slots_used ) {
				html += `
					<tr class="nocopy">
						<td class="eveui_icon eveui_item_icon" />
						<td class="eveui_right nowrap">${ slots_available - slots_used }
						<td>Empty
					`;
				if ( eveui_allow_edit ) {
					html += '<td class="eveui_right"><span class="eveui_more_icon" />';
				}
			}
			if ( slots_used > slots_available ) {
				html += `
					<tr class="nocopy">
						<td class="eveui_icon eveui_item_icon" />
						<td class="eveui_right">${ slots_available - slots_used }
						<td>Excess
					`;
			}
		}

		return html;
	}

	var html = '';
	html += `
		<table>
		<tr class="eveui_fit_header" data-eveui-itemid="${ ship_id }">
		<td colspan="2"><img src="https://imageserver.eveonline.com/Type/${ ship_id }_32.png" class="eveui_icon eveui_ship_icon" />
		<td>
			<span class="eveui_startcopy" />[${ eveui_cache[ 'inventory/types/' + ship_id ].name },
			<a target="_blank" href="${ eveui_urlify( dna ) }">${ eveui_name || eveui_cache[ 'inventory/types/' + ship_id ].name }</a>]
		<td class="eveui_right">
		<span class="eveui_icon eveui_copy_icon" />
		<span data-itemid="${ ship_id }" class="eveui_icon eveui_info_icon" />
		`;
	if ( eveui_allow_edit ) {
		html += `
			<span class="eveui_icon" />
			<span class="eveui_icon" />
			<span class="eveui_icon eveui_more_icon" />
			`;
	}
	html += `
		<tbody>
		${ item_rows( high_slots, ship.hiSlots ) }
		<tr><td class="eveui_line_spacer">&nbsp;
		${ item_rows( med_slots, ship.medSlots ) }
		<tr><td class="eveui_line_spacer">&nbsp;
		${ item_rows( low_slots, ship.lowSlots ) }
		<tr><td class="eveui_line_spacer">&nbsp;
		${ item_rows( rig_slots, ship.rigSlots ) }
		<tr><td class="eveui_line_spacer">&nbsp;
		${ item_rows( subsystem_slots, ship.maxSubsystems ) }
		<tr><td class="eveui_line_spacer">&nbsp;
		${ item_rows( other_slots ) }
		</tbody>
		</table>
		<span class="eveui_endcopy" />
		`;

	return html;
}

function eveui_fit_window( dna: string, eveui_name?: string ) {
	// load required items and set callback to display
	eveui_mark( 'fit window created' );
	eveui_cache_fit( dna ).done( function() {
		var eveui_window = $( `.eveui_window[data-eveui-dna="${ dna }"]` );
		eveui_window.find( '.eveui_content ').html( eveui_generate_fit( dna, eveui_name) );
		$( window ).trigger( 'resize' );
		eveui_mark( 'fit window populated' );
	});
}

function eveui_expand_fits() {
	var expand_filter = '[data-eveui-expand]';
	if ( eveui_mode == "expand_all" ) {
		expand_filter = '*';
	}
	$( eveui_fit_selector ).filter( expand_filter ).each( function() {
		var dna = $( this ).attr( 'data-dna' ) || this.href.substring(this.href.indexOf( ':' ) + 1);
		var selected_element = $( this );
		eveui_cache_fit( dna ).done( function() {
			var eveui_name = $( this ).text().trim();
			selected_element.replaceWith( `<span class="eveui_content">${ eveui_generate_fit( dna, eveui_name ) }</span>` );
			eveui_mark( 'fit window populated' );
		});
	});
}

function eveui_lazy_preload() {
	// preload timer function
	var action_taken = false;
	if ( eveui_fit_preload > 0 ) {
		$( eveui_fit_selector ).not( '[data-eveui-cached]' ).each( function( i ) {
			var elem = $( this );
			var dna = elem.data( 'dna' ) || this.href.substring(this.href.indexOf( ':' ) + 1);

			var cache = eveui_cache_fit( dna );

			// skip if already cached
			if ( cache.state() === 'resolved' ) {
				elem.attr( 'data-eveui-cached', 1 );
			} else {
				eveui_fit_preload--;
				action_taken = true;
				cache.always( function() {
					clearTimeout( eveui_preload_timer );
					eveui_preload_timer = setTimeout( eveui_lazy_preload, eveui_preload_interval );
				});
			}
		});
	}
	if ( !action_taken ) {
		eveui_preload_timer = setTimeout( eveui_lazy_preload, 5000 );
	}
}

function eveui_cache_fit( dna: string ) {
	// caches all items required to process the specified fit
	var pending = [];

	var items = dna.split( ':' );
	for ( var item in items ) {
		if ( items[item].length == 0 ) {
			continue;
		}
		var match = items[item].split( ';' );
		var item_id = match[0];

		pending.push( eveui_cache_request( 'inventory/types/' + item_id ) );
	}
	return $.when.apply( null, pending );
}

function eveui_cache_request( endpoint: string ) {
	if ( typeof ( eveui_cache[ endpoint ] ) === 'object' ) {
		if ( typeof ( eveui_cache[ endpoint ].promise ) === 'function' ) {
			// item is pending, return the existing deferred object
			return eveui_cache[ endpoint ];
		} else {
			// if item is already cached, we can return a resolved promise
			return $.Deferred().resolve();
		}
	}

	return eveui_cache[ endpoint ] = $.ajax(
		`https://crest-tq.eveonline.com/${ endpoint }/`,
		{
			dataType: 'json',
			cache: true,
		}
		).done( function(data) {
			eveui_cache[ endpoint ] = data;
			if ( eveui_use_localstorage > 0 ) {
				var localstorage_cache = JSON.parse( localStorage.getItem( 'eveui_cache' ) ) || {};
				var key;
				if ( endpoint.startsWith( 'inventory/types' ) ) {
					// inventory/types endpoint should be reliably cachable until such time as the version changes
					key = eveui_eve_version;
				} else {
					// default 1hr expire
					key = Date.now() + ( 60 * 60 * 1000 );
				}
				if ( typeof( localstorage_cache[ key ] ) !== 'object' ) {
					localstorage_cache[ key ] = {};
				}
				localstorage_cache[ key ][ endpoint ] = data;
				var localstorage_cache_json = JSON.stringify( localstorage_cache );
				if ( localstorage_cache_json.length > eveui_use_localstorage ) {
					return;
				}
				try {
					localStorage.setItem( 'eveui_cache', localstorage_cache_json );
				}
				catch( err ) {
					// failure to add to long term cache doesn't have any significant effect that would require a catch block
				}
			}
		}).fail( function( xhr ) {
			if ( xhr.status == 404 || xhr.status == 403 ) {
				// 403 is permanent for our purposes
				// 404 will usually be a "permanent" error
			} else {
				// otherwise, assume temporary error and try again when possible
				delete eveui_cache[ endpoint ];
			}
		});
}

function eveui_copy( element ) {
	$( '.nocopy' ).hide();
	$( '.copyonly' ).show();
	var selection = window.getSelection();
	var range = document.createRange();
	if ( element.find( '.eveui_startcopy' ).length ) {
		range.setStart( element.find( '.eveui_startcopy' )[0], 0 );
		range.setEnd( element.find( '.eveui_endcopy' )[0], 0 );
	} else {
		range.selectNodeContents( element[0] );
	}
	selection.removeAllRanges();
	selection.addRange( range );
	document.execCommand( 'copy' );
	selection.removeAllRanges();
	$( '.nocopy' ).show();
	$( '.copyonly' ).hide();
}

/* from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat */
if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
	'use strict';
	if (this == null) {
		throw new TypeError('can\'t convert ' + this + ' to object');
	}
	var str = '' + this;
	count = +count;
	if (count != count) {
		count = 0;
	}
	if (count < 0) {
		throw new RangeError('repeat count must be non-negative');
	}
	if (count == Infinity) {
		throw new RangeError('repeat count must be less than infinity');
	}
	count = Math.floor(count);
	if (str.length == 0 || count == 0) {
		return '';
	}
	// Ensuring count is a 31-bit integer allows us to heavily optimize the
	// main part. But anyway, most current (August 2014) browsers can't handle
	// strings 1 << 28 chars or longer, so:
	if (str.length * count >= 1 << 28) {
		throw new RangeError('repeat count must not overflow maximum string size');
	}
	var rpt = '';
	for (;;) {
		if ((count & 1) == 1) {
			rpt += str;
		}
		count >>>= 1;
		if (count == 0) {
			break;
		}
		str += str;
	}
	// Could we try:
	// return Array(count + 1).join(this);
	return rpt;
	}
}
/* https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith */
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position){
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}
eveui_mark( 'script end' );
