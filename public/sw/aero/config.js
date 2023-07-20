var __aero$config = {
  scope: '/~/aero/',
  bare: '/bare/'
}

if (typeof window == 'object' && (!window.parent.location.href.includes('/~/aero/') || window.top == window)) {
  fetch(location.origin + '/js/inject.js?sw=ignore').then(async (res) => {
    const text = await res.text();
    const script = document.createElement('script');

    script.type = 'module';
    script.textContent = text;

    function load() {
        var div = document.createElement('div');
        div.style.display = "none";
        const shadow = div.attachShadow({ mode: "open" });
        shadow.append(script);

        if (self.frameElement && !self.frameElement.classList.contains('tab-frame')) self.frameElement.style.display = 'block';

        document.body.appendChild(div);
    }

    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        load();
    } else {
        document.addEventListener('readystatechange', () => {
            if (document.readyState != 'complete' && document.readyState != 'interactive') return;

            load();
        });
    }
  });
}