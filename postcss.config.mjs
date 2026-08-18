// A small PostCSS pass that runs AFTER @tailwindcss/postcss to collapse the
// duplicated `!important !important` that flowbite 4.0.2's plugin + tailwindcss
// 4.3.3 emit on the generated `.!dark .apexcharts-*` dark-mode overrides. Next's
// Lightning CSS parser rejects the doubled token, which otherwise 500s every
// route (globals.css is imported by the root layout).
//
// PostCSS parses `x !important !important` by moving the last `!important` into
// the declaration's `important` flag and leaving one `!important` behind in the
// value; on stringify the flag re-appends its own, reproducing the double. So we
// strip every `!important` from the value and rely on the flag to emit exactly
// one. Runs in OnceExit so Tailwind has finished generating before we walk.
const collapseDuplicateImportant = () => ({
  postcssPlugin: "collapse-duplicate-important",
  OnceExit(root) {
    root.walkDecls((decl) => {
      if (/!important/i.test(decl.value)) {
        decl.value = decl.value.replace(/\s*!important\b/gi, "").trimEnd();
        decl.important = true;
      }
    });
  },
});
collapseDuplicateImportant.postcss = true;

const config = {
  plugins: ["@tailwindcss/postcss", collapseDuplicateImportant],
};

export default config;
