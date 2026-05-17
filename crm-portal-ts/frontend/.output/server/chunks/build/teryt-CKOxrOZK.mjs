import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$3 } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$6 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$4 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$5 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$7 } from './Select-DYGJGuWK.mjs';
import { ref, reactive, withAsyncContext, computed, watch, mergeProps, withCtx, createVNode, unref, withModifiers, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, isRef, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './Label-BCnUNGB-.mjs';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-hoYYm4l-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "teryt",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const importJobs = [
      { accessorKey: "terc", title: "Import TERC", description: "Województwa, powiaty i gminy" },
      { accessorKey: "simc", title: "Import SIMC", description: "Miejscowości i powiązania z gminami" },
      { accessorKey: "ulic", title: "Import ULIC", description: "Ulice powiązane z miastami i gminami" }
    ];
    const cityColumns = [
      { accessorKey: "name", header: "Miasto" },
      { accessorKey: "commune", header: "Gmina" },
      { accessorKey: "district", header: "Powiat" },
      { accessorKey: "streetCount", header: "Ulice" },
      { accessorKey: "flags", header: "Flagi" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const communeColumns = [
      { accessorKey: "name", header: "Gmina" },
      { accessorKey: "district", header: "Powiat / województwo" },
      { accessorKey: "flags", header: "Flagi" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const managedOptions = [
      { label: "Wszystkie miasta", value: "all" },
      { label: "Tylko managed", value: "managed" },
      { label: "Tylko unmanaged", value: "unmanaged" }
    ];
    const search = ref("");
    const communeSearch = ref("");
    const managedFilter = ref("all");
    const selectedCityId = ref(null);
    const importForms = reactive({
      terc: "",
      simc: "",
      ulic: ""
    });
    const importResults = reactive({
      terc: "",
      simc: "",
      ulic: ""
    });
    const loadingImports = reactive({
      terc: false,
      simc: false,
      ulic: false
    });
    const { data: cities, pending: pendingCities, refresh: refreshCities } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/teryt/cities",
      {
        default: () => []
      },
      "$XsqMYKjpaJ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: communes, pending: pendingCommunes, refresh: refreshCommunes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/teryt/communes",
      {
        default: () => []
      },
      "$m5u1hkM0Pa"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: defaultArea, refresh: refreshDefaultArea } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/addresses/default-area",
      "$FryNLNJDBD"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: addressSearchData, refresh: refreshAddressSearch } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/addresses/search-teryt",
      {
        query: { q: search },
        default: () => []
      },
      "$_5-vEIfSV6"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const selectedCity = computed(() => (cities.value || []).find((city) => city.id === selectedCityId.value) || null);
    const { data: streets, refresh: refreshStreets } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/teryt/streets",
      {
        query: {
          cityId: selectedCityId
        },
        default: () => []
      },
      "$uJRKEYbekb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredCities = computed(() => {
      const rows = cities.value || [];
      const query = search.value.trim().toLowerCase();
      return rows.filter((row) => {
        const matchesFilter = managedFilter.value === "all" || managedFilter.value === "managed" && row.isManaged || managedFilter.value === "unmanaged" && !row.isManaged;
        if (!matchesFilter) {
          return false;
        }
        if (!query) {
          return true;
        }
        return [row.name, row.terytCode || "", row.district?.name || "", row.commune?.name || ""].join(" ").toLowerCase().includes(query);
      });
    });
    const filteredCommunes = computed(() => {
      const rows = communes.value || [];
      const query = communeSearch.value.trim().toLowerCase();
      if (!query) {
        return rows;
      }
      return rows.filter(
        (row) => [row.name, row.terytCode || "", row.district?.name || "", row.district?.state?.name || ""].join(" ").toLowerCase().includes(query)
      );
    });
    const addressSearchRows = computed(() => addressSearchData.value || []);
    const streetRows = computed(() => streets.value || []);
    watch(filteredCities, (rows) => {
      if (!rows.length) {
        selectedCityId.value = null;
        return;
      }
      if (!rows.some((row) => row.id === selectedCityId.value)) {
        selectedCityId.value = rows[0].id;
      }
    }, { immediate: true });
    watch(search, async () => {
      await refreshAddressSearch();
    });
    watch(selectedCityId, async () => {
      if (!selectedCityId.value) {
        return;
      }
      await refreshStreets();
    });
    const refreshAll = async () => {
      await Promise.all([
        refreshCities(),
        refreshCommunes(),
        refreshDefaultArea(),
        refreshAddressSearch(),
        refreshStreets()
      ]);
    };
    const onFileSelected = async (kind, event) => {
      const file = event?.target?.files?.[0];
      if (!file) {
        return;
      }
      importForms[kind] = await file.text();
      importResults[kind] = `Załadowano plik: ${file.name}`;
    };
    const submitImport = async (kind) => {
      loadingImports[kind] = true;
      try {
        const result = await $fetch(`/api/v1/teryt/import/${kind}`, {
          method: "POST",
          body: { xmlContent: importForms[kind] }
        });
        importResults[kind] = Object.entries(result).map(([key, value]) => `${key}: ${value}`).join(", ");
        await Promise.all([
          refreshCities(),
          refreshCommunes(),
          refreshDefaultArea(),
          refreshAddressSearch()
        ]);
      } finally {
        loadingImports[kind] = false;
      }
    };
    const toggleManagedCity = async (row) => {
      await $fetch(`/api/v1/addresses/cities/${row.id}/toggle-managed`, { method: "POST" });
      await Promise.all([refreshCities(), refreshDefaultArea()]);
    };
    const setDefaultCity = async (row) => {
      await $fetch(`/api/v1/addresses/cities/${row.id}/set-default`, { method: "POST" });
      await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()]);
    };
    const toggleManagedCommune = async (row) => {
      await $fetch(`/api/v1/addresses/communes/${row.id}/toggle-managed`, { method: "POST" });
      await Promise.all([refreshCommunes(), refreshDefaultArea()]);
    };
    const setDefaultCommune = async (row) => {
      await $fetch(`/api/v1/addresses/communes/${row.id}/set-default`, { method: "POST" });
      await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()]);
    };
    const scheduleSync = async (row) => {
      await $fetch("/api/v1/teryt/sync-geoportal", {
        method: "POST",
        body: { cityId: row.id }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      const _component_UInput = _sfc_main$6;
      const _component_UTable = _sfc_main$4;
      const _component_UBadge = _sfc_main$5;
      const _component_USelect = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">TERYT i adresy</h1><p class="text-sm text-gray-500">Import XML, domyślne obszary i słowniki adresowe do autosugestii formularzy.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(`</div><div class="grid lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(importJobs, (importJob) => {
        _push(ssrRenderComponent(_component_UCard, {
          key: importJob.key
        }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>${ssrInterpolate(importJob.title)}</h2><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(importJob.description)}</p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, toDisplayString(importJob.title), 1),
                  createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(importJob.description), 1)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<form class="space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Plik XML",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input type="file" accept=".xml,text/xml,application/xml" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"${_scopeId2}>`);
                  } else {
                    return [
                      createVNode("input", {
                        type: "file",
                        accept: ".xml,text/xml,application/xml",
                        class: "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950",
                        onChange: ($event) => onFileSelected(importJob.key, $event)
                      }, null, 40, ["onChange"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, { label: "Podgląd treści" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UTextarea, {
                      modelValue: unref(importForms)[importJob.key],
                      "onUpdate:modelValue": ($event) => unref(importForms)[importJob.key] = $event,
                      data: 8
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(importForms)[importJob.key],
                        "onUpdate:modelValue": ($event) => unref(importForms)[importJob.key] = $event,
                        data: 8
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center justify-between gap-3"${_scopeId}><div class="min-h-[20px] text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(importResults)[importJob.key])}</div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                color: "primary",
                loading: unref(loadingImports)[importJob.key],
                label: "Importuj XML"
              }, null, _parent2, _scopeId));
              _push2(`</div></form>`);
            } else {
              return [
                createVNode("form", {
                  class: "space-y-4",
                  onSubmit: withModifiers(($event) => submitImport(importJob.key), ["prevent"])
                }, [
                  createVNode(_component_UFormField, {
                    label: "Plik XML",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("input", {
                        type: "file",
                        accept: ".xml,text/xml,application/xml",
                        class: "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950",
                        onChange: ($event) => onFileSelected(importJob.key, $event)
                      }, null, 40, ["onChange"])
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(_component_UFormField, { label: "Podgląd treści" }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(importForms)[importJob.key],
                        "onUpdate:modelValue": ($event) => unref(importForms)[importJob.key] = $event,
                        data: 8
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 2
                  }, 1024),
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("div", { class: "min-h-[20px] text-sm text-gray-500" }, toDisplayString(unref(importResults)[importJob.key]), 1),
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "primary",
                      loading: unref(loadingImports)[importJob.key],
                      label: "Importuj XML"
                    }, null, 8, ["loading"])
                  ])
                ], 40, ["onSubmit"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="grid lg:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, { class: "lg:col-span-1" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Domyślny obszar</h2><p class="text-sm text-gray-500"${_scopeId}>Prefill dla formularzy klienta i urządzeń.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Domyślny obszar"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Prefill dla formularzy klienta i urządzeń.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 text-sm"${_scopeId}><div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(defaultArea)?.state?.name || "Brak województwa domyślnego")}</div><div class="text-gray-500"${_scopeId}>Województwo</div></div><div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(defaultArea)?.district?.name || "Brak powiatu domyślnego")}</div><div class="text-gray-500"${_scopeId}>Powiat</div></div><div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(defaultArea)?.commune?.name || "Brak gminy domyślnej")}</div><div class="text-gray-500"${_scopeId}>Gmina</div></div><div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(defaultArea)?.city?.name || "Brak miasta domyślnego")}</div><div class="text-gray-500"${_scopeId}>Miasto</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3 text-sm" }, [
                createVNode("div", { class: "rounded-lg border border-gray-200 p-4 dark:border-gray-800" }, [
                  createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(defaultArea)?.state?.name || "Brak województwa domyślnego"), 1),
                  createVNode("div", { class: "text-gray-500" }, "Województwo")
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 p-4 dark:border-gray-800" }, [
                  createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(defaultArea)?.district?.name || "Brak powiatu domyślnego"), 1),
                  createVNode("div", { class: "text-gray-500" }, "Powiat")
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 p-4 dark:border-gray-800" }, [
                  createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(defaultArea)?.commune?.name || "Brak gminy domyślnej"), 1),
                  createVNode("div", { class: "text-gray-500" }, "Gmina")
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 p-4 dark:border-gray-800" }, [
                  createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(defaultArea)?.city?.name || "Brak miasta domyślnego"), 1),
                  createVNode("div", { class: "text-gray-500" }, "Miasto")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "lg:col-span-2" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Rejestr gmin</h2><p class="text-sm text-gray-500"${_scopeId}>Managed/default na poziomie gminy steruje domyślnym obszarem systemu.</p></div>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(communeSearch),
              "onUpdate:modelValue": ($event) => isRef(communeSearch) ? communeSearch.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Szukaj gminy...",
              class: "w-full lg:w-80"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Rejestr gmin"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Managed/default na poziomie gminy steruje domyślnym obszarem systemu.")
                ]),
                createVNode(_component_UInput, {
                  modelValue: unref(communeSearch),
                  "onUpdate:modelValue": ($event) => isRef(communeSearch) ? communeSearch.value = $event : null,
                  icon: "i-heroicons-magnifying-glass-20-solid",
                  placeholder: "Szukaj gminy...",
                  class: "w-full lg:w-80"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredCommunes),
              columns: communeColumns,
              loading: unref(pendingCommunes)
            }, {
              "district-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.district?.name || "Brak powiatu")} `);
                  if (row.district?.state?.name) {
                    _push3(`<span${_scopeId2}>· ${ssrInterpolate(row.district.state.name)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(toDisplayString(row.district?.name || "Brak powiatu") + " ", 1),
                      row.district?.state?.name ? (openBlock(), createBlock("span", { key: 0 }, "· " + toDisplayString(row.district.state.name), 1)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "flags-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.isManaged ? "emerald" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.isManaged ? "managed" : "unmanaged")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.isDefault ? "primary" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.isDefault ? "default" : "standard")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_UBadge, {
                        color: row.isManaged ? "emerald" : "gray",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode(_component_UBadge, {
                        color: row.isDefault ? "primary" : "gray",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                    label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                    onClick: ($event) => toggleManagedCommune(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "ghost",
                    icon: "i-heroicons-star",
                    label: "Ustaw domyślną",
                    disabled: row.isDefault,
                    onClick: ($event) => setDefaultCommune(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "ghost",
                        icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                        label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                        onClick: ($event) => toggleManagedCommune(row)
                      }, null, 8, ["icon", "label", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "ghost",
                        icon: "i-heroicons-star",
                        label: "Ustaw domyślną",
                        disabled: row.isDefault,
                        onClick: ($event) => setDefaultCommune(row)
                      }, null, 8, ["disabled", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredCommunes),
                columns: communeColumns,
                loading: unref(pendingCommunes)
              }, {
                "district-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                    createTextVNode(toDisplayString(row.district?.name || "Brak powiatu") + " ", 1),
                    row.district?.state?.name ? (openBlock(), createBlock("span", { key: 0 }, "· " + toDisplayString(row.district.state.name), 1)) : createCommentVNode("", true)
                  ])
                ]),
                "flags-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UBadge, {
                      color: row.isManaged ? "emerald" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode(_component_UBadge, {
                      color: row.isDefault ? "primary" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                      label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                      onClick: ($event) => toggleManagedCommune(row)
                    }, null, 8, ["icon", "label", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "ghost",
                      icon: "i-heroicons-star",
                      label: "Ustaw domyślną",
                      disabled: row.isDefault,
                      onClick: ($event) => setDefaultCommune(row)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["data", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Rejestr miast</h2><p class="text-sm text-gray-500"${_scopeId}>Lokalny słownik miast i flagi zarządzające adresem domyślnym.</p></div><div class="flex flex-col md:flex-row gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(search),
              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Szukaj miasta po nazwie lub TERYT...",
              class: "w-full md:w-80"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(managedFilter),
              "onUpdate:modelValue": ($event) => isRef(managedFilter) ? managedFilter.value = $event : null,
              items: managedOptions,
              "label-key": "label",
              class: "w-full md:w-56"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Rejestr miast"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Lokalny słownik miast i flagi zarządzające adresem domyślnym.")
                ]),
                createVNode("div", { class: "flex flex-col md:flex-row gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(search),
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    icon: "i-heroicons-magnifying-glass-20-solid",
                    placeholder: "Szukaj miasta po nazwie lub TERYT...",
                    class: "w-full md:w-80"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelect, {
                    modelValue: unref(managedFilter),
                    "onUpdate:modelValue": ($event) => isRef(managedFilter) ? managedFilter.value = $event : null,
                    items: managedOptions,
                    "label-key": "label",
                    class: "w-full md:w-56"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredCities),
              columns: cityColumns,
              loading: unref(pendingCities)
            }, {
              "district-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.district?.name || "Brak powiatu")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.district?.name || "Brak powiatu"), 1)
                  ];
                }
              }),
              "commune-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.commune?.name || "Brak gminy")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.commune?.name || "Brak gminy"), 1)
                  ];
                }
              }),
              "flags-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.isManaged ? "emerald" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.isManaged ? "managed" : "unmanaged")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.isDefault ? "primary" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.isDefault ? "default" : "standard")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_UBadge, {
                        color: row.isManaged ? "emerald" : "gray",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode(_component_UBadge, {
                        color: row.isDefault ? "primary" : "gray",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                    label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                    onClick: ($event) => toggleManagedCity(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "ghost",
                    icon: "i-heroicons-star",
                    label: "Ustaw domyślne",
                    disabled: row.isDefault,
                    onClick: ($event) => setDefaultCity(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "yellow",
                    variant: "ghost",
                    icon: "i-heroicons-arrow-path",
                    label: "Synchronizuj",
                    onClick: ($event) => scheduleSync(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "ghost",
                        icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                        label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                        onClick: ($event) => toggleManagedCity(row)
                      }, null, 8, ["icon", "label", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "ghost",
                        icon: "i-heroicons-star",
                        label: "Ustaw domyślne",
                        disabled: row.isDefault,
                        onClick: ($event) => setDefaultCity(row)
                      }, null, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "yellow",
                        variant: "ghost",
                        icon: "i-heroicons-arrow-path",
                        label: "Synchronizuj",
                        onClick: ($event) => scheduleSync(row)
                      }, null, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredCities),
                columns: cityColumns,
                loading: unref(pendingCities)
              }, {
                "district-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.district?.name || "Brak powiatu"), 1)
                ]),
                "commune-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.commune?.name || "Brak gminy"), 1)
                ]),
                "flags-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UBadge, {
                      color: row.isManaged ? "emerald" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.isManaged ? "managed" : "unmanaged"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode(_component_UBadge, {
                      color: row.isDefault ? "primary" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.isDefault ? "default" : "standard"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: row.isManaged ? "i-heroicons-minus-circle" : "i-heroicons-check-circle",
                      label: row.isManaged ? "Zdejmij managed" : "Oznacz managed",
                      onClick: ($event) => toggleManagedCity(row)
                    }, null, 8, ["icon", "label", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "ghost",
                      icon: "i-heroicons-star",
                      label: "Ustaw domyślne",
                      disabled: row.isDefault,
                      onClick: ($event) => setDefaultCity(row)
                    }, null, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "yellow",
                      variant: "ghost",
                      icon: "i-heroicons-arrow-path",
                      label: "Synchronizuj",
                      onClick: ($event) => scheduleSync(row)
                    }, null, 8, ["onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["data", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid lg:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Szybkie wyszukiwanie TERYT</h2><p class="text-sm text-gray-500"${_scopeId}>Wyniki z lokalnego słownika do weryfikacji importu i podpowiedzi.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Szybkie wyszukiwanie TERYT"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Wyniki z lokalnego słownika do weryfikacji importu i podpowiedzi.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(search),
              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
              icon: "i-heroicons-map-pin",
              placeholder: "np. Ożarów"
            }, null, _parent2, _scopeId));
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(addressSearchRows), (city) => {
              _push2(`<div class="rounded-lg border border-gray-200 p-3 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(city.name)}</div><div class="text-sm text-gray-500"${_scopeId}>TERYT: ${ssrInterpolate(city.terytCode || "brak")}</div></div>`);
            });
            _push2(`<!--]-->`);
            if (unref(search).length >= 2 && !unref(addressSearchRows).length) {
              _push2(`<p class="text-sm text-gray-500"${_scopeId}>Brak wyników.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(search),
                  "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                  icon: "i-heroicons-map-pin",
                  placeholder: "np. Ożarów"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(addressSearchRows), (city) => {
                    return openBlock(), createBlock("div", {
                      key: city.id,
                      class: "rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                    }, [
                      createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(city.name), 1),
                      createVNode("div", { class: "text-sm text-gray-500" }, "TERYT: " + toDisplayString(city.terytCode || "brak"), 1)
                    ]);
                  }), 128)),
                  unref(search).length >= 2 && !unref(addressSearchRows).length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-gray-500"
                  }, "Brak wyników.")) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Podgląd ulic</h2><p class="text-sm text-gray-500"${_scopeId}>Ulice dla wybranego miasta bez odrywania się od rejestru.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Podgląd ulic"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Ulice dla wybranego miasta bez odrywania się od rejestru.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(selectedCity)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(selectedCity).name)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(selectedCity).commune?.name || "Brak gminy")} · ${ssrInterpolate(unref(selectedCity).district?.name || "Brak powiatu")}</div></div><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(streetRows), (street) => {
                _push2(`<div class="rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"${_scopeId}>${ssrInterpolate(street.name)}</div>`);
              });
              _push2(`<!--]--></div>`);
              if (!unref(streetRows).length) {
                _push2(`<p class="text-sm text-gray-500"${_scopeId}>Brak ulic dla wybranego miasta.</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<p class="text-sm text-gray-500"${_scopeId}>Wybierz miasto z tabeli, aby zobaczyć ulice.</p>`);
            }
          } else {
            return [
              unref(selectedCity) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "rounded-lg border border-gray-200 p-4 dark:border-gray-800" }, [
                  createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(selectedCity).name), 1),
                  createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(unref(selectedCity).commune?.name || "Brak gminy") + " · " + toDisplayString(unref(selectedCity).district?.name || "Brak powiatu"), 1)
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(streetRows), (street) => {
                    return openBlock(), createBlock("div", {
                      key: street.id,
                      class: "rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"
                    }, toDisplayString(street.name), 1);
                  }), 128))
                ]),
                !unref(streetRows).length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-gray-500"
                }, "Brak ulic dla wybranego miasta.")) : createCommentVNode("", true)
              ])) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-gray-500"
              }, "Wybierz miasto z tabeli, aby zobaczyć ulice."))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teryt.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=teryt-CKOxrOZK.mjs.map
