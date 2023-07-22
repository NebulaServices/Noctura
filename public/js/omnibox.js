input = document.querySelector(".home-input");

if (input) {
  let autofill = false;

  const request = async function () {
    const req = await fetch("/search=" + encodeURIComponent(input.value));

    return await req.json();
  };

  input.addEventListener("focus", async function (e) {
    if (!autofill) {
      setTimeout(function () {
        const results = document.querySelector(".home-results");

        if (results.innerHTML)
          input.classList.add("input-omnibox"),
            (autofill = true),
            (results.style.display = "block");
      });

      return;
    }
  });

  input.addEventListener("blur", async function (e) {
    if (input.omnibox) return;

    if (autofill) {
      autofill = false;

      setTimeout(function () {
        const results = document.querySelector(".home-results");
        input.classList.remove("input-omnibox");

        results.style.display = "none";
      });

      return;
    }
  });

  input.addEventListener("keydown", async function (e) {
    setTimeout(async function () {
      if (!e.target.value)
        return (
          input.classList.remove("input-omnibox"),
          (autofill = false),
          (document.querySelector(".home-results").style.display = "none"),
          setTimeout(
            (e) => (document.querySelector(".home-results").innerHTML = ""),
            100
          )
        );

      const _value = e.target.value + "";

      const data = await request(e.target.value);

      if (e.target.value !== _value) return;

      const results = document.querySelector(".home-results");

      autofill = true;

      input.classList.add("input-omnibox");

      results.innerHTML = "";

      data.forEach(function (result) {
        const li = document.createElement("li");
        const span = document.createElement("span");

        span.innerText = result.phrase;

        li.appendChild(span);

        li.addEventListener("mousedown", function (e) {
          input.value = result.phrase;
          input.omnibox = true;
          input.focus();
          input.omnibox = false;
          input.classList.remove("input-omnibox");
          autofill = false;
          results.style.display = "none";
          document.querySelector(".home-results").innerHTML = "";

          input.parentNode.requestSubmit();
        });

        results.appendChild(li);
      });

      if (data.length === 0) {
        const li = document.createElement("li");
        const span = document.createElement("span");

        span.innerText = "No results found";

        li.appendChild(span);

        results.appendChild(li);
      }

      results.style.display = "block";
    });
  });
}
