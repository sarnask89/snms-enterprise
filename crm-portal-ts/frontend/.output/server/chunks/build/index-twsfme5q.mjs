import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { e as _sfc_main$d, b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { withAsyncContext, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const statsMap = {
      customers: { label: "Abonenci", icon: "i-heroicons-users", color: "blue" },
      nodes: { label: "Węzły", icon: "i-heroicons-map-pin", color: "emerald" },
      devices: { label: "Urządzenia", icon: "i-heroicons-cpu-chip", color: "indigo" },
      tickets: { label: "Zgłoszenia", icon: "i-heroicons-ticket", color: "orange" }
    };
    const { data: stats } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/dashboard/stats",
      "$bDi1bnLl29"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: recentCustomers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 5 }
      },
      "$DXj8kNUZ5n"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const recentColumns = [
      { accessorKey: "customer_code", header: "Kod" },
      { accessorKey: "last_name", header: "Nazwisko" },
      { accessorKey: "status", header: "Status" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UIcon = _sfc_main$d;
      const _component_UButton = _sfc_main$8;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8" }, _attrs))}><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Panel Sterowania</h1><p class="text-sm text-gray-500">Witaj w systemie SNMS. Oto podsumowanie Twojej sieci.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><!--[-->`);
      ssrRenderList(statsMap, (stat, key) => {
        _push(ssrRenderComponent(_component_UCard, { key }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="${ssrRenderClass(`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`)}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: stat.icon,
                class: "w-6 h-6"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="text-sm text-gray-500 font-medium"${_scopeId}>${ssrInterpolate(stat.label)}</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(stats) ? unref(stats)[key] : "...")}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-4" }, [
                  createVNode("div", {
                    class: `p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`
                  }, [
                    createVNode(_component_UIcon, {
                      name: stat.icon,
                      class: "w-6 h-6"
                    }, null, 8, ["name"])
                  ], 2),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 font-medium" }, toDisplayString(stat.label), 1),
                    createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(stats) ? unref(stats)[key] : "..."), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, { class: "lg:col-span-2" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="font-bold"${_scopeId}>Ostatnio dodani abonenci</h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/customers",
              label: "Zobacz wszystkich",
              variant: "ghost",
              size: "xs"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "font-bold" }, "Ostatnio dodani abonenci"),
                createVNode(_component_UButton, {
                  to: "/customers",
                  label: "Zobacz wszystkich",
                  variant: "ghost",
                  size: "xs"
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(recentCustomers),
              columns: recentColumns
            }, {
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.status === "active" ? "emerald" : "gray",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.status)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.status), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.status === "active" ? "emerald" : "gray",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(recentCustomers),
                columns: recentColumns
              }, {
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.status === "active" ? "emerald" : "gray",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.status), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                _: 1
              }, 8, ["data"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="font-bold"${_scopeId}>Szybkie Akcje</h3>`);
          } else {
            return [
              createVNode("h3", { class: "font-bold" }, "Szybkie Akcje")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-magnifying-glass",
              label: "Szukaj urządzenia",
              color: "gray",
              variant: "soft",
              block: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-document-plus",
              label: "Generuj raport PIT",
              color: "gray",
              variant: "soft",
              block: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-bolt",
              label: "Diagnostyka OLT",
              color: "gray",
              variant: "soft",
              block: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10"${_scopeId}><div class="flex items-center gap-2 text-primary-500 mb-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-sparkles" }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold uppercase tracking-wider"${_scopeId}>AI Insight</span></div><p class="text-xs text-gray-600 dark:text-gray-400 italic"${_scopeId}> &quot;Wykryto 3 nowe urządzenia GPON na porcie PON 1. Sugeruję synchronizację bazy danych.&quot; </p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-2" }, [
                createVNode(_component_UButton, {
                  icon: "i-heroicons-magnifying-glass",
                  label: "Szukaj urządzenia",
                  color: "gray",
                  variant: "soft",
                  block: ""
                }),
                createVNode(_component_UButton, {
                  icon: "i-heroicons-document-plus",
                  label: "Generuj raport PIT",
                  color: "gray",
                  variant: "soft",
                  block: ""
                }),
                createVNode(_component_UButton, {
                  icon: "i-heroicons-bolt",
                  label: "Diagnostyka OLT",
                  color: "gray",
                  variant: "soft",
                  block: ""
                })
              ]),
              createVNode("div", { class: "mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10" }, [
                createVNode("div", { class: "flex items-center gap-2 text-primary-500 mb-2" }, [
                  createVNode(_component_UIcon, { name: "i-heroicons-sparkles" }),
                  createVNode("span", { class: "text-xs font-bold uppercase tracking-wider" }, "AI Insight")
                ]),
                createVNode("p", { class: "text-xs text-gray-600 dark:text-gray-400 italic" }, ' "Wykryto 3 nowe urządzenia GPON na porcie PON 1. Sugeruję synchronizację bazy danych." ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-twsfme5q.mjs.map
