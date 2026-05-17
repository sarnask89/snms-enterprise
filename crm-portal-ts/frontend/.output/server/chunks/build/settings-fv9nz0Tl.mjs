import { d as useRoute, y as usePortalAuth, b as _sfc_main$8, g as useRuntimeConfig, s as useLocale, h as useAppConfig, w as useForwardProps, x as __nuxt_component_0$3, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './Alert-CJa1dftu.mjs';
import { _ as _sfc_main$3 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$4 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$5 } from './Checkbox-mfegmXJ0.mjs';
import { _ as _sfc_main$6 } from './Badge-BJKdv1tG.mjs';
import { _ as _sfc_main$7 } from './SelectMenu-BhfO7re0.mjs';
import { _ as _sfc_main$9 } from './Separator-CoXp0Z15.mjs';
import { reactive, ref, computed, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useColorMode } from './composables-B1mdlttm.mjs';
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
import './isValueEqualOrExist-DDZNo4Zk.mjs';
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-Bd-v-gOF.mjs';
import './RovingFocusGroup-C9aTixOz.mjs';
import './Label-BCnUNGB-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import './useFilter-BytkjEhg.mjs';
import './virtualizer-Dnga9fey.mjs';
import '@tanstack/vue-virtual';
import '@vue/shared';

const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UColorModeSelect",
  __ssrInlineRender: true,
  props: {
    id: { type: String, required: false },
    placeholder: { type: String, required: false },
    searchInput: { type: [Boolean, Object], required: false, default: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    selectedIcon: { type: null, required: false },
    clear: { type: [Boolean, Object], required: false },
    clearIcon: { type: null, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true },
    virtualize: { type: [Boolean, Object], required: false },
    valueKey: { type: null, required: false },
    labelKey: { type: null, required: false },
    descriptionKey: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelModifiers: { type: null, required: false },
    multiple: { type: Boolean, required: false },
    highlight: { type: Boolean, required: false },
    createItem: { type: [Boolean, String, Object], required: false },
    filterFields: { type: Array, required: false },
    ignoreFilter: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    resetSearchTermOnBlur: { type: Boolean, required: false },
    resetSearchTermOnSelect: { type: Boolean, required: false },
    resetModelValueOnClear: { type: Boolean, required: false },
    highlightOnHover: { type: Boolean, required: false },
    by: { type: [String, Function], required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const { t } = useLocale();
    const colorMode = useColorMode();
    const appConfig = useAppConfig();
    const selectMenuProps = useForwardProps(props);
    const items = computed(() => [
      { label: t("colorMode.system"), value: "system", icon: appConfig.ui.icons.system },
      { label: t("colorMode.light"), value: "light", icon: appConfig.ui.icons.light },
      { label: t("colorMode.dark"), value: "dark", icon: appConfig.ui.icons.dark }
    ]);
    computed({
      get() {
        return items.value.find((option) => option.value === colorMode.preference) || items.value[0];
      },
      set(option) {
        colorMode.preference = option.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      if (!unref(colorMode)?.forced) {
        _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$7, mergeProps({
                icon: items.value[0]?.icon,
                "model-value": items.value[0]
              }, { ...unref(selectMenuProps), ..._ctx.$attrs }, {
                items: items.value,
                disabled: ""
              }), null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_sfc_main$7, mergeProps({
                  icon: items.value[0]?.icon,
                  "model-value": items.value[0]
                }, { ...unref(selectMenuProps), ..._ctx.$attrs }, {
                  items: items.value,
                  disabled: ""
                }), null, 16, ["icon", "model-value", "items"])
              ];
            }
          })
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/color-mode/ColorModeSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const route = useRoute();
    const { session: authSession, loadSession, login: loginWithSession, logout: logoutSession, changePassword: changeSessionPassword } = usePortalAuth();
    const defaultDivisionForm = () => ({
      name: "",
      shortName: "",
      address: "",
      city: "",
      postalCode: "",
      nip: "",
      regon: "",
      active: true,
      isDefault: false
    });
    const defaultVatForm = () => ({
      label: "",
      ratePercent: "",
      sortOrder: 0,
      isDefault: false
    });
    const defaultNumberPlanForm = () => ({
      name: "",
      docType: "invoice",
      patternTemplate: "FV/{year}/{n}",
      nextNumber: 1,
      divisionId: null,
      active: true,
      isDefault: false
    });
    const docTypeOptions = [
      { label: "Invoice", value: "invoice" },
      { label: "Proforma", value: "proforma" },
      { label: "Debit note", value: "debit_note" },
      { label: "Customer", value: "customer" }
    ];
    const divisionForm = reactive(defaultDivisionForm());
    const vatForm = reactive(defaultVatForm());
    const numberPlanForm = reactive(defaultNumberPlanForm());
    const loginForm = reactive({ username: "", password: "" });
    const passwordForm = reactive({ currentPassword: "", newPassword: "", newPassword2: "" });
    const editingDivisionId = ref(null);
    const editingVatId = ref(null);
    const editingNumberPlanId = ref(null);
    const isSavingDivision = ref(false);
    const isSavingVat = ref(false);
    const isSavingNumberPlan = ref(false);
    const isLoggingIn = ref(false);
    const isLoggingOut = ref(false);
    const isChangingPassword = ref(false);
    const authMessage = ref("");
    const isAdmin = computed(() => authSession.value.user?.role === "admin");
    const { data: divisions, refresh: refreshDivisions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/config/divisions",
      {
        default: () => [],
        immediate: false,
        server: false
      },
      "$PVlhQzjeUy"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: vatRates, refresh: refreshVatRates } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/config/vat-rates",
      {
        default: () => [],
        immediate: false,
        server: false
      },
      "$RPIZbYXJzM"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: numberPlans, refresh: refreshNumberPlans } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/config/number-plans",
      {
        default: () => [],
        immediate: false,
        server: false
      },
      "$rNBvyAZ2fo"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const divisionOptions = computed(() => [
      { label: "Wszystkie oddziały", value: null },
      ...(divisions.value || []).map((division) => ({
        label: division.name,
        value: division.id
      }))
    ]);
    const refreshAll = async () => {
      await loadAuthSession();
      if (!isAdmin.value) {
        return;
      }
      await Promise.all([
        refreshDivisions(),
        refreshVatRates(),
        refreshNumberPlans()
      ]);
    };
    const resetDivisionForm = () => {
      editingDivisionId.value = null;
      Object.assign(divisionForm, defaultDivisionForm());
    };
    const resetVatForm = () => {
      editingVatId.value = null;
      Object.assign(vatForm, defaultVatForm());
    };
    const resetNumberPlanForm = () => {
      editingNumberPlanId.value = null;
      Object.assign(numberPlanForm, defaultNumberPlanForm());
    };
    const editDivision = (division) => {
      editingDivisionId.value = division.id;
      Object.assign(divisionForm, {
        name: division.name || "",
        shortName: division.shortName || "",
        address: division.address || "",
        city: division.city || "",
        postalCode: division.postalCode || "",
        nip: division.nip || "",
        regon: division.regon || "",
        active: !!division.active,
        isDefault: !!division.isDefault
      });
    };
    const editVatRate = (vatRate) => {
      editingVatId.value = vatRate.id;
      Object.assign(vatForm, {
        label: vatRate.label || "",
        ratePercent: vatRate.ratePercent ?? "",
        sortOrder: vatRate.sortOrder ?? 0,
        isDefault: !!vatRate.isDefault
      });
    };
    const editNumberPlan = (numberPlan) => {
      editingNumberPlanId.value = numberPlan.id;
      Object.assign(numberPlanForm, {
        name: numberPlan.name || "",
        docType: numberPlan.docType || "invoice",
        patternTemplate: numberPlan.patternTemplate || "",
        nextNumber: numberPlan.nextNumber ?? 1,
        divisionId: numberPlan.divisionId ?? null,
        active: !!numberPlan.active,
        isDefault: !!numberPlan.isDefault
      });
    };
    const saveDivision = async () => {
      isSavingDivision.value = true;
      try {
        await $fetch(editingDivisionId.value ? `/api/v1/config/divisions/${editingDivisionId.value}` : "/api/v1/config/divisions", {
          method: editingDivisionId.value ? "PUT" : "POST",
          body: { ...divisionForm }
        });
        resetDivisionForm();
        await refreshDivisions();
      } finally {
        isSavingDivision.value = false;
      }
    };
    const deleteDivision = async (id) => {
      await $fetch(`/api/v1/config/divisions/${id}`, { method: "DELETE" });
      if (editingDivisionId.value === id) {
        resetDivisionForm();
      }
      await refreshDivisions();
    };
    const saveVatRate = async () => {
      isSavingVat.value = true;
      try {
        await $fetch(editingVatId.value ? `/api/v1/config/vat-rates/${editingVatId.value}` : "/api/v1/config/vat-rates", {
          method: editingVatId.value ? "PUT" : "POST",
          body: { ...vatForm }
        });
        resetVatForm();
        await refreshVatRates();
      } finally {
        isSavingVat.value = false;
      }
    };
    const deleteVatRate = async (id) => {
      await $fetch(`/api/v1/config/vat-rates/${id}`, { method: "DELETE" });
      if (editingVatId.value === id) {
        resetVatForm();
      }
      await refreshVatRates();
    };
    const saveNumberPlan = async () => {
      isSavingNumberPlan.value = true;
      try {
        await $fetch(editingNumberPlanId.value ? `/api/v1/config/number-plans/${editingNumberPlanId.value}` : "/api/v1/config/number-plans", {
          method: editingNumberPlanId.value ? "PUT" : "POST",
          body: { ...numberPlanForm }
        });
        resetNumberPlanForm();
        await refreshNumberPlans();
      } finally {
        isSavingNumberPlan.value = false;
      }
    };
    const deleteNumberPlan = async (id) => {
      await $fetch(`/api/v1/config/number-plans/${id}`, { method: "DELETE" });
      if (editingNumberPlanId.value === id) {
        resetNumberPlanForm();
      }
      await refreshNumberPlans();
    };
    const loadAuthSession = async () => {
      await loadSession({ force: true, silent: true });
      if (isAdmin.value) {
        await Promise.all([
          refreshDivisions(),
          refreshVatRates(),
          refreshNumberPlans()
        ]);
      }
    };
    const login = async () => {
      isLoggingIn.value = true;
      authMessage.value = "";
      try {
        await loginWithSession({ ...loginForm });
        Object.assign(loginForm, { username: "", password: "" });
        authMessage.value = "Sesja została utworzona.";
        await loadAuthSession();
        const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "";
        if (redirect && redirect !== "/settings") {
          await navigateTo(redirect);
        }
      } catch (_error) {
        authMessage.value = "Logowanie nie powiodło się.";
      } finally {
        isLoggingIn.value = false;
      }
    };
    const logout = async () => {
      isLoggingOut.value = true;
      authMessage.value = "";
      try {
        await logoutSession();
        authMessage.value = "Sesja została zamknięta.";
      } finally {
        isLoggingOut.value = false;
      }
    };
    const changePassword = async () => {
      isChangingPassword.value = true;
      authMessage.value = "";
      try {
        await changeSessionPassword({ ...passwordForm });
        Object.assign(passwordForm, { currentPassword: "", newPassword: "", newPassword2: "" });
        authMessage.value = "Hasło zostało zmienione.";
      } catch (_error) {
        authMessage.value = "Zmiana hasła nie powiodła się.";
      } finally {
        isChangingPassword.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UAlert = _sfc_main$2;
      const _component_UCard = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UCheckbox = _sfc_main$5;
      const _component_UBadge = _sfc_main$6;
      const _component_USelectMenu = _sfc_main$7;
      const _component_USeparator = _sfc_main$9;
      const _component_UColorModeSelect = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-7xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ustawienia Systemu</h1><p class="text-sm text-gray-500">Oddziały, stawki VAT i plany numeracji dla runtime TS.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-path",
        label: "Odśwież",
        onClick: refreshAll
      }, null, _parent));
      _push(`</div>`);
      if (unref(route).query.reason === "auth") {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "amber",
          variant: "soft",
          icon: "i-heroicons-lock-closed",
          title: "Ta sekcja wymaga zalogowanej sesji."
        }, null, _parent));
      } else if (unref(route).query.reason === "forbidden") {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "red",
          variant: "soft",
          icon: "i-heroicons-shield-exclamation",
          title: "Bieżąca rola nie ma dostępu do wskazanego modułu."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isAdmin)) {
        _push(`<div class="grid xl:grid-cols-2 gap-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Oddziały</h2><p class="text-sm text-gray-500"${_scopeId}>Konfiguracja firm wykorzystywanych przez dokumenty i finanse.</p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Oddziały"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Konfiguracja firm wykorzystywanych przez dokumenty i finanse.")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).name,
                "onUpdate:modelValue": ($event) => unref(divisionForm).name = $event,
                placeholder: "Nazwa oddziału"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).shortName,
                "onUpdate:modelValue": ($event) => unref(divisionForm).shortName = $event,
                placeholder: "Skrót"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).city,
                "onUpdate:modelValue": ($event) => unref(divisionForm).city = $event,
                placeholder: "Miasto"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).postalCode,
                "onUpdate:modelValue": ($event) => unref(divisionForm).postalCode = $event,
                placeholder: "Kod pocztowy"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).nip,
                "onUpdate:modelValue": ($event) => unref(divisionForm).nip = $event,
                placeholder: "NIP"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).regon,
                "onUpdate:modelValue": ($event) => unref(divisionForm).regon = $event,
                placeholder: "REGON"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(divisionForm).address,
                "onUpdate:modelValue": ($event) => unref(divisionForm).address = $event,
                placeholder: "Adres"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex flex-wrap items-center gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                modelValue: unref(divisionForm).active,
                "onUpdate:modelValue": ($event) => unref(divisionForm).active = $event,
                label: "Aktywny"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UCheckbox, {
                modelValue: unref(divisionForm).isDefault,
                "onUpdate:modelValue": ($event) => unref(divisionForm).isDefault = $event,
                label: "Domyślny"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex justify-end gap-3"${_scopeId}>`);
              if (unref(editingDivisionId)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "soft",
                  label: "Anuluj",
                  onClick: resetDivisionForm
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                loading: unref(isSavingDivision),
                label: unref(editingDivisionId) ? "Zapisz oddział" : "Dodaj oddział",
                onClick: saveDivision
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(divisions) || [], (division) => {
                _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(division.name)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(division.shortName || "brak skrótu")} · ${ssrInterpolate(division.city || "brak miasta")}</div><div class="text-xs text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(division.address || "brak adresu")}</div></div><div class="flex gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: division.active ? "green" : "gray",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(division.active ? "active" : "inactive")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(division.active ? "active" : "inactive"), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (division.isDefault) {
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`default`);
                      } else {
                        return [
                          createTextVNode("default")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div><div class="flex justify-end gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "ghost",
                  label: "Edytuj",
                  onClick: ($event) => editDivision(division)
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "red",
                  variant: "ghost",
                  label: "Usuń",
                  onClick: ($event) => deleteDivision(division.id)
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).name,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).name = $event,
                      placeholder: "Nazwa oddziału"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).shortName,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).shortName = $event,
                      placeholder: "Skrót"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).city,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).city = $event,
                      placeholder: "Miasto"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).postalCode,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).postalCode = $event,
                      placeholder: "Kod pocztowy"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).nip,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).nip = $event,
                      placeholder: "NIP"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(divisionForm).regon,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).regon = $event,
                      placeholder: "REGON"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode(_component_UInput, {
                    modelValue: unref(divisionForm).address,
                    "onUpdate:modelValue": ($event) => unref(divisionForm).address = $event,
                    placeholder: "Adres"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("div", { class: "flex flex-wrap items-center gap-4" }, [
                    createVNode(_component_UCheckbox, {
                      modelValue: unref(divisionForm).active,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).active = $event,
                      label: "Aktywny"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UCheckbox, {
                      modelValue: unref(divisionForm).isDefault,
                      "onUpdate:modelValue": ($event) => unref(divisionForm).isDefault = $event,
                      label: "Domyślny"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex justify-end gap-3" }, [
                    unref(editingDivisionId) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      color: "gray",
                      variant: "soft",
                      label: "Anuluj",
                      onClick: resetDivisionForm
                    })) : createCommentVNode("", true),
                    createVNode(_component_UButton, {
                      color: "primary",
                      loading: unref(isSavingDivision),
                      label: unref(editingDivisionId) ? "Zapisz oddział" : "Dodaj oddział",
                      onClick: saveDivision
                    }, null, 8, ["loading", "label"])
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(divisions) || [], (division) => {
                      return openBlock(), createBlock("div", {
                        key: division.id,
                        class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"
                      }, [
                        createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                          createVNode("div", null, [
                            createVNode("div", { class: "font-medium" }, toDisplayString(division.name), 1),
                            createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(division.shortName || "brak skrótu") + " · " + toDisplayString(division.city || "brak miasta"), 1),
                            createVNode("div", { class: "text-xs text-gray-400 mt-1" }, toDisplayString(division.address || "brak adresu"), 1)
                          ]),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(_component_UBadge, {
                              color: division.active ? "green" : "gray",
                              variant: "soft"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(division.active ? "active" : "inactive"), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"]),
                            division.isDefault ? (openBlock(), createBlock(_component_UBadge, {
                              key: 0,
                              color: "primary",
                              variant: "soft"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("default")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-3" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            label: "Edytuj",
                            onClick: ($event) => editDivision(division)
                          }, null, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            color: "red",
                            variant: "ghost",
                            label: "Usuń",
                            onClick: ($event) => deleteDivision(division.id)
                          }, null, 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Stawki VAT</h2><p class="text-sm text-gray-500"${_scopeId}>Baza stawek dla taryf, subskrypcji i faktur.</p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-lg" }, "Stawki VAT"),
                  createVNode("p", { class: "text-sm text-gray-500" }, "Baza stawek dla taryf, subskrypcji i faktur.")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="grid md:grid-cols-3 gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(vatForm).label,
                "onUpdate:modelValue": ($event) => unref(vatForm).label = $event,
                placeholder: "Etykieta"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(vatForm).ratePercent,
                "onUpdate:modelValue": ($event) => unref(vatForm).ratePercent = $event,
                type: "number",
                placeholder: "%"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(vatForm).sortOrder,
                "onUpdate:modelValue": ($event) => unref(vatForm).sortOrder = $event,
                type: "number",
                placeholder: "Sort"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex flex-wrap items-center gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                modelValue: unref(vatForm).isDefault,
                "onUpdate:modelValue": ($event) => unref(vatForm).isDefault = $event,
                label: "Domyślna"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex justify-end gap-3"${_scopeId}>`);
              if (unref(editingVatId)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "soft",
                  label: "Anuluj",
                  onClick: resetVatForm
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                loading: unref(isSavingVat),
                label: unref(editingVatId) ? "Zapisz stawkę" : "Dodaj stawkę",
                onClick: saveVatRate
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(vatRates) || [], (vatRate) => {
                _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(vatRate.label)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(vatRate.ratePercent)}% · sort ${ssrInterpolate(vatRate.sortOrder)}</div></div><div class="flex items-center gap-2"${_scopeId}>`);
                if (vatRate.isDefault) {
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "soft"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`default`);
                      } else {
                        return [
                          createTextVNode("default")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "ghost",
                  label: "Edytuj",
                  onClick: ($event) => editVatRate(vatRate)
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "red",
                  variant: "ghost",
                  label: "Usuń",
                  onClick: ($event) => deleteVatRate(vatRate.id)
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "grid md:grid-cols-3 gap-3" }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(vatForm).label,
                      "onUpdate:modelValue": ($event) => unref(vatForm).label = $event,
                      placeholder: "Etykieta"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(vatForm).ratePercent,
                      "onUpdate:modelValue": ($event) => unref(vatForm).ratePercent = $event,
                      type: "number",
                      placeholder: "%"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(vatForm).sortOrder,
                      "onUpdate:modelValue": ($event) => unref(vatForm).sortOrder = $event,
                      type: "number",
                      placeholder: "Sort"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex flex-wrap items-center gap-4" }, [
                    createVNode(_component_UCheckbox, {
                      modelValue: unref(vatForm).isDefault,
                      "onUpdate:modelValue": ($event) => unref(vatForm).isDefault = $event,
                      label: "Domyślna"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex justify-end gap-3" }, [
                    unref(editingVatId) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      color: "gray",
                      variant: "soft",
                      label: "Anuluj",
                      onClick: resetVatForm
                    })) : createCommentVNode("", true),
                    createVNode(_component_UButton, {
                      color: "primary",
                      loading: unref(isSavingVat),
                      label: unref(editingVatId) ? "Zapisz stawkę" : "Dodaj stawkę",
                      onClick: saveVatRate
                    }, null, 8, ["loading", "label"])
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(vatRates) || [], (vatRate) => {
                      return openBlock(), createBlock("div", {
                        key: vatRate.id,
                        class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between gap-4"
                      }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-medium" }, toDisplayString(vatRate.label), 1),
                          createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(vatRate.ratePercent) + "% · sort " + toDisplayString(vatRate.sortOrder), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          vatRate.isDefault ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            color: "primary",
                            variant: "soft"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("default")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            label: "Edytuj",
                            onClick: ($event) => editVatRate(vatRate)
                          }, null, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            color: "red",
                            variant: "ghost",
                            label: "Usuń",
                            onClick: ($event) => deleteVatRate(vatRate.id)
                          }, null, 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid xl:grid-cols-[2fr_1fr] gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Plany numeracji</h2><p class="text-sm text-gray-500"${_scopeId}>Domyślne wzorce numerów per typ dokumentu.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Plany numeracji"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Domyślne wzorce numerów per typ dokumentu.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(numberPlanForm).name,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).name = $event,
              placeholder: "Nazwa planu"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(numberPlanForm).docType,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).docType = $event,
              items: docTypeOptions,
              "value-key": "value",
              "label-key": "label"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(numberPlanForm).patternTemplate,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).patternTemplate = $event,
              placeholder: "Szablon, np. FV/{year}/{n}"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(numberPlanForm).nextNumber,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).nextNumber = $event,
              type: "number",
              placeholder: "Następny numer"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(numberPlanForm).divisionId,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).divisionId = $event,
              items: unref(divisionOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Oddział opcjonalny"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex flex-wrap items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(numberPlanForm).active,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).active = $event,
              label: "Aktywny"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(numberPlanForm).isDefault,
              "onUpdate:modelValue": ($event) => unref(numberPlanForm).isDefault = $event,
              label: "Domyślny dla typu"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end gap-3"${_scopeId}>`);
            if (unref(editingNumberPlanId)) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "soft",
                label: "Anuluj",
                onClick: resetNumberPlanForm
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(isSavingNumberPlan),
              label: unref(editingNumberPlanId) ? "Zapisz plan" : "Dodaj plan",
              onClick: saveNumberPlan
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(numberPlans) || [], (numberPlan) => {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(numberPlan.name)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(numberPlan.docType)} · ${ssrInterpolate(numberPlan.patternTemplate)} · next ${ssrInterpolate(numberPlan.nextNumber)}</div><div class="text-xs text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(numberPlan.division?.name || "wszystkie oddziały")}</div></div><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: numberPlan.active ? "green" : "gray",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(numberPlan.active ? "active" : "inactive")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(numberPlan.active ? "active" : "inactive"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (numberPlan.isDefault) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "primary",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`default`);
                    } else {
                      return [
                        createTextVNode("default")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="flex justify-end gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "ghost",
                label: "Edytuj",
                onClick: ($event) => editNumberPlan(numberPlan)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "red",
                variant: "ghost",
                label: "Usuń",
                onClick: ($event) => deleteNumberPlan(numberPlan.id)
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(numberPlanForm).name,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).name = $event,
                    placeholder: "Nazwa planu"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(numberPlanForm).docType,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).docType = $event,
                    items: docTypeOptions,
                    "value-key": "value",
                    "label-key": "label"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(numberPlanForm).patternTemplate,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).patternTemplate = $event,
                    placeholder: "Szablon, np. FV/{year}/{n}"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UInput, {
                    modelValue: unref(numberPlanForm).nextNumber,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).nextNumber = $event,
                    type: "number",
                    placeholder: "Następny numer"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(numberPlanForm).divisionId,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).divisionId = $event,
                    items: unref(divisionOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Oddział opcjonalny"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                ]),
                createVNode("div", { class: "flex flex-wrap items-center gap-4" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(numberPlanForm).active,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).active = $event,
                    label: "Aktywny"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(numberPlanForm).isDefault,
                    "onUpdate:modelValue": ($event) => unref(numberPlanForm).isDefault = $event,
                    label: "Domyślny dla typu"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  unref(editingNumberPlanId) ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    color: "gray",
                    variant: "soft",
                    label: "Anuluj",
                    onClick: resetNumberPlanForm
                  })) : createCommentVNode("", true),
                  createVNode(_component_UButton, {
                    color: "primary",
                    loading: unref(isSavingNumberPlan),
                    label: unref(editingNumberPlanId) ? "Zapisz plan" : "Dodaj plan",
                    onClick: saveNumberPlan
                  }, null, 8, ["loading", "label"])
                ]),
                createVNode("div", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(numberPlans) || [], (numberPlan) => {
                    return openBlock(), createBlock("div", {
                      key: numberPlan.id,
                      class: "rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-medium" }, toDisplayString(numberPlan.name), 1),
                          createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(numberPlan.docType) + " · " + toDisplayString(numberPlan.patternTemplate) + " · next " + toDisplayString(numberPlan.nextNumber), 1),
                          createVNode("div", { class: "text-xs text-gray-400 mt-1" }, toDisplayString(numberPlan.division?.name || "wszystkie oddziały"), 1)
                        ]),
                        createVNode("div", { class: "flex gap-2" }, [
                          createVNode(_component_UBadge, {
                            color: numberPlan.active ? "green" : "gray",
                            variant: "soft"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(numberPlan.active ? "active" : "inactive"), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"]),
                          numberPlan.isDefault ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            color: "primary",
                            variant: "soft"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("default")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "flex justify-end gap-3" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          label: "Edytuj",
                          onClick: ($event) => editNumberPlan(numberPlan)
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          color: "red",
                          variant: "ghost",
                          label: "Usuń",
                          onClick: ($event) => deleteNumberPlan(numberPlan.id)
                        }, null, 8, ["onClick"])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: unref(isAdmin) ? "" : "xl:col-span-2"
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-semibold text-lg"${_scopeId}>Runtime</h2><p class="text-sm text-gray-500"${_scopeId}>Lokalna konfiguracja klienta Nuxt.</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-semibold text-lg" }, "Runtime"),
                createVNode("p", { class: "text-sm text-gray-500" }, "Lokalna konfiguracja klienta Nuxt.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><section${_scopeId}><h3 class="text-sm font-medium mb-2"${_scopeId}>Integracja Ollama</h3><div class="space-y-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": unref(config).public.ollamaUrl,
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": unref(config).public.ollamaModel,
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(`</div></section>`);
            _push2(ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<section${_scopeId}><h3 class="text-sm font-medium mb-2"${_scopeId}>Preferencje interfejsu</h3><div class="flex items-center gap-4"${_scopeId}><span class="text-sm text-gray-500"${_scopeId}>Tryb kolorystyczny:</span>`);
            _push2(ssrRenderComponent(_component_UColorModeSelect, null, null, _parent2, _scopeId));
            _push2(`</div></section>`);
            _push2(ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            if (!unref(isAdmin)) {
              _push2(`<section class="space-y-2"${_scopeId}><h3 class="text-sm font-medium"${_scopeId}>Konfiguracja administracyjna</h3><p class="text-sm text-gray-500"${_scopeId}> Oddziały, VAT i plany numeracji są widoczne dopiero po zalogowaniu kontem z rolą \`admin\`. </p></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (!unref(isAdmin)) {
              _push2(ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="space-y-4"${_scopeId}><div${_scopeId}><h3 class="text-sm font-medium mb-2"${_scopeId}>Auth runtime</h3><p class="text-xs text-gray-500"${_scopeId}>Logowanie sesji, podgląd użytkownika i zmiana hasła.</p></div>`);
            if (unref(authSession)?.user) {
              _push2(`<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2"${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(unref(authSession).user.username)}</div><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(authSession).user.role)}</div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "soft",
                loading: unref(isLoggingOut),
                label: "Wyloguj",
                onClick: logout
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(loginForm).username,
                "onUpdate:modelValue": ($event) => unref(loginForm).username = $event,
                placeholder: "Login"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(loginForm).password,
                "onUpdate:modelValue": ($event) => unref(loginForm).password = $event,
                type: "password",
                placeholder: "Hasło"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                loading: unref(isLoggingIn),
                label: "Zaloguj",
                onClick: login
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            if (unref(authSession)?.user) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(passwordForm).currentPassword,
                "onUpdate:modelValue": ($event) => unref(passwordForm).currentPassword = $event,
                type: "password",
                placeholder: "Aktualne hasło"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(passwordForm).newPassword,
                "onUpdate:modelValue": ($event) => unref(passwordForm).newPassword = $event,
                type: "password",
                placeholder: "Nowe hasło"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(passwordForm).newPassword2,
                "onUpdate:modelValue": ($event) => unref(passwordForm).newPassword2 = $event,
                type: "password",
                placeholder: "Powtórz nowe hasło"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                variant: "soft",
                loading: unref(isChangingPassword),
                label: "Zmień hasło",
                onClick: changePassword
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(authMessage)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "primary",
                variant: "soft",
                icon: "i-heroicons-information-circle",
                title: unref(authMessage)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("section", null, [
                  createVNode("h3", { class: "text-sm font-medium mb-2" }, "Integracja Ollama"),
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode(_component_UInput, {
                      "model-value": unref(config).public.ollamaUrl,
                      disabled: ""
                    }, null, 8, ["model-value"]),
                    createVNode(_component_UInput, {
                      "model-value": unref(config).public.ollamaModel,
                      disabled: ""
                    }, null, 8, ["model-value"])
                  ])
                ]),
                createVNode(_component_USeparator),
                createVNode("section", null, [
                  createVNode("h3", { class: "text-sm font-medium mb-2" }, "Preferencje interfejsu"),
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("span", { class: "text-sm text-gray-500" }, "Tryb kolorystyczny:"),
                    createVNode(_component_UColorModeSelect)
                  ])
                ]),
                createVNode(_component_USeparator),
                !unref(isAdmin) ? (openBlock(), createBlock("section", {
                  key: 0,
                  class: "space-y-2"
                }, [
                  createVNode("h3", { class: "text-sm font-medium" }, "Konfiguracja administracyjna"),
                  createVNode("p", { class: "text-sm text-gray-500" }, " Oddziały, VAT i plany numeracji są widoczne dopiero po zalogowaniu kontem z rolą `admin`. ")
                ])) : createCommentVNode("", true),
                !unref(isAdmin) ? (openBlock(), createBlock(_component_USeparator, { key: 1 })) : createCommentVNode("", true),
                createVNode("section", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-sm font-medium mb-2" }, "Auth runtime"),
                    createVNode("p", { class: "text-xs text-gray-500" }, "Logowanie sesji, podgląd użytkownika i zmiana hasła.")
                  ]),
                  unref(authSession)?.user ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2"
                  }, [
                    createVNode("div", { class: "font-medium" }, toDisplayString(unref(authSession).user.username), 1),
                    createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(unref(authSession).user.role), 1),
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "soft",
                      loading: unref(isLoggingOut),
                      label: "Wyloguj",
                      onClick: logout
                    }, null, 8, ["loading"])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-3"
                  }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(loginForm).username,
                      "onUpdate:modelValue": ($event) => unref(loginForm).username = $event,
                      placeholder: "Login"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(loginForm).password,
                      "onUpdate:modelValue": ($event) => unref(loginForm).password = $event,
                      type: "password",
                      placeholder: "Hasło"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UButton, {
                      color: "primary",
                      loading: unref(isLoggingIn),
                      label: "Zaloguj",
                      onClick: login
                    }, null, 8, ["loading"])
                  ])),
                  unref(authSession)?.user ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "space-y-3"
                  }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(passwordForm).currentPassword,
                      "onUpdate:modelValue": ($event) => unref(passwordForm).currentPassword = $event,
                      type: "password",
                      placeholder: "Aktualne hasło"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(passwordForm).newPassword,
                      "onUpdate:modelValue": ($event) => unref(passwordForm).newPassword = $event,
                      type: "password",
                      placeholder: "Nowe hasło"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(passwordForm).newPassword2,
                      "onUpdate:modelValue": ($event) => unref(passwordForm).newPassword2 = $event,
                      type: "password",
                      placeholder: "Powtórz nowe hasło"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UButton, {
                      color: "primary",
                      variant: "soft",
                      loading: unref(isChangingPassword),
                      label: "Zmień hasło",
                      onClick: changePassword
                    }, null, 8, ["loading"])
                  ])) : createCommentVNode("", true),
                  unref(authMessage) ? (openBlock(), createBlock(_component_UAlert, {
                    key: 3,
                    color: "primary",
                    variant: "soft",
                    icon: "i-heroicons-information-circle",
                    title: unref(authMessage)
                  }, null, 8, ["title"])) : createCommentVNode("", true)
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-fv9nz0Tl.mjs.map
