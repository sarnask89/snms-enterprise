import { useSlots, toRef, computed, useTemplateRef, unref, mergeProps, withCtx, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, createVNode, resolveDynamicComponent, defineComponent, toRefs, ref, createElementBlock, withModifiers, normalizeProps, guardReactiveProps, watch, Teleport, createElementVNode, watchEffect, nextTick, normalizeStyle, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderList, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { h as useAppConfig, i as useComponentUI, v as useForwardPropsEmits, F as usePortal, D as useFormField, G as useFieldGroup, H as useComponentIcons, t as tv, I as isArrayOfArray, e as _sfc_main$d, z as _sfc_main$b, M as FieldGroupReset, K as get, L as _sfc_main$c, B as isNullish, A as useCollection, N as looseToNumber, q as useForwardExpose, P as Primitive, O as getDisplayValue, T as Teleport_default, C as Presence_default, r as createContext, V as VisuallyHidden_default, w as useForwardProps, Q as injectConfigProviderContext, R as getActiveElement } from './server.mjs';
import { a as useDirection, u as useFormControl, P as PopperRoot_default, f as useTypeahead, b as PopperAnchor_default, c as PopperArrow_default, d as useFocusGuards, e as PopperContent_default } from './PopperArrow-CiJ5PBIc.mjs';
import { reactivePick, useVModel, unrefElement, useResizeObserver } from '@vueuse/core';
import { u as useId, a as useBodyScrollLock, b as useHideOthers, F as FocusScope_default, D as DismissableLayer_default, h as handleAndDispatchCustomEvent } from './FocusScope-afTtc11Z.mjs';
import { f as focusFirst } from './utils-hoYYm4l-.mjs';
import { x as defu, w as isEqual } from '../_/nitro.mjs';
import { u as useResolvedVariants } from './useResolvedVariants-Cc4FdLtQ.mjs';

function clamp(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  return Math.min(max, Math.max(min, value));
}
function useNonce(nonce) {
  const context = injectConfigProviderContext({ nonce: ref() });
  return computed(() => nonce?.value || context.nonce?.value);
}
const OPEN_KEYS = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
];
const SELECTION_KEYS = [" ", "Enter"];
const CONTENT_MARGIN = 10;
function valueComparator(value, currentValue, comparator) {
  if (value === void 0) return false;
  else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
  else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0) return false;
  if (typeof value === "string") return value === currentValue;
  if (typeof comparator === "function") return comparator(value, currentValue);
  if (typeof comparator === "string") return value?.[comparator] === currentValue?.[comparator];
  return isEqual(value, currentValue);
}
function shouldShowPlaceholder(value) {
  return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
}
const _hoisted_1$1 = {
  key: 0,
  value: ""
};
const [injectSelectRootContext, provideSelectRootContext] = /* @__PURE__ */ createContext("SelectRoot");
var SelectRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SelectRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    modelValue: {
      type: null,
      required: false,
      default: void 0
    },
    by: {
      type: [String, Function],
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    autocomplete: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { required, disabled, multiple, dir: propDir } = toRefs(props);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
      passive: props.modelValue === void 0,
      deep: true
    });
    const open = useVModel(props, "open", emits, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = ref();
    const valueElement = ref();
    const triggerPointerDownPosRef = ref({
      x: 0,
      y: 0
    });
    const isEmptyModelValue = computed(() => {
      if (multiple.value && Array.isArray(modelValue.value)) return modelValue.value?.length === 0;
      else return isNullish(modelValue.value);
    });
    useCollection({ isProvider: true });
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(triggerElement);
    const optionsSet = ref(/* @__PURE__ */ new Set());
    const nativeSelectKey = computed(() => {
      return Array.from(optionsSet.value).map((option) => option.value).join(";");
    });
    function handleValueChange(value) {
      if (multiple.value) {
        const array = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
        const index = array.findIndex((i) => compare(i, value, props.by));
        index === -1 ? array.push(value) : array.splice(index, 1);
        modelValue.value = [...array];
      } else modelValue.value = value;
    }
    function getOption(value) {
      return Array.from(optionsSet.value).find((option) => valueComparator(value, option.value, props.by));
    }
    provideSelectRootContext({
      triggerElement,
      onTriggerChange: (node) => {
        triggerElement.value = node;
      },
      valueElement,
      onValueElementChange: (node) => {
        valueElement.value = node;
      },
      contentId: "",
      modelValue,
      onValueChange: handleValueChange,
      by: props.by,
      open,
      multiple,
      required,
      onOpenChange: (value) => {
        open.value = value;
      },
      dir,
      triggerPointerDownPosRef,
      disabled,
      isEmptyModelValue,
      optionsSet,
      onOptionAdd: (option) => {
        const existingOption = getOption(option.value);
        if (existingOption) optionsSet.value.delete(existingOption);
        optionsSet.value.add(option);
      },
      onOptionRemove: (option) => {
        const existingOption = getOption(option.value);
        if (existingOption) optionsSet.value.delete(existingOption);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          modelValue: unref(modelValue),
          open: unref(open)
        }), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(BubbleSelect_default, {
          key: nativeSelectKey.value,
          "aria-hidden": "true",
          tabindex: "-1",
          multiple: unref(multiple),
          required: unref(required),
          name: _ctx.name,
          autocomplete: _ctx.autocomplete,
          disabled: unref(disabled),
          value: unref(modelValue)
        }, {
          default: withCtx(() => [unref(isNullish)(unref(modelValue)) ? (openBlock(), createElementBlock("option", _hoisted_1$1)) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(Array.from(optionsSet.value), (option) => {
            return openBlock(), createElementBlock("option", mergeProps({ key: option.value ?? "" }, { ref_for: true }, option), null, 16);
          }), 128))]),
          _: 1
        }, 8, [
          "multiple",
          "required",
          "name",
          "autocomplete",
          "disabled",
          "value"
        ])) : createCommentVNode("v-if", true)]),
        _: 3
      });
    };
  }
});
var SelectRoot_default = SelectRoot_vue_vue_type_script_setup_true_lang_default;
var BubbleSelect_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "BubbleSelect",
  props: {
    autocomplete: {
      type: String,
      required: false
    },
    autofocus: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    form: {
      type: String,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    value: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const selectElement = ref();
    const rootContext = injectSelectRootContext();
    watch(() => props.value, (cur, prev) => {
      const selectProto = (void 0).HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(selectProto, "value");
      const setValue = descriptor.set;
      if (cur !== prev && setValue && selectElement.value) {
        const event = new Event("change", { bubbles: true });
        setValue.call(selectElement.value, cur);
        selectElement.value.dispatchEvent(event);
      }
    });
    function handleInput(event) {
      rootContext.onValueChange(event.target.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(VisuallyHidden_default), { "as-child": "" }, {
        default: withCtx(() => [createElementVNode("select", mergeProps({
          ref_key: "selectElement",
          ref: selectElement
        }, props, { onInput: handleInput }), [renderSlot(_ctx.$slots, "default")], 16)]),
        _: 3
      });
    };
  }
});
var BubbleSelect_default = BubbleSelect_vue_vue_type_script_setup_true_lang_default;
var SelectPopperPosition_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectPopperPosition",
  props: {
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
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
      required: false,
      default: CONTENT_MARGIN
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
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
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
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
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const forwarded = useForwardProps(props);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperContent_default), mergeProps(unref(forwarded), { style: {
        "boxSizing": "border-box",
        "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-select-content-available-width": "var(--reka-popper-available-width)",
        "--reka-select-content-available-height": "var(--reka-popper-available-height)",
        "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var SelectPopperPosition_default = SelectPopperPosition_vue_vue_type_script_setup_true_lang_default;
const SelectContentDefaultContextValue = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
};
const [injectSelectContentContext, provideSelectContentContext] = /* @__PURE__ */ createContext("SelectContent");
var SelectContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectContentImpl",
  props: {
    position: {
      type: String,
      required: false,
      default: "item-aligned"
    },
    bodyLock: {
      type: Boolean,
      required: false,
      default: true
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
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
    hideShiftedArrow: {
      type: Boolean,
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
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
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
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectSelectRootContext();
    useFocusGuards();
    useBodyScrollLock(props.bodyLock);
    const { CollectionSlot, getItems } = useCollection();
    const content = ref();
    useHideOthers(content);
    const { search, handleTypeaheadSearch } = useTypeahead();
    const viewport = ref();
    const selectedItem = ref();
    const selectedItemText = ref();
    const isPositioned = ref(false);
    const firstValidItemFoundRef = ref(false);
    const firstSelectedItemInArrayFoundRef = ref(false);
    function focusSelectedItem() {
      if (selectedItem.value && content.value) focusFirst([selectedItem.value, content.value]);
    }
    watch(isPositioned, () => {
      focusSelectedItem();
    });
    const { onOpenChange, triggerPointerDownPosRef } = rootContext;
    watchEffect((cleanupFn) => {
      if (!content.value) return;
      let pointerMoveDelta = {
        x: 0,
        y: 0
      };
      const handlePointerMove = (event) => {
        pointerMoveDelta = {
          x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.value?.x ?? 0)),
          y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.value?.y ?? 0))
        };
      };
      const handlePointerUp = (event) => {
        if (event.pointerType === "touch") return;
        if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
        else if (!content.value?.contains(event.target)) onOpenChange(false);
        (void 0).removeEventListener("pointermove", handlePointerMove);
        triggerPointerDownPosRef.value = null;
      };
      if (triggerPointerDownPosRef.value !== null) {
        (void 0).addEventListener("pointermove", handlePointerMove);
        (void 0).addEventListener("pointerup", handlePointerUp, {
          capture: true,
          once: true
        });
      }
      cleanupFn(() => {
        (void 0).removeEventListener("pointermove", handlePointerMove);
        (void 0).removeEventListener("pointerup", handlePointerUp, { capture: true });
      });
    });
    function handleKeyDown(event) {
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
      if (event.key === "Tab") event.preventDefault();
      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key, getItems());
      if ([
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(event.key)) {
        const collectionItems = getItems().map((i) => i.ref);
        let candidateNodes = [...collectionItems];
        if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          const currentElement = event.target;
          const currentIndex = candidateNodes.indexOf(currentElement);
          candidateNodes = candidateNodes.slice(currentIndex + 1);
        }
        setTimeout(() => focusFirst(candidateNodes));
        event.preventDefault();
      }
    }
    const pickedProps = computed(() => {
      if (props.position === "popper") return props;
      else return {};
    });
    const forwardedProps = useForwardProps(pickedProps.value);
    provideSelectContentContext({
      content,
      viewport,
      onViewportChange: (node) => {
        viewport.value = node;
      },
      itemRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by);
        if (rootContext.multiple.value) {
          if (firstSelectedItemInArrayFoundRef.value) return;
          if (isSelectedItem || isFirstValidItem) {
            selectedItem.value = node;
            if (isSelectedItem) firstSelectedItemInArrayFoundRef.value = true;
          }
        } else if (isSelectedItem || isFirstValidItem) selectedItem.value = node;
        if (isFirstValidItem) firstValidItemFoundRef.value = true;
      },
      selectedItem,
      selectedItemText,
      onItemLeave: () => {
        content.value?.focus();
      },
      itemTextRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by);
        if (isSelectedItem || isFirstValidItem) selectedItemText.value = node;
      },
      focusSelectedItem,
      position: props.position,
      isPositioned,
      searchRef: search
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(FocusScope_default), {
          "as-child": "",
          onMountAutoFocus: _cache[6] || (_cache[6] = withModifiers(() => {
          }, ["prevent"])),
          onUnmountAutoFocus: _cache[7] || (_cache[7] = (event) => {
            emits("closeAutoFocus", event);
            if (event.defaultPrevented) return;
            unref(rootContext).triggerElement.value?.focus({ preventScroll: true });
            event.preventDefault();
          })
        }, {
          default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
            "as-child": "",
            "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
            onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {
            }, ["prevent"])),
            onDismiss: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onOpenChange(false)),
            onEscapeKeyDown: _cache[4] || (_cache[4] = ($event) => emits("escapeKeyDown", $event)),
            onPointerDownOutside: _cache[5] || (_cache[5] = ($event) => emits("pointerDownOutside", $event))
          }, {
            default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.position === "popper" ? SelectPopperPosition_default : SelectItemAlignedPosition_default), mergeProps({
              ..._ctx.$attrs,
              ...unref(forwardedProps)
            }, {
              id: unref(rootContext).contentId,
              ref: (vnode) => {
                if (!vnode) return void 0;
                const el = unref(unrefElement)(vnode);
                if (el?.hasAttribute("data-reka-popper-content-wrapper")) content.value = el.firstElementChild;
                else content.value = el;
                return void 0;
              },
              role: "listbox",
              "data-state": unref(rootContext).open.value ? "open" : "closed",
              dir: unref(rootContext).dir.value,
              style: {
                display: "flex",
                flexDirection: "column",
                outline: "none"
              },
              onContextmenu: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["prevent"])),
              onPlaced: _cache[1] || (_cache[1] = ($event) => isPositioned.value = true),
              onKeydown: handleKeyDown
            }), {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
              _: 3
            }, 16, [
              "id",
              "data-state",
              "dir",
              "onKeydown"
            ]))]),
            _: 3
          }, 8, ["disable-outside-pointer-events"])]),
          _: 3
        })]),
        _: 3
      });
    };
  }
});
var SelectContentImpl_default = SelectContentImpl_vue_vue_type_script_setup_true_lang_default;
const [injectSelectItemAlignedPositionContext, provideSelectItemAlignedPositionContext] = /* @__PURE__ */ createContext("SelectItemAlignedPosition");
var SelectItemAlignedPosition_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SelectItemAlignedPosition",
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
  emits: ["placed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { getItems } = useCollection();
    const rootContext = injectSelectRootContext();
    const contentContext = injectSelectContentContext();
    const shouldExpandOnScrollRef = ref(false);
    const shouldRepositionRef = ref(true);
    const contentWrapperElement = ref();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
    function position() {
      if (rootContext.triggerElement.value && rootContext.valueElement.value && contentWrapperElement.value && contentElement.value && viewport?.value && selectedItem?.value && selectedItemText?.value) {
        const triggerRect = rootContext.triggerElement.value.getBoundingClientRect();
        const contentRect = contentElement.value.getBoundingClientRect();
        const valueNodeRect = rootContext.valueElement.value.getBoundingClientRect();
        const itemTextRect = selectedItemText.value.getBoundingClientRect();
        if (rootContext.dir.value !== "rtl") {
          const itemTextOffset = itemTextRect.left - contentRect.left;
          const left = valueNodeRect.left - itemTextOffset;
          const leftDelta = triggerRect.left - left;
          const minContentWidth = triggerRect.width + leftDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const rightEdge = (void 0).innerWidth - CONTENT_MARGIN;
          const clampedLeft = clamp(left, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth));
          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
          contentWrapperElement.value.style.left = `${clampedLeft}px`;
        } else {
          const itemTextOffset = contentRect.right - itemTextRect.right;
          const right = (void 0).innerWidth - valueNodeRect.right - itemTextOffset;
          const rightDelta = (void 0).innerWidth - triggerRect.right - right;
          const minContentWidth = triggerRect.width + rightDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const leftEdge = (void 0).innerWidth - CONTENT_MARGIN;
          const clampedRight = clamp(right, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth));
          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
          contentWrapperElement.value.style.right = `${clampedRight}px`;
        }
        const items = getItems().map((i) => i.ref);
        const availableHeight = (void 0).innerHeight - CONTENT_MARGIN * 2;
        const itemsHeight = viewport.value.scrollHeight;
        const contentStyles = (void 0).getComputedStyle(contentElement.value);
        const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10);
        const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10);
        const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10);
        const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10);
        const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
        const minContentHeight = Math.min(selectedItem.value.offsetHeight * 5, fullContentHeight);
        const viewportStyles = (void 0).getComputedStyle(viewport.value);
        const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10);
        const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10);
        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
        const selectedItemHalfHeight = selectedItem.value.offsetHeight / 2;
        const itemOffsetMiddle = selectedItem.value.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
        if (willAlignWithoutTopOverflow) {
          const isLastItem = selectedItem.value === items.at(-1);
          contentWrapperElement.value.style.bottom = `0px`;
          const viewportOffsetBottom = contentElement.value.clientHeight - viewport.value.offsetTop - viewport.value.offsetHeight;
          const clampedTriggerMiddleToBottomEdge = Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
          contentWrapperElement.value.style.height = `${height}px`;
        } else {
          const isFirstItem = selectedItem.value === items[0];
          contentWrapperElement.value.style.top = `0px`;
          const clampedTopEdgeToTriggerMiddle = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.value.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight);
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
          contentWrapperElement.value.style.height = `${height}px`;
          viewport.value.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.value.offsetTop;
        }
        contentWrapperElement.value.style.margin = `${CONTENT_MARGIN}px 0`;
        contentWrapperElement.value.style.minHeight = `${minContentHeight}px`;
        contentWrapperElement.value.style.maxHeight = `${availableHeight}px`;
        emits("placed");
        requestAnimationFrame(() => shouldExpandOnScrollRef.value = true);
      }
    }
    const contentZIndex = ref("");
    function handleScrollButtonChange(node) {
      if (node && shouldRepositionRef.value === true) {
        position();
        focusSelectedItem?.();
        shouldRepositionRef.value = false;
      }
    }
    useResizeObserver(rootContext.triggerElement, () => {
      position();
    });
    provideSelectItemAlignedPositionContext({
      contentWrapper: contentWrapperElement,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "contentWrapperElement",
        ref: contentWrapperElement,
        style: normalizeStyle({
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: contentZIndex.value
        })
      }, [createVNode(unref(Primitive), mergeProps({
        ref: unref(forwardRef),
        style: {
          boxSizing: "border-box",
          maxHeight: "100%"
        }
      }, {
        ..._ctx.$attrs,
        ...props
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)], 4);
    };
  }
});
var SelectItemAlignedPosition_default = SelectItemAlignedPosition_vue_vue_type_script_setup_true_lang_default;
var SelectArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectArrow",
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
    rounded: {
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
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue);
    return (_ctx, _cache) => {
      return unref(contentContext).position === "popper" ? (openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(mergeProps({ key: 0 }, props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var SelectArrow_default = SelectArrow_vue_vue_type_script_setup_true_lang_default;
var SelectProvider_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: true
  } },
  setup(__props) {
    const props = __props;
    provideSelectRootContext(props.context);
    provideSelectContentContext(SelectContentDefaultContextValue);
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
});
var SelectProvider_default = SelectProvider_vue_vue_type_script_setup_true_lang_default;
const _hoisted_1 = { key: 1 };
var SelectContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SelectContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    position: {
      type: String,
      required: false
    },
    bodyLock: {
      type: Boolean,
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
    sideFlip: {
      type: Boolean,
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
    alignFlip: {
      type: Boolean,
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
    hideShiftedArrow: {
      type: Boolean,
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
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
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
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const rootContext = injectSelectRootContext();
    const fragment = ref();
    const presenceRef = ref();
    const present = computed(() => props.forceMount || rootContext.open.value);
    const renderPresence = ref(present.value);
    watch(present, () => {
      setTimeout(() => renderPresence.value = present.value);
    });
    return (_ctx, _cache) => {
      return present.value || renderPresence.value || presenceRef.value?.present ? (openBlock(), createBlock(unref(Presence_default), {
        key: 0,
        ref_key: "presenceRef",
        ref: presenceRef,
        present: present.value
      }, {
        default: withCtx(() => [createVNode(SelectContentImpl_default, normalizeProps(guardReactiveProps({
          ...unref(forwarded),
          ..._ctx.$attrs
        })), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)]),
        _: 3
      }, 8, ["present"])) : fragment.value ? (openBlock(), createElementBlock("div", _hoisted_1, [(openBlock(), createBlock(Teleport, { to: fragment.value }, [createVNode(SelectProvider_default, { context: unref(rootContext) }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["context"])], 8, ["to"]))])) : createCommentVNode("v-if", true);
    };
  }
});
var SelectContent_default = SelectContent_vue_vue_type_script_setup_true_lang_default;
const [injectSelectGroupContext, provideSelectGroupContext] = /* @__PURE__ */ createContext("SelectGroup");
var SelectGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectGroup",
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
    const id = useId(void 0, "reka-select-group");
    provideSelectGroupContext({ id });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["aria-labelledby"]);
    };
  }
});
var SelectGroup_default = SelectGroup_vue_vue_type_script_setup_true_lang_default;
const [injectSelectItemContext, provideSelectItemContext] = /* @__PURE__ */ createContext("SelectItem");
var SelectItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
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
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { disabled } = toRefs(props);
    const rootContext = injectSelectRootContext();
    const contentContext = injectSelectContentContext();
    const { forwardRef } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isSelected = computed(() => valueComparator(rootContext.modelValue?.value, props.value, rootContext.by));
    const isFocused = ref(false);
    const textValue = ref(props.textValue ?? "");
    const textId = useId(void 0, "reka-select-item-text");
    const SELECT_SELECT = "select.select";
    async function handleSelectCustomEvent(ev) {
      if (ev.defaultPrevented) return;
      const eventDetail = {
        originalEvent: ev,
        value: props.value
      };
      handleAndDispatchCustomEvent(SELECT_SELECT, handleSelect, eventDetail);
    }
    async function handleSelect(ev) {
      await nextTick();
      emits("select", ev);
      if (ev.defaultPrevented) return;
      if (!disabled.value) {
        rootContext.onValueChange(props.value);
        if (!rootContext.multiple.value) rootContext.onOpenChange(false);
      }
    }
    async function handlePointerMove(event) {
      await nextTick();
      if (event.defaultPrevented) return;
      if (disabled.value) contentContext.onItemLeave?.();
      else event.currentTarget?.focus({ preventScroll: true });
    }
    async function handlePointerLeave(event) {
      await nextTick();
      if (event.defaultPrevented) return;
      if (event.currentTarget === getActiveElement()) contentContext.onItemLeave?.();
    }
    async function handleKeyDown(event) {
      await nextTick();
      if (event.defaultPrevented) return;
      const isTypingAhead = contentContext.searchRef?.value !== "";
      if (isTypingAhead && event.key === " ") return;
      if (SELECTION_KEYS.includes(event.key)) handleSelectCustomEvent(event);
      if (event.key === " ") event.preventDefault();
    }
    if (props.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    provideSelectItemContext({
      value: props.value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: (node) => {
        textValue.value = ((textValue.value || node?.textContent) ?? "").trim();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), { value: { textValue: textValue.value } }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          role: "option",
          "aria-labelledby": unref(textId),
          "data-highlighted": isFocused.value ? "" : void 0,
          "aria-selected": isSelected.value,
          "data-state": isSelected.value ? "checked" : "unchecked",
          "aria-disabled": unref(disabled) || void 0,
          "data-disabled": unref(disabled) ? "" : void 0,
          tabindex: unref(disabled) ? void 0 : -1,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          onFocus: _cache[0] || (_cache[0] = ($event) => isFocused.value = true),
          onBlur: _cache[1] || (_cache[1] = ($event) => isFocused.value = false),
          onPointerup: handleSelectCustomEvent,
          onPointerdown: _cache[2] || (_cache[2] = (event) => {
            event.currentTarget.focus({ preventScroll: true });
          }),
          onTouchend: _cache[3] || (_cache[3] = withModifiers(() => {
          }, ["prevent", "stop"])),
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onKeydown: handleKeyDown
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "aria-labelledby",
          "data-highlighted",
          "aria-selected",
          "data-state",
          "aria-disabled",
          "data-disabled",
          "tabindex",
          "as",
          "as-child"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var SelectItem_default = SelectItem_vue_vue_type_script_setup_true_lang_default;
var SelectItemIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectItemIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const itemContext = injectSelectItemContext();
    return (_ctx, _cache) => {
      return unref(itemContext).isSelected.value ? (openBlock(), createBlock(unref(Primitive), mergeProps({
        key: 0,
        "aria-hidden": "true"
      }, props), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var SelectItemIndicator_default = SelectItemIndicator_vue_vue_type_script_setup_true_lang_default;
var SelectItemText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "SelectItemText",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    injectSelectRootContext();
    injectSelectContentContext();
    const itemContext = injectSelectItemContext();
    const { forwardRef, currentElement: itemTextElement } = useForwardExpose();
    computed(() => {
      return {
        value: itemContext.value,
        disabled: itemContext.disabled.value,
        textContent: itemTextElement.value?.textContent ?? itemContext.value?.toString() ?? ""
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({
        id: unref(itemContext).textId,
        ref: unref(forwardRef)
      }, {
        ...props,
        ..._ctx.$attrs
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var SelectItemText_default = SelectItemText_vue_vue_type_script_setup_true_lang_default;
var SelectLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectLabel",
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
    const groupContext = injectSelectGroupContext({ id: "" });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).id }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var SelectLabel_default = SelectLabel_vue_vue_type_script_setup_true_lang_default;
var SelectPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectPortal",
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
var SelectPortal_default = SelectPortal_vue_vue_type_script_setup_true_lang_default;
var SelectSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectSeparator",
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ "aria-hidden": "true" }, props), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var SelectSeparator_default = SelectSeparator_vue_vue_type_script_setup_true_lang_default;
var SelectTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
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
    const rootContext = injectSelectRootContext();
    const { forwardRef } = useForwardExpose();
    const isDisabled = computed(() => rootContext.disabled?.value || props.disabled);
    rootContext.contentId ||= useId(void 0, "reka-select-content");
    const { getItems } = useCollection();
    const { search, handleTypeaheadSearch, resetTypeahead } = useTypeahead();
    function handleOpen() {
      if (!isDisabled.value) {
        rootContext.onOpenChange(true);
        resetTypeahead();
      }
    }
    function handlePointerOpen(event) {
      handleOpen();
      rootContext.triggerPointerDownPosRef.value = {
        x: Math.round(event.pageX),
        y: Math.round(event.pageY)
      };
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          role: "combobox",
          type: _ctx.as === "button" ? "button" : void 0,
          "aria-controls": unref(rootContext).contentId,
          "aria-expanded": unref(rootContext).open.value || false,
          "aria-required": unref(rootContext).required?.value,
          "aria-autocomplete": "none",
          disabled: isDisabled.value,
          dir: unref(rootContext)?.dir.value,
          "data-state": unref(rootContext)?.open.value ? "open" : "closed",
          "data-disabled": isDisabled.value ? "" : void 0,
          "data-placeholder": unref(shouldShowPlaceholder)(unref(rootContext).modelValue?.value) ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as,
          onClick: _cache[0] || (_cache[0] = (event) => {
            event?.currentTarget?.focus();
          }),
          onPointerdown: _cache[1] || (_cache[1] = (event) => {
            if (event.pointerType === "touch") return event.preventDefault();
            const target = event.target;
            if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
            if (event.button === 0 && event.ctrlKey === false) {
              handlePointerOpen(event);
              event.preventDefault();
            }
          }),
          onPointerup: _cache[2] || (_cache[2] = withModifiers((event) => {
            if (event.pointerType === "touch") handlePointerOpen(event);
          }, ["prevent"])),
          onKeydown: _cache[3] || (_cache[3] = (event) => {
            const isTypingAhead = unref(search) !== "";
            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
            if (!isModifierKey && event.key.length === 1) {
              if (isTypingAhead && event.key === " ") return;
            }
            unref(handleTypeaheadSearch)(event.key, unref(getItems)());
            if (unref(OPEN_KEYS).includes(event.key)) {
              handleOpen();
              event.preventDefault();
            }
          })
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "type",
          "aria-controls",
          "aria-expanded",
          "aria-required",
          "disabled",
          "dir",
          "data-state",
          "data-disabled",
          "data-placeholder",
          "as-child",
          "as"
        ])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var SelectTrigger_default = SelectTrigger_vue_vue_type_script_setup_true_lang_default;
var SelectValue_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectValue",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const { forwardRef } = useForwardExpose();
    const rootContext = injectSelectRootContext();
    const selectedLabel = computed(() => {
      let list = [];
      const options = Array.from(rootContext.optionsSet.value);
      const getOption = (value) => options.find((option) => valueComparator(value, option.value, rootContext.by));
      if (Array.isArray(rootContext.modelValue.value)) list = rootContext.modelValue.value.map((value) => getOption(value)?.textContent ?? "");
      else list = [getOption(rootContext.modelValue.value)?.textContent ?? ""];
      return list.filter(Boolean);
    });
    const slotText = computed(() => {
      return selectedLabel.value.length ? selectedLabel.value.join(", ") : props.placeholder;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref: unref(forwardRef),
        as: _ctx.as,
        "as-child": _ctx.asChild,
        style: { pointerEvents: "none" },
        "data-placeholder": selectedLabel.value.length ? void 0 : props.placeholder
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          selectedLabel: selectedLabel.value,
          modelValue: unref(rootContext).modelValue.value
        }, () => [createTextVNode(toDisplayString(slotText.value), 1)])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-placeholder"
      ]);
    };
  }
});
var SelectValue_default = SelectValue_vue_vue_type_script_setup_true_lang_default;
var SelectViewport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SelectViewport",
  props: {
    nonce: {
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
    }
  },
  setup(__props) {
    const props = __props;
    const { nonce: propNonce } = toRefs(props);
    const nonce = useNonce(propNonce);
    const contentContext = injectSelectContentContext();
    const alignedPositionContext = contentContext.position === "item-aligned" ? injectSelectItemAlignedPositionContext() : void 0;
    const { forwardRef } = useForwardExpose();
    const prevScrollTopRef = ref(0);
    function handleScroll(event) {
      const viewport = event.currentTarget;
      const { shouldExpandOnScrollRef, contentWrapper } = alignedPositionContext ?? {};
      if (shouldExpandOnScrollRef?.value && contentWrapper?.value) {
        const scrolledBy = Math.abs(prevScrollTopRef.value - viewport.scrollTop);
        if (scrolledBy > 0) {
          const availableHeight = (void 0).innerHeight - CONTENT_MARGIN * 2;
          const cssMinHeight = Number.parseFloat(contentWrapper.value.style.minHeight);
          const cssHeight = Number.parseFloat(contentWrapper.value.style.height);
          const prevHeight = Math.max(cssMinHeight, cssHeight);
          if (prevHeight < availableHeight) {
            const nextHeight = prevHeight + scrolledBy;
            const clampedNextHeight = Math.min(availableHeight, nextHeight);
            const heightDiff = nextHeight - clampedNextHeight;
            contentWrapper.value.style.height = `${clampedNextHeight}px`;
            if (contentWrapper.value.style.bottom === "0px") {
              viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
              contentWrapper.value.style.justifyContent = "flex-end";
            }
          }
        }
      }
      prevScrollTopRef.value = viewport.scrollTop;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(Primitive), mergeProps({
        ref: unref(forwardRef),
        "data-reka-select-viewport": "",
        role: "presentation"
      }, {
        ..._ctx.$attrs,
        ...props
      }, {
        style: {
          position: "relative",
          flex: 1,
          overflow: "hidden auto"
        },
        onScroll: handleScroll
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16), createVNode(unref(Primitive), {
        as: "style",
        nonce: unref(nonce)
      }, {
        default: withCtx(() => _cache[0] || (_cache[0] = [createTextVNode(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
        _: 1,
        __: [0]
      }, 8, ["nonce"])], 64);
    };
  }
});
var SelectViewport_default = SelectViewport_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "base": [
      "relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "value": "truncate pointer-events-none",
    "placeholder": "truncate text-dimmed",
    "arrow": "fill-bg stroke-default",
    "content": "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
    "viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    "group": "p-1 isolate",
    "empty": "text-center text-muted",
    "label": "font-semibold text-highlighted",
    "separator": "-mx-1 my-1 h-px bg-border",
    "item": [
      "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50",
      "transition-colors before:transition-colors"
    ],
    "itemLeadingIcon": [
      "shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default",
      "transition-colors"
    ],
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemLeadingChip": "shrink-0",
    "itemLeadingChipSize": "",
    "itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
    "itemTrailingIcon": "shrink-0",
    "itemWrapper": "flex-1 flex flex-col min-w-0",
    "itemLabel": "truncate",
    "itemDescription": "truncate text-muted"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1 text-[10px]/3 gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-2 text-xs"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1.5 text-[10px]/3 gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-2.5 text-xs"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-2.5 text-sm"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-2 text-xs gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-3 text-sm"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemLeadingChip": "size-6",
        "itemLeadingChipSize": "lg",
        "itemTrailingIcon": "size-6",
        "empty": "p-3 text-base"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented hover:bg-elevated disabled:bg-default",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented hover:bg-accented/75 disabled:bg-elevated",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "fixed": {
      "false": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    },
    "position": {
      "popper": {
        "content": "data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]"
      },
      "item-aligned": {
        "content": ""
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    },
    {
      "fixed": false,
      "size": "xs",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "sm",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "md",
      "class": "md:text-sm"
    },
    {
      "fixed": false,
      "size": "lg",
      "class": "md:text-sm"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline",
    "position": "popper"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USelect",
  __ssrInlineRender: true,
  props: {
    id: { type: String, required: false },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    trailingIcon: { type: null, required: false },
    selectedIcon: { type: null, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    valueKey: { type: null, required: false, default: "value" },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    items: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    modelModifiers: { type: null, required: false },
    multiple: { type: Boolean, required: false },
    highlight: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    autocomplete: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  emits: ["change", "blur", "focus", "update:modelValue", "update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("select", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "disabled", "autocomplete", "required", "multiple"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const { position } = useResolvedVariants("select", props, theme, ["position"], {
      position: () => props.content?.position
    });
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: position.value }));
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const { emitFormChange, emitFormInput, emitFormBlur, emitFormFocus, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
    const selectSize = computed(() => fieldGroupSize.value || formFieldSize.value);
    const isItemAligned = computed(() => position.value === "item-aligned");
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.select || {} })({
      color: color.value,
      variant: props.variant,
      size: selectSize?.value,
      loading: props.loading,
      highlight: highlight.value,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value,
      position: position.value
    }));
    const groups = computed(
      () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
    );
    const items = computed(() => groups.value.flatMap((group) => group));
    function displayValue(value) {
      if (props.multiple && Array.isArray(value)) {
        const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey
        })).filter((v) => v != null && v !== "");
        return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
      }
      return getDisplayValue(items.value, value, {
        labelKey: props.labelKey,
        valueKey: props.valueKey
      });
    }
    const triggerRef = useTemplateRef("triggerRef");
    function onUpdate(value) {
      if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) {
        value = value?.trim() ?? null;
      }
      if (props.modelModifiers?.number) {
        value = looseToNumber(value);
      }
      if (props.modelModifiers?.nullable) {
        value ??= null;
      }
      if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) {
        value ??= void 0;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onUpdateOpen(value) {
      if (!value) {
        const event = new FocusEvent("blur");
        emits("blur", event);
        emitFormBlur();
      } else {
        const event = new FocusEvent("focus");
        emits("focus", event);
        emitFormFocus();
      }
    }
    function isSelectItem(item) {
      return typeof item === "object" && item !== null;
    }
    const viewportRef = useTemplateRef("viewportRef");
    __expose({
      triggerRef: toRef(() => triggerRef.value?.$el),
      viewportRef: toRef(() => {
        const instance = viewportRef.value;
        return instance && typeof instance === "object" && "$el" in instance ? instance.$el : instance;
      })
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectRoot_default), mergeProps({ name: unref(name) }, unref(rootProps), {
        autocomplete: __props.autocomplete,
        disabled: unref(disabled),
        "default-value": __props.defaultValue,
        "model-value": __props.modelValue,
        "onUpdate:modelValue": onUpdate,
        "onUpdate:open": onUpdateOpen
      }, _attrs), {
        default: withCtx(({ modelValue, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectTrigger_default), mergeProps({
              id: unref(id),
              ref_key: "triggerRef",
              ref: triggerRef,
              "data-slot": "base",
              class: ui.value.base({ class: [unref(uiProp)?.base, props.class] })
            }, { ..._ctx.$attrs, ...unref(ariaAttrs) }), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(isLeading) || !!__props.avatar || !!slots.leading) {
                    _push3(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(uiProp)?.leading }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "leading", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      if (unref(isLeading) && unref(leadingIconName)) {
                        _push3(ssrRenderComponent(_sfc_main$d, {
                          name: unref(leadingIconName),
                          "data-slot": "leadingIcon",
                          class: ui.value.leadingIcon({ class: unref(uiProp)?.leadingIcon })
                        }, null, _parent3, _scopeId2));
                      } else if (!!__props.avatar) {
                        _push3(ssrRenderComponent(_sfc_main$b, mergeProps({
                          size: unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                        }, __props.avatar, {
                          "data-slot": "itemLeadingAvatar",
                          class: ui.value.itemLeadingAvatar({ class: unref(uiProp)?.itemLeadingAvatar })
                        }), null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<!--[-->`);
                  ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
                    _push3(ssrRenderComponent(unref(SelectValue_default), {
                      "data-slot": displayedModelValue != null ? "value" : "placeholder",
                      class: displayedModelValue != null ? ui.value.value({ class: unref(uiProp)?.value }) : ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "default", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => {
                            _push4(`${ssrInterpolate(displayedModelValue ?? (__props.placeholder ?? " "))}`);
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default", {
                              modelValue,
                              open,
                              ui: ui.value
                            }, () => [
                              createTextVNode(toDisplayString(displayedModelValue ?? (__props.placeholder ?? " ")), 1)
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  if (unref(isTrailing) || !!slots.trailing) {
                    _push3(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(uiProp)?.trailing }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "trailing", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      if (unref(trailingIconName)) {
                        _push3(ssrRenderComponent(_sfc_main$d, {
                          name: unref(trailingIconName),
                          "data-slot": "trailingIcon",
                          class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "leading",
                      class: ui.value.leading({ class: unref(uiProp)?.leading })
                    }, [
                      renderSlot(_ctx.$slots, "leading", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [
                        unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: unref(leadingIconName),
                          "data-slot": "leadingIcon",
                          class: ui.value.leadingIcon({ class: unref(uiProp)?.leadingIcon })
                        }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                          key: 1,
                          size: unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                        }, __props.avatar, {
                          "data-slot": "itemLeadingAvatar",
                          class: ui.value.itemLeadingAvatar({ class: unref(uiProp)?.itemLeadingAvatar })
                        }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                      ])
                    ], 2)) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                      return openBlock(), createBlock(unref(SelectValue_default), {
                        key: displayedModelValue,
                        "data-slot": displayedModelValue != null ? "value" : "placeholder",
                        class: displayedModelValue != null ? ui.value.value({ class: unref(uiProp)?.value }) : ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            createTextVNode(toDisplayString(displayedModelValue ?? (__props.placeholder ?? " ")), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["data-slot", "class"]);
                    }), 128)),
                    unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                      key: 1,
                      "data-slot": "trailing",
                      class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                    }, [
                      renderSlot(_ctx.$slots, "trailing", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [
                        unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: unref(trailingIconName),
                          "data-slot": "trailingIcon",
                          class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                        }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                      ])
                    ], 2)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(SelectPortal_default), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(SelectContent_default), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: unref(uiProp)?.content })
                        }, contentProps.value), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push5, _parent5, _scopeId4);
                              ssrRenderVNode(_push5, createVNode(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(groups.value, (group, groupIndex) => {
                                      _push6(ssrRenderComponent(unref(SelectGroup_default), {
                                        key: `group-${groupIndex}`,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: unref(uiProp)?.group })
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(group, (item, index) => {
                                              _push7(`<!--[-->`);
                                              if (isSelectItem(item) && item.type === "label") {
                                                _push7(ssrRenderComponent(unref(SelectLabel_default), {
                                                  "data-slot": "label",
                                                  class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(unref(get)(item, props.labelKey))}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else if (isSelectItem(item) && item.type === "separator") {
                                                _push7(ssrRenderComponent(unref(SelectSeparator_default), {
                                                  "data-slot": "separator",
                                                  class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                                }, null, _parent7, _scopeId6));
                                              } else {
                                                _push7(ssrRenderComponent(unref(SelectItem_default), {
                                                  "data-slot": "item",
                                                  class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                                  disabled: isSelectItem(item) && item.disabled,
                                                  value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                                  onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      ssrRenderSlot(_ctx.$slots, "item", {
                                                        item,
                                                        index,
                                                        ui: ui.value
                                                      }, () => {
                                                        ssrRenderSlot(_ctx.$slots, "item-leading", {
                                                          item,
                                                          index,
                                                          ui: ui.value
                                                        }, () => {
                                                          if (isSelectItem(item) && item.icon) {
                                                            _push8(ssrRenderComponent(_sfc_main$d, {
                                                              name: item.icon,
                                                              "data-slot": "itemLeadingIcon",
                                                              class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                            }, null, _parent8, _scopeId7));
                                                          } else if (isSelectItem(item) && item.avatar) {
                                                            _push8(ssrRenderComponent(_sfc_main$b, mergeProps({
                                                              size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                            }, { ref_for: true }, item.avatar, {
                                                              "data-slot": "itemLeadingAvatar",
                                                              class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                            }), null, _parent8, _scopeId7));
                                                          } else if (isSelectItem(item) && item.chip) {
                                                            _push8(ssrRenderComponent(_sfc_main$c, mergeProps({
                                                              size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                              inset: "",
                                                              standalone: ""
                                                            }, { ref_for: true }, item.chip, {
                                                              "data-slot": "itemLeadingChip",
                                                              class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                            }), null, _parent8, _scopeId7));
                                                          } else {
                                                            _push8(`<!---->`);
                                                          }
                                                        }, _push8, _parent8, _scopeId7);
                                                        _push8(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId7}>`);
                                                        _push8(ssrRenderComponent(unref(SelectItemText_default), {
                                                          "data-slot": "itemLabel",
                                                          class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                        }, {
                                                          default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                            if (_push9) {
                                                              ssrRenderSlot(_ctx.$slots, "item-label", {
                                                                item,
                                                                index
                                                              }, () => {
                                                                _push9(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, props.labelKey) : item)}`);
                                                              }, _push9, _parent9, _scopeId8);
                                                            } else {
                                                              return [
                                                                renderSlot(_ctx.$slots, "item-label", {
                                                                  item,
                                                                  index
                                                                }, () => [
                                                                  createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent8, _scopeId7));
                                                        if (isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"])) {
                                                          _push8(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId7}>`);
                                                          ssrRenderSlot(_ctx.$slots, "item-description", {
                                                            item,
                                                            index
                                                          }, () => {
                                                            _push8(`${ssrInterpolate(unref(get)(item, props.descriptionKey))}`);
                                                          }, _push8, _parent8, _scopeId7);
                                                          _push8(`</span>`);
                                                        } else {
                                                          _push8(`<!---->`);
                                                        }
                                                        _push8(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId7}>`);
                                                        ssrRenderSlot(_ctx.$slots, "item-trailing", {
                                                          item,
                                                          index,
                                                          ui: ui.value
                                                        }, null, _push8, _parent8, _scopeId7);
                                                        _push8(ssrRenderComponent(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                          default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                            if (_push9) {
                                                              _push9(ssrRenderComponent(_sfc_main$d, {
                                                                name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                                "data-slot": "itemTrailingIcon",
                                                                class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                              }, null, _parent9, _scopeId8));
                                                            } else {
                                                              return [
                                                                createVNode(_sfc_main$d, {
                                                                  name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                                  "data-slot": "itemTrailingIcon",
                                                                  class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                                }, null, 8, ["name", "class"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent8, _scopeId7));
                                                        _push8(`</span>`);
                                                      }, _push8, _parent8, _scopeId7);
                                                    } else {
                                                      return [
                                                        renderSlot(_ctx.$slots, "item", {
                                                          item,
                                                          index,
                                                          ui: ui.value
                                                        }, () => [
                                                          renderSlot(_ctx.$slots, "item-leading", {
                                                            item,
                                                            index,
                                                            ui: ui.value
                                                          }, () => [
                                                            isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                              key: 0,
                                                              name: item.icon,
                                                              "data-slot": "itemLeadingIcon",
                                                              class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                            }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                              key: 1,
                                                              size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                            }, { ref_for: true }, item.avatar, {
                                                              "data-slot": "itemLeadingAvatar",
                                                              class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                            }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                              key: 2,
                                                              size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                              inset: "",
                                                              standalone: ""
                                                            }, { ref_for: true }, item.chip, {
                                                              "data-slot": "itemLeadingChip",
                                                              class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                            }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                          ]),
                                                          createVNode("span", {
                                                            "data-slot": "itemWrapper",
                                                            class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                          }, [
                                                            createVNode(unref(SelectItemText_default), {
                                                              "data-slot": "itemLabel",
                                                              class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                            }, {
                                                              default: withCtx(() => [
                                                                renderSlot(_ctx.$slots, "item-label", {
                                                                  item,
                                                                  index
                                                                }, () => [
                                                                  createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                                ])
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["class"]),
                                                            isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                              key: 0,
                                                              "data-slot": "itemDescription",
                                                              class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                            }, [
                                                              renderSlot(_ctx.$slots, "item-description", {
                                                                item,
                                                                index
                                                              }, () => [
                                                                createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                              ])
                                                            ], 2)) : createCommentVNode("", true)
                                                          ], 2),
                                                          createVNode("span", {
                                                            "data-slot": "itemTrailing",
                                                            class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                          }, [
                                                            renderSlot(_ctx.$slots, "item-trailing", {
                                                              item,
                                                              index,
                                                              ui: ui.value
                                                            }),
                                                            createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_sfc_main$d, {
                                                                  name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                                  "data-slot": "itemTrailingIcon",
                                                                  class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                                }, null, 8, ["name", "class"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ], 2)
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              }
                                              _push7(`<!--]-->`);
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                                return openBlock(), createBlock(Fragment, {
                                                  key: `group-${groupIndex}-${index}`
                                                }, [
                                                  isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                                    key: 0,
                                                    "data-slot": "label",
                                                    class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                                    key: 1,
                                                    "data-slot": "separator",
                                                    class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                                  }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                                    key: 2,
                                                    "data-slot": "item",
                                                    class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                                    disabled: isSelectItem(item) && item.disabled,
                                                    value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                                    onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                                  }, {
                                                    default: withCtx(() => [
                                                      renderSlot(_ctx.$slots, "item", {
                                                        item,
                                                        index,
                                                        ui: ui.value
                                                      }, () => [
                                                        renderSlot(_ctx.$slots, "item-leading", {
                                                          item,
                                                          index,
                                                          ui: ui.value
                                                        }, () => [
                                                          isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                            key: 0,
                                                            name: item.icon,
                                                            "data-slot": "itemLeadingIcon",
                                                            class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                          }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                            key: 1,
                                                            size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                          }, { ref_for: true }, item.avatar, {
                                                            "data-slot": "itemLeadingAvatar",
                                                            class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                          }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                            key: 2,
                                                            size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                            inset: "",
                                                            standalone: ""
                                                          }, { ref_for: true }, item.chip, {
                                                            "data-slot": "itemLeadingChip",
                                                            class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                        ]),
                                                        createVNode("span", {
                                                          "data-slot": "itemWrapper",
                                                          class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                        }, [
                                                          createVNode(unref(SelectItemText_default), {
                                                            "data-slot": "itemLabel",
                                                            class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                          }, {
                                                            default: withCtx(() => [
                                                              renderSlot(_ctx.$slots, "item-label", {
                                                                item,
                                                                index
                                                              }, () => [
                                                                createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["class"]),
                                                          isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                            key: 0,
                                                            "data-slot": "itemDescription",
                                                            class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                          }, [
                                                            renderSlot(_ctx.$slots, "item-description", {
                                                              item,
                                                              index
                                                            }, () => [
                                                              createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                            ])
                                                          ], 2)) : createCommentVNode("", true)
                                                        ], 2),
                                                        createVNode("span", {
                                                          "data-slot": "itemTrailing",
                                                          class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                        }, [
                                                          renderSlot(_ctx.$slots, "item-trailing", {
                                                            item,
                                                            index,
                                                            ui: ui.value
                                                          }),
                                                          createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_sfc_main$d, {
                                                                name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                                "data-slot": "itemTrailingIcon",
                                                                class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                              }, null, 8, ["name", "class"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ], 2)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["class", "disabled", "value", "onSelect"]))
                                                ], 64);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                                        return openBlock(), createBlock(unref(SelectGroup_default), {
                                          key: `group-${groupIndex}`,
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                              return openBlock(), createBlock(Fragment, {
                                                key: `group-${groupIndex}-${index}`
                                              }, [
                                                isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                                  key: 0,
                                                  "data-slot": "label",
                                                  class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                                  key: 1,
                                                  "data-slot": "separator",
                                                  class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                                }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                                  key: 2,
                                                  "data-slot": "item",
                                                  class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                                  disabled: isSelectItem(item) && item.disabled,
                                                  value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                                  onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item", {
                                                      item,
                                                      index,
                                                      ui: ui.value
                                                    }, () => [
                                                      renderSlot(_ctx.$slots, "item-leading", {
                                                        item,
                                                        index,
                                                        ui: ui.value
                                                      }, () => [
                                                        isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                          key: 0,
                                                          name: item.icon,
                                                          "data-slot": "itemLeadingIcon",
                                                          class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                        }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                          key: 1,
                                                          size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                        }, { ref_for: true }, item.avatar, {
                                                          "data-slot": "itemLeadingAvatar",
                                                          class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                        }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                          key: 2,
                                                          size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                          inset: "",
                                                          standalone: ""
                                                        }, { ref_for: true }, item.chip, {
                                                          "data-slot": "itemLeadingChip",
                                                          class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                        }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                      ]),
                                                      createVNode("span", {
                                                        "data-slot": "itemWrapper",
                                                        class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                      }, [
                                                        createVNode(unref(SelectItemText_default), {
                                                          "data-slot": "itemLabel",
                                                          class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                        }, {
                                                          default: withCtx(() => [
                                                            renderSlot(_ctx.$slots, "item-label", {
                                                              item,
                                                              index
                                                            }, () => [
                                                              createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["class"]),
                                                        isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                          key: 0,
                                                          "data-slot": "itemDescription",
                                                          class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                        }, [
                                                          renderSlot(_ctx.$slots, "item-description", {
                                                            item,
                                                            index
                                                          }, () => [
                                                            createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                          ])
                                                        ], 2)) : createCommentVNode("", true)
                                                      ], 2),
                                                      createVNode("span", {
                                                        "data-slot": "itemTrailing",
                                                        class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                      }, [
                                                        renderSlot(_ctx.$slots, "item-trailing", {
                                                          item,
                                                          index,
                                                          ui: ui.value
                                                        }),
                                                        createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_sfc_main$d, {
                                                              name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                              "data-slot": "itemTrailingIcon",
                                                              class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                            }, null, 8, ["name", "class"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ], 2)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class", "disabled", "value", "onSelect"]))
                                              ], 64);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1032, ["class"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 2
                              }), _parent5, _scopeId4);
                              ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push5, _parent5, _scopeId4);
                              if (!!__props.arrow) {
                                _push5(ssrRenderComponent(unref(SelectArrow_default), mergeProps(arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "content-top"),
                                (openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
                                  ref_key: "viewportRef",
                                  ref: viewportRef,
                                  role: "presentation",
                                  "data-slot": "viewport",
                                  class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                                      return openBlock(), createBlock(unref(SelectGroup_default), {
                                        key: `group-${groupIndex}`,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: unref(uiProp)?.group })
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                            return openBlock(), createBlock(Fragment, {
                                              key: `group-${groupIndex}-${index}`
                                            }, [
                                              isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                                key: 0,
                                                "data-slot": "label",
                                                class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                                key: 1,
                                                "data-slot": "separator",
                                                class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                              }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                                key: 2,
                                                "data-slot": "item",
                                                class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                                disabled: isSelectItem(item) && item.disabled,
                                                value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                                onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                              }, {
                                                default: withCtx(() => [
                                                  renderSlot(_ctx.$slots, "item", {
                                                    item,
                                                    index,
                                                    ui: ui.value
                                                  }, () => [
                                                    renderSlot(_ctx.$slots, "item-leading", {
                                                      item,
                                                      index,
                                                      ui: ui.value
                                                    }, () => [
                                                      isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                        key: 0,
                                                        name: item.icon,
                                                        "data-slot": "itemLeadingIcon",
                                                        class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                      }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                        key: 1,
                                                        size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                      }, { ref_for: true }, item.avatar, {
                                                        "data-slot": "itemLeadingAvatar",
                                                        class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                      }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                        key: 2,
                                                        size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                        inset: "",
                                                        standalone: ""
                                                      }, { ref_for: true }, item.chip, {
                                                        "data-slot": "itemLeadingChip",
                                                        class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                    ]),
                                                    createVNode("span", {
                                                      "data-slot": "itemWrapper",
                                                      class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                    }, [
                                                      createVNode(unref(SelectItemText_default), {
                                                        "data-slot": "itemLabel",
                                                        class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                      }, {
                                                        default: withCtx(() => [
                                                          renderSlot(_ctx.$slots, "item-label", {
                                                            item,
                                                            index
                                                          }, () => [
                                                            createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["class"]),
                                                      isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                        key: 0,
                                                        "data-slot": "itemDescription",
                                                        class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                      }, [
                                                        renderSlot(_ctx.$slots, "item-description", {
                                                          item,
                                                          index
                                                        }, () => [
                                                          createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                        ])
                                                      ], 2)) : createCommentVNode("", true)
                                                    ], 2),
                                                    createVNode("span", {
                                                      "data-slot": "itemTrailing",
                                                      class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                    }, [
                                                      renderSlot(_ctx.$slots, "item-trailing", {
                                                        item,
                                                        index,
                                                        ui: ui.value
                                                      }),
                                                      createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_sfc_main$d, {
                                                            name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                            "data-slot": "itemTrailingIcon",
                                                            class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                          }, null, 8, ["name", "class"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ], 2)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["class", "disabled", "value", "onSelect"]))
                                            ], 64);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1032, ["class"]);
                                    }), 128))
                                  ]),
                                  _: 3
                                }, 8, ["class"])),
                                renderSlot(_ctx.$slots, "content-bottom"),
                                !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
                          createVNode(unref(SelectContent_default), mergeProps({
                            "data-slot": "content",
                            class: ui.value.content({ class: unref(uiProp)?.content })
                          }, contentProps.value), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content-top"),
                              (openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                                    return openBlock(), createBlock(unref(SelectGroup_default), {
                                      key: `group-${groupIndex}`,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: unref(uiProp)?.group })
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                          return openBlock(), createBlock(Fragment, {
                                            key: `group-${groupIndex}-${index}`
                                          }, [
                                            isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                              key: 0,
                                              "data-slot": "label",
                                              class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                              key: 1,
                                              "data-slot": "separator",
                                              class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                            }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                              key: 2,
                                              "data-slot": "item",
                                              class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                              disabled: isSelectItem(item) && item.disabled,
                                              value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                              onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                            }, {
                                              default: withCtx(() => [
                                                renderSlot(_ctx.$slots, "item", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }, () => [
                                                  renderSlot(_ctx.$slots, "item-leading", {
                                                    item,
                                                    index,
                                                    ui: ui.value
                                                  }, () => [
                                                    isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                      key: 0,
                                                      name: item.icon,
                                                      "data-slot": "itemLeadingIcon",
                                                      class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                    }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                      key: 1,
                                                      size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                    }, { ref_for: true }, item.avatar, {
                                                      "data-slot": "itemLeadingAvatar",
                                                      class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                    }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                      key: 2,
                                                      size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                      inset: "",
                                                      standalone: ""
                                                    }, { ref_for: true }, item.chip, {
                                                      "data-slot": "itemLeadingChip",
                                                      class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                  ]),
                                                  createVNode("span", {
                                                    "data-slot": "itemWrapper",
                                                    class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                  }, [
                                                    createVNode(unref(SelectItemText_default), {
                                                      "data-slot": "itemLabel",
                                                      class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                    }, {
                                                      default: withCtx(() => [
                                                        renderSlot(_ctx.$slots, "item-label", {
                                                          item,
                                                          index
                                                        }, () => [
                                                          createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["class"]),
                                                    isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                      key: 0,
                                                      "data-slot": "itemDescription",
                                                      class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                    }, [
                                                      renderSlot(_ctx.$slots, "item-description", {
                                                        item,
                                                        index
                                                      }, () => [
                                                        createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                      ])
                                                    ], 2)) : createCommentVNode("", true)
                                                  ], 2),
                                                  createVNode("span", {
                                                    "data-slot": "itemTrailing",
                                                    class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                  }, [
                                                    renderSlot(_ctx.$slots, "item-trailing", {
                                                      item,
                                                      index,
                                                      ui: ui.value
                                                    }),
                                                    createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_sfc_main$d, {
                                                          name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                          "data-slot": "itemTrailingIcon",
                                                          class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                        }, null, 8, ["name", "class"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ], 2)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["class", "disabled", "value", "onSelect"]))
                                          ], 64);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1032, ["class"]);
                                  }), 128))
                                ]),
                                _: 3
                              }, 8, ["class"])),
                              renderSlot(_ctx.$slots, "content-bottom"),
                              !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
                        createVNode(unref(SelectContent_default), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: unref(uiProp)?.content })
                        }, contentProps.value), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "content-top"),
                            (openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
                              ref_key: "viewportRef",
                              ref: viewportRef,
                              role: "presentation",
                              "data-slot": "viewport",
                              class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                                  return openBlock(), createBlock(unref(SelectGroup_default), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: unref(uiProp)?.group })
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                        return openBlock(), createBlock(Fragment, {
                                          key: `group-${groupIndex}-${index}`
                                        }, [
                                          isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                            key: 0,
                                            "data-slot": "label",
                                            class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                            key: 1,
                                            "data-slot": "separator",
                                            class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                          }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                            key: 2,
                                            "data-slot": "item",
                                            class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                            disabled: isSelectItem(item) && item.disabled,
                                            value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                            onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                          }, {
                                            default: withCtx(() => [
                                              renderSlot(_ctx.$slots, "item", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => [
                                                renderSlot(_ctx.$slots, "item-leading", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }, () => [
                                                  isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                    key: 0,
                                                    name: item.icon,
                                                    "data-slot": "itemLeadingIcon",
                                                    class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                    key: 1,
                                                    size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                  }, { ref_for: true }, item.avatar, {
                                                    "data-slot": "itemLeadingAvatar",
                                                    class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                    key: 2,
                                                    size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                    inset: "",
                                                    standalone: ""
                                                  }, { ref_for: true }, item.chip, {
                                                    "data-slot": "itemLeadingChip",
                                                    class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                ]),
                                                createVNode("span", {
                                                  "data-slot": "itemWrapper",
                                                  class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                                }, [
                                                  createVNode(unref(SelectItemText_default), {
                                                    "data-slot": "itemLabel",
                                                    class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                  }, {
                                                    default: withCtx(() => [
                                                      renderSlot(_ctx.$slots, "item-label", {
                                                        item,
                                                        index
                                                      }, () => [
                                                        createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["class"]),
                                                  isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                    key: 0,
                                                    "data-slot": "itemDescription",
                                                    class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                  }, [
                                                    renderSlot(_ctx.$slots, "item-description", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                    ])
                                                  ], 2)) : createCommentVNode("", true)
                                                ], 2),
                                                createVNode("span", {
                                                  "data-slot": "itemTrailing",
                                                  class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-trailing", {
                                                    item,
                                                    index,
                                                    ui: ui.value
                                                  }),
                                                  createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_sfc_main$d, {
                                                        name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                        "data-slot": "itemTrailingIcon",
                                                        class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                      }, null, 8, ["name", "class"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ], 2)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["class", "disabled", "value", "onSelect"]))
                                        ], 64);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128))
                              ]),
                              _: 3
                            }, 8, ["class"])),
                            renderSlot(_ctx.$slots, "content-bottom"),
                            !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
              createVNode(unref(SelectTrigger_default), mergeProps({
                id: unref(id),
                ref_key: "triggerRef",
                ref: triggerRef,
                "data-slot": "base",
                class: ui.value.base({ class: [unref(uiProp)?.base, props.class] })
              }, { ..._ctx.$attrs, ...unref(ariaAttrs) }), {
                default: withCtx(() => [
                  unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                    key: 0,
                    "data-slot": "leading",
                    class: ui.value.leading({ class: unref(uiProp)?.leading })
                  }, [
                    renderSlot(_ctx.$slots, "leading", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => [
                      unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                        key: 0,
                        name: unref(leadingIconName),
                        "data-slot": "leadingIcon",
                        class: ui.value.leadingIcon({ class: unref(uiProp)?.leadingIcon })
                      }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                        key: 1,
                        size: unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                      }, __props.avatar, {
                        "data-slot": "itemLeadingAvatar",
                        class: ui.value.itemLeadingAvatar({ class: unref(uiProp)?.itemLeadingAvatar })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                    ])
                  ], 2)) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                    return openBlock(), createBlock(unref(SelectValue_default), {
                      key: displayedModelValue,
                      "data-slot": displayedModelValue != null ? "value" : "placeholder",
                      class: displayedModelValue != null ? ui.value.value({ class: unref(uiProp)?.value }) : ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          createTextVNode(toDisplayString(displayedModelValue ?? (__props.placeholder ?? " ")), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["data-slot", "class"]);
                  }), 128)),
                  unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                    key: 1,
                    "data-slot": "trailing",
                    class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                  }, [
                    renderSlot(_ctx.$slots, "trailing", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => [
                      unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                        key: 0,
                        name: unref(trailingIconName),
                        "data-slot": "trailingIcon",
                        class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                    ])
                  ], 2)) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1040, ["id", "class"]),
              createVNode(unref(SelectPortal_default), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      createVNode(unref(SelectContent_default), mergeProps({
                        "data-slot": "content",
                        class: ui.value.content({ class: unref(uiProp)?.content })
                      }, contentProps.value), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "content-top"),
                          (openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
                            ref_key: "viewportRef",
                            ref: viewportRef,
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                                return openBlock(), createBlock(unref(SelectGroup_default), {
                                  key: `group-${groupIndex}`,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: unref(uiProp)?.group })
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                      return openBlock(), createBlock(Fragment, {
                                        key: `group-${groupIndex}-${index}`
                                      }, [
                                        isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
                                          key: 0,
                                          "data-slot": "label",
                                          class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
                                          key: 1,
                                          "data-slot": "separator",
                                          class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
                                        }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
                                          key: 2,
                                          "data-slot": "item",
                                          class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                                          disabled: isSelectItem(item) && item.disabled,
                                          value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                          onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "item", {
                                              item,
                                              index,
                                              ui: ui.value
                                            }, () => [
                                              renderSlot(_ctx.$slots, "item-leading", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => [
                                                isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$d, {
                                                  key: 0,
                                                  name: item.icon,
                                                  "data-slot": "itemLeadingIcon",
                                                  class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                                                }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                                                  key: 1,
                                                  size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                                                }, { ref_for: true }, item.avatar, {
                                                  "data-slot": "itemLeadingAvatar",
                                                  class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                                                }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                                  key: 2,
                                                  size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                                                  inset: "",
                                                  standalone: ""
                                                }, { ref_for: true }, item.chip, {
                                                  "data-slot": "itemLeadingChip",
                                                  class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                                                }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                              ]),
                                              createVNode("span", {
                                                "data-slot": "itemWrapper",
                                                class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                                              }, [
                                                createVNode(unref(SelectItemText_default), {
                                                  "data-slot": "itemLabel",
                                                  class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"]),
                                                isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  "data-slot": "itemDescription",
                                                  class: ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-description", {
                                                    item,
                                                    index
                                                  }, () => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                  ])
                                                ], 2)) : createCommentVNode("", true)
                                              ], 2),
                                              createVNode("span", {
                                                "data-slot": "itemTrailing",
                                                class: ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                                              }, [
                                                renderSlot(_ctx.$slots, "item-trailing", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }),
                                                createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_sfc_main$d, {
                                                      name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                                      "data-slot": "itemTrailingIcon",
                                                      class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                                                    }, null, 8, ["name", "class"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ], 2)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["class", "disabled", "value", "onSelect"]))
                                      ], 64);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1032, ["class"]);
                              }), 128))
                            ]),
                            _: 3
                          }, 8, ["class"])),
                          renderSlot(_ctx.$slots, "content-bottom"),
                          !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Select.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Select-DYGJGuWK.mjs.map
