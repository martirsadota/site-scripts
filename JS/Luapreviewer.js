// ==UserScript==
// @name         Luapreviewer
// @namespace    http://dev.wikia.com/wiki/MediaWiki:Luapreviewer/code.js?action=edit
// @version      1
// @description  Previews (as a webpage html) module output printed using mw.log() or print()
// @author       Dessamator
// @match        http://*.wikia.com/wiki/Module:*
// @grant        none
// ==/UserScript==

//<syntaxhighlight lang="javascript">
// Lua previewer v1
// By Dessamator
// Previews (as a webpage html) module output printed using mw.log() or print()
// Todo:
// add page preview

$(window).load(function() {
    if (wgCanonicalNamespace ==="Module" && wgAction=="edit"){
        $("#mw-scribunto-output").attr("style","white-space:pre-wrap");
        if($(".mw-scribunto-input").length>0){
            $(".mw-scribunto-console-fieldset").find("input").parent().append('<input type="button" id="previewbutton" value="Preview">');
            $('<div id="previewconsole"></div>').insertBefore(".mw-scribunto-input");
        }
        $("input#previewbutton").on("click",function(){
            if ($(".mw-scribunto-print").last().length>0){
                mw.loader.using('mediawiki.api', function () {
                    (new mw.Api())
                    .post({
                        action: 'parse',
                        text: $(".mw-scribunto-print").last().text()
                    }).done(function (data) {
                        if (data.error) {
                            $('#previewconsole').html(data.error);
                            return;
                        }
                        $('#previewconsole').html('<h2>Preview:</h2><br/>'+data.parse.text["*"]+'<br/>');
                    });
                });}
            else {
                $('#previewconsole').html("");
            }
        });
    }
});
//<syntaxhighlight>

