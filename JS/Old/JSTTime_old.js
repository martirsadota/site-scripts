// ==UserScript==
// @name         wikia.js
// @namespace    https://gist.github.com/gakada/9d0b65ab464251b50d90d14faa3846d7
// @version      0.2a
// @description  Rail hiding, Wide pages, JST time/purge button, Wikitext/HTML rendering for Lua debug console
// @author       がか and Crazy teitoku
// @match        http://*.wikia.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var bindToLocalStorage = function bindToLocalStorage(element, propertyName, variableName, onChange, onInit) {
  element.change(function () {
    var value = element.prop(propertyName);
    localStorage.setItem(variableName, JSON.stringify(value));
    if (onChange) {
      onChange(value);
    }
  });
  element.prop(propertyName, JSON.parse(localStorage.getItem(variableName)));
  if (onInit) {
    onInit(element.prop(propertyName));
  }
};

var renderWikitext = function renderWikitext(text, next) {
  $.get('http://kancolle.wikia.com/api.php?action=parse&format=json&text=' + escape(text), function (data) {
    return next(data && data.parse && data.parse.text && data.parse.text['*']);
  });
};

var addHeaderCheckbox = function addHeaderCheckbox(name, text, right, handle) {
  $('.wds-community-header').append($('<input>').prop({
    'type': 'checkbox',
    'id': name + 'Checkbox'
  }).css({
    'position': 'absolute',
    'right': right + 'px',
    'top': '85px',
    'z-index': '9001',
    'cursor': 'pointer'
  }), $('<label>').prop({
    'for': name + 'Checkbox',
    'id': name + 'CheckboxLabel'
  }).text(text).css({
    'position': 'absolute',
    'right': right + 20 + 'px',
    'top': '87px',
    'z-index': '9001',
    'cursor': 'pointer'
  }));
  bindToLocalStorage($('#' + name + 'Checkbox'), 'checked', name + 'Checked', handle, handle);
};

var padLeft = function padLeft(s) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

  s = s.toString();
  c = c.toString();
  return s.length < n ? c[0].repeat(n - s.length) + s : s;
};

var formatJstClock = function formatJstClock() {
  var now = new Date();
  var d = new Date(now.getTime() + 60000 * now.getTimezoneOffset() + 3600000 * 9);
  //var h = padLeft(d.getHours(), 2, 0);
  var h = padLeft(d.getHours(), 2, 0);
  var m = padLeft(d.getMinutes(), 2, 0);
  var s = padLeft(d.getSeconds(), 2, 0);
  // https://www.aspsnippets.com/Articles/JavaScript-Display-Current-Time-in-12-hour-format-AM-PM-and-24-hour-format-with-Hours-Minutes-and-Seconds-hhmmss.aspx
  var am_pm = d.getHours() >= 12 ? '午後' : '午前';
  // var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var dayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
  var dateNames = ['一日', '二日', '三日', '四日', '五日', '六日', '七日', '八日', '九日', '十日', '十一日', '十二日', '十三日', '十四日', '十五日', '十六日', '十七日', '十八日', '十九日', '二十日', '二十一日', '二十二日', '二十三日', '二十四日', '二十五日', '二十六日', '二十七日', '二十八日', '二十九日', '三十日', '三十一日'];
  // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q133033218
  //var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthNames = ['睦月', '如月', '弥生', '卯月', '皐月', '水無月', '文月', '葉月', '長月', '神無月', '霜月', '師走'];
  //var formatted = h + ':' + m + ':' + s + ' ' + dayNames[(d.getDay() + 6) % 7] + ' ' + d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear() + ' (JST)';
  // https://www.w3schools.com/jsref/jsref_obj_date.asp
  //var options = { year: 'numeric', month: 'long', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
  var options = { year: 'numeric' };
  var j_year = d.toLocaleDateString('ja-JP-u-ca-japanese', options);
  //var formatted = d.getFullYear() + ' ' + monthNames[d.getMonth()] + ' ' + dayNames[(d.getDay() + 6) % 7] + ' ' + dateNames[d.getDate() - 1] + ' ' + ' ' + h + ':' + m + ':' + s + ' ' + ' (JST)';
  var monthday = monthNames[d.getMonth()] + dateNames[d.getDate() - 1] ;
  var j_dayname = dayNames[(d.getDay() + 6) % 7];
  var time = h + ':' + m + ':' + s + ' ' + ' (JST)';
  var reloadIcon = '&#x21bb;&#160;'; // ↻ + nbsp
  return reloadIcon + j_year + monthday + ' ' + j_dayname + ' ' + '(' + am_pm + ')' + ' ' + ' ' + time;
};

$(function () {
  // Rail hiding.
  addHeaderCheckbox('WikiaRail', 'Hide sidebar', 16, function (checked) {
    if (checked) {
      $('.WikiaRail').hide();
    } else {
      $('.WikiaRail').show();
    }
    $('.WikiaMainContent').css({ width: checked ? '100%' : '' });
  });

  // Wide pages.
  addHeaderCheckbox('WikiaPageWide', 'Wide page', 110, function (checked) {
    $('.WikiaPage').css({ width: checked ? '90%' : '' });
    $('.wds-community-header').css({ width: checked ? '100%' : '' });
  });

  // Fixing notifications.
  $('.wds-community-header').append($('.banner-notifications-placeholder'));

  // JST time/purge button.
  var clock = $('<a>').prop({
    'href': '?action=purge',
    'title': 'Click here to make the server purge and regenerate (update) this page'
  }).css({
    'position': 'absolute',
    'font-family': "Monaco, Consolas, 'Lucida Console', monospace",
    'color': 'black',
    'top': '63px',
    'right': '20px',
    'z-index': '9001'
  });
  $('.wds-community-header__local-navigation').append(clock);
  clock.html(formatJstClock());
  setInterval(function () {
    return clock.html(formatJstClock());
  }, 500);

  // Wikitext/HTML rendering for Lua debug console.
  setInterval(function () {
    $('.mw-scribunto-print').each(function (_, e) {
      if (!$(e).data('html')) {
        renderWikitext($(e).text(), function (html) {
          $(e).html(html || '<div style="color:red">can not render</div>' + $(e).text());
          $(e).data('html', true);
          $(e).css('white-space', 'normal');
        });
      }
    });
  }, 500);
});
})();
