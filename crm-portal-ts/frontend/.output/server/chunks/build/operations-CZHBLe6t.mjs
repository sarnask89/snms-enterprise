import { d as useRoute, b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$3 } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$4 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$5 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$6 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$7 } from './Checkbox-mfegmXJ0.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-BhfO7re0.mjs';
import { _ as _sfc_main$a } from './Textarea-DX4AdTCC.mjs';
import { ref, reactive, withAsyncContext, watch, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, withModifiers, createTextVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-hoYYm4l-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';
import './isValueEqualOrExist-DDZNo4Zk.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import './utils-Bd-v-gOF.mjs';
import './RovingFocusGroup-C9aTixOz.mjs';
import './useFilter-BytkjEhg.mjs';
import './virtualizer-Dnga9fey.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "operations",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const leaseSearch = ref("");
    const diagnosticsDeviceId = ref("");
    const diagnosticsResult = ref(null);
    const leaseSyncResult = ref(null);
    const remoteTestResult = ref(null);
    const activeScanDeviceId = ref(null);
    const activeProfileTestId = ref(null);
    const activeSessionId = ref(null);
    const sessionRecords = ref([]);
    const selectedRecord = ref(null);
    const autoImportingSessionId = ref(null);
    const autoImportSummary = ref(null);
    const profileTestResult = ref(null);
    const isImportingLease = ref(false);
    const isImportingNetwork = ref(false);
    const isSavingProfile = ref(false);
    const isImportingRecord = ref(false);
    const isCheckingDiagnostics = ref(false);
    const isRunningRemoteTest = ref(false);
    const isSyncingLease = ref(false);
    const isLoadingSessionRecords = ref(false);
    const driverOptions = [
      { label: "Mikrotik API", value: "mikrotik_api" },
      { label: "Dasan SSH", value: "dasan_ssh" }
    ];
    const booleanOptions = [
      { label: "Nie", value: "false" },
      { label: "Tak", value: "true" }
    ];
    const profileColumns = [
      { accessorKey: "netDeviceId", header: "Net device" },
      { accessorKey: "driver", header: "Driver" },
      { accessorKey: "host", header: "Host" },
      { accessorKey: "port", header: "Port" },
      { accessorKey: "hasPassword", header: "Secret" },
      { accessorKey: "hasEnablePassword", header: "Enable" },
      { id: "actions", header: "" }
    ];
    const deviceColumns = [
      { accessorKey: "name", header: "Urządzenie" },
      { accessorKey: "deviceType", header: "Typ" },
      { accessorKey: "managementIp", header: "Management IP" },
      { accessorKey: "readyForDiscovery", header: "Ready" },
      { id: "actions", header: "" }
    ];
    const sessionColumns = [
      { accessorKey: "id", header: "Sesja" },
      { accessorKey: "driver", header: "Driver" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "recordCount", header: "Rekordy" },
      { id: "actions", header: "" }
    ];
    const recordColumns = [
      { accessorKey: "recordKind", header: "Kind" },
      { accessorKey: "hostname", header: "Hostname / serial" },
      { accessorKey: "ipAddress", header: "IP / CIDR" },
      { accessorKey: "macAddress", header: "MAC" },
      { accessorKey: "recordStatus", header: "Status" },
      { id: "actions", header: "" }
    ];
    const leaseColumns = [
      { accessorKey: "hostname", header: "Hostname" },
      { accessorKey: "ipAddress", header: "IP" },
      { accessorKey: "macAddress", header: "MAC" },
      { accessorKey: "remoteSerialNumber", header: "Remote serial" },
      { accessorKey: "netDeviceId", header: "Net device" }
    ];
    const accessProfileForm = reactive({
      netDeviceId: null,
      driver: "mikrotik_api",
      host: "",
      port: "",
      username: "",
      password: "",
      enablePassword: "",
      useTls: "false"
    });
    const recordImportForm = reactive({
      customerId: "",
      ipNetworkId: "",
      name: "",
      comment: ""
    });
    const leaseForm = reactive({
      customerId: "",
      netDeviceId: "",
      ipNetworkId: "",
      hostname: "",
      ipAddress: "",
      macAddress: "",
      comment: ""
    });
    const networkForm = reactive({
      deviceId: "",
      name: "",
      cidr: "",
      gateway: "",
      vlanId: "",
      comment: ""
    });
    const autoImportOptions = reactive({
      importTariffsAndSubscriptions: true
    });
    const { data: discoveryDevices, refresh: refreshDiscoveryDevices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/network-discovery/devices",
      {
        default: () => []
      },
      "$WXNqHON0BG"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: accessProfiles, refresh: refreshAccessProfiles } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/network-discovery/access-profiles",
      {
        default: () => []
      },
      "$SMKtYa_lOY"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: discoverySessions, refresh: refreshDiscoverySessions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/network-discovery/sessions",
      {
        default: () => []
      },
      "$aJPxeHrMp6"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: pitSync, refresh: refreshPitSync } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/pit/sync",
      {
        method: "POST",
        server: false
      },
      "$yW55CoPG-T"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const {
      data: importedLeases,
      pending: pendingImportedLeases,
      refresh: refreshImportedLeases
    } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/network-discovery/imported-leases",
      {
        query: { q: leaseSearch },
        default: () => []
      },
      "$bpWTIrpfPg"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 500 },
        default: () => []
      },
      "$T8xXMCDtMo"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: ipNetworks } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/ip-networks",
      {
        default: () => []
      },
      "$ECSEXsG9eT"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customerDevices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customer-devices",
      {
        query: { limit: 500 },
        default: () => []
      },
      "$QCoyYPTzay"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    watch(leaseSearch, () => refreshImportedLeases());
    const deviceOptions = computed(() => [
      { label: "Wybierz urządzenie", value: null },
      ...(discoveryDevices.value || []).map((device) => ({
        label: `${device.name} (#${device.id})`,
        value: device.id
      }))
    ]);
    const customerOptions = computed(() => [
      { label: "Wybierz klienta", value: null },
      ...(customers.value || []).map((customer) => ({
        label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.customerCode,
        value: customer.id
      }))
    ]);
    const ipNetworkOptions = computed(() => [
      { label: "Wybierz sieć IP", value: null },
      ...(ipNetworks.value || []).map((network) => ({
        label: `${network.name} (${network.cidr})`,
        value: network.id
      }))
    ]);
    const customerDeviceOptions = computed(() => [
      { label: "Wybierz urządzenie klienta", value: null },
      ...(customerDevices.value || []).map((device) => ({
        label: `${device.hostname}${device.ipAddress ? ` · ${device.ipAddress}` : ""}`,
        value: device.id
      }))
    ]);
    watch(() => accessProfileForm.netDeviceId, (netDeviceId) => {
      const selected = (discoveryDevices.value || []).find((device) => device.id === netDeviceId);
      if (!selected) {
        return;
      }
      accessProfileForm.host = selected.managementIp || accessProfileForm.host;
      if (String(selected.deviceType || "").toLowerCase().includes("dasan")) {
        accessProfileForm.driver = "dasan_ssh";
        if (!accessProfileForm.port) {
          accessProfileForm.port = 22502;
        }
      } else if (String(selected.deviceType || "").toLowerCase().includes("mikrotik") || String(selected.deviceType || "").toLowerCase().includes("router")) {
        accessProfileForm.driver = "mikrotik_api";
        if (!accessProfileForm.port) {
          accessProfileForm.port = 8728;
        }
      }
    });
    const asNumberOrNull = (value) => {
      if (value === "" || value === null || value === void 0) {
        return null;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };
    const refreshAll = async () => {
      await Promise.all([
        refreshDiscoveryDevices(),
        refreshAccessProfiles(),
        refreshDiscoverySessions(),
        refreshPitSync(),
        refreshImportedLeases()
      ]);
    };
    const saveAccessProfile = async () => {
      isSavingProfile.value = true;
      try {
        await $fetch("/api/v1/network-discovery/access-profiles", {
          method: "POST",
          body: {
            netDeviceId: asNumberOrNull(accessProfileForm.netDeviceId),
            driver: accessProfileForm.driver,
            host: accessProfileForm.host,
            port: asNumberOrNull(accessProfileForm.port),
            username: accessProfileForm.username,
            password: accessProfileForm.password,
            enablePassword: accessProfileForm.enablePassword || null,
            useTls: accessProfileForm.useTls === "true"
          }
        });
        Object.assign(accessProfileForm, {
          netDeviceId: null,
          driver: "mikrotik_api",
          host: "",
          port: "",
          username: "",
          password: "",
          enablePassword: "",
          useTls: "false"
        });
        await Promise.all([
          refreshDiscoveryDevices(),
          refreshAccessProfiles()
        ]);
      } finally {
        isSavingProfile.value = false;
      }
    };
    const runScan = async (deviceId) => {
      activeScanDeviceId.value = deviceId;
      try {
        const result = await $fetch(`/api/v1/network-discovery/scan/${deviceId}`, {
          method: "POST"
        });
        activeSessionId.value = result.session.id;
        sessionRecords.value = result.records;
        selectedRecord.value = null;
        await Promise.all([
          refreshDiscoverySessions(),
          refreshImportedLeases()
        ]);
      } finally {
        activeScanDeviceId.value = null;
      }
    };
    const runProfileTest = async (profileId) => {
      activeProfileTestId.value = profileId;
      try {
        profileTestResult.value = await $fetch(`/api/v1/network-discovery/access-profiles/${profileId}/test`, {
          method: "POST"
        });
      } finally {
        activeProfileTestId.value = null;
      }
    };
    const loadSessionRecords = async (sessionId) => {
      activeSessionId.value = sessionId;
      isLoadingSessionRecords.value = true;
      try {
        sessionRecords.value = await $fetch(`/api/v1/network-discovery/sessions/${sessionId}/records`);
        selectedRecord.value = null;
      } finally {
        isLoadingSessionRecords.value = false;
      }
    };
    const runAutoImport = async (sessionId) => {
      autoImportingSessionId.value = sessionId;
      try {
        const result = await $fetch(`/api/v1/network-discovery/sessions/${sessionId}/auto-import`, {
          method: "POST",
          body: {
            importTariffsAndSubscriptions: autoImportOptions.importTariffsAndSubscriptions
          }
        });
        autoImportSummary.value = {
          sessionId,
          summary: result.summary
        };
        await loadSessionRecords(sessionId);
        await Promise.all([
          refreshImportedLeases(),
          refreshDiscoverySessions()
        ]);
      } finally {
        autoImportingSessionId.value = null;
      }
    };
    const selectRecord = (record) => {
      selectedRecord.value = record;
      recordImportForm.name = record.hostname || "";
    };
    const importSelectedRecord = async () => {
      if (!selectedRecord.value) {
        return;
      }
      isImportingRecord.value = true;
      try {
        const result = await $fetch(`/api/v1/network-discovery/import-record/${selectedRecord.value.id}`, {
          method: "POST",
          body: {
            customerId: asNumberOrNull(recordImportForm.customerId),
            ipNetworkId: asNumberOrNull(recordImportForm.ipNetworkId),
            name: recordImportForm.name || null,
            comment: recordImportForm.comment || null
          }
        });
        if (result.customerDevice?.id) {
          diagnosticsDeviceId.value = String(result.customerDevice.id);
          diagnosticsResult.value = result.diagnostics;
          remoteTestResult.value = null;
        }
        Object.assign(recordImportForm, {
          customerId: "",
          ipNetworkId: "",
          name: "",
          comment: ""
        });
        await Promise.all([
          refreshImportedLeases(),
          refreshPitSync()
        ]);
      } finally {
        isImportingRecord.value = false;
      }
    };
    const importLease = async () => {
      isImportingLease.value = true;
      try {
        const result = await $fetch("/api/v1/network-discovery/import-lease", {
          method: "POST",
          body: {
            customerId: asNumberOrNull(leaseForm.customerId),
            netDeviceId: asNumberOrNull(leaseForm.netDeviceId),
            ipNetworkId: asNumberOrNull(leaseForm.ipNetworkId),
            hostname: leaseForm.hostname,
            ipAddress: leaseForm.ipAddress || null,
            macAddress: leaseForm.macAddress || null,
            comment: leaseForm.comment || null
          }
        });
        diagnosticsDeviceId.value = String(result.customerDevice.id);
        diagnosticsResult.value = result.diagnostics;
        leaseSyncResult.value = null;
        remoteTestResult.value = null;
        Object.assign(leaseForm, {
          customerId: "",
          netDeviceId: "",
          ipNetworkId: "",
          hostname: "",
          ipAddress: "",
          macAddress: "",
          comment: ""
        });
        await Promise.all([
          refreshImportedLeases(),
          refreshPitSync()
        ]);
      } finally {
        isImportingLease.value = false;
      }
    };
    const importNetwork = async () => {
      isImportingNetwork.value = true;
      try {
        await $fetch("/api/v1/network-discovery/import-network", {
          method: "POST",
          body: {
            deviceId: asNumberOrNull(networkForm.deviceId),
            name: networkForm.name || null,
            cidr: networkForm.cidr,
            gateway: networkForm.gateway || null,
            vlanId: asNumberOrNull(networkForm.vlanId),
            comment: networkForm.comment || null
          }
        });
        Object.assign(networkForm, {
          deviceId: "",
          name: "",
          cidr: "",
          gateway: "",
          vlanId: "",
          comment: ""
        });
        await refreshPitSync();
      } finally {
        isImportingNetwork.value = false;
      }
    };
    const runDiagnostics = async () => {
      if (!diagnosticsDeviceId.value) {
        return;
      }
      isCheckingDiagnostics.value = true;
      try {
        leaseSyncResult.value = null;
        remoteTestResult.value = null;
        diagnosticsResult.value = await $fetch(`/api/v1/diagnostics/check/${diagnosticsDeviceId.value}`, {
          method: "POST"
        });
      } finally {
        isCheckingDiagnostics.value = false;
      }
    };
    const runRemoteTest = async () => {
      if (!diagnosticsDeviceId.value) {
        return;
      }
      isRunningRemoteTest.value = true;
      try {
        remoteTestResult.value = await $fetch(`/api/v1/diagnostics/remote-test/${diagnosticsDeviceId.value}`, {
          method: "POST"
        });
      } finally {
        isRunningRemoteTest.value = false;
      }
    };
    const syncLease = async () => {
      if (!diagnosticsDeviceId.value) {
        return;
      }
      isSyncingLease.value = true;
      try {
        leaseSyncResult.value = await $fetch(`/api/v1/diagnostics/sync-lease/${diagnosticsDeviceId.value}`, {
          method: "POST"
        });
        await refreshImportedLeases();
      } finally {
        isSyncingLease.value = false;
      }
    };
    const downloadPitExport = async () => {
      const blob = await $fetch("/api/v1/pit/export/nodes", { responseType: "blob" });
      const url = URL.createObjectURL(blob);
      const link = (void 0).createElement("a");
      link.href = url;
      link.download = "pit-net-nodes.gml";
      link.click();
      URL.revokeObjectURL(url);
    };
    const applyRoutePrefill = () => {
      const candidate = route.query.deviceId;
      if (typeof candidate === "string" && candidate.trim()) {
        diagnosticsDeviceId.value = Number(candidate);
      }
    };
    watch(() => route.query.deviceId, () => {
      applyRoutePrefill();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      const _component_UBadge = _sfc_main$6;
      const _component_UCheckbox = _sfc_main$7;
      const _component_USelectMenu = _sfc_main$9;
      const _component_UTextarea = _sfc_main$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 overflow-x-hidden" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Operacje sieciowe</h1><p class="text-sm text-gray-500">Standardowy widok roboczy dla discovery, importu i zdalnych testów Mikrotik API oraz Dasan SSH.</p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-arrow-down-tray",
        label: "Pobierz PIT GML",
        onClick: downloadPitExport
      }, null, _parent));
      _push(`</div></div><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm text-gray-500"${_scopeId}>Discovery devices</div><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(discoveryDevices)?.length || 0)}</div><div class="text-xs text-gray-500 mt-1"${_scopeId}>gotowe do skanu</div>`);
          } else {
            return [
              createVNode("div", { class: "text-sm text-gray-500" }, "Discovery devices"),
              createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(discoveryDevices)?.length || 0), 1),
              createVNode("div", { class: "text-xs text-gray-500 mt-1" }, "gotowe do skanu")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm text-gray-500"${_scopeId}>Access profiles</div><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(accessProfiles)?.length || 0)}</div><div class="text-xs text-gray-500 mt-1"${_scopeId}>profile live-connect</div>`);
          } else {
            return [
              createVNode("div", { class: "text-sm text-gray-500" }, "Access profiles"),
              createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(accessProfiles)?.length || 0), 1),
              createVNode("div", { class: "text-xs text-gray-500 mt-1" }, "profile live-connect")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm text-gray-500"${_scopeId}>Discovery sessions</div><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(discoverySessions)?.length || 0)}</div><div class="text-xs text-gray-500 mt-1"${_scopeId}>aktywna: ${ssrInterpolate(unref(activeSessionId) || "brak")}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-sm text-gray-500" }, "Discovery sessions"),
              createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(discoverySessions)?.length || 0), 1),
              createVNode("div", { class: "text-xs text-gray-500 mt-1" }, "aktywna: " + toDisplayString(unref(activeSessionId) || "brak"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm text-gray-500"${_scopeId}>Zaimportowane urządzenia</div><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(importedLeases)?.length || 0)}</div><div class="text-xs text-gray-500 mt-1"${_scopeId}>staging i leasing</div>`);
          } else {
            return [
              createVNode("div", { class: "text-sm text-gray-500" }, "Zaimportowane urządzenia"),
              createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(importedLeases)?.length || 0), 1),
              createVNode("div", { class: "text-xs text-gray-500 mt-1" }, "staging i leasing")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Profil dostępu do urządzenia</h2><p class="text-sm text-gray-500"${_scopeId}>Konfiguracja live-connect dla Mikrotika lub Dasana</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Profil dostępu do urządzenia"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Konfiguracja live-connect dla Mikrotika lub Dasana")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Urządzenie",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(accessProfileForm).netDeviceId,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).netDeviceId = $event,
                    items: unref(deviceOptions),
                    "label-key": "label"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(accessProfileForm).netDeviceId,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).netDeviceId = $event,
                      items: unref(deviceOptions),
                      "label-key": "label"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Driver",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(accessProfileForm).driver,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).driver = $event,
                    items: driverOptions,
                    "label-key": "label"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(accessProfileForm).driver,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).driver = $event,
                      items: driverOptions,
                      "label-key": "label"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Host",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(accessProfileForm).host,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).host = $event,
                    placeholder: "10.0.222.x"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(accessProfileForm).host,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).host = $event,
                      placeholder: "10.0.222.x"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Port" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(accessProfileForm).port,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).port = $event,
                    type: "number"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(accessProfileForm).port,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).port = $event,
                      type: "number"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Login",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(accessProfileForm).username,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).username = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(accessProfileForm).username,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).username = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Hasło",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(accessProfileForm).password,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).password = $event,
                    type: "password"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(accessProfileForm).password,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).password = $event,
                      type: "password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Enable password" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(accessProfileForm).enablePassword,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).enablePassword = $event,
                    type: "password"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(accessProfileForm).enablePassword,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).enablePassword = $event,
                      type: "password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Mikrotik TLS" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(accessProfileForm).useTls,
                    "onUpdate:modelValue": ($event) => unref(accessProfileForm).useTls = $event,
                    items: booleanOptions,
                    "label-key": "label"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(accessProfileForm).useTls,
                      "onUpdate:modelValue": ($event) => unref(accessProfileForm).useTls = $event,
                      items: booleanOptions,
                      "label-key": "label"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(isSavingProfile),
              label: "Zapisz profil"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(saveAccessProfile, ["prevent"])
              }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, {
                    label: "Urządzenie",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(accessProfileForm).netDeviceId,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).netDeviceId = $event,
                        items: unref(deviceOptions),
                        "label-key": "label"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Driver",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(accessProfileForm).driver,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).driver = $event,
                        items: driverOptions,
                        "label-key": "label"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, {
                    label: "Host",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(accessProfileForm).host,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).host = $event,
                        placeholder: "10.0.222.x"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Port" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(accessProfileForm).port,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).port = $event,
                        type: "number"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, {
                    label: "Login",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(accessProfileForm).username,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).username = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Hasło",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(accessProfileForm).password,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).password = $event,
                        type: "password"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Enable password" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(accessProfileForm).enablePassword,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).enablePassword = $event,
                        type: "password"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Mikrotik TLS" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(accessProfileForm).useTls,
                        "onUpdate:modelValue": ($event) => unref(accessProfileForm).useTls = $event,
                        items: booleanOptions,
                        "label-key": "label"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingProfile),
                    label: "Zapisz profil"
                  }, null, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Aktywne profile</h2><p class="text-sm text-gray-500"${_scopeId}>Zapisane profile dostępu używane przez skany live</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Aktywne profile"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Zapisane profile dostępu używane przez skany live")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(accessProfiles) || [],
              columns: profileColumns
            }, {
              "hasPassword-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.hasPassword ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.hasPassword ? "has secret" : "missing")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.hasPassword ? "has secret" : "missing"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.hasPassword ? "green" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.hasPassword ? "has secret" : "missing"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "hasEnablePassword-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.hasEnablePassword ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.hasEnablePassword ? "yes" : "no")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.hasEnablePassword ? "yes" : "no"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.hasEnablePassword ? "green" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.hasEnablePassword ? "yes" : "no"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "soft",
                    icon: "i-heroicons-bolt",
                    loading: unref(activeProfileTestId) === row.id,
                    label: "Test połączenia",
                    onClick: ($event) => runProfileTest(row.id)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "soft",
                        icon: "i-heroicons-bolt",
                        loading: unref(activeProfileTestId) === row.id,
                        label: "Test połączenia",
                        onClick: ($event) => runProfileTest(row.id)
                      }, null, 8, ["loading", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(profileTestResult)) {
              _push2(`<div class="mt-4 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}> Test profilu #${ssrInterpolate(unref(profileTestResult).profile.id)}: ${ssrInterpolate(unref(profileTestResult).result.driver)}</div><div class="mt-2 flex flex-wrap items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(profileTestResult).result.ok ? "green" : "red",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(profileTestResult).result.ok ? "Połączenie OK" : "Błąd połączenia")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(profileTestResult).result.ok ? "Połączenie OK" : "Błąd połączenia"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--[-->`);
              ssrRenderList(unref(profileTestResult).result.summary, (value, key) => {
                _push2(`<span class="text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(key)}: <span class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(value)}</span></span>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(accessProfiles) || [],
                columns: profileColumns
              }, {
                "hasPassword-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.hasPassword ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.hasPassword ? "has secret" : "missing"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "hasEnablePassword-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.hasEnablePassword ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.hasEnablePassword ? "yes" : "no"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex justify-end" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "soft",
                      icon: "i-heroicons-bolt",
                      loading: unref(activeProfileTestId) === row.id,
                      label: "Test połączenia",
                      onClick: ($event) => runProfileTest(row.id)
                    }, null, 8, ["loading", "onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["data"]),
              unref(profileTestResult) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800"
              }, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, " Test profilu #" + toDisplayString(unref(profileTestResult).profile.id) + ": " + toDisplayString(unref(profileTestResult).result.driver), 1),
                createVNode("div", { class: "mt-2 flex flex-wrap items-center gap-3" }, [
                  createVNode(_component_UBadge, {
                    color: unref(profileTestResult).result.ok ? "green" : "red",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(profileTestResult).result.ok ? "Połączenie OK" : "Błąd połączenia"), 1)
                    ]),
                    _: 1
                  }, 8, ["color"]),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(profileTestResult).result.summary, (value, key) => {
                    return openBlock(), createBlock("span", {
                      key,
                      class: "text-gray-500 dark:text-gray-400"
                    }, [
                      createTextVNode(toDisplayString(key) + ": ", 1),
                      createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(value), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Discovery devices</h2><p class="text-sm text-gray-500"${_scopeId}>Uruchamianie skanów live dla urządzeń szkieletowych</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Discovery devices"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Uruchamianie skanów live dla urządzeń szkieletowych")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(discoveryDevices) || [],
              columns: deviceColumns
            }, {
              "readyForDiscovery-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.readyForDiscovery ? "green" : "amber",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.readyForDiscovery ? "ready" : "needs profile")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.readyForDiscovery ? "ready" : "needs profile"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.readyForDiscovery ? "green" : "amber",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.readyForDiscovery ? "ready" : "needs profile"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-bolt",
                    disabled: !row.readyForDiscovery,
                    loading: unref(activeScanDeviceId) === row.id,
                    label: "Skanuj",
                    onClick: ($event) => runScan(row.id)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "soft",
                        icon: "i-heroicons-bolt",
                        disabled: !row.readyForDiscovery,
                        loading: unref(activeScanDeviceId) === row.id,
                        label: "Skanuj",
                        onClick: ($event) => runScan(row.id)
                      }, null, 8, ["disabled", "loading", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(discoveryDevices) || [],
                columns: deviceColumns
              }, {
                "readyForDiscovery-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.readyForDiscovery ? "green" : "amber",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.readyForDiscovery ? "ready" : "needs profile"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex justify-end" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "soft",
                      icon: "i-heroicons-bolt",
                      disabled: !row.readyForDiscovery,
                      loading: unref(activeScanDeviceId) === row.id,
                      label: "Skanuj",
                      onClick: ($event) => runScan(row.id)
                    }, null, 8, ["disabled", "loading", "onClick"])
                  ])
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
            _push2(`<div class="space-y-3"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Sesje discovery</h2><p class="text-sm text-gray-500"${_scopeId}>Ostatnie skany i ich rekordy stagingowe</p></div>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(autoImportOptions).importTariffsAndSubscriptions,
              "onUpdate:modelValue": ($event) => unref(autoImportOptions).importTariffsAndSubscriptions = $event,
              label: "Auto-import ma tworzyć też taryfy i subskrypcje z rate-limit DHCP"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Sesje discovery"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Ostatnie skany i ich rekordy stagingowe")
                ]),
                createVNode(_component_UCheckbox, {
                  modelValue: unref(autoImportOptions).importTariffsAndSubscriptions,
                  "onUpdate:modelValue": ($event) => unref(autoImportOptions).importTariffsAndSubscriptions = $event,
                  label: "Auto-import ma tworzyć też taryfy i subskrypcje z rate-limit DHCP"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(discoverySessions) || [],
              columns: sessionColumns
            }, {
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.status === "succeeded" ? "green" : row.status === "failed" ? "red" : "amber",
                    variant: "soft"
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
                      color: row.status === "succeeded" ? "green" : row.status === "failed" ? "red" : "amber",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "soft",
                    icon: "i-heroicons-eye",
                    loading: unref(activeSessionId) === row.id && unref(isLoadingSessionRecords),
                    label: "Rekordy",
                    onClick: ($event) => loadSessionRecords(row.id)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-arrow-down-tray",
                    loading: unref(autoImportingSessionId) === row.id,
                    label: "Auto-import",
                    onClick: ($event) => runAutoImport(row.id)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "soft",
                        icon: "i-heroicons-eye",
                        loading: unref(activeSessionId) === row.id && unref(isLoadingSessionRecords),
                        label: "Rekordy",
                        onClick: ($event) => loadSessionRecords(row.id)
                      }, null, 8, ["loading", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "soft",
                        icon: "i-heroicons-arrow-down-tray",
                        loading: unref(autoImportingSessionId) === row.id,
                        label: "Auto-import",
                        onClick: ($event) => runAutoImport(row.id)
                      }, null, 8, ["loading", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(autoImportSummary)) {
              _push2(`<div class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}> Wynik auto-importu sesji #${ssrInterpolate(unref(autoImportSummary).sessionId)}</div><div class="grid md:grid-cols-3 gap-2"${_scopeId}><div${_scopeId}>Urządzenia: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.importedCustomerDevices)}</span></div><div${_scopeId}>Klienci: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.createdCustomers)}</span></div><div${_scopeId}>Auto-generated: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.autoGeneratedCustomers)}</span></div><div${_scopeId}>Taryfy: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.createdTariffs)}</span></div><div${_scopeId}>Subskrypcje: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.createdSubscriptions)}</span></div><div${_scopeId}>Pominięte rekordy: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(autoImportSummary).summary.skippedRecords)}</span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(discoverySessions) || [],
                columns: sessionColumns
              }, {
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.status === "succeeded" ? "green" : row.status === "failed" ? "red" : "amber",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.status), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "soft",
                      icon: "i-heroicons-eye",
                      loading: unref(activeSessionId) === row.id && unref(isLoadingSessionRecords),
                      label: "Rekordy",
                      onClick: ($event) => loadSessionRecords(row.id)
                    }, null, 8, ["loading", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "soft",
                      icon: "i-heroicons-arrow-down-tray",
                      loading: unref(autoImportingSessionId) === row.id,
                      label: "Auto-import",
                      onClick: ($event) => runAutoImport(row.id)
                    }, null, 8, ["loading", "onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["data"]),
              unref(autoImportSummary) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2"
              }, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, " Wynik auto-importu sesji #" + toDisplayString(unref(autoImportSummary).sessionId), 1),
                createVNode("div", { class: "grid md:grid-cols-3 gap-2" }, [
                  createVNode("div", null, [
                    createTextVNode("Urządzenia: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.importedCustomerDevices), 1)
                  ]),
                  createVNode("div", null, [
                    createTextVNode("Klienci: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.createdCustomers), 1)
                  ]),
                  createVNode("div", null, [
                    createTextVNode("Auto-generated: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.autoGeneratedCustomers), 1)
                  ]),
                  createVNode("div", null, [
                    createTextVNode("Taryfy: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.createdTariffs), 1)
                  ]),
                  createVNode("div", null, [
                    createTextVNode("Subskrypcje: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.createdSubscriptions), 1)
                  ]),
                  createVNode("div", null, [
                    createTextVNode("Pominięte rekordy: "),
                    createVNode("span", { class: "font-medium" }, toDisplayString(unref(autoImportSummary).summary.skippedRecords), 1)
                  ])
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Rekordy sesji</h2><p class="text-sm text-gray-500"${_scopeId}>Staging rekordów z live discovery przed importem</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Rekordy sesji"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Staging rekordów z live discovery przed importem")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 flex items-center justify-between gap-4"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}> Aktywna sesja: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(activeSessionId) || "brak")}</span></div>`);
            if (unref(selectedRecord)) {
              _push2(`<div class="text-sm text-gray-500"${_scopeId}> Wybrany rekord: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(selectedRecord).recordKind)} #${ssrInterpolate(unref(selectedRecord).id)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(sessionRecords),
              columns: recordColumns
            }, {
              "recordStatus-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.recordStatus === "active" || row.recordStatus === "bound" ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.recordStatus || "n/a")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.recordStatus || "n/a"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.recordStatus === "active" || row.recordStatus === "bound" ? "green" : "gray",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.recordStatus || "n/a"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-arrow-down-circle",
                    label: "Wybierz",
                    onClick: ($event) => selectRecord(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "primary",
                        variant: "soft",
                        icon: "i-heroicons-arrow-down-circle",
                        label: "Wybierz",
                        onClick: ($event) => selectRecord(row)
                      }, null, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mb-4 flex items-center justify-between gap-4" }, [
                createVNode("div", { class: "text-sm text-gray-500" }, [
                  createTextVNode(" Aktywna sesja: "),
                  createVNode("span", { class: "font-medium" }, toDisplayString(unref(activeSessionId) || "brak"), 1)
                ]),
                unref(selectedRecord) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-sm text-gray-500"
                }, [
                  createTextVNode(" Wybrany rekord: "),
                  createVNode("span", { class: "font-medium" }, toDisplayString(unref(selectedRecord).recordKind) + " #" + toDisplayString(unref(selectedRecord).id), 1)
                ])) : createCommentVNode("", true)
              ]),
              createVNode(_component_UTable, {
                data: unref(sessionRecords),
                columns: recordColumns
              }, {
                "recordStatus-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.recordStatus === "active" || row.recordStatus === "bound" ? "green" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.recordStatus || "n/a"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex justify-end" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "primary",
                      variant: "soft",
                      icon: "i-heroicons-arrow-down-circle",
                      label: "Wybierz",
                      onClick: ($event) => selectRecord(row)
                    }, null, 8, ["onClick"])
                  ])
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
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Import wybranego rekordu</h2><p class="text-sm text-gray-500"${_scopeId}>Import do customer-devices albo ip-networks</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Import wybranego rekordu"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Import do customer-devices albo ip-networks")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(selectedRecord) ? `Wybrano ${unref(selectedRecord).recordKind} #${unref(selectedRecord).id}` : "Najpierw wybierz rekord z tabeli obok.")}</div><form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(recordImportForm).customerId,
                    "onUpdate:modelValue": ($event) => unref(recordImportForm).customerId = $event,
                    items: unref(customerOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(recordImportForm).customerId,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).customerId = $event,
                      items: unref(customerOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Sieć IP" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(recordImportForm).ipNetworkId,
                    "onUpdate:modelValue": ($event) => unref(recordImportForm).ipNetworkId = $event,
                    items: unref(ipNetworkOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(recordImportForm).ipNetworkId,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).ipNetworkId = $event,
                      items: unref(ipNetworkOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Nazwa / hostname override" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(recordImportForm).name,
                    "onUpdate:modelValue": ($event) => unref(recordImportForm).name = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(recordImportForm).name,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).name = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Komentarz" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(recordImportForm).comment,
                    "onUpdate:modelValue": ($event) => unref(recordImportForm).comment = $event,
                    data: 2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(recordImportForm).comment,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              disabled: !unref(selectedRecord),
              loading: unref(isImportingRecord),
              label: "Importuj rekord"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("div", { class: "mb-4 text-sm text-gray-500" }, toDisplayString(unref(selectedRecord) ? `Wybrano ${unref(selectedRecord).recordKind} #${unref(selectedRecord).id}` : "Najpierw wybierz rekord z tabeli obok."), 1),
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(importSelectedRecord, ["prevent"])
              }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Klient" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(recordImportForm).customerId,
                        "onUpdate:modelValue": ($event) => unref(recordImportForm).customerId = $event,
                        items: unref(customerOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Sieć IP" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(recordImportForm).ipNetworkId,
                        "onUpdate:modelValue": ($event) => unref(recordImportForm).ipNetworkId = $event,
                        items: unref(ipNetworkOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_UFormField, { label: "Nazwa / hostname override" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(recordImportForm).name,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).name = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Komentarz" }, {
                  default: withCtx(() => [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(recordImportForm).comment,
                      "onUpdate:modelValue": ($event) => unref(recordImportForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    disabled: !unref(selectedRecord),
                    loading: unref(isImportingRecord),
                    label: "Importuj rekord"
                  }, null, 8, ["disabled", "loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Zaimportowane urządzenia</h2><p class="text-sm text-gray-500"${_scopeId}>Customer-devices po imporcie discovery</p></div>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(leaseSearch),
              "onUpdate:modelValue": ($event) => isRef(leaseSearch) ? leaseSearch.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Szukaj IP, MAC, serial...",
              class: "w-72"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Zaimportowane urządzenia"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Customer-devices po imporcie discovery")
                ]),
                createVNode(_component_UInput, {
                  modelValue: unref(leaseSearch),
                  "onUpdate:modelValue": ($event) => isRef(leaseSearch) ? leaseSearch.value = $event : null,
                  icon: "i-heroicons-magnifying-glass-20-solid",
                  placeholder: "Szukaj IP, MAC, serial...",
                  class: "w-72"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(importedLeases) || [],
              columns: leaseColumns,
              loading: unref(pendingImportedLeases)
            }, {
              "ipAddress-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono text-sm"${_scopeId2}>${ssrInterpolate(row.ipAddress || "n/a")}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "font-mono text-sm" }, toDisplayString(row.ipAddress || "n/a"), 1)
                  ];
                }
              }),
              "remoteSerialNumber-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono text-sm"${_scopeId2}>${ssrInterpolate(row.remoteSerialNumber || "n/a")}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "font-mono text-sm" }, toDisplayString(row.remoteSerialNumber || "n/a"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                data: unref(importedLeases) || [],
                columns: leaseColumns,
                loading: unref(pendingImportedLeases)
              }, {
                "ipAddress-data": withCtx(({ row }) => [
                  createVNode("span", { class: "font-mono text-sm" }, toDisplayString(row.ipAddress || "n/a"), 1)
                ]),
                "remoteSerialNumber-data": withCtx(({ row }) => [
                  createVNode("span", { class: "font-mono text-sm" }, toDisplayString(row.remoteSerialNumber || "n/a"), 1)
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
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Diagnostyka lokalna i zdalna</h2><p class="text-sm text-gray-500"${_scopeId}>Readiness, sync lease i live test z urządzenia dostępowego</p></div><div class="flex flex-wrap gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "soft",
              icon: "i-heroicons-bolt",
              label: "Readiness",
              loading: unref(isCheckingDiagnostics),
              onClick: runDiagnostics
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              icon: "i-heroicons-signal",
              label: "Test zdalny",
              loading: unref(isRunningRemoteTest),
              onClick: runRemoteTest
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Diagnostyka lokalna i zdalna"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Readiness, sync lease i live test z urządzenia dostępowego")
                ]),
                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "soft",
                    icon: "i-heroicons-bolt",
                    label: "Readiness",
                    loading: unref(isCheckingDiagnostics),
                    onClick: runDiagnostics
                  }, null, 8, ["loading"]),
                  createVNode(_component_UButton, {
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-signal",
                    label: "Test zdalny",
                    loading: unref(isRunningRemoteTest),
                    onClick: runRemoteTest
                  }, null, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UFormField, { label: "Urządzenie klienta" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(diagnosticsDeviceId),
                    "onUpdate:modelValue": ($event) => isRef(diagnosticsDeviceId) ? diagnosticsDeviceId.value = $event : null,
                    items: unref(customerDeviceOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(diagnosticsDeviceId),
                      "onUpdate:modelValue": ($event) => isRef(diagnosticsDeviceId) ? diagnosticsDeviceId.value = $event : null,
                      items: unref(customerDeviceOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(diagnosticsResult)) {
              _push2(`<div class="mt-4 space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(diagnosticsResult).ready ? "green" : "red",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(diagnosticsResult).ready ? "Gotowe lokalnie" : "Brakuje danych lokalnych")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(diagnosticsResult).ready ? "Gotowe lokalnie" : "Brakuje danych lokalnych"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex justify-end"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                variant: "soft",
                icon: "i-heroicons-arrow-path-rounded-square",
                label: "Sync lease",
                loading: unref(isSyncingLease),
                onClick: syncLease
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(diagnosticsResult).checks, (check) => {
                _push2(`<div class="flex items-center justify-between gap-4 text-sm"${_scopeId}><span${_scopeId}>${ssrInterpolate(check.label)}</span>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: check.ok ? "green" : check.severity === "blocking" ? "red" : "amber",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(check.ok ? "OK" : check.severity)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(check.ok ? "OK" : check.severity), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(leaseSyncResult)) {
              _push2(`<div class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-1"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>Wynik sync lease</div><div${_scopeId}>Status: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(leaseSyncResult).synced ? "zsynchronizowano" : "bez zmian")}</span></div>`);
              if (unref(leaseSyncResult).reason) {
                _push2(`<div class="text-gray-500"${_scopeId}>Powód: ${ssrInterpolate(unref(leaseSyncResult).reason)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(remoteTestResult)) {
              _push2(`<div class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-2"${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}> Remote test: ${ssrInterpolate(unref(remoteTestResult).remoteDiagnostics.driver)}</div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(remoteTestResult).remoteDiagnostics.ok ? "green" : "red",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(remoteTestResult).remoteDiagnostics.ok ? "PASS" : "FAIL")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(remoteTestResult).remoteDiagnostics.ok ? "PASS" : "FAIL"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--[-->`);
              ssrRenderList(unref(remoteTestResult).remoteDiagnostics.checks, (check) => {
                _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><span${_scopeId}>${ssrInterpolate(check.label)}</span>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: check.ok ? "green" : check.severity === "blocking" ? "red" : "amber",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(check.ok ? "OK" : check.severity)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(check.ok ? "OK" : check.severity), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_UFormField, { label: "Urządzenie klienta" }, {
                default: withCtx(() => [
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(diagnosticsDeviceId),
                    "onUpdate:modelValue": ($event) => isRef(diagnosticsDeviceId) ? diagnosticsDeviceId.value = $event : null,
                    items: unref(customerDeviceOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                ]),
                _: 1
              }),
              unref(diagnosticsResult) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 space-y-3"
              }, [
                createVNode(_component_UBadge, {
                  color: unref(diagnosticsResult).ready ? "green" : "red",
                  variant: "soft"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(diagnosticsResult).ready ? "Gotowe lokalnie" : "Brakuje danych lokalnych"), 1)
                  ]),
                  _: 1
                }, 8, ["color"]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-arrow-path-rounded-square",
                    label: "Sync lease",
                    loading: unref(isSyncingLease),
                    onClick: syncLease
                  }, null, 8, ["loading"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(diagnosticsResult).checks, (check) => {
                    return openBlock(), createBlock("div", {
                      key: check.key,
                      class: "flex items-center justify-between gap-4 text-sm"
                    }, [
                      createVNode("span", null, toDisplayString(check.label), 1),
                      createVNode(_component_UBadge, {
                        color: check.ok ? "green" : check.severity === "blocking" ? "red" : "amber",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(check.ok ? "OK" : check.severity), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true),
              unref(leaseSyncResult) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-1"
              }, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, "Wynik sync lease"),
                createVNode("div", null, [
                  createTextVNode("Status: "),
                  createVNode("span", { class: "font-medium" }, toDisplayString(unref(leaseSyncResult).synced ? "zsynchronizowano" : "bez zmian"), 1)
                ]),
                unref(leaseSyncResult).reason ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-gray-500"
                }, "Powód: " + toDisplayString(unref(leaseSyncResult).reason), 1)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              unref(remoteTestResult) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-2"
              }, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, " Remote test: " + toDisplayString(unref(remoteTestResult).remoteDiagnostics.driver), 1),
                createVNode(_component_UBadge, {
                  color: unref(remoteTestResult).remoteDiagnostics.ok ? "green" : "red",
                  variant: "soft"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(remoteTestResult).remoteDiagnostics.ok ? "PASS" : "FAIL"), 1)
                  ]),
                  _: 1
                }, 8, ["color"]),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(remoteTestResult).remoteDiagnostics.checks, (check) => {
                  return openBlock(), createBlock("div", {
                    key: check.key,
                    class: "flex items-center justify-between gap-4"
                  }, [
                    createVNode("span", null, toDisplayString(check.label), 1),
                    createVNode(_component_UBadge, {
                      color: check.ok ? "green" : check.severity === "blocking" ? "red" : "amber",
                      variant: "soft"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(check.ok ? "OK" : check.severity), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]);
                }), 128))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Ręczny import lease</h2><p class="text-sm text-gray-500"${_scopeId}>Fallback dla ręcznych wpisów spoza live discovery</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Ręczny import lease"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Fallback dla ręcznych wpisów spoza live discovery")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Klient",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(leaseForm).customerId,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).customerId = $event,
                    items: unref(customerOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(leaseForm).customerId,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).customerId = $event,
                      items: unref(customerOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Urządzenie sieciowe" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(leaseForm).netDeviceId,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).netDeviceId = $event,
                    items: unref(deviceOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(leaseForm).netDeviceId,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).netDeviceId = $event,
                      items: unref(deviceOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Sieć IP" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(leaseForm).ipNetworkId,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).ipNetworkId = $event,
                    items: unref(ipNetworkOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(leaseForm).ipNetworkId,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).ipNetworkId = $event,
                      items: unref(ipNetworkOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Hostname",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(leaseForm).hostname,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).hostname = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(leaseForm).hostname,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).hostname = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Adres IP" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(leaseForm).ipAddress,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).ipAddress = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(leaseForm).ipAddress,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).ipAddress = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "MAC" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(leaseForm).macAddress,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).macAddress = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(leaseForm).macAddress,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).macAddress = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Komentarz" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(leaseForm).comment,
                    "onUpdate:modelValue": ($event) => unref(leaseForm).comment = $event,
                    data: 2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(leaseForm).comment,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(isImportingLease),
              label: "Importuj lease"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(importLease, ["prevent"])
              }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, {
                    label: "Klient",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(leaseForm).customerId,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).customerId = $event,
                        items: unref(customerOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Urządzenie sieciowe" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(leaseForm).netDeviceId,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).netDeviceId = $event,
                        items: unref(deviceOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Sieć IP" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(leaseForm).ipNetworkId,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).ipNetworkId = $event,
                        items: unref(ipNetworkOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Hostname",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(leaseForm).hostname,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).hostname = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Adres IP" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(leaseForm).ipAddress,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).ipAddress = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "MAC" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(leaseForm).macAddress,
                        "onUpdate:modelValue": ($event) => unref(leaseForm).macAddress = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_UFormField, { label: "Komentarz" }, {
                  default: withCtx(() => [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(leaseForm).comment,
                      "onUpdate:modelValue": ($event) => unref(leaseForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isImportingLease),
                    label: "Importuj lease"
                  }, null, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Ręczny import sieci</h2><p class="text-sm text-gray-500"${_scopeId}>Fallback dla ręcznego zapisu podsieci</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Ręczny import sieci"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Fallback dla ręcznego zapisu podsieci")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Nazwa" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(networkForm).name,
                    "onUpdate:modelValue": ($event) => unref(networkForm).name = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(networkForm).name,
                      "onUpdate:modelValue": ($event) => unref(networkForm).name = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "CIDR",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(networkForm).cidr,
                    "onUpdate:modelValue": ($event) => unref(networkForm).cidr = $event,
                    placeholder: "10.10.200.0/24"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(networkForm).cidr,
                      "onUpdate:modelValue": ($event) => unref(networkForm).cidr = $event,
                      placeholder: "10.10.200.0/24"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-3 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Gateway" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(networkForm).gateway,
                    "onUpdate:modelValue": ($event) => unref(networkForm).gateway = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(networkForm).gateway,
                      "onUpdate:modelValue": ($event) => unref(networkForm).gateway = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "VLAN" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(networkForm).vlanId,
                    "onUpdate:modelValue": ($event) => unref(networkForm).vlanId = $event,
                    type: "number"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(networkForm).vlanId,
                      "onUpdate:modelValue": ($event) => unref(networkForm).vlanId = $event,
                      type: "number"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Źródłowe urządzenie" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(networkForm).deviceId,
                    "onUpdate:modelValue": ($event) => unref(networkForm).deviceId = $event,
                    items: unref(deviceOptions),
                    "value-key": "value",
                    "label-key": "label",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(networkForm).deviceId,
                      "onUpdate:modelValue": ($event) => unref(networkForm).deviceId = $event,
                      items: unref(deviceOptions),
                      "value-key": "value",
                      "label-key": "label",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Komentarz" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(networkForm).comment,
                    "onUpdate:modelValue": ($event) => unref(networkForm).comment = $event,
                    data: 2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(networkForm).comment,
                      "onUpdate:modelValue": ($event) => unref(networkForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(isImportingNetwork),
              label: "Importuj sieć"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(importNetwork, ["prevent"])
              }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Nazwa" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(networkForm).name,
                        "onUpdate:modelValue": ($event) => unref(networkForm).name = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "CIDR",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(networkForm).cidr,
                        "onUpdate:modelValue": ($event) => unref(networkForm).cidr = $event,
                        placeholder: "10.10.200.0/24"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Gateway" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(networkForm).gateway,
                        "onUpdate:modelValue": ($event) => unref(networkForm).gateway = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "VLAN" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(networkForm).vlanId,
                        "onUpdate:modelValue": ($event) => unref(networkForm).vlanId = $event,
                        type: "number"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Źródłowe urządzenie" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(networkForm).deviceId,
                        "onUpdate:modelValue": ($event) => unref(networkForm).deviceId = $event,
                        items: unref(deviceOptions),
                        "value-key": "value",
                        "label-key": "label",
                        searchable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_UFormField, { label: "Komentarz" }, {
                  default: withCtx(() => [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(networkForm).comment,
                      "onUpdate:modelValue": ($event) => unref(networkForm).comment = $event,
                      data: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isImportingNetwork),
                    label: "Importuj sieć"
                  }, null, 8, ["loading"])
                ])
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/operations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=operations-CZHBLe6t.mjs.map
