// The "Random effect" button paints inline colours onto every heading, paragraph
// and button. Inline styles beat the stylesheets, so anything that changes the
// theme has to clear them again — otherwise the Dark/Light toggle silently stops
// having any visible effect on text until the next reload.

const TAGS = ["h1", "h2", "h3", "h4", "h5", "p", "button"];
const STEPS = 10;
const STEP_MS = 200;

let timers = [];

function randomColor() {
  // padStart matters: without it small values produce short strings like
  // "#abcd", which is not a valid colour and leaves the element unchanged.
  const value = Math.floor(Math.random() * 16777216);
  return "#" + value.toString(16).padStart(6, "0");
}

function eachElement(fn) {
  TAGS.forEach((tag) => {
    document.querySelectorAll(tag).forEach(fn);
  });
}

function cancelPending() {
  timers.forEach(clearTimeout);
  timers = [];
}

export function runRandomEffect() {
  cancelPending();
  for (let i = 0; i < STEPS; i++) {
    timers.push(
      setTimeout(() => {
        eachElement((element) => {
          element.style.color = randomColor();
        });
      }, STEP_MS * i)
    );
  }
}

export function clearRandomColors() {
  // Cancel queued steps first, or they would repaint over the cleared colours.
  cancelPending();
  eachElement((element) => {
    element.style.removeProperty("color");
  });
}
