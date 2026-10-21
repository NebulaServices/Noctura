(function () {
  const input = document.querySelector(".home-input");
  const results = document.querySelector(".home-results");

  if (!input || !results) return;

  const form = input.closest("form");

  let items = [];
  let active = -1;
  let timer = null;
  let controller = null;

  function open() {
    if (!items.length) return;
    input.classList.add("input-omnibox");
    input.setAttribute("aria-expanded", "true");
    results.style.display = "block";
  }

  function close() {
    input.classList.remove("input-omnibox");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    results.style.display = "none";
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

  function render(data) {
    results.innerHTML = "";
    items = data.map(function (result, i) {
      const li = document.createElement("li");
      const span = document.createElement("span");

      li.id = "omnibox-option-" + i;
      li.setAttribute("role", "option");
      span.innerText = result.phrase;
      li.appendChild(span);

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
        pick(items[active].querySelector("span").innerText);
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
