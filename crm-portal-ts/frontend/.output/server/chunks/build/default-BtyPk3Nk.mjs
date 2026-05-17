import { withAsyncContext, ref, computed, mergeProps, withCtx, isRef, unref, createVNode, openBlock, createBlock, createCommentVNode, renderSlot, useSlots, useModel, useId, toRef, watch, mergeModels, createSlots, Fragment, renderList, resolveDynamicComponent, createTextVNode, toDisplayString, useTemplateRef, onScopeDispose, toHandlers, defineComponent, withKeys, createElementBlock, Teleport, toRefs, watchEffect, nextTick, toValue, normalizeProps, guardReactiveProps, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { d as useRoute, y as usePortalAuth, n as navigateTo, b as _sfc_main$8$1, e as _sfc_main$d, a0 as useNuxtApp, h as useAppConfig, i as useComponentUI, t as tv, P as Primitive, s as useLocale, w as useForwardProps, a1 as transformUI, v as useForwardPropsEmits, I as isArrayOfArray, z as _sfc_main$b$1, L as _sfc_main$c$1, K as get, a3 as _sfc_main$9$1, a4 as pickLinkProps, a5 as _sfc_main$a$1, a2 as omit, _ as _export_sfc, F as usePortal, M as FieldGroupReset, V as VisuallyHidden_default, $ as injectTooltipProviderContext, q as useForwardExpose, A as useCollection, C as Presence_default, x as __nuxt_component_0$3, T as Teleport_default, r as createContext, R as getActiveElement } from './server.mjs';
import { _ as _sfc_main$2$1, p as provideDashboardContext, u as useDashboard, a as useResizable, c as _sfc_main$e, b as _sfc_main$1$1, d as _sfc_main$4$1, H as HoverCard, P as Popover, e as useKbd, f as useArrowNavigation, g as useGraceArea } from './DashboardSidebarToggle-CpAlTuik.mjs';
import { x as defu, w as isEqual } from '../_/nitro.mjs';
import { createReusableTemplate, reactiveOmit, reactivePick, refAutoReset, useVModel, useDebounceFn, useEventListener, useResizeObserver, useActiveElement, refDebounced, refThrottled, useWindowSize, useDraggable, useTimeoutFn, unrefElement } from '@vueuse/core';
import { _ as _sfc_main$c, p as pointerDownOutside, D as DialogRoot_default, a as DialogTrigger_default, b as DialogPortal_default, c as DialogOverlay_default, d as DialogContent_default, e as DialogTitle_default, f as DialogDescription_default, g as DialogClose_default } from './Modal-DkNstLKI.mjs';
import { DrawerRootNested, DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerHandle, DrawerTitle, DrawerDescription } from 'vaul-vue';
import { a as useDirection, P as PopperRoot_default, b as PopperAnchor_default, c as PopperArrow_default, e as PopperContent_default } from './PopperArrow-CiJ5PBIc.mjs';
import { u as useId$1, D as DismissableLayer_default } from './FocusScope-afTtc11Z.mjs';
import { i as isValueEqualOrExist } from './isValueEqualOrExist-DDZNo4Zk.mjs';
import { reactiveOmit as reactiveOmit$1, isClient } from '@vueuse/shared';
import { _ as _sfc_main$f } from './Badge-BJKdv1tG.mjs';
import { g as getEstimateSize, L as ListboxItem_default, a as ListboxItemIndicator_default, b as ListboxRoot_default, c as ListboxFilter_default, f as ListboxContent_default, d as ListboxVirtualizer_default, e as ListboxGroup_default, h as injectListboxGroupContext } from './virtualizer-Dnga9fey.mjs';
import { useFuse } from '@vueuse/integrations/useFuse';
import { _ as _sfc_main$g } from './Input-B7kliWtD.mjs';
import { u as useColorMode } from './composables-B1mdlttm.mjs';
import { useRouter } from 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
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
import './utils-hoYYm4l-.mjs';
import './RovingFocusGroup-C9aTixOz.mjs';
import './utils-Bd-v-gOF.mjs';
import './useFilter-BytkjEhg.mjs';
import '@floating-ui/vue';
import 'aria-hidden';
import './VisuallyHiddenInput-vMStSdMN.mjs';
import '@tanstack/vue-virtual';

const [injectCollapsibleRootContext, provideCollapsibleRootContext] = /* @__PURE__ */ createContext("CollapsibleRoot");
var CollapsibleRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CollapsibleRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const { disabled, unmountOnHide } = toRefs(props);
    provideCollapsibleRootContext({
      contentId: "",
      disabled,
      open,
      unmountOnHide,
      onOpenToggle: () => {
        if (disabled.value) return;
        open.value = !open.value;
      }
    });
    __expose({ open });
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": props.asChild,
        "data-state": unref(open) ? "open" : "closed",
        "data-disabled": unref(disabled) ? "" : void 0
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state",
        "data-disabled"
      ]);
    };
  }
});
var CollapsibleRoot_default = CollapsibleRoot_vue_vue_type_script_setup_true_lang_default;
var CollapsibleContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "CollapsibleContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["contentFound"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectCollapsibleRootContext();
    rootContext.contentId ||= useId$1(void 0, "reka-collapsible-content");
    const presentRef = ref();
    const { forwardRef, currentElement } = useForwardExpose();
    const width = ref(0);
    const height = ref(0);
    const isOpen = computed(() => rootContext.open.value);
    const isMountAnimationPrevented = ref(isOpen.value);
    const currentStyle = ref();
    watch(() => [isOpen.value, presentRef.value?.present], async () => {
      await nextTick();
      const node = currentElement.value;
      if (!node) return;
      currentStyle.value = currentStyle.value || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      height.value = rect.height;
      width.value = rect.width;
      if (!isMountAnimationPrevented.value) {
        node.style.transitionDuration = currentStyle.value.transitionDuration;
        node.style.animationName = currentStyle.value.animationName;
      }
    }, { immediate: true });
    const skipAnimation = computed(() => isMountAnimationPrevented.value && rootContext.open.value);
    useEventListener(currentElement, "beforematch", (ev) => {
      requestAnimationFrame(() => {
        rootContext.onOpenToggle();
        emits("contentFound");
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), {
        ref_key: "presentRef",
        ref: presentRef,
        present: _ctx.forceMount || unref(rootContext).open.value,
        "force-mount": true
      }, {
        default: withCtx(({ present }) => [createVNode(unref(Primitive), mergeProps(_ctx.$attrs, {
          id: unref(rootContext).contentId,
          ref: unref(forwardRef),
          "as-child": props.asChild,
          as: _ctx.as,
          hidden: !present ? unref(rootContext).unmountOnHide.value ? "" : "until-found" : void 0,
          "data-state": skipAnimation.value ? void 0 : unref(rootContext).open.value ? "open" : "closed",
          "data-disabled": unref(rootContext).disabled?.value ? "" : void 0,
          style: {
            [`--reka-collapsible-content-height`]: `${height.value}px`,
            [`--reka-collapsible-content-width`]: `${width.value}px`
          }
        }), {
          default: withCtx(() => [(unref(rootContext).unmountOnHide.value ? present : true) ? renderSlot(_ctx.$slots, "default", { key: 0 }) : createCommentVNode("v-if", true)]),
          _: 2
        }, 1040, [
          "id",
          "as-child",
          "as",
          "hidden",
          "data-state",
          "data-disabled",
          "style"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var CollapsibleContent_default = CollapsibleContent_vue_vue_type_script_setup_true_lang_default;
var CollapsibleTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CollapsibleTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectCollapsibleRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        type: _ctx.as === "button" ? "button" : void 0,
        as: _ctx.as,
        "as-child": props.asChild,
        "aria-controls": unref(rootContext).contentId,
        "aria-expanded": unref(rootContext).open.value,
        "data-state": unref(rootContext).open.value ? "open" : "closed",
        "data-disabled": unref(rootContext).disabled?.value ? "" : void 0,
        disabled: unref(rootContext).disabled?.value,
        onClick: unref(rootContext).onOpenToggle
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "type",
        "as",
        "as-child",
        "aria-controls",
        "aria-expanded",
        "data-state",
        "data-disabled",
        "disabled",
        "onClick"
      ]);
    };
  }
});
var CollapsibleTrigger_default = CollapsibleTrigger_vue_vue_type_script_setup_true_lang_default;
function validateProps({ type, defaultValue, modelValue }) {
  const value = modelValue || defaultValue;
  const canTypeBeInferred = modelValue !== void 0 || defaultValue !== void 0;
  if (canTypeBeInferred) return Array.isArray(value) ? "multiple" : "single";
  else return type ?? "single";
}
function getDefaultType({ type, defaultValue, modelValue }) {
  if (type) return type;
  return validateProps({
    type,
    defaultValue,
    modelValue
  });
}
function getDefaultValue({ type, defaultValue }) {
  if (defaultValue !== void 0) return defaultValue;
  return type === "single" ? void 0 : [];
}
function useSingleOrMultipleValue(props, emits) {
  const type = computed(() => getDefaultType(props));
  const modelValue = useVModel(props, "modelValue", emits, {
    defaultValue: getDefaultValue(props),
    passive: props.modelValue === void 0,
    deep: true
  });
  function changeModelValue(value) {
    if (type.value === "single") modelValue.value = isEqual(value, modelValue.value) ? void 0 : value;
    else {
      const modelValueArray = Array.isArray(modelValue.value) ? [...modelValue.value || []] : [modelValue.value].filter(Boolean);
      if (isValueEqualOrExist(modelValueArray, value)) {
        const index = modelValueArray.findIndex((i) => isEqual(i, value));
        modelValueArray.splice(index, 1);
      } else modelValueArray.push(value);
      modelValue.value = modelValueArray;
    }
  }
  const isSingle = computed(() => type.value === "single");
  return {
    modelValue,
    changeModelValue,
    isSingle
  };
}
const [injectAccordionRootContext, provideAccordionRootContext] = /* @__PURE__ */ createContext("AccordionRoot");
var AccordionRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "AccordionRoot",
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    dir: {
      type: String,
      required: false
    },
    orientation: {
      type: String,
      required: false,
      default: "vertical"
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { dir, disabled, unmountOnHide } = toRefs(props);
    const direction = useDirection(dir);
    const { modelValue, changeModelValue, isSingle } = useSingleOrMultipleValue(props, emits);
    const { forwardRef, currentElement: parentElement } = useForwardExpose();
    provideAccordionRootContext({
      disabled,
      direction,
      orientation: props.orientation,
      parentElement,
      isSingle,
      collapsible: props.collapsible,
      modelValue,
      changeModelValue,
      unmountOnHide
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref: unref(forwardRef),
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var AccordionRoot_default = AccordionRoot_vue_vue_type_script_setup_true_lang_default;
var AccordionItemState = /* @__PURE__ */ (function(AccordionItemState$1) {
  AccordionItemState$1["Open"] = "open";
  AccordionItemState$1["Closed"] = "closed";
  return AccordionItemState$1;
})(AccordionItemState || {});
const [injectAccordionItemContext, provideAccordionItemContext] = /* @__PURE__ */ createContext("AccordionItem");
var AccordionItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "AccordionItem",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    value: {
      type: String,
      required: true
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const rootContext = injectAccordionRootContext();
    const open = computed(() => rootContext.isSingle.value ? props.value === rootContext.modelValue.value : Array.isArray(rootContext.modelValue.value) && rootContext.modelValue.value.includes(props.value));
    const disabled = computed(() => {
      return rootContext.disabled.value || props.disabled;
    });
    const dataDisabled = computed(() => disabled.value ? "" : void 0);
    const dataState = computed(() => open.value ? AccordionItemState.Open : AccordionItemState.Closed);
    __expose({
      open,
      dataDisabled
    });
    const { currentRef, currentElement } = useForwardExpose();
    provideAccordionItemContext({
      open,
      dataState,
      disabled,
      dataDisabled,
      triggerId: "",
      currentRef,
      currentElement,
      value: computed(() => props.value)
    });
    function handleArrowKey(e) {
      const target = e.target;
      const allCollectionItems = Array.from(rootContext.parentElement.value?.querySelectorAll("[data-reka-collection-item]") ?? []);
      const collectionItemIndex = allCollectionItems.findIndex((item) => item === target);
      if (collectionItemIndex === -1) return null;
      useArrowNavigation(e, target, rootContext.parentElement.value, {
        arrowKeyOptions: rootContext.orientation,
        dir: rootContext.direction.value,
        focus: true
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollapsibleRoot_default), {
        "data-orientation": unref(rootContext).orientation,
        "data-disabled": dataDisabled.value,
        "data-state": dataState.value,
        disabled: disabled.value,
        open: open.value,
        as: props.as,
        "as-child": props.asChild,
        "unmount-on-hide": props.unmountOnHide ?? unref(rootContext).unmountOnHide.value,
        onKeydown: withKeys(handleArrowKey, [
          "up",
          "down",
          "left",
          "right",
          "home",
          "end"
        ])
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: open.value })]),
        _: 3
      }, 8, [
        "data-orientation",
        "data-disabled",
        "data-state",
        "disabled",
        "open",
        "as",
        "as-child",
        "unmount-on-hide"
      ]);
    };
  }
});
var AccordionItem_default = AccordionItem_vue_vue_type_script_setup_true_lang_default;
var AccordionContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "AccordionContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectAccordionRootContext();
    const itemContext = injectAccordionItemContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollapsibleContent_default), {
        role: "region",
        "as-child": props.asChild,
        as: _ctx.as,
        "force-mount": props.forceMount,
        "aria-labelledby": unref(itemContext).triggerId,
        "data-state": unref(itemContext).dataState.value,
        "data-disabled": unref(itemContext).dataDisabled.value,
        "data-orientation": unref(rootContext).orientation,
        style: {
          "--reka-accordion-content-width": "var(--reka-collapsible-content-width)",
          "--reka-accordion-content-height": "var(--reka-collapsible-content-height)"
        },
        onContentFound: _cache[0] || (_cache[0] = ($event) => unref(rootContext).changeModelValue(unref(itemContext).value.value))
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as-child",
        "as",
        "force-mount",
        "aria-labelledby",
        "data-state",
        "data-disabled",
        "data-orientation"
      ]);
    };
  }
});
var AccordionContent_default = AccordionContent_vue_vue_type_script_setup_true_lang_default;
var AccordionTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "AccordionTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectAccordionRootContext();
    const itemContext = injectAccordionItemContext();
    itemContext.triggerId ||= useId$1(void 0, "reka-accordion-trigger");
    function changeItem() {
      const triggerDisabled = rootContext.isSingle.value && itemContext.open.value && !rootContext.collapsible;
      if (itemContext.disabled.value || triggerDisabled) return;
      rootContext.changeModelValue(itemContext.value.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollapsibleTrigger_default), {
        id: unref(itemContext).triggerId,
        ref: unref(itemContext).currentRef,
        "data-reka-collection-item": "",
        as: props.as,
        "as-child": props.asChild,
        "aria-disabled": unref(itemContext).disabled.value || void 0,
        "aria-expanded": unref(itemContext).open.value || false,
        "data-disabled": unref(itemContext).dataDisabled.value,
        "data-orientation": unref(rootContext).orientation,
        "data-state": unref(itemContext).dataState.value,
        disabled: unref(itemContext).disabled.value,
        onClick: changeItem
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "as",
        "as-child",
        "aria-disabled",
        "aria-expanded",
        "data-disabled",
        "data-orientation",
        "data-state",
        "disabled"
      ]);
    };
  }
});
var AccordionTrigger_default = AccordionTrigger_vue_vue_type_script_setup_true_lang_default;
var ListboxGroupLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxGroupLabel",
  props: {
    for: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const groupContext = injectListboxGroupContext({ id: "" });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).id }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var ListboxGroupLabel_default = ListboxGroupLabel_vue_vue_type_script_setup_true_lang_default;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
