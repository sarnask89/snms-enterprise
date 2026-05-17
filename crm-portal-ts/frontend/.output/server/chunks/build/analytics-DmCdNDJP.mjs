import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$3 } from './Table-CiWunXtq.mjs';
import { ref, withAsyncContext, mergeProps, unref, withCtx, isRef, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useFetch } from './fetch-BurXZm7-.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import '@vueuse/core';
import '@vueuse/shared';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';
import '@vue/shared';

const _sfc_main = {
  __name: "analytics",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const searchQuery = ref("");
    const searchResults = ref(null);
    const isSearching = ref(false);
    const customerColumns = [
      { accessorKey: "customerCode", header: "Kod" },
      { accessorKey: "lastName", header: "Nazwisko" },
      { accessorKey: "firstName", header: "Imie" },
      { accessorKey: "status", header: "Status" }
    ];
    const deviceColumns = [
      { accessorKey: "hostname", header: "Hostname" },
      { accessorKey: "ipAddress", header: "IP" },
      { accessorKey: "macAddress", header: "MAC" },
      { accessorKey: "customerName", header: "Klient" }
    ];
    const { data: networkHealth, refresh: refreshNetworkHealth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/stats/network-health",
      "$zRHvWpu1yR"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: inventorySummary, refresh: refreshInventorySummary } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/stats/inventory-summary",
      "$IlbrydJTJL"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: financialSummary, refresh: refreshFinancialSummary } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/stats/financial-summary",
      "$eYLUKx_g_N"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customerGrowth, refresh: refreshCustomerGrowth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/stats/customer-growth",
      "$IG7DrYWSQ-"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: pitSummary, refresh: refreshPitSummary } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/reports/pit-uke/summary",
      "$HFdZWQLtpf"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: passportNodes, refresh: refreshPassportNodes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/reports/passport/map",
      "$TOhWz_6mK4"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const refreshAll = async () => {
      await Promise.all([
        refreshNetworkHealth(),
        refreshInventorySummary(),
        refreshFinancialSummary(),
        refreshCustomerGrowth(),
        refreshPitSummary(),
        refreshPassportNodes()
      ]);
    };
    const runSearch = async () => {
      if (searchQuery.value.trim().length < 3) {
        searchResults.value = {
          searchType: "name",
          customers: [],
          devices: []
        };
        return;
      }
      isSearching.value = true;
      try {
        searchResults.value = await $fetch("/api/v1/search", {
          query: { q: searchQuery.value.trim() }
        });
      } finally {
        isSearching.value = false;
      }
    };
    const downloadBlob = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const link = (void 0).createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    };
    const downloadPitCsv = async () => {
      const blob = await $fetch("/api/v1/reports/pit-uke/export", { responseType: "blob" });
      downloadBlob(blob, "pit_uke_export.csv");
    };
    const downloadPitGml = async () => {
      const blob = await $fetch("/api/v1/pit/export/nodes", { responseType: "blob" });
      downloadBlob(blob, "pit-net-nodes.gml");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UTable = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analityka i raporty</h1><p class="text-sm text-gray-500">Statystyki runtime TS, globalne wyszukiwanie oraz eksporty raportowe.</p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-arrow-down-tray",
        label: "Pobierz PIT CSV",
        onClick: downloadPitCsv
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        variant: "soft",
        icon: "i-heroicons-map",
        label: "Pobierz PIT GML",
        onClick: downloadPitGml
      }, null, _parent));
      _push(`</div></div><div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4"><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Routery online</div><div class="text-2xl font-bold">${ssrInterpolate(unref(networkHealth)?.onlineNow ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Typy inventory</div><div class="text-2xl font-bold">${ssrInterpolate(unref(inventorySummary)?.labels?.length ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Nodes on map</div><div class="text-2xl font-bold">${ssrInterpolate(unref(passportNodes)?.length ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">PIT UKE rows</div><div class="text-2xl font-bold">${ssrInterpolate(unref(pitSummary)?.customerDeviceCount ?? 0)}</div></div></div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Globalne wyszukiwanie</h2><p class="text-sm text-gray-500"${_scopeId}>Klienci i urządzenia klienta z aktywnego runtime TS.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Globalne wyszukiwanie"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Klienci i urządzenia klienta z aktywnego runtime TS.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(searchQuery),
              "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
              class: "flex-1",
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Minimum 3 znaki..."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isSearching),
              label: "Szukaj",
              onClick: runSearch
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(searchResults)) {
              _push2(`<div class="mt-4 space-y-4"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>Typ zapytania: <span class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(searchResults).searchType)}</span></div><div${_scopeId}><div class="font-medium mb-2"${_scopeId}>Klienci</div>`);
              _push2(ssrRenderComponent(_component_UTable, {
                data: unref(searchResults).customers,
                columns: customerColumns
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><div class="font-medium mb-2"${_scopeId}>Urządzenia</div>`);
              _push2(ssrRenderComponent(_component_UTable, {
                data: unref(searchResults).devices,
                columns: deviceColumns
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex gap-3" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(searchQuery),
                  "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                  class: "flex-1",
                  icon: "i-heroicons-magnifying-glass-20-solid",
                  placeholder: "Minimum 3 znaki..."
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  loading: unref(isSearching),
                  label: "Szukaj",
                  onClick: runSearch
                }, null, 8, ["loading"])
              ]),
              unref(searchResults) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 space-y-4"
              }, [
                createVNode("div", { class: "text-sm text-gray-500" }, [
                  createTextVNode("Typ zapytania: "),
                  createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(searchResults).searchType), 1)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "font-medium mb-2" }, "Klienci"),
                  createVNode(_component_UTable, {
                    data: unref(searchResults).customers,
                    columns: customerColumns
                  }, null, 8, ["data"])
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "font-medium mb-2" }, "Urządzenia"),
                  createVNode(_component_UTable, {
                    data: unref(searchResults).devices,
                    columns: deviceColumns
                  }, null, 8, ["data"])
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Snapshot statystyk</h2><p class="text-sm text-gray-500"${_scopeId}>Serie i agregaty z modułów \`stats\` oraz \`reports\`.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Snapshot statystyk"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Serie i agregaty z modułów `stats` oraz `reports`.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 text-sm"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="font-medium mb-2"${_scopeId}>Network health</div><div${_scopeId}>Total devices: ${ssrInterpolate(unref(networkHealth)?.totalDevices ?? 0)}</div><div${_scopeId}>History points: ${ssrInterpolate(unref(networkHealth)?.history?.length ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="font-medium mb-2"${_scopeId}>Financial summary</div><div${_scopeId}>Months: ${ssrInterpolate(unref(financialSummary)?.labels?.length ?? 0)}</div><div${_scopeId}>Revenue buckets: ${ssrInterpolate(unref(financialSummary)?.series?.[0]?.data?.length ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="font-medium mb-2"${_scopeId}>Customer growth</div><div${_scopeId}>Labels: ${ssrInterpolate(unref(customerGrowth)?.labels?.join(", ") || "n/a")}</div><div${_scopeId}>Last value: ${ssrInterpolate(unref(customerGrowth)?.values?.[unref(customerGrowth).values.length - 1] ?? 0)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 text-sm" }, [
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "font-medium mb-2" }, "Network health"),
                  createVNode("div", null, "Total devices: " + toDisplayString(unref(networkHealth)?.totalDevices ?? 0), 1),
                  createVNode("div", null, "History points: " + toDisplayString(unref(networkHealth)?.history?.length ?? 0), 1)
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "font-medium mb-2" }, "Financial summary"),
                  createVNode("div", null, "Months: " + toDisplayString(unref(financialSummary)?.labels?.length ?? 0), 1),
                  createVNode("div", null, "Revenue buckets: " + toDisplayString(unref(financialSummary)?.series?.[0]?.data?.length ?? 0), 1)
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "font-medium mb-2" }, "Customer growth"),
                  createVNode("div", null, "Labels: " + toDisplayString(unref(customerGrowth)?.labels?.join(", ") || "n/a"), 1),
                  createVNode("div", null, "Last value: " + toDisplayString(unref(customerGrowth)?.values?.[unref(customerGrowth).values.length - 1] ?? 0), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=analytics-DmCdNDJP.mjs.map
