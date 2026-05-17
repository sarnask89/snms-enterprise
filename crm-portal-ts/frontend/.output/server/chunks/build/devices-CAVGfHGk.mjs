import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { c as useToast, b as _sfc_main$8, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2$1 } from './DashboardSidebarToggle-CpAlTuik.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$4 } from './DashboardSidebarCollapse-6_wW4EC7.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$a } from './Form-Bb7mio0o.mjs';
import { _ as _sfc_main$6 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$5 } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$1 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$7 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$9 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$b } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$c } from './SelectMenu-BhfO7re0.mjs';
import { _ as _sfc_main$d } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$e } from './Alert-CJa1dftu.mjs';
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
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@tanstack/vue-table';
import './Label-BCnUNGB-.mjs';
import './virtualizer-Dnga9fey.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "devices",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const UBadge = _sfc_main$3;
    const UButton = _sfc_main$8;
    const UDropdownMenu = _sfc_main$2$1;
    const toast = useToast();
    const search = ref("");
    const statusFilter = ref("all");
    const driverFilter = ref("all");
    const deviceTypeFilter = ref("all");
    const isModalOpen = ref(false);
    const isSaving = ref(false);
    const deviceToDelete = ref(null);
    const isDeleteModalOpen = ref(false);
    const isDeleting = ref(false);
    const columns = [
      { accessorKey: "device", header: "Urządzenie" },
      { accessorKey: "management", header: "Management" },
      { accessorKey: "access", header: "Dostęp" },
      { accessorKey: "relations", header: "Powiązania" },
      { accessorKey: "status", header: "Status" },
      { id: "actions", header: "" }
    ];
    const statusItems = [
      { label: "Wszystkie statusy", value: "all" },
      { label: "Aktywne", value: "active" },
      { label: "Nieaktywne", value: "inactive" },
      { label: "Serwis", value: "maintenance" }
    ];
    const driverItems = [
      { label: "Wszystkie drivery", value: "all" },
      { label: "Mikrotik API", value: "mikrotik_api" },
      { label: "Dasan SSH", value: "dasan_ssh" },
      { label: "SNMP", value: "snmp" },
      { label: "Brak drivera", value: "none" }
    ];
    const deviceTypeItems = [
      { label: "Wszystkie typy", value: "all" },
      { label: "Router", value: "router" },
      { label: "Switch", value: "switch" },
      { label: "OLT", value: "olt" },
      { label: "ONU", value: "onu" },
      { label: "Inne", value: "other" }
    ];
    const form = reactive({
      id: null,
      name: "",
      hostname: "",
      serialNumber: "",
      macAddress: "",
      managementIp: "",
      snmpCommunity: "",
      loginUrl: "",
      driverType: "",
      mgmtUsername: "",
      deviceType: "other",
      status: "active",
      netNodeId: null,
      ipNetworkId: null,
      customerId: null,
      notes: ""
    });
    const { data: devices, pending: pendingDevices, refresh: refreshDevices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/net-devices",
      {
        default: () => []
      },
      "$TsD4wmBb_C"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: nodes, refresh: refreshNodes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/net-nodes",
      { default: () => [] },
      "$n7OFLehy0c"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: networks, refresh: refreshNetworks } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/ip-networks",
      { default: () => [] },
      "$awtJRaXbU6"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers, refresh: refreshCustomers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 500 },
        default: () => []
      },
      "$DU5S_YKS7t"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredDevices = computed(() => {
      const rows = devices.value || [];
      const query = search.value.trim().toLowerCase();
      return rows.filter((row) => {
        if (statusFilter.value !== "all" && row.status !== statusFilter.value) {
          return false;
        }
        if (driverFilter.value === "none" && row.driverType) {
          return false;
        }
        if (driverFilter.value !== "all" && driverFilter.value !== "none" && row.driverType !== driverFilter.value) {
          return false;
        }
        if (deviceTypeFilter.value !== "all" && (row.deviceType || "other") !== deviceTypeFilter.value) {
          return false;
        }
        if (!query) {
          return true;
        }
        return [
          row.name,
          row.hostname || "",
          row.managementIp || "",
          row.deviceType || "",
          row.driverType || "",
          row.serialNumber || "",
          row.netNode?.name || "",
          row.ipNetwork?.name || ""
        ].join(" ").toLowerCase().includes(query);
      });
    });
    const nodeOptions = computed(() => [
      { label: "Brak węzła", value: null },
      ...(nodes.value || []).map((node) => ({
        label: node.name,
        value: node.id
      }))
    ]);
    const networkOptions = computed(() => [
      { label: "Brak sieci", value: null },
      ...(networks.value || []).map((network) => ({
        label: `${network.name} (${network.cidr})`,
        value: network.id
      }))
    ]);
    const customerOptions = computed(() => [
      { label: "Nieprzypisane", value: null },
      ...(customers.value || []).map((customer) => ({
        label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.customerCode,
        value: customer.id
      }))
    ]);
    const statusColor = (status) => {
      switch (status) {
        case "active":
          return "success";
        case "maintenance":
          return "warning";
        case "inactive":
          return "neutral";
        default:
          return "neutral";
      }
    };
    const statusLabel = (status) => {
      switch (status) {
        case "active":
          return "Aktywne";
        case "maintenance":
          return "Serwis";
        case "inactive":
          return "Nieaktywne";
        default:
          return status || "Nieznany";
      }
    };
    const driverLabel = (driver) => {
      return driverItems.find((item) => item.value === driver)?.label || driver || "brak";
    };
    const customerLabel = (customer) => {
      if (!customer) {
        return "Nieprzypisane";
      }
      return customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.customerCode;
    };
    const resetForm = () => {
      Object.assign(form, {
        id: null,
        name: "",
        hostname: "",
        serialNumber: "",
        macAddress: "",
        managementIp: "",
        snmpCommunity: "",
        loginUrl: "",
        driverType: "",
        mgmtUsername: "",
        deviceType: "other",
        status: "active",
        netNodeId: null,
        ipNetworkId: null,
        customerId: null,
        notes: ""
      });
    };
    const openCreateModal = () => {
      resetForm();
      isModalOpen.value = true;
    };
    const openEditModal = async (row) => {
      const device = await $fetch(`/api/v1/net-devices/${row.id}`);
      Object.assign(form, {
        id: device.id,
        name: device.name,
        hostname: device.hostname || "",
        serialNumber: device.serialNumber || "",
        macAddress: device.macAddress || "",
        managementIp: device.managementIp || "",
        snmpCommunity: device.snmpCommunity || "",
        loginUrl: device.loginUrl || "",
        driverType: device.driverType || "",
        mgmtUsername: device.mgmtUsername || "",
        deviceType: device.deviceType || "other",
        status: device.status || "active",
        netNodeId: device.netNodeId ?? null,
        ipNetworkId: device.ipNetworkId ?? null,
        customerId: device.customerId ?? null,
        notes: device.notes || ""
      });
      isModalOpen.value = true;
    };
    function getRowItems(row) {
      return [[{
        type: "label",
        label: row.name
      }], [{
        label: "Edytuj urządzenie",
        icon: "i-lucide-pencil",
        onSelect: async () => {
          await openEditModal(row);
        }
      }, {
        label: "Operacje discovery",
        icon: "i-lucide-wrench",
        onSelect: async () => {
          await navigateTo("/operations");
        }
      }, {
        label: "Otwórz klienta",
        icon: "i-lucide-user",
        disabled: !row.customerId,
        onSelect: async () => {
          if (row.customerId) {
            await navigateTo(`/customers/${row.customerId}`);
          }
        }
      }], [{
        label: "Usuń urządzenie",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          deviceToDelete.value = row;
          isDeleteModalOpen.value = true;
        }
      }]];
    }
    const saveDevice = async () => {
      isSaving.value = true;
      try {
        const payload = {
          name: form.name,
          hostname: form.hostname || null,
          serialNumber: form.serialNumber || null,
          macAddress: form.macAddress || null,
          managementIp: form.managementIp || null,
          snmpCommunity: form.snmpCommunity || null,
          loginUrl: form.loginUrl || null,
          driverType: form.driverType || null,
          mgmtUsername: form.mgmtUsername || null,
          deviceType: form.deviceType || "other",
          status: form.status,
          netNodeId: form.netNodeId,
          ipNetworkId: form.ipNetworkId,
          customerId: form.customerId,
          notes: form.notes || null
        };
        if (form.id) {
          await $fetch(`/api/v1/net-devices/${form.id}`, {
            method: "PUT",
            body: payload
          });
        } else {
          await $fetch("/api/v1/net-devices", {
            method: "POST",
            body: payload
          });
        }
        toast.add({
          title: form.id ? "Urządzenie zapisane" : "Urządzenie dodane",
          description: `${form.name} jest już dostępne w katalogu urządzeń sieciowych.`,
          color: "success"
        });
        isModalOpen.value = false;
        resetForm();
        await Promise.all([refreshDevices(), refreshNodes(), refreshNetworks(), refreshCustomers()]);
      } finally {
        isSaving.value = false;
      }
    };
    const confirmDelete = async () => {
      if (!deviceToDelete.value) {
        return;
      }
      isDeleting.value = true;
      try {
        await $fetch(`/api/v1/net-devices/${deviceToDelete.value.id}`, { method: "DELETE" });
        toast.add({
          title: "Urządzenie usunięte",
          description: `${deviceToDelete.value.name} zostało usunięte z katalogu.`,
          color: "success"
        });
        isDeleteModalOpen.value = false;
        deviceToDelete.value = null;
        await refreshDevices();
      } finally {
        isDeleting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDashboardPanel = _sfc_main$2;
      const _component_UDashboardNavbar = _sfc_main$1$1;
      const _component_UDashboardSidebarCollapse = _sfc_main$4;
      const _component_UDashboardToolbar = _sfc_main$1$2;
      const _component_UInput = _sfc_main$6;
      const _component_USelect = _sfc_main$5;
      const _component_UTable = _sfc_main$1;
      const _component_UModal = _sfc_main$7;
      const _component_UCard = _sfc_main$9;
      const _component_UForm = _sfc_main$a;
      const _component_UFormField = _sfc_main$b;
      const _component_USelectMenu = _sfc_main$c;
      const _component_UTextarea = _sfc_main$d;
      const _component_UAlert = _sfc_main$e;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_UDashboardPanel, { id: "network-devices" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardNavbar, { title: "Urządzenia sieciowe" }, {
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
                    icon: "i-lucide-map-pin",
                    label: "Węzły"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    to: "/network/ip-networks",
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-network",
                    label: "Sieci IP"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "primary",
                    icon: "i-lucide-plus",
                    label: "Nowe urządzenie",
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
                        icon: "i-lucide-map-pin",
                        label: "Węzły"
                      }),
                      createVNode(unref(UButton), {
                        to: "/network/ip-networks",
                        color: "neutral",
                        variant: "outline",
                        icon: "i-lucide-network",
                        label: "Sieci IP"
                      }),
                      createVNode(unref(UButton), {
                        color: "primary",
                        icon: "i-lucide-plus",
                        label: "Nowe urządzenie",
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
                    placeholder: "Szukaj po nazwie, IP, typie, driverze lub serialu..."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(search),
                      "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                      class: "w-full max-w-md",
                      icon: "i-lucide-search",
                      placeholder: "Szukaj po nazwie, IP, typie, driverze lub serialu..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              right: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-wrap items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(statusFilter),
                    "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                    items: statusItems,
                    class: "min-w-36"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(driverFilter),
                    "onUpdate:modelValue": ($event) => isRef(driverFilter) ? driverFilter.value = $event : null,
                    items: driverItems,
                    class: "min-w-40"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(deviceTypeFilter),
                    "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                    items: deviceTypeItems,
                    class: "min-w-32"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                      createVNode(_component_USelect, {
                        modelValue: unref(statusFilter),
                        "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                        items: statusItems,
                        class: "min-w-36"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_USelect, {
                        modelValue: unref(driverFilter),
                        "onUpdate:modelValue": ($event) => isRef(driverFilter) ? driverFilter.value = $event : null,
                        items: driverItems,
                        class: "min-w-40"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_USelect, {
                        modelValue: unref(deviceTypeFilter),
                        "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                        items: deviceTypeItems,
                        class: "min-w-32"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardNavbar, { title: "Urządzenia sieciowe" }, {
                leading: withCtx(() => [
                  createVNode(_component_UDashboardSidebarCollapse)
                ]),
                right: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                    createVNode(unref(UButton), {
                      to: "/network/nodes",
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-map-pin",
                      label: "Węzły"
                    }),
                    createVNode(unref(UButton), {
                      to: "/network/ip-networks",
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-network",
                      label: "Sieci IP"
                    }),
                    createVNode(unref(UButton), {
                      color: "primary",
                      icon: "i-lucide-plus",
                      label: "Nowe urządzenie",
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
                    placeholder: "Szukaj po nazwie, IP, typie, driverze lub serialu..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                right: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                    createVNode(_component_USelect, {
                      modelValue: unref(statusFilter),
                      "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                      items: statusItems,
                      class: "min-w-36"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_USelect, {
                      modelValue: unref(driverFilter),
                      "onUpdate:modelValue": ($event) => isRef(driverFilter) ? driverFilter.value = $event : null,
                      items: driverItems,
                      class: "min-w-40"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_USelect, {
                      modelValue: unref(deviceTypeFilter),
                      "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                      items: deviceTypeItems,
                      class: "min-w-32"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredDevices),
              columns,
              loading: unref(pendingDevices),
              ui: {
                base: "table-fixed border-separate border-spacing-0",
                thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                tbody: "[&>tr]:last:[&>td]:border-b-0",
                th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                td: "border-b border-default align-top",
                separator: "h-0"
              }
            }, {
              "device-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="min-w-[16rem]"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.name)}</div><div class="mt-1 text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.hostname || "brak hostname")}</div><div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(row.serialNumber || "brak serialu")}</span><span${_scopeId2}>•</span><span${_scopeId2}>${ssrInterpolate(row.macAddress || "brak MAC")}</span></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "min-w-[16rem]" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.hostname || "brak hostname"), 1),
                      createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted" }, [
                        createVNode("span", null, toDisplayString(row.serialNumber || "brak serialu"), 1),
                        createVNode("span", null, "•"),
                        createVNode("span", null, toDisplayString(row.macAddress || "brak MAC"), 1)
                      ])
                    ])
                  ];
                }
              }),
              "management-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.managementIp || "brak IP zarządzania")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.loginUrl || "brak login URL")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.snmpCommunity || "brak SNMP community")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.managementIp || "brak IP zarządzania"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.loginUrl || "brak login URL"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.snmpCommunity || "brak SNMP community"), 1)
                    ])
                  ];
                }
              }),
              "access-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.driverType ? "primary" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(driverLabel(row.driverType))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(driverLabel(row.driverType)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.mgmtUsername || "brak loginu management")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.accessProfile ? `profil #${row.accessProfile.id} · ${row.accessProfile.host}` : "brak profilu discovery")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode(unref(UBadge), {
                        color: row.driverType ? "primary" : "neutral",
                        variant: "subtle"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(driverLabel(row.driverType)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.mgmtUsername || "brak loginu management"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.accessProfile ? `profil #${row.accessProfile.id} · ${row.accessProfile.host}` : "brak profilu discovery"), 1)
                    ])
                  ];
                }
              }),
              "relations-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.netNode?.name || "brak węzła")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.ipNetwork?.name || "brak sieci IP")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(customerLabel(row.customer))}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.netNode?.name || "brak węzła"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.ipNetwork?.name || "brak sieci IP"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(customerLabel(row.customer)), 1)
                    ])
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: statusColor(row.status),
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(statusLabel(row.status))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.deviceType || "other")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode(unref(UBadge), {
                        color: statusColor(row.status),
                        variant: "subtle"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.deviceType || "other"), 1)
                    ])
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
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredDevices),
                columns,
                loading: unref(pendingDevices),
                ui: {
                  base: "table-fixed border-separate border-spacing-0",
                  thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                  tbody: "[&>tr]:last:[&>td]:border-b-0",
                  th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                  td: "border-b border-default align-top",
                  separator: "h-0"
                }
              }, {
                "device-data": withCtx(({ row }) => [
                  createVNode("div", { class: "min-w-[16rem]" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.name), 1),
                    createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.hostname || "brak hostname"), 1),
                    createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted" }, [
                      createVNode("span", null, toDisplayString(row.serialNumber || "brak serialu"), 1),
                      createVNode("span", null, "•"),
                      createVNode("span", null, toDisplayString(row.macAddress || "brak MAC"), 1)
                    ])
                  ])
                ]),
                "management-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.managementIp || "brak IP zarządzania"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.loginUrl || "brak login URL"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.snmpCommunity || "brak SNMP community"), 1)
                  ])
                ]),
                "access-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode(unref(UBadge), {
                      color: row.driverType ? "primary" : "neutral",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(driverLabel(row.driverType)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.mgmtUsername || "brak loginu management"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.accessProfile ? `profil #${row.accessProfile.id} · ${row.accessProfile.host}` : "brak profilu discovery"), 1)
                  ])
                ]),
                "relations-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.netNode?.name || "brak węzła"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.ipNetwork?.name || "brak sieci IP"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(customerLabel(row.customer)), 1)
                  ])
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode(unref(UBadge), {
                      color: statusColor(row.status),
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.deviceType || "other"), 1)
                  ])
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
              }, 8, ["data", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(isModalOpen),
        "onUpdate:open": ($event) => isRef(isModalOpen) ? isModalOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>${ssrInterpolate(unref(form).id ? "Edytuj urządzenie" : "Dodaj urządzenie")}</h3><p class="text-sm text-muted"${_scopeId2}>Katalog backbone inventory wraz z parametrami management i discovery.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj urządzenie" : "Dodaj urządzenie"), 1),
                      createVNode("p", { class: "text-sm text-muted" }, "Katalog backbone inventory wraz z parametrami management i discovery.")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveDevice
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
                          label: "Hostname",
                          name: "hostname"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).hostname,
                                "onUpdate:modelValue": ($event) => unref(form).hostname = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).hostname,
                                  "onUpdate:modelValue": ($event) => unref(form).hostname = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "IP zarządzania",
                          name: "managementIp"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).managementIp,
                                "onUpdate:modelValue": ($event) => unref(form).managementIp = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).managementIp,
                                  "onUpdate:modelValue": ($event) => unref(form).managementIp = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Typ urządzenia",
                          name: "deviceType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).deviceType,
                                "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                items: deviceTypeItems.slice(1)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).deviceType,
                                  "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                  items: deviceTypeItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Status",
                          name: "status"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).status,
                                "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                items: statusItems.slice(1)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).status,
                                  "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                  items: statusItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Numer seryjny",
                          name: "serialNumber"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).serialNumber,
                                "onUpdate:modelValue": ($event) => unref(form).serialNumber = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).serialNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).serialNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "MAC",
                          name: "macAddress"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).macAddress,
                                "onUpdate:modelValue": ($event) => unref(form).macAddress = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).macAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).macAddress = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Driver discovery",
                          name: "driverType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).driverType,
                                "onUpdate:modelValue": ($event) => unref(form).driverType = $event,
                                items: driverItems.slice(1)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).driverType,
                                  "onUpdate:modelValue": ($event) => unref(form).driverType = $event,
                                  items: driverItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Login management",
                          name: "mgmtUsername"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).mgmtUsername,
                                "onUpdate:modelValue": ($event) => unref(form).mgmtUsername = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).mgmtUsername,
                                  "onUpdate:modelValue": ($event) => unref(form).mgmtUsername = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "SNMP community",
                          name: "snmpCommunity"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).snmpCommunity,
                                "onUpdate:modelValue": ($event) => unref(form).snmpCommunity = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).snmpCommunity,
                                  "onUpdate:modelValue": ($event) => unref(form).snmpCommunity = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Login URL",
                          name: "loginUrl"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).loginUrl,
                                "onUpdate:modelValue": ($event) => unref(form).loginUrl = $event,
                                placeholder: "http://10.0.0.1/"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).loginUrl,
                                  "onUpdate:modelValue": ($event) => unref(form).loginUrl = $event,
                                  placeholder: "http://10.0.0.1/"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Węzeł",
                          name: "netNodeId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelectMenu, {
                                modelValue: unref(form).netNodeId,
                                "onUpdate:modelValue": ($event) => unref(form).netNodeId = $event,
                                items: unref(nodeOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).netNodeId,
                                  "onUpdate:modelValue": ($event) => unref(form).netNodeId = $event,
                                  items: unref(nodeOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Sieć IP",
                          name: "ipNetworkId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelectMenu, {
                                modelValue: unref(form).ipNetworkId,
                                "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                                items: unref(networkOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).ipNetworkId,
                                  "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                                  items: unref(networkOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Klient",
                          name: "customerId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelectMenu, {
                                modelValue: unref(form).customerId,
                                "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                                items: unref(customerOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).customerId,
                                  "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                                  items: unref(customerOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Notatki",
                          name: "notes"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(form).notes,
                                "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                                rows: 3,
                                autoresize: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(form).notes,
                                  "onUpdate:modelValue": ($event) => unref(form).notes = $event,
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
                          onClick: ($event) => isModalOpen.value = false
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
                              label: "Hostname",
                              name: "hostname"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).hostname,
                                  "onUpdate:modelValue": ($event) => unref(form).hostname = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "IP zarządzania",
                              name: "managementIp"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).managementIp,
                                  "onUpdate:modelValue": ($event) => unref(form).managementIp = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Typ urządzenia",
                              name: "deviceType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).deviceType,
                                  "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                  items: deviceTypeItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Status",
                              name: "status"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).status,
                                  "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                  items: statusItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Numer seryjny",
                              name: "serialNumber"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).serialNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).serialNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "MAC",
                              name: "macAddress"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).macAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).macAddress = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Driver discovery",
                              name: "driverType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).driverType,
                                  "onUpdate:modelValue": ($event) => unref(form).driverType = $event,
                                  items: driverItems.slice(1)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Login management",
                              name: "mgmtUsername"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).mgmtUsername,
                                  "onUpdate:modelValue": ($event) => unref(form).mgmtUsername = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "SNMP community",
                              name: "snmpCommunity"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).snmpCommunity,
                                  "onUpdate:modelValue": ($event) => unref(form).snmpCommunity = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Login URL",
                              name: "loginUrl"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).loginUrl,
                                  "onUpdate:modelValue": ($event) => unref(form).loginUrl = $event,
                                  placeholder: "http://10.0.0.1/"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "Węzeł",
                              name: "netNodeId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).netNodeId,
                                  "onUpdate:modelValue": ($event) => unref(form).netNodeId = $event,
                                  items: unref(nodeOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Sieć IP",
                              name: "ipNetworkId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).ipNetworkId,
                                  "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                                  items: unref(networkOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Klient",
                              name: "customerId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).customerId,
                                  "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                                  items: unref(customerOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_UFormField, {
                            label: "Notatki",
                            name: "notes"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(form).notes,
                                "onUpdate:modelValue": ($event) => unref(form).notes = $event,
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
                              onClick: ($event) => isModalOpen.value = false
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
                      onSubmit: saveDevice
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
                            label: "Hostname",
                            name: "hostname"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).hostname,
                                "onUpdate:modelValue": ($event) => unref(form).hostname = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "IP zarządzania",
                            name: "managementIp"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).managementIp,
                                "onUpdate:modelValue": ($event) => unref(form).managementIp = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Typ urządzenia",
                            name: "deviceType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).deviceType,
                                "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                items: deviceTypeItems.slice(1)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Status",
                            name: "status"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).status,
                                "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                items: statusItems.slice(1)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Numer seryjny",
                            name: "serialNumber"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).serialNumber,
                                "onUpdate:modelValue": ($event) => unref(form).serialNumber = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "MAC",
                            name: "macAddress"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).macAddress,
                                "onUpdate:modelValue": ($event) => unref(form).macAddress = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Driver discovery",
                            name: "driverType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).driverType,
                                "onUpdate:modelValue": ($event) => unref(form).driverType = $event,
                                items: driverItems.slice(1)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Login management",
                            name: "mgmtUsername"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).mgmtUsername,
                                "onUpdate:modelValue": ($event) => unref(form).mgmtUsername = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "SNMP community",
                            name: "snmpCommunity"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).snmpCommunity,
                                "onUpdate:modelValue": ($event) => unref(form).snmpCommunity = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Login URL",
                            name: "loginUrl"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).loginUrl,
                                "onUpdate:modelValue": ($event) => unref(form).loginUrl = $event,
                                placeholder: "http://10.0.0.1/"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "Węzeł",
                            name: "netNodeId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelectMenu, {
                                modelValue: unref(form).netNodeId,
                                "onUpdate:modelValue": ($event) => unref(form).netNodeId = $event,
                                items: unref(nodeOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Sieć IP",
                            name: "ipNetworkId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelectMenu, {
                                modelValue: unref(form).ipNetworkId,
                                "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                                items: unref(networkOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Klient",
                            name: "customerId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelectMenu, {
                                modelValue: unref(form).customerId,
                                "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                                items: unref(customerOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(_component_UFormField, {
                          label: "Notatki",
                          name: "notes"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(form).notes,
                              "onUpdate:modelValue": ($event) => unref(form).notes = $event,
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
                            onClick: ($event) => isModalOpen.value = false
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, toDisplayString(unref(form).id ? "Edytuj urządzenie" : "Dodaj urządzenie"), 1),
                    createVNode("p", { class: "text-sm text-muted" }, "Katalog backbone inventory wraz z parametrami management i discovery.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    state: unref(form),
                    class: "space-y-4",
                    onSubmit: saveDevice
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
                          label: "Hostname",
                          name: "hostname"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).hostname,
                              "onUpdate:modelValue": ($event) => unref(form).hostname = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "IP zarządzania",
                          name: "managementIp"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).managementIp,
                              "onUpdate:modelValue": ($event) => unref(form).managementIp = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Typ urządzenia",
                          name: "deviceType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).deviceType,
                              "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                              items: deviceTypeItems.slice(1)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Status",
                          name: "status"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).status,
                              "onUpdate:modelValue": ($event) => unref(form).status = $event,
                              items: statusItems.slice(1)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Numer seryjny",
                          name: "serialNumber"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).serialNumber,
                              "onUpdate:modelValue": ($event) => unref(form).serialNumber = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "MAC",
                          name: "macAddress"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).macAddress,
                              "onUpdate:modelValue": ($event) => unref(form).macAddress = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Driver discovery",
                          name: "driverType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).driverType,
                              "onUpdate:modelValue": ($event) => unref(form).driverType = $event,
                              items: driverItems.slice(1)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Login management",
                          name: "mgmtUsername"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).mgmtUsername,
                              "onUpdate:modelValue": ($event) => unref(form).mgmtUsername = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "SNMP community",
                          name: "snmpCommunity"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).snmpCommunity,
                              "onUpdate:modelValue": ($event) => unref(form).snmpCommunity = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Login URL",
                          name: "loginUrl"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).loginUrl,
                              "onUpdate:modelValue": ($event) => unref(form).loginUrl = $event,
                              placeholder: "http://10.0.0.1/"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "Węzeł",
                          name: "netNodeId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(form).netNodeId,
                              "onUpdate:modelValue": ($event) => unref(form).netNodeId = $event,
                              items: unref(nodeOptions),
                              "value-key": "value",
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Sieć IP",
                          name: "ipNetworkId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(form).ipNetworkId,
                              "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                              items: unref(networkOptions),
                              "value-key": "value",
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Klient",
                          name: "customerId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(form).customerId,
                              "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                              items: unref(customerOptions),
                              "value-key": "value",
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Notatki",
                        name: "notes"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).notes,
                            "onUpdate:modelValue": ($event) => unref(form).notes = $event,
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
                          onClick: ($event) => isModalOpen.value = false
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
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>Usuń urządzenie</h3><p class="text-sm text-muted"${_scopeId2}>Ta operacja usunie rekord z katalogu urządzeń sieciowych.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń urządzenie"),
                      createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usunie rekord z katalogu urządzeń sieciowych.")
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
                    title: unref(deviceToDelete) ? `Usunąć urządzenie ${unref(deviceToDelete).name}?` : "Brak urządzenia do usunięcia."
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
                        title: unref(deviceToDelete) ? `Usunąć urządzenie ${unref(deviceToDelete).name}?` : "Brak urządzenia do usunięcia."
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń urządzenie"),
                    createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usunie rekord z katalogu urządzeń sieciowych.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UAlert, {
                      color: "error",
                      variant: "soft",
                      icon: "i-lucide-triangle-alert",
                      title: unref(deviceToDelete) ? `Usunąć urządzenie ${unref(deviceToDelete).name}?` : "Brak urządzenia do usunięcia."
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/network/devices.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=devices-CAVGfHGk.mjs.map
