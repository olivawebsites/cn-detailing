// Before / after slider
const range = document.getElementById("baRange");
const before = document.getElementById("baBefore");
const handle = document.getElementById("baHandle");

if (range && before && handle) {
  const update = () => {
    const v = range.value;
    before.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    handle.style.left = `${v}%`;
  };
  range.addEventListener("input", update);
  update();
}
