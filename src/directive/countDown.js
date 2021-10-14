import { Message } from "element-ui";
const countDown = {
  bind(el, { value }) {
    el.handler = () => {
      el.$time = value;
      if (!el.$time || typeof el.$time !== "number") {
        Message.warning("无计时");
      } else {
        el.style.cursor = "not-allowed";
        var Timer = setInterval(() => {
          if (el.$time <= 0) {
            el.Timer = null;
            clearInterval(Timer);
            el.childNodes[2].innerHTML = "导 出";
            el.style.cursor = "pointer";
          } else {
            el.childNodes[2].innerHTML = el.$time + " （s）";
            el.childNodes[2].style.display = "inline-block";
            el.childNodes[2].style.width = "27.33px";
            el.$time--;
          }
        }, 1100);
      }
    };
    el.addEventListener("click", el.handler);
  },
  unbind(el) {
    el.removeEventListener("click", el.handler);
  }
};

export default countDown;
