const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PHONE = "+14703526118";

/* ---------- Intro: spinning logo, tap to burst into bubbles ---------- */
const intro = document.getElementById("intro");

function burst(x, y, count) {
  if (reduceMotion) return;
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "pop";
    const size = 10 + Math.random() * 46;
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 380;
    b.style.width = b.style.height = size + "px";
    b.style.left = x + "px";
    b.style.top = y + "px";
    b.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    b.style.setProperty("--dy", Math.sin(angle) * dist - 120 + "px");
    b.style.animationDelay = Math.random() * 0.15 + "s";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1600);
  }
}

function enterSite(x, y) {
  if (!intro || intro.classList.contains("out")) return;
  burst(x, y, 36);
  intro.classList.add("out");
  document.body.classList.remove("intro-on");
  try { sessionStorage.setItem("cnIntroSeen", "1"); } catch (e) {}
}

if (intro) {
  let seen = false;
  try { seen = sessionStorage.getItem("cnIntroSeen") === "1"; } catch (e) {}
  if (seen) {
    intro.remove();
    document.body.classList.remove("intro-on");
  } else {
    document.body.classList.add("intro-on");
    intro.focus();
    intro.addEventListener("click", (e) => enterSite(e.clientX, e.clientY));
    intro.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enterSite(innerWidth / 2, innerHeight / 2);
      }
    });
    setTimeout(() => enterSite(innerWidth / 2, innerHeight / 2), 7000);
  }
}

/* ---------- Nav turns solid after scrolling ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav && nav.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Hero: water beading on paint ---------- */
const dropBox = document.getElementById("droplets");
if (dropBox) {
  const area = () => ({ w: dropBox.clientWidth, h: dropBox.clientHeight });
  const count = innerWidth < 760 ? 55 : 120;

  const makeDrop = (runner) => {
    const { w, h } = area();
    const d = document.createElement("span");
    d.className = "drop";
    // mostly small beads, a few big ones
    const s = Math.random() < 0.12 ? 18 + Math.random() * 16 : 4 + Math.random() * 10;
    d.style.width = s + "px";
    d.style.height = s * (0.9 + Math.random() * 0.2) + "px";
    d.style.left = Math.random() * w + "px";
    d.style.top = Math.random() * h + "px";
    if (runner && !reduceMotion) {
      d.classList.add("run");
      const fall = 80 + Math.random() * 260;
      d.style.setProperty("--fall", fall + "px");
      d.style.animationDuration = 3 + Math.random() * 4 + "s";
      d.addEventListener("animationend", () => {
        d.remove();
        setTimeout(() => dropBox.appendChild(makeDrop(true)), Math.random() * 2500);
      });
    }
    return d;
  };

  for (let i = 0; i < count; i++) dropBox.appendChild(makeDrop(false));
  for (let i = 0; i < 6; i++) setTimeout(() => dropBox.appendChild(makeDrop(true)), i * 900);
}

/* ---------- Build your detail ---------- */
const builder = document.getElementById("builder");
if (builder) {
  const totalEl = document.getElementById("total");
  const send = document.getElementById("sendQuote");
  const boxes = builder.querySelectorAll('input[type="checkbox"]:not([disabled])');

  const update = () => {
    let total = 100;
    const picked = ["Interior + Exterior Detail"];
    boxes.forEach((b) => {
      if (b.checked) {
        total += Number(b.value);
        picked.push(b.dataset.name);
      }
    });
    totalEl.textContent = "$" + total;
    totalEl.classList.remove("bump");
    void totalEl.offsetWidth;
    totalEl.classList.add("bump");
    setTimeout(() => totalEl.classList.remove("bump"), 200);

    const msg = `Hey Cam! I'd like to book: ${picked.join(", ")}. Total: $${total}. When are you free?`;
    send.href = `sms:${PHONE}?&body=${encodeURIComponent(msg)}`;
  };

  boxes.forEach((b) => b.addEventListener("change", update));
  update();
}

/* ---------- Bubbles follow the cursor (desktop only) ---------- */
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  let last = 0;
  addEventListener("mousemove", (e) => {
    if (document.body.classList.contains("intro-on")) return;
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    const b = document.createElement("span");
    b.className = "trail";
    const s = 6 + Math.random() * 14;
    b.style.width = b.style.height = s + "px";
    b.style.left = e.clientX + "px";
    b.style.top = e.clientY + "px";
    b.style.setProperty("--dx", (Math.random() * 30 - 15) + "px");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1100);
  });
}
