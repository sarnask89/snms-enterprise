import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { c as useToast, b as _sfc_main$8, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2$1 } from './DashboardSidebarToggle-CpAlTuik.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$4 } from './DashboardSidebarCollapse-6_wW4EC7.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$9 } from './Form-Bb7mio0o.mjs';
import { _ as _sfc_main$5 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$1 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$6 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$7 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$a } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$b } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$c } from './Checkbox-mfegmXJ0.mjs';
import { _ as _sfc_main$d } from './Alert-CJa1dftu.mjs';
import { ref, reactive, withAsyncContext, computed, withCtx, unref, createVNode, createTextVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import './RovingFocusGroup-C9aTixOz.mjs';
import './utils-Bd-v-gOF.mjs';
import './useFilter-BytkjEhg.mjs';
import '@tanstack/vue-virtual';
import '@tanstack/vue-table';
import './Label-BCnUNGB-.mjs';
import './isValueEqualOrExist-DDZNo4Zk.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "ip-networks",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const UBadge = _sfc_main$3;
    const UButton = _sfc_main$8;
    const UDropdownMenu = _sfc_main$2$1;
    const toast = useToast();
    const search = ref("");
    const isEditorOpen = ref(false);
    const isSaving = ref(false);
    const isDeleteModalOpen = ref(false);
    const isDeleting = ref(false);
    const networkToDelete = ref(null);
    const columns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "cidr", header: "CIDR" },
      { accessorKey: "gateway", header: "Brama" },
      { accessorKey: "vlanId", header: "VLAN" },
      { accessorKey: "usage", header: "Wykorzystanie" },
      { accessorKey: "active", header: "Status" },
      { id: "actions", header: "" }
    ];
    const form = reactive({
      id: null,
      name: "",
      cidr: "",
      gateway: "",
      vlanId: "",
      description: "",
      active: true
    });
    const { data: networks, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/ip-networks",
      {
        default: () => []
      },
      "$RzYNuccDlo"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredNetworks = computed(() => {
      const query = search.value.trim().toLowerCase();
      const rows = networks.value || [];
      if (!query) {
        return rows;
      }
      return rows.filter(
        (row) => row.name.toLowerCase().includes(query) || row.cidr.toLowerCase().includes(query) || (row.gateway || "").toLowerCase().includes(query) || String(row.vlanId || "").includes(query)
      );
    });
    const resetForm = () => {
      Object.assign(form, {
        id: null,
        name: "",
        cidr: "",
        gateway: "",
        vlanId: "",
        description: "",
        active: true
      });
    };
    const openCreateModal = () => {
      resetForm();
      isEditorOpen.value = true;
    };
    const openEditModal = async (row) => {
      const network = await $fetch(`/api/v1/ip-networks/${row.id}`);
      Object.assign(form, {
        id: network.id,
        name: network.name,
        cidr: network.cidr,
        gateway: network.gateway || "",
        vlanId: network.vlanId ?? "",
        description: network.description || "",
        active: !!network.active
      });
      isEditorOpen.value = true;
    };
    const saveNetwork = async () => {
      isSaving.value = true;
      try {
        const payload = {
          name: form.name,
          cidr: form.cidr,
          gateway: form.gateway || null,
          vlanId: form.vlanId === "" ? null : Number(form.vlanId),
          description: form.description || null,
          active: !!form.active
        };
        if (form.id) {
          await $fetch(`/api/v1/ip-networks/${form.id}`, {
            method: "PUT",
            body: payload
          });
        } else {
          await $fetch("/api/v1/ip-networks", {
            method: "POST",
            body: payload
          });
        }
        toast.add({
          title: form.id ? "Sieć zaktualizowana" : "Sieć dodana",
          description: `${form.name} została zapisana.`,
          color: "success"
        });
        isEditorOpen.value = false;
        resetForm();
        await refresh();
      } finally {
        isSaving.value = false;
      }
    };
    const getRowItems = (row) => [[{
      type: "label",
      label: row.name
    }], [{
      label: "Edytuj sieć",
      icon: "i-lucide-pencil",
      onSelect: async () => {
        await openEditModal(row);
      }
    }, {
      label: "Powiązane urządzenia",
      icon: "i-lucide-cpu",
      onSelect: async () => {
        await navigateTo("/network/devices");
      }
    }], [{
      label: "Usuń sieć",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => {
        networkToDelete.value = row;
        isDeleteModalOpen.value = true;
      }
    }]];
    const confirmDelete = async () => {
      if (!networkToDelete.value) {
        return;
      }
      isDeleting.value = true;
      try {
        await $fetch(`/api/v1/ip-networks/${networkToDelete.value.id}`, { method: "DELETE" });
        toast.add({
          title: "Sieć usunięta",
          description: `${networkToDelete.value.name} została usunięta.`,
          color: "success"
        });
        isDeleteModalOpen.value = false;
        networkToDelete.value = null;
        await refresh();
      } finally {
        isDeleting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDashboardPanel = _sfc_main$2;
      const _component_UDashboardNavbar = _sfc_main$1$1;
      const _component_UDashboardSidebarCollapse = _sfc_main$4;
      const _component_UDashboardToolbar = _sfc_main$1$2;
      const _component_UInput = _sfc_main$5;
      const _component_UTable = _sfc_main$1;
      const _component_UModal = _sfc_main$6;
      const _component_UCard = _sfc_main$7;
      const _component_UForm = _sfc_main$9;
      const _component_UFormField = _sfc_main$a;
      const _component_UTextarea = _sfc_main$b;
      const _component_UCheckbox = _sfc_main$c;
      const _component_UAlert = _sfc_main$d;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_UDashboardPanel, { id: "ip-networks" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardNavbar, { title: "Sieci IP" }, {
              leading: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UDashboardSidebarCollapse, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UDashboardSidebarCollapse)
                  ];
                }
              }),
              right: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-wrap items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UButton), {
                    to: "/network/nodes",
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-map-pinned",
                    label: "Węzły"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    to: "/network/devices",
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-cpu",
                    label: "Urządzenia"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "primary",
                    icon: "i-lucide-plus",
                    label: "Nowa sieć",
                    onClick: openCreateModal
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                      createVNode(unref(UButton), {
                        to: "/network/nodes",
                        color: "neutral",
                        variant: "outline",
                        icon: "i-lucide-map-pinned",
                        label: "Węzły"
                      }),
                      createVNode(unref(UButton), {
                        to: "/network/devices",
                        color: "neutral",
                        variant: "outline",
                        icon: "i-lucide-cpu",
                        label: "Urządzenia"
                      }),
                      createVNode(unref(UButton), {
                        color: "primary",
                        icon: "i-lucide-plus",
                        label: "Nowa sieć",
                        onClick: openCreateModal
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UDashboardToolbar, null, {
              left: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(search),
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    class: "w-full max-w-md",
                    icon: "i-lucide-search",
                    placeholder: "Szukaj po nazwie, CIDR, bramie lub VLAN..."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(search),
                      "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                      class: "w-full max-w-md",
                      icon: "i-lucide-search",
                      placeholder: "Szukaj po nazwie, CIDR, bramie lub VLAN..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardNavbar, { title: "Sieci IP" }, {
                leading: withCtx(() => [
                  createVNode(_component_UDashboardSidebarCollapse)
                ]),
                right: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                    createVNode(unref(UButton), {
                      to: "/network/nodes",
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-map-pinned",
                      label: "Węzły"
                    }),
                    createVNode(unref(UButton), {
                      to: "/network/devices",
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-cpu",
                      label: "Urządzenia"
                    }),
                    createVNode(unref(UButton), {
                      color: "primary",
                      icon: "i-lucide-plus",
                      label: "Nowa sieć",
                      onClick: openCreateModal
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_UDashboardToolbar, null, {
                left: withCtx(() => [
                  createVNode(_component_UInput, {
                    modelValue: unref(search),
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    class: "w-full max-w-md",
                    icon: "i-lucide-search",
                    placeholder: "Szukaj po nazwie, CIDR, bramie lub VLAN..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              })
            ];
          }
        }),
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredNetworks),
              columns,
              loading: unref(pending),
              ui: {
                base: "table-fixed border-separate border-spacing-0",
                thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                tbody: "[&>tr]:last:[&>td]:border-b-0",
                th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                td: "border-b border-default align-top",
                separator: "h-0"
              }
            }, {
              "name-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="min-w-[15rem]"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.name)}</div><div class="mt-1 text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.description || "brak opisu")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "min-w-[15rem]" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.description || "brak opisu"), 1)
                    ])
                  ];
                }
              }),
              "gateway-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.gateway || "brak bramy")}</div><div class="text-xs text-muted"${_scopeId2}>VLAN ${ssrInterpolate(row.vlanId ?? "—")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.gateway || "brak bramy"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, "VLAN " + toDisplayString(row.vlanId ?? "—"), 1)
                    ])
                  ];
                }
              }),
              "usage-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1 text-sm"${_scopeId2}><div${_scopeId2}>Sieciowe: ${ssrInterpolate(row.deviceCount || 0)}</div><div class="text-xs text-muted"${_scopeId2}>Klienci: ${ssrInterpolate(row.customerDeviceCount || 0)}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1 text-sm" }, [
                      createVNode("div", null, "Sieciowe: " + toDisplayString(row.deviceCount || 0), 1),
                      createVNode("div", { class: "text-xs text-muted" }, "Klienci: " + toDisplayString(row.customerDeviceCount || 0), 1)
                    ])
                  ];
                }
              }),
              "active-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.active ? "success" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.active ? "Aktywna" : "Wyłączona")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.active ? "Aktywna" : "Wyłączona"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: row.active ? "success" : "neutral",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.active ? "Aktywna" : "Wyłączona"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-right"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UDropdownMenu), {
                    items: getRowItems(row),
                    content: { align: "end" }
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(UButton), {
                          icon: "i-lucide-ellipsis-vertical",
                          color: "neutral",
                          variant: "ghost",
                          class: "ml-auto"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(UButton), {
                            icon: "i-lucide-ellipsis-vertical",
                            color: "neutral",
                            variant: "ghost",
                            class: "ml-auto"
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-right" }, [
                      createVNode(unref(UDropdownMenu), {
                        items: getRowItems(row),
                        content: { align: "end" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(UButton), {
                            icon: "i-lucide-ellipsis-vertical",
                            color: "neutral",
                            variant: "ghost",
                            class: "ml-auto"
                          })
                        ]),
                        _: 1
                      }, 8, ["items"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4"${_scopeId}><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(filteredNetworks).length)} z ${ssrInterpolate(unref(networks)?.length || 0)} sieci widocznych </div></div>`);
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredNetworks),
                columns,
                loading: unref(pending),
                ui: {
                  base: "table-fixed border-separate border-spacing-0",
                  thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                  tbody: "[&>tr]:last:[&>td]:border-b-0",
                  th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                  td: "border-b border-default align-top",
                  separator: "h-0"
                }
              }, {
                "name-data": withCtx(({ row }) => [
                  createVNode("div", { class: "min-w-[15rem]" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                    createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.description || "brak opisu"), 1)
                  ])
                ]),
                "gateway-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.gateway || "brak bramy"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, "VLAN " + toDisplayString(row.vlanId ?? "—"), 1)
                  ])
                ]),
                "usage-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1 text-sm" }, [
                    createVNode("div", null, "Sieciowe: " + toDisplayString(row.deviceCount || 0), 1),
                    createVNode("div", { class: "text-xs text-muted" }, "Klienci: " + toDisplayString(row.customerDeviceCount || 0), 1)
                  ])
                ]),
                "active-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: row.active ? "success" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.active ? "Aktywna" : "Wyłączona"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-right" }, [
                    createVNode(unref(UDropdownMenu), {
                      items: getRowItems(row),
                      content: { align: "end" }
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(UButton), {
                          icon: "i-lucide-ellipsis-vertical",
                          color: "neutral",
                          variant: "ghost",
                          class: "ml-auto"
                        })
                      ]),
                      _: 1
                    }, 8, ["items"])
                  ])
                ]),
                _: 1
              }, 8, ["data", "loading"]),
              createVNode("div", { class: "mt-auto flex items-center justify-between gap-3 border-t border-default pt-4" }, [
                createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(filteredNetworks).length) + " z " + toDisplayString(unref(networks)?.length || 0) + " sieci widocznych ", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(isEditorOpen),
        "onUpdate:open": ($event) => isRef(isEditorOpen) ? isEditorOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>${ssrInterpolate(unref(form).id ? "Edytuj sieć IP" : "Dodaj sieć IP")}</h3><p class="text-sm text-muted"${_scopeId2}>Podsieć access lub management z podstawowymi parametrami operatorskimi.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj sieć IP" : "Dodaj sieć IP"), 1),
                      createVNode("p", { class: "text-sm text-muted" }, "Podsieć access lub management z podstawowymi parametrami operatorskimi.")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveNetwork
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Nazwa",
                          name: "name",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).name,
                                "onUpdate:modelValue": ($event) => unref(form).name = $event
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "CIDR",
                          name: "cidr",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).cidr,
                                "onUpdate:modelValue": ($event) => unref(form).cidr = $event,
                                placeholder: "10.10.100.0/24"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).cidr,
                                  "onUpdate:modelValue": ($event) => unref(form).cidr = $event,
                                  placeholder: "10.10.100.0/24"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Brama",
                          name: "gateway"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).gateway,
                                "onUpdate:modelValue": ($event) => unref(form).gateway = $event,
                                placeholder: "10.10.100.1"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).gateway,
                                  "onUpdate:modelValue": ($event) => unref(form).gateway = $event,
                                  placeholder: "10.10.100.1"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "VLAN ID",
                          name: "vlanId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).vlanId,
                                "onUpdate:modelValue": ($event) => unref(form).vlanId = $event,
                                type: "number"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).vlanId,
                                  "onUpdate:modelValue": ($event) => unref(form).vlanId = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Opis",
                          name: "description"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(form).description,
                                "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                rows: 3,
                                autoresize: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(form).description,
                                  "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                  rows: 3,
                                  autoresize: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UCheckbox, {
                          modelValue: unref(form).active,
                          "onUpdate:modelValue": ($event) => unref(form).active = $event,
                          label: "Sieć aktywna"
                        }, null, _parent4, _scopeId3));
                        _push4(`<div class="flex justify-end gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(UButton), {
                          color: "neutral",
                          variant: "outline",
                          label: "Anuluj",
                          onClick: ($event) => isEditorOpen.value = false
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(UButton), {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSaving),
                          label: "Zapisz"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Nazwa",
                              name: "name",
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
                            createVNode(_component_UFormField, {
                              label: "CIDR",
                              name: "cidr",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).cidr,
                                  "onUpdate:modelValue": ($event) => unref(form).cidr = $event,
                                  placeholder: "10.10.100.0/24"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Brama",
                              name: "gateway"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).gateway,
                                  "onUpdate:modelValue": ($event) => unref(form).gateway = $event,
                                  placeholder: "10.10.100.1"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "VLAN ID",
                              name: "vlanId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).vlanId,
                                  "onUpdate:modelValue": ($event) => unref(form).vlanId = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_UFormField, {
                            label: "Opis",
                            name: "description"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(form).description,
                                "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                rows: 3,
                                autoresize: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(form).active,
                            "onUpdate:modelValue": ($event) => unref(form).active = $event,
                            label: "Sieć aktywna"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("div", { class: "flex justify-end gap-2" }, [
                            createVNode(unref(UButton), {
                              color: "neutral",
                              variant: "outline",
                              label: "Anuluj",
                              onClick: ($event) => isEditorOpen.value = false
                            }, null, 8, ["onClick"]),
                            createVNode(unref(UButton), {
                              type: "submit",
                              color: "primary",
                              loading: unref(isSaving),
                              label: "Zapisz"
                            }, null, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UForm, {
                      state: unref(form),
                      class: "space-y-4",
                      onSubmit: saveNetwork
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Nazwa",
                            name: "name",
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
                          createVNode(_component_UFormField, {
                            label: "CIDR",
                            name: "cidr",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).cidr,
                                "onUpdate:modelValue": ($event) => unref(form).cidr = $event,
                                placeholder: "10.10.100.0/24"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Brama",
                            name: "gateway"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).gateway,
                                "onUpdate:modelValue": ($event) => unref(form).gateway = $event,
                                placeholder: "10.10.100.1"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "VLAN ID",
                            name: "vlanId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).vlanId,
                                "onUpdate:modelValue": ($event) => unref(form).vlanId = $event,
                                type: "number"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(_component_UFormField, {
                          label: "Opis",
                          name: "description"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(form).description,
                              "onUpdate:modelValue": ($event) => unref(form).description = $event,
                              rows: 3,
                              autoresize: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UCheckbox, {
                          modelValue: unref(form).active,
                          "onUpdate:modelValue": ($event) => unref(form).active = $event,
                          label: "Sieć aktywna"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("div", { class: "flex justify-end gap-2" }, [
                          createVNode(unref(UButton), {
                            color: "neutral",
                            variant: "outline",
                            label: "Anuluj",
                            onClick: ($event) => isEditorOpen.value = false
                          }, null, 8, ["onClick"]),
                          createVNode(unref(UButton), {
                            type: "submit",
                            color: "primary",
                            loading: unref(isSaving),
                            label: "Zapisz"
                          }, null, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["state"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj sieć IP" : "Dodaj sieć IP"), 1),
                    createVNode("p", { class: "text-sm text-muted" }, "Podsieć access lub management z podstawowymi parametrami operatorskimi.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveNetwork
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Nazwa",
                          name: "name",
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
                        createVNode(_component_UFormField, {
                          label: "CIDR",
                          name: "cidr",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).cidr,
                              "onUpdate:modelValue": ($event) => unref(form).cidr = $event,
                              placeholder: "10.10.100.0/24"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Brama",
                          name: "gateway"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).gateway,
                              "onUpdate:modelValue": ($event) => unref(form).gateway = $event,
                              placeholder: "10.10.100.1"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "VLAN ID",
                          name: "vlanId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).vlanId,
                              "onUpdate:modelValue": ($event) => unref(form).vlanId = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Opis",
                        name: "description"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            rows: 3,
                            autoresize: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UCheckbox, {
                        modelValue: unref(form).active,
                        "onUpdate:modelValue": ($event) => unref(form).active = $event,
                        label: "Sieć aktywna"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(unref(UButton), {
                          color: "neutral",
                          variant: "outline",
                          label: "Anuluj",
                          onClick: ($event) => isEditorOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(unref(UButton), {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSaving),
                          label: "Zapisz"
                        }, null, 8, ["loading"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["state"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(isDeleteModalOpen),
        "onUpdate:open": ($event) => isRef(isDeleteModalOpen) ? isDeleteModalOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>Usuń sieć IP</h3><p class="text-sm text-muted"${_scopeId2}>Ta operacja usuwa podsieć z inventory operatorskiego.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń sieć IP"),
                      createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usuwa podsieć z inventory operatorskiego.")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UAlert, {
                    color: "error",
                    variant: "soft",
                    icon: "i-lucide-triangle-alert",
                    title: unref(networkToDelete) ? `Usunąć ${unref(networkToDelete).name}?` : "Brak sieci do usunięcia."
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "neutral",
                    variant: "outline",
                    label: "Anuluj",
                    onClick: ($event) => isDeleteModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "error",
                    loading: unref(isDeleting),
                    label: "Usuń",
                    onClick: confirmDelete
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_UAlert, {
                        color: "error",
                        variant: "soft",
                        icon: "i-lucide-triangle-alert",
                        title: unref(networkToDelete) ? `Usunąć ${unref(networkToDelete).name}?` : "Brak sieci do usunięcia."
                      }, null, 8, ["title"]),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(unref(UButton), {
                          color: "neutral",
                          variant: "outline",
                          label: "Anuluj",
                          onClick: ($event) => isDeleteModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(unref(UButton), {
                          color: "error",
                          loading: unref(isDeleting),
                          label: "Usuń",
                          onClick: confirmDelete
                        }, null, 8, ["loading"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń sieć IP"),
                    createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usuwa podsieć z inventory operatorskiego.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UAlert, {
                      color: "error",
                      variant: "soft",
                      icon: "i-lucide-triangle-alert",
                      title: unref(networkToDelete) ? `Usunąć ${unref(networkToDelete).name}?` : "Brak sieci do usunięcia."
                    }, null, 8, ["title"]),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(unref(UButton), {
                        color: "neutral",
                        variant: "outline",
                        label: "Anuluj",
                        onClick: ($event) => isDeleteModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(unref(UButton), {
                        color: "error",
                        loading: unref(isDeleting),
                        label: "Usuń",
                        onClick: confirmDelete
                      }, null, 8, ["loading"])
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/network/ip-networks.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ip-networks-R4pysFHY.mjs.map
