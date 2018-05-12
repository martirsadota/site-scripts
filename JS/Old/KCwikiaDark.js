// ==UserScript==
// @name         Kancolle wikia dark theme
// @namespace    http://kancolle.wikia.com
// @version      0.1
// @description  Replace certain light themed colours on the wiki with dark ones
// @author       Drakes (https://stackoverflow.com/users/1938889/drakes)
// @source       https://stackoverflow.com/a/30724171
// @match        http://kancolle.wikia.com/*
// @grant        none
// ==/UserScript==

function colorReplace(findHexColor, replaceWith) {
  'use strict';
  // Convert rgb color strings to hex
  function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  // Select and run a map function on every tag
  $('*').map(function(i, el) {
    // Get the computed styles of each tag
    var styles = window.getComputedStyle(el);

    // Go through each computed style and search for "color"
    Object.keys(styles).reduce(function(acc, k) {
      var name = styles[k];
      var value = styles.getPropertyValue(name);
      if (value !== null && name.indexOf("color") >= 0) {
        // Convert the rgb color to hex and compare with the target color
        if (value.indexOf("rgb(") >= 0 && rgb2hex(value) === findHexColor) {
          // Replace the color on this found color attribute
          $(el).css(name, replaceWith);
        }
      }
    });
  });
}

// Call like this for each color attribute you want to replace
//colorReplace("#789034", "#456780");
colorReplace("#aaedaa","#000000");
