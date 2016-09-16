# eve-fit-display
A nearly standalone (EVE Online) fit display script for inclusion in arbitrary websites.
(Does require jQuery to be loaded before this script.)

With the impending removal of the in game browser, ship fittings will have to be viewable out of game (unless you plan to make all your visitors log in and send fits via CREST).

This script can be loaded in an arbitrary HTML document to generate viewable, copy-pasteable fit windows for any element that it detects as a fit.

At present, the script will work with almost any element that has a data-dna attribute containing the DNA of a fit, or links with a href starting with "fitting:", such as:
* \<img src="blah" data-dna="fitting:670::" />
* \<div data-dna="fitting:670::">Pod\</div>
* \<a href="fitting:670::">Pod\</a>

Getting the DNA string for a fit is left as an exercise for the reader, Pyfa and https://o.smium.org/ are both capable of exporting DNA strings, copying ingame text from a notepad or chat will also work.

The data-dna format is more flexible, but the href format can be useful for supporting forums where users might only be allowed to post URLs, or where you already have links to fits and only need to change the href.
