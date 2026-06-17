var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { r as renderers } from "./chunks/_@astro-renderers_BIjpZAOB.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_C1IV5zV_.mjs";
import { manifest } from "./manifest_CaQsgssL.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name(() => import("./pages/_image.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/contact.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/custom-tours.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/custom-tours/_---slug_.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/directions.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/get-best-food-experience-simply-enak.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/kl-test.astro.mjs"), "_page7");
var _page8 = /* @__PURE__ */ __name(() => import("./pages/kuala-lumpur-food-tour.astro.mjs"), "_page8");
var _page9 = /* @__PURE__ */ __name(() => import("./pages/privacy-policy.astro.mjs"), "_page9");
var _page10 = /* @__PURE__ */ __name(() => import("./pages/robots.txt.astro.mjs"), "_page10");
var _page11 = /* @__PURE__ */ __name(() => import("./pages/stories.astro.mjs"), "_page11");
var _page12 = /* @__PURE__ */ __name(() => import("./pages/stories/_---slug_.astro.mjs"), "_page12");
var _page13 = /* @__PURE__ */ __name(() => import("./pages/terms-conditions.astro.mjs"), "_page13");
var _page14 = /* @__PURE__ */ __name(() => import("./pages/thank-you.astro.mjs"), "_page14");
var _page15 = /* @__PURE__ */ __name(() => import("./pages/thank-you-booking.astro.mjs"), "_page15");
var _page16 = /* @__PURE__ */ __name(() => import("./pages/thank-you-booking-kuala-lumpur.astro.mjs"), "_page16");
var _page17 = /* @__PURE__ */ __name(() => import("./pages/thank-you-booking-penang.astro.mjs"), "_page17");
var _page18 = /* @__PURE__ */ __name(() => import("./pages/thank-you-contact.astro.mjs"), "_page18");
var _page19 = /* @__PURE__ */ __name(() => import("./pages/thank-you-inquiry.astro.mjs"), "_page19");
var _page20 = /* @__PURE__ */ __name(() => import("./pages/tours/_slug_.astro.mjs"), "_page20");
var _page21 = /* @__PURE__ */ __name(() => import("./pages/tours.astro.mjs"), "_page21");
var _page22 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page22");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/about.astro", _page1],
  ["src/pages/contact.astro", _page2],
  ["src/pages/custom-tours/index.astro", _page3],
  ["src/pages/custom-tours/[...slug].astro", _page4],
  ["src/pages/directions.astro", _page5],
  ["src/pages/get-best-food-experience-simply-enak.astro", _page6],
  ["src/pages/kl-test.astro", _page7],
  ["src/pages/kuala-lumpur-food-tour.astro", _page8],
  ["src/pages/privacy-policy.astro", _page9],
  ["src/pages/robots.txt.ts", _page10],
  ["src/pages/stories/index.astro", _page11],
  ["src/pages/stories/[...slug].astro", _page12],
  ["src/pages/terms-conditions.astro", _page13],
  ["src/pages/thank-you.astro", _page14],
  ["src/pages/thank-you-booking.astro", _page15],
  ["src/pages/thank-you-booking-kuala-lumpur.astro", _page16],
  ["src/pages/thank-you-booking-penang.astro", _page17],
  ["src/pages/thank-you-contact.astro", _page18],
  ["src/pages/thank-you-inquiry.astro", _page19],
  ["src/pages/tours/[slug].astro", _page20],
  ["src/pages/tours/index.astro", _page21],
  ["src/pages/index.astro", _page22]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => import("./_noop-actions.mjs"), "actions"),
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.061667360204955335.mjs.map
