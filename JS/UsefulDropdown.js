// ==UserScript==
// @name         UsefulDropdown
// @namespace    http://dev.wikia.com/wiki/UsefulDropdown
// @version      0.1
// @description  UsefulDropdown appends a dropdown to the title space (near edit buttons), which contains useful features, such as adding templates without editing, protecting articles etc.
// @author       Original Authority
// @match        http://*.wikia.com/wiki/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// <nowiki>
 $(function() {
    if ((mw.config.get('skin') !== 'oasis' && wgNamespaceNumber !== 0) || (window.UsefulDropdown)) {
        return;
    }

    var i18n = {
        en: { // English
            buttonTitle: 'Useful',
            protect: 'Protect',
            ajaxContent: 'AJAX Refresh',
            quickDelete: 'Quick Delete',
            stubTemplate: '+Stub',
            deleteTemplate: '+Delete',
            addCustomTemplate: '+Custom Template',
            contentRefreshed: 'Content Refreshed!'
          },
        fr: { // French
            buttonTitle: 'Utile',
            protect: 'Protéger',
            ajaxContent: 'Contenu Ajax',
            quickDelete: 'Suppression rapide',
            stubTemplate: 'Modèle de stub',
            deleteTemplate: 'Modèle de suppression', // is this correct? Idek
            addCustomTemplate: 'Ajouter un modèle personnalisé',
            contentRefreshed: 'Contenu actualisé'
          },
        be: { // Belarusian
            buttonTitle: 'Карысныя функцыі',
            protect: 'Абараніць',
            ajaxContent: 'AJAX-абнаўленне',
            quickDelete: 'Хуткае выдаленне',
            stubTemplate: 'Дадаць шаблон Stub',
            deleteTemplate: 'Дадаць шаблон Delete',
            addCustomTemplate: 'Карыстацкі шаблон',
            contentRefreshed: 'Змесціва абноўлена!'
          },
        ru: { // Russian
            buttonTitle: 'Полезные функции',
            protect: 'Защитить',
            ajaxContent: 'AJAX-обновление',
            quickDelete: 'Быстрое удаление',
            stubTemplate: 'Добавить шаблон Stub',
            deleteTemplate: 'Добавить шаблон Delete',
            addCustomTemplate: 'Пользовательский шаблон',
            contentRefreshed: 'Содержимое обновлено!'
          },
        uk: { // Ukrainian
            buttonTitle: 'Корисні функції',
            protect: 'Захистити',
            ajaxContent: 'AJAX-оновлення',
            quickDelete: 'Швидке видалення',
            stubTemplate: 'Додати шаблон Stub',
            deleteTemplate: 'Додати шаблон Delete',
            addCustomTemplate: 'Користувальницький шаблон',
            contentRefreshed: 'Вміст оновлено!'
          },
        zh: { // Chinese
            buttonTitle: '快捷工具',
            protect: '保护页面',
            ajaxContent: 'AJAX 刷新',
            quickDelete: '快速删除',
            stubTemplate: '+小作品模板',
            deleteTemplate: '+删除模板',
            addCustomTemplate: '自定义模板',
            contentRefreshed: '内容刷新成功！'
          },
        'zh-hant': { // Chinese-Traditional
            buttonTitle: '快捷工具',
            protect: '保護頁面',
            ajaxContent: 'AJAX 刷新',
            quickDelete: '快速刪除',
            stubTemplate: '+小作品模板',
            deleteTemplate: '+刪除模板',
            addCustomTemplate: '自定義模板',
            contentRefreshed: '內容刷新成功！'
          },
        pl: { // Polish
            buttonTitle: 'Przydatne',
            protect: 'Zabezpiecz',
            ajaxContent: 'AJAX Refresh',
            quickDelete: 'Szybkie usuwanie',
            stubTemplate: '+Zalążek',
            deleteTemplate: '+EK',
            addCustomTemplate: '+Inny szablon',
            contentRefreshed: 'Treść odświeżona!'
          }
        };


   var lang = mw.config.get('wgContentLanguage'),
           elementContent = $.extend(i18n.en, i18n[lang.split('-')[0]], i18n[lang]);

    $('.page-header__contribution-buttons').append("<div class=\"wds-button-group\" style=\"vertical-align: top\">" +
    "<a href=\"javascript:void(0)\" class=\"wds-is-squished wds-button\" id=\"usful\">" +
    "<span>" + elementContent.buttonTitle + "</span>" +
    "</a>" +
    "<div class=\"wds-dropdown\">" +
    "<div class=\"wds-button wds-is-squished wds-dropdown__toggle\">" +
    "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" class=\"wds-icon wds-icon-tiny wds-dropdown__toggle-chevron\" id=\"wds-icons-dropdown-tiny\"><path d=\"M6 9l4-5H2\" fill-rule=\"evenodd\"></path></svg></div>" +
    "<div class=\"wds-dropdown__content wds-is-not-scrollable wds-is-right-aligned\">" +
    "<ul class=\"wds-list wds-is-linked\">" +
    "<li><a id=\"num1\" href=\"javascript:void(0)\">" + elementContent.protect +"</a></li>" +
    "<li><a id=\"num2\" href=\"javascript:void(0)\">" + elementContent.ajaxContent +"</a></li>" +
    "<li><a id=\"num7\" href=\"javascript:void(0)\">" + elementContent.quickDelete +"</a></li>" +
    "<li><a id=\"num3\" href=\"javascript:void(0)\">" + elementContent.stubTemplate +"</a></li>" +
    "<li><a id=\"num4\" href=\"javascript:void(0)\">" + elementContent.deleteTemplate +"</a></li>" +
    "<li><a id=\"num5\" href=\"javascript:void(0)\">" + elementContent.addCustomTemplate +"</a></li>" +
    "</ul>" +
    "</div></div></div>");
    // Protection
    $('a#num1').click(function() {
        var protectiontime = prompt('Expiry:');
        var protectionreason = prompt('Protection Reason:');
        if (protectiontime) {
            new mw.Api().post({
                action: 'protect',
                title: mw.config.get('wgPageName'),
                reason: protectionreason,
                expiry: protectiontime,
                protections: 'edit=sysop',
                token: mw.user.tokens.get('editToken')
            }).done(function(d) {
                if (d.error) {
                    new BannerNotification('Error while protecting article: ' + d.error.code, 'error').show();
                } else {
                    new BannerNotification('Successfully protected article', 'success').show();
                }
            }).fail(function() {
                new BannerNotification('Error while protecting article', 'error').show();
            });
        }
    });

    // AJAX refresh
    $('a#num2').on("click", function refreshArticle() {
        var $temp = $('<div>');
        $temp.load(window.location.href + ' #mw-content-text', function() {
                var $newContent = $temp.children('#mw-content-text');
                if ($newContent.length) {
                    $('#mw-content-text').replaceWith($newContent);
                    mw.util.$content = $newContent;

                }
            }

        );
        $temp.remove();
        new BannerNotification(elementContent.contentRefreshed, 'success').show();
    });

    // Adding stub template
    $('a#num3').click(function() {
        new mw.Api().post({
            action: 'edit',
            title: wgPageName,
            summary: "Adding to help needed.",
            prependtext: "{{stub}} \n",
            token: mw.user.tokens.get('editToken')
        }).done(function(d) {
            if (d.error) {
                new BannerNotification('Error adding template: ' + d.error.code, 'error').show();
            } else {
                new BannerNotification('Successfully added to help needed!', 'success').show();
            }
        }).fail(function() {
            new BannerNotification('Error while adding template', 'error').show();
        });
    });

    // adding deletion template
    $('a#num4').click(function() {
        new mw.Api().post({
            action: 'edit',
            title: wgPageName,
            summary: "Adding to candiates for deletion",
            prependtext: "{{delete}} \n",
            token: mw.user.tokens.get('editToken')
        }).done(function(d) {
            if (d.error) {
                new BannerNotification('Error adding template: ' + d.error.code, 'error').show();
            } else {
                new BannerNotification('Successfully added to candidates for deletion!', 'success').show();
            }
        }).fail(function() {
            new BannerNotification('Error while adding template', 'error').show();
        });
    });

    //Adding ability to have any other template via an input box.

    // adding deletion template
    $('a#num5').click(function() {
        var templatename = prompt('Template Name:');
        new mw.Api().post({
            action: 'edit',
            title: wgPageName,
            summary: "Adding template",
            prependtext: "{{" + templatename + "}} \n",
            token: mw.user.tokens.get('editToken')
        }).done(function(d) {
            if (d.error) {
                new BannerNotification('Error adding template: ' + d.error.code, 'error').show();
            } else {
                new BannerNotification('Successfully added template!', 'success').show();
            }
        }).fail(function() {
            new BannerNotification('Error while adding template', 'error').show();
        });
    });

    // Quick Deletion of article
 $('a#num7').click(function() {
    new mw.Api().post({
        action: 'delete',
        title: wgPageName,
        reason: "Housekeeping",
        token: mw.user.tokens.get('editToken')
                    })
                    .done(function () {
                        location.reload();
                    });
 });

window.UsefulDropdown = true;
});
})();
