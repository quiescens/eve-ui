// all related globals are prefixed with "eveui_" to try to avoid collision

// config stuff ( can be overridden in a script block placed immediately after the script tag for this script )
var eveui_preload_initial = 50;
var eveui_preload_interval = 10;
var eveui_selector = "[href^=fitting],[data-dna]";
function eveui_urlify(dna) { return 'https://o.smium.org/loadout/dna/' + encodeURI( dna ); }
var eveui_style = `
    <style>
        .eveui_window { font-family: sans-serif; line-height: 1; background: #eee; border: 1px solid; position:fixed; opacity: 0.95; min-width: 150px; min-height: 100px; }
        .eveui_window .eveui_title { position: absolute; top: 0; left: 0; width: 100%; background: #ccc; cursor: move; }
        .eveui_window .close_button { position: absolute; top: 0; right: 5px; cursor: pointer; height: 1em; width: 1em; background-size: 1em 1em; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSIxMSIgaGVpZ2h0PSIxMSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBvcGFjaXR5PSIuNjU5Ij4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjExIiBoZWlnaHQ9IjExIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJub25lIiAvPgo8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM1NTU1NTUiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTAuNSwwLjUgaDEwIHYxMCBILjUgeiBNLjUsLjUgbDEwLDEwIE0xMC41LC41IEwuNSwxMC41IiAvPgo8L2c+Cjwvc3ZnPg==); }
        .eveui_window .eveui_scrollable { padding-right: 17px; text-align: left; overflow: auto; display: inline-block; max-width: 100%; max-height: 100%; }
        .eveui_window .eveui_content { display: table; margin-top: 15px; padding: 5px; white-space: nowrap; }
        .eveui_window .eveui_item_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 20px 20px; height: 20px; width: 20px; }
        .eveui_window .eveui_ship_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 32px 32px; height: 32px; width: 32px; }
        .eveui_window .eveui_info_icon { display: inline-block; margin: 0 2px; height: 1em; width: 1em; float:right; background-size: 1em 1em; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjeD0iMjUxLjUiIGN5PSIxNzIiIHI9IjIwIi8+DQoJCTxwb2x5Z29uIHBvaW50cz0iMjcyLDM0NCAyNzIsMjE2IDIyNCwyMTYgMjI0LDIyNCAyNDAsMjI0IDI0MCwzNDQgMjI0LDM0NCAyMjQsMzUyIDI4OCwzNTIgMjg4LDM0NCAJCSIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTI1Niw0OEMxNDEuMSw0OCw0OCwxNDEuMSw0OCwyNTZjMCwxMTQuOSw5My4xLDIwOCwyMDgsMjA4YzExNC45LDAsMjA4LTkzLjEsMjA4LTIwOEM0NjQsMTQxLjEsMzcwLjksNDgsMjU2LDQ4eg0KCQkJIE0yNTYsNDQ2LjdjLTEwNS4xLDAtMTkwLjctODUuNS0xOTAuNy0xOTAuN2MwLTEwNS4xLDg1LjUtMTkwLjcsMTkwLjctMTkwLjdjMTA1LjEsMCwxOTAuNyw4NS41LDE5MC43LDE5MC43DQoJCQlDNDQ2LjcsMzYxLjEsMzYxLjEsNDQ2LjcsMjU2LDQ0Ni43eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K); }
        .eveui_window .copy_only { position: absolute; display:inline-block; line-height: 0; font-size: 0; }
        .eveui_window .nocopy::after { content: attr(data-content); }
    </style>
    `;

// variables
var eveui_x = 0;
var eveui_y = 0;
var eveui_drag = null;
var eveui_drag_x = 0;
var eveui_drag_y = 0;
var eveui_zindex = 100;
var eveui_preload_timer;
var eveui_fit_preload = eveui_preload_initial;
var eveui_fit_cache = {};
var eveui_item_cache = {};

