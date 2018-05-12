// ==UserScript==
// @name         Content moderator fix
// @namespace    http://kancolle.wikia.com/
// @version      0.1
// @description  Fix issue with wikia not showing Content moderator as a masthead tag.
// @author       がか
// @match        http://kancolle.wikia.com/wiki/
// @grant        none
// ==/UserScript==

(function($) {

    "use strict";

    $(document).ready(function() {

        var content_moderators = [
            "Qunow", "Zel-melon", "McDerp", "Shinhwalee",
        ];

        var user_name = $("#UserProfileMasthead [itemprop='name']").text();

        if (user_name && $.inArray(user_name, content_moderators) !== -1) {
            $("#UserProfileMasthead .tag").text("Content/Discussion Moderator");
        }

    });

}(jQuery));
