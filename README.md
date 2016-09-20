# eve-ui
A nearly standalone (EVE Online) fit display script for inclusion in arbitrary websites.

https://quiescens.github.io/eve-ui/examples.html to see it in action.

With the impending removal of the in game browser, ship fittings will have to be viewable out of game (unless you plan to make all your visitors log in and send fits via CREST).
This script can be loaded in an arbitrary HTML document to generate viewable, copy-pasteable fit windows for any element that it detects as a fit.

* Does not require any particular server side infrastructure on your part.
* Requires jQuery to be loaded before this script.
* Pulls item info from CCP's own CREST which should (theoretically) always be up to date.
* (Will eventually) pull autocomplete for item search from zkillboard.com ?

At present, the script should work with almost any element that has a data-dna or data-itemid attribute containing the appropriate values (dna string or itemid), or links with a href starting with "fitting:" or "item:", such as:
* \<img src="blah" data-dna="fitting:670::" />
* \<div data-dna="fitting:670::">Pod\</div>
* \<a href="fitting:670::">Pod\</a>
The data- format is more flexible, but the href format can be useful for supporting forums or CMS's where users might only be allowed to post URLs, or where you already have links on a site and only need to change the href.

Getting the DNA string for a fit is left as an exercise for the reader, see:
* Pyfa
* https://o.smium.org/
* https://www.fuzzwork.co.uk/ships/dnagen.php
* Copying ingame text from a notepad or chat also works if you know how
