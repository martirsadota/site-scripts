// ==UserScript==
// @name         New PreProcessor parser report.js
// @namespace    https://www.mediawiki.org/wiki/NewPP_parser_report
// @version      0.1
// @description  Makes New PreProcessor(PP) parser report appear on every content page at the bottom
// @author       קיפודנחש (https://he.wikipedia.org/wiki/%D7%9E%D7%A9%D7%AA%D7%9E%D7%A9:%D7%A7%D7%99%D7%A4%D7%95%D7%93%D7%A0%D7%97%D7%A9)
// @match        https://*.wikia.com/wiki/*
// @grant        none
// ==/UserScript==

$('#mw-content-text').contents().filter(function() {
  return this.nodeType == 8 && /Saved|NewPP/.test(this.data);
}).replaceWith(function() {
  return $('<pre>', { dir: 'ltr' } ).text(this.data);
});
