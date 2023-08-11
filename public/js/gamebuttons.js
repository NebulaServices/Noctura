function handleFullscreenClick() {
      let iframe = document.getElementById("theaterViewport");

      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        // IE/Edge
        iframe.msRequestFullscreen();
      }
    }

    function Popout() {
      let iframe = document.getElementById("theaterViewport");
      let src = iframe.getAttribute("src");
      window.open(src);
    }

    function ABPopout() {
      let theateriframe = document.getElementById("theaterViewport");
      let src = theateriframe.getAttribute("src");
      var newWindow = window.open("about:blank");
      var iframe = document.createElement("iframe");
      iframe.src = window.location.origin + src;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      newWindow.document.body.appendChild(iframe);
    }

    function BlobPopout() {
      let theateriframe = document.getElementById("theaterViewport");
      let src = theateriframe.getAttribute("src");
      var newWindow = window.open(
        URL.createObjectURL(
          new Blob(["<html><body></body></html>"], {
            type: "text/html"
          })
        ),
        "_blank"
      );
      var iframe = document.createElement("iframe");
      iframe.src = window.location.origin + src;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";

      newWindow.onload = function () {
        newWindow.onload = null;

        newWindow.document.body.style.background = "black";
        newWindow.document.body.appendChild(iframe);
        newWindow.document.body.style.width = "100%";
        newWindow.document.body.style.height = "100%";
        newWindow.document.body.style.margin = "0";
        newWindow.document.body.style.padding = "0";
      };
    }