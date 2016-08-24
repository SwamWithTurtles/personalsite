/**
 * This script is to customise how the LiveFyre comment-count is displayed in the article byline
 * @see https://github.com/Livefyre/livefyre-docs/wiki/Comment-Counts#configuration-options
 * @author Jan Majek <jan.majek@ft.com>
 */

if (FT && FT.$) {
    FT.$(document).ready(function () {
        "use strict";

        if (typeof LF !== "undefined" && typeof LF.CommentCount !== "undefined") {
            LF.CommentCount({
                replacer: function (element, count) {
                    element.innerHTML = (count === 0 ? "Comment" : count + " comment" + (count > 1 ? "s" : ""));
                }
            });
        }
    });
}