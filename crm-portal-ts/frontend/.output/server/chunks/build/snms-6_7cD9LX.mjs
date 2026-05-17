import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$3 } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$4 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$5 } from './Separator-CoXp0Z15.mjs';
import { _ as _sfc_main$6 } from './SelectMenu-BhfO7re0.mjs';
import { _ as _sfc_main$7 } from './Checkbox-mfegmXJ0.mjs';
import { reactive, ref, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './useFilter-BytkjEhg.mjs';
import './virtualizer-Dnga9fey.mjs';
import './utils-Bd-v-gOF.mjs';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import './isValueEqualOrExist-DDZNo4Zk.mjs';
import './RovingFocusGroup-C9aTixOz.mjs';
import './Label-BCnUNGB-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@vue/shared';

const _sfc_main = {
  __name: "snms",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const templateColumns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "subject", header: "Temat" }
    ];
    const messageColumns = [
      { accessorKey: "subject", header: "Temat" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "createdAt", header: "Utworzono" }
    ];
    const eventColumns = [
      { accessorKey: "title", header: "Tytuł" },
      { accessorKey: "startsAt", header: "Start" },
      { accessorKey: "endsAt", header: "Koniec" },
      { accessorKey: "done", header: "Done" }
    ];
    const trafficColumns = [
      { accessorKey: "periodStart", header: "Od" },
      { accessorKey: "periodEnd", header: "Do" },
      { accessorKey: "bytesIn", header: "Bytes in" },
      { accessorKey: "bytesOut", header: "Bytes out" }
    ];
    const settingColumns = [
      { accessorKey: "key", header: "Klucz" },
      { accessorKey: "value", header: "Wartość" }
    ];
    const templateForm = reactive({ name: "", subject: "", body: "" });
    const messageForm = reactive({ templateId: null, customerId: null, subject: "", body: "", sent: false });
    const eventForm = reactive({ title: "", description: "", startsAt: "", endsAt: "", customerId: null, done: false });
    const trafficForm = reactive({ deviceId: null, periodStart: "", periodEnd: "", bytesIn: "", bytesOut: "", note: "" });
    const settingForm = reactive({ accessorKey: "", value: "" });
    const isSavingTemplate = ref(false);
    const isSavingMessage = ref(false);
    const isSavingEvent = ref(false);
    const isSavingTrafficStat = ref(false);
    const isSavingSetting = ref(false);
    const { data: templates, refresh: refreshTemplates } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/snms/messages/templates",
      "$NIkXp1-cL0"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: messages, refresh: refreshMessages } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/snms/messages",
      "$UIoYztM6dh"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: timetable, refresh: refreshTimetable } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/snms/timetable",
      "$RQuguQjBJq"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: trafficStats, refresh: refreshTrafficStats } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/snms/traffic-stats",
      "$NldZUL18Xt"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: settings, refresh: refreshSettings } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/snms/config",
      "$_h_rXaxvJf"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      { query: { limit: 200 } },
      "$oxOGVv5Y3U"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customerDevices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customer-devices",
      { query: { limit: 200 } },
      "$RIy3CrqjNp"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const templateOptions = computed(() => (templates.value || []).map((row) => ({
      label: row.name,
      value: row.id
    })));
    const customerOptions = computed(() => [
      { label: "Bez klienta", value: null },
      ...(customers.value || []).map((customer) => ({
        label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
        value: customer.id
      }))
    ]);
    const customerDeviceOptions = computed(() => [
      { label: "Bez urządzenia", value: null },
      ...(customerDevices.value || []).map((device) => ({
        label: `${device.hostname}${device.ipAddress ? ` · ${device.ipAddress}` : ""}`,
        value: device.id
      }))
    ]);
    const refreshAll = async () => {
      await Promise.all([
        refreshTemplates(),
        refreshMessages(),
        refreshTimetable(),
        refreshTrafficStats(),
        refreshSettings()
      ]);
    };
    const saveTemplate = async () => {
      isSavingTemplate.value = true;
      try {
        await $fetch("/api/v1/snms/messages/templates", {
          method: "POST",
          body: { ...templateForm }
        });
        Object.assign(templateForm, { name: "", subject: "", body: "" });
        await refreshTemplates();
      } finally {
        isSavingTemplate.value = false;
      }
    };
    const saveMessage = async () => {
      isSavingMessage.value = true;
      try {
        await $fetch("/api/v1/snms/messages", {
          method: "POST",
          body: { ...messageForm }
        });
        Object.assign(messageForm, { templateId: null, customerId: null, subject: "", body: "", sent: false });
        await refreshMessages();
      } finally {
        isSavingMessage.value = false;
      }
    };
    const saveEvent = async () => {
      isSavingEvent.value = true;
      try {
        await $fetch("/api/v1/snms/timetable", {
          method: "POST",
          body: { ...eventForm }
        });
        Object.assign(eventForm, { title: "", description: "", startsAt: "", endsAt: "", customerId: null, done: false });
        await refreshTimetable();
      } finally {
        isSavingEvent.value = false;
      }
    };
    const saveTrafficStat = async () => {
      isSavingTrafficStat.value = true;
      try {
        await $fetch("/api/v1/snms/traffic-stats", {
          method: "POST",
          body: { ...trafficForm }
        });
        Object.assign(trafficForm, { deviceId: null, periodStart: "", periodEnd: "", bytesIn: "", bytesOut: "", note: "" });
        await refreshTrafficStats();
      } finally {
        isSavingTrafficStat.value = false;
      }
    };
    const saveSetting = async () => {
      isSavingSetting.value = true;
      try {
        await $fetch("/api/v1/snms/config", {
          method: "POST",
          body: { ...settingForm }
        });
        Object.assign(settingForm, { accessorKey: "", value: "" });
        await refreshSettings();
      } finally {
        isSavingSetting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_USeparator = _sfc_main$5;
      const _component_USelectMenu = _sfc_main$6;
      const _component_UCheckbox = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">SNMS entities</h1><p class="text-sm text-gray-500">Wiadomości, szablony, terminarz, statystyki ruchu i ustawienia runtime.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(`</div><div class="grid xl:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Szablony i wiadomości</h2><p class="text-sm text-gray-500"${_scopeId}>Tworzenie szablonów i wiadomości wychodzących.</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Szablony i wiadomości"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Tworzenie szablonów i wiadomości wychodzących.")
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="grid md:grid-cols-3 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(templateForm).name,
              "onUpdate:modelValue": ($event) => unref(templateForm).name = $event,
              placeholder: "Nazwa szablonu"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(templateForm).subject,
              "onUpdate:modelValue": ($event) => unref(templateForm).subject = $event,
              placeholder: "Temat szablonu",
              class: "md:col-span-2"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(templateForm).body,
              "onUpdate:modelValue": ($event) => unref(templateForm).body = $event,
              data: 3,
              placeholder: "Treść szablonu"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isSavingTemplate),
              label: "Dodaj szablon",
              onClick: saveTemplate
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(templates) || [],
              columns: templateColumns
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(messageForm).templateId,
              "onUpdate:modelValue": ($event) => unref(messageForm).templateId = $event,
              items: unref(templateOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Szablon opcjonalny"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(messageForm).customerId,
              "onUpdate:modelValue": ($event) => unref(messageForm).customerId = $event,
              items: unref(customerOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Klient opcjonalny"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(messageForm).subject,
              "onUpdate:modelValue": ($event) => unref(messageForm).subject = $event,
              placeholder: "Temat wiadomości"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(messageForm).body,
              "onUpdate:modelValue": ($event) => unref(messageForm).body = $event,
              data: 4,
              placeholder: "Treść wiadomości"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(messageForm).sent,
              "onUpdate:modelValue": ($event) => unref(messageForm).sent = $event,
              label: "Oznacz jako sent"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              loading: unref(isSavingMessage),
              label: "Dodaj wiadomość",
              onClick: saveMessage
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(messages) || [],
              columns: messageColumns
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "grid md:grid-cols-3 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(templateForm).name,
                    "onUpdate:modelValue": ($event) => unref(templateForm).name = $event,
                    placeholder: "Nazwa szablonu"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(templateForm).subject,
                    "onUpdate:modelValue": ($event) => unref(templateForm).subject = $event,
                    placeholder: "Temat szablonu",
                    class: "md:col-span-2"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode(_component_UTextarea, {
                  modelValue: unref(templateForm).body,
                  "onUpdate:modelValue": ($event) => unref(templateForm).body = $event,
                  data: 3,
                  placeholder: "Treść szablonu"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    color: "primary",
                    loading: unref(isSavingTemplate),
                    label: "Dodaj szablon",
                    onClick: saveTemplate
                  }, null, 8, ["loading"])
                ]),
                createVNode(_component_UTable, {
                  data: unref(templates) || [],
                  columns: templateColumns
                }, null, 8, ["data"]),
                createVNode(_component_USeparator),
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(messageForm).templateId,
                    "onUpdate:modelValue": ($event) => unref(messageForm).templateId = $event,
                    items: unref(templateOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Szablon opcjonalny"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(messageForm).customerId,
                    "onUpdate:modelValue": ($event) => unref(messageForm).customerId = $event,
                    items: unref(customerOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Klient opcjonalny"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                ]),
                createVNode(_component_UInput, {
                  modelValue: unref(messageForm).subject,
                  "onUpdate:modelValue": ($event) => unref(messageForm).subject = $event,
                  placeholder: "Temat wiadomości"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UTextarea, {
                  modelValue: unref(messageForm).body,
                  "onUpdate:modelValue": ($event) => unref(messageForm).body = $event,
                  data: 4,
                  placeholder: "Treść wiadomości"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(messageForm).sent,
                    "onUpdate:modelValue": ($event) => unref(messageForm).sent = $event,
                    label: "Oznacz jako sent"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UButton, {
                    color: "primary",
                    variant: "soft",
                    loading: unref(isSavingMessage),
                    label: "Dodaj wiadomość",
                    onClick: saveMessage
                  }, null, 8, ["loading"])
                ]),
                createVNode(_component_UTable, {
                  data: unref(messages) || [],
                  columns: messageColumns
                }, null, 8, ["data"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Terminarz i ruch</h2><p class="text-sm text-gray-500"${_scopeId}>Wydarzenia kalendarza i ręczne wpisy statystyk ruchu.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Terminarz i ruch"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Wydarzenia kalendarza i ręczne wpisy statystyk ruchu.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(eventForm).title,
              "onUpdate:modelValue": ($event) => unref(eventForm).title = $event,
              placeholder: "Tytuł wydarzenia"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(eventForm).customerId,
              "onUpdate:modelValue": ($event) => unref(eventForm).customerId = $event,
              items: unref(customerOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Klient opcjonalny"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(eventForm).startsAt,
              "onUpdate:modelValue": ($event) => unref(eventForm).startsAt = $event,
              type: "datetime-local"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(eventForm).endsAt,
              "onUpdate:modelValue": ($event) => unref(eventForm).endsAt = $event,
              type: "datetime-local"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(eventForm).description,
              "onUpdate:modelValue": ($event) => unref(eventForm).description = $event,
              data: 3,
              placeholder: "Opis wydarzenia"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(eventForm).done,
              "onUpdate:modelValue": ($event) => unref(eventForm).done = $event,
              label: "Done"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isSavingEvent),
              label: "Dodaj wydarzenie",
              onClick: saveEvent
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(timetable) || [],
              columns: eventColumns
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(trafficForm).deviceId,
              "onUpdate:modelValue": ($event) => unref(trafficForm).deviceId = $event,
              items: unref(customerDeviceOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Urządzenie klienta"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(trafficForm).note,
              "onUpdate:modelValue": ($event) => unref(trafficForm).note = $event,
              placeholder: "Notatka"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(trafficForm).periodStart,
              "onUpdate:modelValue": ($event) => unref(trafficForm).periodStart = $event,
              type: "date"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(trafficForm).periodEnd,
              "onUpdate:modelValue": ($event) => unref(trafficForm).periodEnd = $event,
              type: "date"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(trafficForm).bytesIn,
              "onUpdate:modelValue": ($event) => unref(trafficForm).bytesIn = $event,
              type: "number",
              placeholder: "Bytes in"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(trafficForm).bytesOut,
              "onUpdate:modelValue": ($event) => unref(trafficForm).bytesOut = $event,
              type: "number",
              placeholder: "Bytes out"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              loading: unref(isSavingTrafficStat),
              label: "Dodaj statystykę ruchu",
              onClick: saveTrafficStat
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(trafficStats) || [],
              columns: trafficColumns
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(eventForm).title,
                    "onUpdate:modelValue": ($event) => unref(eventForm).title = $event,
                    placeholder: "Tytuł wydarzenia"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(eventForm).customerId,
                    "onUpdate:modelValue": ($event) => unref(eventForm).customerId = $event,
                    items: unref(customerOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Klient opcjonalny"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(eventForm).startsAt,
                    "onUpdate:modelValue": ($event) => unref(eventForm).startsAt = $event,
                    type: "datetime-local"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(eventForm).endsAt,
                    "onUpdate:modelValue": ($event) => unref(eventForm).endsAt = $event,
                    type: "datetime-local"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode(_component_UTextarea, {
                  modelValue: unref(eventForm).description,
                  "onUpdate:modelValue": ($event) => unref(eventForm).description = $event,
                  data: 3,
                  placeholder: "Opis wydarzenia"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(eventForm).done,
                    "onUpdate:modelValue": ($event) => unref(eventForm).done = $event,
                    label: "Done"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UButton, {
                    color: "primary",
                    loading: unref(isSavingEvent),
                    label: "Dodaj wydarzenie",
                    onClick: saveEvent
                  }, null, 8, ["loading"])
                ]),
                createVNode(_component_UTable, {
                  data: unref(timetable) || [],
                  columns: eventColumns
                }, null, 8, ["data"]),
                createVNode(_component_USeparator),
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(trafficForm).deviceId,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).deviceId = $event,
                    items: unref(customerDeviceOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Urządzenie klienta"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(trafficForm).note,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).note = $event,
                    placeholder: "Notatka"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(trafficForm).periodStart,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).periodStart = $event,
                    type: "date"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(trafficForm).periodEnd,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).periodEnd = $event,
                    type: "date"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(trafficForm).bytesIn,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).bytesIn = $event,
                    type: "number",
                    placeholder: "Bytes in"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(trafficForm).bytesOut,
                    "onUpdate:modelValue": ($event) => unref(trafficForm).bytesOut = $event,
                    type: "number",
                    placeholder: "Bytes out"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_UButton, {
                    color: "primary",
                    variant: "soft",
                    loading: unref(isSavingTrafficStat),
                    label: "Dodaj statystykę ruchu",
                    onClick: saveTrafficStat
                  }, null, 8, ["loading"])
                ]),
                createVNode(_component_UTable, {
                  data: unref(trafficStats) || [],
                  columns: trafficColumns
                }, null, 8, ["data"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>App settings</h2><p class="text-sm text-gray-500"${_scopeId}>Lekkie ustawienia runtime współdzielone z modułami TS.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "App settings"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Lekkie ustawienia runtime współdzielone z modułami TS.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid md:grid-cols-[1fr_2fr_auto] gap-3 mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(settingForm).key,
              "onUpdate:modelValue": ($event) => unref(settingForm).key = $event,
              placeholder: "Klucz"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(settingForm).value,
              "onUpdate:modelValue": ($event) => unref(settingForm).value = $event,
              placeholder: "Wartość"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isSavingSetting),
              label: "Dodaj ustawienie",
              onClick: saveSetting
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(settings) || [],
              columns: settingColumns
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "grid md:grid-cols-[1fr_2fr_auto] gap-3 mb-4" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(settingForm).key,
                  "onUpdate:modelValue": ($event) => unref(settingForm).key = $event,
                  placeholder: "Klucz"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UInput, {
                  modelValue: unref(settingForm).value,
                  "onUpdate:modelValue": ($event) => unref(settingForm).value = $event,
                  placeholder: "Wartość"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  loading: unref(isSavingSetting),
                  label: "Dodaj ustawienie",
                  onClick: saveSetting
                }, null, 8, ["loading"])
              ]),
              createVNode(_component_UTable, {
                data: unref(settings) || [],
                columns: settingColumns
              }, null, 8, ["data"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/snms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=snms-6_7cD9LX.mjs.map
