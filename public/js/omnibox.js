(function () {
  const input = document.querySelector(".home-input");
  const results = document.querySelector(".home-results");

  if (!input || !results) return;

  const form = input.closest("form");

  let items = [];
  let active = -1;
  let timer = null;
  let controller = null;

  const container = document.querySelector(".home-container");

  function open() {
    if (!items.length) return;
    input.classList.add("input-omnibox");
    input.setAttribute("aria-expanded", "true");
    results.style.display = "block";
    if (container) {
      container.style.setProperty(
        "--omnibox-shift",
        Math.round(results.offsetHeight * 0.4) + "px"
      );
      container.classList.add("omnibox-open");
    }
  }

  function close() {
    input.classList.remove("input-omnibox");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    results.style.display = "none";
    if (container) container.classList.remove("omnibox-open");
    active = -1;
  }

  function clear() {
    close();
    items = [];
    results.innerHTML = "";
  }

  function pick(phrase) {
    input.value = phrase;
    clear();
    if (form) form.requestSubmit();
  }

  function setActive(index) {
    active = index;
    items.forEach(function (li, i) {
      li.classList.toggle("active", i === active);
    });
    if (active >= 0) {
      input.setAttribute("aria-activedescendant", items[active].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  const ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>';

  function render(data) {
    const query = input.value.trim().toLowerCase();

    results.innerHTML = "";
    items = data.map(function (result, i) {
      const li = document.createElement("li");
      const icon = document.createElement("i");
      const text = document.createElement("span");

      li.id = "omnibox-option-" + i;
      li.setAttribute("role", "option");
      li.dataset.phrase = result.phrase;

      icon.className = "omnibox-icon";
      icon.innerHTML = ICON;
      li.appendChild(icon);

      text.className = "omnibox-text";
      if (query && result.phrase.toLowerCase().startsWith(query)) {
        const typed = document.createElement("span");
        const rest = document.createElement("b");
        typed.textContent = result.phrase.slice(0, query.length);
        rest.textContent = result.phrase.slice(query.length);
        text.appendChild(typed);
        text.appendChild(rest);
      } else {
        text.textContent = result.phrase;
      }
      li.appendChild(text);

      li.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        pick(result.phrase);
      });
      li.addEventListener("pointerenter", function () {
        setActive(i);
      });

      results.appendChild(li);
      return li;
    });

    if (items.length) open();
    else close();
  }

  async function request(query) {
    if (controller) controller.abort();
    controller = new AbortController();

    try {
      const req = await fetch("/api/search?q=" + encodeURIComponent(query), {
        signal: controller.signal
      });
      render(await req.json());
    } catch (e) {
      if (e.name !== "AbortError") close();
    }
  }

  input.addEventListener("input", function () {
    clearTimeout(timer);

    const value = input.value.trim();

    if (!value) {
      clear();
      return;
    }

    timer = setTimeout(function () {
      request(value);
    }, 150);
  });

  input.addEventListener("keydown", function (e) {
    const visible = results.style.display === "block" && items.length;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!visible) return;
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((active + delta + items.length) % items.length);
    } else if (e.key === "Enter") {
      if (visible && active >= 0) {
        e.preventDefault();
        pick(items[active].dataset.phrase);
      } else {
        clear();
      }
    } else if (e.key === "Escape") {
      close();
    }
  });

  input.addEventListener("focus", open);
  input.addEventListener("blur", close);
})();
