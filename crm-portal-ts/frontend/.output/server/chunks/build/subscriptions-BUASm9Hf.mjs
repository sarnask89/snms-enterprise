import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$4 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$5 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$6 } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$7 } from './Input-B7kliWtD.mjs';
import { ref, reactive, withAsyncContext, computed, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, isRef, withModifiers, withDirectives, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "subscriptions",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const columns = [
      { accessorKey: "customer", header: "Klient" },
      { accessorKey: "tariff", header: "Taryfa" },
      { accessorKey: "device", header: "Urządzenie" },
      { accessorKey: "technology", header: "Technologia" },
      { accessorKey: "startDate", header: "Start" },
      { accessorKey: "active", header: "Status" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const technologyOptions = [
      { label: "FTTH", value: "FTTH" },
      { label: "HFC", value: "HFC" },
      { label: "ADSL", value: "ADSL" },
      { label: "Ethernet", value: "Ethernet" },
      { label: "Wireless", value: "Wireless" },
      { label: "Copper", value: "Copper" },
      { label: "Other", value: "Other" }
    ];
    const isModalOpen = ref(false);
    const isSaving = ref(false);
    const customerDevices = ref([]);
    const form = reactive({
      id: null,
      customerId: null,
      tariffId: null,
      deviceId: null,
      startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      endDate: "",
      active: true,
      technology: "FTTH",
      speedDownMbps: "",
      speedUpMbps: ""
    });
    const { data: subscriptions, pending: pendingSubscriptions, refresh: refreshSubscriptions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/subscriptions",
      "$6NLi5GaQud"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      { query: { limit: 200 } },
      "$eY_8FXQaLt"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: tariffs } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/tariffs",
      "$B9pVIWYFu9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const customerOptions = computed(() => (customers.value || []).map((customer) => ({
      label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
      value: customer.id
    })));
    const tariffOptions = computed(() => (tariffs.value || []).map((tariff) => ({
      label: `${tariff.name} · ${tariff.monthlyPrice.toFixed(2)} PLN`,
      value: tariff.id
    })));
    const deviceOptions = computed(() => [
      { label: "Wszystkie urządzenia", value: null },
      ...customerDevices.value.map((device) => ({
        label: `${device.hostname}${device.ipAddress ? ` (${device.ipAddress})` : ""}`,
        value: device.id
      }))
    ]);
    const loadCustomerDevices = async (customerId) => {
      if (!customerId) {
        customerDevices.value = [];
        return;
      }
      customerDevices.value = await $fetch(`/api/v1/subscriptions/customer-nodes/${customerId}`);
    };
    watch(() => form.customerId, async (customerId) => {
      await loadCustomerDevices(customerId);
      if (!customerDevices.value.some((device) => device.id === form.deviceId)) {
        form.deviceId = null;
      }
    });
    const resetForm = () => Object.assign(form, {
      id: null,
      customerId: null,
      tariffId: null,
      deviceId: null,
      startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      endDate: "",
      active: true,
      technology: "FTTH",
      speedDownMbps: "",
      speedUpMbps: ""
    });
    const openCreateModal = async () => {
      resetForm();
      customerDevices.value = [];
      isModalOpen.value = true;
    };
    const openEditModal = async (row) => {
      const subscription = await $fetch(`/api/v1/subscriptions/${row.id}`);
      Object.assign(form, {
        id: subscription.id,
        customerId: subscription.customerId,
        tariffId: subscription.tariffId,
        deviceId: subscription.deviceId,
        startDate: subscription.startDate,
        endDate: subscription.endDate || "",
        active: !!subscription.active,
        technology: subscription.technology,
        speedDownMbps: subscription.speedDownMbps ?? "",
        speedUpMbps: subscription.speedUpMbps ?? ""
      });
      await loadCustomerDevices(subscription.customerId);
      isModalOpen.value = true;
    };
    const saveSubscription = async () => {
      isSaving.value = true;
      try {
        const payload = {
          customerId: form.customerId,
          tariffId: form.tariffId,
          deviceId: form.deviceId,
          startDate: form.startDate,
          endDate: form.endDate || null,
          active: !!form.active,
          technology: form.technology,
          speedDownMbps: form.speedDownMbps === "" ? null : Number(form.speedDownMbps),
          speedUpMbps: form.speedUpMbps === "" ? null : Number(form.speedUpMbps)
        };
        if (form.id) {
          await $fetch(`/api/v1/subscriptions/${form.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/subscriptions", { method: "POST", body: payload });
        }
        isModalOpen.value = false;
        resetForm();
        customerDevices.value = [];
        await refreshSubscriptions();
      } finally {
        isSaving.value = false;
      }
    };
    const toggleSubscription = async (row) => {
      await $fetch(`/api/v1/subscriptions/${row.id}/toggle`, { method: "POST" });
      await refreshSubscriptions();
    };
    const removeSubscription = async (row) => {
      if (!confirm(`Usunąć subskrypcję klienta ${row.customer?.customerCode || row.customerId}?`)) return;
      await $fetch(`/api/v1/subscriptions/${row.id}`, { method: "DELETE" });
      await refreshSubscriptions();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$4;
      const _component_UFormField = _sfc_main$5;
      const _component_USelect = _sfc_main$6;
      const _component_UInput = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subskrypcje</h1><p class="text-sm text-gray-500">Powiązanie klienta, taryfy i opcjonalnego urządzenia dostępowego</p></div><div class="flex gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/finances",
        color: "gray",
        variant: "soft",
        icon: "i-heroicons-banknotes",
        label: "Finanse"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-plus",
        label: "Nowa subskrypcja",
        onClick: openCreateModal
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(subscriptions) || [],
              columns,
              loading: unref(pendingSubscriptions)
            }, {
              "customer-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta"), 1)
                  ];
                }
              }),
              "tariff-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.tariff ? `${row.tariff.name} · ${row.tariff.monthlyPrice.toFixed(2)} PLN` : "Brak taryfy")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.tariff ? `${row.tariff.name} · ${row.tariff.monthlyPrice.toFixed(2)} PLN` : "Brak taryfy"), 1)
                  ];
                }
              }),
              "device-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.device ? `${row.device.hostname} ${row.device.ipAddress ? `(${row.device.ipAddress})` : ""}` : "Wszystkie urządzenia")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.device ? `${row.device.hostname} ${row.device.ipAddress ? `(${row.device.ipAddress})` : ""}` : "Wszystkie urządzenia"), 1)
                  ];
                }
              }),
              "active-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.active ? "emerald" : "gray",
                    variant: "soft"
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
                    createVNode(_component_UBadge, {
                      color: row.active ? "emerald" : "gray",
                      variant: "soft"
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
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-pencil-square",
                    onClick: ($event) => openEditModal(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: row.active ? "yellow" : "emerald",
                    variant: "ghost",
                    icon: "i-heroicons-power",
                    onClick: ($event) => toggleSubscription(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeSubscription(row)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-pencil-square",
                        onClick: ($event) => openEditModal(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: row.active ? "yellow" : "emerald",
                        variant: "ghost",
                        icon: "i-heroicons-power",
                        onClick: ($event) => toggleSubscription(row)
                      }, null, 8, ["color", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeSubscription(row)
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
                data: unref(subscriptions) || [],
                columns,
                loading: unref(pendingSubscriptions)
              }, {
                "customer-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta"), 1)
                ]),
                "tariff-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.tariff ? `${row.tariff.name} · ${row.tariff.monthlyPrice.toFixed(2)} PLN` : "Brak taryfy"), 1)
                ]),
                "device-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.device ? `${row.device.hostname} ${row.device.ipAddress ? `(${row.device.ipAddress})` : ""}` : "Wszystkie urządzenia"), 1)
                ]),
                "active-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.active ? "emerald" : "gray",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.active ? "Aktywna" : "Wyłączona"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-pencil-square",
                      onClick: ($event) => openEditModal(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: row.active ? "yellow" : "emerald",
                      variant: "ghost",
                      icon: "i-heroicons-power",
                      onClick: ($event) => toggleSubscription(row)
                    }, null, 8, ["color", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeSubscription(row)
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
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(form).id ? "Edytuj subskrypcję" : "Dodaj subskrypcję")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(form).id ? "Edytuj subskrypcję" : "Dodaj subskrypcję"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Klient",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).customerId,
                          "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).customerId,
                            "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Taryfa",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).tariffId,
                          "onUpdate:modelValue": ($event) => unref(form).tariffId = $event,
                          items: unref(tariffOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).tariffId,
                            "onUpdate:modelValue": ($event) => unref(form).tariffId = $event,
                            items: unref(tariffOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Urządzenie" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).deviceId,
                          "onUpdate:modelValue": ($event) => unref(form).deviceId = $event,
                          items: unref(deviceOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).deviceId,
                            "onUpdate:modelValue": ($event) => unref(form).deviceId = $event,
                            items: unref(deviceOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Technologia" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).technology,
                          "onUpdate:modelValue": ($event) => unref(form).technology = $event,
                          items: technologyOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).technology,
                            "onUpdate:modelValue": ($event) => unref(form).technology = $event,
                            items: technologyOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Start",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).startDate,
                          "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
                          type: "date"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).startDate,
                            "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Koniec" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).endDate,
                          "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
                          type: "date"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).endDate,
                            "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Download (Mbps)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).speedDownMbps,
                          "onUpdate:modelValue": ($event) => unref(form).speedDownMbps = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).speedDownMbps,
                            "onUpdate:modelValue": ($event) => unref(form).speedDownMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Upload (Mbps)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).speedUpMbps,
                          "onUpdate:modelValue": ($event) => unref(form).speedUpMbps = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).speedUpMbps,
                            "onUpdate:modelValue": ($event) => unref(form).speedUpMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><label class="flex items-center gap-3 text-sm"${_scopeId2}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).active) ? ssrLooseContain(unref(form).active, null) : unref(form).active) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${_scopeId2}><span${_scopeId2}>Subskrypcja aktywna</span></label><div class="flex justify-end gap-2"${_scopeId2}>`);
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
                      onSubmit: withModifiers(saveSubscription, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Klient",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).customerId,
                              "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                              items: unref(customerOptions),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Taryfa",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).tariffId,
                              "onUpdate:modelValue": ($event) => unref(form).tariffId = $event,
                              items: unref(tariffOptions),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Urządzenie" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).deviceId,
                              "onUpdate:modelValue": ($event) => unref(form).deviceId = $event,
                              items: unref(deviceOptions),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Technologia" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(form).technology,
                              "onUpdate:modelValue": ($event) => unref(form).technology = $event,
                              items: technologyOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Start",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).startDate,
                              "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
                              type: "date"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Koniec" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).endDate,
                              "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
                              type: "date"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Download (Mbps)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).speedDownMbps,
                              "onUpdate:modelValue": ($event) => unref(form).speedDownMbps = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Upload (Mbps)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).speedUpMbps,
                              "onUpdate:modelValue": ($event) => unref(form).speedUpMbps = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("label", { class: "flex items-center gap-3 text-sm" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).active = $event,
                          type: "checkbox",
                          class: "rounded border-gray-300"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).active]
                        ]),
                        createVNode("span", null, "Subskrypcja aktywna")
                      ]),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(form).id ? "Edytuj subskrypcję" : "Dodaj subskrypcję"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveSubscription, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Klient",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).customerId,
                            "onUpdate:modelValue": ($event) => unref(form).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Taryfa",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).tariffId,
                            "onUpdate:modelValue": ($event) => unref(form).tariffId = $event,
                            items: unref(tariffOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Urządzenie" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).deviceId,
                            "onUpdate:modelValue": ($event) => unref(form).deviceId = $event,
                            items: unref(deviceOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Technologia" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).technology,
                            "onUpdate:modelValue": ($event) => unref(form).technology = $event,
                            items: technologyOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Start",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).startDate,
                            "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Koniec" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).endDate,
                            "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Download (Mbps)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).speedDownMbps,
                            "onUpdate:modelValue": ($event) => unref(form).speedDownMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Upload (Mbps)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).speedUpMbps,
                            "onUpdate:modelValue": ($event) => unref(form).speedUpMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("label", { class: "flex items-center gap-3 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).active = $event,
                        type: "checkbox",
                        class: "rounded border-gray-300"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(form).active]
                      ]),
                      createVNode("span", null, "Subskrypcja aktywna")
                    ]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/subscriptions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=subscriptions-BUASm9Hf.mjs.map
