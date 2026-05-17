import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$4 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$5 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$6 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$7 } from './Textarea-DX4AdTCC.mjs';
import { ref, reactive, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, isRef, withModifiers, openBlock, createBlock, Fragment, renderList, withDirectives, vModelCheckbox, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "groups",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const search = ref("");
    const isModalOpen = ref(false);
    const isSaving = ref(false);
    const columns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "description", header: "Opis" },
      { accessorKey: "customerCount", header: "Liczba klientów" },
      { accessorKey: "members", header: "Członkowie" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const form = reactive({
      id: null,
      name: "",
      description: "",
      memberIds: []
    });
    const { data: groups, pending: pendingGroups, refresh: refreshGroups } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customer-groups",
      "$47GpXQpW5p"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers, refresh: refreshCustomers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 200 }
      },
      "$ALZzWKpTEz"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const customerOptions = computed(() => customers.value || []);
    const filteredGroups = computed(() => {
      const rows = groups.value || [];
      const query = search.value.trim().toLowerCase();
      if (!query) {
        return rows;
      }
      return rows.filter(
        (group) => group.name.toLowerCase().includes(query) || (group.description || "").toLowerCase().includes(query)
      );
    });
    const resetForm = () => {
      Object.assign(form, {
        id: null,
        name: "",
        description: "",
        memberIds: []
      });
    };
    const openCreateModal = () => {
      resetForm();
      isModalOpen.value = true;
    };
    const openEditModal = async (row) => {
      const group = await $fetch(`/api/v1/customer-groups/${row.id}`);
      Object.assign(form, {
        id: group.id,
        name: group.name,
        description: group.description || "",
        memberIds: [...group.memberIds || []]
      });
      isModalOpen.value = true;
    };
    const memberPreview = (row) => {
      if (!row.customers?.length) {
        return "Brak przypisanych klientów";
      }
      return row.customers.slice(0, 3).map((customer) => `${customer.firstName} ${customer.lastName}`).join(", ");
    };
    const saveGroup = async () => {
      isSaving.value = true;
      try {
        const payload = {
          name: form.name,
          description: form.description || null,
          memberIds: [...form.memberIds]
        };
        if (form.id) {
          await $fetch(`/api/v1/customer-groups/${form.id}`, {
            method: "PUT",
            body: payload
          });
        } else {
          await $fetch("/api/v1/customer-groups", {
            method: "POST",
            body: payload
          });
        }
        isModalOpen.value = false;
        resetForm();
        await Promise.all([refreshGroups(), refreshCustomers()]);
      } catch (error) {
        console.error("Failed to save customer group", error);
      } finally {
        isSaving.value = false;
      }
    };
    const removeGroup = async (row) => {
      if (!confirm(`Czy na pewno chcesz usunąć grupę "${row.name}"?`)) {
        return;
      }
      await $fetch(`/api/v1/customer-groups/${row.id}`, { method: "DELETE" });
      await refreshGroups();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$4;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_UTextarea = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-6xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Grupy klientów</h1><p class="text-sm text-gray-500">Pierwszy moduł parity po stronie TS/Nuxt: CRUD grup i przypisania członków</p></div><div class="flex gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-left",
        color: "gray",
        variant: "ghost",
        to: "/customers",
        label: "Lista klientów"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-plus",
        color: "primary",
        label: "Nowa grupa",
        onClick: openCreateModal
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(search),
              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Filtruj po nazwie lub opisie grupy...",
              class: "flex-1"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(search),
                  "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                  icon: "i-heroicons-magnifying-glass-20-solid",
                  placeholder: "Filtruj po nazwie lub opisie grupy...",
                  class: "flex-1"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredGroups),
              columns,
              loading: unref(pendingGroups)
            }, {
              "customerCount-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.customerCount)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.customerCount), 1)
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
                        createTextVNode(toDisplayString(row.customerCount), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              "members-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(memberPreview(row))}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(memberPreview(row)), 1)
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    icon: "i-heroicons-pencil-square",
                    color: "gray",
                    variant: "ghost",
                    size: "xs",
                    onClick: ($event) => openEditModal(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    icon: "i-heroicons-trash",
                    color: "red",
                    variant: "ghost",
                    size: "xs",
                    onClick: ($event) => removeGroup(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UButton, {
                        icon: "i-heroicons-pencil-square",
                        color: "gray",
                        variant: "ghost",
                        size: "xs",
                        onClick: ($event) => openEditModal(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        icon: "i-heroicons-trash",
                        color: "red",
                        variant: "ghost",
                        size: "xs",
                        onClick: ($event) => removeGroup(row)
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
                data: unref(filteredGroups),
                columns,
                loading: unref(pendingGroups)
              }, {
                "customerCount-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.customerCount), 1)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                "members-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(memberPreview(row)), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      icon: "i-heroicons-pencil-square",
                      color: "gray",
                      variant: "ghost",
                      size: "xs",
                      onClick: ($event) => openEditModal(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      icon: "i-heroicons-trash",
                      color: "red",
                      variant: "ghost",
                      size: "xs",
                      onClick: ($event) => removeGroup(row)
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
                  _push3(`<h3 class="font-bold text-lg"${_scopeId2}>${ssrInterpolate(unref(form).id ? "Edytuj grupę klientów" : "Dodaj grupę klientów")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "font-bold text-lg" }, toDisplayString(unref(form).id ? "Edytuj grupę klientów" : "Dodaj grupę klientów"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Nazwa grupy",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Opis" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          data: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId2}>Członkowie grupy</div><div class="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(customerOptions), (customer) => {
                    _push3(`<label class="flex items-center gap-3 text-sm"${_scopeId2}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).memberIds) ? ssrLooseContain(unref(form).memberIds, customer.id) : unref(form).memberIds) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", customer.id)} class="rounded border-gray-300"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(customer.customerCode)} · ${ssrInterpolate(customer.firstName)} ${ssrInterpolate(customer.lastName)}</span></label>`);
                  });
                  _push3(`<!--]-->`);
                  if (!unref(customerOptions).length) {
                    _push3(`<p class="text-sm text-gray-500"${_scopeId2}>Brak klientów do przypisania.</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
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
                      onSubmit: withModifiers(saveGroup, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, {
                        label: "Nazwa grupy",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Opis" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", null, [
                        createVNode("div", { class: "mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" }, "Członkowie grupy"),
                        createVNode("div", { class: "max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(customerOptions), (customer) => {
                            return openBlock(), createBlock("label", {
                              key: customer.id,
                              class: "flex items-center gap-3 text-sm"
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).memberIds = $event,
                                type: "checkbox",
                                value: customer.id,
                                class: "rounded border-gray-300"
                              }, null, 8, ["onUpdate:modelValue", "value"]), [
                                [vModelCheckbox, unref(form).memberIds]
                              ]),
                              createVNode("span", null, toDisplayString(customer.customerCode) + " · " + toDisplayString(customer.firstName) + " " + toDisplayString(customer.lastName), 1)
                            ]);
                          }), 128)),
                          !unref(customerOptions).length ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-gray-500"
                          }, "Brak klientów do przypisania.")) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
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
                  createVNode("h3", { class: "font-bold text-lg" }, toDisplayString(unref(form).id ? "Edytuj grupę klientów" : "Dodaj grupę klientów"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveGroup, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, {
                      label: "Nazwa grupy",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, { label: "Opis" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          data: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", null, [
                      createVNode("div", { class: "mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" }, "Członkowie grupy"),
                      createVNode("div", { class: "max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(customerOptions), (customer) => {
                          return openBlock(), createBlock("label", {
                            key: customer.id,
                            class: "flex items-center gap-3 text-sm"
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).memberIds = $event,
                              type: "checkbox",
                              value: customer.id,
                              class: "rounded border-gray-300"
                            }, null, 8, ["onUpdate:modelValue", "value"]), [
                              [vModelCheckbox, unref(form).memberIds]
                            ]),
                            createVNode("span", null, toDisplayString(customer.customerCode) + " · " + toDisplayString(customer.firstName) + " " + toDisplayString(customer.lastName), 1)
                          ]);
                        }), 128)),
                        !unref(customerOptions).length ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-gray-500"
                        }, "Brak klientów do przypisania.")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/customers/groups.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=groups-AJqji6Be.mjs.map