const LINK_SELECT = "navigationMenu.linkSelect";
const EVENT_ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = (void 0).createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
    const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
    if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
    return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst(candidates) {
  const previouslyFocusedElement = getActiveElement();
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return getActiveElement() !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
const [injectNavigationMenuContext, provideNavigationMenuContext] = /* @__PURE__ */ createContext(["NavigationMenuRoot", "NavigationMenuSub"], "NavigationMenuContext");
var NavigationMenuRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "NavigationMenuRoot",
  props: {
    modelValue: {
      type: String,
      required: false,
      default: void 0
    },
    defaultValue: {
      type: String,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    orientation: {
      type: String,
      required: false,
      default: "horizontal"
    },
    delayDuration: {
      type: Number,
      required: false,
      default: 200
    },
    skipDelayDuration: {
      type: Number,
      required: false,
      default: 300
    },
    disableClickTrigger: {
      type: Boolean,
      required: false,
      default: false
    },
    disableHoverTrigger: {
      type: Boolean,
      required: false,
      default: false
    },
    disablePointerLeaveClose: {
      type: Boolean,
      required: false
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "nav"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? "",
      passive: props.modelValue === void 0
    });
    const previousValue = ref("");
    const { forwardRef, currentElement: rootNavigationMenu } = useForwardExpose();
    const indicatorTrack = ref();
    const viewport = ref();
    const activeTrigger = ref();
    const { getItems, CollectionSlot } = useCollection({
      key: "NavigationMenu",
      isProvider: true
    });
    const { delayDuration, skipDelayDuration, dir: propDir, disableClickTrigger, disableHoverTrigger, unmountOnHide } = toRefs(props);
    const dir = useDirection(propDir);
    const isDelaySkipped = refAutoReset(false, skipDelayDuration);
    const computedDelay = computed(() => {
      const isOpen = modelValue.value !== "";
      if (isOpen || isDelaySkipped.value) return 150;
      else return delayDuration.value;
    });
    const debouncedFn = useDebounceFn((val) => {
      if (typeof val === "string") {
        previousValue.value = modelValue.value;
        modelValue.value = val;
      }
    }, computedDelay);
    watchEffect(() => {
      if (!modelValue.value) return;
      const items = getItems().map((i) => i.ref);
      activeTrigger.value = items.find((item) => item.id.includes(modelValue.value));
    });
    useEventListener(rootNavigationMenu, EVENT_ROOT_CONTENT_DISMISS, onItemDismiss);
    provideNavigationMenuContext({
      isRootMenu: true,
      modelValue,
      previousValue,
      baseId: useId$1(void 0, "reka-navigation-menu"),
      disableClickTrigger,
      disableHoverTrigger,
      dir,
      unmountOnHide,
      orientation: props.orientation,
      rootNavigationMenu,
      indicatorTrack,
      activeTrigger,
      onIndicatorTrackChange: (val) => {
        indicatorTrack.value = val;
      },
      viewport,
      onViewportChange: (val) => {
        viewport.value = val;
      },
      onTriggerEnter: (val) => {
        debouncedFn(val);
      },
      onTriggerLeave: () => {
        isDelaySkipped.value = true;
        debouncedFn("");
      },
      onContentEnter: () => {
        debouncedFn();
      },
      onContentLeave: () => {
        if (!props.disablePointerLeaveClose) debouncedFn("");
      },
      onItemSelect: (val) => {
        previousValue.value = modelValue.value;
        modelValue.value = val;
      },
      onItemDismiss
    });
    function onItemDismiss() {
      previousValue.value = modelValue.value;
      modelValue.value = "";
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-orientation": _ctx.orientation,
          dir: unref(dir),
          "data-reka-navigation-menu": ""
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "data-orientation",
          "dir"
        ])]),
        _: 3
      });
    };
  }
});
var NavigationMenuRoot_default = NavigationMenuRoot_vue_vue_type_script_setup_true_lang_default;
const [injectNavigationMenuItemContext, provideNavigationMenuItemContext] = /* @__PURE__ */ createContext("NavigationMenuItem");
var NavigationMenuItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "NavigationMenuItem",
  props: {
    value: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "li"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const { getItems } = useCollection({ key: "NavigationMenu" });
    const context = injectNavigationMenuContext();
    const value = useId$1(props.value);
    const triggerRef$1 = ref();
    const focusProxyRef = ref();
    const contentId = makeContentId(context.baseId, value);
    let restoreContentTabOrderRef = () => ({});
    const wasEscapeCloseRef = ref(false);
    async function handleContentEntry(side = "start") {
      const el = (void 0).getElementById(contentId);
      if (el) {
        restoreContentTabOrderRef();
        const candidates = getTabbableCandidates(el);
        if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
      }
    }
    function handleContentExit() {
      const el = (void 0).getElementById(contentId);
      if (el) {
        const candidates = getTabbableCandidates(el);
        if (candidates.length) restoreContentTabOrderRef = removeFromTabOrder(candidates);
      }
    }
    provideNavigationMenuItemContext({
      value,
      contentId,
      triggerRef: triggerRef$1,
      focusProxyRef,
      wasEscapeCloseRef,
      onEntryKeyDown: handleContentEntry,
      onFocusProxyEnter: handleContentEntry,
      onContentFocusOutside: handleContentExit,
      onRootContentClose: handleContentExit
    });
    function handleClose() {
      context.onItemDismiss();
      triggerRef$1.value?.focus();
    }
    function handleKeydown(ev) {
      const currentFocus = getActiveElement();
      if (ev.keyCode === 32 || ev.key === "Enter") if (context.modelValue.value === value) {
        handleClose();
        ev.preventDefault();
        return;
      } else {
        ev.target.click();
        ev.preventDefault();
        return;
      }
      const itemsArray = getItems().filter((i) => i.ref.parentElement?.hasAttribute("data-menu-item")).map((i) => i.ref);
      if (!itemsArray.includes(currentFocus)) return;
      const newSelectedElement = useArrowNavigation(ev, currentFocus, void 0, {
        itemsArray,
        loop: false
      });
      if (newSelectedElement) newSelectedElement?.focus();
      ev.preventDefault();
      ev.stopPropagation();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        "as-child": _ctx.asChild,
        as: _ctx.as,
        "data-menu-item": "",
        onKeydown: withKeys(handleKeydown, [
          "up",
          "down",
          "left",
          "right",
          "home",
          "end",
          "space"
        ])
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var NavigationMenuItem_default = NavigationMenuItem_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "NavigationMenuContentImpl",
  props: {
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { getItems } = useCollection({ key: "NavigationMenu" });
    const { forwardRef, currentElement } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const triggerId = makeTriggerId(menuContext.baseId, itemContext.value);
    const contentId = makeContentId(menuContext.baseId, itemContext.value);
    const prevMotionAttributeRef = ref(null);
    const motionAttribute = computed(() => {
      const values = getItems().map((i) => i.ref.id.split("trigger-")[1]);
      if (menuContext.dir.value === "rtl") values.reverse();
      const index = values.indexOf(menuContext.modelValue.value);
      const prevIndex = values.indexOf(menuContext.previousValue.value);
      const isSelected = itemContext.value === menuContext.modelValue.value;
      const wasSelected = prevIndex === values.indexOf(itemContext.value);
      if (!isSelected && !wasSelected) return prevMotionAttributeRef.value;
      const attribute = (() => {
        if (index !== prevIndex) {
          if (isSelected && prevIndex !== -1) return index > prevIndex ? "from-end" : "from-start";
          if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
        }
        return null;
      })();
      prevMotionAttributeRef.value = attribute;
      return attribute;
    });
    function handleFocusOutside(ev) {
      emits("focusOutside", ev);
      emits("interactOutside", ev);
      const target = ev.detail.originalEvent.target;
      if (target.hasAttribute("data-navigation-menu-trigger")) ev.preventDefault();
      if (!ev.defaultPrevented) {
        itemContext.onContentFocusOutside();
        const target$1 = ev.target;
        if (menuContext.rootNavigationMenu?.value?.contains(target$1)) ev.preventDefault();
      }
    }
    function handlePointerDownOutside(ev) {
      emits("pointerDownOutside", ev);
      if (!ev.defaultPrevented) {
        const target = ev.target;
        const isTrigger = getItems().some((i) => i.ref.contains(target));
        const isRootViewport = menuContext.isRootMenu && menuContext.viewport.value?.contains(target);
        if (isTrigger || isRootViewport || !menuContext.isRootMenu) ev.preventDefault();
      }
    }
    watchEffect((cleanupFn) => {
      const content = currentElement.value;
      if (menuContext.isRootMenu && content) {
        const handleClose = () => {
          menuContext.onItemDismiss();
          itemContext.onRootContentClose();
          if (content.contains(getActiveElement())) itemContext.triggerRef.value?.focus();
        };
        content.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose);
        cleanupFn(() => content.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose));
      }
    });
    function handleEscapeKeyDown(ev) {
      emits("escapeKeyDown", ev);
      if (!ev.defaultPrevented) {
        menuContext.onItemDismiss();
        itemContext.triggerRef?.value?.focus();
        itemContext.wasEscapeCloseRef.value = true;
      }
    }
    function handleKeydown(ev) {
      if (ev.target.closest("[data-reka-navigation-menu]") !== menuContext.rootNavigationMenu.value) return;
      const isMetaKey = ev.altKey || ev.ctrlKey || ev.metaKey;
      const isTabKey = ev.key === "Tab" && !isMetaKey;
      const candidates = getTabbableCandidates(ev.currentTarget);
      if (isTabKey) {
        const focusedElement = getActiveElement();
        const index = candidates.findIndex((candidate) => candidate === focusedElement);
        const isMovingBackwards = ev.shiftKey;
        const nextCandidates = isMovingBackwards ? candidates.slice(0, index).reverse() : candidates.slice(index + 1, candidates.length);
        if (focusFirst(nextCandidates)) ev.preventDefault();
        else {
          itemContext.focusProxyRef.value?.focus();
          return;
        }
      }
      const newSelectedElement = useArrowNavigation(ev, getActiveElement(), void 0, {
        itemsArray: candidates,
        loop: false,
        enableIgnoredElement: true
      });
      newSelectedElement?.focus();
    }
    function handleDismiss() {
      const rootContentDismissEvent = new Event(EVENT_ROOT_CONTENT_DISMISS, {
        bubbles: true,
        cancelable: true
      });
      currentElement.value?.dispatchEvent(rootContentDismissEvent);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DismissableLayer_default), mergeProps({
        id: unref(contentId),
        ref: unref(forwardRef),
        "aria-labelledby": unref(triggerId),
        "data-motion": motionAttribute.value,
        "data-state": unref(getOpenState)(unref(menuContext).modelValue.value === unref(itemContext).value),
        "data-orientation": unref(menuContext).orientation
      }, props, {
        onKeydown: handleKeydown,
        onEscapeKeyDown: handleEscapeKeyDown,
        onPointerDownOutside: handlePointerDownOutside,
        onFocusOutside: handleFocusOutside,
        onDismiss: handleDismiss
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "data-motion",
        "data-state",
        "data-orientation"
      ]);
    };
  }
});
var NavigationMenuContentImpl_default = NavigationMenuContentImpl_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(reactiveOmit$1(props, "forceMount"), emits);
    const { forwardRef } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const open = computed(() => itemContext.value === menuContext.modelValue.value);
    const isLastActiveValue = computed(() => {
      if (menuContext.viewport.value) {
        if (!menuContext.modelValue.value && menuContext.previousValue.value) return menuContext.previousValue.value === itemContext.value;
      }
      return false;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: unref(isClient) && unref(menuContext).viewport.value ? unref(menuContext).viewport.value : "body",
        disabled: unref(isClient) && unref(menuContext).viewport.value ? !unref(menuContext).viewport.value : true
      }, [createVNode(unref(Presence_default), {
        present: _ctx.forceMount || open.value || isLastActiveValue.value,
        "force-mount": !unref(menuContext).unmountOnHide.value
      }, {
        default: withCtx(({ present }) => [createVNode(NavigationMenuContentImpl_default, mergeProps({
          ref: unref(forwardRef),
          "data-state": unref(getOpenState)(open.value),
          style: { pointerEvents: !open.value && unref(menuContext).isRootMenu ? "none" : void 0 }
        }, {
          ..._ctx.$attrs,
          ...unref(forwarded)
        }, {
          hidden: !present,
          onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onContentEnter(unref(itemContext).value)),
          onPointerleave: _cache[1] || (_cache[1] = ($event) => unref(whenMouse)(() => unref(menuContext).onContentLeave())($event)),
          onPointerDownOutside: _cache[2] || (_cache[2] = ($event) => emits("pointerDownOutside", $event)),
          onFocusOutside: _cache[3] || (_cache[3] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[4] || (_cache[4] = ($event) => emits("interactOutside", $event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, [
          "data-state",
          "style",
          "hidden"
        ])]),
        _: 3
      }, 8, ["present", "force-mount"])], 8, ["to", "disabled"]);
    };
  }
});
var NavigationMenuContent_default = NavigationMenuContent_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const { forwardRef } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const indicatorStyle = ref();
    const isHorizontal = computed(() => menuContext.orientation === "horizontal");
    const isVisible = computed(() => !!menuContext.modelValue.value);
    const { activeTrigger } = menuContext;
    function handlePositionChange() {
      if (!activeTrigger.value) return;
      indicatorStyle.value = {
        size: isHorizontal.value ? activeTrigger.value.offsetWidth : activeTrigger.value.offsetHeight,
        position: isHorizontal.value ? activeTrigger.value.offsetLeft : activeTrigger.value.offsetTop
      };
    }
    watchEffect(() => {
      if (!menuContext.modelValue.value) return;
      handlePositionChange();
    });
    useResizeObserver(activeTrigger, handlePositionChange);
    useResizeObserver(menuContext.indicatorTrack, handlePositionChange);
    return (_ctx, _cache) => {
      return unref(menuContext).indicatorTrack.value ? (openBlock(), createBlock(Teleport, {
        key: 0,
        to: unref(menuContext).indicatorTrack.value
      }, [createVNode(unref(Presence_default), { present: _ctx.forceMount || isVisible.value }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "aria-hidden": "true",
          "data-state": isVisible.value ? "visible" : "hidden",
          "data-orientation": unref(menuContext).orientation,
          "as-child": props.asChild,
          as: _ctx.as,
          style: { ...indicatorStyle.value ? {
            "--reka-navigation-menu-indicator-size": `${indicatorStyle.value.size}px`,
            "--reka-navigation-menu-indicator-position": `${indicatorStyle.value.position}px`
          } : {} }
        }, _ctx.$attrs), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "data-state",
          "data-orientation",
          "as-child",
          "as",
          "style"
        ])]),
        _: 3
      }, 8, ["present"])], 8, ["to"])) : createCommentVNode("v-if", true);
    };
  }
});
var NavigationMenuIndicator_default = NavigationMenuIndicator_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuLink_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "NavigationMenuLink",
  props: {
    active: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "a"
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { CollectionItem } = useCollection({ key: "NavigationMenu" });
    useForwardExpose();
    async function handleClick(ev) {
      const linkSelectEvent = new CustomEvent(LINK_SELECT, {
        bubbles: true,
        cancelable: true,
        detail: { originalEvent: ev }
      });
      emits("select", linkSelectEvent);
      if (!linkSelectEvent.defaultPrevented && !ev.metaKey) {
        const rootContentDismissEvent = new CustomEvent(EVENT_ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true
        });
        ev.target?.dispatchEvent(rootContentDismissEvent);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          as: _ctx.as,
          "data-active": _ctx.active ? "" : void 0,
          "aria-current": _ctx.active ? "page" : void 0,
          "as-child": props.asChild,
          onClick: handleClick
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "data-active",
          "aria-current",
          "as-child"
        ])]),
        _: 3
      });
    };
  }
});
var NavigationMenuLink_default = NavigationMenuLink_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuList",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "ul"
    }
  },
  setup(__props) {
    const props = __props;
    const menuContext = injectNavigationMenuContext();
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref: unref(forwardRef),
        style: { "position": "relative" }
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps(_ctx.$attrs, {
          "as-child": props.asChild,
          as: _ctx.as,
          "data-orientation": unref(menuContext).orientation
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "as-child",
          "as",
          "data-orientation"
        ])]),
        _: 3
      }, 512);
    };
  }
});
var NavigationMenuList_default = NavigationMenuList_vue_vue_type_script_setup_true_lang_default;
const _hoisted_1 = ["aria-owns"];
var NavigationMenuTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const { CollectionItem } = useCollection({ key: "NavigationMenu" });
    const { forwardRef, currentElement: triggerElement } = useForwardExpose();
    const triggerId = ref("");
    const contentId = ref("");
    const hasPointerMoveOpenedRef = refAutoReset(false, 300);
    const wasClickCloseRef = ref(false);
    const open = computed(() => itemContext.value === menuContext.modelValue.value);
    function handlePointerEnter() {
      if (menuContext.disableHoverTrigger.value) return;
      wasClickCloseRef.value = false;
      itemContext.wasEscapeCloseRef.value = false;
    }
    function handlePointerMove(ev) {
      if (menuContext.disableHoverTrigger.value) return;
      if (ev.pointerType === "mouse") {
        if (props.disabled || wasClickCloseRef.value || itemContext.wasEscapeCloseRef.value || hasPointerMoveOpenedRef.value) return;
        menuContext.onTriggerEnter(itemContext.value);
        hasPointerMoveOpenedRef.value = true;
      }
    }
    function handlePointerLeave(ev) {
      if (menuContext.disableHoverTrigger.value) return;
      if (ev.pointerType === "mouse") {
        if (props.disabled) return;
        menuContext.onTriggerLeave();
        hasPointerMoveOpenedRef.value = false;
      }
    }
    function handleClick(event) {
      if ((!("pointerType" in event) || event.pointerType === "mouse") && menuContext.disableClickTrigger.value) return;
      if (hasPointerMoveOpenedRef.value) return;
      if (open.value) menuContext.onItemSelect("");
      else menuContext.onItemSelect(itemContext.value);
      wasClickCloseRef.value = open.value;
    }
    function handleKeydown(ev) {
      const verticalEntryKey = menuContext.dir.value === "rtl" ? "ArrowLeft" : "ArrowRight";
      const entryKey = {
        horizontal: "ArrowDown",
        vertical: verticalEntryKey
      }[menuContext.orientation];
      if (open.value && ev.key === entryKey) {
        itemContext.onEntryKeyDown();
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
    function setFocusProxyRef(node) {
      if (!node) return void 0;
      itemContext.focusProxyRef.value = unrefElement(node);
      return void 0;
    }
    function handleVisuallyHiddenFocus(ev) {
      const content = (void 0).getElementById(itemContext.contentId);
      const prevFocusedElement = ev.relatedTarget;
      const wasTriggerFocused = prevFocusedElement === triggerElement.value;
      const wasFocusFromContent = content?.contains(prevFocusedElement);
      if (wasTriggerFocused || !wasFocusFromContent) itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(CollectionItem), null, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          id: triggerId.value,
          ref: unref(forwardRef),
          disabled: _ctx.disabled,
          "data-disabled": _ctx.disabled ? "" : void 0,
          "data-state": unref(getOpenState)(open.value),
          "data-navigation-menu-trigger": "",
          "aria-expanded": open.value,
          "aria-controls": contentId.value,
          "as-child": props.asChild,
          as: _ctx.as
        }, _ctx.$attrs, {
          onPointerenter: handlePointerEnter,
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onClick: handleClick,
          onKeydown: handleKeydown
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "disabled",
          "data-disabled",
          "data-state",
          "aria-expanded",
          "aria-controls",
          "as-child",
          "as"
        ])]),
        _: 3
      }), open.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createVNode(unref(VisuallyHidden_default), {
        ref: setFocusProxyRef,
        "aria-hidden": "true",
        tabindex: 0,
        onFocus: handleVisuallyHiddenFocus
      }), unref(menuContext).viewport ? (openBlock(), createElementBlock("span", {
        key: 0,
        "aria-owns": contentId.value
      }, null, 8, _hoisted_1)) : createCommentVNode("v-if", true)], 64)) : createCommentVNode("v-if", true)], 64);
    };
  }
});
var NavigationMenuTrigger_default = NavigationMenuTrigger_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuViewport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuViewport",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    align: {
      type: String,
      required: false,
      default: "center"
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const { forwardRef, currentElement } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const { activeTrigger, rootNavigationMenu, modelValue } = menuContext;
    const size = ref();
    const position = ref();
    const open = computed(() => !!menuContext.modelValue.value);
    watch(currentElement, () => {
      menuContext.onViewportChange(currentElement.value);
    });
    const content = ref();
    watch([modelValue, open], () => {
      nextTick(() => {
        if (!currentElement.value) return;
        requestAnimationFrame(() => {
          const el = currentElement.value?.querySelector("[data-state=open]");
          content.value = el;
        });
      });
    }, { immediate: true });
    function updatePosition() {
      if (content.value && activeTrigger.value && rootNavigationMenu.value) {
        const bodyWidth = (void 0).documentElement.offsetWidth;
        const bodyHeight = (void 0).documentElement.offsetHeight;
        const rootRect = rootNavigationMenu.value.getBoundingClientRect();
        const rect = activeTrigger.value.getBoundingClientRect();
        const { offsetWidth, offsetHeight } = content.value;
        const startPositionLeft = rect.left - rootRect.left;
        const startPositionTop = rect.top - rootRect.top;
        let posLeft = null;
        let posTop = null;
        switch (props.align) {
          case "start":
            posLeft = startPositionLeft;
            posTop = startPositionTop;
            break;
          case "end":
            posLeft = startPositionLeft - offsetWidth + rect.width;
            posTop = startPositionTop - offsetHeight + rect.height;
            break;
          default:
            posLeft = startPositionLeft - offsetWidth / 2 + rect.width / 2;
            posTop = startPositionTop - offsetHeight / 2 + rect.height / 2;
        }
        const screenOffset = 10;
        if (posLeft + rootRect.left < screenOffset) posLeft = screenOffset - rootRect.left;
        const rightOffset = posLeft + rootRect.left + offsetWidth;
        if (rightOffset > bodyWidth - screenOffset) {
          posLeft -= rightOffset - bodyWidth + screenOffset;
          if (posLeft < screenOffset - rootRect.left) posLeft = screenOffset - rootRect.left;
        }
        if (posTop + rootRect.top < screenOffset) posTop = screenOffset - rootRect.top;
        const bottomOffset = posTop + rootRect.top + offsetHeight;
        if (bottomOffset > bodyHeight - screenOffset) {
          posTop -= bottomOffset - bodyHeight + screenOffset;
          if (posTop < screenOffset - rootRect.top) posTop = screenOffset - rootRect.top;
        }
        posLeft = Math.round(posLeft);
        posTop = Math.round(posTop);
        position.value = {
          left: posLeft,
          top: posTop
        };
      }
    }
    useResizeObserver(content, () => {
      if (content.value) {
        size.value = {
          width: content.value.offsetWidth,
          height: content.value.offsetHeight
        };
        updatePosition();
      }
    });
    useResizeObserver([globalThis.document?.body, rootNavigationMenu], () => {
      updatePosition();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), {
        present: _ctx.forceMount || open.value,
        "force-mount": !unref(menuContext).unmountOnHide.value,
        onAfterLeave: _cache[2] || (_cache[2] = () => {
          size.value = void 0;
          position.value = void 0;
        })
      }, {
        default: withCtx(({ present }) => [createVNode(unref(Primitive), mergeProps(_ctx.$attrs, {
          ref: unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-state": unref(getOpenState)(open.value),
          "data-orientation": unref(menuContext).orientation,
          style: {
            pointerEvents: !open.value && unref(menuContext).isRootMenu ? "none" : void 0,
            ["--reka-navigation-menu-viewport-width"]: size.value ? `${size.value?.width}px` : void 0,
            ["--reka-navigation-menu-viewport-height"]: size.value ? `${size.value?.height}px` : void 0,
            ["--reka-navigation-menu-viewport-left"]: position.value ? `${position.value?.left}px` : void 0,
            ["--reka-navigation-menu-viewport-top"]: position.value ? `${position.value?.top}px` : void 0
          },
          hidden: !present,
          onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onContentEnter(unref(menuContext).modelValue.value)),
          onPointerleave: _cache[1] || (_cache[1] = ($event) => unref(whenMouse)(() => unref(menuContext).onContentLeave())($event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, [
          "as",
          "as-child",
          "data-state",
          "data-orientation",
          "style",
          "hidden"
        ])]),
        _: 3
      }, 8, ["present", "force-mount"]);
    };
  }
});
var NavigationMenuViewport_default = NavigationMenuViewport_vue_vue_type_script_setup_true_lang_default;
var TooltipArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipArrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var TooltipArrow_default = TooltipArrow_vue_vue_type_script_setup_true_lang_default;
const TOOLTIP_OPEN = "tooltip.open";
const [injectTooltipRootContext, provideTooltipRootContext] = /* @__PURE__ */ createContext("TooltipRoot");
var TooltipRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    delayDuration: {
      type: Number,
      required: false,
      default: void 0
    },
    disableHoverableContent: {
      type: Boolean,
      required: false,
      default: void 0
    },
    disableClosingTrigger: {
      type: Boolean,
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false,
      default: void 0
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      required: false,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useForwardExpose();
    const providerContext = injectTooltipProviderContext();
    const disableHoverableContent = computed(() => props.disableHoverableContent ?? providerContext.disableHoverableContent.value);
    const disableClosingTrigger = computed(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value);
    const disableTooltip = computed(() => props.disabled ?? providerContext.disabled.value);
    const delayDuration = computed(() => props.delayDuration ?? providerContext.delayDuration.value);
    const ignoreNonKeyboardFocus = computed(() => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value);
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    watch(open, (isOpen) => {
      if (!providerContext.onClose) return;
      if (isOpen) {
        providerContext.onOpen();
        (void 0).dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else providerContext.onClose();
    });
    const wasOpenDelayedRef = ref(false);
    const trigger = ref();
    const stateAttribute = computed(() => {
      if (!open.value) return "closed";
      return wasOpenDelayedRef.value ? "delayed-open" : "instant-open";
    });
    const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
      wasOpenDelayedRef.value = true;
      open.value = true;
    }, delayDuration, { immediate: false });
    function handleOpen() {
      clearTimer();
      wasOpenDelayedRef.value = false;
      open.value = true;
    }
    function handleClose() {
      clearTimer();
      open.value = false;
    }
    function handleDelayedOpen() {
      startTimer();
    }
    provideTooltipRootContext({
      contentId: "",
      open,
      stateAttribute,
      trigger,
      onTriggerChange(el) {
        trigger.value = el;
      },
      onTriggerEnter() {
        if (providerContext.isOpenDelayed.value) handleDelayedOpen();
        else handleOpen();
      },
      onTriggerLeave() {
        if (disableHoverableContent.value) handleClose();
        else clearTimer();
      },
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      disableClosingTrigger,
      disabled: disableTooltip,
      ignoreNonKeyboardFocus
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
        _: 3
      });
    };
  }
});
var TooltipRoot_default = TooltipRoot_vue_vue_type_script_setup_true_lang_default;
var TooltipContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentImpl",
  props: {
    ariaLabel: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false,
      default: void 0
    },
    as: {
      type: null,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false,
      default: void 0
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false,
      default: void 0
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectTooltipRootContext();
    const providerContext = injectTooltipProviderContext();
    const { forwardRef, currentElement } = useForwardExpose();
    const ariaLabel = computed(() => props.ariaLabel || currentElement.value?.textContent);
    const popperContentProps = computed(() => {
      const { ariaLabel: _, ...restProps } = props;
      return defu(restProps, providerContext.content.value ?? {}, {
        side: "top",
        sideOffset: 0,
        align: "center",
        avoidCollisions: true,
        collisionBoundary: [],
        collisionPadding: 0,
        arrowPadding: 0,
        sticky: "partial",
        hideWhenDetached: false
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DismissableLayer_default), {
        "as-child": "",
        "disable-outside-pointer-events": false,
        onEscapeKeyDown: _cache[0] || (_cache[0] = ($event) => emits("escapeKeyDown", $event)),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          if (unref(rootContext).disableClosingTrigger.value && unref(rootContext).trigger.value?.contains(event.target)) event.preventDefault();
          emits("pointerDownOutside", event);
        }),
        onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {
        }, ["prevent"])),
        onDismiss: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onClose())
      }, {
        default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps({
          ref: unref(forwardRef),
          "data-state": unref(rootContext).stateAttribute.value
        }, {
          ..._ctx.$attrs,
          ...popperContentProps.value
        }, { style: {
          "--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
          "--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
          "--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
          "--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
          "--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
        } }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default"), createVNode(unref(VisuallyHidden_default), {
            id: unref(rootContext).contentId,
            role: "tooltip"
          }, {
            default: withCtx(() => [createTextVNode(toDisplayString(ariaLabel.value), 1)]),
            _: 1
          }, 8, ["id"])]),
          _: 3
        }, 16, ["data-state"])]),
        _: 3
      });
    };
  }
});
var TooltipContentImpl_default = TooltipContentImpl_vue_vue_type_script_setup_true_lang_default;
var TooltipContentHoverable_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentHoverable",
  props: {
    ariaLabel: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const forwardedProps = useForwardProps(props);
    const { forwardRef, currentElement } = useForwardExpose();
    const { trigger, onClose } = injectTooltipRootContext();
    const providerContext = injectTooltipProviderContext();
    const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement);
    providerContext.isPointerInTransitRef = isPointerInTransit;
    onPointerExit(() => {
      onClose();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(TooltipContentImpl_default, mergeProps({ ref: unref(forwardRef) }, unref(forwardedProps)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var TooltipContentHoverable_default = TooltipContentHoverable_vue_vue_type_script_setup_true_lang_default;
var TooltipContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    ariaLabel: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectTooltipRootContext();
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
        default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(unref(rootContext).disableHoverableContent.value ? TooltipContentImpl_default : TooltipContentHoverable_default), mergeProps({ ref: unref(forwardRef) }, unref(forwarded)), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var TooltipContent_default = TooltipContent_vue_vue_type_script_setup_true_lang_default;
var TooltipPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var TooltipPortal_default = TooltipPortal_vue_vue_type_script_setup_true_lang_default;
var TooltipTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TooltipTrigger",
  props: {
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectTooltipRootContext();
    const providerContext = injectTooltipProviderContext();
    rootContext.contentId ||= useId$1(void 0, "reka-tooltip-content");
    const { forwardRef } = useForwardExpose();
    const isPointerDown = ref(false);
    const hasPointerMoveOpened = ref(false);
    const tooltipListeners = computed(() => {
      if (rootContext.disabled.value) return {};
      return {
        click: handleClick,
        focus: handleFocus,
        pointermove: handlePointerMove,
        pointerleave: handlePointerLeave,
        pointerdown: handlePointerDown,
        blur: handleBlur
      };
    });
    function handlePointerUp() {
      setTimeout(() => {
        isPointerDown.value = false;
      }, 1);
    }
    function handlePointerDown() {
      if (rootContext.open && !rootContext.disableClosingTrigger.value) rootContext.onClose();
      isPointerDown.value = true;
      (void 0).addEventListener("pointerup", handlePointerUp, { once: true });
    }
    function handlePointerMove(event) {
      if (event.pointerType === "touch") return;
      if (!hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value) {
        rootContext.onTriggerEnter();
        hasPointerMoveOpened.value = true;
      }
    }
    function handlePointerLeave() {
      rootContext.onTriggerLeave();
      hasPointerMoveOpened.value = false;
    }
    function handleFocus(event) {
      if (isPointerDown.value) return;
      if (rootContext.ignoreNonKeyboardFocus.value && !event.target.matches?.(":focus-visible")) return;
      rootContext.onOpen();
    }
    function handleBlur() {
      rootContext.onClose();
    }
    function handleClick() {
      if (!rootContext.disableClosingTrigger.value) rootContext.onClose();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "aria-describedby": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
          "data-state": unref(rootContext).stateAttribute.value,
          as: _ctx.as,
          "as-child": props.asChild,
          "data-grace-area-trigger": ""
        }, toHandlers(tooltipListeners.value)), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "aria-describedby",
          "data-state",
          "as",
          "as-child"
        ])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var TooltipTrigger_default = TooltipTrigger_vue_vue_type_script_setup_true_lang_default;
const theme$9 = {
  "base": "fixed inset-0 flex overflow-hidden"
};
const _sfc_main$b = {
  __name: "UDashboardGroup",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    storage: { type: String, required: false, default: "cookie" },
    storageKey: { type: String, required: false, default: "dashboard" },
    persistent: { type: Boolean, required: false, default: true },
    unit: { type: String, required: false, default: "%" }
  },
  setup(__props) {
    const props = __props;
    const nuxtApp = useNuxtApp();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardGroup", props);
    const ui = computed(() => tv({ extend: tv(theme$9), ...appConfig.ui?.dashboardGroup || {} }));
    const sidebarOpen = ref(false);
    const sidebarCollapsed = ref(false);
    provideDashboardContext({
      storage: props.storage,
      storageKey: props.storageKey,
      persistent: props.persistent,
      unit: props.unit,
      sidebarOpen,
      toggleSidebar: () => {
        nuxtApp.hooks.callHook("dashboard:sidebar:toggle");
      },
      sidebarCollapsed,
      collapseSidebar: (collapsed) => {
        nuxtApp.hooks.callHook("dashboard:sidebar:collapse", collapsed);
      },
      toggleSearch: () => {
        nuxtApp.hooks.callHook("dashboard:search:toggle");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value({ class: [unref(uiProp)?.base, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardGroup.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const theme$8 = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none",
    "header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
    "wrapper": "",
    "body": "flex-1 overflow-y-auto p-4 sm:p-6",
    "footer": "flex items-center gap-1.5 p-4 sm:px-6",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "close": "absolute top-4 end-4"
  },
  "variants": {
    "side": {
      "top": {
        "content": ""
      },
      "right": {
        "content": "max-w-md"
      },
      "bottom": {
        "content": ""
      },
      "left": {
        "content": "max-w-md"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg"
      }
    },
    "transition": {
      "true": {
        "overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]"
      }
    }
  },
  "compoundVariants": [
    {
      "side": "top",
      "inset": true,
      "class": {
        "content": "max-h-[calc(100%-2rem)] inset-x-4 top-4"
      }
    },
    {
      "side": "top",
      "inset": false,
      "class": {
        "content": "max-h-full inset-x-0 top-0"
      }
    },
    {
      "side": "right",
      "inset": true,
      "class": {
        "content": "w-[calc(100%-2rem)] inset-y-4 right-4"
      }
    },
    {
      "side": "right",
      "inset": false,
      "class": {
        "content": "w-full inset-y-0 right-0"
      }
    },
    {
      "side": "bottom",
      "inset": true,
      "class": {
        "content": "max-h-[calc(100%-2rem)] inset-x-4 bottom-4"
      }
    },
    {
      "side": "bottom",
      "inset": false,
      "class": {
        "content": "max-h-full inset-x-0 bottom-0"
      }
    },
    {
      "side": "left",
      "inset": true,
      "class": {
        "content": "w-[calc(100%-2rem)] inset-y-4 left-4"
      }
    },
    {
      "side": "left",
      "inset": false,
      "class": {
        "content": "w-full inset-y-0 left-0"
      }
    },
    {
      "transition": true,
      "side": "top",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "right",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "bottom",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "left",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]"
      }
    }
  ]
};
const _sfc_main$a = {
  __name: "USlideover",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: false },
    description: { type: String, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    transition: { type: Boolean, required: false, default: true },
    side: { type: null, required: false, default: "right" },
    inset: { type: Boolean, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    modal: { type: Boolean, required: false, default: true }
  },
  emits: ["after:leave", "after:enter", "close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("slideover", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "modal"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {
        pointerDownOutside
      };
    });
    const ui = computed(() => tv({ extend: tv(theme$8), ...appConfig.ui?.slideover || {} })({
      transition: props.transition,
      side: props.side,
      inset: props.inset
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot_default), mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DialogTrigger_default), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DialogPortal_default), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.overlay) {
                          _push4(ssrRenderComponent(unref(DialogOverlay_default), {
                            "data-slot": "overlay",
                            class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(unref(DialogContent_default), mergeProps({
                          "data-side": __props.side,
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, contentProps.value, {
                          onAfterEnter: ($event) => emits("after:enter"),
                          onAfterLeave: ($event) => emits("after:leave")
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (!__props.title && !slots.title || !__props.description && !slots.description || !!slots.content) {
                                _push5(ssrRenderComponent(unref(VisuallyHidden_default), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      if (!__props.title && !slots.title) {
                                        _push6(ssrRenderComponent(unref(DialogTitle_default), null, null, _parent6, _scopeId5));
                                      } else if (!!slots.content) {
                                        _push6(ssrRenderComponent(unref(DialogTitle_default), null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                                _push7(`${ssrInterpolate(__props.title)}`);
                                              }, _push7, _parent7, _scopeId6);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "title", {}, () => [
                                                  createTextVNode(toDisplayString(__props.title), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      if (!__props.description && !slots.description) {
                                        _push6(ssrRenderComponent(unref(DialogDescription_default), null, null, _parent6, _scopeId5));
                                      } else if (!!slots.content) {
                                        _push6(ssrRenderComponent(unref(DialogDescription_default), null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                                _push7(`${ssrInterpolate(__props.description)}`);
                                              }, _push7, _parent7, _scopeId6);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "description", {}, () => [
                                                  createTextVNode(toDisplayString(__props.description), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                    } else {
                                      return [
                                        !__props.title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "title", {}, () => [
                                              createTextVNode(toDisplayString(__props.title), 1)
                                            ])
                                          ]),
                                          _: 3
                                        })) : createCommentVNode("", true),
                                        !__props.description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "description", {}, () => [
                                              createTextVNode(toDisplayString(__props.description), 1)
                                            ])
                                          ]),
                                          _: 3
                                        })) : createCommentVNode("", true)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              ssrRenderSlot(_ctx.$slots, "content", { close }, () => {
                                if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close)) {
                                  _push5(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: unref(uiProp)?.header }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, "header", { close }, () => {
                                    if (__props.title || !!slots.title || __props.description || !!slots.description) {
                                      _push5(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: unref(uiProp)?.wrapper }))}"${_scopeId4}>`);
                                      if (__props.title || !!slots.title) {
                                        _push5(ssrRenderComponent(unref(DialogTitle_default), {
                                          "data-slot": "title",
                                          class: ui.value.title({ class: unref(uiProp)?.title })
                                        }, {
                                          default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                            if (_push6) {
                                              ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                                _push6(`${ssrInterpolate(__props.title)}`);
                                              }, _push6, _parent6, _scopeId5);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "title", {}, () => [
                                                  createTextVNode(toDisplayString(__props.title), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent5, _scopeId4));
                                      } else {
                                        _push5(`<!---->`);
                                      }
                                      if (__props.description || !!slots.description) {
                                        _push5(ssrRenderComponent(unref(DialogDescription_default), {
                                          "data-slot": "description",
                                          class: ui.value.description({ class: unref(uiProp)?.description })
                                        }, {
                                          default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                            if (_push6) {
                                              ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                                _push6(`${ssrInterpolate(__props.description)}`);
                                              }, _push6, _parent6, _scopeId5);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "description", {}, () => [
                                                  createTextVNode(toDisplayString(__props.description), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent5, _scopeId4));
                                      } else {
                                        _push5(`<!---->`);
                                      }
                                      _push5(`</div>`);
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push5, _parent5, _scopeId4);
                                    if (props.close || !!slots.close) {
                                      _push5(ssrRenderComponent(unref(DialogClose_default), { "as-child": "" }, {
                                        default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                              if (props.close) {
                                                _push6(ssrRenderComponent(_sfc_main$8$1, mergeProps({
                                                  icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                                  color: "neutral",
                                                  variant: "ghost",
                                                  "aria-label": unref(t)("slideover.close")
                                                }, typeof props.close === "object" ? props.close : {}, {
                                                  "data-slot": "close",
                                                  class: ui.value.close({ class: unref(uiProp)?.close })
                                                }), null, _parent6, _scopeId5));
                                              } else {
                                                _push6(`<!---->`);
                                              }
                                            }, _push6, _parent6, _scopeId5);
                                          } else {
                                            return [
                                              renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                                props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                                  key: 0,
                                                  icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                                  color: "neutral",
                                                  variant: "ghost",
                                                  "aria-label": unref(t)("slideover.close")
                                                }, typeof props.close === "object" ? props.close : {}, {
                                                  "data-slot": "close",
                                                  class: ui.value.close({ class: unref(uiProp)?.close })
                                                }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                  }, _push5, _parent5, _scopeId4);
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(uiProp)?.body }))}"${_scopeId4}>`);
                                ssrRenderSlot(_ctx.$slots, "body", { close }, null, _push5, _parent5, _scopeId4);
                                _push5(`</div>`);
                                if (!!slots.footer) {
                                  _push5(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: unref(uiProp)?.footer }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, "footer", { close }, null, _push5, _parent5, _scopeId4);
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                              }, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                                  default: withCtx(() => [
                                    !__props.title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    })) : createCommentVNode("", true),
                                    !__props.description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true),
                                renderSlot(_ctx.$slots, "content", { close }, () => [
                                  !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    "data-slot": "header",
                                    class: ui.value.header({ class: unref(uiProp)?.header })
                                  }, [
                                    renderSlot(_ctx.$slots, "header", { close }, () => [
                                      __props.title || !!slots.title || __props.description || !!slots.description ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        "data-slot": "wrapper",
                                        class: ui.value.wrapper({ class: unref(uiProp)?.wrapper })
                                      }, [
                                        __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                                          key: 0,
                                          "data-slot": "title",
                                          class: ui.value.title({ class: unref(uiProp)?.title })
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "title", {}, () => [
                                              createTextVNode(toDisplayString(__props.title), 1)
                                            ])
                                          ]),
                                          _: 3
                                        }, 8, ["class"])) : createCommentVNode("", true),
                                        __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                                          key: 1,
                                          "data-slot": "description",
                                          class: ui.value.description({ class: unref(uiProp)?.description })
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "description", {}, () => [
                                              createTextVNode(toDisplayString(__props.description), 1)
                                            ])
                                          ]),
                                          _: 3
                                        }, 8, ["class"])) : createCommentVNode("", true)
                                      ], 2)) : createCommentVNode("", true),
                                      renderSlot(_ctx.$slots, "actions"),
                                      props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                                        key: 1,
                                        "as-child": ""
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                            props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                              key: 0,
                                              icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                              color: "neutral",
                                              variant: "ghost",
                                              "aria-label": unref(t)("slideover.close")
                                            }, typeof props.close === "object" ? props.close : {}, {
                                              "data-slot": "close",
                                              class: ui.value.close({ class: unref(uiProp)?.close })
                                            }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ])
                                  ], 2)) : createCommentVNode("", true),
                                  createVNode("div", {
                                    "data-slot": "body",
                                    class: ui.value.body({ class: unref(uiProp)?.body })
                                  }, [
                                    renderSlot(_ctx.$slots, "body", { close })
                                  ], 2),
                                  !!slots.footer ? (openBlock(), createBlock("div", {
                                    key: 1,
                                    "data-slot": "footer",
                                    class: ui.value.footer({ class: unref(uiProp)?.footer })
                                  }, [
                                    renderSlot(_ctx.$slots, "footer", { close })
                                  ], 2)) : createCommentVNode("", true)
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                            key: 0,
                            "data-slot": "overlay",
                            class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                          }, null, 8, ["class"])) : createCommentVNode("", true),
                          createVNode(unref(DialogContent_default), mergeProps({
                            "data-side": __props.side,
                            "data-slot": "content",
                            class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                          }, contentProps.value, {
                            onAfterEnter: ($event) => emits("after:enter"),
                            onAfterLeave: ($event) => emits("after:leave")
                          }, toHandlers(contentEvents.value)), {
                            default: withCtx(() => [
                              !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                                default: withCtx(() => [
                                  !__props.title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  !__props.description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              renderSlot(_ctx.$slots, "content", { close }, () => [
                                !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  "data-slot": "header",
                                  class: ui.value.header({ class: unref(uiProp)?.header })
                                }, [
                                  renderSlot(_ctx.$slots, "header", { close }, () => [
                                    __props.title || !!slots.title || __props.description || !!slots.description ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      "data-slot": "wrapper",
                                      class: ui.value.wrapper({ class: unref(uiProp)?.wrapper })
                                    }, [
                                      __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                                        key: 0,
                                        "data-slot": "title",
                                        class: ui.value.title({ class: unref(uiProp)?.title })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true),
                                      __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                                        key: 1,
                                        "data-slot": "description",
                                        class: ui.value.description({ class: unref(uiProp)?.description })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true)
                                    ], 2)) : createCommentVNode("", true),
                                    renderSlot(_ctx.$slots, "actions"),
                                    props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                                      key: 1,
                                      "as-child": ""
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                          props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                            key: 0,
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("slideover.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            "data-slot": "close",
                                            class: ui.value.close({ class: unref(uiProp)?.close })
                                          }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ])
                                ], 2)) : createCommentVNode("", true),
                                createVNode("div", {
                                  "data-slot": "body",
                                  class: ui.value.body({ class: unref(uiProp)?.body })
                                }, [
                                  renderSlot(_ctx.$slots, "body", { close })
                                ], 2),
                                !!slots.footer ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  "data-slot": "footer",
                                  class: ui.value.footer({ class: unref(uiProp)?.footer })
                                }, [
                                  renderSlot(_ctx.$slots, "footer", { close })
                                ], 2)) : createCommentVNode("", true)
                              ])
                            ]),
                            _: 2
                          }, 1040, ["data-side", "class", "onAfterEnter", "onAfterLeave"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FieldGroupReset), null, {
                      default: withCtx(() => [
                        __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                          key: 0,
                          "data-slot": "overlay",
                          class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                        }, null, 8, ["class"])) : createCommentVNode("", true),
                        createVNode(unref(DialogContent_default), mergeProps({
                          "data-side": __props.side,
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, contentProps.value, {
                          onAfterEnter: ($event) => emits("after:enter"),
                          onAfterLeave: ($event) => emits("after:leave")
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx(() => [
                            !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                              default: withCtx(() => [
                                !__props.title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "title", {}, () => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true),
                                !__props.description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "description", {}, () => [
                                      createTextVNode(toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true)
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            renderSlot(_ctx.$slots, "content", { close }, () => [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                                key: 0,
                                "data-slot": "header",
                                class: ui.value.header({ class: unref(uiProp)?.header })
                              }, [
                                renderSlot(_ctx.$slots, "header", { close }, () => [
                                  __props.title || !!slots.title || __props.description || !!slots.description ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    "data-slot": "wrapper",
                                    class: ui.value.wrapper({ class: unref(uiProp)?.wrapper })
                                  }, [
                                    __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                                      key: 0,
                                      "data-slot": "title",
                                      class: ui.value.title({ class: unref(uiProp)?.title })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                                      key: 1,
                                      "data-slot": "description",
                                      class: ui.value.description({ class: unref(uiProp)?.description })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ], 2)) : createCommentVNode("", true),
                                  renderSlot(_ctx.$slots, "actions"),
                                  props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                                    key: 1,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                        props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                          key: 0,
                                          icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                          color: "neutral",
                                          variant: "ghost",
                                          "aria-label": unref(t)("slideover.close")
                                        }, typeof props.close === "object" ? props.close : {}, {
                                          "data-slot": "close",
                                          class: ui.value.close({ class: unref(uiProp)?.close })
                                        }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ])
                              ], 2)) : createCommentVNode("", true),
                              createVNode("div", {
                                "data-slot": "body",
                                class: ui.value.body({ class: unref(uiProp)?.body })
                              }, [
                                renderSlot(_ctx.$slots, "body", { close })
                              ], 2),
                              !!slots.footer ? (openBlock(), createBlock("div", {
                                key: 1,
                                "data-slot": "footer",
                                class: ui.value.footer({ class: unref(uiProp)?.footer })
                              }, [
                                renderSlot(_ctx.$slots, "footer", { close })
                              ], 2)) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1040, ["data-side", "class", "onAfterEnter", "onAfterLeave"])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DialogTrigger_default), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DialogPortal_default), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                        key: 0,
                        "data-slot": "overlay",
                        class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                      }, null, 8, ["class"])) : createCommentVNode("", true),
                      createVNode(unref(DialogContent_default), mergeProps({
                        "data-side": __props.side,
                        "data-slot": "content",
                        class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                      }, contentProps.value, {
                        onAfterEnter: ($event) => emits("after:enter"),
                        onAfterLeave: ($event) => emits("after:leave")
                      }, toHandlers(contentEvents.value)), {
                        default: withCtx(() => [
                          !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                            default: withCtx(() => [
                              !__props.title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              !__props.description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", { close }, () => [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                              key: 0,
                              "data-slot": "header",
                              class: ui.value.header({ class: unref(uiProp)?.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", { close }, () => [
                                __props.title || !!slots.title || __props.description || !!slots.description ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  "data-slot": "wrapper",
                                  class: ui.value.wrapper({ class: unref(uiProp)?.wrapper })
                                }, [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                                    key: 0,
                                    "data-slot": "title",
                                    class: ui.value.title({ class: unref(uiProp)?.title })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                                    key: 1,
                                    "data-slot": "description",
                                    class: ui.value.description({ class: unref(uiProp)?.description })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ], 2)) : createCommentVNode("", true),
                                renderSlot(_ctx.$slots, "actions"),
                                props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                                  key: 1,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                      props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                        key: 0,
                                        icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                        color: "neutral",
                                        variant: "ghost",
                                        "aria-label": unref(t)("slideover.close")
                                      }, typeof props.close === "object" ? props.close : {}, {
                                        "data-slot": "close",
                                        class: ui.value.close({ class: unref(uiProp)?.close })
                                      }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true)
                              ])
                            ], 2)) : createCommentVNode("", true),
                            createVNode("div", {
                              "data-slot": "body",
                              class: ui.value.body({ class: unref(uiProp)?.body })
                            }, [
                              renderSlot(_ctx.$slots, "body", { close })
                            ], 2),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 1,
                              "data-slot": "footer",
                              class: ui.value.footer({ class: unref(uiProp)?.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer", { close })
                            ], 2)) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 2
                      }, 1040, ["data-side", "class", "onAfterEnter", "onAfterLeave"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const theme$7 = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default ring ring-default flex focus:outline-none",
    "handle": [
      "shrink-0 !bg-accented",
      "transition-opacity"
    ],
    "container": "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    "header": "",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "body": "flex-1",
    "footer": "flex flex-col gap-1.5"
  },
  "variants": {
    "direction": {
      "top": {
        "content": "mb-24 flex-col-reverse",
        "handle": "mb-4"
      },
      "right": {
        "content": "flex-row rtl:flex-row-reverse",
        "handle": "!ml-4"
      },
      "bottom": {
        "content": "mt-24 flex-col",
        "handle": "mt-4"
      },
      "left": {
        "content": "flex-row-reverse rtl:flex-row",
        "handle": "!mr-4"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    },
    "snapPoints": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "direction": [
        "top",
        "bottom"
      ],
      "class": {
        "content": "h-auto max-h-[96%]",
        "handle": "!w-12 !h-1.5 mx-auto"
      }
    },
    {
      "direction": [
        "top",
        "bottom"
      ],
      "snapPoints": true,
      "class": {
        "content": "h-full"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "class": {
        "content": "w-auto max-w-[calc(100%-2rem)]",
        "handle": "!h-12 !w-1.5 mt-auto mb-auto"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "snapPoints": true,
      "class": {
        "content": "w-full"
      }
    },
    {
      "direction": "top",
      "inset": true,
      "class": {
        "content": "inset-x-4 top-4"
      }
    },
    {
      "direction": "top",
      "inset": false,
      "class": {
        "content": "inset-x-0 top-0 rounded-b-lg"
      }
    },
    {
      "direction": "bottom",
      "inset": true,
      "class": {
        "content": "inset-x-4 bottom-4"
      }
    },
    {
      "direction": "bottom",
      "inset": false,
      "class": {
        "content": "inset-x-0 bottom-0 rounded-t-lg"
      }
    },
    {
      "direction": "left",
      "inset": true,
      "class": {
        "content": "inset-y-4 left-4"
      }
    },
    {
      "direction": "left",
      "inset": false,
      "class": {
        "content": "inset-y-0 left-0 rounded-r-lg"
      }
    },
    {
      "direction": "right",
      "inset": true,
      "class": {
        "content": "inset-y-4 right-4"
      }
    },
    {
      "direction": "right",
      "inset": false,
      "class": {
        "content": "inset-y-0 right-0 rounded-l-lg"
      }
    }
  ]
};
const _sfc_main$9 = {
  __name: "UDrawer",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    inset: { type: Boolean, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    handle: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    nested: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    activeSnapPoint: { type: [Number, String, null], required: false },
    closeThreshold: { type: Number, required: false },
    shouldScaleBackground: { type: Boolean, required: false },
    setBackgroundColorOnScale: { type: Boolean, required: false },
    scrollLockTimeout: { type: Number, required: false },
    fixed: { type: Boolean, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    modal: { type: Boolean, required: false, default: true },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    direction: { type: String, required: false, default: "bottom" },
    noBodyStyles: { type: Boolean, required: false },
    handleOnly: { type: Boolean, required: false },
    preventScrollRestoration: { type: Boolean, required: false },
    snapPoints: { type: Array, required: false }
  },
  emits: ["close:prevent", "drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("drawer", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {
        pointerDownOutside
      };
    });
    const ui = computed(() => tv({ extend: tv(theme$7), ...appConfig.ui?.drawer || {} })({
      direction: props.direction,
      inset: props.inset,
      snapPoints: props.snapPoints && props.snapPoints.length > 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.nested ? unref(DrawerRootNested) : unref(DrawerRoot)), mergeProps(unref(rootProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DrawerTrigger), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default")
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DrawerPortal), unref(portalProps), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.overlay) {
                          _push4(ssrRenderComponent(unref(DrawerOverlay), {
                            "data-slot": "overlay",
                            class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(unref(DrawerContent), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, contentProps.value, toHandlers(contentEvents.value)), {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (__props.handle) {
                                _push5(ssrRenderComponent(unref(DrawerHandle), {
                                  "data-slot": "handle",
                                  class: ui.value.handle({ class: unref(uiProp)?.handle })
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              if (!__props.title && !slots.title || !__props.description && !slots.description || !!slots.content) {
                                _push5(ssrRenderComponent(unref(VisuallyHidden_default), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      if (!__props.title && !slots.title) {
                                        _push6(ssrRenderComponent(unref(DrawerTitle), null, null, _parent6, _scopeId5));
                                      } else if (!!slots.content) {
                                        _push6(ssrRenderComponent(unref(DrawerTitle), null, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                                _push7(`${ssrInterpolate(__props.title)}`);
                                              }, _push7, _parent7, _scopeId6);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "title", {}, () => [
                                                  createTextVNode(toDisplayString(__props.title), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 3
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      if (!__props.description && !slots.description) {
                                        _push6(ssrRenderComponent(unref(DrawerDescription), null, null, _parent6, _scopeId5));
                                      } else if (!!slots.content) {
                                        _push6(ssrRenderComponent(unref(DrawerDescription), null, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                                _push7(`${ssrInterpolate(__props.description)}`);
                                              }, _push7, _parent7, _scopeId6);
                                            } else {
                                              return [
                                                renderSlot(_ctx.$slots, "description", {}, () => [
                                                  createTextVNode(toDisplayString(__props.description), 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 3
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                    } else {
                                      return [
                                        !__props.title && !slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerTitle), { key: 1 }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "title", {}, () => [
                                              createTextVNode(toDisplayString(__props.title), 1)
                                            ])
                                          ]),
                                          _: 3
                                        })) : createCommentVNode("", true),
                                        !__props.description && !slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerDescription), { key: 3 }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "description", {}, () => [
                                              createTextVNode(toDisplayString(__props.description), 1)
                                            ])
                                          ]),
                                          _: 3
                                        })) : createCommentVNode("", true)
                                      ];
                                    }
                                  }),
                                  _: 3
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                                _push5(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: unref(uiProp)?.container }))}"${_scopeId4}>`);
                                if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description)) {
                                  _push5(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: unref(uiProp)?.header }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, "header", {}, () => {
                                    if (__props.title || !!slots.title) {
                                      _push5(ssrRenderComponent(unref(DrawerTitle), {
                                        "data-slot": "title",
                                        class: ui.value.title({ class: unref(uiProp)?.title })
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                              _push6(`${ssrInterpolate(__props.title)}`);
                                            }, _push6, _parent6, _scopeId5);
                                          } else {
                                            return [
                                              renderSlot(_ctx.$slots, "title", {}, () => [
                                                createTextVNode(toDisplayString(__props.title), 1)
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 3
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    if (__props.description || !!slots.description) {
                                      _push5(ssrRenderComponent(unref(DrawerDescription), {
                                        "data-slot": "description",
                                        class: ui.value.description({ class: unref(uiProp)?.description })
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                              _push6(`${ssrInterpolate(__props.description)}`);
                                            }, _push6, _parent6, _scopeId5);
                                          } else {
                                            return [
                                              renderSlot(_ctx.$slots, "description", {}, () => [
                                                createTextVNode(toDisplayString(__props.description), 1)
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 3
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                  }, _push5, _parent5, _scopeId4);
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (!!slots.body) {
                                  _push5(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(uiProp)?.body }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, "body", {}, null, _push5, _parent5, _scopeId4);
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (!!slots.footer) {
                                  _push5(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: unref(uiProp)?.footer }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push5, _parent5, _scopeId4);
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div>`);
                              }, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                                  key: 0,
                                  "data-slot": "handle",
                                  class: ui.value.handle({ class: unref(uiProp)?.handle })
                                }, null, 8, ["class"])) : createCommentVNode("", true),
                                !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 1 }, {
                                  default: withCtx(() => [
                                    !__props.title && !slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerTitle), { key: 1 }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    })) : createCommentVNode("", true),
                                    !__props.description && !slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerDescription), { key: 3 }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true),
                                renderSlot(_ctx.$slots, "content", {}, () => [
                                  createVNode("div", {
                                    "data-slot": "container",
                                    class: ui.value.container({ class: unref(uiProp)?.container })
                                  }, [
                                    !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      "data-slot": "header",
                                      class: ui.value.header({ class: unref(uiProp)?.header })
                                    }, [
                                      renderSlot(_ctx.$slots, "header", {}, () => [
                                        __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                          key: 0,
                                          "data-slot": "title",
                                          class: ui.value.title({ class: unref(uiProp)?.title })
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "title", {}, () => [
                                              createTextVNode(toDisplayString(__props.title), 1)
                                            ])
                                          ]),
                                          _: 3
                                        }, 8, ["class"])) : createCommentVNode("", true),
                                        __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                          key: 1,
                                          "data-slot": "description",
                                          class: ui.value.description({ class: unref(uiProp)?.description })
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "description", {}, () => [
                                              createTextVNode(toDisplayString(__props.description), 1)
                                            ])
                                          ]),
                                          _: 3
                                        }, 8, ["class"])) : createCommentVNode("", true)
                                      ])
                                    ], 2)) : createCommentVNode("", true),
                                    !!slots.body ? (openBlock(), createBlock("div", {
                                      key: 1,
                                      "data-slot": "body",
                                      class: ui.value.body({ class: unref(uiProp)?.body })
                                    }, [
                                      renderSlot(_ctx.$slots, "body")
                                    ], 2)) : createCommentVNode("", true),
                                    !!slots.footer ? (openBlock(), createBlock("div", {
                                      key: 2,
                                      "data-slot": "footer",
                                      class: ui.value.footer({ class: unref(uiProp)?.footer })
                                    }, [
                                      renderSlot(_ctx.$slots, "footer")
                                    ], 2)) : createCommentVNode("", true)
                                  ], 2)
                                ])
                              ];
                            }
                          }),
                          _: 3
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                            key: 0,
                            "data-slot": "overlay",
                            class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                          }, null, 8, ["class"])) : createCommentVNode("", true),
                          createVNode(unref(DrawerContent), mergeProps({
                            "data-slot": "content",
                            class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                          }, contentProps.value, toHandlers(contentEvents.value)), {
                            default: withCtx(() => [
                              __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                                key: 0,
                                "data-slot": "handle",
                                class: ui.value.handle({ class: unref(uiProp)?.handle })
                              }, null, 8, ["class"])) : createCommentVNode("", true),
                              !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 1 }, {
                                default: withCtx(() => [
                                  !__props.title && !slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerTitle), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  !__props.description && !slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerDescription), { key: 3 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              renderSlot(_ctx.$slots, "content", {}, () => [
                                createVNode("div", {
                                  "data-slot": "container",
                                  class: ui.value.container({ class: unref(uiProp)?.container })
                                }, [
                                  !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    "data-slot": "header",
                                    class: ui.value.header({ class: unref(uiProp)?.header })
                                  }, [
                                    renderSlot(_ctx.$slots, "header", {}, () => [
                                      __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                        key: 0,
                                        "data-slot": "title",
                                        class: ui.value.title({ class: unref(uiProp)?.title })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true),
                                      __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                        key: 1,
                                        "data-slot": "description",
                                        class: ui.value.description({ class: unref(uiProp)?.description })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true)
                                    ])
                                  ], 2)) : createCommentVNode("", true),
                                  !!slots.body ? (openBlock(), createBlock("div", {
                                    key: 1,
                                    "data-slot": "body",
                                    class: ui.value.body({ class: unref(uiProp)?.body })
                                  }, [
                                    renderSlot(_ctx.$slots, "body")
                                  ], 2)) : createCommentVNode("", true),
                                  !!slots.footer ? (openBlock(), createBlock("div", {
                                    key: 2,
                                    "data-slot": "footer",
                                    class: ui.value.footer({ class: unref(uiProp)?.footer })
                                  }, [
                                    renderSlot(_ctx.$slots, "footer")
                                  ], 2)) : createCommentVNode("", true)
                                ], 2)
                              ])
                            ]),
                            _: 3
                          }, 16, ["class"])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FieldGroupReset), null, {
                      default: withCtx(() => [
                        __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                          key: 0,
                          "data-slot": "overlay",
                          class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                        }, null, 8, ["class"])) : createCommentVNode("", true),
                        createVNode(unref(DrawerContent), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, contentProps.value, toHandlers(contentEvents.value)), {
                          default: withCtx(() => [
                            __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                              key: 0,
                              "data-slot": "handle",
                              class: ui.value.handle({ class: unref(uiProp)?.handle })
                            }, null, 8, ["class"])) : createCommentVNode("", true),
                            !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 1 }, {
                              default: withCtx(() => [
                                !__props.title && !slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerTitle), { key: 1 }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "title", {}, () => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true),
                                !__props.description && !slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerDescription), { key: 3 }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "description", {}, () => [
                                      createTextVNode(toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                })) : createCommentVNode("", true)
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            renderSlot(_ctx.$slots, "content", {}, () => [
                              createVNode("div", {
                                "data-slot": "container",
                                class: ui.value.container({ class: unref(uiProp)?.container })
                              }, [
                                !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  "data-slot": "header",
                                  class: ui.value.header({ class: unref(uiProp)?.header })
                                }, [
                                  renderSlot(_ctx.$slots, "header", {}, () => [
                                    __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                      key: 0,
                                      "data-slot": "title",
                                      class: ui.value.title({ class: unref(uiProp)?.title })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                      key: 1,
                                      "data-slot": "description",
                                      class: ui.value.description({ class: unref(uiProp)?.description })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ])
                                ], 2)) : createCommentVNode("", true),
                                !!slots.body ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  "data-slot": "body",
                                  class: ui.value.body({ class: unref(uiProp)?.body })
                                }, [
                                  renderSlot(_ctx.$slots, "body")
                                ], 2)) : createCommentVNode("", true),
                                !!slots.footer ? (openBlock(), createBlock("div", {
                                  key: 2,
                                  "data-slot": "footer",
                                  class: ui.value.footer({ class: unref(uiProp)?.footer })
                                }, [
                                  renderSlot(_ctx.$slots, "footer")
                                ], 2)) : createCommentVNode("", true)
                              ], 2)
                            ])
                          ]),
                          _: 3
                        }, 16, ["class"])
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DrawerTrigger), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DrawerPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                        key: 0,
                        "data-slot": "overlay",
                        class: ui.value.overlay({ class: unref(uiProp)?.overlay })
                      }, null, 8, ["class"])) : createCommentVNode("", true),
                      createVNode(unref(DrawerContent), mergeProps({
                        "data-slot": "content",
                        class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                      }, contentProps.value, toHandlers(contentEvents.value)), {
                        default: withCtx(() => [
                          __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                            key: 0,
                            "data-slot": "handle",
                            class: ui.value.handle({ class: unref(uiProp)?.handle })
                          }, null, 8, ["class"])) : createCommentVNode("", true),
                          !__props.title && !slots.title || !__props.description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 1 }, {
                            default: withCtx(() => [
                              !__props.title && !slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerTitle), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              !__props.description && !slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DrawerDescription), { key: 3 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", {}, () => [
                            createVNode("div", {
                              "data-slot": "container",
                              class: ui.value.container({ class: unref(uiProp)?.container })
                            }, [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                key: 0,
                                "data-slot": "header",
                                class: ui.value.header({ class: unref(uiProp)?.header })
                              }, [
                                renderSlot(_ctx.$slots, "header", {}, () => [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                    key: 0,
                                    "data-slot": "title",
                                    class: ui.value.title({ class: unref(uiProp)?.title })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                    key: 1,
                                    "data-slot": "description",
                                    class: ui.value.description({ class: unref(uiProp)?.description })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ])
                              ], 2)) : createCommentVNode("", true),
                              !!slots.body ? (openBlock(), createBlock("div", {
                                key: 1,
                                "data-slot": "body",
                                class: ui.value.body({ class: unref(uiProp)?.body })
                              }, [
                                renderSlot(_ctx.$slots, "body")
                              ], 2)) : createCommentVNode("", true),
                              !!slots.footer ? (openBlock(), createBlock("div", {
                                key: 2,
                                "data-slot": "footer",
                                class: ui.value.footer({ class: unref(uiProp)?.footer })
                              }, [
                                renderSlot(_ctx.$slots, "footer")
                              ], 2)) : createCommentVNode("", true)
                            ], 2)
                          ])
                        ]),
                        _: 3
                      }, 16, ["class"])
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const theme$6 = {
  "slots": {
    "root": "relative hidden lg:flex flex-col min-h-svh min-w-16 w-(--width) shrink-0",
    "header": "h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-4",
    "body": "flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2",
    "footer": "shrink-0 flex items-center gap-1.5 px-4 py-2",
    "toggle": "",
    "handle": "",
    "content": "lg:hidden",
    "overlay": "lg:hidden"
  },
  "variants": {
    "menu": {
      "true": {
        "header": "sm:px-6",
        "body": "sm:px-6",
        "footer": "sm:px-6"
      }
    },
    "side": {
      "left": {
        "root": "border-e border-default"
      },
      "right": {
        "root": ""
      }
    },
    "toggleSide": {
      "left": {
        "toggle": ""
      },
      "right": {
        "toggle": "ms-auto"
      }
    }
  }
};
function useRuntimeHook(name, fn) {
  const nuxtApp = useNuxtApp();
  const unregister = nuxtApp.hook(name, fn);
  onScopeDispose(unregister);
}
const _sfc_main$8 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UDashboardSidebar",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    mode: { type: null, required: false, default: "slideover" },
    menu: { type: null, required: false },
    toggle: { type: [Boolean, Object], required: false, default: true },
    toggleSide: { type: String, required: false, default: "left" },
    autoClose: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    id: { type: String, required: false },
    side: { type: String, required: false, default: "left" },
    minSize: { type: Number, required: false, default: 10 },
    maxSize: { type: Number, required: false, default: 20 },
    defaultSize: { type: Number, required: false, default: 15 },
    resizable: { type: Boolean, required: false, default: false },
    collapsible: { type: Boolean, required: false, default: false },
    collapsedSize: { type: Number, required: false, default: 0 }
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {},
    "collapsed": { type: Boolean, ...{ default: false } },
    "collapsedModifiers": {}
  }),
  emits: ["update:open", "update:collapsed"],
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const open = useModel(__props, "open", { type: Boolean, ...{ default: false } });
    const collapsed = useModel(__props, "collapsed", { type: Boolean, ...{ default: false } });
    const route = useRoute();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardSidebar", props);
    const dashboardContext = useDashboard({
      storageKey: "dashboard",
      unit: "%",
      sidebarOpen: ref(false),
      sidebarCollapsed: ref(false)
    });
    const id = `${dashboardContext.storageKey}-sidebar-${props.id || useId()}`;
    const { el, size, collapse, isCollapsed, isDragging, onMouseDown, onTouchStart, onDoubleClick } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })), { collapsed });
    const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
    const [DefineResizeHandleTemplate, ReuseResizeHandleTemplate] = createReusableTemplate();
    useRuntimeHook("dashboard:sidebar:toggle", () => {
      open.value = !open.value;
    });
    useRuntimeHook("dashboard:sidebar:collapse", (value) => {
      isCollapsed.value = value;
    });
    watch(open, () => dashboardContext.sidebarOpen.value = open.value, { immediate: true });
    watch(isCollapsed, () => dashboardContext.sidebarCollapsed.value = isCollapsed.value, { immediate: true });
    watch(() => route.fullPath, () => {
      if (!props.autoClose) return;
      open.value = false;
    });
    const ui = computed(() => tv({ extend: tv(theme$6), ...appConfig.ui?.dashboardSidebar || {} })({
      side: props.side
    }));
    const Menu = computed(() => ({
      slideover: _sfc_main$a,
      modal: _sfc_main$c,
      drawer: _sfc_main$9
    })[props.mode]);
    const menuProps = toRef(() => defu(props.menu, {}, props.mode === "modal" ? { fullscreen: true, transition: false } : props.mode === "slideover" ? { side: "left" } : {}));
    function toggleOpen() {
      open.value = !open.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineToggleTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "toggle", {
              open: open.value,
              toggle: toggleOpen,
              ui: ui.value
            }, () => {
              if (__props.toggle) {
                _push2(ssrRenderComponent(_sfc_main$e, mergeProps(typeof __props.toggle === "object" ? __props.toggle : {}, {
                  side: __props.toggleSide,
                  "data-slot": "toggle",
                  class: ui.value.toggle({ class: unref(uiProp)?.toggle, toggleSide: __props.toggleSide })
                }), null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "toggle", {
                open: open.value,
                toggle: toggleOpen,
                ui: ui.value
              }, () => [
                __props.toggle ? (openBlock(), createBlock(_sfc_main$e, mergeProps({ key: 0 }, typeof __props.toggle === "object" ? __props.toggle : {}, {
                  side: __props.toggleSide,
                  "data-slot": "toggle",
                  class: ui.value.toggle({ class: unref(uiProp)?.toggle, toggleSide: __props.toggleSide })
                }), null, 16, ["side", "class"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineResizeHandleTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "resize-handle", {
              onMouseDown: unref(onMouseDown),
              onTouchStart: unref(onTouchStart),
              onDoubleClick: unref(onDoubleClick),
              ui: ui.value
            }, () => {
              if (__props.resizable) {
                _push2(ssrRenderComponent(_sfc_main$1$1, {
                  "aria-controls": id,
                  "data-slot": "handle",
                  class: ui.value.handle({ class: unref(uiProp)?.handle }),
                  onMousedown: unref(onMouseDown),
                  onTouchstart: unref(onTouchStart),
                  onDblclick: unref(onDoubleClick)
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "resize-handle", {
                onMouseDown: unref(onMouseDown),
                onTouchStart: unref(onTouchStart),
                onDoubleClick: unref(onDoubleClick),
                ui: ui.value
              }, () => [
                __props.resizable ? (openBlock(), createBlock(_sfc_main$1$1, {
                  key: 0,
                  "aria-controls": id,
                  "data-slot": "handle",
                  class: ui.value.handle({ class: unref(uiProp)?.handle }),
                  onMousedown: unref(onMouseDown),
                  onTouchstart: unref(onTouchStart),
                  onDblclick: unref(onDoubleClick)
                }, null, 8, ["class", "onMousedown", "onTouchstart", "onDblclick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      if (__props.side === "right") {
        _push(ssrRenderComponent(unref(ReuseResizeHandleTemplate), null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div${ssrRenderAttrs(mergeProps({
        id,
        ref_key: "el",
        ref: el
      }, _ctx.$attrs, {
        "data-collapsed": unref(isCollapsed),
        "data-dragging": unref(isDragging),
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] }),
        style: { "--width": `${unref(size) || 0}${unref(dashboardContext).unit}` }
      }))}>`);
      if (!!slots.header) {
        _push(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: unref(uiProp)?.header }))}">`);
        ssrRenderSlot(_ctx.$slots, "header", {
          collapsed: unref(isCollapsed),
          collapse: unref(collapse)
        }, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(uiProp)?.body }))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {
        collapsed: unref(isCollapsed),
        collapse: unref(collapse)
      }, null, _push, _parent);
      _push(`</div>`);
      if (!!slots.footer) {
        _push(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: unref(uiProp)?.footer }))}">`);
        ssrRenderSlot(_ctx.$slots, "footer", {
          collapsed: unref(isCollapsed),
          collapse: unref(collapse)
        }, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.side === "left") {
        _push(ssrRenderComponent(unref(ReuseResizeHandleTemplate), null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Menu), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: unref(t)("dashboardSidebar.title"),
        description: unref(t)("dashboardSidebar.description")
      }, menuProps.value, {
        ui: {
          overlay: ui.value.overlay({ class: unref(uiProp)?.overlay }),
          content: ui.value.content({ class: unref(uiProp)?.content })
        }
      }), {
        content: withCtx((contentData, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "content", contentData, () => {
              if (!!slots.header || __props.mode !== "drawer") {
                _push2(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: unref(uiProp)?.header, menu: true }))}"${_scopeId}>`);
                if (__props.mode !== "drawer" && __props.toggleSide === "left") {
                  _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                ssrRenderSlot(_ctx.$slots, "header", {
                  collapsed: false,
                  collapse: () => {
                  }
                }, null, _push2, _parent2, _scopeId);
                if (__props.mode !== "drawer" && __props.toggleSide === "right") {
                  _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(uiProp)?.body, menu: true }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "default", {
                collapsed: false,
                collapse: () => {
                }
              }, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
              if (!!slots.footer) {
                _push2(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: unref(uiProp)?.footer, menu: true }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "footer", {
                  collapsed: false,
                  collapse: () => {
                  }
                }, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "content", contentData, () => [
                !!slots.header || __props.mode !== "drawer" ? (openBlock(), createBlock("div", {
                  key: 0,
                  "data-slot": "header",
                  class: ui.value.header({ class: unref(uiProp)?.header, menu: true })
                }, [
                  __props.mode !== "drawer" && __props.toggleSide === "left" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 0 })) : createCommentVNode("", true),
                  renderSlot(_ctx.$slots, "header", {
                    collapsed: false,
                    collapse: () => {
                    }
                  }),
                  __props.mode !== "drawer" && __props.toggleSide === "right" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 1 })) : createCommentVNode("", true)
                ], 2)) : createCommentVNode("", true),
                createVNode("div", {
                  "data-slot": "body",
                  class: ui.value.body({ class: unref(uiProp)?.body, menu: true })
                }, [
                  renderSlot(_ctx.$slots, "default", {
                    collapsed: false,
                    collapse: () => {
                    }
                  })
                ], 2),
                !!slots.footer ? (openBlock(), createBlock("div", {
                  key: 1,
                  "data-slot": "footer",
                  class: ui.value.footer({ class: unref(uiProp)?.footer, menu: true })
                }, [
                  renderSlot(_ctx.$slots, "footer", {
                    collapsed: false,
                    collapse: () => {
                    }
                  })
                ], 2)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardSidebar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const theme$5 = {
  "slots": {
    "content": "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
    "arrow": "fill-bg stroke-default",
    "text": "truncate",
    "kbds": "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
    "kbdsSize": "sm"
  }
};
const _sfc_main$7 = {
  __name: "UTooltip",
  __ssrInlineRender: true,
  props: {
    text: { type: String, required: false },
    kbds: { type: Array, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    delayDuration: { type: Number, required: false },
    disableHoverableContent: { type: Boolean, required: false },
    disableClosingTrigger: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    ignoreNonKeyboardFocus: { type: Boolean, required: false }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("tooltip", props);
    const providerContext = injectTooltipProviderContext();
    const rootProps = useForwardPropsEmits(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, providerContext.content.value, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const ui = computed(() => tv({ extend: tv(theme$5), ...appConfig.ui?.tooltip || {} })({
      side: contentProps.value.side
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot_default), mergeProps(unref(rootProps), {
        disabled: !(__props.text || __props.kbds?.length || !!slots.content) || props.disabled
      }, _attrs), {
        default: withCtx(({ open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(ssrRenderComponent(unref(TooltipTrigger_default), mergeProps(_ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(TooltipPortal_default), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(TooltipContent_default), mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "content", { ui: ui.value }, () => {
                                if (__props.text) {
                                  _push5(`<span data-slot="text" class="${ssrRenderClass(ui.value.text({ class: unref(uiProp)?.text }))}"${_scopeId4}>${ssrInterpolate(__props.text)}</span>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.kbds?.length) {
                                  _push5(`<span data-slot="kbds" class="${ssrRenderClass(ui.value.kbds({ class: unref(uiProp)?.kbds }))}"${_scopeId4}><!--[-->`);
                                  ssrRenderList(__props.kbds, (kbd, index) => {
                                    _push5(ssrRenderComponent(_sfc_main$4$1, mergeProps({
                                      key: index,
                                      size: unref(uiProp)?.kbdsSize || ui.value.kbdsSize()
                                    }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]--></span>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                              }, _push5, _parent5, _scopeId4);
                              if (!!__props.arrow) {
                                _push5(ssrRenderComponent(unref(TooltipArrow_default), mergeProps(arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                                  __props.text ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "data-slot": "text",
                                    class: ui.value.text({ class: unref(uiProp)?.text })
                                  }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                                  __props.kbds?.length ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    "data-slot": "kbds",
                                    class: ui.value.kbds({ class: unref(uiProp)?.kbds })
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                                      return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                        key: index,
                                        size: unref(uiProp)?.kbdsSize || ui.value.kbdsSize()
                                      }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                    }), 128))
                                  ], 2)) : createCommentVNode("", true)
                                ]),
                                !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, 16, ["class"])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(TooltipContent_default), mergeProps(contentProps.value, {
                            "data-slot": "content",
                            class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                          }), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                                __props.text ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "data-slot": "text",
                                  class: ui.value.text({ class: unref(uiProp)?.text })
                                }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                                __props.kbds?.length ? (openBlock(), createBlock("span", {
                                  key: 1,
                                  "data-slot": "kbds",
                                  class: ui.value.kbds({ class: unref(uiProp)?.kbds })
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                                    return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                      key: index,
                                      size: unref(uiProp)?.kbdsSize || ui.value.kbdsSize()
                                    }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                  }), 128))
                                ], 2)) : createCommentVNode("", true)
                              ]),
                              !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                                "data-slot": "arrow",
                                class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                              }), null, 16, ["class"])) : createCommentVNode("", true)
                            ]),
                            _: 3
                          }, 16, ["class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FieldGroupReset), null, {
                      default: withCtx(() => [
                        createVNode(unref(TooltipContent_default), mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                              __props.text ? (openBlock(), createBlock("span", {
                                key: 0,
                                "data-slot": "text",
                                class: ui.value.text({ class: unref(uiProp)?.text })
                              }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                              __props.kbds?.length ? (openBlock(), createBlock("span", {
                                key: 1,
                                "data-slot": "kbds",
                                class: ui.value.kbds({ class: unref(uiProp)?.kbds })
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                                  return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                    key: index,
                                    size: unref(uiProp)?.kbdsSize || ui.value.kbdsSize()
                                  }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                }), 128))
                              ], 2)) : createCommentVNode("", true)
                            ]),
                            !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                              "data-slot": "arrow",
                              class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                            }), null, 16, ["class"])) : createCommentVNode("", true)
                          ]),
                          _: 3
                        }, 16, ["class"])
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (openBlock(), createBlock(unref(TooltipTrigger_default), mergeProps({ key: 0 }, _ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1040, ["reference", "class"])) : createCommentVNode("", true),
              createVNode(unref(TooltipPortal_default), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      createVNode(unref(TooltipContent_default), mergeProps(contentProps.value, {
                        "data-slot": "content",
                        class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                      }), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                            __props.text ? (openBlock(), createBlock("span", {
                              key: 0,
                              "data-slot": "text",
                              class: ui.value.text({ class: unref(uiProp)?.text })
                            }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                            __props.kbds?.length ? (openBlock(), createBlock("span", {
                              key: 1,
                              "data-slot": "kbds",
                              class: ui.value.kbds({ class: unref(uiProp)?.kbds })
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                                return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                  key: index,
                                  size: unref(uiProp)?.kbdsSize || ui.value.kbdsSize()
                                }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                              }), 128))
                            ], 2)) : createCommentVNode("", true)
                          ]),
                          !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ]),
                        _: 3
                      }, 16, ["class"])
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const theme$4 = {
  "slots": {
    "base": "",
    "label": "",
    "trailing": "hidden lg:flex items-center gap-0.5 ms-auto"
  },
  "variants": {
    "collapsed": {
      "true": {
        "label": "hidden",
        "trailing": "lg:hidden"
      }
    }
  }
};
const _sfc_main$6 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UDashboardSearchButton",
  __ssrInlineRender: true,
  props: {
    icon: { type: null, required: false },
    label: { type: String, required: false },
    color: { type: null, required: false, default: "neutral" },
    variant: { type: null, required: false },
    collapsed: { type: Boolean, required: false, default: false },
    tooltip: { type: [Boolean, Object], required: false, default: false },
    kbds: { type: Array, required: false, default: () => ["meta", "k"] },
    ui: { type: Object, required: false },
    class: { type: null, required: false },
    activeColor: { type: null, required: false },
    activeVariant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    block: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    as: { type: null, required: false },
    type: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    exactActiveClass: { type: String, required: false },
    viewTransition: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate();
    const getProxySlots = () => omit(slots, ["trailing"]);
    const buttonProps = useForwardProps(reactiveOmit(props, "icon", "label", "variant", "collapsed", "tooltip", "kbds", "class", "ui"));
    const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { delayDuration: 0, content: { side: "right" } }));
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardSearchButton", props);
    const { toggleSearch } = useDashboard({ toggleSearch: () => {
    } });
    const ui = computed(() => tv({ extend: tv(theme$4), ...appConfig.ui?.dashboardSearchButton || {} })({
      collapsed: props.collapsed
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineButtonTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$8$1, mergeProps({
              icon: __props.icon || unref(appConfig).ui.icons.search,
              label: __props.label || unref(t)("dashboardSearchButton.label"),
              variant: __props.variant || (__props.collapsed ? "ghost" : "outline")
            }, {
              ...unref(buttonProps),
              ...__props.collapsed ? {
                "square": true,
                "aria-label": __props.label || unref(t)("dashboardSearchButton.label")
              } : {},
              ..._ctx.$attrs
            }, {
              class: ui.value.base({ class: [unref(uiProp)?.base, props.class] }),
              ui: unref(transformUI)(ui.value, unref(uiProp)),
              onClick: unref(toggleSearch)
            }), createSlots({
              trailing: withCtx(({ ui: uiProxy }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(uiProp)?.trailing }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "trailing", { ui: uiProxy }, () => {
                    if (__props.kbds?.length) {
                      _push3(`<!--[-->`);
                      ssrRenderList(__props.kbds, (kbd, index) => {
                        _push3(ssrRenderComponent(_sfc_main$4$1, mergeProps({
                          key: index,
                          variant: "subtle"
                        }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent3, _scopeId2));
                      });
                      _push3(`<!--]-->`);
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</span>`);
                } else {
                  return [
                    createVNode("span", {
                      "data-slot": "trailing",
                      class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                    }, [
                      renderSlot(_ctx.$slots, "trailing", { ui: uiProxy }, () => [
                        __props.kbds?.length ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(__props.kbds, (kbd, index) => {
                          return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                            key: index,
                            variant: "subtle"
                          }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16);
                        }), 128)) : createCommentVNode("", true)
                      ])
                    ], 2)
                  ];
                }
              }),
              _: 2
            }, [
              renderList(getProxySlots(), (_2, name) => {
                return {
                  name,
                  fn: withCtx((slotData, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, name, slotData, null, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, name, slotData)
                      ];
                    }
                  })
                };
              })
            ]), _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$8$1, mergeProps({
                icon: __props.icon || unref(appConfig).ui.icons.search,
                label: __props.label || unref(t)("dashboardSearchButton.label"),
                variant: __props.variant || (__props.collapsed ? "ghost" : "outline")
              }, {
                ...unref(buttonProps),
                ...__props.collapsed ? {
                  "square": true,
                  "aria-label": __props.label || unref(t)("dashboardSearchButton.label")
                } : {},
                ..._ctx.$attrs
              }, {
                class: ui.value.base({ class: [unref(uiProp)?.base, props.class] }),
                ui: unref(transformUI)(ui.value, unref(uiProp)),
                onClick: unref(toggleSearch)
              }), createSlots({
                trailing: withCtx(({ ui: uiProxy }) => [
                  createVNode("span", {
                    "data-slot": "trailing",
                    class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                  }, [
                    renderSlot(_ctx.$slots, "trailing", { ui: uiProxy }, () => [
                      __props.kbds?.length ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(__props.kbds, (kbd, index) => {
                        return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                          key: index,
                          variant: "subtle"
                        }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16);
                      }), 128)) : createCommentVNode("", true)
                    ])
                  ], 2)
                ]),
                _: 2
              }, [
                renderList(getProxySlots(), (_2, name) => {
                  return {
                    name,
                    fn: withCtx((slotData) => [
                      renderSlot(_ctx.$slots, name, slotData)
                    ])
                  };
                })
              ]), 1040, ["icon", "label", "variant", "class", "ui", "onClick"])
            ];
          }
        }),
        _: 3
      }, _parent));
      if (__props.collapsed && __props.tooltip) {
        _push(ssrRenderComponent(_sfc_main$7, mergeProps({
          text: __props.label || unref(t)("dashboardSearchButton.label")
        }, tooltipProps.value), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ReuseButtonTemplate), null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ReuseButtonTemplate))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(unref(ReuseButtonTemplate), null, null, _parent));
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardSearchButton.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const theme$3 = {
  "slots": {
    "content": "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    "arrow": "fill-bg stroke-default"
  }
};
const _sfc_main$5 = {
  __name: "UPopover",
  __ssrInlineRender: true,
  props: {
    mode: { type: null, required: false, default: "click" },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    modal: { type: Boolean, required: false },
    openDelay: { type: Number, required: false, default: 0 },
    closeDelay: { type: Number, required: false, default: 0 }
  },
  emits: ["close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("popover", props);
    const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
    const rootProps = useForwardPropsEmits(pick, emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {
        pointerDownOutside
      };
    });
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const ui = computed(() => tv({ extend: tv(theme$3), ...appConfig.ui?.popover || {} })({
      side: contentProps.value.side
    }));
    const Component = computed(() => props.mode === "hover" ? HoverCard : Popover);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Component).Root, mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(ssrRenderComponent(unref(Component).Trigger, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if ("Anchor" in Component.value && !!slots.anchor) {
              _push2(ssrRenderComponent(unref(Component).Anchor, { "as-child": "" }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "anchor", close ? { close } : {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Component).Portal, unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Component).Content, mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "content", close ? { close } : {}, null, _push5, _parent5, _scopeId4);
                              if (!!__props.arrow) {
                                _push5(ssrRenderComponent(unref(Component).Arrow, mergeProps(arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                                !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, 16, ["class"])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                            "data-slot": "content",
                            class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                          }, toHandlers(contentEvents.value)), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                              !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                                "data-slot": "arrow",
                                class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                              }), null, 16, ["class"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1040, ["class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FieldGroupReset), null, {
                      default: withCtx(() => [
                        createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                            !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                              "data-slot": "arrow",
                              class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                            }), null, 16, ["class"])) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1040, ["class"])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (openBlock(), createBlock(unref(Component).Trigger, {
                key: 0,
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["reference", "class"])) : createCommentVNode("", true),
              "Anchor" in Component.value && !!slots.anchor ? (openBlock(), createBlock(unref(Component).Anchor, {
                key: 1,
                "as-child": ""
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                ]),
                _: 2
              }, 1024)) : createCommentVNode("", true),
              createVNode(unref(Component).Portal, unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                        "data-slot": "content",
                        class: ui.value.content({ class: [!slots.default && props.class, unref(uiProp)?.content] })
                      }, toHandlers(contentEvents.value)), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                          !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1040, ["class"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Popover.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const theme$2 = {
  "slots": {
    "root": "relative flex gap-1.5 [&>div]:min-w-0",
    "list": "isolate min-w-0",
    "label": "w-full flex items-center gap-1.5 font-semibold text-xs/5 text-highlighted px-2.5 py-1.5",
    "item": "min-w-0",
    "link": "group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    "linkLeadingIcon": "shrink-0 size-5",
    "linkLeadingAvatar": "shrink-0",
    "linkLeadingAvatarSize": "2xs",
    "linkLeadingChipSize": "sm",
    "linkTrailing": "group ms-auto inline-flex gap-1.5 items-center",
    "linkTrailingBadge": "shrink-0",
    "linkTrailingBadgeSize": "sm",
    "linkTrailingIcon": "size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    "linkLabel": "truncate",
    "linkLabelExternalIcon": "inline-block size-3 align-top text-dimmed",
    "childList": "isolate",
    "childLabel": "text-xs text-highlighted",
    "childItem": "",
    "childLink": "group relative size-full flex items-start text-start text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    "childLinkWrapper": "min-w-0",
    "childLinkIcon": "size-5 shrink-0",
    "childLinkLabel": "truncate",
    "childLinkLabelExternalIcon": "inline-block size-3 align-top text-dimmed",
    "childLinkDescription": "text-muted",
    "separator": "px-2 h-px bg-border",
    "viewportWrapper": "absolute top-full left-0 flex w-full",
    "viewport": "relative overflow-hidden bg-default shadow-lg rounded-md ring ring-default h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left,right] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] z-1",
    "content": "",
    "indicator": "absolute left-0 data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-2 w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200",
    "arrow": "relative top-[50%] size-2.5 rotate-45 border border-default bg-default z-1 rounded-xs"
  },
  "variants": {
    "color": {
      "primary": {
        "link": "focus-visible:before:ring-primary",
        "childLink": "focus-visible:before:ring-primary"
      },
      "secondary": {
        "link": "focus-visible:before:ring-secondary",
        "childLink": "focus-visible:before:ring-secondary"
      },
      "success": {
        "link": "focus-visible:before:ring-success",
        "childLink": "focus-visible:before:ring-success"
      },
      "info": {
        "link": "focus-visible:before:ring-info",
        "childLink": "focus-visible:before:ring-info"
      },
      "warning": {
        "link": "focus-visible:before:ring-warning",
        "childLink": "focus-visible:before:ring-warning"
      },
      "error": {
        "link": "focus-visible:before:ring-error",
        "childLink": "focus-visible:before:ring-error"
      },
      "neutral": {
        "link": "focus-visible:before:ring-inverted",
        "childLink": "focus-visible:before:ring-inverted"
      }
    },
    "highlightColor": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "pill": "",
      "link": ""
    },
    "orientation": {
      "horizontal": {
        "root": "items-center justify-between",
        "list": "flex items-center",
        "item": "py-2",
        "link": "px-2.5 py-1.5 before:inset-x-px before:inset-y-0",
        "childList": "grid p-2",
        "childLink": "px-3 py-2 gap-2 before:inset-x-px before:inset-y-0",
        "childLinkLabel": "font-medium",
        "content": "absolute top-0 left-0 w-full max-h-[70vh] overflow-y-auto"
      },
      "vertical": {
        "root": "flex-col",
        "link": "flex-row px-2.5 py-1.5 before:inset-y-px before:inset-x-0",
        "childLabel": "px-1.5 py-0.5",
        "childLink": "p-1.5 gap-1.5 before:inset-y-px before:inset-x-0"
      }
    },
    "contentOrientation": {
      "horizontal": {
        "viewportWrapper": "justify-center",
        "content": "data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]"
      },
      "vertical": {
        "viewport": "sm:w-(--reka-navigation-menu-viewport-width) left-(--reka-navigation-menu-viewport-left) rtl:left-auto rtl:right-[calc(100%-var(--reka-navigation-menu-viewport-left)-var(--reka-navigation-menu-viewport-width))]"
      }
    },
    "active": {
      "true": {
        "childLink": "before:bg-elevated text-highlighted",
        "childLinkIcon": "text-default"
      },
      "false": {
        "link": "text-muted",
        "linkLeadingIcon": "text-dimmed",
        "childLink": [
          "hover:before:bg-elevated/50 text-default hover:text-highlighted",
          "transition-colors before:transition-colors"
        ],
        "childLinkIcon": [
          "text-dimmed group-hover:text-default",
          "transition-colors"
        ]
      }
    },
    "disabled": {
      "true": {
        "link": "cursor-not-allowed opacity-75"
      }
    },
    "highlight": {
      "true": ""
    },
    "level": {
      "true": ""
    },
    "collapsed": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "orientation": "horizontal",
      "contentOrientation": "horizontal",
      "class": {
        "childList": "grid-cols-2 gap-2"
      }
    },
    {
      "orientation": "horizontal",
      "contentOrientation": "vertical",
      "class": {
        "childList": "gap-1",
        "content": "w-60"
      }
    },
    {
      "orientation": "vertical",
      "collapsed": false,
      "class": {
        "childList": "ms-5 border-s border-default",
        "childItem": "ps-1.5 -ms-px",
        "content": "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
      }
    },
    {
      "orientation": "vertical",
      "collapsed": true,
      "class": {
        "link": "px-1.5",
        "linkLabel": "hidden",
        "linkTrailing": "hidden",
        "content": "shadow-sm rounded-sm min-h-6 p-1"
      }
    },
    {
      "orientation": "horizontal",
      "highlight": true,
      "class": {
        "link": [
          "after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full",
          "after:transition-colors"
        ]
      }
    },
    {
      "orientation": "vertical",
      "highlight": true,
      "level": true,
      "class": {
        "link": [
          "after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full",
          "after:transition-colors"
        ]
      }
    },
    {
      "disabled": false,
      "active": false,
      "variant": "pill",
      "class": {
        "link": [
          "hover:text-highlighted hover:before:bg-elevated/50",
          "transition-colors before:transition-colors"
        ],
        "linkLeadingIcon": [
          "group-hover:text-default",
          "transition-colors"
        ]
      }
    },
    {
      "disabled": false,
      "active": false,
      "variant": "pill",
      "orientation": "horizontal",
      "class": {
        "link": "data-[state=open]:text-highlighted",
        "linkLeadingIcon": "group-data-[state=open]:text-default"
      }
    },
    {
      "disabled": false,
      "variant": "pill",
      "highlight": true,
      "orientation": "horizontal",
      "class": {
        "link": "data-[state=open]:before:bg-elevated/50"
      }
    },
    {
      "disabled": false,
      "variant": "pill",
      "highlight": false,
      "active": false,
      "orientation": "horizontal",
      "class": {
        "link": "data-[state=open]:before:bg-elevated/50"
      }
    },
    {
      "color": "primary",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-primary",
        "linkLeadingIcon": "text-primary group-data-[state=open]:text-primary"
      }
    },
    {
      "color": "secondary",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-secondary",
        "linkLeadingIcon": "text-secondary group-data-[state=open]:text-secondary"
      }
    },
    {
      "color": "success",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-success",
        "linkLeadingIcon": "text-success group-data-[state=open]:text-success"
      }
    },
    {
      "color": "info",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-info",
        "linkLeadingIcon": "text-info group-data-[state=open]:text-info"
      }
    },
    {
      "color": "warning",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-warning",
        "linkLeadingIcon": "text-warning group-data-[state=open]:text-warning"
      }
    },
    {
      "color": "error",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-error",
        "linkLeadingIcon": "text-error group-data-[state=open]:text-error"
      }
    },
    {
      "color": "neutral",
      "variant": "pill",
      "active": true,
      "class": {
        "link": "text-highlighted",
        "linkLeadingIcon": "text-highlighted group-data-[state=open]:text-highlighted"
      }
    },
    {
      "variant": "pill",
      "active": true,
      "highlight": false,
      "class": {
        "link": "before:bg-elevated"
      }
    },
    {
      "variant": "pill",
      "active": true,
      "highlight": true,
      "disabled": false,
      "class": {
        "link": [
          "hover:before:bg-elevated/50",
          "before:transition-colors"
        ]
      }
    },
    {
      "disabled": false,
      "active": false,
      "variant": "link",
      "class": {
        "link": [
          "hover:text-highlighted",
          "transition-colors"
        ],
        "linkLeadingIcon": [
          "group-hover:text-default",
          "transition-colors"
        ]
      }
    },
    {
      "disabled": false,
      "active": false,
      "variant": "link",
      "orientation": "horizontal",
      "class": {
        "link": "data-[state=open]:text-highlighted",
        "linkLeadingIcon": "group-data-[state=open]:text-default"
      }
    },
    {
      "color": "primary",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-primary",
        "linkLeadingIcon": "text-primary group-data-[state=open]:text-primary"
      }
    },
    {
      "color": "secondary",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-secondary",
        "linkLeadingIcon": "text-secondary group-data-[state=open]:text-secondary"
      }
    },
    {
      "color": "success",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-success",
        "linkLeadingIcon": "text-success group-data-[state=open]:text-success"
      }
    },
    {
      "color": "info",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-info",
        "linkLeadingIcon": "text-info group-data-[state=open]:text-info"
      }
    },
    {
      "color": "warning",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-warning",
        "linkLeadingIcon": "text-warning group-data-[state=open]:text-warning"
      }
    },
    {
      "color": "error",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-error",
        "linkLeadingIcon": "text-error group-data-[state=open]:text-error"
      }
    },
    {
      "color": "neutral",
      "variant": "link",
      "active": true,
      "class": {
        "link": "text-highlighted",
        "linkLeadingIcon": "text-highlighted group-data-[state=open]:text-highlighted"
      }
    },
    {
      "highlightColor": "primary",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-primary"
      }
    },
    {
      "highlightColor": "secondary",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-secondary"
      }
    },
    {
      "highlightColor": "success",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-success"
      }
    },
    {
      "highlightColor": "info",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-info"
      }
    },
    {
      "highlightColor": "warning",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-warning"
      }
    },
    {
      "highlightColor": "error",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-error"
      }
    },
    {
      "highlightColor": "neutral",
      "highlight": true,
      "level": true,
      "active": true,
      "class": {
        "link": "after:bg-inverted"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "highlightColor": "primary",
    "variant": "pill"
  }
};
const _sfc_main$4 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UNavigationMenu",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    type: { type: null, required: false, default: "multiple" },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    trailingIcon: { type: null, required: false },
    externalIcon: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    items: { type: null, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    collapsed: { type: Boolean, required: false },
    tooltip: { type: [Boolean, Object], required: false },
    popover: { type: [Boolean, Object], required: false },
    highlight: { type: Boolean, required: false },
    highlightColor: { type: null, required: false },
    content: { type: Object, required: false },
    contentOrientation: { type: null, required: false, default: "horizontal" },
    arrow: { type: Boolean, required: false },
    valueKey: { type: null, required: false, default: "value" },
    labelKey: { type: null, required: false, default: "label" },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    delayDuration: { type: Number, required: false, default: 0 },
    disableClickTrigger: { type: Boolean, required: false },
    disableHoverTrigger: { type: Boolean, required: false },
    skipDelayDuration: { type: Number, required: false },
    disablePointerLeaveClose: { type: Boolean, required: false },
    unmountOnHide: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false },
    collapsible: { type: Boolean, required: false, default: true }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("navigationMenu", props);
    const rootProps = useForwardPropsEmits(computed(() => ({
      as: props.as,
      delayDuration: props.delayDuration,
      skipDelayDuration: props.skipDelayDuration,
      orientation: props.orientation,
      disableClickTrigger: props.disableClickTrigger,
      disableHoverTrigger: props.disableHoverTrigger,
      disablePointerLeaveClose: props.disablePointerLeaveClose,
      unmountOnHide: props.unmountOnHide
    })), emits);
    const accordionProps = useForwardPropsEmits(reactivePick(props, "collapsible", "disabled", "type", "unmountOnHide"), emits);
    const contentProps = toRef(() => props.content);
    const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { ...props.orientation === "vertical" && { delayDuration: 0, content: { side: "right" } } }));
    const popoverProps = toRef(() => defu(typeof props.popover === "boolean" ? {} : props.popover, { mode: "hover", content: { side: "right", align: "start", alignOffset: 2 } }));
    const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate();
    const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
      props: {
        item: Object,
        index: Number,
        level: Number,
        listIndex: Number
      }
    });
    const ui = computed(() => tv({ extend: tv(theme$2), ...appConfig.ui?.navigationMenu || {} })({
      orientation: props.orientation,
      contentOrientation: props.orientation === "vertical" ? void 0 : props.contentOrientation,
      collapsed: props.collapsed,
      color: props.color,
      variant: props.variant,
      highlight: props.highlight,
      highlightColor: props.highlightColor || props.color
    }));
    const lists = computed(
      () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
    );
    function getItemValue(item, index, level, listIndex) {
      const prefix = lists.value.length > 1 ? `group-${listIndex}-` : "";
      return get(item, props.valueKey) ?? (level > 0 ? `${prefix}item-${level}-${index}` : `${prefix}item-${index}`);
    }
    function getAccordionDefaultValue(list, level = 0, listIndex = 0) {
      const indexes = list.reduce((acc, item, index) => {
        if (item.defaultOpen || item.open) {
          acc.push(getItemValue(item, index, level, listIndex));
        }
        return acc;
      }, []);
      return props.type === "single" ? indexes[0] : indexes;
    }
    function onLinkTrailingClick(e, item) {
      if (!item.children?.length) {
        return;
      }
      if (props.orientation === "horizontal") {
        e.preventDefault();
      } else if (props.orientation === "vertical" && !props.collapsed) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineLinkTemplate), null, {
        default: withCtx(({ item, active, index }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, item.slot || "item", {
              item,
              index,
              active,
              ui: ui.value
            }, () => {
              ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : "item-leading", {
                item,
                active,
                index,
                ui: ui.value
              }, () => {
                if (item.avatar) {
                  _push2(ssrRenderComponent(_sfc_main$b$1, mergeProps({
                    size: item.ui?.linkLeadingAvatarSize || unref(uiProp)?.linkLeadingAvatarSize || ui.value.linkLeadingAvatarSize()
                  }, item.avatar, {
                    "data-slot": "linkLeadingAvatar",
                    class: ui.value.linkLeadingAvatar({ class: [unref(uiProp)?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })
                  }), null, _parent2, _scopeId));
                } else if (item.icon && item.chip) {
                  _push2(ssrRenderComponent(_sfc_main$c$1, mergeProps({
                    size: item.ui?.linkLeadingChipSize || unref(uiProp)?.linkLeadingChipSize || ui.value.linkLeadingChipSize(),
                    inset: ""
                  }, typeof item.chip === "object" ? item.chip : {}, { "data-slot": "linkLeadingChip" }), {
                    default: withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_sfc_main$d, {
                          name: item.icon,
                          "data-slot": "linkLeadingIcon",
                          class: ui.value.linkLeadingIcon({ class: [unref(uiProp)?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_sfc_main$d, {
                            name: item.icon,
                            "data-slot": "linkLeadingIcon",
                            class: ui.value.linkLeadingIcon({ class: [unref(uiProp)?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })
                          }, null, 8, ["name", "class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else if (item.icon) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: item.icon,
                    "data-slot": "linkLeadingIcon",
                    class: ui.value.linkLeadingIcon({ class: [unref(uiProp)?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              if (unref(get)(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : "item-label"]) {
                _push2(`<span data-slot="linkLabel" class="${ssrRenderClass(ui.value.linkLabel({ class: [unref(uiProp)?.linkLabel, item.ui?.linkLabel] }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : "item-label", {
                  item,
                  active,
                  index
                }, () => {
                  _push2(`${ssrInterpolate(unref(get)(item, props.labelKey))}`);
                }, _push2, _parent2, _scopeId);
                if (item.target === "_blank" && __props.externalIcon !== false) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                    "data-slot": "linkLabelExternalIcon",
                    class: ui.value.linkLabelExternalIcon({ class: [unref(uiProp)?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (item.badge || item.badge === 0 || __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) || __props.orientation === "vertical" && item.children?.length || item.trailingIcon || !!slots[item.slot ? `${item.slot}-trailing` : "item-trailing"]) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.orientation === "vertical" && item.children?.length && !__props.collapsed ? unref(AccordionTrigger_default) : "span"), {
                  as: __props.orientation === "vertical" && item.children?.length && !__props.collapsed ? "span" : void 0,
                  "data-slot": "linkTrailing",
                  class: ui.value.linkTrailing({ class: [unref(uiProp)?.linkTrailing, item.ui?.linkTrailing] }),
                  onClick: (e) => onLinkTrailingClick(e, item)
                }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : "item-trailing", {
                        item,
                        active,
                        index,
                        ui: ui.value
                      }, () => {
                        if (item.badge || item.badge === 0) {
                          _push3(ssrRenderComponent(_sfc_main$f, mergeProps({
                            color: "neutral",
                            variant: "outline",
                            size: item.ui?.linkTrailingBadgeSize || unref(uiProp)?.linkTrailingBadgeSize || ui.value.linkTrailingBadgeSize()
                          }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
                            "data-slot": "linkTrailingBadge",
                            class: ui.value.linkTrailingBadge({ class: [unref(uiProp)?.linkTrailingBadge, item.ui?.linkTrailingBadge] })
                          }), null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        if (__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) || __props.orientation === "vertical" && item.children?.length) {
                          _push3(ssrRenderComponent(_sfc_main$d, {
                            name: item.trailingIcon || __props.trailingIcon || unref(appConfig).ui.icons.chevronDown,
                            "data-slot": "linkTrailingIcon",
                            class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                          }, null, _parent3, _scopeId2));
                        } else if (item.trailingIcon) {
                          _push3(ssrRenderComponent(_sfc_main$d, {
                            name: item.trailingIcon,
                            "data-slot": "linkTrailingIcon",
                            class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : "item-trailing", {
                          item,
                          active,
                          index,
                          ui: ui.value
                        }, () => [
                          item.badge || item.badge === 0 ? (openBlock(), createBlock(_sfc_main$f, mergeProps({
                            key: 0,
                            color: "neutral",
                            variant: "outline",
                            size: item.ui?.linkTrailingBadgeSize || unref(uiProp)?.linkTrailingBadgeSize || ui.value.linkTrailingBadgeSize()
                          }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
                            "data-slot": "linkTrailingBadge",
                            class: ui.value.linkTrailingBadge({ class: [unref(uiProp)?.linkTrailingBadge, item.ui?.linkTrailingBadge] })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true),
                          __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) || __props.orientation === "vertical" && item.children?.length ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 1,
                            name: item.trailingIcon || __props.trailingIcon || unref(appConfig).ui.icons.chevronDown,
                            "data-slot": "linkTrailingIcon",
                            class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                          }, null, 8, ["name", "class"])) : item.trailingIcon ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 2,
                            name: item.trailingIcon,
                            "data-slot": "linkTrailingIcon",
                            class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }), _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, item.slot || "item", {
                item,
                index,
                active,
                ui: ui.value
              }, () => [
                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : "item-leading", {
                  item,
                  active,
                  index,
                  ui: ui.value
                }, () => [
                  item.avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                    key: 0,
                    size: item.ui?.linkLeadingAvatarSize || unref(uiProp)?.linkLeadingAvatarSize || ui.value.linkLeadingAvatarSize()
                  }, item.avatar, {
                    "data-slot": "linkLeadingAvatar",
                    class: ui.value.linkLeadingAvatar({ class: [unref(uiProp)?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })
                  }), null, 16, ["size", "class"])) : item.icon && item.chip ? (openBlock(), createBlock(_sfc_main$c$1, mergeProps({
                    key: 1,
                    size: item.ui?.linkLeadingChipSize || unref(uiProp)?.linkLeadingChipSize || ui.value.linkLeadingChipSize(),
                    inset: ""
                  }, typeof item.chip === "object" ? item.chip : {}, { "data-slot": "linkLeadingChip" }), {
                    default: withCtx(() => [
                      createVNode(_sfc_main$d, {
                        name: item.icon,
                        "data-slot": "linkLeadingIcon",
                        class: ui.value.linkLeadingIcon({ class: [unref(uiProp)?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })
                      }, null, 8, ["name", "class"])
                    ]),
                    _: 2
                  }, 1040, ["size"])) : item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 2,
                    name: item.icon,
                    "data-slot": "linkLeadingIcon",
                    class: ui.value.linkLeadingIcon({ class: [unref(uiProp)?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })
                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                ]),
                unref(get)(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : "item-label"] ? (openBlock(), createBlock("span", {
                  key: 0,
                  "data-slot": "linkLabel",
                  class: ui.value.linkLabel({ class: [unref(uiProp)?.linkLabel, item.ui?.linkLabel] })
                }, [
                  renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : "item-label", {
                    item,
                    active,
                    index
                  }, () => [
                    createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                  ]),
                  item.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 0,
                    name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                    "data-slot": "linkLabelExternalIcon",
                    class: ui.value.linkLabelExternalIcon({ class: [unref(uiProp)?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })
                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                ], 2)) : createCommentVNode("", true),
                item.badge || item.badge === 0 || __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) || __props.orientation === "vertical" && item.children?.length || item.trailingIcon || !!slots[item.slot ? `${item.slot}-trailing` : "item-trailing"] ? (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "vertical" && item.children?.length && !__props.collapsed ? unref(AccordionTrigger_default) : "span"), {
                  key: 1,
                  as: __props.orientation === "vertical" && item.children?.length && !__props.collapsed ? "span" : void 0,
                  "data-slot": "linkTrailing",
                  class: ui.value.linkTrailing({ class: [unref(uiProp)?.linkTrailing, item.ui?.linkTrailing] }),
                  onClick: (e) => onLinkTrailingClick(e, item)
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : "item-trailing", {
                      item,
                      active,
                      index,
                      ui: ui.value
                    }, () => [
                      item.badge || item.badge === 0 ? (openBlock(), createBlock(_sfc_main$f, mergeProps({
                        key: 0,
                        color: "neutral",
                        variant: "outline",
                        size: item.ui?.linkTrailingBadgeSize || unref(uiProp)?.linkTrailingBadgeSize || ui.value.linkTrailingBadgeSize()
                      }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
                        "data-slot": "linkTrailingBadge",
                        class: ui.value.linkTrailingBadge({ class: [unref(uiProp)?.linkTrailingBadge, item.ui?.linkTrailingBadge] })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true),
                      __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) || __props.orientation === "vertical" && item.children?.length ? (openBlock(), createBlock(_sfc_main$d, {
                        key: 1,
                        name: item.trailingIcon || __props.trailingIcon || unref(appConfig).ui.icons.chevronDown,
                        "data-slot": "linkTrailingIcon",
                        class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                      }, null, 8, ["name", "class"])) : item.trailingIcon ? (openBlock(), createBlock(_sfc_main$d, {
                        key: 2,
                        name: item.trailingIcon,
                        "data-slot": "linkTrailingIcon",
                        class: ui.value.linkTrailingIcon({ class: [unref(uiProp)?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })
                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 2
                }, 1032, ["as", "class", "onClick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineItemTemplate), null, {
        default: withCtx(({ item, index, level = 0, listIndex = 0 }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.orientation === "vertical" && !__props.collapsed ? unref(AccordionItem_default) : unref(NavigationMenuItem_default)), mergeProps({ as: "li" }, __props.orientation === "vertical" && !__props.collapsed ? { disabled: !!item.disabled } : {}, {
              value: getItemValue(item, index, level, listIndex)
            }), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.orientation === "vertical" && item.type === "label" && !__props.collapsed) {
                    _push3(`<div data-slot="label" class="${ssrRenderClass(ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] }))}"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(ReuseLinkTemplate), {
                      item,
                      index
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else if (item.type !== "label") {
                    _push3(ssrRenderComponent(_sfc_main$9$1, mergeProps(__props.orientation === "vertical" && item.children?.length && !__props.collapsed && item.type === "trigger" ? {} : unref(pickLinkProps)(item), { custom: "" }), {
                      default: withCtx(({ active, ...slotProps }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? unref(NavigationMenuTrigger_default) : __props.orientation === "vertical" && item.children?.length && !__props.collapsed && !slotProps.href ? unref(AccordionTrigger_default) : unref(NavigationMenuLink_default)), {
                            "as-child": "",
                            active: active || item.active,
                            disabled: item.disabled,
                            onSelect: item.onSelect
                          }, {
                            default: withCtx((_2, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.orientation === "vertical" && __props.collapsed && item.children?.length && (!!props.popover || !!item.popover)) {
                                  _push5(ssrRenderComponent(_sfc_main$5, mergeProps({ ...popoverProps.value, ...typeof item.popover === "boolean" ? {} : item.popover || {} }, {
                                    ui: { content: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] }) }
                                  }), {
                                    content: withCtx(({ close }, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                          item,
                                          active: active || item.active,
                                          index,
                                          ui: ui.value,
                                          close
                                        }, () => {
                                          _push6(`<ul data-slot="childList" class="${ssrRenderClass(ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] }))}"${_scopeId5}><li data-slot="childLabel" class="${ssrRenderClass(ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] }))}"${_scopeId5}>${ssrInterpolate(unref(get)(item, props.labelKey))}</li><!--[-->`);
                                          ssrRenderList(item.children, (childItem, childIndex) => {
                                            _push6(`<li data-slot="childItem" class="${ssrRenderClass(ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] }))}"${_scopeId5}>`);
                                            _push6(ssrRenderComponent(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                              default: withCtx(({ active: childActive, ...childSlotProps }, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(ssrRenderComponent(unref(NavigationMenuLink_default), {
                                                    "as-child": "",
                                                    active: childActive,
                                                    onSelect: childItem.onSelect
                                                  }, {
                                                    default: withCtx((_3, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(ssrRenderComponent(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                          "data-slot": "childLink",
                                                          class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                        }), {
                                                          default: withCtx((_4, _push9, _parent9, _scopeId8) => {
                                                            if (_push9) {
                                                              if (childItem.icon) {
                                                                _push9(ssrRenderComponent(_sfc_main$d, {
                                                                  name: childItem.icon,
                                                                  "data-slot": "childLinkIcon",
                                                                  class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                                }, null, _parent9, _scopeId8));
                                                              } else {
                                                                _push9(`<!---->`);
                                                              }
                                                              _push9(`<span data-slot="childLinkLabel" class="${ssrRenderClass(ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive }))}"${_scopeId8}>${ssrInterpolate(unref(get)(childItem, props.labelKey))} `);
                                                              if (childItem.target === "_blank" && __props.externalIcon !== false) {
                                                                _push9(ssrRenderComponent(_sfc_main$d, {
                                                                  name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                  "data-slot": "childLinkLabelExternalIcon",
                                                                  class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                                }, null, _parent9, _scopeId8));
                                                              } else {
                                                                _push9(`<!---->`);
                                                              }
                                                              _push9(`</span>`);
                                                            } else {
                                                              return [
                                                                childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                                  key: 0,
                                                                  name: childItem.icon,
                                                                  "data-slot": "childLinkIcon",
                                                                  class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                                }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                                createVNode("span", {
                                                                  "data-slot": "childLinkLabel",
                                                                  class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                                }, [
                                                                  createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                                  childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                                    key: 0,
                                                                    name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                    "data-slot": "childLinkLabelExternalIcon",
                                                                    class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                                ], 2)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent8, _scopeId7));
                                                      } else {
                                                        return [
                                                          createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                            "data-slot": "childLink",
                                                            class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                          }), {
                                                            default: withCtx(() => [
                                                              childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                                key: 0,
                                                                name: childItem.icon,
                                                                "data-slot": "childLinkIcon",
                                                                class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                              }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                              createVNode("span", {
                                                                "data-slot": "childLinkLabel",
                                                                class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                              }, [
                                                                createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                                childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                                  key: 0,
                                                                  name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                  "data-slot": "childLinkLabelExternalIcon",
                                                                  class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                              ], 2)
                                                            ]),
                                                            _: 2
                                                          }, 1040, ["class"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                } else {
                                                  return [
                                                    createVNode(unref(NavigationMenuLink_default), {
                                                      "as-child": "",
                                                      active: childActive,
                                                      onSelect: childItem.onSelect
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                          "data-slot": "childLink",
                                                          class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                        }), {
                                                          default: withCtx(() => [
                                                            childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                              key: 0,
                                                              name: childItem.icon,
                                                              "data-slot": "childLinkIcon",
                                                              class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                            }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                            createVNode("span", {
                                                              "data-slot": "childLinkLabel",
                                                              class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                            }, [
                                                              createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                              childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                                key: 0,
                                                                name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                "data-slot": "childLinkLabelExternalIcon",
                                                                class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                              }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                            ], 2)
                                                          ]),
                                                          _: 2
                                                        }, 1040, ["class"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["active", "onSelect"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                            _push6(`</li>`);
                                          });
                                          _push6(`<!--]--></ul>`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                            item,
                                            active: active || item.active,
                                            index,
                                            ui: ui.value,
                                            close
                                          }, () => [
                                            createVNode("ul", {
                                              "data-slot": "childList",
                                              class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                            }, [
                                              createVNode("li", {
                                                "data-slot": "childLabel",
                                                class: ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] })
                                              }, toDisplayString(unref(get)(item, props.labelKey)), 3),
                                              (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                                return openBlock(), createBlock("li", {
                                                  key: childIndex,
                                                  "data-slot": "childItem",
                                                  class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                                }, [
                                                  createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                                    default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                                      createVNode(unref(NavigationMenuLink_default), {
                                                        "as-child": "",
                                                        active: childActive,
                                                        onSelect: childItem.onSelect
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                            "data-slot": "childLink",
                                                            class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                          }), {
                                                            default: withCtx(() => [
                                                              childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                                key: 0,
                                                                name: childItem.icon,
                                                                "data-slot": "childLinkIcon",
                                                                class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                              }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                              createVNode("span", {
                                                                "data-slot": "childLinkLabel",
                                                                class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                              }, [
                                                                createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                                childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                                  key: 0,
                                                                  name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                  "data-slot": "childLinkLabelExternalIcon",
                                                                  class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                              ], 2)
                                                            ]),
                                                            _: 2
                                                          }, 1040, ["class"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["active", "onSelect"])
                                                    ]),
                                                    _: 2
                                                  }, 1040)
                                                ], 2);
                                              }), 128))
                                            ], 2)
                                          ])
                                        ];
                                      }
                                    }),
                                    default: withCtx((_3, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_sfc_main$a$1, mergeProps(slotProps, {
                                          "data-slot": "link",
                                          class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                        }), {
                                          default: withCtx((_4, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(ReuseLinkTemplate), {
                                                item,
                                                active: active || item.active,
                                                index
                                              }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(ReuseLinkTemplate), {
                                                  item,
                                                  active: active || item.active,
                                                  index
                                                }, null, 8, ["item", "active", "index"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                            "data-slot": "link",
                                            class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                          }), {
                                            default: withCtx(() => [
                                              createVNode(unref(ReuseLinkTemplate), {
                                                item,
                                                active: active || item.active,
                                                index
                                              }, null, 8, ["item", "active", "index"])
                                            ]),
                                            _: 2
                                          }, 1040, ["class"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else if (__props.orientation === "vertical" && __props.collapsed && (!!props.tooltip || !!item.tooltip) || __props.orientation === "horizontal" && !!item.tooltip) {
                                  _push5(ssrRenderComponent(_sfc_main$7, mergeProps({
                                    text: unref(get)(item, props.labelKey)
                                  }, { ...tooltipProps.value, ...typeof item.tooltip === "boolean" ? {} : item.tooltip || {} }), {
                                    default: withCtx((_3, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_sfc_main$a$1, mergeProps(slotProps, {
                                          "data-slot": "link",
                                          class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                        }), {
                                          default: withCtx((_4, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(ReuseLinkTemplate), {
                                                item,
                                                active: active || item.active,
                                                index
                                              }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(ReuseLinkTemplate), {
                                                  item,
                                                  active: active || item.active,
                                                  index
                                                }, null, 8, ["item", "active", "index"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                            "data-slot": "link",
                                            class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                          }), {
                                            default: withCtx(() => [
                                              createVNode(unref(ReuseLinkTemplate), {
                                                item,
                                                active: active || item.active,
                                                index
                                              }, null, 8, ["item", "active", "index"])
                                            ]),
                                            _: 2
                                          }, 1040, ["class"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(ssrRenderComponent(_sfc_main$a$1, mergeProps(slotProps, {
                                    "data-slot": "link",
                                    class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: __props.orientation === "horizontal" || level > 0 })
                                  }), {
                                    default: withCtx((_3, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(ReuseLinkTemplate), {
                                          item,
                                          active: active || item.active,
                                          index
                                        }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(ReuseLinkTemplate), {
                                            item,
                                            active: active || item.active,
                                            index
                                          }, null, 8, ["item", "active", "index"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                }
                              } else {
                                return [
                                  __props.orientation === "vertical" && __props.collapsed && item.children?.length && (!!props.popover || !!item.popover) ? (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 0 }, { ...popoverProps.value, ...typeof item.popover === "boolean" ? {} : item.popover || {} }, {
                                    ui: { content: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] }) }
                                  }), {
                                    content: withCtx(({ close }) => [
                                      renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                        item,
                                        active: active || item.active,
                                        index,
                                        ui: ui.value,
                                        close
                                      }, () => [
                                        createVNode("ul", {
                                          "data-slot": "childList",
                                          class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                        }, [
                                          createVNode("li", {
                                            "data-slot": "childLabel",
                                            class: ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] })
                                          }, toDisplayString(unref(get)(item, props.labelKey)), 3),
                                          (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                            return openBlock(), createBlock("li", {
                                              key: childIndex,
                                              "data-slot": "childItem",
                                              class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                            }, [
                                              createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                                default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                                  createVNode(unref(NavigationMenuLink_default), {
                                                    "as-child": "",
                                                    active: childActive,
                                                    onSelect: childItem.onSelect
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                        "data-slot": "childLink",
                                                        class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                      }), {
                                                        default: withCtx(() => [
                                                          childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                            key: 0,
                                                            name: childItem.icon,
                                                            "data-slot": "childLinkIcon",
                                                            class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                          createVNode("span", {
                                                            "data-slot": "childLinkLabel",
                                                            class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                          }, [
                                                            createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                            childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                              key: 0,
                                                              name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                              "data-slot": "childLinkLabelExternalIcon",
                                                              class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                          ], 2)
                                                        ]),
                                                        _: 2
                                                      }, 1040, ["class"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["active", "onSelect"])
                                                ]),
                                                _: 2
                                              }, 1040)
                                            ], 2);
                                          }), 128))
                                        ], 2)
                                      ])
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                        "data-slot": "link",
                                        class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                      }), {
                                        default: withCtx(() => [
                                          createVNode(unref(ReuseLinkTemplate), {
                                            item,
                                            active: active || item.active,
                                            index
                                          }, null, 8, ["item", "active", "index"])
                                        ]),
                                        _: 2
                                      }, 1040, ["class"])
                                    ]),
                                    _: 2
                                  }, 1040, ["ui"])) : __props.orientation === "vertical" && __props.collapsed && (!!props.tooltip || !!item.tooltip) || __props.orientation === "horizontal" && !!item.tooltip ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
                                    key: 1,
                                    text: unref(get)(item, props.labelKey)
                                  }, { ...tooltipProps.value, ...typeof item.tooltip === "boolean" ? {} : item.tooltip || {} }), {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                        "data-slot": "link",
                                        class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                      }), {
                                        default: withCtx(() => [
                                          createVNode(unref(ReuseLinkTemplate), {
                                            item,
                                            active: active || item.active,
                                            index
                                          }, null, 8, ["item", "active", "index"])
                                        ]),
                                        _: 2
                                      }, 1040, ["class"])
                                    ]),
                                    _: 2
                                  }, 1040, ["text"])) : (openBlock(), createBlock(_sfc_main$a$1, mergeProps({ key: 2 }, slotProps, {
                                    "data-slot": "link",
                                    class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: __props.orientation === "horizontal" || level > 0 })
                                  }), {
                                    default: withCtx(() => [
                                      createVNode(unref(ReuseLinkTemplate), {
                                        item,
                                        active: active || item.active,
                                        index
                                      }, null, 8, ["item", "active", "index"])
                                    ]),
                                    _: 2
                                  }, 1040, ["class"]))
                                ];
                              }
                            }),
                            _: 2
                          }), _parent4, _scopeId3);
                          if (__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"])) {
                            _push4(ssrRenderComponent(unref(NavigationMenuContent_default), mergeProps(contentProps.value, {
                              "data-slot": "content",
                              class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                            }), {
                              default: withCtx((_2, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                    item,
                                    active: active || item.active,
                                    index,
                                    ui: ui.value
                                  }, () => {
                                    _push5(`<ul data-slot="childList" class="${ssrRenderClass(ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] }))}"${_scopeId4}><!--[-->`);
                                    ssrRenderList(item.children, (childItem, childIndex) => {
                                      _push5(`<li data-slot="childItem" class="${ssrRenderClass(ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] }))}"${_scopeId4}>`);
                                      _push5(ssrRenderComponent(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                        default: withCtx(({ active: childActive, ...childSlotProps }, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(unref(NavigationMenuLink_default), {
                                              "as-child": "",
                                              active: childActive,
                                              onSelect: childItem.onSelect
                                            }, {
                                              default: withCtx((_3, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(ssrRenderComponent(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                    "data-slot": "childLink",
                                                    class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                  }), {
                                                    default: withCtx((_4, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        if (childItem.icon) {
                                                          _push8(ssrRenderComponent(_sfc_main$d, {
                                                            name: childItem.icon,
                                                            "data-slot": "childLinkIcon",
                                                            class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                          }, null, _parent8, _scopeId7));
                                                        } else {
                                                          _push8(`<!---->`);
                                                        }
                                                        _push8(`<div data-slot="childLinkWrapper" class="${ssrRenderClass(ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] }))}"${_scopeId7}><p data-slot="childLinkLabel" class="${ssrRenderClass(ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive }))}"${_scopeId7}>${ssrInterpolate(unref(get)(childItem, props.labelKey))} `);
                                                        if (childItem.target === "_blank" && __props.externalIcon !== false) {
                                                          _push8(ssrRenderComponent(_sfc_main$d, {
                                                            name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                            "data-slot": "childLinkLabelExternalIcon",
                                                            class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                          }, null, _parent8, _scopeId7));
                                                        } else {
                                                          _push8(`<!---->`);
                                                        }
                                                        _push8(`</p>`);
                                                        if (childItem.description) {
                                                          _push8(`<p data-slot="childLinkDescription" class="${ssrRenderClass(ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive }))}"${_scopeId7}>${ssrInterpolate(childItem.description)}</p>`);
                                                        } else {
                                                          _push8(`<!---->`);
                                                        }
                                                        _push8(`</div>`);
                                                      } else {
                                                        return [
                                                          childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                            key: 0,
                                                            name: childItem.icon,
                                                            "data-slot": "childLinkIcon",
                                                            class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                          createVNode("div", {
                                                            "data-slot": "childLinkWrapper",
                                                            class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                          }, [
                                                            createVNode("p", {
                                                              "data-slot": "childLinkLabel",
                                                              class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                            }, [
                                                              createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                              childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                                key: 0,
                                                                name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                                "data-slot": "childLinkLabelExternalIcon",
                                                                class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                              }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                            ], 2),
                                                            childItem.description ? (openBlock(), createBlock("p", {
                                                              key: 0,
                                                              "data-slot": "childLinkDescription",
                                                              class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                            }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                          ], 2)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                } else {
                                                  return [
                                                    createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                      "data-slot": "childLink",
                                                      class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                    }), {
                                                      default: withCtx(() => [
                                                        childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                          key: 0,
                                                          name: childItem.icon,
                                                          "data-slot": "childLinkIcon",
                                                          class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                        }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                        createVNode("div", {
                                                          "data-slot": "childLinkWrapper",
                                                          class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                        }, [
                                                          createVNode("p", {
                                                            "data-slot": "childLinkLabel",
                                                            class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                          }, [
                                                            createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                            childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                              key: 0,
                                                              name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                              "data-slot": "childLinkLabelExternalIcon",
                                                              class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                          ], 2),
                                                          childItem.description ? (openBlock(), createBlock("p", {
                                                            key: 0,
                                                            "data-slot": "childLinkDescription",
                                                            class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                          }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                        ], 2)
                                                      ]),
                                                      _: 2
                                                    }, 1040, ["class"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createVNode(unref(NavigationMenuLink_default), {
                                                "as-child": "",
                                                active: childActive,
                                                onSelect: childItem.onSelect
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                    "data-slot": "childLink",
                                                    class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                  }), {
                                                    default: withCtx(() => [
                                                      childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                        key: 0,
                                                        name: childItem.icon,
                                                        "data-slot": "childLinkIcon",
                                                        class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                      }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                      createVNode("div", {
                                                        "data-slot": "childLinkWrapper",
                                                        class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                      }, [
                                                        createVNode("p", {
                                                          "data-slot": "childLinkLabel",
                                                          class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                        }, [
                                                          createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                          childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                            key: 0,
                                                            name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                            "data-slot": "childLinkLabelExternalIcon",
                                                            class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                        ], 2),
                                                        childItem.description ? (openBlock(), createBlock("p", {
                                                          key: 0,
                                                          "data-slot": "childLinkDescription",
                                                          class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                        }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                      ], 2)
                                                    ]),
                                                    _: 2
                                                  }, 1040, ["class"])
                                                ]),
                                                _: 2
                                              }, 1032, ["active", "onSelect"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                      _push5(`</li>`);
                                    });
                                    _push5(`<!--]--></ul>`);
                                  }, _push5, _parent5, _scopeId4);
                                } else {
                                  return [
                                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                      item,
                                      active: active || item.active,
                                      index,
                                      ui: ui.value
                                    }, () => [
                                      createVNode("ul", {
                                        "data-slot": "childList",
                                        class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                      }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                          return openBlock(), createBlock("li", {
                                            key: childIndex,
                                            "data-slot": "childItem",
                                            class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                          }, [
                                            createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                              default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                                createVNode(unref(NavigationMenuLink_default), {
                                                  "as-child": "",
                                                  active: childActive,
                                                  onSelect: childItem.onSelect
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                      "data-slot": "childLink",
                                                      class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                    }), {
                                                      default: withCtx(() => [
                                                        childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                          key: 0,
                                                          name: childItem.icon,
                                                          "data-slot": "childLinkIcon",
                                                          class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                        }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                        createVNode("div", {
                                                          "data-slot": "childLinkWrapper",
                                                          class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                        }, [
                                                          createVNode("p", {
                                                            "data-slot": "childLinkLabel",
                                                            class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                          }, [
                                                            createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                            childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                              key: 0,
                                                              name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                              "data-slot": "childLinkLabelExternalIcon",
                                                              class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                          ], 2),
                                                          childItem.description ? (openBlock(), createBlock("p", {
                                                            key: 0,
                                                            "data-slot": "childLinkDescription",
                                                            class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                          }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                        ], 2)
                                                      ]),
                                                      _: 2
                                                    }, 1040, ["class"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["active", "onSelect"])
                                              ]),
                                              _: 2
                                            }, 1040)
                                          ], 2);
                                        }), 128))
                                      ], 2)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? unref(NavigationMenuTrigger_default) : __props.orientation === "vertical" && item.children?.length && !__props.collapsed && !slotProps.href ? unref(AccordionTrigger_default) : unref(NavigationMenuLink_default)), {
                              "as-child": "",
                              active: active || item.active,
                              disabled: item.disabled,
                              onSelect: item.onSelect
                            }, {
                              default: withCtx(() => [
                                __props.orientation === "vertical" && __props.collapsed && item.children?.length && (!!props.popover || !!item.popover) ? (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 0 }, { ...popoverProps.value, ...typeof item.popover === "boolean" ? {} : item.popover || {} }, {
                                  ui: { content: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] }) }
                                }), {
                                  content: withCtx(({ close }) => [
                                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                      item,
                                      active: active || item.active,
                                      index,
                                      ui: ui.value,
                                      close
                                    }, () => [
                                      createVNode("ul", {
                                        "data-slot": "childList",
                                        class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                      }, [
                                        createVNode("li", {
                                          "data-slot": "childLabel",
                                          class: ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] })
                                        }, toDisplayString(unref(get)(item, props.labelKey)), 3),
                                        (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                          return openBlock(), createBlock("li", {
                                            key: childIndex,
                                            "data-slot": "childItem",
                                            class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                          }, [
                                            createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                              default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                                createVNode(unref(NavigationMenuLink_default), {
                                                  "as-child": "",
                                                  active: childActive,
                                                  onSelect: childItem.onSelect
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                      "data-slot": "childLink",
                                                      class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                    }), {
                                                      default: withCtx(() => [
                                                        childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                          key: 0,
                                                          name: childItem.icon,
                                                          "data-slot": "childLinkIcon",
                                                          class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                        }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                        createVNode("span", {
                                                          "data-slot": "childLinkLabel",
                                                          class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                        }, [
                                                          createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                          childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                            key: 0,
                                                            name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                            "data-slot": "childLinkLabelExternalIcon",
                                                            class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                        ], 2)
                                                      ]),
                                                      _: 2
                                                    }, 1040, ["class"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["active", "onSelect"])
                                              ]),
                                              _: 2
                                            }, 1040)
                                          ], 2);
                                        }), 128))
                                      ], 2)
                                    ])
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                      "data-slot": "link",
                                      class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                    }), {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseLinkTemplate), {
                                          item,
                                          active: active || item.active,
                                          index
                                        }, null, 8, ["item", "active", "index"])
                                      ]),
                                      _: 2
                                    }, 1040, ["class"])
                                  ]),
                                  _: 2
                                }, 1040, ["ui"])) : __props.orientation === "vertical" && __props.collapsed && (!!props.tooltip || !!item.tooltip) || __props.orientation === "horizontal" && !!item.tooltip ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
                                  key: 1,
                                  text: unref(get)(item, props.labelKey)
                                }, { ...tooltipProps.value, ...typeof item.tooltip === "boolean" ? {} : item.tooltip || {} }), {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                      "data-slot": "link",
                                      class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                    }), {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseLinkTemplate), {
                                          item,
                                          active: active || item.active,
                                          index
                                        }, null, 8, ["item", "active", "index"])
                                      ]),
                                      _: 2
                                    }, 1040, ["class"])
                                  ]),
                                  _: 2
                                }, 1040, ["text"])) : (openBlock(), createBlock(_sfc_main$a$1, mergeProps({ key: 2 }, slotProps, {
                                  "data-slot": "link",
                                  class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: __props.orientation === "horizontal" || level > 0 })
                                }), {
                                  default: withCtx(() => [
                                    createVNode(unref(ReuseLinkTemplate), {
                                      item,
                                      active: active || item.active,
                                      index
                                    }, null, 8, ["item", "active", "index"])
                                  ]),
                                  _: 2
                                }, 1040, ["class"]))
                              ]),
                              _: 2
                            }, 1064, ["active", "disabled", "onSelect"])),
                            __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? (openBlock(), createBlock(unref(NavigationMenuContent_default), mergeProps({ key: 0 }, contentProps.value, {
                              "data-slot": "content",
                              class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                            }), {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                  item,
                                  active: active || item.active,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  createVNode("ul", {
                                    "data-slot": "childList",
                                    class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                      return openBlock(), createBlock("li", {
                                        key: childIndex,
                                        "data-slot": "childItem",
                                        class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                      }, [
                                        createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                          default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                            createVNode(unref(NavigationMenuLink_default), {
                                              "as-child": "",
                                              active: childActive,
                                              onSelect: childItem.onSelect
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                  "data-slot": "childLink",
                                                  class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                }), {
                                                  default: withCtx(() => [
                                                    childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                      key: 0,
                                                      name: childItem.icon,
                                                      "data-slot": "childLinkIcon",
                                                      class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                    }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                    createVNode("div", {
                                                      "data-slot": "childLinkWrapper",
                                                      class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                    }, [
                                                      createVNode("p", {
                                                        "data-slot": "childLinkLabel",
                                                        class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                      }, [
                                                        createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                        childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                          key: 0,
                                                          name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                          "data-slot": "childLinkLabelExternalIcon",
                                                          class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                        }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                      ], 2),
                                                      childItem.description ? (openBlock(), createBlock("p", {
                                                        key: 0,
                                                        "data-slot": "childLinkDescription",
                                                        class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                      }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                    ], 2)
                                                  ]),
                                                  _: 2
                                                }, 1040, ["class"])
                                              ]),
                                              _: 2
                                            }, 1032, ["active", "onSelect"])
                                          ]),
                                          _: 2
                                        }, 1040)
                                      ], 2);
                                    }), 128))
                                  ], 2)
                                ])
                              ]),
                              _: 2
                            }, 1040, ["class"])) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.orientation === "vertical" && item.children?.length && !__props.collapsed) {
                    _push3(ssrRenderComponent(unref(AccordionContent_default), {
                      "data-slot": "content",
                      class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(AccordionRoot_default), mergeProps({
                            ...unref(accordionProps),
                            defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
                          }, {
                            as: "ul",
                            "data-slot": "childList",
                            class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                          }), {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(item.children, (childItem, childIndex) => {
                                  _push5(ssrRenderComponent(unref(ReuseItemTemplate), {
                                    key: childIndex,
                                    item: childItem,
                                    index: childIndex,
                                    level: level + 1,
                                    "list-index": listIndex,
                                    "data-slot": "childItem",
                                    class: ui.value.childItem({ class: [unref(uiProp)?.childItem, childItem.ui?.childItem] })
                                  }, null, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                    return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                      key: childIndex,
                                      item: childItem,
                                      index: childIndex,
                                      level: level + 1,
                                      "list-index": listIndex,
                                      "data-slot": "childItem",
                                      class: ui.value.childItem({ class: [unref(uiProp)?.childItem, childItem.ui?.childItem] })
                                    }, null, 8, ["item", "index", "level", "list-index", "class"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(AccordionRoot_default), mergeProps({
                              ...unref(accordionProps),
                              defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
                            }, {
                              as: "ul",
                              "data-slot": "childList",
                              class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                            }), {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                  return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                    key: childIndex,
                                    item: childItem,
                                    index: childIndex,
                                    level: level + 1,
                                    "list-index": listIndex,
                                    "data-slot": "childItem",
                                    class: ui.value.childItem({ class: [unref(uiProp)?.childItem, childItem.ui?.childItem] })
                                  }, null, 8, ["item", "index", "level", "list-index", "class"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1040, ["class"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    __props.orientation === "vertical" && item.type === "label" && !__props.collapsed ? (openBlock(), createBlock("div", {
                      key: 0,
                      "data-slot": "label",
                      class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                    }, [
                      createVNode(unref(ReuseLinkTemplate), {
                        item,
                        index
                      }, null, 8, ["item", "index"])
                    ], 2)) : item.type !== "label" ? (openBlock(), createBlock(_sfc_main$9$1, mergeProps({ key: 1 }, __props.orientation === "vertical" && item.children?.length && !__props.collapsed && item.type === "trigger" ? {} : unref(pickLinkProps)(item), { custom: "" }), {
                      default: withCtx(({ active, ...slotProps }) => [
                        (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? unref(NavigationMenuTrigger_default) : __props.orientation === "vertical" && item.children?.length && !__props.collapsed && !slotProps.href ? unref(AccordionTrigger_default) : unref(NavigationMenuLink_default)), {
                          "as-child": "",
                          active: active || item.active,
                          disabled: item.disabled,
                          onSelect: item.onSelect
                        }, {
                          default: withCtx(() => [
                            __props.orientation === "vertical" && __props.collapsed && item.children?.length && (!!props.popover || !!item.popover) ? (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 0 }, { ...popoverProps.value, ...typeof item.popover === "boolean" ? {} : item.popover || {} }, {
                              ui: { content: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] }) }
                            }), {
                              content: withCtx(({ close }) => [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                  item,
                                  active: active || item.active,
                                  index,
                                  ui: ui.value,
                                  close
                                }, () => [
                                  createVNode("ul", {
                                    "data-slot": "childList",
                                    class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                  }, [
                                    createVNode("li", {
                                      "data-slot": "childLabel",
                                      class: ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] })
                                    }, toDisplayString(unref(get)(item, props.labelKey)), 3),
                                    (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                      return openBlock(), createBlock("li", {
                                        key: childIndex,
                                        "data-slot": "childItem",
                                        class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                      }, [
                                        createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                          default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                            createVNode(unref(NavigationMenuLink_default), {
                                              "as-child": "",
                                              active: childActive,
                                              onSelect: childItem.onSelect
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                  "data-slot": "childLink",
                                                  class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                                }), {
                                                  default: withCtx(() => [
                                                    childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                      key: 0,
                                                      name: childItem.icon,
                                                      "data-slot": "childLinkIcon",
                                                      class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                    }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                    createVNode("span", {
                                                      "data-slot": "childLinkLabel",
                                                      class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                    }, [
                                                      createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                      childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                        key: 0,
                                                        name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                        "data-slot": "childLinkLabelExternalIcon",
                                                        class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                    ], 2)
                                                  ]),
                                                  _: 2
                                                }, 1040, ["class"])
                                              ]),
                                              _: 2
                                            }, 1032, ["active", "onSelect"])
                                          ]),
                                          _: 2
                                        }, 1040)
                                      ], 2);
                                    }), 128))
                                  ], 2)
                                ])
                              ]),
                              default: withCtx(() => [
                                createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                  "data-slot": "link",
                                  class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                }), {
                                  default: withCtx(() => [
                                    createVNode(unref(ReuseLinkTemplate), {
                                      item,
                                      active: active || item.active,
                                      index
                                    }, null, 8, ["item", "active", "index"])
                                  ]),
                                  _: 2
                                }, 1040, ["class"])
                              ]),
                              _: 2
                            }, 1040, ["ui"])) : __props.orientation === "vertical" && __props.collapsed && (!!props.tooltip || !!item.tooltip) || __props.orientation === "horizontal" && !!item.tooltip ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
                              key: 1,
                              text: unref(get)(item, props.labelKey)
                            }, { ...tooltipProps.value, ...typeof item.tooltip === "boolean" ? {} : item.tooltip || {} }), {
                              default: withCtx(() => [
                                createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                  "data-slot": "link",
                                  class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                                }), {
                                  default: withCtx(() => [
                                    createVNode(unref(ReuseLinkTemplate), {
                                      item,
                                      active: active || item.active,
                                      index
                                    }, null, 8, ["item", "active", "index"])
                                  ]),
                                  _: 2
                                }, 1040, ["class"])
                              ]),
                              _: 2
                            }, 1040, ["text"])) : (openBlock(), createBlock(_sfc_main$a$1, mergeProps({ key: 2 }, slotProps, {
                              "data-slot": "link",
                              class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: __props.orientation === "horizontal" || level > 0 })
                            }), {
                              default: withCtx(() => [
                                createVNode(unref(ReuseLinkTemplate), {
                                  item,
                                  active: active || item.active,
                                  index
                                }, null, 8, ["item", "active", "index"])
                              ]),
                              _: 2
                            }, 1040, ["class"]))
                          ]),
                          _: 2
                        }, 1064, ["active", "disabled", "onSelect"])),
                        __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? (openBlock(), createBlock(unref(NavigationMenuContent_default), mergeProps({ key: 0 }, contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                        }), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                              item,
                              active: active || item.active,
                              index,
                              ui: ui.value
                            }, () => [
                              createVNode("ul", {
                                "data-slot": "childList",
                                class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                  return openBlock(), createBlock("li", {
                                    key: childIndex,
                                    "data-slot": "childItem",
                                    class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                  }, [
                                    createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                      default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                        createVNode(unref(NavigationMenuLink_default), {
                                          "as-child": "",
                                          active: childActive,
                                          onSelect: childItem.onSelect
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                              "data-slot": "childLink",
                                              class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                            }), {
                                              default: withCtx(() => [
                                                childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                  key: 0,
                                                  name: childItem.icon,
                                                  "data-slot": "childLinkIcon",
                                                  class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                createVNode("div", {
                                                  "data-slot": "childLinkWrapper",
                                                  class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                                }, [
                                                  createVNode("p", {
                                                    "data-slot": "childLinkLabel",
                                                    class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                  }, [
                                                    createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                    childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                      key: 0,
                                                      name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                      "data-slot": "childLinkLabelExternalIcon",
                                                      class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                  ], 2),
                                                  childItem.description ? (openBlock(), createBlock("p", {
                                                    key: 0,
                                                    "data-slot": "childLinkDescription",
                                                    class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                  }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                                ], 2)
                                              ]),
                                              _: 2
                                            }, 1040, ["class"])
                                          ]),
                                          _: 2
                                        }, 1032, ["active", "onSelect"])
                                      ]),
                                      _: 2
                                    }, 1040)
                                  ], 2);
                                }), 128))
                              ], 2)
                            ])
                          ]),
                          _: 2
                        }, 1040, ["class"])) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1040)) : createCommentVNode("", true),
                    __props.orientation === "vertical" && item.children?.length && !__props.collapsed ? (openBlock(), createBlock(unref(AccordionContent_default), {
                      key: 2,
                      "data-slot": "content",
                      class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(AccordionRoot_default), mergeProps({
                          ...unref(accordionProps),
                          defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
                        }, {
                          as: "ul",
                          "data-slot": "childList",
                          class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                        }), {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                              return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                key: childIndex,
                                item: childItem,
                                index: childIndex,
                                level: level + 1,
                                "list-index": listIndex,
                                "data-slot": "childItem",
                                class: ui.value.childItem({ class: [unref(uiProp)?.childItem, childItem.ui?.childItem] })
                              }, null, 8, ["item", "index", "level", "list-index", "class"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1040, ["class"])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }), _parent2, _scopeId);
          } else {
            return [
              (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "vertical" && !__props.collapsed ? unref(AccordionItem_default) : unref(NavigationMenuItem_default)), mergeProps({ as: "li" }, __props.orientation === "vertical" && !__props.collapsed ? { disabled: !!item.disabled } : {}, {
                value: getItemValue(item, index, level, listIndex)
              }), {
                default: withCtx(() => [
                  __props.orientation === "vertical" && item.type === "label" && !__props.collapsed ? (openBlock(), createBlock("div", {
                    key: 0,
                    "data-slot": "label",
                    class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                  }, [
                    createVNode(unref(ReuseLinkTemplate), {
                      item,
                      index
                    }, null, 8, ["item", "index"])
                  ], 2)) : item.type !== "label" ? (openBlock(), createBlock(_sfc_main$9$1, mergeProps({ key: 1 }, __props.orientation === "vertical" && item.children?.length && !__props.collapsed && item.type === "trigger" ? {} : unref(pickLinkProps)(item), { custom: "" }), {
                    default: withCtx(({ active, ...slotProps }) => [
                      (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? unref(NavigationMenuTrigger_default) : __props.orientation === "vertical" && item.children?.length && !__props.collapsed && !slotProps.href ? unref(AccordionTrigger_default) : unref(NavigationMenuLink_default)), {
                        "as-child": "",
                        active: active || item.active,
                        disabled: item.disabled,
                        onSelect: item.onSelect
                      }, {
                        default: withCtx(() => [
                          __props.orientation === "vertical" && __props.collapsed && item.children?.length && (!!props.popover || !!item.popover) ? (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 0 }, { ...popoverProps.value, ...typeof item.popover === "boolean" ? {} : item.popover || {} }, {
                            ui: { content: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] }) }
                          }), {
                            content: withCtx(({ close }) => [
                              renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                                item,
                                active: active || item.active,
                                index,
                                ui: ui.value,
                                close
                              }, () => [
                                createVNode("ul", {
                                  "data-slot": "childList",
                                  class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                                }, [
                                  createVNode("li", {
                                    "data-slot": "childLabel",
                                    class: ui.value.childLabel({ class: [unref(uiProp)?.childLabel, item.ui?.childLabel] })
                                  }, toDisplayString(unref(get)(item, props.labelKey)), 3),
                                  (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                    return openBlock(), createBlock("li", {
                                      key: childIndex,
                                      "data-slot": "childItem",
                                      class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                    }, [
                                      createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                        default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                          createVNode(unref(NavigationMenuLink_default), {
                                            "as-child": "",
                                            active: childActive,
                                            onSelect: childItem.onSelect
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                                "data-slot": "childLink",
                                                class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                              }), {
                                                default: withCtx(() => [
                                                  childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                    key: 0,
                                                    name: childItem.icon,
                                                    "data-slot": "childLinkIcon",
                                                    class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                                  }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                                  createVNode("span", {
                                                    "data-slot": "childLinkLabel",
                                                    class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                  }, [
                                                    createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                    childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                      key: 0,
                                                      name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                      "data-slot": "childLinkLabelExternalIcon",
                                                      class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                  ], 2)
                                                ]),
                                                _: 2
                                              }, 1040, ["class"])
                                            ]),
                                            _: 2
                                          }, 1032, ["active", "onSelect"])
                                        ]),
                                        _: 2
                                      }, 1040)
                                    ], 2);
                                  }), 128))
                                ], 2)
                              ])
                            ]),
                            default: withCtx(() => [
                              createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                "data-slot": "link",
                                class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                              }), {
                                default: withCtx(() => [
                                  createVNode(unref(ReuseLinkTemplate), {
                                    item,
                                    active: active || item.active,
                                    index
                                  }, null, 8, ["item", "active", "index"])
                                ]),
                                _: 2
                              }, 1040, ["class"])
                            ]),
                            _: 2
                          }, 1040, ["ui"])) : __props.orientation === "vertical" && __props.collapsed && (!!props.tooltip || !!item.tooltip) || __props.orientation === "horizontal" && !!item.tooltip ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
                            key: 1,
                            text: unref(get)(item, props.labelKey)
                          }, { ...tooltipProps.value, ...typeof item.tooltip === "boolean" ? {} : item.tooltip || {} }), {
                            default: withCtx(() => [
                              createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                                "data-slot": "link",
                                class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })
                              }), {
                                default: withCtx(() => [
                                  createVNode(unref(ReuseLinkTemplate), {
                                    item,
                                    active: active || item.active,
                                    index
                                  }, null, 8, ["item", "active", "index"])
                                ]),
                                _: 2
                              }, 1040, ["class"])
                            ]),
                            _: 2
                          }, 1040, ["text"])) : (openBlock(), createBlock(_sfc_main$a$1, mergeProps({ key: 2 }, slotProps, {
                            "data-slot": "link",
                            class: ui.value.link({ class: [unref(uiProp)?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: __props.orientation === "horizontal" || level > 0 })
                          }), {
                            default: withCtx(() => [
                              createVNode(unref(ReuseLinkTemplate), {
                                item,
                                active: active || item.active,
                                index
                              }, null, 8, ["item", "active", "index"])
                            ]),
                            _: 2
                          }, 1040, ["class"]))
                        ]),
                        _: 2
                      }, 1064, ["active", "disabled", "onSelect"])),
                      __props.orientation === "horizontal" && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : "item-content"]) ? (openBlock(), createBlock(unref(NavigationMenuContent_default), mergeProps({ key: 0 }, contentProps.value, {
                        "data-slot": "content",
                        class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                      }), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, item.slot ? `${item.slot}-content` : "item-content", {
                            item,
                            active: active || item.active,
                            index,
                            ui: ui.value
                          }, () => [
                            createVNode("ul", {
                              "data-slot": "childList",
                              class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                                return openBlock(), createBlock("li", {
                                  key: childIndex,
                                  "data-slot": "childItem",
                                  class: ui.value.childItem({ class: [unref(uiProp)?.childItem, item.ui?.childItem] })
                                }, [
                                  createVNode(_sfc_main$9$1, mergeProps({ ref_for: true }, unref(pickLinkProps)(childItem), { custom: "" }), {
                                    default: withCtx(({ active: childActive, ...childSlotProps }) => [
                                      createVNode(unref(NavigationMenuLink_default), {
                                        "as-child": "",
                                        active: childActive,
                                        onSelect: childItem.onSelect
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$a$1, mergeProps({ ref_for: true }, childSlotProps, {
                                            "data-slot": "childLink",
                                            class: ui.value.childLink({ class: [unref(uiProp)?.childLink, item.ui?.childLink, childItem.class], active: childActive })
                                          }), {
                                            default: withCtx(() => [
                                              childItem.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                key: 0,
                                                name: childItem.icon,
                                                "data-slot": "childLinkIcon",
                                                class: ui.value.childLinkIcon({ class: [unref(uiProp)?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })
                                              }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                                              createVNode("div", {
                                                "data-slot": "childLinkWrapper",
                                                class: ui.value.childLinkWrapper({ class: [unref(uiProp)?.childLinkWrapper, item.ui?.childLinkWrapper] })
                                              }, [
                                                createVNode("p", {
                                                  "data-slot": "childLinkLabel",
                                                  class: ui.value.childLinkLabel({ class: [unref(uiProp)?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })
                                                }, [
                                                  createTextVNode(toDisplayString(unref(get)(childItem, props.labelKey)) + " ", 1),
                                                  childItem.target === "_blank" && __props.externalIcon !== false ? (openBlock(), createBlock(_sfc_main$d, {
                                                    key: 0,
                                                    name: typeof __props.externalIcon === "string" ? __props.externalIcon : unref(appConfig).ui.icons.external,
                                                    "data-slot": "childLinkLabelExternalIcon",
                                                    class: ui.value.childLinkLabelExternalIcon({ class: [unref(uiProp)?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })
                                                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                                ], 2),
                                                childItem.description ? (openBlock(), createBlock("p", {
                                                  key: 0,
                                                  "data-slot": "childLinkDescription",
                                                  class: ui.value.childLinkDescription({ class: [unref(uiProp)?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })
                                                }, toDisplayString(childItem.description), 3)) : createCommentVNode("", true)
                                              ], 2)
                                            ]),
                                            _: 2
                                          }, 1040, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["active", "onSelect"])
                                    ]),
                                    _: 2
                                  }, 1040)
                                ], 2);
                              }), 128))
                            ], 2)
                          ])
                        ]),
                        _: 2
                      }, 1040, ["class"])) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1040)) : createCommentVNode("", true),
                  __props.orientation === "vertical" && item.children?.length && !__props.collapsed ? (openBlock(), createBlock(unref(AccordionContent_default), {
                    key: 2,
                    "data-slot": "content",
                    class: ui.value.content({ class: [unref(uiProp)?.content, item.ui?.content] })
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(AccordionRoot_default), mergeProps({
                        ...unref(accordionProps),
                        defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
                      }, {
                        as: "ul",
                        "data-slot": "childList",
                        class: ui.value.childList({ class: [unref(uiProp)?.childList, item.ui?.childList] })
                      }), {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(item.children, (childItem, childIndex) => {
                            return openBlock(), createBlock(unref(ReuseItemTemplate), {
                              key: childIndex,
                              item: childItem,
                              index: childIndex,
                              level: level + 1,
                              "list-index": listIndex,
                              "data-slot": "childItem",
                              class: ui.value.childItem({ class: [unref(uiProp)?.childItem, childItem.ui?.childItem] })
                            }, null, 8, ["item", "index", "level", "list-index", "class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1040, ["class"])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1040, ["value"]))
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(NavigationMenuRoot_default), mergeProps({
        ...unref(rootProps),
        ...__props.orientation === "horizontal" ? {
          modelValue: __props.modelValue,
          defaultValue: __props.defaultValue
        } : {},
        ..._ctx.$attrs
      }, {
        "data-collapsed": __props.collapsed,
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "list-leading", {}, null, _push2, _parent2, _scopeId);
            _push2(`<!--[-->`);
            ssrRenderList(lists.value, (list, listIndex) => {
              _push2(`<!--[-->`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.orientation === "vertical" ? unref(AccordionRoot_default) : unref(NavigationMenuList_default)), mergeProps({ ref_for: true }, __props.orientation === "vertical" && !__props.collapsed ? {
                ...unref(accordionProps),
                modelValue: __props.modelValue,
                defaultValue: __props.defaultValue ?? getAccordionDefaultValue(list, 0, listIndex)
              } : {}, {
                as: "ul",
                "data-slot": "list",
                class: ui.value.list({ class: unref(uiProp)?.list })
              }), {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(list, (item, index) => {
                      _push3(ssrRenderComponent(unref(ReuseItemTemplate), {
                        key: `list-${listIndex}-${index}`,
                        item,
                        index,
                        "list-index": listIndex,
                        "data-slot": "item",
                        class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item] })
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(list, (item, index) => {
                        return openBlock(), createBlock(unref(ReuseItemTemplate), {
                          key: `list-${listIndex}-${index}`,
                          item,
                          index,
                          "list-index": listIndex,
                          "data-slot": "item",
                          class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item] })
                        }, null, 8, ["item", "index", "list-index", "class"]);
                      }), 128))
                    ];
                  }
                }),
                _: 2
              }), _parent2, _scopeId);
              if (__props.orientation === "vertical" && listIndex < lists.value.length - 1) {
                _push2(`<div data-slot="separator" class="${ssrRenderClass(ui.value.separator({ class: unref(uiProp)?.separator }))}"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
            ssrRenderSlot(_ctx.$slots, "list-trailing", {}, null, _push2, _parent2, _scopeId);
            if (__props.orientation === "horizontal") {
              _push2(`<div data-slot="viewportWrapper" class="${ssrRenderClass(ui.value.viewportWrapper({ class: unref(uiProp)?.viewportWrapper }))}"${_scopeId}>`);
              if (__props.arrow) {
                _push2(ssrRenderComponent(unref(NavigationMenuIndicator_default), {
                  "data-slot": "indicator",
                  class: ui.value.indicator({ class: unref(uiProp)?.indicator })
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div data-slot="arrow" class="${ssrRenderClass(ui.value.arrow({ class: unref(uiProp)?.arrow }))}"${_scopeId2}></div>`);
                    } else {
                      return [
                        createVNode("div", {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(unref(NavigationMenuViewport_default), {
                "data-slot": "viewport",
                class: ui.value.viewport({ class: unref(uiProp)?.viewport })
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              renderSlot(_ctx.$slots, "list-leading"),
              (openBlock(true), createBlock(Fragment, null, renderList(lists.value, (list, listIndex) => {
                return openBlock(), createBlock(Fragment, {
                  key: `list-${listIndex}`
                }, [
                  (openBlock(), createBlock(resolveDynamicComponent(__props.orientation === "vertical" ? unref(AccordionRoot_default) : unref(NavigationMenuList_default)), mergeProps({ ref_for: true }, __props.orientation === "vertical" && !__props.collapsed ? {
                    ...unref(accordionProps),
                    modelValue: __props.modelValue,
                    defaultValue: __props.defaultValue ?? getAccordionDefaultValue(list, 0, listIndex)
                  } : {}, {
                    as: "ul",
                    "data-slot": "list",
                    class: ui.value.list({ class: unref(uiProp)?.list })
                  }), {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(list, (item, index) => {
                        return openBlock(), createBlock(unref(ReuseItemTemplate), {
                          key: `list-${listIndex}-${index}`,
                          item,
                          index,
                          "list-index": listIndex,
                          "data-slot": "item",
                          class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item] })
                        }, null, 8, ["item", "index", "list-index", "class"]);
                      }), 128))
                    ]),
                    _: 2
                  }, 1040, ["class"])),
                  __props.orientation === "vertical" && listIndex < lists.value.length - 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    "data-slot": "separator",
                    class: ui.value.separator({ class: unref(uiProp)?.separator })
                  }, null, 2)) : createCommentVNode("", true)
                ], 64);
              }), 128)),
              renderSlot(_ctx.$slots, "list-trailing"),
              __props.orientation === "horizontal" ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "viewportWrapper",
                class: ui.value.viewportWrapper({ class: unref(uiProp)?.viewportWrapper })
              }, [
                __props.arrow ? (openBlock(), createBlock(unref(NavigationMenuIndicator_default), {
                  key: 0,
                  "data-slot": "indicator",
                  class: ui.value.indicator({ class: unref(uiProp)?.indicator })
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      "data-slot": "arrow",
                      class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                    }, null, 2)
                  ]),
                  _: 1
                }, 8, ["class"])) : createCommentVNode("", true),
                createVNode(unref(NavigationMenuViewport_default), {
                  "data-slot": "viewport",
                  class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                }, null, 8, ["class"])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/NavigationMenu.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
