window.colors = {
  error: {
    color: "#FFFFFF",
    backgroundColor: "#E85742"
  },
  success: {
    color: "#FFFFFF",
    backgroundColor: "#55CA92"
  },
  warning: {
    color: "#333333",
    backgroundColor: "#F5E273"
  },
  info: {
    color: "#FFFFFF",
    backgroundColor: "#4990E2"
  }
};

const queue = [];

window.notify = {
  show(msg = "", status = "info", time = 2000, force = false) {
    if (queue.length && !force) return queue.push([...arguments]);

    var notif = document.getElementById("toast-notification");

    notif.onclick = notify.hide;

    notif.style.transform = "translateY(100%)";
    notif.style.background = colors[status].backgroundColor;
    notif.style.color = colors[status].color;
    notif.innerHTML = msg;

    queue.push([...arguments]);

    if (time > -1)
      setTimeout(function () {
        notif.style.transform = "translateY(0)";

        setTimeout(function () {
          queue.splice(0, 1);
          if (queue.length) notify.show(...queue.splice(0, 1)[0], true);
        }, 300);
      }, time);
  },
  hide() {
    return new Promise((res) => {
      var notif = document.getElementById("toast-notification");

      notif.style.transform = "translateY(0)";

      setTimeout(function () {
        queue.splice(0, 1);
        if (queue.length) notify.show(...queue.splice(0, 1)[0], true);
        res();
      }, 300);
    });
  }
};
