// all related globals are prefixed with "eveui_" to try to avoid collision

// config stuff ( can be overridden in a script block placed immediately after the script tag for this script )
var eveui_preload_initial = 50;
var eveui_preload_interval = 10;
var eveui_allow_edit = false;
var eveui_fit_selector = "[href^=fitting],[data-dna]";
var eveui_item_selector = "[href^=item],[data-itemid]";
function eveui_urlify(dna) { return 'https://o.smium.org/loadout/dna/' + encodeURI( dna ); }
var eveui_style = `
    <style>
        .eveui_window { font-family: sans-serif; line-height: 1; background: #eee; border: 1px solid; position:fixed; opacity: 0.95; min-width: 150px; min-height: 100px; }
        .eveui_window table { border-spacing: 0; }
        .eveui_window td { padding: 0; }
        .eveui_window th { line-height: 0.5; }
        .eveui_window .eveui_title { position: absolute; top: 0; left: 0; width: 100%; background: #ccc; cursor: move; }
        .eveui_window .close_button { position: absolute; top: 0; right: 5px; cursor: pointer; height: 1em; width: 1em; background-size: 1em 1em; background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjciIHk9Ii0xIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC0zLjMxMzUgNy45OTk1KSIgd2lkdGg9IjIiIGhlaWdodD0iMTcuOTk5Ii8+CjxyZWN0IHg9IjciIHk9Ii0wLjk5OSIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MSAtMC43MDcxIDAuNzA3MSAtMC43MDcxIDcuOTk4OCAxOS4zMTQyKSIgd2lkdGg9IjIiIGhlaWdodD0iMTcuOTk5Ii8+PC9zdmc+Cg==); }
        .eveui_window .eveui_scrollable { padding-right: 17px; text-align: left; overflow: auto; display: inline-block; max-width: 100%; max-height: 100%; }
        .eveui_window .eveui_content { display: table; margin-top: 15px; padding: 5px; white-space: nowrap; }
        .eveui_window .eveui_item_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 20px 20px; height: 20px; width: 20px; }
        .eveui_window .eveui_ship_icon { display: inline-block; vertical-align: middle; margin: 1px 2px; background-size: 32px 32px; height: 32px; width: 32px; }
        .eveui_window .eveui_info_icon { display: inline-block; margin: 0 1px; height: 1em; width: 1em; background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTQ0OCAzODRjMzUgMCA2NC0yOSA2NC02NHMtMjktNjQtNjQtNjQtNjQgMjktNjQgNjQgMjkgNjQgNjQgNjR6IG0wLTMyMGMtMjQ3IDAtNDQ4IDIwMS00NDggNDQ4czIwMSA0NDggNDQ4IDQ0OCA0NDgtMjAxIDQ0OC00NDgtMjAxLTQ0OC00NDgtNDQ4eiBtMCA3NjhjLTE3NyAwLTMyMC0xNDMtMzIwLTMyMHMxNDMtMzIwIDMyMC0zMjAgMzIwIDE0MyAzMjAgMzIwLTE0MyAzMjAtMzIwIDMyMHogbTY0LTMyMGMwLTMyLTMyLTY0LTY0LTY0cy0zMiAwLTY0IDAtNjQgMzItNjQgNjRoNjRzMCAxNjAgMCAxOTIgMzIgNjQgNjQgNjQgMzIgMCA2NCAwIDY0LTMyIDY0LTY0aC02NHMwLTE2MCAwLTE5MnoiIC8+Cjwvc3ZnPgo=); }
        .eveui_window .eveui_plus_icon { display: inline-block; margin: 0 1px; height: 1em; width: 1em; background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTM4NCA0NDhWMTkySDI1NnYyNTZIMHYxMjhoMjU2djI1NmgxMjhWNTc2aDI1NlY0NDhIMzg0eiIgLz4KPC9zdmc+Cg==); }
        .eveui_window .eveui_minus_icon { display: inline-block; margin: 0 1px; height: 1em; width: 1em; background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgNDQ4djEyOGg1MTJWNDQ4SDB6IiAvPgo8L3N2Zz4K); }
        .eveui_window .eveui_elipsis_icon { display: inline-block; margin: 0 1px; height: 1em; width: 1em; background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgNTc2aDEyOHYtMTI4aC0xMjh2MTI4eiBtMC0yNTZoMTI4di0xMjhoLTEyOHYxMjh6IG0wIDUxMmgxMjh2LTEyOGgtMTI4djEyOHogbTI1Ni0yNTZoNTEydi0xMjhoLTUxMnYxMjh6IG0wLTI1Nmg1MTJ2LTEyOGgtNTEydjEyOHogbTAgNTEyaDUxMnYtMTI4aC01MTJ2MTI4eiIgLz4KPC9zdmc+Cg==); }
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

    // click handlers to create/close windows
    $( document ).on( "click", ".eveui_window .close_button", function(e) {
        $(this).parent().remove();
    });

    $( document ).on( "click", eveui_fit_selector, function(e) {
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

        var dna = $(this).data("dna") || this.href.substring(this.href.indexOf(":") + 1);
        var eveui_name = $(this).text();

        // create loading placeholder
        eveui_window = $( '<span class="eveui_window" data-dna="'+ dna +'"><div class="eveui_title">&nbsp;</div><span class="close_button"></span><span class="eveui_content">Loading...</span></span>' );
        this.eveui_window = eveui_window;
        eveui_window.css( "z-index", eveui_zindex++ );
        eveui_window.css( "left", eveui_x + 10 );
        eveui_window.css( "top", eveui_y - 10 );
        eveui_window.appendTo( "body" );
        
        eveui_mark( "fit window created" );

        // load required items and set callback to display
        eveui_cache_fit( dna ).done( function() {
            eveui_fit_show( dna, eveui_name );
            eveui_mark( "fit window populated" );
        }).fail( function() {
            delete eveui_fit_cache[ dna ];
        });
    });

    $( document ).on( "click", eveui_item_selector, function(e) {
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

        var item_id = $(this).data("itemid") || this.href.substring(this.href.indexOf(":") + 1);

        // create loading placeholder
        eveui_window = $( '<span class="eveui_window" data-itemid="'+ item_id +'"><div class="eveui_title">&nbsp;</div><span class="close_button"></span><span class="eveui_scrollable"><span class="eveui_content">Loading...</span></span></span>' );
        this.eveui_window = eveui_window;
        eveui_window.css( "z-index", eveui_zindex++ );
        eveui_window.css( "left", eveui_x + 10 );
        eveui_window.css( "top", eveui_y - 10 );
        eveui_window.appendTo( "body" );

        eveui_mark( "item window created" );

        // load required items and set callback to display
        eveui_cache_fit( item_id ).done( function() {
            var html = "";
            var item = eveui_item_cache[ item_id ];
            for ( var i in item.dogma.attributes ) {
                var attr = item.dogma.attributes[i];
                html += '<tr>';
                html += '<td>' + attr.attribute.name;
                html += '<td>' + attr.value;
            }

            eveui_window.find(".eveui_content").html(html);
            eveui_window.find(".eveui_title").html(item.name);

            $( window ).trigger( "resize" );

            eveui_mark( "item window populated" );
        }).fail( function() {
            eveui_window.remove();
        });
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
            eveui_window.css( "height", "" );
            if ( eveui_window.height() > window.innerHeight - 50 ) {
                eveui_window.css( "height", window.innerHeight - 50 );
            }
            if ( eveui_window[0].getBoundingClientRect().bottom > window.innerHeight ) {
                eveui_window.css( "top", window.innerHeight - eveui_window.height() - 25 );
            }
            if ( eveui_window[0].getBoundingClientRect().right > window.innerWidth ) {
                eveui_window.css( "left", window.innerWidth - eveui_window.width() - 25 );
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

function eveui_fit_show( dna, eveui_name ) {
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
            html += '<tr>';
            html += '<td><span style="background-image: url(https://image.eveonline.com/Type/' + item_id + '_32.png)" class="eveui_item_icon" />';
            if ( expand ) {
                html += '<span class="copy_only">' + ( eveui_item_cache[ item_id ].name + '<br />').repeat(slots[ item_id ] - 1) + "</span>";
                html += eveui_item_cache[ item_id ].name + '<span class="nocopy" data-content=" x' + slots[ item_id ] + '"></span>';
            } else {
                html += eveui_item_cache[ item_id ].name + ' x' + slots[ item_id ];
            }
            html += '<td><a href="item:' + item_id + '"><span class="eveui_info_icon" /></a>';
            if ( eveui_allow_edit ) {
                html += '<td><a href="item:' + item_id + '"><span class="eveui_plus_icon" /></a>';
                html += '<td><a href="item:' + item_id + '"><span class="eveui_minus_icon" /></a>';
                html += '<td><a href="item:' + item_id + '"><span class="eveui_elipsis_icon" /></a>';
            }
        }
        return total_slots;
    }

    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span style="background-image: url(https://image.eveonline.com/Type/' + ship_id + '_32.png)" class="eveui_ship_icon" />';
    html += '[' + eveui_item_cache[ ship_id ].name + ', <a target="_blank" href="' + eveui_urlify( dna ) + '">' + ( eveui_name || eveui_item_cache[ ship_id ].name ) + '</a>]';
    html += '<td><a target="_blank" href="item:' + ship_id + '"><span class="eveui_info_icon" /></a>';

    var empty_slots;

    function slot_discrepancy( slot_count ) {
        if ( slot_count > 0 ) {
            return '<tr><td><span class="eveui_item_icon" /><span class="nocopy" data-content="Empty x' + empty_slots + '"></span><br />';
        }
        if ( slot_count < 0 ) {
            return '<tr><td><span class="eveui_item_icon" /><span class="nocopy" data-content="Excess x' + empty_slots + '"></span><br />';
        }
    }
    empty_slots = ship.hiSlots - item_rows( high_slots );
    if ( empty_slots ) {
        html += slot_discrepancy( empty_slots );
    }

    html += '<tr /><th>&nbsp;';
    empty_slots = ship.medSlots - item_rows( med_slots );
    if ( empty_slots ) {
        html += slot_discrepancy( empty_slots );
    }

    html += '<tr /><th>&nbsp;';
    empty_slots = ship.lowSlots - item_rows( low_slots );
    if ( empty_slots ) {
        html += slot_discrepancy( empty_slots );
    }

    html += '<tr /><th>&nbsp;';
    empty_slots = ship.rigSlots - item_rows( rig_slots );
    if ( empty_slots ) {
        html += slot_discrepancy( empty_slots );
    }

    html += '<tr /><th>&nbsp;';
    item_rows( other_slots, false );

    html += '</table>';

    var eveui_window = $( '.eveui_window[data-dna="' + dna + '"]' );
    eveui_window.find(".eveui_content").html( html );

    $( window ).trigger( "resize" );
}

function eveui_lazy_preload() {
    // preload timer function
    var action_taken = false;
    if ( eveui_fit_preload > 0 ) {
        $( eveui_fit_selector ).each( function( i ) {
            var dna = $(this).data("dna") || this.href.substring(8);

            // skip if already pending or cached
            if ( eveui_fit_cache.hasOwnProperty( dna ) ) {
                return;
            }
            action_taken = true;

            eveui_fit_preload--;
            eveui_cache_fit( dna ).always( function() {
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

function eveui_cache_fit( dna ) {
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
        
        pending.push( eveui_cache_item( item_id ) );
    }
    return eveui_fit_cache[ dna ] = $.when.apply( null, pending );
}

function eveui_cache_item( item_id ) {
    if ( eveui_item_cache.hasOwnProperty( item_id ) ) {
        // if item is already cached, we can return a resolved promise
        return $.when(true);
    }

    eveui_item_cache[ item_id ] = -1;
    return $.ajax( {
        item_id: item_id,
        url: 'https://crest-tq.eveonline.com/inventory/types/' + item_id +'/',
        dataType: "json",
        cache: true,
    }).done( function(data) {
        eveui_item_cache[ this.item_id ] = data;
    }).fail( function() {
        delete eveui_item_cache[ this.item_id ];
    });
}


eveui_mark( "script loaded" );
