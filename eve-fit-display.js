

// all related globals are prefixed with "fit_" to try to avoid collision

// config stuff
var fit_preload_initial = 50;
var fit_preload_interval = 10;
var fit_selector = "[href^=fitting],[data-dna]";
function fit_urlify(dna) { return 'https://o.smium.org/loadout/dna/' + encodeURI( dna ); }

// variables
var fit_x = 0;
var fit_y = 0;
var fit_drag = null;
var fit_drag_x = 0;
var fit_drag_y = 0;
var fit_zindex = 100;
var fit_preload_timer;
var fit_dna_preload = fit_preload_initial;
var fit_dna_cache = {};
var fit_item_cache = {};

$( document ).ready( function() {
    // initialize script
    fit_mark( "document ready start" );

    // insert required DOM elements / styles
    var style = $("<style></style>");
    $( "head" ).append( style );
    var sheet = style[0].sheet;
    var height_rule = 
    sheet.insertRule(".fit_window { font-family: sans-serif; line-height: 1; background: #eee; border: 1px solid; position:fixed; opacity: 0.95; min-width: 150px; min-height: 100px; }", 0);
    sheet.insertRule(".fit_window .fit_title { position: absolute; top: 0; left: 0; width: 100%; background: #ccc; cursor: move; }", 0);
    sheet.insertRule(".fit_window .close_button { position: absolute; top: 0; right: 5px; cursor: pointer; }", 0);
    sheet.insertRule(".fit_window .fit_scrollable { padding-right: 17px; text-align: left; overflow: auto; display: inline-block; max-width: 100%; max-height: 100%; }", 0);
    sheet.insertRule(".fit_window .fit_content { display: table; margin-top: 15px; padding: 5px; white-space: nowrap; }", 0);
    sheet.insertRule(".fit_window .fit_item_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 20px 20px; height: 20px; width: 20px; }", 0);
    sheet.insertRule(".fit_window .fit_ship_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 32px 32px; height: 32px; width: 32px; }", 0);
    sheet.insertRule(".fit_window .fit_info_icon { margin: 0 2px; height: 1em; width: 1em; float:right; }", 0);
    sheet.insertRule(".fit_window .copy_only { position: absolute; display:inline-block; line-height: 0; font-size: 0; }", 0);
    sheet.insertRule(".fit_window .nocopy::after { content: attr(data-content); }", 0);

    // click handlers to create/close fit windows
    $( document ).on( "click", fit_selector, function(e) {
        e.preventDefault();

        // this handler does not handle clicks inside its own windows
        if ( $( this ).hasClass( "fit_window") ) {
            return;
        }

        // hide window if it already exists
        if ( this.fit_window && document.contains( this.fit_window[0] ) ) {
            this.fit_window.remove();
            return;
        }

        var dna = $(this).data("dna") || this.href.substring(8);
        var fit_name = $(this).text();

        // create loading placeholder
        fit_window = $( '<span class="fit_window" data-dna="'+ dna +'"><div class="fit_title">&nbsp;</div><span class="close_button">X</span><span class="fit_content">Loading...</span></span>' );
        this.fit_window = fit_window;
        fit_window.css( "z-index", fit_zindex++ );
        fit_window.css( "left", fit_x + 10 );
        fit_window.css( "top", fit_y - 10 );
        fit_window.insertAfter( this );
        
        fit_mark( "fit window created" );

        // load required items and set callback to display
        fit_cache_items( dna ).done( function() {
            fit_overlay_show( dna, fit_name );
            fit_mark( "fit window populated" );
        }).fail( function() {
            delete fit_dna_cache[ dna ];
        });
    });

    $( document ).on( "click", ".close_button", function(e) {
        $(this).parent().remove();
    });

    // custom window drag handlers
    $( document ).on( "mousedown", ".fit_window", function(e) {
        $(this).css( "z-index", fit_zindex++ );;
    });
    $( document ).on( "mousedown", ".fit_title", function(e) {
        e.preventDefault();
        fit_drag = $(this).parent();
        fit_drag_x = fit_x - fit_drag.position().left;
        fit_drag_y = fit_y - fit_drag.position().top;
        fit_drag.css( "z-index", fit_zindex++ );;
    });
    $( document ).on( "mousemove", function(e) {
        fit_x = e.clientX;
        fit_y = e.clientY;
        if ( fit_drag === null ) {
            return;
        }
        fit_drag.css( "left", fit_x - fit_drag_x );
        fit_drag.css( "top", fit_y - fit_drag_y );
    });

    $( document ).on( "mouseup", function(e) {
        fit_drag = null;
    });
    $( window ).on( "resize", function(e) {
        console.log("moo");
        $( ".fit_window" ).each( function() {
            fit_window = $(this);
            if ( fit_window.height() > window.innerHeight - 50 ) {
                fit_window.css("height", window.innerHeight - 50 + 'px');
            } else {
                fit_window.css("height", "");
            }
        });
    });

    // lazy preload timer
    fit_preload_timer = setTimeout( fit_lazy_preload, 1000 );

    fit_mark( "document ready end" );
});