function isAlreadyEscaped(str) {
  return /&(?:amp|lt|gt|quot|#39);/.test(str);
}
function sanitize(str) {
  if (isAlreadyEscaped(str)) {
    return str;
  }
  return escapeHTML(str);
}
function truncateHTMLFromStart(html, maxLength) {
  let truncated = "";
  let totalLength = 0;
  let insideTag = false;
  for (let i = html.length - 1; i >= 0; i--) {
    if (html[i] === ">") {
      insideTag = true;
    } else if (html[i] === "<") {
      insideTag = false;
      truncated = html[i] + truncated;
      continue;
    }
    if (!insideTag) {
      totalLength++;
    }
    if (totalLength <= maxLength) {
      truncated = html[i] + truncated;
    } else {
      truncated = "..." + truncated;
      break;
    }
  }
  return truncated;
}
function highlight(item, searchTerm, forceKey, omitKeys) {
  function generateHighlightedText(value, indices = []) {
    value = value || "";
    let content = "";
    let nextUnhighlightedRegionStartingIndex = 0;
    indices.forEach((region) => {
      if (region.length === 2 && region[0] === region[1]) {
        return;
      }
      const lastIndiceNextIndex = region[1] + 1;
      const isMatched = lastIndiceNextIndex - region[0] >= searchTerm.length;
      content += [
        sanitize(value.substring(nextUnhighlightedRegionStartingIndex, region[0])),
        isMatched && `<mark>`,
        sanitize(value.substring(region[0], lastIndiceNextIndex)),
        isMatched && "</mark>"
      ].filter(Boolean).join("");
      nextUnhighlightedRegionStartingIndex = lastIndiceNextIndex;
    });
    content += sanitize(value.substring(nextUnhighlightedRegionStartingIndex));
    const markIndex = content.indexOf("<mark>");
    if (markIndex !== -1) {
      content = truncateHTMLFromStart(content, content.length - markIndex);
    }
    return content;
  }
  if (!item.matches?.length) {
    return;
  }
  for (const match of item.matches) {
    if (forceKey && match.key !== forceKey) {
      continue;
    }
    if (omitKeys?.includes(match.key)) {
      continue;
    }
    return generateHighlightedText(match.value, match.indices);
  }
}
const theme$1 = {
  "slots": {
    "root": "flex flex-col min-h-0 min-w-0 divide-y divide-default",
    "input": "",
    "close": "",
    "back": "p-0",
    "content": "relative overflow-hidden flex flex-col",
    "footer": "p-1",
    "viewport": "relative scroll-py-1 overflow-y-auto flex-1 focus:outline-none",
    "group": "p-1 isolate",
    "empty": "text-center text-muted",
    "label": "font-semibold text-highlighted",
    "item": "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    "itemLeadingIcon": "shrink-0",
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemLeadingChip": "shrink-0",
    "itemLeadingChipSize": "",
    "itemTrailing": "ms-auto inline-flex items-center",
    "itemTrailingIcon": "shrink-0",
    "itemTrailingHighlightedIcon": "shrink-0 text-dimmed hidden group-data-highlighted:inline-flex",
    "itemTrailingKbds": "hidden lg:inline-flex items-center shrink-0",
    "itemTrailingKbdsSize": "",
    "itemWrapper": "flex-1 flex flex-col text-start min-w-0",
    "itemLabel": "truncate space-x-1 text-dimmed",
    "itemDescription": "truncate text-muted",
    "itemLabelBase": "text-highlighted [&>mark]:text-inverted [&>mark]:bg-primary",
    "itemLabelPrefix": "text-default",
    "itemLabelSuffix": "text-dimmed [&>mark]:text-inverted [&>mark]:bg-primary"
  },
  "variants": {
    "virtualize": {
      "true": {
        "viewport": "p-1 isolate"
      },
      "false": {
        "viewport": "divide-y divide-default"
      }
    },
    "size": {
      "xs": {
        "input": "[&>input]:h-10",
        "empty": "py-3 text-xs",
        "label": "p-1 text-[10px]/3 gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailing": "gap-1",
        "itemTrailingIcon": "size-4",
        "itemTrailingHighlightedIcon": "size-4",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "sm"
      },
      "sm": {
        "input": "[&>input]:h-11",
        "empty": "py-4 text-xs",
        "label": "p-1.5 text-[10px]/3 gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailing": "gap-1.5",
        "itemTrailingIcon": "size-4",
        "itemTrailingHighlightedIcon": "size-4",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "sm"
      },
      "md": {
        "input": "[&>input]:h-12",
        "empty": "py-6 text-sm",
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailing": "gap-1.5",
        "itemTrailingIcon": "size-5",
        "itemTrailingHighlightedIcon": "size-5",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "md"
      },
      "lg": {
        "input": "[&>input]:h-13",
        "empty": "py-7 text-sm",
        "label": "p-2 text-xs gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailing": "gap-2",
        "itemTrailingIcon": "size-5",
        "itemTrailingHighlightedIcon": "size-5",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "md"
      },
      "xl": {
        "input": "[&>input]:h-14",
        "empty": "py-8 text-base",
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemLeadingChip": "size-6",
        "itemLeadingChipSize": "lg",
        "itemTrailing": "gap-2",
        "itemTrailingIcon": "size-6",
        "itemTrailingHighlightedIcon": "size-6",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "lg"
      }
    },
    "active": {
      "true": {
        "item": "text-highlighted before:bg-elevated",
        "itemLeadingIcon": "text-default"
      },
      "false": {
        "item": [
          "text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50",
          "transition-colors before:transition-colors"
        ],
        "itemLeadingIcon": [
          "text-dimmed group-data-highlighted:not-group-data-disabled:text-default",
          "transition-colors"
        ]
      }
    },
    "loading": {
      "true": {
        "itemLeadingIcon": "animate-spin"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UCommandPalette",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    size: { type: null, required: false },
    icon: { type: null, required: false },
    trailingIcon: { type: null, required: false },
    selectedIcon: { type: null, required: false },
    childrenIcon: { type: null, required: false },
    placeholder: { type: String, required: false },
    autofocus: { type: Boolean, required: false, default: true },
    close: { type: [Boolean, Object], required: false },
    closeIcon: { type: null, required: false },
    back: { type: [Boolean, Object], required: false, default: true },
    backIcon: { type: null, required: false },
    input: { type: [Boolean, Object], required: false, default: true },
    groups: { type: Array, required: false },
    fuse: { type: Object, required: false },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    valueKey: { type: null, required: false },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    preserveGroupOrder: { type: Boolean, required: false, default: false },
    searchDelay: { type: Number, required: false, default: 0 },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    multiple: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    highlightOnHover: { type: Boolean, required: false, default: true },
    selectionBehavior: { type: String, required: false },
    by: { type: [String, Function], required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  }, {
    "searchTerm": { type: String, ...{ default: "" } },
    "searchTermModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue", "highlight", "entryFocus", "leave", "update:open"], ["update:searchTerm"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const searchTerm = useModel(__props, "searchTerm", { type: String, ...{ default: "" } });
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("commandPalette", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "disabled", "multiple", "modelValue", "defaultValue", "highlightOnHover", "by"), emits);
    const virtualizerProps = toRef(() => {
      if (!props.virtualize) return false;
      return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
        estimateSize: getEstimateSize(filteredItems.value, "md", props.descriptionKey, !!slots["item-description"])
      });
    });
    const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
      props: {
        item: {
          type: Object,
          required: true
        },
        group: {
          type: Object,
          required: false
        },
        index: {
          type: Number,
          required: false
        }
      }
    });
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.commandPalette || {} })({
      size: props.size,
      virtualize: !!props.virtualize
    }));
    const fuse = computed(() => defu({}, props.fuse, {
      fuseOptions: {
        ignoreLocation: true,
        threshold: 0.1,
        keys: [props.labelKey, "suffix"]
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true
    }));
    const history = ref([]);
    const placeholder = computed(() => history.value[history.value.length - 1]?.placeholder || props.placeholder || t("commandPalette.placeholder"));
    const groups = computed(() => history.value?.length ? [history.value[history.value.length - 1]] : props.groups);
    const items = computed(() => groups.value?.filter((group) => {
      if (!group.id) {
        console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`);
        return false;
      }
      if (group.ignoreFilter) {
        return false;
      }
      return true;
    })?.flatMap((group) => group.items?.map((item) => ({ ...item, group: group.id })) || []) || []);
    const fuseSearchTerm = refDebounced(searchTerm, () => props.searchDelay);
    const { results: fuseResults } = useFuse(fuseSearchTerm, items, fuse);
    const throttledFuseResults = refThrottled(fuseResults, 16, true);
    function processGroupItems(group, items2) {
      let processedItems = items2;
      if (group?.postFilter && typeof group.postFilter === "function") {
        processedItems = group.postFilter(fuseSearchTerm.value, processedItems);
      }
      return {
        ...group,
        items: processedItems.slice(0, fuse.value.resultLimit).map((item) => {
          return {
            ...item,
            labelHtml: highlight(item, fuseSearchTerm.value, props.labelKey),
            suffixHtml: highlight(item, fuseSearchTerm.value, void 0, [props.labelKey])
          };
        })
      };
    }
    const filteredGroups = computed(() => {
      const currentGroups = groups.value;
      const groupsById = throttledFuseResults.value.reduce((acc, result) => {
        const { item, matches } = result;
        if (!item.group) {
          return acc;
        }
        acc[item.group] ||= [];
        acc[item.group]?.push({ ...item, matches });
        return acc;
      }, {});
      if (props.preserveGroupOrder) {
        const processedGroups = [];
        for (const group of currentGroups || []) {
          if (!group.items?.length) {
            continue;
          }
          const items2 = group.ignoreFilter ? group.items : groupsById[group.id];
          if (!items2?.length) {
            continue;
          }
          const processedGroup = processGroupItems(group, items2);
          if (processedGroup.items?.length) {
            processedGroups.push(processedGroup);
          }
        }
        return processedGroups;
      }
      const fuseGroups = Object.entries(groupsById).map(([id, items2]) => {
        const group = currentGroups?.find((group2) => group2.id === id);
        if (!group) {
          return;
        }
        const processedGroup = processGroupItems(group, items2);
        return processedGroup.items?.length ? processedGroup : void 0;
      }).filter((group) => !!group);
      const nonFuseGroups = currentGroups?.map((group, index) => ({ ...group, index }))?.filter((group) => group.ignoreFilter && group.items?.length)?.map((group) => {
        const processedGroup = processGroupItems(group, group.items || []);
        return { ...processedGroup, index: group.index };
      })?.filter((group) => group.items?.length) || [];
      return nonFuseGroups.reduce((acc, group) => {
        acc.splice(group.index, 0, group);
        return acc;
      }, [...fuseGroups]);
    });
    const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group.items || []));
    const rootRef = useTemplateRef("rootRef");
    function navigate(item) {
      if (!item.children?.length) {
        return;
      }
      history.value.push({
        id: `history-${history.value.length}`,
        label: item.label,
        slot: item.slot,
        placeholder: item.placeholder,
        items: item.children
      });
      searchTerm.value = "";
      rootRef.value?.highlightFirstItem();
    }
    function navigateBack() {
      if (!history.value.length) {
        return;
      }
      history.value.pop();
      searchTerm.value = "";
      rootRef.value?.highlightFirstItem();
    }
    function onBackspace() {
      if (!searchTerm.value) {
        navigateBack();
      }
    }
    function onSelect(e, item) {
      if (item.children?.length) {
        e.preventDefault();
        navigate(item);
      } else {
        item.onSelect?.(e);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineItemTemplate), null, {
        default: withCtx(({ item, index, group }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$9$1, mergeProps(unref(pickLinkProps)(item), { custom: "" }), {
              default: withCtx(({ active, ...slotProps }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ListboxItem_default), {
                    value: props.valueKey ? unref(get)(item, props.valueKey) : unref(omit)(item, ["matches", "group", "onSelect", "labelHtml", "suffixHtml", "children"]),
                    disabled: item.disabled,
                    "as-child": "",
                    onSelect: ($event) => onSelect($event, item)
                  }, {
                    default: withCtx((_, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$a$1, mergeProps(slotProps, {
                          "data-slot": "item",
                          class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item, item.class], active: active || item.active })
                        }), {
                          default: withCtx((_2, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, item.slot || group?.slot || "item", {
                                item,
                                index,
                                ui: ui.value
                              }, () => {
                                ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => {
                                  if (item.loading) {
                                    _push5(ssrRenderComponent(_sfc_main$d, {
                                      name: __props.loadingIcon || unref(appConfig).ui.icons.loading,
                                      "data-slot": "itemLeadingIcon",
                                      class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })
                                    }, null, _parent5, _scopeId4));
                                  } else if (item.icon) {
                                    _push5(ssrRenderComponent(_sfc_main$d, {
                                      name: item.icon,
                                      "data-slot": "itemLeadingIcon",
                                      class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })
                                    }, null, _parent5, _scopeId4));
                                  } else if (item.avatar) {
                                    _push5(ssrRenderComponent(_sfc_main$b$1, mergeProps({
                                      size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                    }, item.avatar, {
                                      "data-slot": "itemLeadingAvatar",
                                      class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })
                                    }), null, _parent5, _scopeId4));
                                  } else if (item.chip) {
                                    _push5(ssrRenderComponent(_sfc_main$c$1, mergeProps({
                                      size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                      inset: "",
                                      standalone: ""
                                    }, item.chip, {
                                      "data-slot": "itemLeadingChip",
                                      class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })
                                    }), null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                }, _push5, _parent5, _scopeId4);
                                if (item.prefix || (item.labelHtml || unref(get)(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`])) {
                                  _push5(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, item.ui?.itemWrapper] }))}"${_scopeId4}><span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, item.ui?.itemLabel], active: active || item.active }))}"${_scopeId4}>`);
                                  ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`, {
                                    item,
                                    index,
                                    ui: ui.value
                                  }, () => {
                                    if (item.prefix) {
                                      _push5(`<span data-slot="itemLabelPrefix" class="${ssrRenderClass(ui.value.itemLabelPrefix({ class: [unref(uiProp)?.itemLabelPrefix, item.ui?.itemLabelPrefix] }))}"${_scopeId4}>${ssrInterpolate(item.prefix)}</span>`);
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    if (item.labelHtml) {
                                      _push5(`<span data-slot="itemLabelBase" class="${ssrRenderClass(ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }))}"${_scopeId4}>${item.labelHtml ?? ""}</span>`);
                                    } else {
                                      _push5(`<span data-slot="itemLabelBase" class="${ssrRenderClass(ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }))}"${_scopeId4}>${ssrInterpolate(unref(get)(item, props.labelKey))}</span>`);
                                    }
                                    if (item.suffixHtml) {
                                      _push5(`<span data-slot="itemLabelSuffix" class="${ssrRenderClass(ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }))}"${_scopeId4}>${item.suffixHtml ?? ""}</span>`);
                                    } else if (item.suffix) {
                                      _push5(`<span data-slot="itemLabelSuffix" class="${ssrRenderClass(ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }))}"${_scopeId4}>${ssrInterpolate(item.suffix)}</span>`);
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                  }, _push5, _parent5, _scopeId4);
                                  _push5(`</span>`);
                                  if (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]) {
                                    _push5(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, item.ui?.itemDescription] }))}"${_scopeId4}>`);
                                    ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`, {
                                      item,
                                      index,
                                      ui: ui.value
                                    }, () => {
                                      _push5(`${ssrInterpolate(unref(get)(item, props.descriptionKey))}`);
                                    }, _push5, _parent5, _scopeId4);
                                    _push5(`</span>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</span>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, item.ui?.itemTrailing] }))}"${_scopeId4}>`);
                                ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => {
                                  if (item.children && item.children.length > 0) {
                                    _push5(ssrRenderComponent(_sfc_main$d, {
                                      name: __props.childrenIcon || unref(appConfig).ui.icons.chevronRight,
                                      "data-slot": "itemTrailingIcon",
                                      class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                    }, null, _parent5, _scopeId4));
                                  } else if (item.kbds?.length) {
                                    _push5(`<span data-slot="itemTrailingKbds" class="${ssrRenderClass(ui.value.itemTrailingKbds({ class: [unref(uiProp)?.itemTrailingKbds, item.ui?.itemTrailingKbds] }))}"${_scopeId4}><!--[-->`);
                                    ssrRenderList(item.kbds, (kbd, kbdIndex) => {
                                      _push5(ssrRenderComponent(_sfc_main$4$1, mergeProps({
                                        key: kbdIndex,
                                        size: item.ui?.itemTrailingKbdsSize || unref(uiProp)?.itemTrailingKbdsSize || ui.value.itemTrailingKbdsSize()
                                      }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent5, _scopeId4));
                                    });
                                    _push5(`<!--]--></span>`);
                                  } else if (group?.highlightedIcon) {
                                    _push5(ssrRenderComponent(_sfc_main$d, {
                                      name: group.highlightedIcon,
                                      "data-slot": "itemTrailingHighlightedIcon",
                                      class: ui.value.itemTrailingHighlightedIcon({ class: [unref(uiProp)?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                }, _push5, _parent5, _scopeId4);
                                if (!item.children?.length) {
                                  _push5(ssrRenderComponent(unref(ListboxItemIndicator_default), { "as-child": "" }, {
                                    default: withCtx((_3, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_sfc_main$d, {
                                          name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                          "data-slot": "itemTrailingIcon",
                                          class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                        }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_sfc_main$d, {
                                            name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                            "data-slot": "itemTrailingIcon",
                                            class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                          }, null, 8, ["name", "class"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</span>`);
                              }, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                renderSlot(_ctx.$slots, item.slot || group?.slot || "item", {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`, {
                                    item,
                                    index,
                                    ui: ui.value
                                  }, () => [
                                    item.loading ? (openBlock(), createBlock(_sfc_main$d, {
                                      key: 0,
                                      name: __props.loadingIcon || unref(appConfig).ui.icons.loading,
                                      "data-slot": "itemLeadingIcon",
                                      class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })
                                    }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                      key: 1,
                                      name: item.icon,
                                      "data-slot": "itemLeadingIcon",
                                      class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })
                                    }, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                                      key: 2,
                                      size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                    }, item.avatar, {
                                      "data-slot": "itemLeadingAvatar",
                                      class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })
                                    }), null, 16, ["size", "class"])) : item.chip ? (openBlock(), createBlock(_sfc_main$c$1, mergeProps({
                                      key: 3,
                                      size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                      inset: "",
                                      standalone: ""
                                    }, item.chip, {
                                      "data-slot": "itemLeadingChip",
                                      class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })
                                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                  ]),
                                  item.prefix || (item.labelHtml || unref(get)(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]) ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "data-slot": "itemWrapper",
                                    class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, item.ui?.itemWrapper] })
                                  }, [
                                    createVNode("span", {
                                      "data-slot": "itemLabel",
                                      class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, item.ui?.itemLabel], active: active || item.active })
                                    }, [
                                      renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`, {
                                        item,
                                        index,
                                        ui: ui.value
                                      }, () => [
                                        item.prefix ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          "data-slot": "itemLabelPrefix",
                                          class: ui.value.itemLabelPrefix({ class: [unref(uiProp)?.itemLabelPrefix, item.ui?.itemLabelPrefix] })
                                        }, toDisplayString(item.prefix), 3)) : createCommentVNode("", true),
                                        item.labelHtml ? (openBlock(), createBlock("span", {
                                          key: 1,
                                          "data-slot": "itemLabelBase",
                                          class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }),
                                          innerHTML: item.labelHtml
                                        }, null, 10, ["innerHTML"])) : (openBlock(), createBlock("span", {
                                          key: 2,
                                          "data-slot": "itemLabelBase",
                                          class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })
                                        }, toDisplayString(unref(get)(item, props.labelKey)), 3)),
                                        item.suffixHtml ? (openBlock(), createBlock("span", {
                                          key: 3,
                                          "data-slot": "itemLabelSuffix",
                                          class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }),
                                          innerHTML: item.suffixHtml
                                        }, null, 10, ["innerHTML"])) : item.suffix ? (openBlock(), createBlock("span", {
                                          key: 4,
                                          "data-slot": "itemLabelSuffix",
                                          class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })
                                        }, toDisplayString(item.suffix), 3)) : createCommentVNode("", true)
                                      ])
                                    ], 2),
                                    unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`] ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      "data-slot": "itemDescription",
                                      class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, item.ui?.itemDescription] })
                                    }, [
                                      renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`, {
                                        item,
                                        index,
                                        ui: ui.value
                                      }, () => [
                                        createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                      ])
                                    ], 2)) : createCommentVNode("", true)
                                  ], 2)) : createCommentVNode("", true),
                                  createVNode("span", {
                                    "data-slot": "itemTrailing",
                                    class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, item.ui?.itemTrailing] })
                                  }, [
                                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`, {
                                      item,
                                      index,
                                      ui: ui.value
                                    }, () => [
                                      item.children && item.children.length > 0 ? (openBlock(), createBlock(_sfc_main$d, {
                                        key: 0,
                                        name: __props.childrenIcon || unref(appConfig).ui.icons.chevronRight,
                                        "data-slot": "itemTrailingIcon",
                                        class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                      }, null, 8, ["name", "class"])) : item.kbds?.length ? (openBlock(), createBlock("span", {
                                        key: 1,
                                        "data-slot": "itemTrailingKbds",
                                        class: ui.value.itemTrailingKbds({ class: [unref(uiProp)?.itemTrailingKbds, item.ui?.itemTrailingKbds] })
                                      }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(item.kbds, (kbd, kbdIndex) => {
                                          return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                            key: kbdIndex,
                                            size: item.ui?.itemTrailingKbdsSize || unref(uiProp)?.itemTrailingKbdsSize || ui.value.itemTrailingKbdsSize()
                                          }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                        }), 128))
                                      ], 2)) : group?.highlightedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                                        key: 2,
                                        name: group.highlightedIcon,
                                        "data-slot": "itemTrailingHighlightedIcon",
                                        class: ui.value.itemTrailingHighlightedIcon({ class: [unref(uiProp)?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })
                                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                    ]),
                                    !item.children?.length ? (openBlock(), createBlock(unref(ListboxItemIndicator_default), {
                                      key: 0,
                                      "as-child": ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$d, {
                                          name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                          "data-slot": "itemTrailingIcon",
                                          class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                        }, null, 8, ["name", "class"])
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ], 2)
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                            "data-slot": "item",
                            class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item, item.class], active: active || item.active })
                          }), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, item.slot || group?.slot || "item", {
                                item,
                                index,
                                ui: ui.value
                              }, () => [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  item.loading ? (openBlock(), createBlock(_sfc_main$d, {
                                    key: 0,
                                    name: __props.loadingIcon || unref(appConfig).ui.icons.loading,
                                    "data-slot": "itemLeadingIcon",
                                    class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })
                                  }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                    key: 1,
                                    name: item.icon,
                                    "data-slot": "itemLeadingIcon",
                                    class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })
                                  }, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                                    key: 2,
                                    size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                  }, item.avatar, {
                                    "data-slot": "itemLeadingAvatar",
                                    class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })
                                  }), null, 16, ["size", "class"])) : item.chip ? (openBlock(), createBlock(_sfc_main$c$1, mergeProps({
                                    key: 3,
                                    size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                    inset: "",
                                    standalone: ""
                                  }, item.chip, {
                                    "data-slot": "itemLeadingChip",
                                    class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })
                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                ]),
                                item.prefix || (item.labelHtml || unref(get)(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]) ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "data-slot": "itemWrapper",
                                  class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, item.ui?.itemWrapper] })
                                }, [
                                  createVNode("span", {
                                    "data-slot": "itemLabel",
                                    class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, item.ui?.itemLabel], active: active || item.active })
                                  }, [
                                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`, {
                                      item,
                                      index,
                                      ui: ui.value
                                    }, () => [
                                      item.prefix ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        "data-slot": "itemLabelPrefix",
                                        class: ui.value.itemLabelPrefix({ class: [unref(uiProp)?.itemLabelPrefix, item.ui?.itemLabelPrefix] })
                                      }, toDisplayString(item.prefix), 3)) : createCommentVNode("", true),
                                      item.labelHtml ? (openBlock(), createBlock("span", {
                                        key: 1,
                                        "data-slot": "itemLabelBase",
                                        class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }),
                                        innerHTML: item.labelHtml
                                      }, null, 10, ["innerHTML"])) : (openBlock(), createBlock("span", {
                                        key: 2,
                                        "data-slot": "itemLabelBase",
                                        class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })
                                      }, toDisplayString(unref(get)(item, props.labelKey)), 3)),
                                      item.suffixHtml ? (openBlock(), createBlock("span", {
                                        key: 3,
                                        "data-slot": "itemLabelSuffix",
                                        class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }),
                                        innerHTML: item.suffixHtml
                                      }, null, 10, ["innerHTML"])) : item.suffix ? (openBlock(), createBlock("span", {
                                        key: 4,
                                        "data-slot": "itemLabelSuffix",
                                        class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })
                                      }, toDisplayString(item.suffix), 3)) : createCommentVNode("", true)
                                    ])
                                  ], 2),
                                  unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`] ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "data-slot": "itemDescription",
                                    class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, item.ui?.itemDescription] })
                                  }, [
                                    renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`, {
                                      item,
                                      index,
                                      ui: ui.value
                                    }, () => [
                                      createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                    ])
                                  ], 2)) : createCommentVNode("", true)
                                ], 2)) : createCommentVNode("", true),
                                createVNode("span", {
                                  "data-slot": "itemTrailing",
                                  class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, item.ui?.itemTrailing] })
                                }, [
                                  renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`, {
                                    item,
                                    index,
                                    ui: ui.value
                                  }, () => [
                                    item.children && item.children.length > 0 ? (openBlock(), createBlock(_sfc_main$d, {
                                      key: 0,
                                      name: __props.childrenIcon || unref(appConfig).ui.icons.chevronRight,
                                      "data-slot": "itemTrailingIcon",
                                      class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                    }, null, 8, ["name", "class"])) : item.kbds?.length ? (openBlock(), createBlock("span", {
                                      key: 1,
                                      "data-slot": "itemTrailingKbds",
                                      class: ui.value.itemTrailingKbds({ class: [unref(uiProp)?.itemTrailingKbds, item.ui?.itemTrailingKbds] })
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(item.kbds, (kbd, kbdIndex) => {
                                        return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                          key: kbdIndex,
                                          size: item.ui?.itemTrailingKbdsSize || unref(uiProp)?.itemTrailingKbdsSize || ui.value.itemTrailingKbdsSize()
                                        }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                      }), 128))
                                    ], 2)) : group?.highlightedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                                      key: 2,
                                      name: group.highlightedIcon,
                                      "data-slot": "itemTrailingHighlightedIcon",
                                      class: ui.value.itemTrailingHighlightedIcon({ class: [unref(uiProp)?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })
                                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                  ]),
                                  !item.children?.length ? (openBlock(), createBlock(unref(ListboxItemIndicator_default), {
                                    key: 0,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$d, {
                                        name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                        "data-slot": "itemTrailingIcon",
                                        class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                      }, null, 8, ["name", "class"])
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ], 2)
                              ])
                            ]),
                            _: 2
                          }, 1040, ["class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ListboxItem_default), {
                      value: props.valueKey ? unref(get)(item, props.valueKey) : unref(omit)(item, ["matches", "group", "onSelect", "labelHtml", "suffixHtml", "children"]),
                      disabled: item.disabled,
                      "as-child": "",
                      onSelect: ($event) => onSelect($event, item)
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                          "data-slot": "item",
                          class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item, item.class], active: active || item.active })
                        }), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, item.slot || group?.slot || "item", {
                              item,
                              index,
                              ui: ui.value
                            }, () => [
                              renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`, {
                                item,
                                index,
                                ui: ui.value
                              }, () => [
                                item.loading ? (openBlock(), createBlock(_sfc_main$d, {
                                  key: 0,
                                  name: __props.loadingIcon || unref(appConfig).ui.icons.loading,
                                  "data-slot": "itemLeadingIcon",
                                  class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })
                                }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                  key: 1,
                                  name: item.icon,
                                  "data-slot": "itemLeadingIcon",
                                  class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })
                                }, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                                  key: 2,
                                  size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                }, item.avatar, {
                                  "data-slot": "itemLeadingAvatar",
                                  class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })
                                }), null, 16, ["size", "class"])) : item.chip ? (openBlock(), createBlock(_sfc_main$c$1, mergeProps({
                                  key: 3,
                                  size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                  inset: "",
                                  standalone: ""
                                }, item.chip, {
                                  "data-slot": "itemLeadingChip",
                                  class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })
                                }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                              ]),
                              item.prefix || (item.labelHtml || unref(get)(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]) ? (openBlock(), createBlock("span", {
                                key: 0,
                                "data-slot": "itemWrapper",
                                class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, item.ui?.itemWrapper] })
                              }, [
                                createVNode("span", {
                                  "data-slot": "itemLabel",
                                  class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, item.ui?.itemLabel], active: active || item.active })
                                }, [
                                  renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`, {
                                    item,
                                    index,
                                    ui: ui.value
                                  }, () => [
                                    item.prefix ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      "data-slot": "itemLabelPrefix",
                                      class: ui.value.itemLabelPrefix({ class: [unref(uiProp)?.itemLabelPrefix, item.ui?.itemLabelPrefix] })
                                    }, toDisplayString(item.prefix), 3)) : createCommentVNode("", true),
                                    item.labelHtml ? (openBlock(), createBlock("span", {
                                      key: 1,
                                      "data-slot": "itemLabelBase",
                                      class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }),
                                      innerHTML: item.labelHtml
                                    }, null, 10, ["innerHTML"])) : (openBlock(), createBlock("span", {
                                      key: 2,
                                      "data-slot": "itemLabelBase",
                                      class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })
                                    }, toDisplayString(unref(get)(item, props.labelKey)), 3)),
                                    item.suffixHtml ? (openBlock(), createBlock("span", {
                                      key: 3,
                                      "data-slot": "itemLabelSuffix",
                                      class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }),
                                      innerHTML: item.suffixHtml
                                    }, null, 10, ["innerHTML"])) : item.suffix ? (openBlock(), createBlock("span", {
                                      key: 4,
                                      "data-slot": "itemLabelSuffix",
                                      class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })
                                    }, toDisplayString(item.suffix), 3)) : createCommentVNode("", true)
                                  ])
                                ], 2),
                                unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`] ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "data-slot": "itemDescription",
                                  class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, item.ui?.itemDescription] })
                                }, [
                                  renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`, {
                                    item,
                                    index,
                                    ui: ui.value
                                  }, () => [
                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                  ])
                                ], 2)) : createCommentVNode("", true)
                              ], 2)) : createCommentVNode("", true),
                              createVNode("span", {
                                "data-slot": "itemTrailing",
                                class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, item.ui?.itemTrailing] })
                              }, [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  item.children && item.children.length > 0 ? (openBlock(), createBlock(_sfc_main$d, {
                                    key: 0,
                                    name: __props.childrenIcon || unref(appConfig).ui.icons.chevronRight,
                                    "data-slot": "itemTrailingIcon",
                                    class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                  }, null, 8, ["name", "class"])) : item.kbds?.length ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    "data-slot": "itemTrailingKbds",
                                    class: ui.value.itemTrailingKbds({ class: [unref(uiProp)?.itemTrailingKbds, item.ui?.itemTrailingKbds] })
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(item.kbds, (kbd, kbdIndex) => {
                                      return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                        key: kbdIndex,
                                        size: item.ui?.itemTrailingKbdsSize || unref(uiProp)?.itemTrailingKbdsSize || ui.value.itemTrailingKbdsSize()
                                      }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                    }), 128))
                                  ], 2)) : group?.highlightedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                                    key: 2,
                                    name: group.highlightedIcon,
                                    "data-slot": "itemTrailingHighlightedIcon",
                                    class: ui.value.itemTrailingHighlightedIcon({ class: [unref(uiProp)?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })
                                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                                ]),
                                !item.children?.length ? (openBlock(), createBlock(unref(ListboxItemIndicator_default), {
                                  key: 0,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$d, {
                                      name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                      "data-slot": "itemTrailingIcon",
                                      class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                    }, null, 8, ["name", "class"])
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true)
                              ], 2)
                            ])
                          ]),
                          _: 2
                        }, 1040, ["class"])
                      ]),
                      _: 2
                    }, 1032, ["value", "disabled", "onSelect"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$9$1, mergeProps(unref(pickLinkProps)(item), { custom: "" }), {
                default: withCtx(({ active, ...slotProps }) => [
                  createVNode(unref(ListboxItem_default), {
                    value: props.valueKey ? unref(get)(item, props.valueKey) : unref(omit)(item, ["matches", "group", "onSelect", "labelHtml", "suffixHtml", "children"]),
                    disabled: item.disabled,
                    "as-child": "",
                    onSelect: ($event) => onSelect($event, item)
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$a$1, mergeProps(slotProps, {
                        "data-slot": "item",
                        class: ui.value.item({ class: [unref(uiProp)?.item, item.ui?.item, item.class], active: active || item.active })
                      }), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, item.slot || group?.slot || "item", {
                            item,
                            index,
                            ui: ui.value
                          }, () => [
                            renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`, {
                              item,
                              index,
                              ui: ui.value
                            }, () => [
                              item.loading ? (openBlock(), createBlock(_sfc_main$d, {
                                key: 0,
                                name: __props.loadingIcon || unref(appConfig).ui.icons.loading,
                                "data-slot": "itemLeadingIcon",
                                class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })
                              }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                key: 1,
                                name: item.icon,
                                "data-slot": "itemLeadingIcon",
                                class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })
                              }, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                                key: 2,
                                size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                              }, item.avatar, {
                                "data-slot": "itemLeadingAvatar",
                                class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })
                              }), null, 16, ["size", "class"])) : item.chip ? (openBlock(), createBlock(_sfc_main$c$1, mergeProps({
                                key: 3,
                                size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                inset: "",
                                standalone: ""
                              }, item.chip, {
                                "data-slot": "itemLeadingChip",
                                class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })
                              }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                            ]),
                            item.prefix || (item.labelHtml || unref(get)(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]) ? (openBlock(), createBlock("span", {
                              key: 0,
                              "data-slot": "itemWrapper",
                              class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, item.ui?.itemWrapper] })
                            }, [
                              createVNode("span", {
                                "data-slot": "itemLabel",
                                class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, item.ui?.itemLabel], active: active || item.active })
                              }, [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  item.prefix ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "data-slot": "itemLabelPrefix",
                                    class: ui.value.itemLabelPrefix({ class: [unref(uiProp)?.itemLabelPrefix, item.ui?.itemLabelPrefix] })
                                  }, toDisplayString(item.prefix), 3)) : createCommentVNode("", true),
                                  item.labelHtml ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    "data-slot": "itemLabelBase",
                                    class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active }),
                                    innerHTML: item.labelHtml
                                  }, null, 10, ["innerHTML"])) : (openBlock(), createBlock("span", {
                                    key: 2,
                                    "data-slot": "itemLabelBase",
                                    class: ui.value.itemLabelBase({ class: [unref(uiProp)?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })
                                  }, toDisplayString(unref(get)(item, props.labelKey)), 3)),
                                  item.suffixHtml ? (openBlock(), createBlock("span", {
                                    key: 3,
                                    "data-slot": "itemLabelSuffix",
                                    class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active }),
                                    innerHTML: item.suffixHtml
                                  }, null, 10, ["innerHTML"])) : item.suffix ? (openBlock(), createBlock("span", {
                                    key: 4,
                                    "data-slot": "itemLabelSuffix",
                                    class: ui.value.itemLabelSuffix({ class: [unref(uiProp)?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })
                                  }, toDisplayString(item.suffix), 3)) : createCommentVNode("", true)
                                ])
                              ], 2),
                              unref(get)(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`] ? (openBlock(), createBlock("span", {
                                key: 0,
                                "data-slot": "itemDescription",
                                class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, item.ui?.itemDescription] })
                              }, [
                                renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`, {
                                  item,
                                  index,
                                  ui: ui.value
                                }, () => [
                                  createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                ])
                              ], 2)) : createCommentVNode("", true)
                            ], 2)) : createCommentVNode("", true),
                            createVNode("span", {
                              "data-slot": "itemTrailing",
                              class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, item.ui?.itemTrailing] })
                            }, [
                              renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`, {
                                item,
                                index,
                                ui: ui.value
                              }, () => [
                                item.children && item.children.length > 0 ? (openBlock(), createBlock(_sfc_main$d, {
                                  key: 0,
                                  name: __props.childrenIcon || unref(appConfig).ui.icons.chevronRight,
                                  "data-slot": "itemTrailingIcon",
                                  class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                }, null, 8, ["name", "class"])) : item.kbds?.length ? (openBlock(), createBlock("span", {
                                  key: 1,
                                  "data-slot": "itemTrailingKbds",
                                  class: ui.value.itemTrailingKbds({ class: [unref(uiProp)?.itemTrailingKbds, item.ui?.itemTrailingKbds] })
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(item.kbds, (kbd, kbdIndex) => {
                                    return openBlock(), createBlock(_sfc_main$4$1, mergeProps({
                                      key: kbdIndex,
                                      size: item.ui?.itemTrailingKbdsSize || unref(uiProp)?.itemTrailingKbdsSize || ui.value.itemTrailingKbdsSize()
                                    }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                                  }), 128))
                                ], 2)) : group?.highlightedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                                  key: 2,
                                  name: group.highlightedIcon,
                                  "data-slot": "itemTrailingHighlightedIcon",
                                  class: ui.value.itemTrailingHighlightedIcon({ class: [unref(uiProp)?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })
                                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                              ]),
                              !item.children?.length ? (openBlock(), createBlock(unref(ListboxItemIndicator_default), {
                                key: 0,
                                "as-child": ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$d, {
                                    name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                    "data-slot": "itemTrailingIcon",
                                    class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, item.ui?.itemTrailingIcon] })
                                  }, null, 8, ["name", "class"])
                                ]),
                                _: 2
                              }, 1024)) : createCommentVNode("", true)
                            ], 2)
                          ])
                        ]),
                        _: 2
                      }, 1040, ["class"])
                    ]),
                    _: 2
                  }, 1032, ["value", "disabled", "onSelect"])
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(ListboxRoot_default), mergeProps({ ...unref(rootProps), ..._ctx.$attrs }, {
        ref_key: "rootRef",
        ref: rootRef,
        "selection-behavior": __props.selectionBehavior,
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.input) {
              _push2(ssrRenderComponent(unref(ListboxFilter_default), {
                modelValue: searchTerm.value,
                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                "as-child": ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$g, mergeProps({
                      variant: "none",
                      size: __props.size
                    }, typeof props.input === "object" ? props.input : {}, {
                      placeholder: placeholder.value,
                      autofocus: __props.autofocus,
                      loading: __props.loading,
                      "loading-icon": __props.loadingIcon,
                      "trailing-icon": __props.trailingIcon,
                      icon: __props.icon || unref(appConfig).ui.icons.search,
                      "data-slot": "input",
                      class: ui.value.input({ class: unref(uiProp)?.input }),
                      onKeydown: onBackspace
                    }), createSlots({ _: 2 }, [
                      history.value?.length && (__props.back || !!slots.back) ? {
                        name: "leading",
                        fn: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "back", { ui: ui.value }, () => {
                              _push4(ssrRenderComponent(_sfc_main$8$1, mergeProps({
                                size: __props.size,
                                icon: __props.backIcon || unref(appConfig).ui.icons.arrowLeft,
                                color: "neutral",
                                variant: "link",
                                "aria-label": unref(t)("commandPalette.back")
                              }, typeof __props.back === "object" ? __props.back : {}, {
                                "data-slot": "back",
                                class: ui.value.back({ class: unref(uiProp)?.back }),
                                onClick: navigateBack
                              }), null, _parent4, _scopeId3));
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "back", { ui: ui.value }, () => [
                                createVNode(_sfc_main$8$1, mergeProps({
                                  size: __props.size,
                                  icon: __props.backIcon || unref(appConfig).ui.icons.arrowLeft,
                                  color: "neutral",
                                  variant: "link",
                                  "aria-label": unref(t)("commandPalette.back")
                                }, typeof __props.back === "object" ? __props.back : {}, {
                                  "data-slot": "back",
                                  class: ui.value.back({ class: unref(uiProp)?.back }),
                                  onClick: navigateBack
                                }), null, 16, ["size", "icon", "aria-label", "class"])
                              ])
                            ];
                          }
                        }),
                        key: "0"
                      } : void 0,
                      __props.close || !!slots.close ? {
                        name: "trailing",
                        fn: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                              if (__props.close) {
                                _push4(ssrRenderComponent(_sfc_main$8$1, mergeProps({
                                  size: __props.size,
                                  icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                  color: "neutral",
                                  variant: "ghost",
                                  "aria-label": unref(t)("commandPalette.close")
                                }, typeof __props.close === "object" ? __props.close : {}, {
                                  "data-slot": "close",
                                  class: ui.value.close({ class: unref(uiProp)?.close }),
                                  onClick: ($event) => emits("update:open", false)
                                }), null, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                __props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                  key: 0,
                                  size: __props.size,
                                  icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                  color: "neutral",
                                  variant: "ghost",
                                  "aria-label": unref(t)("commandPalette.close")
                                }, typeof __props.close === "object" ? __props.close : {}, {
                                  "data-slot": "close",
                                  class: ui.value.close({ class: unref(uiProp)?.close }),
                                  onClick: ($event) => emits("update:open", false)
                                }), null, 16, ["size", "icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                              ])
                            ];
                          }
                        }),
                        key: "1"
                      } : void 0
                    ]), _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$g, mergeProps({
                        variant: "none",
                        size: __props.size
                      }, typeof props.input === "object" ? props.input : {}, {
                        placeholder: placeholder.value,
                        autofocus: __props.autofocus,
                        loading: __props.loading,
                        "loading-icon": __props.loadingIcon,
                        "trailing-icon": __props.trailingIcon,
                        icon: __props.icon || unref(appConfig).ui.icons.search,
                        "data-slot": "input",
                        class: ui.value.input({ class: unref(uiProp)?.input }),
                        onKeydown: withKeys(onBackspace, ["backspace"])
                      }), createSlots({ _: 2 }, [
                        history.value?.length && (__props.back || !!slots.back) ? {
                          name: "leading",
                          fn: withCtx(() => [
                            renderSlot(_ctx.$slots, "back", { ui: ui.value }, () => [
                              createVNode(_sfc_main$8$1, mergeProps({
                                size: __props.size,
                                icon: __props.backIcon || unref(appConfig).ui.icons.arrowLeft,
                                color: "neutral",
                                variant: "link",
                                "aria-label": unref(t)("commandPalette.back")
                              }, typeof __props.back === "object" ? __props.back : {}, {
                                "data-slot": "back",
                                class: ui.value.back({ class: unref(uiProp)?.back }),
                                onClick: navigateBack
                              }), null, 16, ["size", "icon", "aria-label", "class"])
                            ])
                          ]),
                          key: "0"
                        } : void 0,
                        __props.close || !!slots.close ? {
                          name: "trailing",
                          fn: withCtx(() => [
                            renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                              __props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                                key: 0,
                                size: __props.size,
                                icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                color: "neutral",
                                variant: "ghost",
                                "aria-label": unref(t)("commandPalette.close")
                              }, typeof __props.close === "object" ? __props.close : {}, {
                                "data-slot": "close",
                                class: ui.value.close({ class: unref(uiProp)?.close }),
                                onClick: ($event) => emits("update:open", false)
                              }), null, 16, ["size", "icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                            ])
                          ]),
                          key: "1"
                        } : void 0
                      ]), 1040, ["size", "placeholder", "autofocus", "loading", "loading-icon", "trailing-icon", "icon", "class"])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(ListboxContent_default), {
              "data-slot": "content",
              class: ui.value.content({ class: unref(uiProp)?.content })
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (filteredGroups.value?.length) {
                    _push3(`<div role="presentation" data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: unref(uiProp)?.viewport }))}"${_scopeId2}>`);
                    if (!!__props.virtualize) {
                      _push3(ssrRenderComponent(unref(ListboxVirtualizer_default), mergeProps({
                        options: filteredItems.value,
                        "text-content": (item2) => unref(get)(item2, props.labelKey)
                      }, virtualizerProps.value), {
                        default: withCtx(({ option: item, virtualItem }, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(ReuseItemTemplate), {
                              item,
                              index: virtualItem.index
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(ReuseItemTemplate), {
                                item,
                                index: virtualItem.index
                              }, null, 8, ["item", "index"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!--[-->`);
                      ssrRenderList(filteredGroups.value, (group) => {
                        _push3(ssrRenderComponent(unref(ListboxGroup_default), {
                          key: `group-${group.id}`,
                          "data-slot": "group",
                          class: ui.value.group({ class: unref(uiProp)?.group })
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (unref(get)(group, props.labelKey) || !!slots[group.slot ? `${group.slot}-group-label` : "group-label"]) {
                                _push4(ssrRenderComponent(unref(ListboxGroupLabel_default), {
                                  "data-slot": "label",
                                  class: ui.value.label({ class: unref(uiProp)?.label })
                                }, {
                                  default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, group.slot ? `${group.slot}-group-label` : "group-label", {
                                        group,
                                        label: unref(get)(group, props.labelKey),
                                        ui: ui.value
                                      }, () => {
                                        _push5(`${ssrInterpolate(unref(get)(group, props.labelKey))}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, group.slot ? `${group.slot}-group-label` : "group-label", {
                                          group,
                                          label: unref(get)(group, props.labelKey),
                                          ui: ui.value
                                        }, () => [
                                          createTextVNode(toDisplayString(unref(get)(group, props.labelKey)), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`<!--[-->`);
                              ssrRenderList(group.items, (item, index) => {
                                _push4(ssrRenderComponent(unref(ReuseItemTemplate), {
                                  key: `group-${group.id}-${index}`,
                                  item,
                                  index,
                                  group
                                }, null, _parent4, _scopeId3));
                              });
                              _push4(`<!--]-->`);
                            } else {
                              return [
                                unref(get)(group, props.labelKey) || !!slots[group.slot ? `${group.slot}-group-label` : "group-label"] ? (openBlock(), createBlock(unref(ListboxGroupLabel_default), {
                                  key: 0,
                                  "data-slot": "label",
                                  class: ui.value.label({ class: unref(uiProp)?.label })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, group.slot ? `${group.slot}-group-label` : "group-label", {
                                      group,
                                      label: unref(get)(group, props.labelKey),
                                      ui: ui.value
                                    }, () => [
                                      createTextVNode(toDisplayString(unref(get)(group, props.labelKey)), 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["class"])) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, index) => {
                                  return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                    key: `group-${group.id}-${index}`,
                                    item,
                                    index,
                                    group
                                  }, null, 8, ["item", "index", "group"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]-->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div data-slot="empty" class="${ssrRenderClass(ui.value.empty({ class: unref(uiProp)?.empty }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
                      _push3(`${ssrInterpolate(searchTerm.value ? unref(t)("commandPalette.noMatch", { searchTerm: searchTerm.value }) : unref(t)("commandPalette.noData"))}`);
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    filteredGroups.value?.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      role: "presentation",
                      "data-slot": "viewport",
                      class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                    }, [
                      !!__props.virtualize ? (openBlock(), createBlock(unref(ListboxVirtualizer_default), mergeProps({
                        key: 0,
                        options: filteredItems.value,
                        "text-content": (item2) => unref(get)(item2, props.labelKey)
                      }, virtualizerProps.value), {
                        default: withCtx(({ option: item, virtualItem }) => [
                          createVNode(unref(ReuseItemTemplate), {
                            item,
                            index: virtualItem.index
                          }, null, 8, ["item", "index"])
                        ]),
                        _: 1
                      }, 16, ["options", "text-content"])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(filteredGroups.value, (group) => {
                        return openBlock(), createBlock(unref(ListboxGroup_default), {
                          key: `group-${group.id}`,
                          "data-slot": "group",
                          class: ui.value.group({ class: unref(uiProp)?.group })
                        }, {
                          default: withCtx(() => [
                            unref(get)(group, props.labelKey) || !!slots[group.slot ? `${group.slot}-group-label` : "group-label"] ? (openBlock(), createBlock(unref(ListboxGroupLabel_default), {
                              key: 0,
                              "data-slot": "label",
                              class: ui.value.label({ class: unref(uiProp)?.label })
                            }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, group.slot ? `${group.slot}-group-label` : "group-label", {
                                  group,
                                  label: unref(get)(group, props.labelKey),
                                  ui: ui.value
                                }, () => [
                                  createTextVNode(toDisplayString(unref(get)(group, props.labelKey)), 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["class"])) : createCommentVNode("", true),
                            (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, index) => {
                              return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                key: `group-${group.id}-${index}`,
                                item,
                                index,
                                group
                              }, null, 8, ["item", "index", "group"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["class"]);
                      }), 128))
                    ], 2)) : (openBlock(), createBlock("div", {
                      key: 1,
                      "data-slot": "empty",
                      class: ui.value.empty({ class: unref(uiProp)?.empty })
                    }, [
                      renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                        createTextVNode(toDisplayString(searchTerm.value ? unref(t)("commandPalette.noMatch", { searchTerm: searchTerm.value }) : unref(t)("commandPalette.noData")), 1)
                      ])
                    ], 2))
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            if (!!slots.footer) {
              _push2(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: unref(uiProp)?.footer }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "footer", { ui: ui.value }, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.input ? (openBlock(), createBlock(unref(ListboxFilter_default), {
                key: 0,
                modelValue: searchTerm.value,
                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                "as-child": ""
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$g, mergeProps({
                    variant: "none",
                    size: __props.size
                  }, typeof props.input === "object" ? props.input : {}, {
                    placeholder: placeholder.value,
                    autofocus: __props.autofocus,
                    loading: __props.loading,
                    "loading-icon": __props.loadingIcon,
                    "trailing-icon": __props.trailingIcon,
                    icon: __props.icon || unref(appConfig).ui.icons.search,
                    "data-slot": "input",
                    class: ui.value.input({ class: unref(uiProp)?.input }),
                    onKeydown: withKeys(onBackspace, ["backspace"])
                  }), createSlots({ _: 2 }, [
                    history.value?.length && (__props.back || !!slots.back) ? {
                      name: "leading",
                      fn: withCtx(() => [
                        renderSlot(_ctx.$slots, "back", { ui: ui.value }, () => [
                          createVNode(_sfc_main$8$1, mergeProps({
                            size: __props.size,
                            icon: __props.backIcon || unref(appConfig).ui.icons.arrowLeft,
                            color: "neutral",
                            variant: "link",
                            "aria-label": unref(t)("commandPalette.back")
                          }, typeof __props.back === "object" ? __props.back : {}, {
                            "data-slot": "back",
                            class: ui.value.back({ class: unref(uiProp)?.back }),
                            onClick: navigateBack
                          }), null, 16, ["size", "icon", "aria-label", "class"])
                        ])
                      ]),
                      key: "0"
                    } : void 0,
                    __props.close || !!slots.close ? {
                      name: "trailing",
                      fn: withCtx(() => [
                        renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                          __props.close ? (openBlock(), createBlock(_sfc_main$8$1, mergeProps({
                            key: 0,
                            size: __props.size,
                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                            color: "neutral",
                            variant: "ghost",
                            "aria-label": unref(t)("commandPalette.close")
                          }, typeof __props.close === "object" ? __props.close : {}, {
                            "data-slot": "close",
                            class: ui.value.close({ class: unref(uiProp)?.close }),
                            onClick: ($event) => emits("update:open", false)
                          }), null, 16, ["size", "icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                        ])
                      ]),
                      key: "1"
                    } : void 0
                  ]), 1040, ["size", "placeholder", "autofocus", "loading", "loading-icon", "trailing-icon", "icon", "class"])
                ]),
                _: 3
              }, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
              createVNode(unref(ListboxContent_default), {
                "data-slot": "content",
                class: ui.value.content({ class: unref(uiProp)?.content })
              }, {
                default: withCtx(() => [
                  filteredGroups.value?.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    role: "presentation",
                    "data-slot": "viewport",
                    class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                  }, [
                    !!__props.virtualize ? (openBlock(), createBlock(unref(ListboxVirtualizer_default), mergeProps({
                      key: 0,
                      options: filteredItems.value,
                      "text-content": (item2) => unref(get)(item2, props.labelKey)
                    }, virtualizerProps.value), {
                      default: withCtx(({ option: item, virtualItem }) => [
                        createVNode(unref(ReuseItemTemplate), {
                          item,
                          index: virtualItem.index
                        }, null, 8, ["item", "index"])
                      ]),
                      _: 1
                    }, 16, ["options", "text-content"])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(filteredGroups.value, (group) => {
                      return openBlock(), createBlock(unref(ListboxGroup_default), {
                        key: `group-${group.id}`,
                        "data-slot": "group",
                        class: ui.value.group({ class: unref(uiProp)?.group })
                      }, {
                        default: withCtx(() => [
                          unref(get)(group, props.labelKey) || !!slots[group.slot ? `${group.slot}-group-label` : "group-label"] ? (openBlock(), createBlock(unref(ListboxGroupLabel_default), {
                            key: 0,
                            "data-slot": "label",
                            class: ui.value.label({ class: unref(uiProp)?.label })
                          }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, group.slot ? `${group.slot}-group-label` : "group-label", {
                                group,
                                label: unref(get)(group, props.labelKey),
                                ui: ui.value
                              }, () => [
                                createTextVNode(toDisplayString(unref(get)(group, props.labelKey)), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["class"])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, index) => {
                            return openBlock(), createBlock(unref(ReuseItemTemplate), {
                              key: `group-${group.id}-${index}`,
                              item,
                              index,
                              group
                            }, null, 8, ["item", "index", "group"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["class"]);
                    }), 128))
                  ], 2)) : (openBlock(), createBlock("div", {
                    key: 1,
                    "data-slot": "empty",
                    class: ui.value.empty({ class: unref(uiProp)?.empty })
                  }, [
                    renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                      createTextVNode(toDisplayString(searchTerm.value ? unref(t)("commandPalette.noMatch", { searchTerm: searchTerm.value }) : unref(t)("commandPalette.noData")), 1)
                    ])
                  ], 2))
                ]),
                _: 3
              }, 8, ["class"]),
              !!slots.footer ? (openBlock(), createBlock("div", {
                key: 1,
                "data-slot": "footer",
                class: ui.value.footer({ class: unref(uiProp)?.footer })
              }, [
                renderSlot(_ctx.$slots, "footer", { ui: ui.value })
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/CommandPalette.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "modal": "",
    "input": ""
  },
  "variants": {
    "fullscreen": {
      "false": {
        "modal": "sm:max-w-3xl h-full sm:h-[28rem]"
      }
    },
    "size": {
      "xs": {},
      "sm": {},
      "md": {},
      "lg": {},
      "xl": {}
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const chainedShortcutRegex = /^[^-]+.*-.*[^-]+$/;
const combinedShortcutRegex = /^[^_]+.*_.*[^_]+$/;
const shiftableKeys = ["arrowleft", "arrowright", "arrowup", "arrowright", "tab", "escape", "enter", "backspace"];
function convertKeyToCode(key) {
  if (/^[a-z]$/i.test(key)) {
    return `Key${key.toUpperCase()}`;
  }
  if (/^\d$/.test(key)) {
    return `Digit${key}`;
  }
  if (/^f\d+$/i.test(key)) {
    return key.toUpperCase();
  }
  const specialKeys = {
    space: "Space",
    enter: "Enter",
    escape: "Escape",
    tab: "Tab",
    backspace: "Backspace",
    delete: "Delete",
    arrowup: "ArrowUp",
    arrowdown: "ArrowDown",
    arrowleft: "ArrowLeft",
    arrowright: "ArrowRight"
  };
  return specialKeys[key.toLowerCase()] || key;
}
function defineShortcuts(config, options = {}) {
  const chainedInputs = ref([]);
  const clearChainedInput = () => {
    chainedInputs.value.splice(0, chainedInputs.value.length);
  };
  const debouncedClearChainedInput = useDebounceFn(clearChainedInput, options.chainDelay ?? 800);
  const { macOS } = useKbd();
  const activeElement = useActiveElement();
  const layoutIndependent = options.layoutIndependent ?? false;
  const shiftableCodes = shiftableKeys.map((k) => convertKeyToCode(k));
  const onKeyDown = (e) => {
    if (!e.key) {
      return;
    }
    const alphabetKey = layoutIndependent ? /^Key[A-Z]$/i.test(e.code) : /^[a-z]{1}$/i.test(e.key);
    const shiftableKey = layoutIndependent ? shiftableCodes.includes(e.code) : shiftableKeys.includes(e.key.toLowerCase());
    let chainedKey;
    chainedInputs.value.push(layoutIndependent ? e.code : e.key);
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join("-");
      for (const shortcut of shortcuts.value.filter((s) => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue;
        }
        if (shortcut.enabled) {
          e.preventDefault();
          shortcut.handler(e);
        }
        clearChainedInput();
        return;
      }
    }
    for (const shortcut of shortcuts.value.filter((s) => !s.chained)) {
      if (layoutIndependent) {
        if (e.code !== shortcut.key) {
          continue;
        }
      } else {
        if (e.key.toLowerCase() !== shortcut.key) {
          continue;
        }
      }
      if (e.metaKey !== shortcut.metaKey) {
        continue;
      }
      if (e.ctrlKey !== shortcut.ctrlKey) {
        continue;
      }
      if (e.altKey !== shortcut.altKey) {
        continue;
      }
      if ((alphabetKey || shiftableKey || shortcut.shiftKey || e.shiftKey && (e.metaKey || e.ctrlKey)) && e.shiftKey !== shortcut.shiftKey) {
        continue;
      }
      if (shortcut.enabled) {
        e.preventDefault();
        shortcut.handler(e);
      }
      clearChainedInput();
      return;
    }
    debouncedClearChainedInput();
  };
  const usingInput = computed(() => {
    const tagName = activeElement.value?.tagName;
    const contentEditable = activeElement.value?.contentEditable;
    const usingInput2 = !!(tagName === "INPUT" || tagName === "TEXTAREA" || contentEditable === "true" || contentEditable === "plaintext-only");
    if (usingInput2) {
      return activeElement.value?.name || true;
    }
    return false;
  });
  const shortcuts = computed(() => {
    return Object.entries(toValue(config)).map(([key, shortcutConfig]) => {
      if (!shortcutConfig) {
        return null;
      }
      let shortcut;
      if (key.includes("-") && key !== "-" && !key.includes("_") && !key.match(chainedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`);
      }
      if (key.includes("_") && key !== "_" && !key.match(combinedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`);
      }
      const chained = key.includes("-") && key !== "-" && !key.includes("_");
      if (chained) {
        if (layoutIndependent) {
          const parts = key.split("-").map((p) => convertKeyToCode(p));
          shortcut = {
            key: parts.join("-"),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          };
        } else {
          shortcut = {
            key: key.toLowerCase(),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          };
        }
      } else {
        const keySplit = key.toLowerCase().split("_").map((k) => k);
        let baseKey = keySplit.filter((k) => !["meta", "command", "ctrl", "shift", "alt", "option"].includes(k)).join("_");
        if (layoutIndependent) {
          baseKey = convertKeyToCode(baseKey);
        }
        shortcut = {
          key: baseKey,
          metaKey: keySplit.includes("meta") || keySplit.includes("command"),
          ctrlKey: keySplit.includes("ctrl"),
          shiftKey: keySplit.includes("shift"),
          altKey: keySplit.includes("alt") || keySplit.includes("option")
        };
      }
      shortcut.chained = chained;
      if (!macOS.value && shortcut.metaKey && !shortcut.ctrlKey) {
        shortcut.metaKey = false;
        shortcut.ctrlKey = true;
      }
      if (typeof shortcutConfig === "function") {
        shortcut.handler = shortcutConfig;
      } else if (typeof shortcutConfig === "object") {
        shortcut = { ...shortcut, handler: shortcutConfig.handler };
      }
      if (!shortcut.handler) {
        console.trace("[Shortcut] Invalid value");
        return null;
      }
      let enabled = true;
      if (!shortcutConfig.usingInput) {
        enabled = !usingInput.value;
      } else if (typeof shortcutConfig.usingInput === "string") {
        enabled = usingInput.value === shortcutConfig.usingInput;
      }
      shortcut.enabled = enabled;
      return shortcut;
    }).filter(Boolean);
  });
  return useEventListener("keydown", onKeyDown);
}
const _sfc_main$2 = {
  __name: "UDashboardSearch",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    size: { type: null, required: false },
    close: { type: [Boolean, Object], required: false, default: true },
    shortcut: { type: String, required: false, default: "meta_k" },
    searchDelay: { type: Number, required: false, default: 100 },
    colorMode: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    overlay: { type: Boolean, required: false },
    transition: { type: Boolean, required: false },
    content: { type: Object, required: false },
    dismissible: { type: Boolean, required: false },
    fullscreen: { type: Boolean, required: false, default: false },
    modal: { type: Boolean, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true },
    icon: { type: null, required: false },
    placeholder: { type: String, required: false },
    autofocus: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    closeIcon: { type: null, required: false },
    groups: { type: Array, required: false },
    fuse: { type: Object, required: false }
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {},
    "searchTerm": { type: String, ...{ default: "" } },
    "searchTermModifiers": {}
  }),
  emits: ["update:open", "update:searchTerm"],
  setup(__props, { expose: __expose }) {
    const props = __props;
    const slots = useSlots();
    const open = useModel(__props, "open", { type: Boolean, ...{ default: false } });
    const searchTerm = useModel(__props, "searchTerm", { type: String, ...{ default: "" } });
    useRuntimeHook("dashboard:search:toggle", () => {
      open.value = !open.value;
    });
    const { t } = useLocale();
    const colorMode = useColorMode();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardSearch", props);
    const commandPaletteProps = useForwardProps(reactivePick(props, "size", "icon", "placeholder", "autofocus", "loading", "loadingIcon", "close", "closeIcon", "searchDelay"));
    const modalProps = useForwardProps(reactivePick(props, "overlay", "transition", "content", "dismissible", "fullscreen", "modal", "portal"));
    const getProxySlots = () => omit(slots, ["content"]);
    const fuse = computed(() => defu({}, props.fuse, {
      fuseOptions: {}
    }));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSearch || {} })({
      size: props.size,
      fullscreen: props.fullscreen
    }));
    const groups = computed(() => {
      const groups2 = [];
      groups2.push(...props.groups || []);
      if (props.colorMode && !colorMode?.forced) {
        groups2.push({
          id: "theme",
          label: t("dashboardSearch.theme"),
          items: [{
            label: t("colorMode.system"),
            icon: appConfig.ui.icons.system,
            active: colorMode.preference === "system",
            onSelect: () => {
              colorMode.preference = "system";
            }
          }, {
            label: t("colorMode.light"),
            icon: appConfig.ui.icons.light,
            active: colorMode.preference === "light",
            onSelect: () => {
              colorMode.preference = "light";
            }
          }, {
            label: t("colorMode.dark"),
            icon: appConfig.ui.icons.dark,
            active: colorMode.preference === "dark",
            onSelect: () => {
              colorMode.preference = "dark";
            }
          }]
        });
      }
      return groups2;
    });
    const commandPaletteRef = useTemplateRef("commandPaletteRef");
    function onSelect(item) {
      if (item.disabled) {
        return;
      }
      open.value = false;
      searchTerm.value = "";
    }
    defineShortcuts({
      [props.shortcut]: {
        usingInput: true,
        handler: () => open.value = !open.value
      }
    });
    __expose({
      commandPaletteRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$c, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: __props.title || unref(t)("dashboardSearch.title"),
        description: __props.description || unref(t)("dashboardSearch.description")
      }, unref(modalProps), {
        "data-slot": "modal",
        class: ui.value.modal({ class: [unref(uiProp)?.modal, props.class] })
      }, _attrs), {
        content: withCtx((contentData, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "content", contentData, () => {
              _push2(ssrRenderComponent(_sfc_main$3, mergeProps({
                ref_key: "commandPaletteRef",
                ref: commandPaletteRef,
                "search-term": searchTerm.value,
                "onUpdate:searchTerm": ($event) => searchTerm.value = $event
              }, unref(commandPaletteProps), {
                groups: groups.value,
                fuse: fuse.value,
                input: { fixed: true },
                ui: unref(transformUI)(unref(omit)(ui.value, ["modal"]), unref(uiProp)),
                "onUpdate:modelValue": onSelect,
                "onUpdate:open": ($event) => open.value = $event
              }), createSlots({ _: 2 }, [
                renderList(getProxySlots(), (_, name) => {
                  return {
                    name,
                    fn: withCtx((slotData, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        ssrRenderSlot(_ctx.$slots, name, slotData, null, _push3, _parent3, _scopeId2);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, name, slotData)
                        ];
                      }
                    })
                  };
                })
              ]), _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "content", contentData, () => [
                createVNode(_sfc_main$3, mergeProps({
                  ref_key: "commandPaletteRef",
                  ref: commandPaletteRef,
                  "search-term": searchTerm.value,
                  "onUpdate:searchTerm": ($event) => searchTerm.value = $event
                }, unref(commandPaletteProps), {
                  groups: groups.value,
                  fuse: fuse.value,
                  input: { fixed: true },
                  ui: unref(transformUI)(unref(omit)(ui.value, ["modal"]), unref(uiProp)),
                  "onUpdate:modelValue": onSelect,
                  "onUpdate:open": ($event) => open.value = $event
                }), createSlots({ _: 2 }, [
                  renderList(getProxySlots(), (_, name) => {
                    return {
                      name,
                      fn: withCtx((slotData) => [
                        renderSlot(_ctx.$slots, name, slotData)
                      ])
                    };
                  })
                ]), 1040, ["search-term", "onUpdate:searchTerm", "groups", "fuse", "ui", "onUpdate:open"])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardSearch.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "AiAssistant",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    ref(false);
    ref(false);
    ref(false);
    ref("");
    ref("");
    ref("");
    ref([
      { role: "assistant", content: "Hi! I am your CRM Architect. Paste some API documentation (using the button above) or ask me to build a module." }
    ]);
    const chatWindow = ref(null);
    const chatHandle = ref(null);
    const { width, height } = useWindowSize();
    const x = ref(0);
    const y = ref(0);
    useDraggable(chatWindow, { handle: chatHandle, onMove: (pos) => {
      x.value = pos.x;
      y.value = pos.y;
    } });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AiAssistant.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-7f443aed"]]), { __name: "AiAssistant" });
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { session: authSession, visibleLinks, loadSession, logout } = usePortalAuth();
    [__temp, __restore] = withAsyncContext(() => loadSession({ silent: true })), await __temp, __restore();
    const open = ref(false);
    const currentUser = computed(() => authSession.value?.user ?? null);
    const navigationSections = [
      [{
        label: "Home",
        icon: "i-lucide-house",
        to: "/",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Abonenci",
        icon: "i-lucide-users",
        to: "/customers",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Urządzenia klientów",
        icon: "i-lucide-monitor-smartphone",
        to: "/customer-devices",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Operacje",
        icon: "i-lucide-wrench",
        to: "/operations",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Monitoring",
        icon: "i-lucide-chart-no-axes-column",
        to: "/monitoring",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Analityka",
        icon: "i-lucide-chart-pie",
        to: "/analytics",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Sieć",
        icon: "i-lucide-network",
        type: "trigger",
        defaultOpen: true,
        children: [
          {
            label: "Węzły",
            to: "/network/nodes",
            onSelect: () => {
              open.value = false;
            }
          },
          {
            label: "Urządzenia sieciowe",
            to: "/network/devices",
            onSelect: () => {
              open.value = false;
            }
          },
          {
            label: "IP Networks",
            to: "/network/ip-networks",
            onSelect: () => {
              open.value = false;
            }
          }
        ]
      }],
      [{
        label: "Finanse",
        icon: "i-lucide-banknote",
        to: "/finances",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Subskrypcje",
        icon: "i-lucide-receipt",
        to: "/subscriptions",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Helpdesk",
        icon: "i-lucide-life-buoy",
        to: "/helpdesk",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "Dokumenty",
        icon: "i-lucide-folder",
        to: "/documents",
        onSelect: () => {
          open.value = false;
        }
      }, {
        label: "TERYT",
        icon: "i-lucide-map",
        to: "/teryt",
        onSelect: () => {
          open.value = false;
        }
      }],
      [{
        label: "Administracja",
        icon: "i-lucide-shield",
        type: "trigger",
        children: [
          {
            label: "Panel administracyjny",
            to: "/admin",
            onSelect: () => {
              open.value = false;
            }
          },
          {
            label: "Ustawienia",
            to: "/settings",
            onSelect: () => {
              open.value = false;
            }
          }
        ]
      }, {
        label: "AI Architekt",
        icon: "i-lucide-sparkles",
        to: "/architect",
        onSelect: () => {
          open.value = false;
        }
      }]
    ];
    const visibleSections = computed(
      () => navigationSections.map((section) => visibleLinks(section)).filter((section) => section.length > 0)
    );
    const links = computed(() => visibleSections.value);
    const groups = computed(() => [
      {
        id: "links",
        label: "Przejdź do",
        items: links.value.flat()
      }
    ]);
    const userMenuItems = computed(() => [[{
      type: "label",
      label: currentUser.value?.username ?? "Gość",
      icon: "i-lucide-user"
    }], [{
      label: "Ustawienia",
      icon: "i-lucide-settings",
      to: "/settings"
    }, {
      label: currentUser.value ? "Wyloguj" : "Zaloguj",
      icon: currentUser.value ? "i-lucide-log-out" : "i-lucide-log-in",
      click: async () => {
        if (currentUser.value) {
          await logout();
          await navigateTo("/settings");
          return;
        }
        await navigateTo("/settings");
      }
    }]]);
    computed(() => {
      const currentPath = normalizePath(route.path);
      for (const section of links.value) {
        for (const item of section) {
          const label = findActiveLabel(item, currentPath);
          if (label) {
            return label;
          }
        }
      }
      return "Dashboard";
    });
    function normalizePath(path) {
      if (!path) {
        return "/";
      }
      return String(path).split("?")[0] || "/";
    }
    function matchesPath(candidate, currentPath) {
      const normalizedCandidate = normalizePath(candidate);
      return currentPath === normalizedCandidate || currentPath.startsWith(`${normalizedCandidate}/`);
    }
    function findActiveLabel(item, currentPath) {
      if (item.to && matchesPath(item.to, currentPath)) {
        return item.label;
      }
      if (Array.isArray(item.children)) {
        for (const child of item.children) {
          const childLabel = findActiveLabel(child, currentPath);
          if (childLabel) {
            return childLabel;
          }
        }
      }
      return null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDashboardGroup = _sfc_main$b;
      const _component_UDashboardSidebar = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      const _component_UDashboardSearchButton = _sfc_main$6;
      const _component_UNavigationMenu = _sfc_main$4;
      const _component_UDropdownMenu = _sfc_main$2$1;
      const _component_UButton = _sfc_main$8$1;
      const _component_UDashboardSearch = _sfc_main$2;
      const _component_AiAssistant = __nuxt_component_8;
      _push(ssrRenderComponent(_component_UDashboardGroup, mergeProps({ unit: "rem" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardSidebar, {
              id: "default",
              open: unref(open),
              "onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
              collapsible: "",
              resizable: "",
              class: "bg-elevated/30",
              ui: { footer: "lg:border-t lg:border-default" }
            }, {
              header: withCtx(({ collapsed }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-3 px-1"${_scopeId2}><div class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-cpu",
                    class: "size-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (!collapsed) {
                    _push3(`<div class="min-w-0"${_scopeId2}><div class="truncate text-sm font-semibold text-highlighted"${_scopeId2}>SNMS Enterprise</div><div class="text-xs text-muted"${_scopeId2}>CRM Portal</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-3 px-1" }, [
                      createVNode("div", { class: "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary" }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-cpu",
                          class: "size-5"
                        })
                      ]),
                      !collapsed ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "min-w-0"
                      }, [
                        createVNode("div", { class: "truncate text-sm font-semibold text-highlighted" }, "SNMS Enterprise"),
                        createVNode("div", { class: "text-xs text-muted" }, "CRM Portal")
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              default: withCtx(({ collapsed }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UDashboardSearchButton, {
                    collapsed,
                    class: "bg-transparent ring-default"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UNavigationMenu, {
                    collapsed,
                    items: unref(links)[0] || [],
                    orientation: "vertical",
                    tooltip: "",
                    popover: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(links)[1]?.length) {
                    _push3(ssrRenderComponent(_component_UNavigationMenu, {
                      collapsed,
                      items: unref(links)[1],
                      orientation: "vertical",
                      tooltip: "",
                      popover: "",
                      class: "mt-4"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(links)[2]?.length) {
                    _push3(ssrRenderComponent(_component_UNavigationMenu, {
                      collapsed,
                      items: unref(links)[2],
                      orientation: "vertical",
                      tooltip: "",
                      popover: "",
                      class: "mt-auto"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_UDashboardSearchButton, {
                      collapsed,
                      class: "bg-transparent ring-default"
                    }, null, 8, ["collapsed"]),
                    createVNode(_component_UNavigationMenu, {
                      collapsed,
                      items: unref(links)[0] || [],
                      orientation: "vertical",
                      tooltip: "",
                      popover: ""
                    }, null, 8, ["collapsed", "items"]),
                    unref(links)[1]?.length ? (openBlock(), createBlock(_component_UNavigationMenu, {
                      key: 0,
                      collapsed,
                      items: unref(links)[1],
                      orientation: "vertical",
                      tooltip: "",
                      popover: "",
                      class: "mt-4"
                    }, null, 8, ["collapsed", "items"])) : createCommentVNode("", true),
                    unref(links)[2]?.length ? (openBlock(), createBlock(_component_UNavigationMenu, {
                      key: 1,
                      collapsed,
                      items: unref(links)[2],
                      orientation: "vertical",
                      tooltip: "",
                      popover: "",
                      class: "mt-auto"
                    }, null, 8, ["collapsed", "items"])) : createCommentVNode("", true)
                  ];
                }
              }),
              footer: withCtx(({ collapsed }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UDropdownMenu, {
                    items: unref(userMenuItems),
                    content: { align: "center", collisionPadding: 12 },
                    ui: { content: collapsed ? "w-48" : "w-(--reka-dropdown-menu-trigger-width)" }
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UButton, {
                          label: collapsed ? void 0 : unref(currentUser)?.username ?? "Gość",
                          icon: unref(currentUser) ? "i-lucide-user-check" : "i-lucide-user",
                          "trailing-icon": collapsed ? void 0 : "i-lucide-chevrons-up-down",
                          color: "neutral",
                          variant: "ghost",
                          block: "",
                          square: collapsed,
                          class: "data-[state=open]:bg-elevated"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UButton, {
                            label: collapsed ? void 0 : unref(currentUser)?.username ?? "Gość",
                            icon: unref(currentUser) ? "i-lucide-user-check" : "i-lucide-user",
                            "trailing-icon": collapsed ? void 0 : "i-lucide-chevrons-up-down",
                            color: "neutral",
                            variant: "ghost",
                            block: "",
                            square: collapsed,
                            class: "data-[state=open]:bg-elevated"
                          }, null, 8, ["label", "icon", "trailing-icon", "square"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UDropdownMenu, {
                      items: unref(userMenuItems),
                      content: { align: "center", collisionPadding: 12 },
                      ui: { content: collapsed ? "w-48" : "w-(--reka-dropdown-menu-trigger-width)" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UButton, {
                          label: collapsed ? void 0 : unref(currentUser)?.username ?? "Gość",
                          icon: unref(currentUser) ? "i-lucide-user-check" : "i-lucide-user",
                          "trailing-icon": collapsed ? void 0 : "i-lucide-chevrons-up-down",
                          color: "neutral",
                          variant: "ghost",
                          block: "",
                          square: collapsed,
                          class: "data-[state=open]:bg-elevated"
                        }, null, 8, ["label", "icon", "trailing-icon", "square"])
                      ]),
                      _: 2
                    }, 1032, ["items", "ui"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UDashboardSearch, { groups: unref(groups) }, null, _parent2, _scopeId));
            _push2(`<div class="min-w-0 flex-1"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_AiAssistant, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardSidebar, {
                id: "default",
                open: unref(open),
                "onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
                collapsible: "",
                resizable: "",
                class: "bg-elevated/30",
                ui: { footer: "lg:border-t lg:border-default" }
              }, {
                header: withCtx(({ collapsed }) => [
                  createVNode("div", { class: "flex items-center gap-3 px-1" }, [
                    createVNode("div", { class: "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-cpu",
                        class: "size-5"
                      })
                    ]),
                    !collapsed ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "min-w-0"
                    }, [
                      createVNode("div", { class: "truncate text-sm font-semibold text-highlighted" }, "SNMS Enterprise"),
                      createVNode("div", { class: "text-xs text-muted" }, "CRM Portal")
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                default: withCtx(({ collapsed }) => [
                  createVNode(_component_UDashboardSearchButton, {
                    collapsed,
                    class: "bg-transparent ring-default"
                  }, null, 8, ["collapsed"]),
                  createVNode(_component_UNavigationMenu, {
                    collapsed,
                    items: unref(links)[0] || [],
                    orientation: "vertical",
                    tooltip: "",
                    popover: ""
                  }, null, 8, ["collapsed", "items"]),
                  unref(links)[1]?.length ? (openBlock(), createBlock(_component_UNavigationMenu, {
                    key: 0,
                    collapsed,
                    items: unref(links)[1],
                    orientation: "vertical",
                    tooltip: "",
                    popover: "",
                    class: "mt-4"
                  }, null, 8, ["collapsed", "items"])) : createCommentVNode("", true),
                  unref(links)[2]?.length ? (openBlock(), createBlock(_component_UNavigationMenu, {
                    key: 1,
                    collapsed,
                    items: unref(links)[2],
                    orientation: "vertical",
                    tooltip: "",
                    popover: "",
                    class: "mt-auto"
                  }, null, 8, ["collapsed", "items"])) : createCommentVNode("", true)
                ]),
                footer: withCtx(({ collapsed }) => [
                  createVNode(_component_UDropdownMenu, {
                    items: unref(userMenuItems),
                    content: { align: "center", collisionPadding: 12 },
                    ui: { content: collapsed ? "w-48" : "w-(--reka-dropdown-menu-trigger-width)" }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UButton, {
                        label: collapsed ? void 0 : unref(currentUser)?.username ?? "Gość",
                        icon: unref(currentUser) ? "i-lucide-user-check" : "i-lucide-user",
                        "trailing-icon": collapsed ? void 0 : "i-lucide-chevrons-up-down",
                        color: "neutral",
                        variant: "ghost",
                        block: "",
                        square: collapsed,
                        class: "data-[state=open]:bg-elevated"
                      }, null, 8, ["label", "icon", "trailing-icon", "square"])
                    ]),
                    _: 2
                  }, 1032, ["items", "ui"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open"]),
              createVNode(_component_UDashboardSearch, { groups: unref(groups) }, null, 8, ["groups"]),
              createVNode("div", { class: "min-w-0 flex-1" }, [
                renderSlot(_ctx.$slots, "default")
              ]),
              createVNode(_component_AiAssistant)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BtyPk3Nk.mjs.map
