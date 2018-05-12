// ==UserScript==
// @name         SearchSuggest
// @namespace    http://dev.wikia.com/wiki/SearchSuggest
// @version      0.1
// @description  FANDOM's fulltext search does not pay attention to page titles. So while it is easy to
//               find pages where your search term was mentioned multiple times, it is sometimes
//               impossible to find pages that are about your search term. The SearchSuggest script
//               adds the list of best-matching pagenames to the results page.
// @author       Pecoes
// @match        http://*.wikia.com/wiki/*
// @grant        none
// ==/UserScript==

/*jshint jquery:true, browser:true, devel:true, camelcase:true, curly:false, undef:true,
 bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true,
 unused:true, regexp:true, strict:true, trailing:true, maxcomplexity:10 */

(function (module, $, window) {

    'use strict';

    var translations = {
        en: {
            question: 'Not what you were looking for? Try: '
        },
        be: {
            question: 'Няма таго, што вы шукалі? Праглядзіце гэта: '
        },
        ca: {
            question: 'No trobes el que estàs buscant? Intenta-ho amb: '
        },
        de: {
            question: 'Nicht wonach Du gesucht hast? Versuche: '
        },
        es: {
            question: '¿No encuentras lo que estás buscando? Prueba con: '
        },
        fr: {
            question: 'Ce n\'est pas ce que vous cherchiez? Essayez: '
        },
        gl: {
            question: 'Non atopaches o que estás a buscar? Téntao con: '
        },
        hi: {
            question: 'यह वह नहीं जो आप देख रहे थे? प्रयत्न: '
        },
        hu: {
            question: 'Nem ezt kerested? Nézd meg ezek valamelyikét: '
        },
        it: {
            question: 'Non è quello che cercavi? Prova: '
        },
        ja: {
            question: 'お探しの情報が見つかりませんでしたか？ こちらも検索してみてください： '
        },
        kn: {
            question: 'ನೀವು ಹುಡುಕುತ್ತಿರುವುದು? ಪ್ರಯತ್ನಿಸಿ: '
        },
        ko: {
            question: '당신이 찾고자 하는 것이 없나요? 다음과 같이 검색해 보세요: '
        },
        mo: {
            question: 'Ну гэсешть чея че кауць? Ынчяркэ ку: '
        },
        nl: {
            question: 'Geen resultaten? Zoek in plaats daarvan naar: '
        },
        oc: {
            question: 'Tròbas pas çò que cercas? Ensaja amb: '
        },
        pl: {
            question: 'Nie tego szukasz? Zobacz: '
        },
        pt: {
            question: 'Não encontraste o que estás a procurar? Tenta com: '
        },
        'pt-br': {
            question: 'Você não encontrou o que está procurando? Tente com: '
        },
        ro: {
            question: 'Nu găseşti ceea ce cauţi? Încearcă cu: '
        },
        ru: {
            question: 'Нет того, что вы искали? Просмотрите это: '
        },
        uk: {
            question: 'Не знайшли, що шукали? Спробуйте: '
        },
        val: {
            question: '¿No trobes lo que estàs buscant? Intenta-ho en: '
        },
        zh: {
            question: '这不是您要的搜索结果? 可尝试搜索:'
        },
        'zh-hans': {
            question: '这不是您要的搜寻结果? 可尝试搜寻:'
        },
        'zh-hant': {
            question: '這不是您要的搜尋結果? 可嘗試搜尋:'
        },
        'zh-tw': {
            question: '這不是您要的搜尋結果? 可嘗試搜尋:'
        }
    };

    var MAX_RESULTS = module.maxResults || 10;

    if (!module.loaded && window.wgTransactionContext.type == "special_page/Search") {
        module.loaded = true;

        var searchBox = $('.SearchInput'),
            input = $('#search-v2-input'),
            i18n = translations[
                module.lang || mw.config.get('wgContentLanguage')
            ] || translations.en;

        $.getJSON('/api.php?action=opensearch&search=' + encodeURIComponent(input.val()))
        .done(function (data) {
            if ($.isArray(data[1]) && data[1].length) {
                var terms = data[1].slice(0, MAX_RESULTS), sanitize = mw.html.escape;
                for (var i = 0; i < terms.length; i++) {
                    terms[i] = '<a href="/wiki/' +
                         encodeURIComponent(terms[i]) + '">' +
                         sanitize( terms[i] ) +
                         '</a>';
                }
                searchBox.append(
                '<p id="suggestions" style="font-size: 80%; font-weight: normal; margin: 5px 40px 0 170px;">' +
                    i18n.question + terms.join(', ') +
                '</p>');
            }
        });
    }

}((window.dev = window.dev || {}).searchSuggest = window.dev.searchSuggest || {}, jQuery, window));
