import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$4 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$5 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$6 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$7 } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$9 } from './Select-DYGJGuWK.mjs';
import { ref, reactive, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, isRef, withModifiers, withDirectives, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
  __name: "finances",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const tariffColumns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "monthlyPrice", header: "Cena / mies." },
      { accessorKey: "speedDownMbps", header: "Down" },
      { accessorKey: "speedUpMbps", header: "Up" },
      { accessorKey: "subscriptionCount", header: "Subskrypcje" },
      { accessorKey: "active", header: "Status" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const invoiceColumns = [
      { accessorKey: "number", header: "Numer" },
      { accessorKey: "customer", header: "Klient" },
      { accessorKey: "amount", header: "Kwota" },
      { accessorKey: "documentKind", header: "Typ" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "issueDate", header: "Data" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const invoiceStatusOptions = [
      { label: "Draft", value: "draft" },
      { label: "Issued", value: "issued" },
      { label: "Paid", value: "paid" }
    ];
    const invoiceKindOptions = [
      { label: "Faktura", value: "invoice" },
      { label: "Proforma", value: "proforma" },
      { label: "Nota debetowa", value: "debit_note" }
    ];
    const ledgerKindOptions = [
      { label: "Debet", value: "debit" },
      { label: "Kredyt", value: "credit" }
    ];
    const isTariffModalOpen = ref(false);
    const isInvoiceModalOpen = ref(false);
    const isPaymentModalOpen = ref(false);
    const isLedgerModalOpen = ref(false);
    const isCashModalOpen = ref(false);
    const isSavingTariff = ref(false);
    const isSavingInvoice = ref(false);
    const isSavingPayment = ref(false);
    const isSavingLedger = ref(false);
    const isSavingCash = ref(false);
    const tariffForm = reactive({
      id: null,
      name: "",
      monthlyPrice: "",
      description: "",
      speedDownMbps: "",
      speedUpMbps: "",
      active: true
    });
    const invoiceForm = reactive({
      id: null,
      number: "",
      customerId: null,
      amount: "",
      status: "draft",
      documentKind: "invoice",
      issueDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    const paymentForm = reactive({
      customerId: null,
      name: "",
      amount: "",
      intervalMonths: 1,
      dayOfMonth: 1,
      nextRun: ""
    });
    const ledgerForm = reactive({
      customerId: null,
      amount: "",
      kind: "debit",
      description: ""
    });
    const cashForm = reactive({
      customerId: null,
      amount: "",
      description: ""
    });
    const { data: tariffs, pending: pendingTariffs, refresh: refreshTariffs } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/tariffs",
      "$9KjM5rtHvc"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: invoices, pending: pendingInvoices, refresh: refreshInvoices } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/invoices",
      "$4E0yzGSyje"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: payments, refresh: refreshPayments } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/payments",
      "$996pTJk80K"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: ledgerEntries, refresh: refreshLedgerEntries } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/balance",
      "$mr69Kw-thQ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: cashReceipts, refresh: refreshCashReceipts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/finances/cash",
      "$Oa_Pqvw6Dw"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: { limit: 200 }
      },
      "$nSljSw_59L"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const customerOptions = computed(() => (customers.value || []).map((customer) => ({
      label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
      value: customer.id
    })));
    const customerOptionsWithEmpty = computed(() => [
      { label: "Brak klienta", value: null },
      ...customerOptions.value
    ]);
    const invoiceStatusColor = (status) => {
      switch (status) {
        case "paid":
          return "emerald";
        case "issued":
          return "blue";
        case "draft":
          return "yellow";
        default:
          return "gray";
      }
    };
    const resetTariffForm = () => Object.assign(tariffForm, {
      id: null,
      name: "",
      monthlyPrice: "",
      description: "",
      speedDownMbps: "",
      speedUpMbps: "",
      active: true
    });
    const resetInvoiceForm = () => Object.assign(invoiceForm, {
      id: null,
      number: "",
      customerId: null,
      amount: "",
      status: "draft",
      documentKind: "invoice",
      issueDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    const resetPaymentForm = () => Object.assign(paymentForm, {
      customerId: null,
      name: "",
      amount: "",
      intervalMonths: 1,
      dayOfMonth: 1,
      nextRun: ""
    });
    const resetLedgerForm = () => Object.assign(ledgerForm, {
      customerId: null,
      amount: "",
      kind: "debit",
      description: ""
    });
    const resetCashForm = () => Object.assign(cashForm, {
      customerId: null,
      amount: "",
      description: ""
    });
    const openTariffEdit = (row) => {
      Object.assign(tariffForm, {
        id: row.id,
        name: row.name,
        monthlyPrice: row.monthlyPrice,
        description: row.description || "",
        speedDownMbps: row.speedDownMbps ?? "",
        speedUpMbps: row.speedUpMbps ?? "",
        active: !!row.active
      });
      isTariffModalOpen.value = true;
    };
    const openInvoiceEdit = (row) => {
      Object.assign(invoiceForm, {
        id: row.id,
        number: row.number,
        customerId: row.customerId,
        amount: row.amount,
        status: row.status,
        documentKind: row.documentKind,
        issueDate: row.issueDate
      });
      isInvoiceModalOpen.value = true;
    };
    const saveTariff = async () => {
      isSavingTariff.value = true;
      try {
        const payload = {
          name: tariffForm.name,
          monthlyPrice: Number(tariffForm.monthlyPrice),
          description: tariffForm.description || null,
          speedDownMbps: tariffForm.speedDownMbps === "" ? null : Number(tariffForm.speedDownMbps),
          speedUpMbps: tariffForm.speedUpMbps === "" ? null : Number(tariffForm.speedUpMbps),
          active: !!tariffForm.active
        };
        if (tariffForm.id) {
          await $fetch(`/api/v1/finances/tariffs/${tariffForm.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/finances/tariffs", { method: "POST", body: payload });
        }
        isTariffModalOpen.value = false;
        resetTariffForm();
        await refreshTariffs();
      } finally {
        isSavingTariff.value = false;
      }
    };
    const saveInvoice = async () => {
      isSavingInvoice.value = true;
      try {
        const payload = {
          number: invoiceForm.number,
          customerId: invoiceForm.customerId,
          amount: Number(invoiceForm.amount),
          status: invoiceForm.status,
          documentKind: invoiceForm.documentKind,
          issueDate: invoiceForm.issueDate
        };
        if (invoiceForm.id) {
          await $fetch(`/api/v1/finances/invoices/${invoiceForm.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/finances/invoices", { method: "POST", body: payload });
        }
        isInvoiceModalOpen.value = false;
        resetInvoiceForm();
        await refreshInvoices();
      } finally {
        isSavingInvoice.value = false;
      }
    };
    const savePayment = async () => {
      isSavingPayment.value = true;
      try {
        await $fetch("/api/v1/finances/payments", {
          method: "POST",
          body: {
            customerId: paymentForm.customerId,
            name: paymentForm.name,
            amount: Number(paymentForm.amount),
            intervalMonths: Number(paymentForm.intervalMonths),
            dayOfMonth: Number(paymentForm.dayOfMonth),
            nextRun: paymentForm.nextRun || null,
            active: true
          }
        });
        isPaymentModalOpen.value = false;
        resetPaymentForm();
        await refreshPayments();
      } finally {
        isSavingPayment.value = false;
      }
    };
    const saveLedgerEntry = async () => {
      isSavingLedger.value = true;
      try {
        await $fetch("/api/v1/finances/balance", {
          method: "POST",
          body: {
            customerId: ledgerForm.customerId,
            amount: Number(ledgerForm.amount),
            kind: ledgerForm.kind,
            description: ledgerForm.description
          }
        });
        isLedgerModalOpen.value = false;
        resetLedgerForm();
        await refreshLedgerEntries();
      } finally {
        isSavingLedger.value = false;
      }
    };
    const saveCashReceipt = async () => {
      isSavingCash.value = true;
      try {
        await $fetch("/api/v1/finances/cash", {
          method: "POST",
          body: {
            customerId: cashForm.customerId,
            amount: Number(cashForm.amount),
            description: cashForm.description
          }
        });
        isCashModalOpen.value = false;
        resetCashForm();
        await refreshCashReceipts();
      } finally {
        isSavingCash.value = false;
      }
    };
    const removeTariff = async (row) => {
      if (!confirm(`Usunąć taryfę "${row.name}"?`)) return;
      await $fetch(`/api/v1/finances/tariffs/${row.id}`, { method: "DELETE" });
      await refreshTariffs();
    };
    const removeInvoice = async (row) => {
      if (!confirm(`Usunąć dokument "${row.number}"?`)) return;
      await $fetch(`/api/v1/finances/invoices/${row.id}`, { method: "DELETE" });
      await refreshInvoices();
    };
    const removePayment = async (row) => {
      if (!confirm(`Usunąć płatność "${row.name}"?`)) return;
      await $fetch(`/api/v1/finances/payments/${row.id}`, { method: "DELETE" });
      await refreshPayments();
    };
    const removeLedgerEntry = async (row) => {
      if (!confirm(`Usunąć wpis "${row.description}"?`)) return;
      await $fetch(`/api/v1/finances/balance/${row.id}`, { method: "DELETE" });
      await refreshLedgerEntries();
    };
    const removeCashReceipt = async (row) => {
      if (!confirm(`Usunąć wpis "${row.description}"?`)) return;
      await $fetch(`/api/v1/finances/cash/${row.id}`, { method: "DELETE" });
      await refreshCashReceipts();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UCard = _sfc_main$1;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$4;
      const _component_UFormField = _sfc_main$5;
      const _component_UInput = _sfc_main$6;
      const _component_UTextarea = _sfc_main$7;
      const _component_USelect = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Finanse</h1><p class="text-sm text-gray-500">Aktywny baseline TS dla taryf, faktur, płatności stałych, księgi i kasy</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/subscriptions",
        color: "primary",
        icon: "i-heroicons-arrows-right-left",
        label: "Subskrypcje"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Taryfy</h2><p class="text-sm text-gray-500"${_scopeId}>Plany usług wykorzystywane przez subskrypcje klientów</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-heroicons-plus",
              label: "Dodaj taryfę",
              onClick: ($event) => isTariffModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Taryfy"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Plany usług wykorzystywane przez subskrypcje klientów")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-heroicons-plus",
                  label: "Dodaj taryfę",
                  onClick: ($event) => isTariffModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(tariffs) || [],
              columns: tariffColumns,
              loading: unref(pendingTariffs)
            }, {
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
                    onClick: ($event) => openTariffEdit(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeTariff(row)
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
                        onClick: ($event) => openTariffEdit(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeTariff(row)
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
                data: unref(tariffs) || [],
                columns: tariffColumns,
                loading: unref(pendingTariffs)
              }, {
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
                      onClick: ($event) => openTariffEdit(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeTariff(row)
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
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Faktury i dokumenty sprzedaży</h2><p class="text-sm text-gray-500"${_scopeId}>Minimalny baseline wystawiania i ewidencji dokumentów</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-heroicons-document-plus",
              label: "Nowy dokument",
              onClick: ($event) => isInvoiceModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Faktury i dokumenty sprzedaży"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Minimalny baseline wystawiania i ewidencji dokumentów")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-heroicons-document-plus",
                  label: "Nowy dokument",
                  onClick: ($event) => isInvoiceModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(invoices) || [],
              columns: invoiceColumns,
              loading: unref(pendingInvoices)
            }, {
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: invoiceStatusColor(row.status),
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
                      color: invoiceStatusColor(row.status),
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
              "customer-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta"), 1)
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
                    onClick: ($event) => openInvoiceEdit(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeInvoice(row)
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
                        onClick: ($event) => openInvoiceEdit(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeInvoice(row)
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
                data: unref(invoices) || [],
                columns: invoiceColumns,
                loading: unref(pendingInvoices)
              }, {
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: invoiceStatusColor(row.status),
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.status), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "customer-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta"), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-pencil-square",
                      onClick: ($event) => openInvoiceEdit(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeInvoice(row)
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
      _push(`<div class="grid lg:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold"${_scopeId}>Płatności stałe</h2><p class="text-sm text-gray-500"${_scopeId}>Cykliczne należności</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              size: "xs",
              icon: "i-heroicons-plus",
              onClick: ($event) => isPaymentModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold" }, "Płatności stałe"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Cykliczne należności")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  variant: "soft",
                  size: "xs",
                  icon: "i-heroicons-plus",
                  onClick: ($event) => isPaymentModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(payments) || [], (payment) => {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(payment.name)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(payment.customer?.customerCode)} · ${ssrInterpolate(payment.amount.toFixed(2))} PLN</div><div class="text-xs text-gray-400"${_scopeId}>Co ${ssrInterpolate(payment.intervalMonths)} mies. · dzień ${ssrInterpolate(payment.dayOfMonth)}</div></div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "red",
                variant: "ghost",
                icon: "i-heroicons-trash",
                onClick: ($event) => removePayment(payment)
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(payments) || [], (payment) => {
                  return openBlock(), createBlock("div", {
                    key: payment.id,
                    class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-medium" }, toDisplayString(payment.name), 1),
                        createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(payment.customer?.customerCode) + " · " + toDisplayString(payment.amount.toFixed(2)) + " PLN", 1),
                        createVNode("div", { class: "text-xs text-gray-400" }, "Co " + toDisplayString(payment.intervalMonths) + " mies. · dzień " + toDisplayString(payment.dayOfMonth), 1)
                      ]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removePayment(payment)
                      }, null, 8, ["onClick"])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold"${_scopeId}>Księga</h2><p class="text-sm text-gray-500"${_scopeId}>Operacje debet / kredyt</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              size: "xs",
              icon: "i-heroicons-plus",
              onClick: ($event) => isLedgerModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold" }, "Księga"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Operacje debet / kredyt")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  variant: "soft",
                  size: "xs",
                  icon: "i-heroicons-plus",
                  onClick: ($event) => isLedgerModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(ledgerEntries) || [], (entry) => {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(entry.description)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(entry.customer?.customerCode)} · ${ssrInterpolate(entry.amount.toFixed(2))} PLN</div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: entry.kind === "credit" ? "emerald" : "yellow",
                variant: "soft",
                size: "xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(entry.kind)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(entry.kind), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "red",
                variant: "ghost",
                icon: "i-heroicons-trash",
                onClick: ($event) => removeLedgerEntry(entry)
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(ledgerEntries) || [], (entry) => {
                  return openBlock(), createBlock("div", {
                    key: entry.id,
                    class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-medium" }, toDisplayString(entry.description), 1),
                        createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(entry.customer?.customerCode) + " · " + toDisplayString(entry.amount.toFixed(2)) + " PLN", 1),
                        createVNode(_component_UBadge, {
                          color: entry.kind === "credit" ? "emerald" : "yellow",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(entry.kind), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeLedgerEntry(entry)
                      }, null, 8, ["onClick"])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold"${_scopeId}>Kasa</h2><p class="text-sm text-gray-500"${_scopeId}>Wpłaty i paragony</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              size: "xs",
              icon: "i-heroicons-plus",
              onClick: ($event) => isCashModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold" }, "Kasa"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Wpłaty i paragony")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  variant: "soft",
                  size: "xs",
                  icon: "i-heroicons-plus",
                  onClick: ($event) => isCashModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(cashReceipts) || [], (receipt) => {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(receipt.description)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(receipt.customer?.customerCode || "Bez klienta")} · ${ssrInterpolate(receipt.amount.toFixed(2))} PLN</div></div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "red",
                variant: "ghost",
                icon: "i-heroicons-trash",
                onClick: ($event) => removeCashReceipt(receipt)
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(cashReceipts) || [], (receipt) => {
                  return openBlock(), createBlock("div", {
                    key: receipt.id,
                    class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-medium" }, toDisplayString(receipt.description), 1),
                        createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(receipt.customer?.customerCode || "Bez klienta") + " · " + toDisplayString(receipt.amount.toFixed(2)) + " PLN", 1)
                      ]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeCashReceipt(receipt)
                      }, null, 8, ["onClick"])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isTariffModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isTariffModalOpen) ? isTariffModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(tariffForm).id ? "Edytuj taryfę" : "Dodaj taryfę")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(tariffForm).id ? "Edytuj taryfę" : "Dodaj taryfę"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Nazwa",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(tariffForm).name,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).name,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Cena miesięczna",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(tariffForm).monthlyPrice,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).monthlyPrice = $event,
                          type: "number",
                          step: "0.01"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).monthlyPrice,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).monthlyPrice = $event,
                            type: "number",
                            step: "0.01"
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
                          modelValue: unref(tariffForm).speedDownMbps,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).speedDownMbps = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).speedDownMbps,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).speedDownMbps = $event,
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
                          modelValue: unref(tariffForm).speedUpMbps,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).speedUpMbps = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).speedUpMbps,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).speedUpMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Opis" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(tariffForm).description,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).description = $event,
                          data: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(tariffForm).description,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<label class="flex items-center gap-3 text-sm"${_scopeId2}><input${ssrIncludeBooleanAttr(Array.isArray(unref(tariffForm).active) ? ssrLooseContain(unref(tariffForm).active, null) : unref(tariffForm).active) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${_scopeId2}><span${_scopeId2}>Taryfa aktywna</span></label><div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    label: "Anuluj",
                    onClick: ($event) => isTariffModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingTariff),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveTariff, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Nazwa",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tariffForm).name,
                              "onUpdate:modelValue": ($event) => unref(tariffForm).name = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Cena miesięczna",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tariffForm).monthlyPrice,
                              "onUpdate:modelValue": ($event) => unref(tariffForm).monthlyPrice = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Download (Mbps)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tariffForm).speedDownMbps,
                              "onUpdate:modelValue": ($event) => unref(tariffForm).speedDownMbps = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Upload (Mbps)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tariffForm).speedUpMbps,
                              "onUpdate:modelValue": ($event) => unref(tariffForm).speedUpMbps = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, { label: "Opis" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(tariffForm).description,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("label", { class: "flex items-center gap-3 text-sm" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(tariffForm).active = $event,
                          type: "checkbox",
                          class: "rounded border-gray-300"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(tariffForm).active]
                        ]),
                        createVNode("span", null, "Taryfa aktywna")
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isTariffModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingTariff),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(tariffForm).id ? "Edytuj taryfę" : "Dodaj taryfę"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveTariff, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Nazwa",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).name,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Cena miesięczna",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).monthlyPrice,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).monthlyPrice = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Download (Mbps)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).speedDownMbps,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).speedDownMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Upload (Mbps)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tariffForm).speedUpMbps,
                            "onUpdate:modelValue": ($event) => unref(tariffForm).speedUpMbps = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, { label: "Opis" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(tariffForm).description,
                          "onUpdate:modelValue": ($event) => unref(tariffForm).description = $event,
                          data: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("label", { class: "flex items-center gap-3 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(tariffForm).active = $event,
                        type: "checkbox",
                        class: "rounded border-gray-300"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(tariffForm).active]
                      ]),
                      createVNode("span", null, "Taryfa aktywna")
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isTariffModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingTariff),
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isInvoiceModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isInvoiceModalOpen) ? isInvoiceModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(invoiceForm).id ? "Edytuj dokument" : "Dodaj dokument")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(invoiceForm).id ? "Edytuj dokument" : "Dodaj dokument"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Numer",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(invoiceForm).number,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).number = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).number,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).number = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Kwota brutto",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(invoiceForm).amount,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).amount,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-3 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(invoiceForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Status" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(invoiceForm).status,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).status = $event,
                          items: invoiceStatusOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).status,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).status = $event,
                            items: invoiceStatusOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Typ" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(invoiceForm).documentKind,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).documentKind = $event,
                          items: invoiceKindOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).documentKind,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).documentKind = $event,
                            items: invoiceKindOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Data wystawienia" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(invoiceForm).issueDate,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).issueDate = $event,
                          type: "date"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).issueDate,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).issueDate = $event,
                            type: "date"
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
                    onClick: ($event) => isInvoiceModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingInvoice),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveInvoice, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Numer",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(invoiceForm).number,
                              "onUpdate:modelValue": ($event) => unref(invoiceForm).number = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Kwota brutto",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(invoiceForm).amount,
                              "onUpdate:modelValue": ($event) => unref(invoiceForm).amount = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Klient" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(invoiceForm).customerId,
                              "onUpdate:modelValue": ($event) => unref(invoiceForm).customerId = $event,
                              items: unref(customerOptions),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Status" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(invoiceForm).status,
                              "onUpdate:modelValue": ($event) => unref(invoiceForm).status = $event,
                              items: invoiceStatusOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Typ" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(invoiceForm).documentKind,
                              "onUpdate:modelValue": ($event) => unref(invoiceForm).documentKind = $event,
                              items: invoiceKindOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, { label: "Data wystawienia" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).issueDate,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).issueDate = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isInvoiceModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingInvoice),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(invoiceForm).id ? "Edytuj dokument" : "Dodaj dokument"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveInvoice, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Numer",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).number,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).number = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Kwota brutto",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(invoiceForm).amount,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Status" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).status,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).status = $event,
                            items: invoiceStatusOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Typ" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(invoiceForm).documentKind,
                            "onUpdate:modelValue": ($event) => unref(invoiceForm).documentKind = $event,
                            items: invoiceKindOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, { label: "Data wystawienia" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(invoiceForm).issueDate,
                          "onUpdate:modelValue": ($event) => unref(invoiceForm).issueDate = $event,
                          type: "date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isInvoiceModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingInvoice),
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isPaymentModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isPaymentModalOpen) ? isPaymentModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>Dodaj płatność stałą</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, "Dodaj płatność stałą")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(paymentForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(paymentForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Nazwa",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paymentForm).name,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).name,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid md:grid-cols-3 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Kwota" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paymentForm).amount,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).amount,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Interwał (mies.)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paymentForm).intervalMonths,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).intervalMonths = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).intervalMonths,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).intervalMonths = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Dzień miesiąca" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paymentForm).dayOfMonth,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).dayOfMonth = $event,
                          type: "number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).dayOfMonth,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).dayOfMonth = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Następne uruchomienie" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paymentForm).nextRun,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).nextRun = $event,
                          type: "date"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).nextRun,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).nextRun = $event,
                            type: "date"
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
                    onClick: ($event) => isPaymentModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingPayment),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(savePayment, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(paymentForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Nazwa",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).name,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Kwota" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(paymentForm).amount,
                              "onUpdate:modelValue": ($event) => unref(paymentForm).amount = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Interwał (mies.)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(paymentForm).intervalMonths,
                              "onUpdate:modelValue": ($event) => unref(paymentForm).intervalMonths = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Dzień miesiąca" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(paymentForm).dayOfMonth,
                              "onUpdate:modelValue": ($event) => unref(paymentForm).dayOfMonth = $event,
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, { label: "Następne uruchomienie" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).nextRun,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).nextRun = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isPaymentModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingPayment),
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
                  createVNode("h3", { class: "text-lg font-bold" }, "Dodaj płatność stałą")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(savePayment, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, { label: "Klient" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(paymentForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Nazwa",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(paymentForm).name,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).name = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Kwota" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).amount,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Interwał (mies.)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).intervalMonths,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).intervalMonths = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Dzień miesiąca" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paymentForm).dayOfMonth,
                            "onUpdate:modelValue": ($event) => unref(paymentForm).dayOfMonth = $event,
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, { label: "Następne uruchomienie" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(paymentForm).nextRun,
                          "onUpdate:modelValue": ($event) => unref(paymentForm).nextRun = $event,
                          type: "date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isPaymentModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingPayment),
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isLedgerModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isLedgerModalOpen) ? isLedgerModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>Dodaj wpis do księgi</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis do księgi")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ledgerForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ledgerForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Opis",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(ledgerForm).description,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).description = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(ledgerForm).description,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).description = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Kwota" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(ledgerForm).amount,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(ledgerForm).amount,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Rodzaj" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ledgerForm).kind,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).kind = $event,
                          items: ledgerKindOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ledgerForm).kind,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).kind = $event,
                            items: ledgerKindOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    label: "Anuluj",
                    onClick: ($event) => isLedgerModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingLedger),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveLedgerEntry, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ledgerForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).customerId = $event,
                            items: unref(customerOptions),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Opis",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(ledgerForm).description,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).description = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Kwota" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(ledgerForm).amount,
                              "onUpdate:modelValue": ($event) => unref(ledgerForm).amount = $event,
                              type: "number",
                              step: "0.01"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Rodzaj" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(ledgerForm).kind,
                              "onUpdate:modelValue": ($event) => unref(ledgerForm).kind = $event,
                              items: ledgerKindOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isLedgerModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingLedger),
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
                  createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis do księgi")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveLedgerEntry, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, { label: "Klient" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(ledgerForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).customerId = $event,
                          items: unref(customerOptions),
                          "label-key": "label"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Opis",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(ledgerForm).description,
                          "onUpdate:modelValue": ($event) => unref(ledgerForm).description = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Kwota" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(ledgerForm).amount,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Rodzaj" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ledgerForm).kind,
                            "onUpdate:modelValue": ($event) => unref(ledgerForm).kind = $event,
                            items: ledgerKindOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isLedgerModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingLedger),
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isCashModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isCashModalOpen) ? isCashModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>Dodaj wpis kasy</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis kasy")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(cashForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(cashForm).customerId = $event,
                          items: unref(customerOptionsWithEmpty),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(cashForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(cashForm).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Opis",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(cashForm).description,
                          "onUpdate:modelValue": ($event) => unref(cashForm).description = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(cashForm).description,
                            "onUpdate:modelValue": ($event) => unref(cashForm).description = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Kwota" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(cashForm).amount,
                          "onUpdate:modelValue": ($event) => unref(cashForm).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(cashForm).amount,
                            "onUpdate:modelValue": ($event) => unref(cashForm).amount = $event,
                            type: "number",
                            step: "0.01"
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
                    onClick: ($event) => isCashModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingCash),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveCashReceipt, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(cashForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(cashForm).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Opis",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(cashForm).description,
                            "onUpdate:modelValue": ($event) => unref(cashForm).description = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Kwota" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(cashForm).amount,
                            "onUpdate:modelValue": ($event) => unref(cashForm).amount = $event,
                            type: "number",
                            step: "0.01"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isCashModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingCash),
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
                  createVNode("h3", { class: "text-lg font-bold" }, "Dodaj wpis kasy")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveCashReceipt, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, { label: "Klient" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(cashForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(cashForm).customerId = $event,
                          items: unref(customerOptionsWithEmpty),
                          "label-key": "label"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Opis",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(cashForm).description,
                          "onUpdate:modelValue": ($event) => unref(cashForm).description = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, { label: "Kwota" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(cashForm).amount,
                          "onUpdate:modelValue": ($event) => unref(cashForm).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isCashModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingCash),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/finances.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=finances-BqSTRCaV.mjs.map
