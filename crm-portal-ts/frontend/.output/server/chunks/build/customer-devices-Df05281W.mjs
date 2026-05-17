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
import { ref, reactive, computed, withAsyncContext, withCtx, unref, createVNode, createTextVNode, toDisplayString, isRef, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useFetch } from './fetch-BurXZm7-.mjs';
import { u as useManagedTerytAddress } from './useManagedTerytAddress-DhPAJB2n.mjs';
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
  __name: "customer-devices",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const UBadge = _sfc_main$3;
    const UButton = _sfc_main$8;
    const UDropdownMenu = _sfc_main$2$1;
    const toast = useToast();
    const search = ref("");
    const statusFilter = ref("all");
    const deviceTypeFilter = ref("all");
    const vendorFilter = ref("all");
    const isEditorOpen = ref(false);
    const isSaving = ref(false);
    const isDeleteModalOpen = ref(false);
    const isDeleting = ref(false);
    const deviceToDelete = ref(null);
    const columns = [
      { accessorKey: "hostname", header: "Urządzenie" },
      { accessorKey: "customer", header: "Klient" },
      { accessorKey: "deviceType", header: "Typ" },
      { accessorKey: "network", header: "Sieć" },
      { accessorKey: "origin", header: "Źródło" },
      { accessorKey: "status", header: "Status" },
      { id: "actions", header: "" }
    ];
    const form = reactive({
      id: null,
      customerId: null,
      name: "",
      hostname: "",
      deviceType: "",
      login: "",
      passwd: "",
      ipAddress: "",
      macAddress: "",
      status: "active",
      notes: "",
      netDeviceId: null,
      ipNetworkId: null,
      remoteVendor: "",
      remoteSerialNumber: "",
      remoteOlt: "",
      remoteOnu: "",
      remotePort: "",
      remoteProfileName: "",
      installationCityId: null,
      installationStreetId: null,
      installationCity: "",
      installationStreet: "",
      installationStreetNumber: "",
      installationApartmentNumber: "",
      installationPostalCode: "",
      locationDescription: ""
    });
    const query = computed(() => ({
      q: search.value || void 0,
      limit: 500
    }));
    const { data: devices, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customer-devices",
      {
        query,
        default: () => []
      },
      "$hcTmz5xTsG"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 500 },
        default: () => []
      },
      "$rXf593C8Ga"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: netDevices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/net-devices",
      {
        default: () => []
      },
      "$vsTZK4eEbl"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: ipNetworks } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/ip-networks",
      {
        default: () => []
      },
      "$O8ROo0NiWp"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: defaultArea } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/addresses/default-area",
      "$5CGhkpVypb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const addressFieldMap = {
      cityId: "installationCityId",
      streetId: "installationStreetId",
      city: "installationCity",
      street: "installationStreet"
    };
    const installationAddress = useManagedTerytAddress(form, addressFieldMap, defaultArea);
    const preparedDevices = computed(
      () => (devices.value || []).map((device) => ({
        ...device,
        customerDisplayName: device.customer?.companyName || [device.customer?.firstName, device.customer?.lastName].filter(Boolean).join(" ") || "Nieprzypisany klient",
        customerCode: device.customer?.customerCode || null
      }))
    );
    const filteredDevices = computed(
      () => preparedDevices.value.filter((device) => {
        if (statusFilter.value !== "all" && device.status !== statusFilter.value) {
          return false;
        }
        if (deviceTypeFilter.value === "onu" && device.deviceType !== "onu") {
          return false;
        }
        if (deviceTypeFilter.value === "other" && device.deviceType === "onu") {
          return false;
        }
        if (vendorFilter.value === "dasan" && device.remoteVendor !== "dasan") {
          return false;
        }
        if (vendorFilter.value === "mikrotik" && device.remoteVendor !== "mikrotik") {
          return false;
        }
        if (vendorFilter.value === "manual" && device.remoteVendor) {
          return false;
        }
        return true;
      })
    );
    const customerOptions = computed(() => [
      { label: "Wybierz klienta", value: null },
      ...(customers.value || []).map((customer) => ({
        label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.customerCode,
        value: customer.id
      }))
    ]);
    const netDeviceOptions = computed(() => [
      { label: "Brak urządzenia sieciowego", value: null },
      ...(netDevices.value || []).map((device) => ({
        label: device.name,
        value: device.id
      }))
    ]);
    const ipNetworkOptions = computed(() => [
      { label: "Brak sieci IP", value: null },
      ...(ipNetworks.value || []).map((network) => ({
        label: `${network.name} (${network.cidr})`,
        value: network.id
      }))
    ]);
    function getRowItems(row) {
      return [[{
        type: "label",
        label: row.hostname
      }], [{
        label: "Otwórz klienta",
        icon: "i-lucide-user",
        onSelect: async () => {
          if (row.customerId) {
            await navigateTo(`/customers/${row.customerId}`);
          }
        }
      }, {
        label: "Diagnostyka w operacjach",
        icon: "i-lucide-wrench",
        onSelect: async () => {
          await navigateTo(`/operations?deviceId=${row.id}&mode=diagnostics`);
        }
      }, {
        label: "Edytuj urządzenie",
        icon: "i-lucide-pencil",
        onSelect: async () => {
          await openEditor(row.id);
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
    const statusItems = [
      { label: "Wszystkie statusy", value: "all" },
      { label: "Aktywny", value: "active" },
      { label: "Nieaktywny", value: "inactive" },
      { label: "Uszkodzony", value: "broken" }
    ];
    const typeItems = [
      { label: "Wszystkie typy", value: "all" },
      { label: "ONU", value: "onu" },
      { label: "Pozostałe", value: "other" }
    ];
    const vendorItems = [
      { label: "Wszystkie źródła", value: "all" },
      { label: "Dasan", value: "dasan" },
      { label: "Mikrotik", value: "mikrotik" },
      { label: "Manualne", value: "manual" }
    ];
    const statusOptions = [
      { label: "Aktywny", value: "active" },
      { label: "Nieaktywny", value: "inactive" },
      { label: "Uszkodzony", value: "broken" }
    ];
    const deviceTypeOptions = [
      { label: "ONU", value: "onu" },
      { label: "Router CPE", value: "router" },
      { label: "AP", value: "ap" },
      { label: "Inne", value: "other" }
    ];
    const vendorOptions = [
      { label: "Brak vendor lock", value: "" },
      { label: "Dasan", value: "dasan" },
      { label: "Mikrotik", value: "mikrotik" }
    ];
    const statusLabel = (status) => {
      switch (status) {
        case "active":
          return "Aktywny";
        case "inactive":
          return "Nieaktywny";
        case "broken":
          return "Uszkodzony";
        default:
          return status || "Nieznany";
      }
    };
    const statusColor = (status) => {
      switch (status) {
        case "active":
          return "success";
        case "inactive":
          return "neutral";
        case "broken":
          return "error";
        default:
          return "neutral";
      }
    };
    const deviceTypeLabel = (deviceType) => {
      return deviceType === "onu" ? "ONU" : deviceType || "inne";
    };
    const vendorLabel = (vendor) => {
      if (vendor === "dasan") return "Dasan";
      if (vendor === "mikrotik") return "Mikrotik";
      return "manualny";
    };
    const formatRemoteDetails = (device) => {
      if (device.remoteVendor === "dasan") {
        const onu = [device.remoteOlt, device.remoteOnu].every((value) => value !== null && value !== void 0) ? `OLT ${device.remoteOlt} / ONU ${device.remoteOnu}` : null;
        return [onu, device.remoteSerialNumber, device.remotePort].filter(Boolean).join(" · ") || "rekord discovery";
      }
      return device.remoteSerialNumber || device.remotePort || "rekord lokalny";
    };
    const formatStreet = (street, number, apartment) => {
      const line = [street, number].filter(Boolean).join(" ");
      if (!line && !apartment) {
        return "brak adresu";
      }
      return apartment ? `${line}/${apartment}` : line || "brak adresu";
    };
    const resetForm = () => {
      Object.assign(form, {
        id: null,
        customerId: null,
        name: "",
        hostname: "",
        deviceType: "",
        login: "",
        passwd: "",
        ipAddress: "",
        macAddress: "",
        status: "active",
        notes: "",
        netDeviceId: null,
        ipNetworkId: null,
        remoteVendor: "",
        remoteSerialNumber: "",
        remoteOlt: "",
        remoteOnu: "",
        remotePort: "",
        remoteProfileName: "",
        installationCityId: null,
        installationStreetId: null,
        installationCity: "",
        installationStreet: "",
        installationStreetNumber: "",
        installationApartmentNumber: "",
        installationPostalCode: "",
        locationDescription: ""
      });
    };
    const openEditor = async (id) => {
      const device = await $fetch(`/api/v1/customer-devices/${id}`);
      Object.assign(form, {
        id: device.id,
        customerId: device.customerId ?? null,
        name: device.name || "",
        hostname: device.hostname || "",
        deviceType: device.deviceType || "",
        login: device.login || "",
        passwd: "",
        ipAddress: device.ipAddress || "",
        macAddress: device.macAddress || "",
        status: device.status || "active",
        notes: device.notes || "",
        netDeviceId: device.netDeviceId ?? null,
        ipNetworkId: device.ipNetworkId ?? null,
        remoteVendor: device.remoteVendor || "",
        remoteSerialNumber: device.remoteSerialNumber || "",
        remoteOlt: device.remoteOlt ?? "",
        remoteOnu: device.remoteOnu ?? "",
        remotePort: device.remotePort || "",
        remoteProfileName: device.remoteProfileName || "",
        installationCityId: device.installationCityEntry?.id || device.installationCityId || null,
        installationStreetId: device.installationStreetEntry?.id || device.installationStreetId || null,
        installationCity: device.installationCity || "",
        installationStreet: device.installationStreet || "",
        installationStreetNumber: device.installationStreetNumber || "",
        installationApartmentNumber: device.installationApartmentNumber || "",
        installationPostalCode: device.installationPostalCode || "",
        locationDescription: device.locationDescription || ""
      });
      installationAddress.clearSuggestions();
      isEditorOpen.value = true;
    };
    const saveDevice = async () => {
      isSaving.value = true;
      try {
        await $fetch(`/api/v1/customer-devices/${form.id}`, {
          method: "PUT",
          body: {
            customerId: form.customerId,
            name: form.name || null,
            hostname: form.hostname,
            deviceType: form.deviceType || null,
            login: form.login || null,
            passwd: form.passwd || void 0,
            ipAddress: form.ipAddress || null,
            macAddress: form.macAddress || null,
            status: form.status,
            notes: form.notes || null,
            netDeviceId: form.netDeviceId,
            ipNetworkId: form.ipNetworkId,
            remoteVendor: form.remoteVendor || null,
            remoteSerialNumber: form.remoteSerialNumber || null,
            remoteOlt: form.remoteOlt === "" ? null : Number(form.remoteOlt),
            remoteOnu: form.remoteOnu === "" ? null : Number(form.remoteOnu),
            remotePort: form.remotePort || null,
            remoteProfileName: form.remoteProfileName || null,
            installationCityId: form.installationCityId,
            installationStreetId: form.installationStreetId,
            installationCity: form.installationCity || null,
            installationStreet: form.installationStreet || null,
            installationStreetNumber: form.installationStreetNumber || null,
            installationApartmentNumber: form.installationApartmentNumber || null,
            installationPostalCode: form.installationPostalCode || null,
            locationDescription: form.locationDescription || null
          }
        });
        toast.add({
          title: "Urządzenie zapisane",
          description: `${form.hostname} zostało zaktualizowane.`,
          color: "success"
        });
        isEditorOpen.value = false;
        resetForm();
        await refresh();
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
        await $fetch(`/api/v1/customer-devices/${deviceToDelete.value.id}`, {
          method: "DELETE"
        });
        toast.add({
          title: "Urządzenie usunięte",
          description: `${deviceToDelete.value.hostname} zostało usunięte.`,
          color: "success"
        });
        isDeleteModalOpen.value = false;
        deviceToDelete.value = null;
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
      _push(ssrRenderComponent(_component_UDashboardPanel, { id: "customer-devices" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardNavbar, { title: "Urządzenia klientów" }, {
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
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-refresh-cw",
                    label: "Odśwież",
                    onClick: unref(refresh)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UButton), {
                      color: "neutral",
                      variant: "outline",
                      icon: "i-lucide-refresh-cw",
                      label: "Odśwież",
                      onClick: unref(refresh)
                    }, null, 8, ["onClick"])
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
                    placeholder: "Szukaj po hoście, IP, MAC lub adresie..."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(search),
                      "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                      class: "w-full max-w-md",
                      icon: "i-lucide-search",
                      placeholder: "Szukaj po hoście, IP, MAC lub adresie..."
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
                    class: "min-w-32"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(deviceTypeFilter),
                    "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                    items: typeItems,
                    class: "min-w-32"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(vendorFilter),
                    "onUpdate:modelValue": ($event) => isRef(vendorFilter) ? vendorFilter.value = $event : null,
                    items: vendorItems,
                    class: "min-w-36"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                      createVNode(_component_USelect, {
                        modelValue: unref(statusFilter),
                        "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                        items: statusItems,
                        class: "min-w-32"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_USelect, {
                        modelValue: unref(deviceTypeFilter),
                        "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                        items: typeItems,
                        class: "min-w-32"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_USelect, {
                        modelValue: unref(vendorFilter),
                        "onUpdate:modelValue": ($event) => isRef(vendorFilter) ? vendorFilter.value = $event : null,
                        items: vendorItems,
                        class: "min-w-36"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardNavbar, { title: "Urządzenia klientów" }, {
                leading: withCtx(() => [
                  createVNode(_component_UDashboardSidebarCollapse)
                ]),
                right: withCtx(() => [
                  createVNode(unref(UButton), {
                    color: "neutral",
                    variant: "outline",
                    icon: "i-lucide-refresh-cw",
                    label: "Odśwież",
                    onClick: unref(refresh)
                  }, null, 8, ["onClick"])
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
                    placeholder: "Szukaj po hoście, IP, MAC lub adresie..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                right: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                    createVNode(_component_USelect, {
                      modelValue: unref(statusFilter),
                      "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                      items: statusItems,
                      class: "min-w-32"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_USelect, {
                      modelValue: unref(deviceTypeFilter),
                      "onUpdate:modelValue": ($event) => isRef(deviceTypeFilter) ? deviceTypeFilter.value = $event : null,
                      items: typeItems,
                      class: "min-w-32"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_USelect, {
                      modelValue: unref(vendorFilter),
                      "onUpdate:modelValue": ($event) => isRef(vendorFilter) ? vendorFilter.value = $event : null,
                      items: vendorItems,
                      class: "min-w-36"
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
              "hostname-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="min-w-[16rem]"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.hostname)}</div><div class="mt-1 text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.name || "bez nazwy pomocniczej")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "min-w-[16rem]" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.hostname), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.name || "bez nazwy pomocniczej"), 1)
                    ])
                  ];
                }
              }),
              "customer-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.customerDisplayName)}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.customerCode || "bez kodu")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.customerDisplayName), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.customerCode || "bez kodu"), 1)
                    ])
                  ];
                }
              }),
              "deviceType-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.deviceType === "onu" ? "primary" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(deviceTypeLabel(row.deviceType))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(deviceTypeLabel(row.deviceType)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: row.deviceType === "onu" ? "primary" : "neutral",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(deviceTypeLabel(row.deviceType)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "network-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.ipAddress || "brak IP")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.macAddress || "brak MAC")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(formatStreet(row.installationStreet, row.installationStreetNumber, row.installationApartmentNumber))}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.ipAddress || "brak IP"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.macAddress || "brak MAC"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(formatStreet(row.installationStreet, row.installationStreetNumber, row.installationApartmentNumber)), 1)
                    ])
                  ];
                }
              }),
              "origin-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.remoteVendor === "dasan" ? "warning" : row.remoteVendor === "mikrotik" ? "primary" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(vendorLabel(row.remoteVendor))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(vendorLabel(row.remoteVendor)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(formatRemoteDetails(row))}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode(unref(UBadge), {
                        color: row.remoteVendor === "dasan" ? "warning" : row.remoteVendor === "mikrotik" ? "primary" : "neutral",
                        variant: "subtle"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(vendorLabel(row.remoteVendor)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(formatRemoteDetails(row)), 1)
                    ])
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
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
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: statusColor(row.status),
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusLabel(row.status)), 1)
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
            _push2(`<div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4"${_scopeId}><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(filteredDevices).length)} z ${ssrInterpolate(unref(devices)?.length || 0)} urządzeń widocznych </div></div>`);
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(filteredDevices),
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
                "hostname-data": withCtx(({ row }) => [
                  createVNode("div", { class: "min-w-[16rem]" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.hostname), 1),
                    createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(row.name || "bez nazwy pomocniczej"), 1)
                  ])
                ]),
                "customer-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.customerDisplayName), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.customerCode || "bez kodu"), 1)
                  ])
                ]),
                "deviceType-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: row.deviceType === "onu" ? "primary" : "neutral",
                    variant: "subtle"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(deviceTypeLabel(row.deviceType)), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "network-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.ipAddress || "brak IP"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.macAddress || "brak MAC"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(formatStreet(row.installationStreet, row.installationStreetNumber, row.installationApartmentNumber)), 1)
                  ])
                ]),
                "origin-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode(unref(UBadge), {
                      color: row.remoteVendor === "dasan" ? "warning" : row.remoteVendor === "mikrotik" ? "primary" : "neutral",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(vendorLabel(row.remoteVendor)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(formatRemoteDetails(row)), 1)
                  ])
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: statusColor(row.status),
                    variant: "subtle"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(statusLabel(row.status)), 1)
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
                createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(filteredDevices).length) + " z " + toDisplayString(unref(devices)?.length || 0) + " urządzeń widocznych ", 1)
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
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>Edytuj urządzenie klienta</h3><p class="text-sm text-muted"${_scopeId2}>Dane techniczne, powiązania discovery i adres instalacyjny.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Edytuj urządzenie klienta"),
                      createVNode("p", { class: "text-sm text-muted" }, "Dane techniczne, powiązania discovery i adres instalacyjny.")
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
                          label: "Klient",
                          name: "customerId",
                          required: ""
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
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Hostname",
                          name: "hostname",
                          required: ""
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
                          label: "Nazwa pomocnicza",
                          name: "name"
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
                          label: "Typ urządzenia",
                          name: "deviceType"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).deviceType,
                                "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                items: deviceTypeOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).deviceType,
                                  "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                  items: deviceTypeOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                items: statusOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).status,
                                  "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                  items: statusOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "IP",
                          name: "ipAddress"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).ipAddress,
                                "onUpdate:modelValue": ($event) => unref(form).ipAddress = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).ipAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).ipAddress = $event
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
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Login",
                          name: "login"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).login,
                                "onUpdate:modelValue": ($event) => unref(form).login = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).login,
                                  "onUpdate:modelValue": ($event) => unref(form).login = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Urządzenie sieciowe",
                          name: "netDeviceId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelectMenu, {
                                modelValue: unref(form).netDeviceId,
                                "onUpdate:modelValue": ($event) => unref(form).netDeviceId = $event,
                                items: unref(netDeviceOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).netDeviceId,
                                  "onUpdate:modelValue": ($event) => unref(form).netDeviceId = $event,
                                  items: unref(netDeviceOptions),
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
                                items: unref(ipNetworkOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).ipNetworkId,
                                  "onUpdate:modelValue": ($event) => unref(form).ipNetworkId = $event,
                                  items: unref(ipNetworkOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Vendor discovery",
                          name: "remoteVendor"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(form).remoteVendor,
                                "onUpdate:modelValue": ($event) => unref(form).remoteVendor = $event,
                                items: vendorOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).remoteVendor,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteVendor = $event,
                                  items: vendorOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Serial zdalny",
                          name: "remoteSerialNumber"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).remoteSerialNumber,
                                "onUpdate:modelValue": ($event) => unref(form).remoteSerialNumber = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteSerialNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteSerialNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "OLT",
                          name: "remoteOlt"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).remoteOlt,
                                "onUpdate:modelValue": ($event) => unref(form).remoteOlt = $event,
                                type: "number"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteOlt,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteOlt = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "ONU",
                          name: "remoteOnu"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).remoteOnu,
                                "onUpdate:modelValue": ($event) => unref(form).remoteOnu = $event,
                                type: "number"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteOnu,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteOnu = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Port zdalny",
                          name: "remotePort"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).remotePort,
                                "onUpdate:modelValue": ($event) => unref(form).remotePort = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remotePort,
                                  "onUpdate:modelValue": ($event) => unref(form).remotePort = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex items-center justify-between gap-3"${_scopeId3}><div class="text-sm text-muted"${_scopeId3}> Adres instalacyjny korzysta z miast zarządzanych i słowników TERYT. </div>`);
                        _push4(ssrRenderComponent(unref(UButton), {
                          color: "neutral",
                          variant: "outline",
                          size: "sm",
                          label: "Użyj domyślnego miasta",
                          onClick: unref(installationAddress).applyDefaultArea
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Miasto instalacji",
                          name: "installationCity"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).installationCity,
                                "onUpdate:modelValue": ($event) => unref(form).installationCity = $event,
                                onInput: unref(installationAddress).onCityInput
                              }, null, _parent5, _scopeId4));
                              if (unref(installationAddress).suggestions.cities.length) {
                                _push5(`<div class="mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"${_scopeId4}><!--[-->`);
                                ssrRenderList(unref(installationAddress).suggestions.cities, (suggestion) => {
                                  _push5(`<button type="button" class="w-full px-3 py-2 text-left text-sm hover:bg-elevated"${_scopeId4}><div class="font-medium text-highlighted"${_scopeId4}>${ssrInterpolate(suggestion.text)}</div></button>`);
                                });
                                _push5(`<!--]--></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationCity,
                                  "onUpdate:modelValue": ($event) => unref(form).installationCity = $event,
                                  onInput: unref(installationAddress).onCityInput
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                                unref(installationAddress).suggestions.cities.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.cities, (suggestion) => {
                                    return openBlock(), createBlock("button", {
                                      key: suggestion.id,
                                      type: "button",
                                      class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                      onClick: ($event) => unref(installationAddress).selectCity(suggestion)
                                    }, [
                                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                    ], 8, ["onClick"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Ulica instalacji",
                          name: "installationStreet"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).installationStreet,
                                "onUpdate:modelValue": ($event) => unref(form).installationStreet = $event,
                                onInput: unref(installationAddress).onStreetInput
                              }, null, _parent5, _scopeId4));
                              if (unref(installationAddress).suggestions.streets.length) {
                                _push5(`<div class="mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"${_scopeId4}><!--[-->`);
                                ssrRenderList(unref(installationAddress).suggestions.streets, (suggestion) => {
                                  _push5(`<button type="button" class="w-full px-3 py-2 text-left text-sm hover:bg-elevated"${_scopeId4}><div class="font-medium text-highlighted"${_scopeId4}>${ssrInterpolate(suggestion.text)}</div></button>`);
                                });
                                _push5(`<!--]--></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationStreet,
                                  "onUpdate:modelValue": ($event) => unref(form).installationStreet = $event,
                                  onInput: unref(installationAddress).onStreetInput
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                                unref(installationAddress).suggestions.streets.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.streets, (suggestion) => {
                                    return openBlock(), createBlock("button", {
                                      key: suggestion.id,
                                      type: "button",
                                      class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                      onClick: ($event) => unref(installationAddress).selectStreet(suggestion)
                                    }, [
                                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                    ], 8, ["onClick"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="grid gap-4 md:grid-cols-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Nr budynku",
                          name: "installationStreetNumber"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).installationStreetNumber,
                                "onUpdate:modelValue": ($event) => unref(form).installationStreetNumber = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationStreetNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).installationStreetNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Nr lokalu",
                          name: "installationApartmentNumber"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).installationApartmentNumber,
                                "onUpdate:modelValue": ($event) => unref(form).installationApartmentNumber = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationApartmentNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).installationApartmentNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Kod pocztowy",
                          name: "installationPostalCode"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).installationPostalCode,
                                "onUpdate:modelValue": ($event) => unref(form).installationPostalCode = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationPostalCode,
                                  "onUpdate:modelValue": ($event) => unref(form).installationPostalCode = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_UFormField, {
                          label: "Opis lokalizacji",
                          name: "locationDescription"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(form).locationDescription,
                                "onUpdate:modelValue": ($event) => unref(form).locationDescription = $event,
                                rows: 2,
                                autoresize: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(form).locationDescription,
                                  "onUpdate:modelValue": ($event) => unref(form).locationDescription = $event,
                                  rows: 2,
                                  autoresize: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
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
                              label: "Klient",
                              name: "customerId",
                              required: ""
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
                            }),
                            createVNode(_component_UFormField, {
                              label: "Hostname",
                              name: "hostname",
                              required: ""
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
                              label: "Nazwa pomocnicza",
                              name: "name"
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
                              label: "Typ urządzenia",
                              name: "deviceType"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).deviceType,
                                  "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                  items: deviceTypeOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                  items: statusOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "IP",
                              name: "ipAddress"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).ipAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).ipAddress = $event
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
                            }),
                            createVNode(_component_UFormField, {
                              label: "Login",
                              name: "login"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).login,
                                  "onUpdate:modelValue": ($event) => unref(form).login = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "Urządzenie sieciowe",
                              name: "netDeviceId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).netDeviceId,
                                  "onUpdate:modelValue": ($event) => unref(form).netDeviceId = $event,
                                  items: unref(netDeviceOptions),
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
                                  items: unref(ipNetworkOptions),
                                  "value-key": "value",
                                  "label-key": "label"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Vendor discovery",
                              name: "remoteVendor"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(form).remoteVendor,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteVendor = $event,
                                  items: vendorOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-4" }, [
                            createVNode(_component_UFormField, {
                              label: "Serial zdalny",
                              name: "remoteSerialNumber"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteSerialNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteSerialNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "OLT",
                              name: "remoteOlt"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteOlt,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteOlt = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "ONU",
                              name: "remoteOnu"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remoteOnu,
                                  "onUpdate:modelValue": ($event) => unref(form).remoteOnu = $event,
                                  type: "number"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Port zdalny",
                              name: "remotePort"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).remotePort,
                                  "onUpdate:modelValue": ($event) => unref(form).remotePort = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                            createVNode("div", { class: "text-sm text-muted" }, " Adres instalacyjny korzysta z miast zarządzanych i słowników TERYT. "),
                            createVNode(unref(UButton), {
                              color: "neutral",
                              variant: "outline",
                              size: "sm",
                              label: "Użyj domyślnego miasta",
                              onClick: unref(installationAddress).applyDefaultArea
                            }, null, 8, ["onClick"])
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                            createVNode(_component_UFormField, {
                              label: "Miasto instalacji",
                              name: "installationCity"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationCity,
                                  "onUpdate:modelValue": ($event) => unref(form).installationCity = $event,
                                  onInput: unref(installationAddress).onCityInput
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                                unref(installationAddress).suggestions.cities.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.cities, (suggestion) => {
                                    return openBlock(), createBlock("button", {
                                      key: suggestion.id,
                                      type: "button",
                                      class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                      onClick: ($event) => unref(installationAddress).selectCity(suggestion)
                                    }, [
                                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                    ], 8, ["onClick"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Ulica instalacji",
                              name: "installationStreet"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationStreet,
                                  "onUpdate:modelValue": ($event) => unref(form).installationStreet = $event,
                                  onInput: unref(installationAddress).onStreetInput
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                                unref(installationAddress).suggestions.streets.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.streets, (suggestion) => {
                                    return openBlock(), createBlock("button", {
                                      key: suggestion.id,
                                      type: "button",
                                      class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                      onClick: ($event) => unref(installationAddress).selectStreet(suggestion)
                                    }, [
                                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                    ], 8, ["onClick"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                            createVNode(_component_UFormField, {
                              label: "Nr budynku",
                              name: "installationStreetNumber"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationStreetNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).installationStreetNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Nr lokalu",
                              name: "installationApartmentNumber"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationApartmentNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).installationApartmentNumber = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Kod pocztowy",
                              name: "installationPostalCode"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).installationPostalCode,
                                  "onUpdate:modelValue": ($event) => unref(form).installationPostalCode = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_UFormField, {
                            label: "Opis lokalizacji",
                            name: "locationDescription"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(form).locationDescription,
                                "onUpdate:modelValue": ($event) => unref(form).locationDescription = $event,
                                rows: 2,
                                autoresize: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
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
                      onSubmit: saveDevice
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Klient",
                            name: "customerId",
                            required: ""
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
                          }),
                          createVNode(_component_UFormField, {
                            label: "Hostname",
                            name: "hostname",
                            required: ""
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
                            label: "Nazwa pomocnicza",
                            name: "name"
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
                            label: "Typ urządzenia",
                            name: "deviceType"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).deviceType,
                                "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                                items: deviceTypeOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                items: statusOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "IP",
                            name: "ipAddress"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).ipAddress,
                                "onUpdate:modelValue": ($event) => unref(form).ipAddress = $event
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
                          }),
                          createVNode(_component_UFormField, {
                            label: "Login",
                            name: "login"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).login,
                                "onUpdate:modelValue": ($event) => unref(form).login = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "Urządzenie sieciowe",
                            name: "netDeviceId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelectMenu, {
                                modelValue: unref(form).netDeviceId,
                                "onUpdate:modelValue": ($event) => unref(form).netDeviceId = $event,
                                items: unref(netDeviceOptions),
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
                                items: unref(ipNetworkOptions),
                                "value-key": "value",
                                "label-key": "label"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Vendor discovery",
                            name: "remoteVendor"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(form).remoteVendor,
                                "onUpdate:modelValue": ($event) => unref(form).remoteVendor = $event,
                                items: vendorOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-4" }, [
                          createVNode(_component_UFormField, {
                            label: "Serial zdalny",
                            name: "remoteSerialNumber"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).remoteSerialNumber,
                                "onUpdate:modelValue": ($event) => unref(form).remoteSerialNumber = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "OLT",
                            name: "remoteOlt"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).remoteOlt,
                                "onUpdate:modelValue": ($event) => unref(form).remoteOlt = $event,
                                type: "number"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "ONU",
                            name: "remoteOnu"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).remoteOnu,
                                "onUpdate:modelValue": ($event) => unref(form).remoteOnu = $event,
                                type: "number"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Port zdalny",
                            name: "remotePort"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).remotePort,
                                "onUpdate:modelValue": ($event) => unref(form).remotePort = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                          createVNode("div", { class: "text-sm text-muted" }, " Adres instalacyjny korzysta z miast zarządzanych i słowników TERYT. "),
                          createVNode(unref(UButton), {
                            color: "neutral",
                            variant: "outline",
                            size: "sm",
                            label: "Użyj domyślnego miasta",
                            onClick: unref(installationAddress).applyDefaultArea
                          }, null, 8, ["onClick"])
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(_component_UFormField, {
                            label: "Miasto instalacji",
                            name: "installationCity"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).installationCity,
                                "onUpdate:modelValue": ($event) => unref(form).installationCity = $event,
                                onInput: unref(installationAddress).onCityInput
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                              unref(installationAddress).suggestions.cities.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.cities, (suggestion) => {
                                  return openBlock(), createBlock("button", {
                                    key: suggestion.id,
                                    type: "button",
                                    class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                    onClick: ($event) => unref(installationAddress).selectCity(suggestion)
                                  }, [
                                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                  ], 8, ["onClick"]);
                                }), 128))
                              ])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Ulica instalacji",
                            name: "installationStreet"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).installationStreet,
                                "onUpdate:modelValue": ($event) => unref(form).installationStreet = $event,
                                onInput: unref(installationAddress).onStreetInput
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                              unref(installationAddress).suggestions.streets.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.streets, (suggestion) => {
                                  return openBlock(), createBlock("button", {
                                    key: suggestion.id,
                                    type: "button",
                                    class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                    onClick: ($event) => unref(installationAddress).selectStreet(suggestion)
                                  }, [
                                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                  ], 8, ["onClick"]);
                                }), 128))
                              ])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                          createVNode(_component_UFormField, {
                            label: "Nr budynku",
                            name: "installationStreetNumber"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).installationStreetNumber,
                                "onUpdate:modelValue": ($event) => unref(form).installationStreetNumber = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Nr lokalu",
                            name: "installationApartmentNumber"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).installationApartmentNumber,
                                "onUpdate:modelValue": ($event) => unref(form).installationApartmentNumber = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Kod pocztowy",
                            name: "installationPostalCode"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).installationPostalCode,
                                "onUpdate:modelValue": ($event) => unref(form).installationPostalCode = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(_component_UFormField, {
                          label: "Opis lokalizacji",
                          name: "locationDescription"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(form).locationDescription,
                              "onUpdate:modelValue": ($event) => unref(form).locationDescription = $event,
                              rows: 2,
                              autoresize: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Edytuj urządzenie klienta"),
                    createVNode("p", { class: "text-sm text-muted" }, "Dane techniczne, powiązania discovery i adres instalacyjny.")
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
                          label: "Klient",
                          name: "customerId",
                          required: ""
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
                        }),
                        createVNode(_component_UFormField, {
                          label: "Hostname",
                          name: "hostname",
                          required: ""
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
                          label: "Nazwa pomocnicza",
                          name: "name"
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
                          label: "Typ urządzenia",
                          name: "deviceType"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).deviceType,
                              "onUpdate:modelValue": ($event) => unref(form).deviceType = $event,
                              items: deviceTypeOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                              items: statusOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "IP",
                          name: "ipAddress"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).ipAddress,
                              "onUpdate:modelValue": ($event) => unref(form).ipAddress = $event
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
                        }),
                        createVNode(_component_UFormField, {
                          label: "Login",
                          name: "login"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).login,
                              "onUpdate:modelValue": ($event) => unref(form).login = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "Urządzenie sieciowe",
                          name: "netDeviceId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(form).netDeviceId,
                              "onUpdate:modelValue": ($event) => unref(form).netDeviceId = $event,
                              items: unref(netDeviceOptions),
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
                              items: unref(ipNetworkOptions),
                              "value-key": "value",
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Vendor discovery",
                          name: "remoteVendor"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).remoteVendor,
                              "onUpdate:modelValue": ($event) => unref(form).remoteVendor = $event,
                              items: vendorOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Serial zdalny",
                          name: "remoteSerialNumber"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).remoteSerialNumber,
                              "onUpdate:modelValue": ($event) => unref(form).remoteSerialNumber = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "OLT",
                          name: "remoteOlt"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).remoteOlt,
                              "onUpdate:modelValue": ($event) => unref(form).remoteOlt = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "ONU",
                          name: "remoteOnu"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).remoteOnu,
                              "onUpdate:modelValue": ($event) => unref(form).remoteOnu = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Port zdalny",
                          name: "remotePort"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).remotePort,
                              "onUpdate:modelValue": ($event) => unref(form).remotePort = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                        createVNode("div", { class: "text-sm text-muted" }, " Adres instalacyjny korzysta z miast zarządzanych i słowników TERYT. "),
                        createVNode(unref(UButton), {
                          color: "neutral",
                          variant: "outline",
                          size: "sm",
                          label: "Użyj domyślnego miasta",
                          onClick: unref(installationAddress).applyDefaultArea
                        }, null, 8, ["onClick"])
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, {
                          label: "Miasto instalacji",
                          name: "installationCity"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).installationCity,
                              "onUpdate:modelValue": ($event) => unref(form).installationCity = $event,
                              onInput: unref(installationAddress).onCityInput
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                            unref(installationAddress).suggestions.cities.length ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.cities, (suggestion) => {
                                return openBlock(), createBlock("button", {
                                  key: suggestion.id,
                                  type: "button",
                                  class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                  onClick: ($event) => unref(installationAddress).selectCity(suggestion)
                                }, [
                                  createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                ], 8, ["onClick"]);
                              }), 128))
                            ])) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Ulica instalacji",
                          name: "installationStreet"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).installationStreet,
                              "onUpdate:modelValue": ($event) => unref(form).installationStreet = $event,
                              onInput: unref(installationAddress).onStreetInput
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                            unref(installationAddress).suggestions.streets.length ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(installationAddress).suggestions.streets, (suggestion) => {
                                return openBlock(), createBlock("button", {
                                  key: suggestion.id,
                                  type: "button",
                                  class: "w-full px-3 py-2 text-left text-sm hover:bg-elevated",
                                  onClick: ($event) => unref(installationAddress).selectStreet(suggestion)
                                }, [
                                  createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(suggestion.text), 1)
                                ], 8, ["onClick"]);
                              }), 128))
                            ])) : createCommentVNode("", true)
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                        createVNode(_component_UFormField, {
                          label: "Nr budynku",
                          name: "installationStreetNumber"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).installationStreetNumber,
                              "onUpdate:modelValue": ($event) => unref(form).installationStreetNumber = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Nr lokalu",
                          name: "installationApartmentNumber"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).installationApartmentNumber,
                              "onUpdate:modelValue": ($event) => unref(form).installationApartmentNumber = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Kod pocztowy",
                          name: "installationPostalCode"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).installationPostalCode,
                              "onUpdate:modelValue": ($event) => unref(form).installationPostalCode = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Opis lokalizacji",
                        name: "locationDescription"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).locationDescription,
                            "onUpdate:modelValue": ($event) => unref(form).locationDescription = $event,
                            rows: 2,
                            autoresize: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
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
                  _push3(`<div${_scopeId2}><h3 class="text-lg font-semibold text-highlighted"${_scopeId2}>Usuń urządzenie klienta</h3><p class="text-sm text-muted"${_scopeId2}>Ta operacja usunie urządzenie z inventory klienta.</p></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń urządzenie klienta"),
                      createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usunie urządzenie z inventory klienta.")
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
                    title: unref(deviceToDelete) ? `Usunąć ${unref(deviceToDelete).hostname}?` : "Brak urządzenia do usunięcia."
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
                        title: unref(deviceToDelete) ? `Usunąć ${unref(deviceToDelete).hostname}?` : "Brak urządzenia do usunięcia."
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
                    createVNode("h3", { class: "text-lg font-semibold text-highlighted" }, "Usuń urządzenie klienta"),
                    createVNode("p", { class: "text-sm text-muted" }, "Ta operacja usunie urządzenie z inventory klienta.")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UAlert, {
                      color: "error",
                      variant: "soft",
                      icon: "i-lucide-triangle-alert",
                      title: unref(deviceToDelete) ? `Usunąć ${unref(deviceToDelete).hostname}?` : "Brak urządzenia do usunięcia."
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/customer-devices.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=customer-devices-Df05281W.mjs.map
