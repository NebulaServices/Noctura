export function ab_cloak() {
    if (typeof document !== 'undefined') {
        var iframe = document.createElement("iframe");
        iframe.src = window.location.href;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";

        var newWindow = window.open("about:blank", "_blank");
        newWindow.document.body.appendChild(iframe);
        newWindow.document.body.style.width = "100%";
        newWindow.document.body.style.height = "100%";
        newWindow.document.body.style.margin = "0";
        newWindow.document.body.style.padding = "0";
    };
};

export function title_cloak() {
    if (typeof document !== 'undefined') {
        var title = prompt('Title: ', '');
        document.title = title;
    };
};