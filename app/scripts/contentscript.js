import $ from "jquery";

class ChannelGrouper {
    constructor() {
    }

    groupingAllByPrefix() {
        const channelItems = $(".p-channel_sidebar__static_list [role=listitem]");
        let previousPrefix = "";
        let prefixes = [];

        channelItems.each(function (index, elem) {
            const $item = $(elem)
            const $span = $item.find("a > span");
            const channelName = $.trim($span.text());

            if (/^.+?[-_].*/.test(channelName)) {
                const prefix = channelName.match(/(^.+?)[-_].*/)[1];
                prefixes[index] = prefix;
            }
        });

        channelItems.each(function (index, elem) {
            const $item = $(elem)
            const $span = $item.find("a > span");
            const channelName = $.trim($span.text());
            const prefix = prefixes[index];
            const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;

            if ($span.hasClass("scg-ch-parent") || $span.hasClass("scg-ch-child")) {
                return;
            }

            if (isLoneliness) {
                return;
            }

            if (prefixes[index] == null) {
                return;
            }

            const isParent = prefix !== previousPrefix;
            const isLastChild = prefixes[index + 1] !== prefix;
            const separator = isParent ? "┬" : (isLastChild ? "└" : "├");

            $span
                .empty()
                .addClass(isParent ? "scg-ch-parent" : "scg-ch-child")
                .append($("<span>").addClass("scg-ch-prefix").text(prefix))
                .append($("<span>").addClass("scg-ch-separator").text(separator))
                .append($("<span>").addClass("scg-ch-name").text(channelName.replace(/(^.+?)[-_](.*)/, "$2")));

            previousPrefix = prefix;
        });
    }

    watchChannelList() {
        const watchTarget = document.querySelector(".p-channel_sidebar__static_list");
        const observer = new MutationObserver((mutations) => {
            this.groupingAllByPrefix();
        });

        observer.observe(watchTarget, {
            childList: true,
        });
    }
}

setTimeout(function () {
    const channelGrouper = new ChannelGrouper();
    channelGrouper.groupingAllByPrefix();
    channelGrouper.watchChannelList();
}, 3000);
