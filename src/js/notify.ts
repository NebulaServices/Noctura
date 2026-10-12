type NotifyStatus = "error" | "success" | "warning" | "info";

interface NotifyColor {
  color: string;
  backgroundColor: string;
}

interface Notify {
  show(msg?: string, status?: NotifyStatus, time?: number, force?: boolean): void;
  hide(): Promise<void>;
}

declare global {
  interface Window {
    colors: Record<NotifyStatus, NotifyColor>;
    notify: Notify;
  }
}

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

type QueueEntry = [string, NotifyStatus, number, boolean];
const queue: QueueEntry[] = [];

function replayNext() {
  queue.splice(0, 1);
  const entry = queue.splice(0, 1)[0];
  if (entry) window.notify.show(entry[0], entry[1], entry[2], true);
}

window.notify = {
  show(msg = "", status: NotifyStatus = "info", time = 2000, force = false) {
    if (queue.length && !force) {
      queue.push([msg, status, time, force]);
      return;
    }

    const notif = document.getElementById("toast-notification");
    if (!notif) return;

    notif.onclick = () => window.notify.hide();

    notif.style.transform = "translateY(100%)";
    notif.style.background = window.colors[status].backgroundColor;
    notif.style.color = window.colors[status].color;
    notif.innerHTML = msg;

    queue.push([msg, status, time, force]);

    if (time > -1)
      setTimeout(function () {
        notif.style.transform = "translateY(0)";

        setTimeout(replayNext, 300);
      }, time);
  },
  hide() {
    return new Promise<void>((res) => {
      const notif = document.getElementById("toast-notification");

      if (notif) notif.style.transform = "translateY(0)";

      setTimeout(function () {
        replayNext();
        res();
      }, 300);
    });
  }
};

export default window.notify;
