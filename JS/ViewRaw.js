// ==UserScript==
// @name         View Raw
// @namespace    http://dev.wikia.com/wiki/MediaWiki:View_Raw/code.js?action=edit
// @version      0.1
// @description  Similar to View Source, adds ?action=raw/&action=raw to pages. Useful for source pages where you don't want to see the rest of the page.
// @author       Kocka
// @match        http://*.wikia.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var url = new mw.Uri();
    url.query.action = 'raw';
    $('.UserProfileActionButton .WikiaMenuElement, .wds-button-group .wds-list').append('<li><a href="' + url.toString() + '">Raw</a></li>');

})();
