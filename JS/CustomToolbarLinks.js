// ==UserScript==
// @name         CustomToolbarLinks
// @namespace    http://dev.wikia.com/wiki/MediaWiki:CustomToolbarLinks/code.js
// @version      0.1
// @description  This script adds a new popup menu on the Oasis toolbar next to My Tools that contains a user-specified set of links, which can be internal or external and default to a link to Main Page.
// @author       Bobogoobo
// @match        http://kancolle.wikia.com/wiki/*
// @grant        none
// ==/UserScript==

var customPages = [
	['MediaWiki:Wikia.js', 'Wikia.js'],
    ['MediaWiki:Wikia.css', 'Wikia.css'],
    ['MediaWiki:Common.js', 'Common.js'],
    ['MediaWiki:Common.css', 'Common.css'],
    ['MediaWiki:ClosedThreads.css', 'ClosedThreads.css'],
	['MediaWiki:ImportJS', 'ImportJS'],
    ['Special:JSPages', 'JSPages'],
	['Special:EditWatchList', 'EditWatchList'],
	['Special:GameGuidesPreview', 'GameGuidesPreview'],
	['Special:GlobalUsage', 'GlobalUsage'],
    ['Special:UploadStash', 'UploadStash'],
    ];

(function() {
    if ( typeof customPages == 'undefined' ) {
                customPages = [['Main Page']];
    }
    var addCode = '<li class="mytools menu"><span class="arrow-icon-ctr">' +
                      '<span class="arrow-icon arrow-icon-single"></span></span>' +
                      '<a href="#">Hidden Links</a><ul id="custom-links-menu" class="tools-menu">',
    c_href, c_html;

    for ( var i = 0; i < customPages.length; i++ ) {
        c_href = customPages[i][0];

        if ( customPages[i].length > 1 ) {
            c_html = customPages[i][1];
        } else {
            c_html = c_href;
        }

        addCode += '<li class="overflow"><a href="';
        if ( c_href.indexOf( '://' ) != -1 ) {
            addCode += c_href + '" target="_blank"';
        } else {
            addCode += '/wiki/' + c_href + '"';
        }
        addCode += '>' + c_html + '</a></li>';
    }

    addCode += '</ul></li>';

    $( '.mytools' ).after( addCode );
    WikiaFooterApp.init();
})();
