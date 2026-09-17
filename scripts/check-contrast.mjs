/* =============================================================================
   CONTRAST
   -----------------------------------------------------------------------------
   Checks every colour pair the palette actually puts together, against
   WCAG 2.2:

     1.4.3 Contrast (Minimum)  4.5:1 for body text, 3:1 for large text
     1.4.11 Non-text Contrast  3:1 for the boundary of a control

   It is arithmetic on the tokens in globals.css rather than a screenshot
   reading, because a screenshot cannot tell you that a pair is at 4.4 — it just
   looks slightly tired.

   The brand gold is the reason this file exists. #C9A451 measures 2.1:1 on
   the ivory: it can never carry text on a light ground. The palette solves that by
   using gold as a FILL that carries near-black type, and a darker bronze
   descendant for text on light grounds. This script is what proves that holds
   everywhere rather than mostly.

     node scripts/check-contrast.mjs
   ========================================================================== */

const PALETTES = {
  "Swarma Villas": {
    canvas: "#f5f0e4",
    surface: "#fbf8f1",
    raised: "#ebe4d0",
    ink: "#2f3915",
    muted: "#474c30",
    line: "#d9d1b9",
    field: "#838566",
    subtle: "#65684f",
    accent: "#7b622c",
    gold: "#c9a451",
    ongold: "#2f3915",
    deep: "#2f3915",
    ondeep: "#f5f0e4",
  },
};

/**
 * Text colours, and the grounds they are actually placed on.
 *
 * `field` is absent from this list on purpose: it is a control-boundary colour
 * and never sets type. Small print uses `subtle`, which is a darker value
 * chosen to clear 4.5:1 on the darkest of the three light grounds.
 */
const TEXT_ON = [
  ["ink", ["canvas", "surface", "raised", "gold"]],
  ["muted", ["canvas", "surface", "raised"]],
  ["accent", ["canvas", "surface", "raised"]],
  ["subtle", ["canvas", "surface", "raised"]],
  ["ongold", ["gold"]],
  ["ondeep", ["deep"]],
  ["gold", ["deep"]],
];

/** Control boundaries, which need 3:1 rather than 4.5:1. */
const BOUNDARY_ON = [
  ["field", ["canvas", "surface", "raised"]],
  ["gold", ["deep"]],
];

/**
 * Decorative separators. 1.4.11 exempts these — a rule between two paragraphs
 * carries no information — so they are reported but never failed.
 */
const DECORATIVE_ON = [["line", ["canvas", "surface", "raised"]]];

const LARGE_TEXT = new Set(["ink on gold"]);

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = srgbToLinear((n >> 16) & 255);
  const g = srgbToLinear((n >> 8) & 255);
  const b = srgbToLinear(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

let failures = 0;
let checks = 0;

for (const [name, palette] of Object.entries(PALETTES)) {
  console.log(`\n${name}`);

  const run = (pairs, minimum, kind) => {
    for (const [fg, grounds] of pairs) {
      for (const bg of grounds) {
        const value = ratio(palette[fg], palette[bg]);
        const label = `${fg} on ${bg}`;
        const required = LARGE_TEXT.has(label) ? 3 : minimum;
        const ok = value >= required;
        checks++;
        if (!ok && kind !== "decorative") failures++;
        const mark = kind === "decorative" ? "note" : ok ? "pass" : "FAIL";
        console.log(
          `  ${mark}  ${label.padEnd(22)} ${value.toFixed(2)}:1` +
            (kind === "decorative" ? "  (separator, 1.4.11 exempt)" : `  needs ${required}:1`),
        );
      }
    }
  };

  run(TEXT_ON, 4.5, "text");
  run(BOUNDARY_ON, 3, "boundary");
  run(DECORATIVE_ON, 3, "decorative");

  // The one that must never be allowed back in.
  const goldOnLight = ratio(palette.gold, palette.canvas);
  console.log(
    `  note  gold on canvas is ${goldOnLight.toFixed(2)}:1 — a fill only, never a text colour`,
  );
}

console.log(`\n${checks - failures}/${checks} contrast checks passed.`);
if (failures) {
  console.log(`${failures} FAILED.\n`);
  process.exit(1);
}
console.log("");
