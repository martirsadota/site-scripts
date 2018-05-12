// ==UserScript==
// @name         View Source
// @namespace    http://dev.wikia.com/wiki/MediaWiki:View_Source/code.js?action=edit
// @version      0.1
// @description  Loading the editor takes time. Why wait, if you only want to read a page's source code? This little tool adds a "View source" link to the "Edit" dropdown menu that replaces the page's content with the raw code. Pick "View article" from the same menu to return the page to normal.
// @author       Peter Coester
// @match        http://*.wikia.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
/**
 * View Source
 *
 * © Peter Coester 2013 [[User_talk:Pecoes|Pecoes]]
 *
 * documentation and examples at:
 * http://dev.wikia.com/wiki/View_Source
 */

// __NOWYSIWYG__

/*jshint jquery:true, browser:true, es5:true, devel:true, camelcase:true, curly:false, undef:true, unused:true, bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, regexp:false, strict:true, trailing:true, maxcomplexity:10 */
/*global mediaWiki:true*/

(function (module, mw, $) {

    if (module.loadSource) return;

    var config = mw.config.get([
        'wgAction',
        'wgContentLanguage',
        'wgFormattedNamespaces',
        'wgPageName',
        'wgUserLanguage'
    ]);

    var translations = {
        en: {
            viewSource: 'View Source',
            viewArticle: 'View Article'
        },
        ar: {
            viewSource: 'اعرض المصدر',
            viewArticle: 'اعرض المقالة'
        },
        be: {
            viewSource: 'Паказаць выточны код',
            viewArticle: 'Паказаць артыкул'
        },
        ja: {
            viewSource: 'ソースを表示',
            viewArticle: '記事を見る'
        },
        de: {
            viewSource: 'Quelltext-Ansicht',
            viewArticle: 'Artikel-Ansicht'
        },
        hu: {
            viewSource: 'Forráskód megtekintése',
            viewArticle: 'Szócikk megtekintése'
        },
        pl: {
            viewSource: 'Tekst źródłowy',
            viewArticle: 'Pokaż artykuł'
        },
        el: {
            viewSource: 'Εμφάνιση Κώδικα',
            viewArticle: 'Εμφάνιση Λήμματος'
        },
        es: {
            viewSource: 'Ver código fuente',
            viewArticle: 'Ver artículo'
        },
        ca: {
            viewSource: 'Veure codi font',
            viewArticle: 'Veure l\'article'
        },
        pt: {
            viewSource: 'Ver código',
            viewArticle: 'Ver artigo'
        },
        'pt-br': {
            viewSource: 'Ver código',
            viewArticle: 'Ver artigo'
        },
        ko: {
            viewSource: '소스 보기',
            viewArticle: '문서 보기'
        },
        nl: {
            viewSource: 'Toon bron',
            viewArticle: 'Toon artikel'
        },
        ru: {
            viewSource: 'Показать исходный код',
            viewArticle: 'Показать статью'
        },
        it: {
            viewSource: 'Vedi codice sorgente',
            viewArticle: 'Vedi articolo'
        },
        uk: {
            viewSource: 'Показати вихідний код',
            viewArticle: 'Показати статтю'
        },
        vi: {
            viewSource: 'Xem mã nguồn',
            viewArticle: 'Xem bài'
        }
	},

    parserFunctions = {
        '#expr': 'Help:Extension:ParserFunctions#.23expr',
        '#if': 'Help:Extension:ParserFunctions#.23if',
        '#ifeq': 'Help:Extension:ParserFunctions#.23ifeq',
        '#iferror': 'Help:Extension:ParserFunctions#.23iferror',
        '#ifexpr': 'Help:Extension:ParserFunctions#.23ifexpr',
        '#ifexist': 'Help:Extension:ParserFunctions#.23ifexist',
        '#rel2abs': 'Help:Extension:ParserFunctions#.23rel2abs',
        '#switch': 'Help:Extension:ParserFunctions#.23switch',
        '#time': 'Help:Extension:ParserFunctions#.23time',
        '#timel': 'Help:Extension:ParserFunctions#.23timel',
        '#titleparts': 'Help:Extension:ParserFunctions#.23titleparts',
        'subst': 'Help:Substitution',
        'safesubst': 'Help:Substitution',
        '#len': 'Extension:StringFunctions#.23len:',
        '#pos': 'Extension:StringFunctions#.23pos:',
        '#rpos': 'Extension:StringFunctions#.23rpos:',
        '#sub': 'Extension:StringFunctions#.23sub:',
        '#pad': 'Extension:StringFunctions#.23pad:',
        '#replace': 'Extension:StringFunctions#.23replace:',
        '#explode': 'Extension:StringFunctions#.23explode:',
        '#urlencode': 'Extension:StringFunctions#.23urlencode:_and_.23urldecode:',
        '#urldecode': 'Extension:StringFunctions#.23urlencode:_and_.23urldecode:',
        '#invoke': 'Extension:Scribunto#Usage',
        '#lst': 'Extension:Labeled_Section_Transclusion#How_it_works',
        '#lsth': 'Extension:Labeled_Section_Transclusion#How_it_works',
        '#lstx': 'Extension:Labeled_Section_Transclusion#How_it_works',
        '#var': 'Extension:Variables#.23var',
        '#var_final': 'Extension:Variables#.23var_final',
        '#vardefine': 'Extension:Variables#.23vardefine',
        '#vardefineecho': 'Extension:Variables#.23vardefineecho',
        '#varexists': 'Extension:Variables#.varexists',

        //  ->https://www.mediawiki.org/wiki/Help:Magic_words
        '#dateformat': 'Help:Magic_words#Formatting',
        '#formatdate': 'Help:Magic_words#Formatting',
        'lc': 'Help:Magic_words#Formatting',
        'lcfirst': 'Help:Magic_words#Formatting',
        'uc': 'Help:Magic_words#Formatting',
        'ucfirst': 'Help:Magic_words#Formatting',
        '#language': 'Help:Magic_words#Miscellaneous',
        '#special': 'Help:Magic_words#Miscellaneous',
        '#tag': 'Help:Magic_words#Miscellaneous',
        'ns': 'Help:Magic_words#Namespaces',
        'PAGESINCAT': 'Help:Magic_words#Statistics',
        'PAGESINCATEGORY': 'Help:Magic_words#Statistics',
        'DEFAULTSORT': 'Help:Magic_words#Technical_metadata',
        'DISPLAYTITLE': 'Help:Magic_words#Technical_metadata',
        'int': 'Help:Magic_words#Transclusion_modifiers'
    },

    parserTags = {
        'activityfeed': 'http://community.wikia.com/wiki/Help:Wiki_Activity',
        'aoaudio': 'http://community.wikia.com/wiki/Help:Video',
        'aovideo': 'http://community.wikia.com/wiki/Help:Video',
        'bloglist': 'http://community.wikia.com/wiki/Help:Blog_article/Bloglist',
        'categorytree': 'https://www.mediawiki.org/wiki/Categorytree',
        'charinsert': 'https://www.mediawiki.org/wiki/Extension:CharInsert',
        'chat': 'http://community.wikia.com/wiki/Help:Chat',
        'choose': 'https://www.mediawiki.org/wiki/Extension:RandomSelection',
        'createbox': 'https://www.mediawiki.org/wiki/Extension:CreateBox',
        'dpl': 'http://community.wikia.com/wiki/Help:DynamicPageList',
        'fb:facepile': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'fb:follow': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'fb:like': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'fb:likebox': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'fb:recommendations': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'fb:share-button': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_Facebook_widgets',
        'forum': 'http://community.wikia.com/wiki/Help:Wiki-style_forums',
        'gallery': 'http://www.mediawiki.org/wiki/Gallery#Rendering_a_gallery_of_images',
        'ggtube': 'http://community.wikia.com/wiki/Help:Video',
        'googlespreadsheet': 'https://www.mediawiki.org/wiki/Extension:GoogleDocs4MW',
        'gtrailer': 'http://community.wikia.com/wiki/Help:Video',
        'gvideo': 'http://community.wikia.com/wiki/Help:Video',
        'helper': 'http://community.wikia.com/wiki/Help:Volunteers_and_Helpers#Helpers',
        'hiero': 'https://www.mediawiki.org/wiki/Hiero',
        'imagemap': 'https://www.mediawiki.org/wiki/Imagemap',
        'includeonly': 'https://www.mediawiki.org/wiki/Templates',
        'infobox': 'http://community.wikia.com/wiki/Help:Infoboxes',
        'inputbox': 'https://www.mediawiki.org/wiki/Inputbox',
        'mainpage-endcolumn': 'http://community.wikia.com/wiki/Help:Main_page_column_tags',
        'mainpage-leftcolumn-start': 'http://community.wikia.com/wiki/Help:Main_page_column_tags',
        'mainpage-rightcolumn-start': 'http://community.wikia.com/wiki/Help:Main_page_column_tags',
        'math': 'https://www.mediawiki.org/wiki/Math',
        'nicovideo': 'http://community.wikia.com/wiki/Help:Video',
        'noinclude': 'https://www.mediawiki.org/wiki/Templates',
        'nowiki': 'https://meta.wikimedia.org/wiki/Help:Wikitext_examples#Just_show_what_I_typed',
        'onlyinclude': 'https://www.mediawiki.org/wiki/Templates',
        'poem': 'https://www.mediawiki.org/wiki/Extension:Poem',
        'poll': 'https://www.mediawiki.org/wiki/Extension:AJAXPoll',
        'pre': 'https://meta.wikimedia.org/wiki/Help:Wikitext_examples#Just_show_what_I_typed',
        'randomimage': 'https://www.mediawiki.org/wiki/Extension:RandomImage',
        'ref': 'https://www.mediawiki.org/wiki/Ref',
        'references': 'https://www.mediawiki.org/wiki/Ref',
        'rss': 'http://community.wikia.com/wiki/Help:Feeds',
        'section': 'https://www.mediawiki.org/wiki/Extension:Labeled_Section_Transclusion',
        'source': 'https://www.mediawiki.org/wiki/Extension:SyntaxHighlight_GeSHi',
        'syntaxhighlight': 'https://www.mediawiki.org/wiki/Extension:SyntaxHighlight_GeSHi',
        'staff': 'http://community.wikia.com/wiki/Community_Central:Staff',
        'tabber': 'http://community.wikia.com/wiki/Help:Tabber',
        'tabview': 'http://community.wikia.com/wiki/Help:Tab_view',
        'tangler': 'http://community.wikia.com/wiki/Help:Video',
        'timeline': 'https://www.mediawiki.org/wiki/Extension:Timeline',
        'twitter': 'http://community.wikia.com/wiki/Help:Social_media_integration#Adding_a_Twitter_timeline',
        'verbatim': 'http://community.wikia.com/wiki/Help:Verbatim_tags',
        'videogallery': 'http://community.wikia.com/wiki/Help:Video',
        'wegame': 'http://community.wikia.com/wiki/Help:Video',
        'youtube': 'http://community.wikia.com/wiki/Help:Video'
    },

    i18n = translations[
        config.wgUserLanguage
    ] || translations[
        config.wgContentLanguage
    ] || translations.en,

    $content, $list, $source, $a, $toc, headers = [];


    function addButton () {
        $a = $('<li>' +
            '<a id="view-source">' +
                i18n.viewSource +
            '</a>' +
        '</li>')
        .appendTo($list)
        .find('a')
        .data('source', false)
        .click(function () {
            $a.closest('.wikia-menu-button')
            .removeClass('active');
            module[$a.data('source') ? 'hideSource' : 'loadSource']();
        });
    }

    function addCSS () {
        $(document.head || 'head')
        .append('<style type="text/css">' +
        '#source-toc {' +
            'padding: 10px 0;' +
            'border-top: 1px solid #ccc;' +
            'border-bottom: 1px solid #ccc;' +
            'font-size: 14px;' +
        '}' +
        '#source-toc li {' +
            'white-space: nowrap;' +
            'overflow: hidden;' +
            'text-overflow: ellipsis;' +
        '}' +
        '#source-code {' +
            'white-space: pre-wrap;' +
        '}' +
        '#source-code a {' +
            'text-decoration: underline;' +
            'color: inherit;' +
        '}' +
        '</style>');
    }

    function joinHrefParts (parts) {
        for (var i = 0; i < parts.length; i++) {
            parts[i] = encodeURIComponent(parts[i]);
        }
        return parts.join(':').replace(/ /g, '_');
    }

    function createHref (link) {

        var parts, hash = '';

        if (link.indexOf('#') !== -1) {
            parts = link.split(/\#/);
            link = parts.shift();
            if (!link.length) link = config.wgPageName;
            hash = '#' + parts.pop();
        }

        if (link[0] === '/') link = config.wgPageName + link;

        var interwikiMap = {
            w:'http://community.wikia.com/wiki/$1',
            community:'http://community.wikia.com/wiki/$1',
            bugzilla:'https://bugzilla.wikimedia.org/show_bug.cgi?id=$1',
            commons:'https://commons.wikimedia.org/wiki/$1',
            creativecommons:'https://creativecommons.org/licenses/$1',
            creativecommonswiki:'http://wiki.creativecommons.org/$1',
            dictionary:'http://www.dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1',
            dict:'http://www.dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1',
            docbook:'http://wiki.docbook.org/topic/$1',
            download:'https://download.wikimedia.org/$1',
            dbdump:'https://download.wikimedia.org/$1/latest/',
            dreamhost:'http://wiki.dreamhost.com/index.php/$1',
            finalfantasy:'http://finalfantasy.wikia.com/wiki/$1',
            flickruser:'https://www.flickr.com/people/$1',
            flickrphoto:'https://www.flickr.com/photo.gne?id=$1',
            foundation:'https://wikimediafoundation.org/wiki/$1',
            gerrit:'https://gerrit.wikimedia.org/r/$1',
            it:'https://gerrit.wikimedia.org/r/gitweb?p=mediawiki/$1;a=log;h=refs/heads/master',
            google:'https://www.google.com/search?q=$1',
            googledefine:'https://www.google.com/search?q=define:$1',
            googlegroups:'https://groups.google.com/groups?q=$1',
            guildwiki:'http://guildwars.wikia.com/wiki/$1',
            gutenberg:'https://www.gutenberg.org/etext/$1',
            gutenbergwiki:'https://www.gutenberg.org/wiki/$1',
            h2wiki:'http://halowiki.net/p/$1',
            imdbname:'http://www.imdb.com/name/nm$1/',
            imdbtitle:'http://www.imdb.com/title/tt$1/',
            imdbcompany:'http://www.imdb.com/company/co$1/',
            imdbcharacter:'http://www.imdb.com/character/ch$1/',
            incubator:'https://incubator.wikimedia.org/wiki/$1',
            infosecpedia:'http://infosecpedia.org/wiki/$1',
            irc:'irc://irc.freenode.net/$1',
            ircrc:'irc://irc.wikimedia.org/$1',
            rcirc:'irc://irc.wikimedia.org/$1',
            'iso639-3':'http://www.sil.org/iso639-3/documentation.asp?id=$1',
            issn:'https://www.worldcat.org/issn/$1',
            javanet:'http://wiki.java.net/bin/view/Main/$1',
            javapedia:'http://wiki.java.net/bin/view/Javapedia/$1',
            lostpedia:'http://lostpedia.wikia.com/wiki/$1',
            mail:'https://lists.wikimedia.org/mailman/listinfo/$1',
            mailarchive:'https://lists.wikimedia.org/pipermail/$1',
            mariowiki:'https://www.mariowiki.com/$1',
            marveldatabase:'http://www.marveldatabase.com/wiki/index.php/$1',
            mediawikiwiki:'https://www.mediawiki.org/wiki/$1',
            mediazilla:'https://bugzilla.wikimedia.org/$1',
            memoryalpha:'http://memory-alpha.org/wiki/$1',
            metawiki:'http://sunir.org/apps/meta.pl?$1',
            metawikipedia:'https://meta.wikimedia.org/wiki/$1',
            mozcom:'http://mozilla.wikia.com/wiki/$1',
            mozillawiki:'https://wiki.mozilla.org/$1',
            mozillazinekb:'http://kb.mozillazine.org/$1',
            musicbrainz:'https://musicbrainz.org/doc/$1',
            mw:'https://www.mediawiki.org/wiki/$1',
            mwod:'https://www.merriam-webster.com/cgi-bin/dictionary?book=Dictionary&va=$1',
            mwot:'https://www.merriam-webster.com/cgi-bin/thesaurus?book=Thesaurus&va=$1',
            nost:'https://nostalgia.wikipedia.org/wiki/$1',
            nostalgia:'https://nostalgia.wikipedia.org/wiki/$1',
            openfacts:'http://openfacts.berlios.de/index-en.phtml?title=$1',
            openlibrary:'https://openlibrary.org/$1',
            openstreetmap:'https://wiki.openstreetmap.org/wiki/$1',
            openwetware:'https://openwetware.org/wiki/$1',
            openwiki:'http://openwiki.com/?$1',
            osmwiki:'https://wiki.openstreetmap.org/wiki/$1',
            otrs:'https://ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketID=$1',
            otrswiki:'https://otrs-wiki.wikimedia.org/wiki/$1',
            perlnet:'http://perl.net.au/wiki/$1',
            phpwiki:'http://phpwiki.sourceforge.net/phpwiki/index.php?$1',
            pyrev:'https://www.mediawiki.org/wiki/Special:Code/pywikipedia/$1',
            pythoninfo:'http://www.python.org/cgi-bin/moinmoin/$1',
            pythonwiki:'http://www.pythonwiki.de/$1',
            pywiki:'http://c2.com/cgi/wiki?$1',
            rev:'https://www.mediawiki.org/wiki/Special:Code/MediaWiki/$1',
            revo:'http://purl.org/NET/voko/revo/art/$1.html',
            rfc:'https://tools.ietf.org/html/rfc$1',
            robowiki:'http://robowiki.net/?$1',
            reuterswiki:'http://glossary.reuters.com/index.php/$1',
            slashdot:'http://slashdot.org/article.pl?sid=$1',
            sourceforge:'https://sourceforge.net/$1',
            species:'https://species.wikimedia.org/wiki/$1',
            strategy:'https://strategy.wikimedia.org/wiki/$1',
            strategywiki:'https://strategywiki.org/wiki/$1',
            sulutil:'http://toolserver.org/~quentinv57/sulinfo/$1',
            svn:'http://svn.wikimedia.org/viewvc/mediawiki/$1?view=log',
            svgwiki:'http://wiki.svg.org/index.php/$1',
            technorati:'http://www.technorati.com/search/$1',
            tenwiki:'https://ten.wikipedia.org/wiki/$1',
            testwiki:'https://test.wikipedia.org/wiki/$1',
            ticket:'https://ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketNumber=$1',
            tools:'https://toolserver.org/$1',
            tswiki:'https://wiki.toolserver.org/view/$1',
            translatewiki:'https://translatewiki.net/wiki/$1',
            tvtropes:'https://www.tvtropes.org/pmwiki/pmwiki.php/Main/$1',
            unreal:'http://wiki.beyondunreal.com/wiki/$1',
            urbandict:'https://www.urbandictionary.com/define.php?term=$1',
            usemod:'http://www.usemod.com/cgi-bin/wiki.pl?$1',
            usability:'https://usability.wikimedia.org/wiki/$1',
            webisodes:'http://www.webisodes.org/$1',
            wg:'https://wg.en.wikipedia.org/wiki/$1',
            wiki:'http://c2.com/cgi/wiki?$1',
            wikia:'http://www.wikia.com/wiki/c:$1',
            wikiasite:'http://www.wikia.com/wiki/c:$1',
            wikibooks:'https://en.wikibooks.org/wiki/$1',
            wikichat:'http://www.wikichat.org/$1',
            wikicities:'http://www.wikia.com/wiki/$1',
            wikicity:'http://www.wikia.com/wiki/c:$1',
            wikihow:'http://www.wikihow.com/$1',
            wikiindex:'http://wikiindex.org/$1',
            wikimedia:'https://wikimediafoundation.org/wiki/$1',
            wikinews:'https://en.wikinews.org/wiki/$1',
            wikipedia:'https://en.wikipedia.org/wiki/$1',
            wikipediawikipedia:'https://en.wikipedia.org/wiki/Wikipedia:$1',
            wikiquote:'https://en.wikiquote.org/wiki/$1',
            wikischool:'https://www.wikischool.de/wiki/$1',
            wikisource:'https://en.wikisource.org/wiki/$1',
            wikispecies:'https://species.wikimedia.org/wiki/$1',
            wikispot:'http://wikispot.org/?action=gotowikipage&v=$1',
            wikitech:'https://wikitech.wikimedia.org/view/$1',
            wikiversity:'https://en.wikiversity.org/wiki/$1',
            betawikiversity:'https://beta.wikiversity.org/wiki/$1',
            wiktionary:'https://en.wiktionary.org/wiki/$1',
            wmar:'https://www.wikimedia.org.ar/wiki/$1',
            wmau:'https://wikimedia.org.au/wiki/$1',
            wmbd:'https://bd.wikimedia.org/wiki/$1',
            wmbe:'https://be.wikimedia.org/wiki/$1',
            wmbr:'https://br.wikimedia.org/wiki/$1',
            wmca:'https://wikimedia.ca/wiki/$1',
            wmch:'https://www.wikimedia.ch/$1',
            wmcz:'https://meta.wikimedia.org/wiki/Wikimedia_Czech_Republic/$1',
            wmdc:'https://wikimediadc.org/wiki/$1',
            securewikidc:'https://secure.wikidc.org/$1',
            wmde:'https://wikimedia.de/wiki/$1',
            wmfi:'https://fi.wikimedia.org/wiki/$1',
            wmfr:'https://wikimedia.fr/$1',
            wmhk:'https://wikimedia.hk/index.php/$1',
            wmhu:'http://wiki.media.hu/wiki/$1',
            wmid:'https://www.wikimedia.or.id/wiki/$1',
            wmil:'https://www.wikimedia.org.il/$1',
            wmin:'https://wiki.wikimedia.in/$1',
            wmit:'https://wiki.wikimedia.it/wiki/$1',
            wmmx:'https://mx.wikimedia.org/wiki/$1',
            wmnl:'https://nl.wikimedia.org/wiki/$1',
            wmnyc:'https://nyc.wikimedia.org/wiki/$1',
            wmno:'https://no.wikimedia.org/wiki/$1',
            wmpl:'https://pl.wikimedia.org/wiki/$1',
            wmrs:'https://rs.wikimedia.org/wiki/$1',
            wmru:'https://ru.wikimedia.org/wiki/$1',
            wmse:'https://se.wikimedia.org/wiki/$1',
            wmtw:'https://wikimedia.tw/wiki/index.php5/$1',
            wmua:'https://ua.wikimedia.org/wiki/$1',
            wmuk:'https://uk.wikimedia.org/wiki/$1',
            wmf:'https://wikimediafoundation.org/wiki/$1',
            wmfblog:'https://blog.wikimedia.org/$1',
            wookieepedia:'http://starwars.wikia.com/wiki/$1',
            wowwiki:'http://www.wowwiki.com/$1'
        };

        parts = link.split(/\:/);

        if ( parts.length > 2 && parts[0] === 'w' && parts[1] === 'c') {
            parts = parts.slice(2);
            return 'http://' + parts.shift() + '.wikia.com/wiki/' + joinHrefParts(parts) + hash;
        } else if (parts.length > 1 && interwikiMap[parts[0].toLowerCase()]) {
            return interwikiMap[parts.shift().toLowerCase()].replace(/\$1/, joinHrefParts(parts) + hash);
        }
        return '/wiki/' + joinHrefParts(parts) + hash;
    }

    function replaceTag (all, delim, tag) {
        if (!parserTags[tag])
            if (/\//g.test(all)) return '&lt;/' + tag;
            else return '&lt;' + tag;
        return delim + '<a href="' + parserTags[tag] + '">' + tag + '</a>';
    }

    function replaceHeaders (m) {
        headers.push(m);
        return '<a name="h' + (headers.length-1) + '"></a>' + m;
    }

    function replaceWikiLink (all, link, title) {
        title = title || '';
        return '[[<a href="' + createHref(link) + '">' + link + '</a>'+ title + ']]';
    }

    function replaceTemplates (all, delim, name) {
        var href, m = name.match(/^(\#?)(\w+)(\:.*)/),
            fn = m && parserFunctions[m[1] + m[2]];
        if (fn) {
            return delim + m[1] + '<a href="https://www.mediawiki.org/wiki/' + fn + '">' + m[2] + '</a>' + m[3];
        }
        m = name.match(/^(\s*)(.+)(\s*)$/);
        if (m[2][0] === ':') {
            href = m[2].substring(1);
        } else if(m[2].startsWith('w:')) {
            href = 'w:' + (m[2][2] === ':' ?
                m[2].substring(3) :
                'Template:' + m[2].substring(2));
            console.log(href);
        } else {
            href = m[2];
            var templ = config.wgFormattedNamespaces[10] + ':';
            if(!href.startsWith('Template:') && !href.startsWith(templ)) {
                href = templ + href;
            }
        }
        return delim + m[1] + '<a href="' + createHref(href) + '">' + m[2] + '</a>' + m[3];
    }

    function replaceRegularLinks (all, link, title) {
        title = title || '';
        return '[<a href="' + link + '">' + link + '</a>'+ title + ']';
    }

    function createPseudoToc () {
        if (headers.length && $source.height() > $(window).height()) {
            var toc = '<ul>';
            for (var i = 0; i < headers.length; i++) {
                toc += '<li><a href="#h' + i + '">' + headers[i] + '</a></li>';
            }
            toc += '</ul>';
            $toc = $('<section id="source-toc" class="rail-module">' + toc + '</section>')
            .insertBefore($('#WikiaRail').find('.module').first());
        }
    }

    module.loadSource = function () {
        $a.text(i18n.viewArticle)
        .data('source', true);
        if ($source) {
            $source.css('display', 'block');
            $content.css('display', 'none');
            if ($toc) $toc.css('display', 'block');
        } else {
            $.get('/wiki/' + config.wgPageName + '?action=raw&maxage=0&smaxage=0')
            .done(function (wikitext) {
                $source = $('<pre id="source-code">' +
                    wikitext
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;' )
                    .replace(/>/g, '&gt;' )
                    .replace(/(&lt;\/?)([\w\:\-]+)/g, replaceTag)
                    .replace(/^((=+)[^\[\]\{\}]+?\2)/gm, replaceHeaders)
                    .replace(/\[{2}([^\[\]\{\}\|]+)(\|[^\]]+)?\]{2}/g, replaceWikiLink)
                    .replace(/\[(https?:\/\/[^ \]]+)([^\]]*)\]/g, replaceRegularLinks)
                    .replace(/((?:^|[^\{])\{\{)([^\{\|\}]+)/g, replaceTemplates)
                    .replace(/\r\n|\r|\n/g, '<br />') +
                '</pre>')
                .insertBefore($content.css('display', 'none'));

                createPseudoToc();
            });
        }
    };

    module.hideSource = function () {
        if (!$source) return;
        $a.text(i18n.viewSource)
        .data('source', false);
        $source.css('display', 'none');
        $content.css('display', 'block');
        if ($toc) $toc.css('display', 'none');
    };

    if (config.wgAction === 'view') {
        $(function () {
            $content = $('#mw-content-text');
            $list = $('.UserProfileActionButton .WikiaMenuElement');
            if(!$list.exists()) {
                $list = $('.page-header__contribution-buttons .wds-list');
            }
            if ($content.length && $list.length) {
                addButton();
                addCSS();
                if ($.getUrlVar('view') === 'source') {
                    module.loadSource();
                }
            }
        });
    }

}((window.dev = window.dev || {}).viewSource = window.dev.viewSource || {}, mediaWiki, jQuery));

})();