$( document ).ready( function() {
    // initialize script
    eveui_mark( "document ready start" );

    // insert required DOM elements / styles
    $( "head" ).append( eveui_style );

    // click handlers to create/close fit windows
    $( document ).on( "click", eveui_selector, function(e) {
        // this handler does not handle clicks inside its own windows
        if ( $( this ).hasClass( "eveui_window") ) {
            return;
        }

        e.preventDefault();

        // hide window if it already exists
        if ( this.eveui_window && document.contains( this.eveui_window[0] ) ) {
            this.eveui_window.remove();
            return;
        }

        var dna = $(this).data("dna") || this.href.substring(8);
        var eveui_name = $(this).text();

        // create loading placeholder
        eveui_window = $( '<span class="eveui_window" data-dna="'+ dna +'"><div class="eveui_title">&nbsp;</div><span class="close_button"></span><span class="eveui_content">Loading...</span></span>' );
        this.eveui_window = eveui_window;
        eveui_window.css( "z-index", eveui_zindex++ );
        eveui_window.css( "left", eveui_x + 10 );
        eveui_window.css( "top", eveui_y - 10 );
        eveui_window.insertAfter( this );
        
        eveui_mark( "fit window created" );

        // load required items and set callback to display
        eveui_cache_items( dna ).done( function() {
            eveui_overlay_show( dna, eveui_name );
            eveui_mark( "fit window populated" );
        }).fail( function() {
            delete eveui_fit_cache[ dna ];
        });
    });

    $( document ).on( "click", ".close_button", function(e) {
        $(this).parent().remove();
    });

    // custom window drag handlers
    $( document ).on( "mousedown", ".eveui_window", function(e) {
        $(this).css( "z-index", eveui_zindex++ );;
    });
    $( document ).on( "mousedown", ".eveui_title", function(e) {
        e.preventDefault();
        eveui_drag = $(this).parent();
        eveui_drag_x = eveui_x - eveui_drag.position().left;
        eveui_drag_y = eveui_y - eveui_drag.position().top;
        eveui_drag.css( "z-index", eveui_zindex++ );;
    });
    $( document ).on( "mousemove", function(e) {
        eveui_x = e.clientX;
        eveui_y = e.clientY;
        if ( eveui_drag === null ) {
            return;
        }
        eveui_drag.css( "left", eveui_x - eveui_drag_x );
        eveui_drag.css( "top", eveui_y - eveui_drag_y );
    });

    $( document ).on( "mouseup", function(e) {
        eveui_drag = null;
    });
    $( window ).on( "resize", function(e) {
        $( ".eveui_window" ).each( function() {
            eveui_window = $(this);
            if ( eveui_window.height() > window.innerHeight - 50 ) {
                eveui_window.css("height", window.innerHeight - 50 + 'px');
            } else {
                eveui_window.css("height", "");
            }
        });
    });

    // lazy preload timer
    eveui_preload_timer = setTimeout( eveui_lazy_preload, 1000 );

    eveui_mark( "document ready end" );
});

function eveui_mark( mark ) {
    // log script time with annotation for performance metric
    if(typeof(CCPEVE) === 'undefined') {
        console.log( mark + " " + performance.now() );
    }
}

