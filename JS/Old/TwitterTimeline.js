// ==UserScript==
// @name         Twitter Timeline
// @namespace    http://kancolle.wikia.com/wiki/Template:TwitterTimeline#Requirements
// @version      0.1
// @description  Allows custom twitter embeds on wikia
// @author       がか
// @match        http://kancolle.wikia.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

   $(".twitter-timeline-wrapper").each(function(_, wrapper) {

  var profile = $(wrapper).data("profile"),
      text = $(wrapper).data("text") || "",
      width = $(wrapper).data("width"),
      height = $(wrapper).data("height"),
      twitter_widget_link = '<a class="twitter-timeline" width="' + width + '" height="' + height + '" href="' + profile + '">' + text + '</a>';

  var widgets_js = document.createElement("script");
  widgets_js.type = "text/javascript";
  widgets_js.src = "http://platform.twitter.com/widgets.js";

  $(wrapper).append(twitter_widget_link);
  $(wrapper).append(widgets_js);

});
})();
