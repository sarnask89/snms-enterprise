import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$4 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$5 } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$6 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$7 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$9 } from './Textarea-DX4AdTCC.mjs';
import { ref, reactive, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, isRef, withModifiers, useSSRContext } from 'vue';
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
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-hoYYm4l-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';
import './Label-BCnUNGB-.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "documents",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const columns = [
      { accessorKey: "title", header: "Tytuł" },
      { accessorKey: "customer", header: "Klient" },
      { accessorKey: "docType", header: "Typ" },
      { accessorKey: "file", header: "Plik" },
      { accessorKey: "createdAt", header: "Dodano" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const docTypeOptions = [
      { label: "Contract", value: "contract" },
      { label: "Invoice", value: "invoice" },
      { label: "Protocol", value: "protocol" },
      { label: "Attachment", value: "attachment" },
      { label: "Other", value: "other" }
    ];
    const search = ref("");
    const customerFilter = ref(null);
    const isModalOpen = ref(false);
    const isSaving = ref(false);
    const fileInputKey = ref(0);
    const selectedFileName = ref("");
    const selectedMimeType = ref("");
    const selectedFileBase64 = ref("");
    const form = reactive({
      title: "",
      docType: "contract",
      customerId: null,
      notes: ""
    });
    const { data: documents, pending: pendingDocuments, refresh: refreshDocuments } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/documents",
      "$h9cN-ksoen"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 200 }
      },
      "$QmGbiZSSCa"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const customerOptionsWithEmpty = computed(() => [
      { label: "Wszyscy / bez klienta", value: null },
      ...(customers.value || []).map((customer) => ({
        label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
        value: customer.id
      }))
    ]);
    const filteredDocuments = computed(() => {
      const rows = documents.value || [];
      const query = search.value.trim().toLowerCase();
      return rows.filter((row) => {
        const matchesCustomer = !customerFilter.value || row.customerId === customerFilter.value;
        if (!matchesCustomer) {
          return false;
        }
        if (!query) {
          return true;
        }
        return [
          row.title,
          row.docType,
          row.notes || "",
          row.originalFilename || ""
        ].join(" ").toLowerCase().includes(query);
      });
    });
    const resetForm = () => {
      Object.assign(form, {
        title: "",
        docType: "contract",
        customerId: null,
        notes: ""
      });
      selectedFileName.value = "";
      selectedMimeType.value = "";
      selectedFileBase64.value = "";
      fileInputKey.value += 1;
    };
    const openCreateModal = () => {
      resetForm();
      isModalOpen.value = true;
    };
    const onFileChange = async (event) => {
      const file = event.target?.files?.[0];
      if (!file) {
        selectedFileName.value = "";
        selectedMimeType.value = "";
        selectedFileBase64.value = "";
        return;
      }
      selectedFileName.value = file.name;
      selectedMimeType.value = file.type || "application/octet-stream";
      selectedFileBase64.value = await readFileAsBase64(file);
    };
    const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = () => reject(reader.error || new Error("Nie udało się odczytać pliku"));
      reader.readAsDataURL(file);
    });
    const formatDate = (value) => {
      if (!value) {
        return "Brak daty";
      }
      return new Date(value).toLocaleString("pl-PL");
    };
    const formatFileSize = (bytes) => {
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
    const saveDocument = async () => {
      if (!selectedFileBase64.value || !selectedFileName.value) {
        return;
      }
      isSaving.value = true;
      try {
        await $fetch("/api/v1/documents", {
          method: "POST",
          body: {
            title: form.title,
            docType: form.docType,
            customerId: form.customerId,
            notes: form.notes || null,
            originalFilename: selectedFileName.value,
            mimeType: selectedMimeType.value || null,
            contentBase64: selectedFileBase64.value
          }
        });
        isModalOpen.value = false;
        resetForm();
        await refreshDocuments();
      } finally {
        isSaving.value = false;
      }
    };
    const downloadDocument = (row) => {
      (void 0).open(row.downloadUrl, "_blank", "noopener");
    };
    const removeDocument = async (row) => {
      if (!confirm(`Usunąć dokument "${row.title}"?`)) {
        return;
      }
      await $fetch(`/api/v1/documents/${row.id}`, { method: "DELETE" });
      await refreshDocuments();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$6;
      const _component_UFormField = _sfc_main$7;
      const _component_UTextarea = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dokumenty</h1><p class="text-sm text-gray-500">Upload, pobieranie i usuwanie dokumentów w aktywnym baseline TS/Nuxt</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-plus",
        label: "Dodaj dokument",
        onClick: openCreateModal
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between"${_scopeId}><div class="flex flex-1 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(search),
              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Szukaj po tytule, typie, notatkach lub nazwie pliku...",
              class: "flex-1"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(customerFilter),
              "onUpdate:modelValue": ($event) => isRef(customerFilter) ? customerFilter.value = $event : null,
              items: unref(customerOptionsWithEmpty),
              "label-key": "label",
              class: "w-full md:w-72"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              icon: "i-heroicons-arrow-path",
              label: "Odśwież",
              onClick: unref(refreshDocuments)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:flex-row gap-4 md:items-center md:justify-between" }, [
                createVNode("div", { class: "flex flex-1 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(search),
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    icon: "i-heroicons-magnifying-glass-20-solid",
                    placeholder: "Szukaj po tytule, typie, notatkach lub nazwie pliku...",
                    class: "flex-1"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelect, {
                    modelValue: unref(customerFilter),
                    "onUpdate:modelValue": ($event) => isRef(customerFilter) ? customerFilter.value = $event : null,
                    items: unref(customerOptionsWithEmpty),
                    "label-key": "label",
                    class: "w-full md:w-72"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                ]),
                createVNode(_component_UButton, {
                  color: "gray",
                  variant: "ghost",
                  icon: "i-heroicons-arrow-path",
                  label: "Odśwież",
                  onClick: unref(refreshDocuments)
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredDocuments),
              columns,
              loading: unref(pendingDocuments)
            }, {
              "customer-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Dokument ogólny")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Dokument ogólny"), 1)
                  ];
                }
              }),
              "docType-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.docType)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.docType), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: "primary",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.docType), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              "file-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}><div class="font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(row.originalFilename || "Brak nazwy pliku")}</div><div${_scopeId2}>${ssrInterpolate(formatFileSize(row.fileSize))}`);
                  if (row.mimeType) {
                    _push3(`<span${_scopeId2}> · ${ssrInterpolate(row.mimeType)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(row.originalFilename || "Brak nazwy pliku"), 1),
                      createVNode("div", null, [
                        createTextVNode(toDisplayString(formatFileSize(row.fileSize)), 1),
                        row.mimeType ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(row.mimeType), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ];
                }
              }),
              "createdAt-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(formatDate(row.createdAt))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
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
                    onClick: ($event) => downloadDocument(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeDocument(row)
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
                        onClick: ($event) => downloadDocument(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeDocument(row)
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
                data: unref(filteredDocuments),
                columns,
                loading: unref(pendingDocuments)
              }, {
                "customer-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Dokument ogólny"), 1)
                ]),
                "docType-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.docType), 1)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                "file-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                    createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(row.originalFilename || "Brak nazwy pliku"), 1),
                    createVNode("div", null, [
                      createTextVNode(toDisplayString(formatFileSize(row.fileSize)), 1),
                      row.mimeType ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(row.mimeType), 1)) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                "createdAt-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(formatDate(row.createdAt)), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "ghost",
                      icon: "i-heroicons-arrow-down-tray",
                      onClick: ($event) => downloadDocument(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeDocument(row)
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isModalOpen) ? isModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>Dodaj dokument</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, "Dodaj dokument")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Tytuł",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).title,
                          "onUpdate:modelValue": ($event) => unref(form).title = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).title,
                            "onUpdate:modelValue": ($event) => unref(form).title = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Typ dokumentu",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).docType,
                          "onUpdate:modelValue": ($event) => unref(form).docType = $event,
                          items: docTypeOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).docType,
                            "onUpdate:modelValue": ($event) => unref(form).docType = $event,
                            items: docTypeOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).customerId,
                          "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                          items: unref(customerOptionsWithEmpty),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).customerId,
                            "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Plik",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input type="file" class="block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"${_scopeId3}>`);
                      } else {
                        return [
                          (openBlock(), createBlock("input", {
                            key: unref(fileInputKey),
                            type: "file",
                            class: "block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900",
                            onChange: onFileChange
                          }, null, 32))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Notatki" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(form).notes,
                          "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                          data: 4
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).notes,
                            "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                            data: 4
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(selectedFileName)) {
                    _push3(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-600 dark:text-gray-300"${_scopeId2}> Wybrany plik: <span class="font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(unref(selectedFileName))}</span>`);
                    if (unref(selectedMimeType)) {
                      _push3(`<span${_scopeId2}> · ${ssrInterpolate(unref(selectedMimeType))}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    label: "Anuluj",
                    onClick: ($event) => isModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSaving),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveDocument, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Tytuł",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).title,
                              "onUpdate:modelValue": ($event) => unref(form).title = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Typ dokumentu",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).docType,
                              "onUpdate:modelValue": ($event) => unref(form).docType = $event,
                              items: docTypeOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Klient" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).customerId,
                              "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                              items: unref(customerOptionsWithEmpty),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Plik",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock("input", {
                              key: unref(fileInputKey),
                              type: "file",
                              class: "block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900",
                              onChange: onFileChange
                            }, null, 32))
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, { label: "Notatki" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).notes,
                            "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                            data: 4
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      unref(selectedFileName) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-600 dark:text-gray-300"
                      }, [
                        createTextVNode(" Wybrany plik: "),
                        createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(selectedFileName)), 1),
                        unref(selectedMimeType) ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(unref(selectedMimeType)), 1)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSaving),
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
                  createVNode("h3", { class: "text-lg font-bold" }, "Dodaj dokument")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveDocument, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Tytuł",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).title,
                            "onUpdate:modelValue": ($event) => unref(form).title = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Typ dokumentu",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).docType,
                            "onUpdate:modelValue": ($event) => unref(form).docType = $event,
                            items: docTypeOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).customerId,
                            "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Plik",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("input", {
                            key: unref(fileInputKey),
                            type: "file",
                            class: "block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900",
                            onChange: onFileChange
                          }, null, 32))
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, { label: "Notatki" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(form).notes,
                          "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                          data: 4
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    unref(selectedFileName) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-600 dark:text-gray-300"
                    }, [
                      createTextVNode(" Wybrany plik: "),
                      createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(selectedFileName)), 1),
                      unref(selectedMimeType) ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(unref(selectedMimeType)), 1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSaving),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/documents.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=documents-DgWVrue2.mjs.map
