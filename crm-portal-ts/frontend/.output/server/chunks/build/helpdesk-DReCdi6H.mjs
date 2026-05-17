import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { b as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$2 } from './Table-CiWunXtq.mjs';
import { _ as _sfc_main$4 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$3 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$5 } from './Modal-DkNstLKI.mjs';
import { _ as _sfc_main$6 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$7 } from './Textarea-DX4AdTCC.mjs';
import { _ as _sfc_main$9 } from './Select-DYGJGuWK.mjs';
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
  __name: "helpdesk",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const queueColumns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "description", header: "Opis" },
      { accessorKey: "categoryCount", header: "Kategorie" },
      { accessorKey: "ticketCount", header: "Tickety" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const categoryColumns = [
      { accessorKey: "name", header: "Nazwa" },
      { accessorKey: "queue", header: "Kolejka" },
      { accessorKey: "description", header: "Opis" },
      { accessorKey: "ticketCount", header: "Tickety" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const ticketColumns = [
      { accessorKey: "title", header: "Tytuł" },
      { accessorKey: "customer", header: "Klient" },
      { accessorKey: "queue", header: "Kolejka / kategoria" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "assigneeId", header: "Assignee" },
      { accessorKey: "actions", header: "Akcje" }
    ];
    const ticketStatusOptions = [
      { label: "Open", value: "open" },
      { label: "Pending", value: "pending" },
      { label: "Closed", value: "closed" }
    ];
    const isQueueModalOpen = ref(false);
    const isCategoryModalOpen = ref(false);
    const isTicketModalOpen = ref(false);
    const isSavingQueue = ref(false);
    const isSavingCategory = ref(false);
    const isSavingTicket = ref(false);
    const ticketSearch = ref("");
    const queueForm = reactive({
      id: null,
      name: "",
      description: ""
    });
    const categoryForm = reactive({
      id: null,
      queueId: null,
      name: "",
      description: ""
    });
    const ticketForm = reactive({
      id: null,
      customerId: null,
      queueId: null,
      categoryId: null,
      assigneeId: "",
      title: "",
      body: "",
      status: "open"
    });
    const { data: queues, pending: pendingQueues, refresh: refreshQueues } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/helpdesk/queues",
      "$FptrnoW4hb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories, pending: pendingCategories, refresh: refreshCategories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/helpdesk/categories",
      "$ptvSqZCiwE"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: tickets, pending: pendingTickets, refresh: refreshTickets } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/helpdesk/tickets",
      "$jvGlVMJNyx"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: reports, refresh: refreshReports } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/helpdesk/reports",
      "$rcolsBcdAf"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: customers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      { query: { limit: 200 } },
      "$4er_7ocPF2"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const filteredTickets = computed(() => {
      const rows = tickets.value || [];
      const query = ticketSearch.value.trim().toLowerCase();
      if (!query) {
        return rows;
      }
      return rows.filter(
        (row) => row.title.toLowerCase().includes(query) || (row.body || "").toLowerCase().includes(query)
      );
    });
    const queueOptions = computed(() => (queues.value || []).map((queue) => ({
      label: queue.name,
      value: queue.id
    })));
    const queueOptionsWithEmpty = computed(() => [
      { label: "Brak kolejki", value: null },
      ...queueOptions.value
    ]);
    const categoryOptions = computed(() => {
      const queueId = ticketForm.queueId ?? categoryForm.queueId;
      const rows = categories.value || [];
      return rows.filter((category) => !queueId || category.queueId === queueId).map((category) => ({
        label: category.name,
        value: category.id
      }));
    });
    const categoryOptionsWithEmpty = computed(() => [
      { label: "Brak kategorii", value: null },
      ...categoryOptions.value
    ]);
    const customerOptionsWithEmpty = computed(() => [
      { label: "Brak klienta", value: null },
      ...(customers.value || []).map((customer) => ({
        label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
        value: customer.id
      }))
    ]);
    const ticketStatusColor = (status) => {
      switch (status) {
        case "open":
          return "red";
        case "pending":
          return "yellow";
        case "closed":
          return "emerald";
        default:
          return "gray";
      }
    };
    const resetQueueForm = () => Object.assign(queueForm, { id: null, name: "", description: "" });
    const resetCategoryForm = () => Object.assign(categoryForm, { id: null, queueId: null, name: "", description: "" });
    const resetTicketForm = () => Object.assign(ticketForm, {
      id: null,
      customerId: null,
      queueId: null,
      categoryId: null,
      assigneeId: "",
      title: "",
      body: "",
      status: "open"
    });
    const openQueueEdit = (row) => {
      Object.assign(queueForm, { id: row.id, name: row.name, description: row.description || "" });
      isQueueModalOpen.value = true;
    };
    const openCategoryEdit = (row) => {
      Object.assign(categoryForm, {
        id: row.id,
        queueId: row.queueId,
        name: row.name,
        description: row.description || ""
      });
      isCategoryModalOpen.value = true;
    };
    const openTicketCreate = () => {
      resetTicketForm();
      isTicketModalOpen.value = true;
    };
    const openTicketEdit = async (row) => {
      const ticket = await $fetch(`/api/v1/helpdesk/tickets/${row.id}`);
      Object.assign(ticketForm, {
        id: ticket.id,
        customerId: ticket.customerId,
        queueId: ticket.queueId,
        categoryId: ticket.categoryId,
        assigneeId: ticket.assigneeId ?? "",
        title: ticket.title,
        body: ticket.body,
        status: ticket.status
      });
      isTicketModalOpen.value = true;
    };
    const saveQueue = async () => {
      isSavingQueue.value = true;
      try {
        const payload = { name: queueForm.name, description: queueForm.description || null };
        if (queueForm.id) {
          await $fetch(`/api/v1/helpdesk/queues/${queueForm.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/helpdesk/queues", { method: "POST", body: payload });
        }
        isQueueModalOpen.value = false;
        resetQueueForm();
        await Promise.all([refreshQueues(), refreshReports()]);
      } finally {
        isSavingQueue.value = false;
      }
    };
    const saveCategory = async () => {
      isSavingCategory.value = true;
      try {
        const payload = {
          queueId: categoryForm.queueId,
          name: categoryForm.name,
          description: categoryForm.description || null
        };
        if (categoryForm.id) {
          await $fetch(`/api/v1/helpdesk/categories/${categoryForm.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/helpdesk/categories", { method: "POST", body: payload });
        }
        isCategoryModalOpen.value = false;
        resetCategoryForm();
        await Promise.all([refreshCategories(), refreshQueues()]);
      } finally {
        isSavingCategory.value = false;
      }
    };
    const saveTicket = async () => {
      isSavingTicket.value = true;
      try {
        const payload = {
          customerId: ticketForm.customerId,
          queueId: ticketForm.queueId,
          categoryId: ticketForm.categoryId,
          assigneeId: ticketForm.assigneeId === "" ? null : Number(ticketForm.assigneeId),
          title: ticketForm.title,
          body: ticketForm.body,
          status: ticketForm.status
        };
        if (ticketForm.id) {
          await $fetch(`/api/v1/helpdesk/tickets/${ticketForm.id}`, { method: "PUT", body: payload });
        } else {
          await $fetch("/api/v1/helpdesk/tickets", { method: "POST", body: payload });
        }
        isTicketModalOpen.value = false;
        resetTicketForm();
        await Promise.all([refreshTickets(), refreshQueues(), refreshCategories(), refreshReports()]);
      } finally {
        isSavingTicket.value = false;
      }
    };
    const cycleTicketStatus = async (row) => {
      const next = row.status === "open" ? "pending" : row.status === "pending" ? "closed" : "open";
      await $fetch(`/api/v1/helpdesk/tickets/${row.id}/status`, {
        method: "POST",
        body: { status: next }
      });
      await Promise.all([refreshTickets(), refreshReports()]);
    };
    const removeQueue = async (row) => {
      if (!confirm(`Usunąć kolejkę "${row.name}"?`)) return;
      await $fetch(`/api/v1/helpdesk/queues/${row.id}`, { method: "DELETE" });
      await Promise.all([refreshQueues(), refreshCategories(), refreshTickets(), refreshReports()]);
    };
    const removeCategory = async (row) => {
      if (!confirm(`Usunąć kategorię "${row.name}"?`)) return;
      await $fetch(`/api/v1/helpdesk/categories/${row.id}`, { method: "DELETE" });
      await Promise.all([refreshCategories(), refreshTickets()]);
    };
    const removeTicket = async (row) => {
      if (!confirm(`Usunąć zgłoszenie "${row.title}"?`)) return;
      await $fetch(`/api/v1/helpdesk/tickets/${row.id}`, { method: "DELETE" });
      await Promise.all([refreshTickets(), refreshQueues(), refreshCategories(), refreshReports()]);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UButton = _sfc_main$8;
      const _component_UTable = _sfc_main$2;
      const _component_UInput = _sfc_main$4;
      const _component_UBadge = _sfc_main$3;
      const _component_UModal = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_UTextarea = _sfc_main$7;
      const _component_USelect = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Helpdesk</h1><p class="text-sm text-gray-500">Kolejki, kategorie i zgłoszenia klientów w aktywnym baseline TS/Nuxt</p></div></div><div class="grid lg:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Kolejki</h2><p class="text-sm text-gray-500"${_scopeId}>Kanały obsługi zgłoszeń</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              size: "sm",
              icon: "i-heroicons-plus",
              label: "Dodaj",
              onClick: ($event) => isQueueModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Kolejki"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Kanały obsługi zgłoszeń")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  size: "sm",
                  icon: "i-heroicons-plus",
                  label: "Dodaj",
                  onClick: ($event) => isQueueModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(queues) || [],
              columns: queueColumns,
              loading: unref(pendingQueues)
            }, {
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-pencil-square",
                    onClick: ($event) => openQueueEdit(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeQueue(row)
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
                        onClick: ($event) => openQueueEdit(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeQueue(row)
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
                data: unref(queues) || [],
                columns: queueColumns,
                loading: unref(pendingQueues)
              }, {
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-pencil-square",
                      onClick: ($event) => openQueueEdit(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeQueue(row)
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
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Kategorie</h2><p class="text-sm text-gray-500"${_scopeId}>Klasyfikacja zgłoszeń</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              size: "sm",
              icon: "i-heroicons-plus",
              label: "Dodaj",
              onClick: ($event) => isCategoryModalOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Kategorie"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Klasyfikacja zgłoszeń")
                ]),
                createVNode(_component_UButton, {
                  color: "primary",
                  size: "sm",
                  icon: "i-heroicons-plus",
                  label: "Dodaj",
                  onClick: ($event) => isCategoryModalOpen.value = true
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(categories) || [],
              columns: categoryColumns,
              loading: unref(pendingCategories)
            }, {
              "queue-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.queue?.name || "Brak kolejki")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.queue?.name || "Brak kolejki"), 1)
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
                    onClick: ($event) => openCategoryEdit(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeCategory(row)
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
                        onClick: ($event) => openCategoryEdit(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeCategory(row)
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
                data: unref(categories) || [],
                columns: categoryColumns,
                loading: unref(pendingCategories)
              }, {
                "queue-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.queue?.name || "Brak kolejki"), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-pencil-square",
                      onClick: ($event) => openCategoryEdit(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeCategory(row)
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
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Zgłoszenia</h2><p class="text-sm text-gray-500"${_scopeId}>Podstawowy workflow: create, search, status, assign</p></div><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(ticketSearch),
              "onUpdate:modelValue": ($event) => isRef(ticketSearch) ? ticketSearch.value = $event : null,
              icon: "i-heroicons-magnifying-glass-20-solid",
              placeholder: "Szukaj po tytule lub treści...",
              class: "w-72"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-heroicons-plus",
              label: "Nowe zgłoszenie",
              onClick: openTicketCreate
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Zgłoszenia"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Podstawowy workflow: create, search, status, assign")
                ]),
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(ticketSearch),
                    "onUpdate:modelValue": ($event) => isRef(ticketSearch) ? ticketSearch.value = $event : null,
                    icon: "i-heroicons-magnifying-glass-20-solid",
                    placeholder: "Szukaj po tytule lub treści...",
                    class: "w-72"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UButton, {
                    color: "primary",
                    icon: "i-heroicons-plus",
                    label: "Nowe zgłoszenie",
                    onClick: openTicketCreate
                  })
                ])
              ])
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid md:grid-cols-3 gap-4 text-sm"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="text-gray-500"${_scopeId}>Wszystkie tickety</div><div class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(reports)?.totalTickets || 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="text-gray-500"${_scopeId}>Open</div><div class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(reports)?.byStatus?.open || 0)}</div></div><div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"${_scopeId}><div class="text-gray-500"${_scopeId}>Pending</div><div class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(reports)?.byStatus?.pending || 0)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid md:grid-cols-3 gap-4 text-sm" }, [
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "text-gray-500" }, "Wszystkie tickety"),
                  createVNode("div", { class: "text-2xl font-bold" }, toDisplayString(unref(reports)?.totalTickets || 0), 1)
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "text-gray-500" }, "Open"),
                  createVNode("div", { class: "text-2xl font-bold" }, toDisplayString(unref(reports)?.byStatus?.open || 0), 1)
                ]),
                createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4" }, [
                  createVNode("div", { class: "text-gray-500" }, "Pending"),
                  createVNode("div", { class: "text-2xl font-bold" }, toDisplayString(unref(reports)?.byStatus?.pending || 0), 1)
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(filteredTickets),
              columns: ticketColumns,
              loading: unref(pendingTickets)
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
              "queue-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.queue?.name || "Brak kolejki")}`);
                  if (row.category) {
                    _push3(`<span${_scopeId2}> · ${ssrInterpolate(row.category.name)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(toDisplayString(row.queue?.name || "Brak kolejki"), 1),
                      row.category ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(row.category.name), 1)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: ticketStatusColor(row.status),
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
                      color: ticketStatusColor(row.status),
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
              "assigneeId-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(row.assigneeId ? `#${row.assigneeId}` : "Nieprzypisane")}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.assigneeId ? `#${row.assigneeId}` : "Nieprzypisane"), 1)
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
                    onClick: ($event) => openTicketEdit(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "yellow",
                    variant: "ghost",
                    icon: "i-heroicons-arrow-path",
                    onClick: ($event) => cycleTicketStatus(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "ghost",
                    icon: "i-heroicons-trash",
                    onClick: ($event) => removeTicket(row)
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
                        onClick: ($event) => openTicketEdit(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "yellow",
                        variant: "ghost",
                        icon: "i-heroicons-arrow-path",
                        onClick: ($event) => cycleTicketStatus(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "ghost",
                        icon: "i-heroicons-trash",
                        onClick: ($event) => removeTicket(row)
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
                data: unref(filteredTickets),
                columns: ticketColumns,
                loading: unref(pendingTickets)
              }, {
                "customer-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : "Brak klienta"), 1)
                ]),
                "queue-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                    createTextVNode(toDisplayString(row.queue?.name || "Brak kolejki"), 1),
                    row.category ? (openBlock(), createBlock("span", { key: 0 }, " · " + toDisplayString(row.category.name), 1)) : createCommentVNode("", true)
                  ])
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: ticketStatusColor(row.status),
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.status), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "assigneeId-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(row.assigneeId ? `#${row.assigneeId}` : "Nieprzypisane"), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-pencil-square",
                      onClick: ($event) => openTicketEdit(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "yellow",
                      variant: "ghost",
                      icon: "i-heroicons-arrow-path",
                      onClick: ($event) => cycleTicketStatus(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "ghost",
                      icon: "i-heroicons-trash",
                      onClick: ($event) => removeTicket(row)
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
        modelValue: unref(isQueueModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isQueueModalOpen) ? isQueueModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(queueForm).id ? "Edytuj kolejkę" : "Dodaj kolejkę")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(queueForm).id ? "Edytuj kolejkę" : "Dodaj kolejkę"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Nazwa",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(queueForm).name,
                          "onUpdate:modelValue": ($event) => unref(queueForm).name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(queueForm).name,
                            "onUpdate:modelValue": ($event) => unref(queueForm).name = $event
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
                          modelValue: unref(queueForm).description,
                          "onUpdate:modelValue": ($event) => unref(queueForm).description = $event,
                          data: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(queueForm).description,
                            "onUpdate:modelValue": ($event) => unref(queueForm).description = $event,
                            data: 3
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
                    onClick: ($event) => isQueueModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingQueue),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveQueue, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, {
                        label: "Nazwa",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(queueForm).name,
                            "onUpdate:modelValue": ($event) => unref(queueForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Opis" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(queueForm).description,
                            "onUpdate:modelValue": ($event) => unref(queueForm).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isQueueModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingQueue),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(queueForm).id ? "Edytuj kolejkę" : "Dodaj kolejkę"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveQueue, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, {
                      label: "Nazwa",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(queueForm).name,
                          "onUpdate:modelValue": ($event) => unref(queueForm).name = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, { label: "Opis" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(queueForm).description,
                          "onUpdate:modelValue": ($event) => unref(queueForm).description = $event,
                          data: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isQueueModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingQueue),
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
        modelValue: unref(isCategoryModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isCategoryModalOpen) ? isCategoryModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(categoryForm).id ? "Edytuj kategorię" : "Dodaj kategorię")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(categoryForm).id ? "Edytuj kategorię" : "Dodaj kategorię"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Kolejka",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(categoryForm).queueId,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).queueId = $event,
                          items: unref(queueOptions),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(categoryForm).queueId,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).queueId = $event,
                            items: unref(queueOptions),
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
                          modelValue: unref(categoryForm).name,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(categoryForm).name,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).name = $event
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
                          modelValue: unref(categoryForm).description,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).description = $event,
                          data: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(categoryForm).description,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).description = $event,
                            data: 3
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
                    onClick: ($event) => isCategoryModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingCategory),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveCategory, ["prevent"])
                    }, [
                      createVNode(_component_UFormField, {
                        label: "Kolejka",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(categoryForm).queueId,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).queueId = $event,
                            items: unref(queueOptions),
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
                            modelValue: unref(categoryForm).name,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Opis" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(categoryForm).description,
                            "onUpdate:modelValue": ($event) => unref(categoryForm).description = $event,
                            data: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isCategoryModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingCategory),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(categoryForm).id ? "Edytuj kategorię" : "Dodaj kategorię"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveCategory, ["prevent"])
                  }, [
                    createVNode(_component_UFormField, {
                      label: "Kolejka",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(categoryForm).queueId,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).queueId = $event,
                          items: unref(queueOptions),
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
                          modelValue: unref(categoryForm).name,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).name = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, { label: "Opis" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(categoryForm).description,
                          "onUpdate:modelValue": ($event) => unref(categoryForm).description = $event,
                          data: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isCategoryModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingCategory),
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
        modelValue: unref(isTicketModalOpen),
        "onUpdate:modelValue": ($event) => isRef(isTicketModalOpen) ? isTicketModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-bold"${_scopeId2}>${ssrInterpolate(unref(ticketForm).id ? "Edytuj zgłoszenie" : "Dodaj zgłoszenie")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(ticketForm).id ? "Edytuj zgłoszenie" : "Dodaj zgłoszenie"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4 p-4"${_scopeId2}><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Klient" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ticketForm).customerId,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).customerId = $event,
                          items: unref(customerOptionsWithEmpty),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Assignee ID" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(ticketForm).assigneeId,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).assigneeId = $event,
                          type: "number",
                          placeholder: "np. 101"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(ticketForm).assigneeId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).assigneeId = $event,
                            type: "number",
                            placeholder: "np. 101"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Kolejka" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ticketForm).queueId,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).queueId = $event,
                          items: unref(queueOptionsWithEmpty),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).queueId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).queueId = $event,
                            items: unref(queueOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Kategoria" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ticketForm).categoryId,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).categoryId = $event,
                          items: unref(categoryOptionsWithEmpty),
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).categoryId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).categoryId = $event,
                            items: unref(categoryOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Status" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ticketForm).status,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).status = $event,
                          items: ticketStatusOptions,
                          "label-key": "label"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).status,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).status = $event,
                            items: ticketStatusOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Tytuł",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(ticketForm).title,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).title = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(ticketForm).title,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).title = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Treść",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(ticketForm).body,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).body = $event,
                          data: 5
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(ticketForm).body,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).body = $event,
                            data: 5
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
                    onClick: ($event) => isTicketModalOpen.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(isSavingTicket),
                    label: "Zapisz"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-4 p-4",
                      onSubmit: withModifiers(saveTicket, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Klient" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(ticketForm).customerId,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).customerId = $event,
                              items: unref(customerOptionsWithEmpty),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Assignee ID" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(ticketForm).assigneeId,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).assigneeId = $event,
                              type: "number",
                              placeholder: "np. 101"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Kolejka" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(ticketForm).queueId,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).queueId = $event,
                              items: unref(queueOptionsWithEmpty),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Kategoria" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(ticketForm).categoryId,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).categoryId = $event,
                              items: unref(categoryOptionsWithEmpty),
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, { label: "Status" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(ticketForm).status,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).status = $event,
                              items: ticketStatusOptions,
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Tytuł",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(ticketForm).title,
                              "onUpdate:modelValue": ($event) => unref(ticketForm).title = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Treść",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(ticketForm).body,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).body = $event,
                            data: 5
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Anuluj",
                          onClick: ($event) => isTicketModalOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isSavingTicket),
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
                  createVNode("h3", { class: "text-lg font-bold" }, toDisplayString(unref(ticketForm).id ? "Edytuj zgłoszenie" : "Dodaj zgłoszenie"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-4 p-4",
                    onSubmit: withModifiers(saveTicket, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Klient" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).customerId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).customerId = $event,
                            items: unref(customerOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Assignee ID" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(ticketForm).assigneeId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).assigneeId = $event,
                            type: "number",
                            placeholder: "np. 101"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Kolejka" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).queueId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).queueId = $event,
                            items: unref(queueOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Kategoria" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).categoryId,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).categoryId = $event,
                            items: unref(categoryOptionsWithEmpty),
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, { label: "Status" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ticketForm).status,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).status = $event,
                            items: ticketStatusOptions,
                            "label-key": "label"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Tytuł",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(ticketForm).title,
                            "onUpdate:modelValue": ($event) => unref(ticketForm).title = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, {
                      label: "Treść",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(ticketForm).body,
                          "onUpdate:modelValue": ($event) => unref(ticketForm).body = $event,
                          data: 5
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        label: "Anuluj",
                        onClick: ($event) => isTicketModalOpen.value = false
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(isSavingTicket),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/helpdesk.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=helpdesk-DReCdi6H.mjs.map
