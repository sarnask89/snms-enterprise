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
import { _ as _sfc_main$b } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$c } from './Checkbox-mfegmXJ0.mjs';
import { _ as _sfc_main$d } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$e } from './Alert-CJa1dftu.mjs';
import { ref, reactive, withAsyncContext, computed, withCtx, unref, createVNode, toDisplayString, createTextVNode, isRef, useSSRContext } from 'vue';
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
import './useResolvedVariants-Cc4FdLtQ.mjs';
import './isValueEqualOrExist-DDZNo4Zk.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "nodes",
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
    const nodeToDelete = ref(null);
    const columns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "locationDetail", header: "Lokalizacja" },
      { accessorKey: "locationType", header: "Typ lokalizacji" },
      { accessorKey: "nodeType", header: "Typ węzła" },
      { accessorKey: "flags", header: "Warunki" },
      { accessorKey: "deviceCount", header: "Urządzenia" },
      { id: "actions", header: "" }
    ];
    const locationTypeOptions = [
      { label: "Piwnica", value: "basement" },
      { label: "Klatka schodowa", value: "staircase" },
      { label: "Piętro", value: "floor" },
      { label: "Inne", value: "other" }
    ];
    const form = reactive({
      id: null,
      name: "",
      locationDetail: "",
      locationType: "other",
      nodeType: "",
      ownerType: "",
      latitude: "",
      longitude: "",
      x1992: "",
      y1992: "",
      hasPower: false,
      hasEnvControl: false,
      info: ""
    });
    const { data: nodes, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/net-nodes",
      {
        default: () => []
      },
      "$y-sPPdOR9y"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredNodes = computed(() => {
      const query = search.value.trim().toLowerCase();
      const rows = nodes.value || [];
      if (!query) {
        return rows;
      }
      return rows.filter(
        (row) => row.name.toLowerCase().includes(query) || (row.locationDetail || "").toLowerCase().includes(query) || (row.nodeType || "").toLowerCase().includes(query)
      );
    });
    const locationTypeLabel = (value) => {
      return locationTypeOptions.find((option) => option.value === value)?.label || value || "Inne";
    };
    const resetForm = () => {
      Object.assign(form, {
        id: null,
        name: "",
        locationDetail: "",
        locationType: "other",
        nodeType: "",
        ownerType: "",
        latitude: "",
        longitude: "",
        x1992: "",
        y1992: "",
        hasPower: false,
        hasEnvControl: false,
        info: ""
      });
    };
    const openCreateModal = () => {
      resetForm();
      isEditorOpen.value = true;
    };
    const openEditModal = async (row) => {
      const node = await $fetch(`/api/v1/net-nodes/${row.id}`);
      Object.assign(form, {
        id: node.id,
        name: node.name,
        locationDetail: node.locationDetail || "",
        locationType: node.locationType || "other",
        nodeType: node.nodeType || "",
        ownerType: node.ownerType || "",
        latitude: node.latitude ?? "",
        longitude: node.longitude ?? "",
        x1992: node.x1992 ?? "",
        y1992: node.y1992 ?? "",
        hasPower: !!node.hasPower,
        hasEnvControl: !!node.hasEnvControl,
        info: node.info || ""
      });
      isEditorOpen.value = true;
    };
    const saveNode = async () => {
      isSaving.value = true;
      try {
        const payload = {
          name: form.name,
          locationDetail: form.locationDetail || null,
          locationType: form.locationType,
          nodeType: form.nodeType || null,
          ownerType: form.ownerType || null,
          latitude: form.latitude === "" ? null : Number(form.latitude),
          longitude: form.longitude === "" ? null : Number(form.longitude),
          x1992: form.x1992 === "" ? null : Number(form.x1992),
          y1992: form.y1992 === "" ? null : Number(form.y1992),
          hasPower: !!form.hasPower,
          hasEnvControl: !!form.hasEnvControl,
          info: form.info || null
        };
        if (form.id) {
          await $fetch(`/api/v1/net-nodes/${form.id}`, {
            method: "PUT",
            body: payload
          });
        } else {
          await $fetch("/api/v1/net-nodes", {
            method: "POST",
            body: payload
          });
        }
        toast.add({
          title: form.id ? "Węzeł zaktualizowany" : "Węzeł dodany",
          description: `${form.name} został zapisany.`,
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
      label: "Edytuj węzeł",
      icon: "i-lucide-pencil",
      onSelect: async () => {
        await openEditModal(row);
      }
    }, {
      label: "Urządzenia węzła",
      icon: "i-lucide-cpu",
      onSelect: async () => {
        await navigateTo("/network/devices");
      }
    }], [{
      label: "Usuń węzeł",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => {
        nodeToDelete.value = row;
        isDeleteModalOpen.value = true;
      }
    }]];
    const confirmDelete = async () => {
      if (!nodeToDelete.value) {
        return;
      }
      isDeleting.value = true;
      try {
        await $fetch(`/api/v1/net-nodes/${nodeToDelete.value.id}`, { method: "DELETE" });
        toast.add({
          title: "Węzeł usunięty",
          description: `${nodeToDelete.value.name} został usunięty.`,
          color: "success"
        });
        isDeleteModalOpen.value = false;
        nodeToDelete.value = null;
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
      const _component_USelect = _sfc_main$b;
      const _component_UCheckbox = _sfc_main$c;
      const _component_UTextarea = _sfc_main$d;
      const _component_UAlert = _sfc_main$e;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_UDashboardPanel, { id: "network-nodes" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardNavbar, { title: "Węzły sieciowe" }, {
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
                    to: "/network/ip-networks",
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-network",
                    label: "Sieci IP"
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
                    label: "Nowy węzeł",
                    onClick: openCreateModal
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                      createVNode(unref(UButton), {
                        to: "/network/ip-networks",
                        color: "neutral",
                        variant: "outline",
                        icon: "i-lucide-network",
                        label: "Sieci IP"
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
                        label: "Nowy węzeł",
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
                    placeholder: "Szukaj po nazwie, lokalizacji lub typie..."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(search),
                      "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                      class: "w-full max-w-md",
                      icon: "i-lucide-search",
                      placeholder: "Szukaj po nazwie, lokalizacji lub typie..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardNavbar, { title: "Węzły sieciowe" }, {
                leading: withCtx(() => [
                  createVNode(_component_UDashboardSidebarCollapse)
                ]),
                right: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                    createVNode(unref(UButton), {
                      to: "/network/ip-networks",
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-network",
                      label: "Sieci IP"
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
                      label: "Nowy węzeł",
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
                    placeholder: "Szukaj po nazwie, lokalizacji lub typie..."
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
              data: unref(filteredNodes),
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
                  _push3(`<div class="min-w-[16rem]"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.name)}</div><div class="mt-1 text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.ownerType || "brak własności")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "min-w-[16rem]" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.ownerType || "brak własności"), 1)
                    ])
                  ];
                }
              }),
              "locationDetail-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.locationDetail || "brak szczegółu")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.latitude ?? "—")}, ${ssrInterpolate(row.longitude ?? "—")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.locationDetail || "brak szczegółu"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.latitude ?? "—") + ", " + toDisplayString(row.longitude ?? "—"), 1)
                    ])
                  ];
                }
              }),
              "locationType-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(locationTypeLabel(row.locationType))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(locationTypeLabel(row.locationType)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: "neutral",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(locationTypeLabel(row.locationType)), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              "flags-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1 text-sm"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.hasPower ? "Zasilanie dostępne" : "Brak zasilania")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.hasEnvControl ? "Kontrola środowiska" : "Bez klimatyzacji")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1 text-sm" }, [
                      createVNode("div", null, toDisplayString(row.hasPower ? "Zasilanie dostępne" : "Brak zasilania"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.hasEnvControl ? "Kontrola środowiska" : "Bez klimatyzacji"), 1)
                    ])
                  ];
                }
              }),
              "deviceCount-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.deviceCount || 0)}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.deviceCount || 0), 1)
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
            _push2(`<div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4"${_scopeId}><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(filteredNodes).length)} z ${ssrInterpolate(unref(nodes)?.length || 0)} węzłów widocznych </div></div>`);
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredNodes),
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
                  createVNode("div", { class: "min-w-[16rem]" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                    createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.ownerType || "brak własności"), 1)
                  ])
                ]),
                "locationDetail-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.locationDetail || "brak szczegółu"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.latitude ?? "—") + ", " + toDisplayString(row.longitude ?? "—"), 1)
                  ])
                ]),
                "locationType-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(locationTypeLabel(row.locationType)), 1)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                "flags-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1 text-sm" }, [
                    createVNode("div", null, toDisplayString(row.hasPower ? "Zasilanie dostępne" : "Brak zasilania"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.hasEnvControl ? "Kontrola środowiska" : "Bez klimatyzacji"), 1)
                  ])
                ]),
                "deviceCount-data": withCtx(({ row }) => [
                  createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.deviceCount || 0), 1)
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
                createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(filteredNodes).length) + " z " + toDisplayString(unref(nodes)?.length || 0) + " węzłów widocznych ", 1)
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
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>${ssrInterpolate(unref(form).id ? "Edytuj węzeł" : "Dodaj węzeł")}</h3><p class="text-sm text-muted"${_scopeId2}>Fizyczny punkt infrastruktury z podstawowymi parametrami środowiskowymi.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj węzeł" : "Dodaj węzeł"), 1),
                      createVNode("p", { class: "text-sm text-muted" }, "Fizyczny punkt infrastruktury z podstawowymi parametrami środowiskowymi.")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveNode
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
                          label: "Szczegóły lokalizacji",
                          name: "locationDetail"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).locationDetail,
                                "onUpdate:modelValue": ($event) => unref(form).locationDetail = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).locationDetail,
                                  "onUpdate:modelValue": ($event) => unref(form).locationDetail = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Typ lokalizacji",
                          name: "locationType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).locationType,
                                "onUpdate:modelValue": ($event) => unref(form).locationType = $event,
                                items: locationTypeOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).locationType,
                                  "onUpdate:modelValue": ($event) => unref(form).locationType = $event,
                                  items: locationTypeOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Typ węzła",
                          name: "nodeType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).nodeType,
                                "onUpdate:modelValue": ($event) => unref(form).nodeType = $event,
                                placeholder: "POP, ODF, szafa..."
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).nodeType,
                                  "onUpdate:modelValue": ($event) => unref(form).nodeType = $event,
                                  placeholder: "POP, ODF, szafa..."
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Własność",
                          name: "ownerType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).ownerType,
                                "onUpdate:modelValue": ($event) => unref(form).ownerType = $event,
                                placeholder: "own, lease..."
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).ownerType,
                                  "onUpdate:modelValue": ($event) => unref(form).ownerType = $event,
                                  placeholder: "own, lease..."
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Szerokość geograficzna",
                          name: "latitude"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).latitude,
                                "onUpdate:modelValue": ($event) => unref(form).latitude = $event,
                                type: "number",
                                step: "0.000001"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).latitude,
                                  "onUpdate:modelValue": ($event) => unref(form).latitude = $event,
                                  type: "number",
                                  step: "0.000001"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Długość geograficzna",
                          name: "longitude"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).longitude,
                                "onUpdate:modelValue": ($event) => unref(form).longitude = $event,
                                type: "number",
                                step: "0.000001"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).longitude,
                                  "onUpdate:modelValue": ($event) => unref(form).longitude = $event,
                                  type: "number",
                                  step: "0.000001"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "PUWG 1992 X",
                          name: "x1992"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).x1992,
                                "onUpdate:modelValue": ($event) => unref(form).x1992 = $event,
                                type: "number",
                                step: "0.01"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).x1992,
                                  "onUpdate:modelValue": ($event) => unref(form).x1992 = $event,
                                  type: "number",
                                  step: "0.01"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "PUWG 1992 Y",
                          name: "y1992"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).y1992,
                                "onUpdate:modelValue": ($event) => unref(form).y1992 = $event,
                                type: "number",
                                step: "0.01"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).y1992,
                                  "onUpdate:modelValue": ($event) => unref(form).y1992 = $event,
                                  type: "number",
                                  step: "0.01"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UCheckbox, {
                          modelValue: unref(form).hasPower,
                          "onUpdate:modelValue": ($event) => unref(form).hasPower = $event,
                          label: "Dostępne zasilanie"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UCheckbox, {
                          modelValue: unref(form).hasEnvControl,
                          "onUpdate:modelValue": ($event) => unref(form).hasEnvControl = $event,
                          label: "Kontrola środowiska"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Informacje",
                          name: "info"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(form).info,
                                "onUpdate:modelValue": ($event) => unref(form).info = $event,
                                rows: 3,
                                autoresize: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(form).info,
                                  "onUpdate:modelValue": ($event) => unref(form).info = $event,
                                  rows: 3,
                                  autoresize: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
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
                              label: "Szczegóły lokalizacji",
                              name: "locationDetail"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).locationDetail,
                                  "onUpdate:modelValue": ($event) => unref(form).locationDetail = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "Typ lokalizacji",
                              name: "locationType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).locationType,
                                  "onUpdate:modelValue": ($event) => unref(form).locationType = $event,
                                  items: locationTypeOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Typ węzła",
                              name: "nodeType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).nodeType,
                                  "onUpdate:modelValue": ($event) => unref(form).nodeType = $event,
                                  placeholder: "POP, ODF, szafa..."
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Własność",
                              name: "ownerType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).ownerType,
                                  "onUpdate:modelValue": ($event) => unref(form).ownerType = $event,
                                  placeholder: "own, lease..."
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Szerokość geograficzna",
                              name: "latitude"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).latitude,
                                  "onUpdate:modelValue": ($event) => unref(form).latitude = $event,
                                  type: "number",
                                  step: "0.000001"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Długość geograficzna",
                              name: "longitude"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).longitude,
                                  "onUpdate:modelValue": ($event) => unref(form).longitude = $event,
                                  type: "number",
                                  step: "0.000001"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "PUWG 1992 X",
                              name: "x1992"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).x1992,
                                  "onUpdate:modelValue": ($event) => unref(form).x1992 = $event,
                                  type: "number",
                                  step: "0.01"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "PUWG 1992 Y",
                              name: "y1992"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).y1992,
                                  "onUpdate:modelValue": ($event) => unref(form).y1992 = $event,
                                  type: "number",
                                  step: "0.01"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UCheckbox, {
                              modelValue: unref(form).hasPower,
                              "onUpdate:modelValue": ($event) => unref(form).hasPower = $event,
                              label: "Dostępne zasilanie"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_UCheckbox, {
                              modelValue: unref(form).hasEnvControl,
                              "onUpdate:modelValue": ($event) => unref(form).hasEnvControl = $event,
                              label: "Kontrola środowiska"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode(_component_UFormField, {
                            label: "Informacje",
                            name: "info"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(form).info,
                                "onUpdate:modelValue": ($event) => unref(form).info = $event,
                                rows: 3,
                                autoresize: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
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
                      onSubmit: saveNode
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
                            label: "Szczegóły lokalizacji",
                            name: "locationDetail"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).locationDetail,
                                "onUpdate:modelValue": ($event) => unref(form).locationDetail = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "Typ lokalizacji",
                            name: "locationType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).locationType,
                                "onUpdate:modelValue": ($event) => unref(form).locationType = $event,
                                items: locationTypeOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Typ węzła",
                            name: "nodeType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).nodeType,
                                "onUpdate:modelValue": ($event) => unref(form).nodeType = $event,
                                placeholder: "POP, ODF, szafa..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Własność",
                            name: "ownerType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).ownerType,
                                "onUpdate:modelValue": ($event) => unref(form).ownerType = $event,
                                placeholder: "own, lease..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Szerokość geograficzna",
                            name: "latitude"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).latitude,
                                "onUpdate:modelValue": ($event) => unref(form).latitude = $event,
                                type: "number",
                                step: "0.000001"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Długość geograficzna",
                            name: "longitude"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).longitude,
                                "onUpdate:modelValue": ($event) => unref(form).longitude = $event,
                                type: "number",
                                step: "0.000001"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "PUWG 1992 X",
                            name: "x1992"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).x1992,
                                "onUpdate:modelValue": ($event) => unref(form).x1992 = $event,
                                type: "number",
                                step: "0.01"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "PUWG 1992 Y",
                            name: "y1992"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).y1992,
                                "onUpdate:modelValue": ($event) => unref(form).y1992 = $event,
                                type: "number",
                                step: "0.01"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(form).hasPower,
                            "onUpdate:modelValue": ($event) => unref(form).hasPower = $event,
                            label: "Dostępne zasilanie"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(form).hasEnvControl,
                            "onUpdate:modelValue": ($event) => unref(form).hasEnvControl = $event,
                            label: "Kontrola środowiska"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode(_component_UFormField, {
                          label: "Informacje",
                          name: "info"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(form).info,
                              "onUpdate:modelValue": ($event) => unref(form).info = $event,
                              rows: 3,
                              autoresize: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj węzeł" : "Dodaj węzeł"), 1),
                    createVNode("p", { class: "text-sm text-muted" }, "Fizyczny punkt infrastruktury z podstawowymi parametrami środowiskowymi.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveNode
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
                          label: "Szczegóły lokalizacji",
                          name: "locationDetail"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).locationDetail,
                              "onUpdate:modelValue": ($event) => unref(form).locationDetail = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "Typ lokalizacji",
                          name: "locationType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).locationType,
                              "onUpdate:modelValue": ($event) => unref(form).locationType = $event,
                              items: locationTypeOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Typ węzła",
                          name: "nodeType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).nodeType,
                              "onUpdate:modelValue": ($event) => unref(form).nodeType = $event,
                              placeholder: "POP, ODF, szafa..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Własność",
                          name: "ownerType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).ownerType,
                              "onUpdate:modelValue": ($event) => unref(form).ownerType = $event,
                              placeholder: "own, lease..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Szerokość geograficzna",
                          name: "latitude"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).latitude,
                              "onUpdate:modelValue": ($event) => unref(form).latitude = $event,
                              type: "number",
                              step: "0.000001"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Długość geograficzna",
                          name: "longitude"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).longitude,
                              "onUpdate:modelValue": ($event) => unref(form).longitude = $event,
                              type: "number",
                              step: "0.000001"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "PUWG 1992 X",
                          name: "x1992"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).x1992,
                              "onUpdate:modelValue": ($event) => unref(form).x1992 = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "PUWG 1992 Y",
                          name: "y1992"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).y1992,
                              "onUpdate:modelValue": ($event) => unref(form).y1992 = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UCheckbox, {
                          modelValue: unref(form).hasPower,
                          "onUpdate:modelValue": ($event) => unref(form).hasPower = $event,
                          label: "Dostępne zasilanie"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_UCheckbox, {
                          modelValue: unref(form).hasEnvControl,
                          "onUpdate:modelValue": ($event) => unref(form).hasEnvControl = $event,
                          label: "Kontrola środowiska"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Informacje",
                        name: "info"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).info,
                            "onUpdate:modelValue": ($event) => unref(form).info = $event,
                            rows: 3,
                            autoresize: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
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
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>Usuń węzeł</h3><p class="text-sm text-muted"${_scopeId2}>Ta operacja usuwa węzeł z inventory infrastruktury.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń węzeł"),
                      createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usuwa węzeł z inventory infrastruktury.")
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
                    title: unref(nodeToDelete) ? `Usunąć ${unref(nodeToDelete).name}?` : "Brak węzła do usunięcia."
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
                        title: unref(nodeToDelete) ? `Usunąć ${unref(nodeToDelete).name}?` : "Brak węzła do usunięcia."
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń węzeł"),
                    createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usuwa węzeł z inventory infrastruktury.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UAlert, {
                      color: "error",
                      variant: "soft",
                      icon: "i-lucide-triangle-alert",
                      title: unref(nodeToDelete) ? `Usunąć ${unref(nodeToDelete).name}?` : "Brak węzła do usunięcia."
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/network/nodes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nodes-Cd9LO4Gj.mjs.map
