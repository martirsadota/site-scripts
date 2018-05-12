// ==UserScript==
// @name         Userbloglink.js
// @namespace    http://kancolle.wikia.com
// @version      0.1
// @description  Add User blog link to wikia drop down list
// @author       You
// @match        http://*.wikia.com/wiki/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var url = new mw.Uri();
    url.query.action = 'blog:';
    $('a.wds-global-navigation__dropdown-link').append('<li><a href="http://kancolle.wikia.com/wiki/User_' + url.toString() + '">User blog</a></li>');

})();
