import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-BhfO7re0.mjs';
import { _ as _sfc_main$3 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$4 } from './Table-CiWunXtq.mjs';
import { ref, withAsyncContext, computed, mergeProps, unref, withCtx, isRef, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
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
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './useFilter-BytkjEhg.mjs';
import './virtualizer-Dnga9fey.mjs';
import './utils-Bd-v-gOF.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import '@tanstack/vue-virtual';
import '@tanstack/vue-table';
import '@vue/shared';

const _sfc_main = {
  __name: "monitoring",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const selectedNetDeviceId = ref(null);
    const customerDeviceId = ref("");
    const deviceStats = ref(null);
    const customerStats = ref(null);
    const isLoadingDeviceStats = ref(false);
    const isLoadingCustomerStats = ref(false);
    const eventColumns = [
      { accessorKey: "action", header: "Akcja" },
      { accessorKey: "resourceType", header: "Typ" },
      { accessorKey: "details", header: "Szczegóły" }
    ];
    const { data: summary, refresh: refreshSummary } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/monitoring/summary",
      "$-jkfSqmjYZ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: globalStats, refresh: refreshGlobalStats } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/monitoring/global/stats",
      "$C8NTcqM4zb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const deviceOptions = computed(() => {
      return (summary.value?.devices || []).map((device) => ({
        value: device.id,
        header: `${device.name} (${device.status})`
      }));
    });
    const refreshAll = async () => {
      await Promise.all([
        refreshSummary(),
        refreshGlobalStats()
      ]);
    };
    const loadDeviceStats = async () => {
      if (!selectedNetDeviceId.value) {
        return;
      }
      isLoadingDeviceStats.value = true;
      try {
        deviceStats.value = await $fetch(`/api/v1/monitoring/devices/${selectedNetDeviceId.value}/stats`);
      } finally {
        isLoadingDeviceStats.value = false;
      }
    };
    const loadCustomerStats = async () => {
      if (!customerDeviceId.value) {
        return;
      }
      isLoadingCustomerStats.value = true;
      try {
        customerStats.value = await $fetch(`/api/v1/monitoring/customer-devices/${customerDeviceId.value}/stats`);
      } finally {
        isLoadingCustomerStats.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monitoring runtime</h1><p class="text-sm text-gray-500">Lokalny monitoring urządzeń i ruchu na aktywnym backendzie TS.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(`</div><div class="grid md:grid-cols-2 xl:grid-cols-5 gap-4"><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Devices</div><div class="text-2xl font-bold">${ssrInterpolate(unref(summary)?.totalDevices ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Online</div><div class="text-2xl font-bold">${ssrInterpolate(unref(summary)?.onlineDevices ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Offline</div><div class="text-2xl font-bold">${ssrInterpolate(unref(summary)?.offlineDevices ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Maintenance</div><div class="text-2xl font-bold">${ssrInterpolate(unref(summary)?.maintenanceDevices ?? 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Customer devices</div><div class="text-2xl font-bold">${ssrInterpolate(unref(summary)?.customerDevices ?? 0)}</div></div></div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Urządzenia sieciowe</h2><p class="text-sm text-gray-500"${_scopeId}>Wybierz urządzenie, żeby pobrać lokalną serię CPU i throughput.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Urządzenia sieciowe"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Wybierz urządzenie, żeby pobrać lokalną serię CPU i throughput.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedNetDeviceId),
              "onUpdate:modelValue": ($event) => isRef(selectedNetDeviceId) ? selectedNetDeviceId.value = $event : null,
              items: unref(deviceOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Wybierz urządzenie"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isLoadingDeviceStats),
              label: "Pobierz statystyki urządzenia",
              onClick: loadDeviceStats
            }, null, _parent2, _scopeId));
            if (unref(deviceStats)) {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"${_scopeId}><div${_scopeId}>Samples: ${ssrInterpolate(unref(deviceStats).labels.length)}</div><div${_scopeId}>CPU last: ${ssrInterpolate(unref(deviceStats).datasets[0]?.data?.[unref(deviceStats).datasets[0].data.length - 1] ?? 0)}</div><div${_scopeId}>Traffic in last: ${ssrInterpolate(unref(deviceStats).datasets[1]?.data?.[unref(deviceStats).datasets[1].data.length - 1] ?? 0)} Mbps</div><div${_scopeId}>Traffic out last: ${ssrInterpolate(unref(deviceStats).datasets[2]?.data?.[unref(deviceStats).datasets[2].data.length - 1] ?? 0)} Mbps</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(selectedNetDeviceId),
                  "onUpdate:modelValue": ($event) => isRef(selectedNetDeviceId) ? selectedNetDeviceId.value = $event : null,
                  items: unref(deviceOptions),
                  "value-key": "value",
                  "label-key": "label",
                  placeholder: "Wybierz urządzenie"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  loading: unref(isLoadingDeviceStats),
                  label: "Pobierz statystyki urządzenia",
                  onClick: loadDeviceStats
                }, null, 8, ["loading"]),
                unref(deviceStats) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"
                }, [
                  createVNode("div", null, "Samples: " + toDisplayString(unref(deviceStats).labels.length), 1),
                  createVNode("div", null, "CPU last: " + toDisplayString(unref(deviceStats).datasets[0]?.data?.[unref(deviceStats).datasets[0].data.length - 1] ?? 0), 1),
                  createVNode("div", null, "Traffic in last: " + toDisplayString(unref(deviceStats).datasets[1]?.data?.[unref(deviceStats).datasets[1].data.length - 1] ?? 0) + " Mbps", 1),
                  createVNode("div", null, "Traffic out last: " + toDisplayString(unref(deviceStats).datasets[2]?.data?.[unref(deviceStats).datasets[2].data.length - 1] ?? 0) + " Mbps", 1)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Urządzenia klienta</h2><p class="text-sm text-gray-500"${_scopeId}>Read-only seria ruchu dla importowanych i lokalnych urządzeń klienta.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Urządzenia klienta"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Read-only seria ruchu dla importowanych i lokalnych urządzeń klienta.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(customerDeviceId),
              "onUpdate:modelValue": ($event) => isRef(customerDeviceId) ? customerDeviceId.value = $event : null,
              type: "number",
              placeholder: "ID urządzenia klienta"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              loading: unref(isLoadingCustomerStats),
              label: "Pobierz statystyki klienta",
              onClick: loadCustomerStats
            }, null, _parent2, _scopeId));
            if (unref(customerStats)) {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"${_scopeId}><div${_scopeId}>Samples: ${ssrInterpolate(unref(customerStats).labels.length)}</div><div${_scopeId}>Inbound last: ${ssrInterpolate(unref(customerStats).in_mbps[unref(customerStats).in_mbps.length - 1] ?? 0)} Mbps</div><div${_scopeId}>Outbound last: ${ssrInterpolate(unref(customerStats).out_mbps[unref(customerStats).out_mbps.length - 1] ?? 0)} Mbps</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(customerDeviceId),
                  "onUpdate:modelValue": ($event) => isRef(customerDeviceId) ? customerDeviceId.value = $event : null,
                  type: "number",
                  placeholder: "ID urządzenia klienta"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  variant: "soft",
                  loading: unref(isLoadingCustomerStats),
                  label: "Pobierz statystyki klienta",
                  onClick: loadCustomerStats
                }, null, 8, ["loading"]),
                unref(customerStats) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"
                }, [
                  createVNode("div", null, "Samples: " + toDisplayString(unref(customerStats).labels.length), 1),
                  createVNode("div", null, "Inbound last: " + toDisplayString(unref(customerStats).in_mbps[unref(customerStats).in_mbps.length - 1] ?? 0) + " Mbps", 1),
                  createVNode("div", null, "Outbound last: " + toDisplayString(unref(customerStats).out_mbps[unref(customerStats).out_mbps.length - 1] ?? 0) + " Mbps", 1)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Global traffic</h2><p class="text-sm text-gray-500"${_scopeId}>Zagregowany lokalny throughput dla całego runtime.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Global traffic"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Zagregowany lokalny throughput dla całego runtime.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"${_scopeId}><div${_scopeId}>Samples: ${ssrInterpolate(unref(globalStats)?.labels?.length ?? 0)}</div><div${_scopeId}>Last throughput: ${ssrInterpolate(unref(globalStats)?.total_mbps?.[unref(globalStats).total_mbps.length - 1] ?? 0)} Mbps</div></div>`);
          } else {
            return [
              createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2" }, [
                createVNode("div", null, "Samples: " + toDisplayString(unref(globalStats)?.labels?.length ?? 0), 1),
                createVNode("div", null, "Last throughput: " + toDisplayString(unref(globalStats)?.total_mbps?.[unref(globalStats).total_mbps.length - 1] ?? 0) + " Mbps", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Recent events</h2><p class="text-sm text-gray-500"${_scopeId}>Ostatnie zdarzenia operacyjne z audytu.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Recent events"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Ostatnie zdarzenia operacyjne z audytu.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(summary)?.recentEvents || [],
              columns: eventColumns
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(summary)?.recentEvents || [],
                columns: eventColumns
              }, null, 8, ["data"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/monitoring.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=monitoring-Wdm0lriC.mjs.map
