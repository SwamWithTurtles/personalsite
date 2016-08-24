// Used to enable livefyre widget. Widget code will be an FT customized version of livefyre script; e.g: http://www.ft-static.com/sp/prod/comments/1.0.6/long/ftcomIntegration.min.js
// ftcomIntegration.min.js is to be filled in Dashboard -> Network -> Settings -> Livefyre Settings
// Source code from loaded scripts: http://git.svc.ft.com:8080/projects/STRAT_P/repos/livefyre-client-integration/browse/public/javascripts
// Livefyre docs: https://github.com/Livefyre/livefyre-docs/wiki/

/* global FT, LF, commentsFtIntegration */
if (FT && FT.$ && (commentsFtIntegration && typeof commentsFtIntegration === 'object')) {
    FT.$(document).ready(function () {
        "use strict";

        // Limit the loading of the script only to ft.com domain and its subdomains.
        var isOnFtDomain = function () {
            return window.location.hostname.indexOf('ft.com', window.location.hostname.length - 'ft.com'.length) !== -1;
        };

        if (FT.$('#ft-article-comments').length && isOnFtDomain()) {

            // Assume widget is NOT inside right hand rail, and if it is, set inRhrSection = true;
            var inRailSection = false;
            if (FT.$('#ft-article-comments').closest('.railSection').length) {
                inRailSection = true;
            }

            var commentsObj = commentsFtIntegration.init(FT.$);
            var commentsSettings = {
                elId: 'livefyre-app-ft-' + FT.page.metadata.articleUuid,
                title: document.title,
                url: FT.$('link[rel=canonical]').attr('href') || document.location.href,
                articleId: FT.page.metadata.articleUuid,
                authPageReload: true
            };

            if (!inRailSection){
                commentsSettings.stringOverrides = {
                    commentCountLabel: 'COMMENTS (%s)',
                    commentCountLabelPlural: 'COMMENTS (%s)'
                };
            } else {
                commentsSettings.emailAlert = false;
                commentsSettings.layout = 'side';
            }


            var ftCommentsWidget = new commentsObj.Widget(commentsSettings);

            if(!inRailSection){
                // Livefyre events docs: https://github.com/Livefyre/livefyre-docs/wiki/JavaScript-API#available-events
                ftCommentsWidget.on('initialRenderComplete.widget', function () {
                    ftCommentsWidget.ui.moveCommentCountOut();
                });
            }

            ftCommentsWidget.deferredLoad();
        }
    });
}