function eveui_overlay_show( dna, eveui_name ) {
    // generates and displays a fit
    var high_slots = {};
    var med_slots = {};
    var low_slots = {};
    var rig_slots = {};
    var other_slots = {};

    var items = dna.split(":");

    // ship name and number of slots
    var ship_id = parseInt( items.shift() );
    var ship = eveui_item_cache[ ship_id ];
    for ( var i in ship.dogma.attributes ) {
        var attr = eveui_item_cache[ ship_id ].dogma.attributes[i];
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

        for ( var i in eveui_item_cache[ item_id ].dogma.effects ) {
            if ( eveui_item_cache[ item_id ].dogma.effects[i].effect.name == "hiPower") {
                high_slots[ item_id ] = quantity;
                continue outer;
            } else if ( eveui_item_cache[ item_id ].dogma.effects[i].effect.name == "medPower") {
                med_slots[ item_id ] = quantity;
                continue outer;
            } else if ( eveui_item_cache[ item_id ].dogma.effects[i].effect.name == "loPower") {
                low_slots[ item_id ] = quantity;
                continue outer;
            } else if ( eveui_item_cache[ item_id ].dogma.effects[i].effect.name == "rigSlot") {
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
            html += '<a target="_blank" href="https://o.smium.org/db/type/' + item_id + '"><span class="eveui_info_icon" /></a>';
            html += '<span style="background-image: url(https://image.eveonline.com/Type/' + item_id + '_32.png)" class="eveui_item_icon" />';
            if ( expand ) {
                html += '<span class="copy_only">' + ( eveui_item_cache[ item_id ].name + '<br />').repeat(slots[ item_id ] - 1) + "</span>";
                html += eveui_item_cache[ item_id ].name + '<span class="nocopy" data-content=" x' + slots[ item_id ] + '"></span>';
            } else {
                html += eveui_item_cache[ item_id ].name + ' x' + slots[ item_id ];
            }
            html += "<br />";
        }
        return total_slots;
    }

    var html = '';
    html += '<div class="eveui_title">&nbsp;</div>';
    html += '<span class="close_button"></span>';
    html += '<span class="eveui_scrollable"><span class="eveui_content">';

    html += '<a target="_blank" href="https://o.smium.org/db/type/' + ship_id + '"><span class="eveui_info_icon" /></a>';
    html += '<span style="background-image: url(https://image.eveonline.com/Type/' + ship_id + '_32.png)" class="eveui_ship_icon" />';
    html += '[' + eveui_item_cache[ ship_id ].name + ', <a target="_blank" href="' + eveui_urlify( dna ) + '">' + ( eveui_name || eveui_item_cache[ ship_id ].name ) + '</a>]';

    var empty_slots;

    html += '<br />';
    empty_slots = ship.hiSlots - item_rows( high_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="eveui_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.medSlots - item_rows( med_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="eveui_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.lowSlots - item_rows( low_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="eveui_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    empty_slots = ship.rigSlots - item_rows( rig_slots );
    if ( empty_slots > 0 ) {
        html += '<span class="eveui_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
    }

    html += '<br />';
    item_rows( other_slots, false );

    html += '</span></span>';

    var eveui_window = $( '.eveui_window[data-dna="' + dna + '"]' );
    eveui_window.html( html );

    if ( eveui_window.height() > window.innerHeight - 50 ) {
        eveui_window.css("height", window.innerHeight - 50 + 'px');
    }
    if ( eveui_window[0].getBoundingClientRect().bottom > window.innerHeight ) {
        eveui_window.css("top", window.innerHeight - eveui_window.height() - 25 );
    }
}

function eveui_overlay_hide() {
    // hides the fit overlay
    $( 'body' ).css( "overflow", "" );
    $( 'body' ).css( "margin-right", "" );
    $( '#eveui_overlay' ).hide();
    $( '#eveui_overlay_bg' ).hide();
}

function eveui_lazy_preload() {
    // preload timer function
    var action_taken = false;
    if ( eveui_fit_preload > 0 ) {
        $( eveui_selector ).each( function( i ) {
            var dna = $(this).data("dna") || this.href.substring(8);

            // skip if already pending or cached
            if ( eveui_fit_cache.hasOwnProperty( dna ) ) {
                return;
            }
            action_taken = true;

            eveui_fit_preload--;
            eveui_cache_items( dna ).always( function() {
                clearTimeout( eveui_preload_timer );
                eveui_preload_timer = setTimeout( eveui_lazy_preload, eveui_preload_interval );
            });

            // one request per interval
            return false;
        });
    }
    if ( ! action_taken ) {
        eveui_mark( "preloading finished" );
    }
}

function eveui_cache_items( dna ) {
    // caches all items required to process the specified fit
    if( typeof ( eveui_fit_cache[ dna ] ) === "object" ) {
        return eveui_fit_cache[ dna ];
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
        
        if ( eveui_item_cache.hasOwnProperty( item_id ) ) {
            continue;
        }
        eveui_item_cache[ item_id ] = -1;

        pending.push(
            $.ajax( {
                item_id: item_id,
                url: 'https://crest-tq.eveonline.com/inventory/types/' + item_id +'/',
                dataType: "json",
                cache: true,
            }).done( function(data) {
                eveui_item_cache[ this.item_id ] = data;
            }).fail( function() {
                delete eveui_item_cache[ this.item_id ];
            })
        );
    }
    return eveui_fit_cache[ dna ] = $.when.apply( null, pending );
}


eveui_mark( "script loaded" );
