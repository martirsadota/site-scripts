// ==UserScript==
// @name         SidebarBox 021.js
// @namespace    http://kancolle.wikia.com/wiki/MediaWiki:SidebarBox_021.js
// @version      0.1
// @description  Adds twitter to sidebar on wikia.
// @author       Dragonjet (http://kancolle.wikia.com/wiki/User:Dragonjet)
// @match        http://kancolle.wikia.com/wiki/*
// @grant        none
// ==/UserScript==

(function($){
    "use strict";
    console.log("Sidebar Boxes v021");
 
    $(window).load(function(){
        if($("div.move").length > 0){
            $("div.move").appendTo("#WikiaRail");
            $("div.move").show();
        }
 
        if($("div.kcTwitterSidebar").length > 0){
            $("<a>")
                .addClass("twitter-timeline")
                .attr("profile", "KanColle_STAFF")
                .attr("href", "https://twitter.com/KanColle_STAFF")
                .text("Tweets by @KanColle_STAFF")
                .appendTo(".kcTwitterSidebar");
 
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
        }
    });
 
}(jQuery));