function fit_mark( mark ) {
    // log script time with annotation for performance metric
    if(typeof(CCPEVE) === 'undefined') {
        console.log( mark + " " + performance.now() );
    }
}

function fit_overlay_show( dna, fit_name ) {
    // generates and displays a fit
    var high_slots = {};
    var med_slots = {};
    var low_slots = {};
    var rig_slots = {};
    var other_slots = {};

    var items = dna.split(":");

    // ship name and number of slots
    var ship_id = parseInt( items.shift() );
    var ship = fit_item_cache[ ship_id ];
    for ( var i in ship.dogma.attributes ) {
        var attr = fit_item_cache[ ship_id ].dogma.attributes[i];
        if ( attr.attribute.name == "hiSlots" ) {
            ship[attr.attribute.name] = attr.value;
        } else if ( attr.attribute.name == "medSlots" ) {
            ship[attr.attribute.name] = attr.value;
        } else if ( attr.attribute.name == "lowSlots" ) {
            ship[attr.attribute.name] = attr.value;
        } else if ( attr.attribute.name == "rigSlots" ) {
            ship[attr.attribute.name] = attr.value;
        }
    }

    // categorize items into slots
    outer: for ( var item in items ) {
        var x = items[item].split(";");
        var item_id = parseInt( x[0] );
        var quantity = parseInt( x[1] );
        if ( isNaN( item_id ) ) {
            continue;
        }

        for ( var i in fit_item_cache[ item_id ].dogma.effects ) {
            if ( fit_item_cache[ item_id ].dogma.effects[i].effect.name == "hiPower") {
                high_slots[ item_id ] = quantity;
                continue outer;
            } else if ( fit_item_cache[ item_id ].dogma.effects[i].effect.name == "medPower") {
                med_slots[ item_id ] = quantity;
                continue outer;
            } else if ( fit_item_cache[ item_id ].dogma.effects[i].effect.name == "loPower") {
                low_slots[ item_id ] = quantity;
                continue outer;
            } else if ( fit_item_cache[ item_id ].dogma.effects[i].effect.name == "rigSlot") {
                rig_slots[ item_id ] = quantity;
                continue outer;
            }
        }
        other_slots[ item_id ] = quantity;
    }

    function item_rows( slots, expand ) {
        if ( typeof expand == "undefined" ) {
            expand = true;
        }
        // generates table rows for listed slots
        var total_slots = 0;
        for ( var item_id in slots ) {
            total_slots += slots[ item_id ];
            html += '<a target="_blank" href="https://o.smium.org/db/type/' + item_id + '"><img class="fit_info_icon" src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%0A%09viewBox%3D%220%200%2062%2062%22%0A%09width%3D%22620%22%20height%3D%22620%22%0A%09version%3D%221.0%22%3E%0A%09%3Cdefs%3E%0A%09%09%3ClinearGradient%20id%3D%22fieldGradient%22%0A%09%09%09gradientUnits%3D%22userSpaceOnUse%22%0A%09%09%09x1%3D%2242.9863%22%20y1%3D%227.01270%22%0A%09%09%09x2%3D%2222.0144%22%20y2%3D%2251.9871%22%3E%0A%09%09%09%3Cstop%20offset%3D%220.0%22%20stop-color%3D%22%23BCD6FE%22%20%2F%3E%0A%09%09%09%3Cstop%20offset%3D%221.0%22%20stop-color%3D%22%236787D3%22%20%2F%3E%0A%09%09%3C%2FlinearGradient%3E%0A%09%09%3ClinearGradient%20id%3D%22edgeGradient%22%0A%09%09%09gradientUnits%3D%22userSpaceOnUse%22%0A%09%09%09x1%3D%2255.4541%22%20y1%3D%2242.7529%22%0A%09%09%09x2%3D%229.54710%22%20y2%3D%2216.2485%22%3E%0A%09%09%09%3Cstop%20offset%3D%220.0%22%20stop-color%3D%22%233057A7%22%20%2F%3E%0A%09%09%09%3Cstop%20offset%3D%221.0%22%20stop-color%3D%22%235A7AC6%22%20%2F%3E%0A%09%09%3C%2FlinearGradient%3E%0A%09%09%3CradialGradient%20id%3D%22shadowGradient%22%3E%0A%09%09%09%3Cstop%20offset%3D%220.0%22%20stop-color%3D%22%23C0C0C0%22%20%2F%3E%0A%09%09%09%3Cstop%20offset%3D%220.88%22%20stop-color%3D%22%23C0C0C0%22%20%2F%3E%0A%09%09%09%3Cstop%20offset%3D%221.0%22%20stop-color%3D%22%23C0C0C0%22%20stop-opacity%3D%220.0%22%20%2F%3E%0A%09%09%3C%2FradialGradient%3E%0A%09%3C%2Fdefs%3E%0A%09%3Ccircle%20id%3D%22shadow%22%20r%3D%2226.5%22%20cy%3D%2229.5%22%20cx%3D%2232.5%22%0A%09%09fill%3D%22url%28%23shadowGradient%29%22%0A%09%09transform%3D%22matrix%281.0648%2C0.0%2C0.0%2C1.064822%2C-2.1%2C1.0864%29%22%20%2F%3E%0A%09%3Ccircle%20id%3D%22field%22%20r%3D%2225.8%22%20cx%3D%2231%22%20cy%3D%2231%22%0A%09%09fill%3D%22url%28%23fieldGradient%29%22%20stroke%3D%22url%28%23edgeGradient%29%22%20stroke-width%3D%222%22%20%2F%3E%0A%09%3Cg%20id%3D%22info%22%20fill%3D%22white%22%3E%0A%09%09%3Cpolygon%20points%3D%2223%2C25%2035%2C25%2035%2C44%2039%2C44%2039%2C48%2023%2C48%2023%2C44%2027%2C44%2027%2C28%2023%2C28%2023%2C25%22%20%2F%3E%0A%09%09%3Ccircle%20r%3D%224%22%20cx%3D%2231%22%20cy%3D%2217%22%20%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A" /></a>';
            html += '<span style="background-image: url(https://image.eveonline.com/Type/' + item_id + '_32.png)" class="fit_item_icon" />';
            if ( expand ) {
                html += '<span class="copy_only">' + ( fit_item_cache[ item_id ].name + '<br />').repeat(slots[ item_id ] - 1) + "</span>";
                html += fit_item_cache[ item_id ].name + '<span class="nocopy" data-content=" x' + slots[ item_id ] + '"></span>';
            } else {
                html += fit_item_cache[ item_id ].name + ' x' + slots[ item_id ];
            }
            html += "<br />";
        }
        return total_slots;
    }

    var html = '';
    html += '<div class="fit_title">&nbsp;</div>';
    html += '<span class="close_button">X</span>';
    html += '<span class="fit_scrollable"><span class="fit_content">';

    html += '<span style="background-image: url(https://image.eveonline.com/Type/' + ship_id + '_32.png)" class="fit_ship_icon" />';
    html += '[' + fit_item_cache[ ship_id ].name + ', <a href="' + fit_urlify( dna ) + '">' + ( fit_name || fit_item_cache[ ship_id ].name ) + '</a>]';

    var empty_slots;

    html += '<br />';
    empty_slots = ship.hiSlots - item_rows( high_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="fit_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.medSlots - item_rows( med_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="fit_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.lowSlots - item_rows( low_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="fit_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.rigSlots - item_rows( rig_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="fit_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    item_rows( other_slots, false );

    html += '</span></span>';

    var fit_window = $( '.fit_window[data-dna="' + dna + '"]' );
    fit_window.html( html );

    if ( fit_window.height() > window.innerHeight - 50 ) {
        fit_window.css("height", window.innerHeight - 50 + 'px');
    }
    if ( fit_window[0].getBoundingClientRect().bottom > window.innerHeight ) {
        fit_window.css("top", window.innerHeight - fit_window.height() - 25 );
    }
}

function fit_overlay_hide() {
    // hides the fit overlay
    $( 'body' ).css( "overflow", "" );
    $( 'body' ).css( "margin-right", "" );
    $( '#fit_overlay' ).hide();
    $( '#fit_overlay_bg' ).hide();
}

function fit_lazy_preload() {
    // preload timer function
    var action_taken = false;
    if ( fit_dna_preload > 0 ) {
        $( fit_selector ).each( function( i ) {
            var dna = $(this).data("dna") || this.href.substring(8);

            // skip if already pending or cached
            if ( fit_dna_cache.hasOwnProperty( dna ) ) {
                return;
            }
            action_taken = true;

            fit_dna_preload--;
            fit_cache_items( dna ).always( function() {
                clearTimeout( fit_preload_timer );
                fit_preload_timer = setTimeout( fit_lazy_preload, fit_preload_interval );
            });

            // one request per interval
            return false;
        });
    }
    if ( ! action_taken ) {
        fit_mark( "preloading finished" );
    }
}

function fit_cache_items( dna ) {
    // caches all items required to process the specified fit
    if( typeof ( fit_dna_cache[ dna ] ) === "object" ) {
        return fit_dna_cache[ dna ];
    }

    var pending = [];

    var items = dna.split(":");
    for ( var item in items ) {
        var x = items[item].split(";");
        var item_id = parseInt( x[0] );
        var quantity = parseInt( x[1] );
        if ( isNaN( item_id ) ) {
            continue;
        }
        
        if ( fit_item_cache.hasOwnProperty( item_id ) ) {
            continue;
        }
        fit_item_cache[ item_id ] = -1;

        pending.push(
            $.ajax( {
                item_id: item_id,
                url: 'https://crest-tq.eveonline.com/inventory/types/' + item_id +'/',
                dataType: "json",
                cache: true,
            }).done( function(data) {
                fit_item_cache[ this.item_id ] = data;
            }).fail( function() {
                delete fit_item_cache[ this.item_id ];
            })
        );
    }
    return fit_dna_cache[ dna ] = $.when.apply( null, pending );
}


fit_mark( "script loaded" );
