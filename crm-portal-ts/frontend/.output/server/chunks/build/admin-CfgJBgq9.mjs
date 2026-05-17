import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$4 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$5 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$6 } from './Textarea-DX4AdTCC.mjs';
import { ref, reactive, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, isRef, withModifiers, useSSRContext } from 'vue';
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
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-hoYYm4l-.mjs';
import './Label-BCnUNGB-.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const backupColumns = [
      { accessorKey: "filename", header: "Plik" },
      { accessorKey: "createdAt", header: "Utworzono" },
      { accessorKey: "sizeBytes", header: "Rozmiar" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const reloadColumns = [
      { accessorKey: "createdAt", header: "Data" },
      { accessorKey: "note", header: "Notatka" }
    ];
    const auditColumns = [
      { accessorKey: "timestamp", header: "Data" },
      { accessorKey: "action", header: "Akcja" },
      { accessorKey: "resourceType", header: "Zasób" },
      { accessorKey: "details", header: "Szczegóły" }
    ];
    const auditSearch = ref("");
    const isCreatingBackup = ref(false);
    const isCreatingReload = ref(false);
    const isReloadModalOpen = ref(false);
    const reloadForm = reactive({
      note: ""
    });
    const { data: info, refresh: refreshInfo } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/admin/info",
      "$PN4HdgRcwq"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: backups, pending: pendingBackups, refresh: refreshBackups } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/admin/backups",
      "$4vViW7CfhA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: reloadLogs, pending: pendingReloadLogs, refresh: refreshReloadLogs } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/admin/reload",
      "$gnhxzvo0CN"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: auditLogs, pending: pendingAuditLogs, refresh: refreshAuditLogs } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/admin/audit-logs",
      "$8Dg2aeyNFA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredAuditLogs = computed(() => {
      const rows = auditLogs.value || [];
      const query = auditSearch.value.trim().toLowerCase();
      if (!query) {
        return rows;
      }
      return rows.filter(
        (row) => [row.action, row.resourceType || "", row.details || ""].join(" ").toLowerCase().includes(query)
      );
    });
    const formatDate = (value) => {
      if (!value) {
        return "Brak daty";
      }
      return new Date(value).toLocaleString("pl-PL");
    };
    const formatBytes = (bytes) => {
      if (!bytes) {
        return "0 B";
      }
      if (bytes < 1024) {
        return `${bytes} B`;
      }
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    const refreshAll = async () => {
      await Promise.all([
        refreshInfo(),
        refreshBackups(),
        refreshReloadLogs(),
        refreshAuditLogs()
      ]);
    };
    const createBackup = async () => {
      isCreatingBackup.value = true;
      try {
        await $fetch("/api/v1/admin/backups/create", { method: "POST" });
        await Promise.all([refreshBackups(), refreshAuditLogs()]);
      } finally {
        isCreatingBackup.value = false;
      }
    };
    const downloadBackup = (row) => {
      (void 0).open(row.downloadUrl, "_blank", "noopener");
    };
    const removeBackup = async (row) => {
      if (!confirm(`Usunąć backup "${row.filename}"?`)) {
        return;
      }
      await $fetch(`/api/v1/admin/backups/${encodeURIComponent(row.filename)}`, { method: "DELETE" });
      await Promise.all([refreshBackups(), refreshAuditLogs()]);
    };
    const createReload = async () => {
      isCreatingReload.value = true;
      try {
        await $fetch("/api/v1/admin/reload", {
          method: "POST",
          body: { note: reloadForm.note || null }
        });
        reloadForm.note = "";
        isReloadModalOpen.value = false;
        await Promise.all([refreshReloadLogs(), refreshAuditLogs()]);
      } finally {
        isCreatingReload.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UTable = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UModal = _sfc_main$4;
      const _component_UFormField = _sfc_main$5;
      const _component_UTextarea = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administracja</h1><p class="text-sm text-gray-500">Info runtime, backupy, reload oraz log audytowy dla aktywnego baseline TS/Nuxt</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(`</div><div class="grid md:grid-cols-4 gap-4"><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Engine</div><div class="text-xl font-bold">${ssrInterpolate(unref(info)?.engine || "n/a")}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Platforma</div><div class="text-xl font-bold">${ssrInterpolate(unref(info)?.platform || "n/a")}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Baza</div><div class="text-xl font-bold">${ssrInterpolate(unref(info)?.dbKind || "n/a")}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"><div class="text-sm text-gray-500">Plik DB</div><div class="text-base font-semibold break-all">${ssrInterpolate(unref(info)?.databasePath || "n/a")}</div></div></div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Backupy</h2><p class="text-sm text-gray-500"${_scopeId}>Tworzenie, pobieranie i usuwanie kopii SQLite</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-heroicons-circle-stack",
              label: "Utwórz backup",
              loading: unref(isCreatingBackup),
              onClick: createBackup
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Backupy"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Tworzenie, pobieranie i usuwanie kopii SQLite")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-heroicons-circle-stack",
                  label: "Utwórz backup",
                  loading: unref(isCreatingBackup),
                  onClick: createBackup
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(backups) || [],
              columns: backupColumns,
              loading: unref(pendingBackups)
            }, {
              "createdAt-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(formatDate(row.createdAt))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
                  ];
                }
              }),
              "sizeBytes-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(formatBytes(row.sizeBytes))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatBytes(row.sizeBytes)), 1)
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "ghost",
                    icon: "i-heroicons-arrow-down-tray",
                    onClick: ($event) => downloadBackup(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeBackup(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "ghost",
                        icon: "i-heroicons-arrow-down-tray",
                        onClick: ($event) => downloadBackup(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeBackup(row)
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
                data: unref(backups) || [],
                columns: backupColumns,
                loading: unref(pendingBackups)
              }, {
                "createdAt-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
                ]),
                "sizeBytes-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatBytes(row.sizeBytes)), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "ghost",
                      icon: "i-heroicons-arrow-down-tray",
                      onClick: ($event) => downloadBackup(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeBackup(row)
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
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Reload konfiguracji</h2><p class="text-sm text-gray-500"${_scopeId}>Log kontrolnych przeładowań i notatek operatorskich</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-heroicons-bolt",
              label: "Dodaj reload",
              loading: unref(isCreatingReload),
              onClick: ($event) => isReloadModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Reload konfiguracji"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Log kontrolnych przeładowań i notatek operatorskich")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-heroicons-bolt",
                  label: "Dodaj reload",
                  loading: unref(isCreatingReload),
                  onClick: ($event) => isReloadModalOpen.value = true
                }, null, 8, ["loading", "onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(reloadLogs) || [],
              columns: reloadColumns,
              loading: unref(pendingReloadLogs)
            }, {
              "createdAt-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(formatDate(row.createdAt))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
                  ];
                }
              }),
              "note-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.note || "Brak notatki")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.note || "Brak notatki"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(reloadLogs) || [],
                columns: reloadColumns,
                loading: unref(pendingReloadLogs)
              }, {
                "createdAt-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
                ]),
                "note-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.note || "Brak notatki"), 1)
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
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Dziennik audytowy</h2><p class="text-sm text-gray-500"${_scopeId}>Ostatnie operacje administracyjne i destrukcyjne</p></div>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(auditSearch),
              "onUpdate:modelValue": ($event) => isRef(auditSearch) ? auditSearch.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Filtruj po akcji lub szczegółach...",
              class: "w-full md:w-80"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Dziennik audytowy"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Ostatnie operacje administracyjne i destrukcyjne")
                ]),
                createVNode(_component_UInput, {
                  modelValue: unref(auditSearch),
                  "onUpdate:modelValue": ($event) => isRef(auditSearch) ? auditSearch.value = $event : null,
                  icon: "i-heroicons-magnifying-glass-20-solid",
                  placeholder: "Filtruj po akcji lub szczegółach...",
                  class: "w-full md:w-80"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredAuditLogs),
              columns: auditColumns,
              loading: unref(pendingAuditLogs)
            }, {
              "timestamp-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(formatDate(row.timestamp))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.timestamp)), 1)
                  ];
                }
              }),
              "details-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.details || "Brak szczegółów")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.details || "Brak szczegółów"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredAuditLogs),
                columns: auditColumns,
                loading: unref(pendingAuditLogs)
              }, {
                "timestamp-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.timestamp)), 1)
                ]),
                "details-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.details || "Brak szczegółów"), 1)
                ]),
                _: 1
              }, 8, ["data", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isReloadModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isReloadModalOpen) ? isReloadModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>Dodaj wpis reload</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis reload")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Notatka" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(reloadForm).note,
                          "onUpdate:modelValue": ($event) => unref(reloadForm).note = $event,
                          data: 4,
                          placeholder: "np. ręczne przeładowanie po zmianie konfiguracji"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(reloadForm).note,
                            "onUpdate:modelValue": ($event) => unref(reloadForm).note = $event,
                            data: 4,
                            placeholder: "np. ręczne przeładowanie po zmianie konfiguracji"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    label: "Anuluj",
                    onClick: ($event) => isReloadModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isCreatingReload),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(createReload, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, { label: "Notatka" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(reloadForm).note,
                            "onUpdate:modelValue": ($event) => unref(reloadForm).note = $event,
                            data: 4,
                            placeholder: "np. ręczne przeładowanie po zmianie konfiguracji"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isReloadModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isCreatingReload),
                          label: "Zapisz"
                        }, null, 8, ["loading"])
                      ])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis reload")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(createReload, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, { label: "Notatka" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(reloadForm).note,
                          "onUpdate:modelValue": ($event) => unref(reloadForm).note = $event,
                          data: 4,
                          placeholder: "np. ręczne przeładowanie po zmianie konfiguracji"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isReloadModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isCreatingReload),
                        label: "Zapisz"
                      }, null, 8, ["loading"])
                    ])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-CfgJBgq9.mjs.map
