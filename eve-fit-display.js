// all related globals are prefixed with "fit_" to try to avoid collision

// config stuff ( can be overridden in a script block placed immediately after the script tag for this script )
var fit_preload_initial = 50;
var fit_preload_interval = 10;
var fit_selector = "[href^=fitting],[data-dna]";
function fit_urlify(dna) { return 'https://o.smium.org/loadout/dna/' + encodeURI( dna ); }
var fit_style = `
    <style>
        .fit_window { font-family: sans-serif; line-height: 1; background: #eee; border: 1px solid; position:fixed; opacity: 0.95; min-width: 150px; min-height: 100px; }
        .fit_window .fit_title { position: absolute; top: 0; left: 0; width: 100%; background: #ccc; cursor: move; }
        .fit_window .close_button { position: absolute; top: 0; right: 5px; cursor: pointer; height: 1em; width: 1em; background-size: 1em 1em; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSIxMSIgaGVpZ2h0PSIxMSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBvcGFjaXR5PSIuNjU5Ij4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjExIiBoZWlnaHQ9IjExIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJub25lIiAvPgo8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM1NTU1NTUiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTAuNSwwLjUgaDEwIHYxMCBILjUgeiBNLjUsLjUgbDEwLDEwIE0xMC41LC41IEwuNSwxMC41IiAvPgo8L2c+Cjwvc3ZnPg==); }
        .fit_window .fit_scrollable { padding-right: 17px; text-align: left; overflow: auto; display: inline-block; max-width: 100%; max-height: 100%; }
        .fit_window .fit_content { display: table; margin-top: 15px; padding: 5px; white-space: nowrap; }
        .fit_window .fit_item_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 20px 20px; height: 20px; width: 20px; }
        .fit_window .fit_ship_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 32px 32px; height: 32px; width: 32px; }
        .fit_window .fit_info_icon { display: inline-block; margin: 0 2px; height: 1em; width: 1em; float:right; background-size: 1em 1em; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjeD0iMjUxLjUiIGN5PSIxNzIiIHI9IjIwIi8+DQoJCTxwb2x5Z29uIHBvaW50cz0iMjcyLDM0NCAyNzIsMjE2IDIyNCwyMTYgMjI0LDIyNCAyNDAsMjI0IDI0MCwzNDQgMjI0LDM0NCAyMjQsMzUyIDI4OCwzNTIgMjg4LDM0NCAJCSIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTI1Niw0OEMxNDEuMSw0OCw0OCwxNDEuMSw0OCwyNTZjMCwxMTQuOSw5My4xLDIwOCwyMDgsMjA4YzExNC45LDAsMjA4LTkzLjEsMjA4LTIwOEM0NjQsMTQxLjEsMzcwLjksNDgsMjU2LDQ4eg0KCQkJIE0yNTYsNDQ2LjdjLTEwNS4xLDAtMTkwLjctODUuNS0xOTAuNy0xOTAuN2MwLTEwNS4xLDg1LjUtMTkwLjcsMTkwLjctMTkwLjdjMTA1LjEsMCwxOTAuNyw4NS41LDE5MC43LDE5MC43DQoJCQlDNDQ2LjcsMzYxLjEsMzYxLjEsNDQ2LjcsMjU2LDQ0Ni43eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K); }
        .fit_window .copy_only { position: absolute; display:inline-block; line-height: 0; font-size: 0; }
        .fit_window .nocopy::after { content: attr(data-content); }
    </style>
    `;

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
    $( "head" ).append( fit_style );

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
        fit_window = $( '<span class="fit_window" data-dna="'+ dna +'"><div class="fit_title">&nbsp;</div><span class="close_button"></span><span class="fit_content">Loading...</span></span>' );
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
            html += '<a target="_blank" href="https://o.smium.org/db/type/' + item_id + '"><span class="fit_info_icon" /></a>';
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
    html += '<span class="close_button"></span>';
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
