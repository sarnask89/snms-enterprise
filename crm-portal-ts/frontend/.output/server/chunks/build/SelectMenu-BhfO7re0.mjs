import { useSlots, useModel, toRef, computed, useTemplateRef, unref, withCtx, createVNode, renderSlot, createTextVNode, toDisplayString, mergeProps, openBlock, createBlock, createCommentVNode, withModifiers, Fragment, renderList, mergeModels, defineComponent, normalizeProps, guardReactiveProps, toRefs, ref, getCurrentInstance, isRef, toRaw, watch, withKeys, nextTick, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { s as useLocale, h as useAppConfig, i as useComponentUI, v as useForwardPropsEmits, F as usePortal, D as useFormField, G as useFieldGroup, H as useComponentIcons, t as tv, I as isArrayOfArray, J as compare, K as get, e as _sfc_main$d, z as _sfc_main$b, L as _sfc_main$c, b as _sfc_main$8, M as FieldGroupReset, E as usePrimitiveElement, q as useForwardExpose, P as Primitive, N as looseToNumber, O as getDisplayValue, T as Teleport_default, C as Presence_default, r as createContext, w as useForwardProps } from './server.mjs';
import { F as FocusScope_default, u as useId, a as useBodyScrollLock, b as useHideOthers, D as DismissableLayer_default } from './FocusScope-afTtc11Z.mjs';
import { a as useDirection, P as PopperRoot_default, b as PopperAnchor_default, c as PopperArrow_default, d as useFocusGuards, e as PopperContent_default } from './PopperArrow-CiJ5PBIc.mjs';
import { u as useFilter, a as useFilter$1 } from './useFilter-BytkjEhg.mjs';
import { g as getEstimateSize, L as ListboxItem_default, a as ListboxItemIndicator_default, b as ListboxRoot_default, i as injectListboxRootContext, c as ListboxFilter_default, d as ListboxVirtualizer_default, e as ListboxGroup_default, f as ListboxContent_default } from './virtualizer-Dnga9fey.mjs';
import { reactivePick, createReusableTemplate, useVModel, createEventHook } from '@vueuse/core';
import { x as defu } from '../_/nitro.mjs';
import { _ as _sfc_main$1 } from './Input-B7kliWtD.mjs';

const [injectComboboxRootContext, provideComboboxRootContext] = /* @__PURE__ */ createContext("ComboboxRoot");
var ComboboxRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxRoot",
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
    resetSearchTermOnBlur: {
      type: Boolean,
      required: false,
      default: true
    },
    resetSearchTermOnSelect: {
      type: Boolean,
      required: false,
      default: true
    },
    openOnFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    openOnClick: {
      type: Boolean,
      required: false,
      default: false
    },
    ignoreFilter: {
      type: Boolean,
      required: false
    },
    resetModelValueOnClear: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    highlightOnHover: {
      type: Boolean,
      required: false,
      default: true
    },
    by: {
      type: [String, Function],
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
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "update:modelValue",
    "highlight",
    "update:open"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
    const { multiple, disabled, ignoreFilter, resetSearchTermOnSelect, openOnFocus, openOnClick, dir: propDir, resetModelValueOnClear, highlightOnHover } = toRefs(props);
    const dir = useDirection(propDir);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
      passive: props.modelValue === void 0,
      deep: true
    });
    const open = useVModel(props, "open", emits, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    async function onOpenChange(val) {
      open.value = val;
      filterSearch.value = "";
      if (val) {
        await nextTick();
        primitiveElement.value?.highlightSelected();
        isUserInputted.value = true;
        inputElement.value?.focus();
      } else {
        isUserInputted.value = false;
        setTimeout(() => {
          if (!val && props.resetSearchTermOnBlur) resetSearchTerm.trigger();
        }, 1);
      }
    }
    const resetSearchTerm = createEventHook();
    const isUserInputted = ref(false);
    const isVirtual = ref(false);
    const inputElement = ref();
    const triggerElement = ref();
    const highlightedElement = computed(() => primitiveElement.value?.highlightedElement ?? void 0);
    const allItems = ref(/* @__PURE__ */ new Map());
    const allGroups = ref(/* @__PURE__ */ new Map());
    const { contains } = useFilter$1({ sensitivity: "base" });
    const filterSearch = ref("");
    const filterState = computed((oldValue) => {
      if (!filterSearch.value || props.ignoreFilter || isVirtual.value) return {
        count: allItems.value.size,
        items: oldValue?.items ?? /* @__PURE__ */ new Map(),
        groups: oldValue?.groups ?? new Set(allGroups.value.keys())
      };
      let itemCount = 0;
      const filteredItems = /* @__PURE__ */ new Map();
      const filteredGroups = /* @__PURE__ */ new Set();
      for (const [id, value] of allItems.value) {
        const score = contains(value, filterSearch.value);
        filteredItems.set(id, score ? 1 : 0);
        if (score) itemCount++;
      }
      for (const [groupId, group] of allGroups.value) for (const itemId of group) if (filteredItems.get(itemId) > 0) {
        filteredGroups.add(groupId);
        break;
      }
      return {
        count: itemCount,
        items: filteredItems,
        groups: filteredGroups
      };
    });
    getCurrentInstance();
    __expose({
      filtered: filterState,
      highlightedElement,
      highlightItem: primitiveElement.value?.highlightItem,
      highlightFirstItem: primitiveElement.value?.highlightFirstItem,
      highlightSelected: primitiveElement.value?.highlightSelected
    });
    provideComboboxRootContext({
      modelValue,
      multiple,
      disabled,
      open,
      onOpenChange,
      contentId: "",
      isUserInputted,
      isVirtual,
      inputElement,
      highlightedElement,
      onInputElementChange: (val) => inputElement.value = val,
      triggerElement,
      onTriggerElementChange: (val) => triggerElement.value = val,
      parentElement,
      resetSearchTermOnSelect,
      onResetSearchTerm: resetSearchTerm.on,
      allItems,
      allGroups,
      filterSearch,
      filterState,
      ignoreFilter,
      openOnFocus,
      openOnClick,
      resetModelValueOnClear
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [createVNode(unref(ListboxRoot_default), mergeProps({
          ref_key: "primitiveElement",
          ref: primitiveElement
        }, _ctx.$attrs, {
          modelValue: unref(modelValue),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
          style: { pointerEvents: unref(open) ? "auto" : void 0 },
          as: _ctx.as,
          "as-child": _ctx.asChild,
          dir: unref(dir),
          multiple: unref(multiple),
          name: _ctx.name,
          required: _ctx.required,
          disabled: unref(disabled),
          "highlight-on-hover": unref(highlightOnHover),
          by: props.by,
          onHighlight: _cache[1] || (_cache[1] = ($event) => emits("highlight", $event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
            open: unref(open),
            modelValue: unref(modelValue)
          })]),
          _: 3
        }, 16, [
          "modelValue",
          "style",
          "as",
          "as-child",
          "dir",
          "multiple",
          "name",
          "required",
          "disabled",
          "highlight-on-hover",
          "by"
        ])]),
        _: 3
      });
    };
  }
});
var ComboboxRoot_default = ComboboxRoot_vue_vue_type_script_setup_true_lang_default;
var ComboboxAnchor_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxAnchor",
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
      required: false
    }
  },
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "as-child": _ctx.asChild,
          as: _ctx.as
        }, _ctx.$attrs), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, ["as-child", "as"])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var ComboboxAnchor_default = ComboboxAnchor_vue_vue_type_script_setup_true_lang_default;
const [injectComboboxContentContext, provideComboboxContentContext] = /* @__PURE__ */ createContext("ComboboxContent");
var ComboboxContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxContentImpl",
  props: {
    position: {
      type: String,
      required: false,
      default: "inline"
    },
    bodyLock: {
      type: Boolean,
      required: false
    },
    hideWhenEmpty: {
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
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { position } = toRefs(props);
    const rootContext = injectComboboxRootContext();
    const isEmpty = computed(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
    const { forwardRef } = useForwardExpose();
    useBodyScrollLock(props.bodyLock);
    useFocusGuards();
    useHideOthers(rootContext.parentElement);
    const pickedProps = computed(() => {
      if (props.position === "popper") return props;
      else return {};
    });
    const forwardedProps = useForwardProps(pickedProps.value);
    const popperStyle = {
      "boxSizing": "border-box",
      "--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
      "--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
      "--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
    };
    provideComboboxContentContext({ position });
    ref(false);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxContent_default), { "as-child": "" }, {
        default: withCtx(() => [createVNode(unref(FocusScope_default), {
          "as-child": "",
          onMountAutoFocus: _cache[5] || (_cache[5] = withModifiers(() => {
          }, ["prevent"])),
          onUnmountAutoFocus: _cache[6] || (_cache[6] = withModifiers(() => {
          }, ["prevent"]))
        }, {
          default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
            "as-child": "",
            "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
            onDismiss: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false)),
            onFocusOutside: _cache[1] || (_cache[1] = (ev) => {
              if (unref(rootContext).parentElement.value?.contains(ev.target)) ev.preventDefault();
              emits("focusOutside", ev);
            }),
            onInteractOutside: _cache[2] || (_cache[2] = ($event) => emits("interactOutside", $event)),
            onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
            onPointerDownOutside: _cache[4] || (_cache[4] = (ev) => {
              if (unref(rootContext).parentElement.value?.contains(ev.target)) ev.preventDefault();
              emits("pointerDownOutside", ev);
            })
          }, {
            default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(unref(position) === "popper" ? unref(PopperContent_default) : unref(Primitive)), mergeProps({
              ..._ctx.$attrs,
              ...unref(forwardedProps)
            }, {
              id: unref(rootContext).contentId,
              ref: unref(forwardRef),
              "data-state": unref(rootContext).open.value ? "open" : "closed",
              "data-empty": isEmpty.value ? "" : void 0,
              style: {
                display: props.hideWhenEmpty && isEmpty.value ? "none" : "flex",
                flexDirection: "column",
                outline: "none",
                ...unref(position) === "popper" ? popperStyle : {}
              }
            }), {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
              _: 3
            }, 16, [
              "id",
              "data-state",
              "data-empty",
              "style"
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
var ComboboxContentImpl_default = ComboboxContentImpl_vue_vue_type_script_setup_true_lang_default;
var ComboboxArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxArrow",
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
    const rootContext = injectComboboxRootContext();
    const contentContext = injectComboboxContentContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return unref(rootContext).open.value && unref(contentContext).position.value === "popper" ? (openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(mergeProps({ key: 0 }, props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var ComboboxArrow_default = ComboboxArrow_vue_vue_type_script_setup_true_lang_default;
var ComboboxCancel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxCancel",
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
    const rootContext = injectComboboxRootContext();
    function handleClick() {
      rootContext.filterSearch.value = "";
      if (rootContext.inputElement.value) {
        rootContext.inputElement.value.value = "";
        rootContext.inputElement.value.focus();
      }
      if (rootContext.resetModelValueOnClear?.value) rootContext.modelValue.value = rootContext.multiple.value ? [] : null;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ type: _ctx.as === "button" ? "button" : void 0 }, props, {
        tabindex: "-1",
        onClick: handleClick
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["type"]);
    };
  }
});
var ComboboxCancel_default = ComboboxCancel_vue_vue_type_script_setup_true_lang_default;
var ComboboxContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxContent",
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
    hideWhenEmpty: {
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
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef } = useForwardExpose();
    const rootContext = injectComboboxRootContext();
    rootContext.contentId ||= useId(void 0, "reka-combobox-content");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
        default: withCtx(() => [createVNode(ComboboxContentImpl_default, mergeProps({
          ...unref(forwarded),
          ..._ctx.$attrs
        }, { ref: unref(forwardRef) }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var ComboboxContent_default = ComboboxContent_vue_vue_type_script_setup_true_lang_default;
var ComboboxEmpty_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxEmpty",
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
    const rootContext = injectComboboxRootContext();
    const isRender = computed(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
    return (_ctx, _cache) => {
      return isRender.value ? (openBlock(), createBlock(unref(Primitive), normalizeProps(mergeProps({ key: 0 }, props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createTextVNode("No options"))])]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var ComboboxEmpty_default = ComboboxEmpty_vue_vue_type_script_setup_true_lang_default;
const [injectComboboxGroupContext, provideComboboxGroupContext] = /* @__PURE__ */ createContext("ComboboxGroup");
var ComboboxGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxGroup",
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
    const id = useId(void 0, "reka-combobox-group");
    const rootContext = injectComboboxRootContext();
    const isRender = computed(() => rootContext.ignoreFilter.value ? true : !rootContext.filterSearch.value ? true : rootContext.filterState.value.groups.has(id));
    const context = provideComboboxGroupContext({
      id,
      labelId: ""
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxGroup_default), mergeProps({
        id: unref(id),
        "aria-labelledby": unref(context).labelId
      }, props, { hidden: isRender.value ? void 0 : true }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "hidden"
      ]);
    };
  }
});
var ComboboxGroup_default = ComboboxGroup_vue_vue_type_script_setup_true_lang_default;
var ComboboxInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxInput",
  props: {
    displayValue: {
      type: Function,
      required: false
    },
    modelValue: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
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
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectComboboxRootContext();
    const listboxContext = injectListboxRootContext();
    const { primitiveElement } = usePrimitiveElement();
    const modelValue = useVModel(props, "modelValue", emits, { passive: props.modelValue === void 0 });
    function handleKeyDown(ev) {
      if (!rootContext.open.value) rootContext.onOpenChange(true);
    }
    function handleInput(event) {
      const target = event.target;
      if (!rootContext.open.value) {
        rootContext.onOpenChange(true);
        nextTick(() => {
          if (target.value) {
            rootContext.filterSearch.value = target.value;
            listboxContext.highlightFirstItem();
          }
        });
      } else rootContext.filterSearch.value = target.value;
    }
    function handleFocus() {
      if (rootContext.openOnFocus.value && !rootContext.open.value) rootContext.onOpenChange(true);
    }
    function handleBlur(ev) {
      if (!rootContext.open.value) return;
      const nextFocus = ev.relatedTarget;
      if (!nextFocus) return;
      const isInsideRoot = rootContext.parentElement.value?.contains(nextFocus);
      const isInsideContent = (void 0).getElementById(rootContext.contentId)?.contains(nextFocus);
      if (!isInsideRoot && !isInsideContent) rootContext.onOpenChange(false);
    }
    function handleClick() {
      if (rootContext.openOnClick.value && !rootContext.open.value) rootContext.onOpenChange(true);
    }
    function resetSearchTerm() {
      const rootModelValue = rootContext.modelValue.value;
      if (props.displayValue) modelValue.value = props.displayValue(rootModelValue);
      else if (!rootContext.multiple.value && rootModelValue && !Array.isArray(rootModelValue)) if (typeof rootModelValue !== "object") modelValue.value = rootModelValue.toString();
      else modelValue.value = "";
      else modelValue.value = "";
      nextTick(() => {
        modelValue.value = modelValue.value;
      });
    }
    rootContext.onResetSearchTerm(() => {
      resetSearchTerm();
    });
    watch(rootContext.modelValue, async () => {
      if (!rootContext.isUserInputted.value && rootContext.resetSearchTermOnSelect.value) resetSearchTerm();
    }, {
      immediate: true,
      deep: true
    });
    watch(rootContext.filterState, (_newValue, oldValue) => {
      if (!rootContext.isVirtual.value && oldValue.count === 0) listboxContext.highlightFirstItem();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxFilter_default), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        modelValue: unref(modelValue),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "auto-focus": _ctx.autoFocus,
        disabled: _ctx.disabled,
        "aria-expanded": unref(rootContext).open.value,
        "aria-controls": unref(rootContext).contentId,
        "aria-autocomplete": "list",
        role: "combobox",
        autocomplete: "off",
        onClick: handleClick,
        onInput: handleInput,
        onKeydown: withKeys(withModifiers(handleKeyDown, ["prevent"]), ["down", "up"]),
        onFocus: handleFocus,
        onBlur: handleBlur
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "modelValue",
        "as",
        "as-child",
        "auto-focus",
        "disabled",
        "aria-expanded",
        "aria-controls",
        "onKeydown"
      ]);
    };
  }
});
var ComboboxInput_default = ComboboxInput_vue_vue_type_script_setup_true_lang_default;
var ComboboxItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxItem",
  props: {
    textValue: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: true
    },
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
      required: false
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const id = useId(void 0, "reka-combobox-item");
    const rootContext = injectComboboxRootContext();
    injectComboboxGroupContext(null);
    const { primitiveElement } = usePrimitiveElement();
    if (props.value === "") throw new Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
    const isRender = computed(() => {
      if (rootContext.isVirtual.value || rootContext.ignoreFilter.value || !rootContext.filterSearch.value) return true;
      else {
        const filteredCurrentItem = rootContext.filterState.value.items.get(id);
        if (filteredCurrentItem === void 0) return true;
        return filteredCurrentItem > 0;
      }
    });
    return (_ctx, _cache) => {
      return isRender.value ? (openBlock(), createBlock(unref(ListboxItem_default), mergeProps({ key: 0 }, props, {
        id: unref(id),
        ref_key: "primitiveElement",
        ref: primitiveElement,
        disabled: unref(rootContext).disabled.value || _ctx.disabled,
        onSelect: _cache[0] || (_cache[0] = (event) => {
          emits("select", event);
          if (event.defaultPrevented) return;
          if (!unref(rootContext).multiple.value && !_ctx.disabled && !unref(rootContext).disabled.value) {
            event.preventDefault();
            unref(rootContext).onOpenChange(false);
            unref(rootContext).modelValue.value = props.value;
          } else if (unref(rootContext).multiple.value) unref(rootContext).inputElement.value?.focus();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.value), 1)])]),
        _: 3
      }, 16, ["id", "disabled"])) : createCommentVNode("v-if", true);
    };
  }
});
var ComboboxItem_default = ComboboxItem_vue_vue_type_script_setup_true_lang_default;
var ComboboxItemIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxItemIndicator",
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxItemIndicator_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxItemIndicator_default = ComboboxItemIndicator_vue_vue_type_script_setup_true_lang_default;
var ComboboxLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxLabel",
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
    useForwardExpose();
    const groupContext = injectComboboxGroupContext({
      id: "",
      labelId: ""
    });
    groupContext.labelId ||= useId(void 0, "reka-combobox-group-label");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).labelId }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var ComboboxLabel_default = ComboboxLabel_vue_vue_type_script_setup_true_lang_default;
var ComboboxPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxPortal",
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
var ComboboxPortal_default = ComboboxPortal_vue_vue_type_script_setup_true_lang_default;
var ComboboxSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxSeparator",
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
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "aria-hidden": "true" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxSeparator_default = ComboboxSeparator_vue_vue_type_script_setup_true_lang_default;
var ComboboxTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxTrigger",
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
    const { forwardRef } = useForwardExpose();
    const rootContext = injectComboboxRootContext();
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        ref: unref(forwardRef),
        type: _ctx.as === "button" ? "button" : void 0,
        tabindex: "-1",
        "aria-label": "Show popup",
        "aria-haspopup": "listbox",
        "aria-expanded": unref(rootContext).open.value,
        "aria-controls": unref(rootContext).contentId,
        "data-state": unref(rootContext).open.value ? "open" : "closed",
        disabled: disabled.value,
        "data-disabled": disabled.value ? "" : void 0,
        "aria-disabled": disabled.value ?? void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(!unref(rootContext).open.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "aria-expanded",
        "aria-controls",
        "data-state",
        "disabled",
        "data-disabled",
        "aria-disabled"
      ]);
    };
  }
});
var ComboboxTrigger_default = ComboboxTrigger_vue_vue_type_script_setup_true_lang_default;
var ComboboxVirtualizer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxVirtualizer",
  props: {
    options: {
      type: Array,
      required: true
    },
    overscan: {
      type: Number,
      required: false
    },
    estimateSize: {
      type: [Number, Function],
      required: false
    },
    textContent: {
      type: Function,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectComboboxRootContext();
    rootContext.isVirtual.value = true;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ListboxVirtualizer_default, normalizeProps(guardReactiveProps(props)), {
        default: withCtx((slotProps) => [renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)))]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxVirtualizer_default = ComboboxVirtualizer_vue_vue_type_script_setup_true_lang_default;
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
    "content": [
      "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
      "origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"
    ],
    "viewport": "relative scroll-py-1 overflow-y-auto flex-1",
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
    "itemDescription": "truncate text-muted",
    "input": "border-b border-default",
    "focusScope": "flex flex-col min-h-0",
    "trailingClear": "p-0"
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
    },
    "virtualize": {
      "true": {
        "viewport": "p-1 isolate"
      },
      "false": {
        "viewport": "divide-y divide-default"
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
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
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
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
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
  __name: "USelectMenu",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: { type: String, required: false },
    placeholder: { type: String, required: false },
    searchInput: { type: [Boolean, Object], required: false, default: true },
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
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    valueKey: { type: null, required: false },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    items: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    modelModifiers: { type: null, required: false },
    multiple: { type: Boolean, required: false },
    highlight: { type: Boolean, required: false },
    createItem: { type: [Boolean, String, Object], required: false },
    filterFields: { type: Array, required: false },
    ignoreFilter: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    resetSearchTermOnBlur: { type: Boolean, required: false, default: true },
    resetSearchTermOnSelect: { type: Boolean, required: false, default: true },
    resetModelValueOnClear: { type: Boolean, required: false, default: true },
    highlightOnHover: { type: Boolean, required: false },
    by: { type: [String, Function], required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  }, {
    "searchTerm": { type: String, ...{ default: "" } },
    "searchTermModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change", "blur", "focus", "create", "clear", "highlight", "update:modelValue", "update:open"], ["update:searchTerm"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const searchTerm = useModel(__props, "searchTerm", { type: String, ...{ default: "" } });
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("selectMenu", props);
    const { filterGroups } = useFilter();
    const rootProps = useForwardPropsEmits(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "by"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const clearProps = computed(() => typeof props.clear === "object" ? props.clear : {});
    const virtualizerProps = toRef(() => {
      if (!props.virtualize) return false;
      return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
        estimateSize: getEstimateSize(filteredItems.value, selectSize.value || "md", props.descriptionKey, !!slots["item-description"])
      });
    });
    const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t("selectMenu.search"), variant: "none" }));
    const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
    const selectSize = computed(() => fieldGroupSize.value || formFieldSize.value);
    const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
    const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
      props: {
        item: {
          type: [Object, String, Number, Boolean],
          required: true
        },
        index: {
          type: Number,
          required: false
        }
      }
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.selectMenu || {} })({
      color: color.value,
      variant: props.variant,
      size: selectSize?.value,
      loading: props.loading,
      highlight: highlight.value,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value,
      virtualize: !!props.virtualize
    }));
    function displayValue(value) {
      if (props.multiple && Array.isArray(value)) {
        const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey,
          by: props.by
        })).filter((v) => v != null && v !== "");
        return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
      }
      return getDisplayValue(items.value, value, {
        labelKey: props.labelKey,
        valueKey: props.valueKey,
        by: props.by
      });
    }
    const groups = computed(
      () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
    );
    const items = computed(() => groups.value.flatMap((group) => group));
    const filteredGroups = computed(() => {
      if (props.ignoreFilter || !searchTerm.value) {
        return groups.value;
      }
      const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
      return filterGroups(groups.value, searchTerm.value, {
        fields,
        isStructural: (item) => isSelectItem(item) && !!item.type && ["label", "separator"].includes(item.type)
      });
    });
    const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
    const createItem = computed(() => {
      if (!props.createItem || !searchTerm.value) {
        return false;
      }
      const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
      if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") {
        return !filteredItems.value.find((item) => compare(item, newItem, props.by ?? props.valueKey));
      }
      return !filteredItems.value.length;
    });
    const createItemPosition = computed(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
    const triggerRef = useTemplateRef("triggerRef");
    function onUpdate(value) {
      if (toRaw(props.modelValue) === value) {
        return;
      }
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
      if (props.resetSearchTermOnSelect) {
        searchTerm.value = "";
      }
    }
    function onUpdateOpen(value) {
      let timeoutId;
      if (!value) {
        const event = new FocusEvent("blur");
        emits("blur", event);
        emitFormBlur();
        if (props.resetSearchTermOnBlur) {
          const STATE_ANIMATION_DELAY_MS = 100;
          timeoutId = setTimeout(() => {
            searchTerm.value = "";
          }, STATE_ANIMATION_DELAY_MS);
        }
      } else {
        const event = new FocusEvent("focus");
        emits("focus", event);
        emitFormFocus();
        clearTimeout(timeoutId);
      }
    }
    function onCreate(e) {
      e.preventDefault();
      e.stopPropagation();
      emits("create", searchTerm.value);
    }
    function onSelect(e, item) {
      if (!isSelectItem(item)) {
        return;
      }
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      item.onSelect?.(e);
    }
    function isSelectItem(item) {
      return typeof item === "object" && item !== null;
    }
    function isModelValueEmpty(modelValue) {
      if (props.multiple && Array.isArray(modelValue)) {
        return modelValue.length === 0;
      }
      return modelValue === void 0 || modelValue === null || modelValue === "";
    }
    function onClear() {
      emits("clear");
    }
    const viewportRef = useTemplateRef("viewportRef");
    __expose({
      triggerRef: toRef(() => triggerRef.value?.$el),
      viewportRef: toRef(() => viewportRef.value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineCreateItemTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ComboboxItem_default), {
              "data-slot": "item",
              class: ui.value.item({ class: unref(uiProp)?.item }),
              value: searchTerm.value,
              onSelect: onCreate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: unref(uiProp)?.itemLabel }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => {
                    _push3(`${ssrInterpolate(unref(t)("selectMenu.create", { label: searchTerm.value }))}`);
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</span>`);
                } else {
                  return [
                    createVNode("span", {
                      "data-slot": "itemLabel",
                      class: ui.value.itemLabel({ class: unref(uiProp)?.itemLabel })
                    }, [
                      renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [
                        createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)
                      ])
                    ], 2)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ComboboxItem_default), {
                "data-slot": "item",
                class: ui.value.item({ class: unref(uiProp)?.item }),
                value: searchTerm.value,
                onSelect: onCreate
              }, {
                default: withCtx(() => [
                  createVNode("span", {
                    "data-slot": "itemLabel",
                    class: ui.value.itemLabel({ class: unref(uiProp)?.itemLabel })
                  }, [
                    renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [
                      createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)
                    ])
                  ], 2)
                ]),
                _: 3
              }, 8, ["class", "value"])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineItemTemplate), null, {
        default: withCtx(({ item, index }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (isSelectItem(item) && item.type === "label") {
              _push2(ssrRenderComponent(unref(ComboboxLabel_default), {
                "data-slot": "label",
                class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(get)(item, props.labelKey))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else if (isSelectItem(item) && item.type === "separator") {
              _push2(ssrRenderComponent(unref(ComboboxSeparator_default), {
                "data-slot": "separator",
                class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(ComboboxItem_default), {
                "data-slot": "item",
                class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                disabled: isSelectItem(item) && item.disabled,
                value: props.valueKey && isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                onSelect: ($event) => onSelect($event, item)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
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
                          _push3(ssrRenderComponent(_sfc_main$d, {
                            name: item.icon,
                            "data-slot": "itemLeadingIcon",
                            class: ui.value.itemLeadingIcon({ class: [unref(uiProp)?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                          }, null, _parent3, _scopeId2));
                        } else if (isSelectItem(item) && item.avatar) {
                          _push3(ssrRenderComponent(_sfc_main$b, mergeProps({
                            size: item.ui?.itemLeadingAvatarSize || unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                          }, item.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                          }), null, _parent3, _scopeId2));
                        } else if (isSelectItem(item) && item.chip) {
                          _push3(ssrRenderComponent(_sfc_main$c, mergeProps({
                            size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                            inset: "",
                            standalone: ""
                          }, item.chip, {
                            "data-slot": "itemLeadingChip",
                            class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                          }), null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                      }, _push3, _parent3, _scopeId2);
                      _push3(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId2}><span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] }))}"${_scopeId2}>`);
                      ssrRenderSlot(_ctx.$slots, "item-label", {
                        item,
                        index
                      }, () => {
                        _push3(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, props.labelKey) : item)}`);
                      }, _push3, _parent3, _scopeId2);
                      _push3(`</span>`);
                      if (isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"])) {
                        _push3(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [unref(uiProp)?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId2}>`);
                        ssrRenderSlot(_ctx.$slots, "item-description", {
                          item,
                          index
                        }, () => {
                          _push3(`${ssrInterpolate(unref(get)(item, props.descriptionKey))}`);
                        }, _push3, _parent3, _scopeId2);
                        _push3(`</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [unref(uiProp)?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId2}>`);
                      ssrRenderSlot(_ctx.$slots, "item-trailing", {
                        item,
                        index,
                        ui: ui.value
                      }, null, _push3, _parent3, _scopeId2);
                      _push3(ssrRenderComponent(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_sfc_main$d, {
                              name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                              "data-slot": "itemTrailingIcon",
                              class: ui.value.itemTrailingIcon({ class: [unref(uiProp)?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                            }, null, _parent4, _scopeId3));
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
                      }, _parent3, _scopeId2));
                      _push3(`</span>`);
                    }, _push3, _parent3, _scopeId2);
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
                          }, item.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                          }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                            key: 2,
                            size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                            inset: "",
                            standalone: ""
                          }, item.chip, {
                            "data-slot": "itemLeadingChip",
                            class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                        ]),
                        createVNode("span", {
                          "data-slot": "itemWrapper",
                          class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                        }, [
                          createVNode("span", {
                            "data-slot": "itemLabel",
                            class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                          }, [
                            renderSlot(_ctx.$slots, "item-label", {
                              item,
                              index
                            }, () => [
                              createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                            ])
                          ], 2),
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
                          createVNode(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
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
              }, _parent2, _scopeId));
            }
          } else {
            return [
              isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(ComboboxLabel_default), {
                key: 0,
                "data-slot": "label",
                class: ui.value.label({ class: [unref(uiProp)?.label, item.ui?.label, item.class] })
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                ]),
                _: 2
              }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(ComboboxSeparator_default), {
                key: 1,
                "data-slot": "separator",
                class: ui.value.separator({ class: [unref(uiProp)?.separator, item.ui?.separator, item.class] })
              }, null, 8, ["class"])) : (openBlock(), createBlock(unref(ComboboxItem_default), {
                key: 2,
                "data-slot": "item",
                class: ui.value.item({ class: [unref(uiProp)?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                disabled: isSelectItem(item) && item.disabled,
                value: props.valueKey && isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                onSelect: ($event) => onSelect($event, item)
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
                      }, item.avatar, {
                        "data-slot": "itemLeadingAvatar",
                        class: ui.value.itemLeadingAvatar({ class: [unref(uiProp)?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                      }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                        key: 2,
                        size: item.ui?.itemLeadingChipSize || unref(uiProp)?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                        inset: "",
                        standalone: ""
                      }, item.chip, {
                        "data-slot": "itemLeadingChip",
                        class: ui.value.itemLeadingChip({ class: [unref(uiProp)?.itemLeadingChip, item.ui?.itemLeadingChip] })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                    ]),
                    createVNode("span", {
                      "data-slot": "itemWrapper",
                      class: ui.value.itemWrapper({ class: [unref(uiProp)?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                    }, [
                      createVNode("span", {
                        "data-slot": "itemLabel",
                        class: ui.value.itemLabel({ class: [unref(uiProp)?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                      }, [
                        renderSlot(_ctx.$slots, "item-label", {
                          item,
                          index
                        }, () => [
                          createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                        ])
                      ], 2),
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
                      createVNode(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
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
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(ComboboxRoot_default), mergeProps({ id: unref(id) }, { ...unref(rootProps), ..._ctx.$attrs, ...unref(ariaAttrs) }, {
        "ignore-filter": "",
        "as-child": "",
        name: unref(name),
        disabled: unref(disabled),
        "onUpdate:modelValue": onUpdate,
        "onUpdate:open": onUpdateOpen
      }), {
        default: withCtx(({ modelValue, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ComboboxAnchor_default), { "as-child": "" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ComboboxTrigger_default), {
                    ref_key: "triggerRef",
                    ref: triggerRef,
                    "data-slot": "base",
                    class: ui.value.base({ class: [unref(uiProp)?.base, props.class] }),
                    tabindex: "0"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(isLeading) || !!__props.avatar || !!slots.leading) {
                          _push4(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(uiProp)?.leading }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "leading", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => {
                            if (unref(isLeading) && unref(leadingIconName)) {
                              _push4(ssrRenderComponent(_sfc_main$d, {
                                name: unref(leadingIconName),
                                "data-slot": "leadingIcon",
                                class: ui.value.leadingIcon({ class: unref(uiProp)?.leadingIcon })
                              }, null, _parent4, _scopeId3));
                            } else if (!!__props.avatar) {
                              _push4(ssrRenderComponent(_sfc_main$b, mergeProps({
                                size: unref(uiProp)?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                              }, __props.avatar, {
                                "data-slot": "itemLeadingAvatar",
                                class: ui.value.itemLeadingAvatar({ class: unref(uiProp)?.itemLeadingAvatar })
                              }), null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          }, _push4, _parent4, _scopeId3);
                          _push4(`</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "default", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => {
                          _push4(`<!--[-->`);
                          ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
                            _push4(`<!--[-->`);
                            if (displayedModelValue !== void 0 && displayedModelValue !== null) {
                              _push4(`<span data-slot="value" class="${ssrRenderClass(ui.value.value({ class: unref(uiProp)?.value }))}"${_scopeId3}>${ssrInterpolate(displayedModelValue)}</span>`);
                            } else {
                              _push4(`<span data-slot="placeholder" class="${ssrRenderClass(ui.value.placeholder({ class: unref(uiProp)?.placeholder }))}"${_scopeId3}>${ssrInterpolate(__props.placeholder ?? " ")}</span>`);
                            }
                            _push4(`<!--]-->`);
                          });
                          _push4(`<!--]-->`);
                        }, _push4, _parent4, _scopeId3);
                        if (unref(isTrailing) || !!slots.trailing || !!__props.clear) {
                          _push4(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(uiProp)?.trailing }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "trailing", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => {
                            if (!!__props.clear && !isModelValueEmpty(modelValue)) {
                              _push4(ssrRenderComponent(unref(ComboboxCancel_default), { "as-child": "" }, {
                                default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_sfc_main$8, mergeProps({
                                      as: "span",
                                      icon: __props.clearIcon || unref(appConfig).ui.icons.close,
                                      size: selectSize.value,
                                      variant: "link",
                                      color: "neutral",
                                      tabindex: "-1"
                                    }, clearProps.value, {
                                      "data-slot": "trailingClear",
                                      class: ui.value.trailingClear({ class: unref(uiProp)?.trailingClear }),
                                      onClick: onClear
                                    }), null, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_sfc_main$8, mergeProps({
                                        as: "span",
                                        icon: __props.clearIcon || unref(appConfig).ui.icons.close,
                                        size: selectSize.value,
                                        variant: "link",
                                        color: "neutral",
                                        tabindex: "-1"
                                      }, clearProps.value, {
                                        "data-slot": "trailingClear",
                                        class: ui.value.trailingClear({ class: unref(uiProp)?.trailingClear }),
                                        onClick: withModifiers(onClear, ["stop"])
                                      }), null, 16, ["icon", "size", "class"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else if (unref(trailingIconName)) {
                              _push4(ssrRenderComponent(_sfc_main$d, {
                                name: unref(trailingIconName),
                                "data-slot": "trailingIcon",
                                class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          }, _push4, _parent4, _scopeId3);
                          _push4(`</span>`);
                        } else {
                          _push4(`<!---->`);
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
                          renderSlot(_ctx.$slots, "default", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                              return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                                displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "data-slot": "value",
                                  class: ui.value.value({ class: unref(uiProp)?.value })
                                }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  "data-slot": "placeholder",
                                  class: ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                                }, toDisplayString(__props.placeholder ?? " "), 3))
                              ], 64);
                            }), 128))
                          ]),
                          unref(isTrailing) || !!slots.trailing || !!__props.clear ? (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "trailing",
                            class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                          }, [
                            renderSlot(_ctx.$slots, "trailing", {
                              modelValue,
                              open,
                              ui: ui.value
                            }, () => [
                              !!__props.clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                                key: 0,
                                "as-child": ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$8, mergeProps({
                                    as: "span",
                                    icon: __props.clearIcon || unref(appConfig).ui.icons.close,
                                    size: selectSize.value,
                                    variant: "link",
                                    color: "neutral",
                                    tabindex: "-1"
                                  }, clearProps.value, {
                                    "data-slot": "trailingClear",
                                    class: ui.value.trailingClear({ class: unref(uiProp)?.trailingClear }),
                                    onClick: withModifiers(onClear, ["stop"])
                                  }), null, 16, ["icon", "size", "class"])
                                ]),
                                _: 1
                              })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                                key: 1,
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ComboboxTrigger_default), {
                      ref_key: "triggerRef",
                      ref: triggerRef,
                      "data-slot": "base",
                      class: ui.value.base({ class: [unref(uiProp)?.base, props.class] }),
                      tabindex: "0"
                    }, {
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
                        renderSlot(_ctx.$slots, "default", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                            return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                              displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                                key: 0,
                                "data-slot": "value",
                                class: ui.value.value({ class: unref(uiProp)?.value })
                              }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                                key: 1,
                                "data-slot": "placeholder",
                                class: ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                              }, toDisplayString(__props.placeholder ?? " "), 3))
                            ], 64);
                          }), 128))
                        ]),
                        unref(isTrailing) || !!slots.trailing || !!__props.clear ? (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "trailing",
                          class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                        }, [
                          renderSlot(_ctx.$slots, "trailing", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            !!__props.clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                              key: 0,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$8, mergeProps({
                                  as: "span",
                                  icon: __props.clearIcon || unref(appConfig).ui.icons.close,
                                  size: selectSize.value,
                                  variant: "link",
                                  color: "neutral",
                                  tabindex: "-1"
                                }, clearProps.value, {
                                  "data-slot": "trailingClear",
                                  class: ui.value.trailingClear({ class: unref(uiProp)?.trailingClear }),
                                  onClick: withModifiers(onClear, ["stop"])
                                }), null, 16, ["icon", "size", "class"])
                              ]),
                              _: 1
                            })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                              key: 1,
                              name: unref(trailingIconName),
                              "data-slot": "trailingIcon",
                              class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                          ])
                        ], 2)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ComboboxPortal_default), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(ComboboxContent_default), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: unref(uiProp)?.content })
                        }, contentProps.value), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(FocusScope_default), {
                                trapped: "",
                                "data-slot": "focusScope",
                                class: ui.value.focusScope({ class: unref(uiProp)?.focusScope })
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push6, _parent6, _scopeId5);
                                    if (!!__props.searchInput) {
                                      _push6(ssrRenderComponent(unref(ComboboxInput_default), {
                                        modelValue: searchTerm.value,
                                        "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                        "display-value": () => searchTerm.value,
                                        "as-child": ""
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_sfc_main$1, mergeProps({
                                              autofocus: "",
                                              autocomplete: "off",
                                              size: selectSize.value
                                            }, searchInputProps.value, {
                                              "model-modifiers": {
                                                trim: __props.modelModifiers?.trim
                                              },
                                              "data-slot": "input",
                                              class: ui.value.input({ class: unref(uiProp)?.input }),
                                              onChange: () => {
                                              }
                                            }), null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_sfc_main$1, mergeProps({
                                                autofocus: "",
                                                autocomplete: "off",
                                                size: selectSize.value
                                              }, searchInputProps.value, {
                                                "model-modifiers": {
                                                  trim: __props.modelModifiers?.trim
                                                },
                                                "data-slot": "input",
                                                class: ui.value.input({ class: unref(uiProp)?.input }),
                                                onChange: withModifiers(() => {
                                                }, ["stop"])
                                              }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    _push6(ssrRenderComponent(unref(ComboboxEmpty_default), {
                                      "data-slot": "empty",
                                      class: ui.value.empty({ class: unref(uiProp)?.empty })
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          ssrRenderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
                                            _push7(`${ssrInterpolate(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData"))}`);
                                          }, _push7, _parent7, _scopeId6);
                                        } else {
                                          return [
                                            renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                              createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                    _push6(`<div role="presentation" data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: unref(uiProp)?.viewport }))}"${_scopeId5}>`);
                                    if (!!__props.virtualize) {
                                      _push6(`<!--[-->`);
                                      if (createItem.value && createItemPosition.value === "top") {
                                        _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(ssrRenderComponent(unref(ComboboxVirtualizer_default), mergeProps({
                                        options: filteredItems.value,
                                        "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                      }, virtualizerProps.value), {
                                        default: withCtx(({ option: item, virtualItem }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(ReuseItemTemplate), {
                                              item,
                                              index: virtualItem.index
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(ReuseItemTemplate), {
                                                item,
                                                index: virtualItem.index
                                              }, null, 8, ["item", "index"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      if (createItem.value && createItemPosition.value === "bottom") {
                                        _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`<!--]-->`);
                                    } else {
                                      _push6(`<!--[-->`);
                                      if (createItem.value && createItemPosition.value === "top") {
                                        _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(ReuseCreateItemTemplate))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`<!--[-->`);
                                      ssrRenderList(filteredGroups.value, (group, groupIndex) => {
                                        _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                          key: `group-${groupIndex}`,
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<!--[-->`);
                                              ssrRenderList(group, (item, index) => {
                                                _push7(ssrRenderComponent(unref(ReuseItemTemplate), {
                                                  key: `group-${groupIndex}-${index}`,
                                                  item,
                                                  index
                                                }, null, _parent7, _scopeId6));
                                              });
                                              _push7(`<!--]-->`);
                                            } else {
                                              return [
                                                (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                                  return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                                    key: `group-${groupIndex}-${index}`,
                                                    item,
                                                    index
                                                  }, null, 8, ["item", "index"]);
                                                }), 128))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                      if (createItem.value && createItemPosition.value === "bottom") {
                                        _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(ReuseCreateItemTemplate))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`<!--]-->`);
                                    }
                                    _push6(`</div>`);
                                    ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push6, _parent6, _scopeId5);
                                  } else {
                                    return [
                                      renderSlot(_ctx.$slots, "content-top"),
                                      !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                        key: 0,
                                        modelValue: searchTerm.value,
                                        "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                        "display-value": () => searchTerm.value,
                                        "as-child": ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$1, mergeProps({
                                            autofocus: "",
                                            autocomplete: "off",
                                            size: selectSize.value
                                          }, searchInputProps.value, {
                                            "model-modifiers": {
                                              trim: __props.modelModifiers?.trim
                                            },
                                            "data-slot": "input",
                                            class: ui.value.input({ class: unref(uiProp)?.input }),
                                            onChange: withModifiers(() => {
                                            }, ["stop"])
                                          }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                                      createVNode(unref(ComboboxEmpty_default), {
                                        "data-slot": "empty",
                                        class: ui.value.empty({ class: unref(uiProp)?.empty })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                            createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"]),
                                      createVNode("div", {
                                        ref_key: "viewportRef",
                                        ref: viewportRef,
                                        role: "presentation",
                                        "data-slot": "viewport",
                                        class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                                      }, [
                                        !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                          createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                            options: filteredItems.value,
                                            "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                          }, virtualizerProps.value), {
                                            default: withCtx(({ option: item, virtualItem }) => [
                                              createVNode(unref(ReuseItemTemplate), {
                                                item,
                                                index: virtualItem.index
                                              }, null, 8, ["item", "index"])
                                            ]),
                                            _: 1
                                          }, 16, ["options", "text-content"]),
                                          createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                            key: 0,
                                            "data-slot": "group",
                                            class: ui.value.group({ class: unref(uiProp)?.group })
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(ReuseCreateItemTemplate))
                                            ]),
                                            _: 1
                                          }, 8, ["class"])) : createCommentVNode("", true),
                                          (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                            return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                              key: `group-${groupIndex}`,
                                              "data-slot": "group",
                                              class: ui.value.group({ class: unref(uiProp)?.group })
                                            }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                                  return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                                    key: `group-${groupIndex}-${index}`,
                                                    item,
                                                    index
                                                  }, null, 8, ["item", "index"]);
                                                }), 128))
                                              ]),
                                              _: 2
                                            }, 1032, ["class"]);
                                          }), 128)),
                                          createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                            key: 1,
                                            "data-slot": "group",
                                            class: ui.value.group({ class: unref(uiProp)?.group })
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(ReuseCreateItemTemplate))
                                            ]),
                                            _: 1
                                          }, 8, ["class"])) : createCommentVNode("", true)
                                        ], 64))
                                      ], 2),
                                      renderSlot(_ctx.$slots, "content-bottom")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                              if (!!__props.arrow) {
                                _push5(ssrRenderComponent(unref(ComboboxArrow_default), mergeProps(arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(uiProp)?.arrow })
                                }), null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(unref(FocusScope_default), {
                                  trapped: "",
                                  "data-slot": "focusScope",
                                  class: ui.value.focusScope({ class: unref(uiProp)?.focusScope })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "content-top"),
                                    !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                      key: 0,
                                      modelValue: searchTerm.value,
                                      "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                      "display-value": () => searchTerm.value,
                                      "as-child": ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, mergeProps({
                                          autofocus: "",
                                          autocomplete: "off",
                                          size: selectSize.value
                                        }, searchInputProps.value, {
                                          "model-modifiers": {
                                            trim: __props.modelModifiers?.trim
                                          },
                                          "data-slot": "input",
                                          class: ui.value.input({ class: unref(uiProp)?.input }),
                                          onChange: withModifiers(() => {
                                          }, ["stop"])
                                        }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                                    createVNode(unref(ComboboxEmpty_default), {
                                      "data-slot": "empty",
                                      class: ui.value.empty({ class: unref(uiProp)?.empty })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                          createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"]),
                                    createVNode("div", {
                                      ref_key: "viewportRef",
                                      ref: viewportRef,
                                      role: "presentation",
                                      "data-slot": "viewport",
                                      class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                                    }, [
                                      !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                        createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                          options: filteredItems.value,
                                          "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                        }, virtualizerProps.value), {
                                          default: withCtx(({ option: item, virtualItem }) => [
                                            createVNode(unref(ReuseItemTemplate), {
                                              item,
                                              index: virtualItem.index
                                            }, null, 8, ["item", "index"])
                                          ]),
                                          _: 1
                                        }, 16, ["options", "text-content"]),
                                        createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                          key: 0,
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(ReuseCreateItemTemplate))
                                          ]),
                                          _: 1
                                        }, 8, ["class"])) : createCommentVNode("", true),
                                        (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                          return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                            key: `group-${groupIndex}`,
                                            "data-slot": "group",
                                            class: ui.value.group({ class: unref(uiProp)?.group })
                                          }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                                return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                                  key: `group-${groupIndex}-${index}`,
                                                  item,
                                                  index
                                                }, null, 8, ["item", "index"]);
                                              }), 128))
                                            ]),
                                            _: 2
                                          }, 1032, ["class"]);
                                        }), 128)),
                                        createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                          key: 1,
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(ReuseCreateItemTemplate))
                                          ]),
                                          _: 1
                                        }, 8, ["class"])) : createCommentVNode("", true)
                                      ], 64))
                                    ], 2),
                                    renderSlot(_ctx.$slots, "content-bottom")
                                  ]),
                                  _: 3
                                }, 8, ["class"]),
                                !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
                          createVNode(unref(ComboboxContent_default), mergeProps({
                            "data-slot": "content",
                            class: ui.value.content({ class: unref(uiProp)?.content })
                          }, contentProps.value), {
                            default: withCtx(() => [
                              createVNode(unref(FocusScope_default), {
                                trapped: "",
                                "data-slot": "focusScope",
                                class: ui.value.focusScope({ class: unref(uiProp)?.focusScope })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "content-top"),
                                  !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                    key: 0,
                                    modelValue: searchTerm.value,
                                    "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                    "display-value": () => searchTerm.value,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$1, mergeProps({
                                        autofocus: "",
                                        autocomplete: "off",
                                        size: selectSize.value
                                      }, searchInputProps.value, {
                                        "model-modifiers": {
                                          trim: __props.modelModifiers?.trim
                                        },
                                        "data-slot": "input",
                                        class: ui.value.input({ class: unref(uiProp)?.input }),
                                        onChange: withModifiers(() => {
                                        }, ["stop"])
                                      }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                                  createVNode(unref(ComboboxEmpty_default), {
                                    "data-slot": "empty",
                                    class: ui.value.empty({ class: unref(uiProp)?.empty })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                        createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"]),
                                  createVNode("div", {
                                    ref_key: "viewportRef",
                                    ref: viewportRef,
                                    role: "presentation",
                                    "data-slot": "viewport",
                                    class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                                  }, [
                                    !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                      createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                        options: filteredItems.value,
                                        "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                      }, virtualizerProps.value), {
                                        default: withCtx(({ option: item, virtualItem }) => [
                                          createVNode(unref(ReuseItemTemplate), {
                                            item,
                                            index: virtualItem.index
                                          }, null, 8, ["item", "index"])
                                        ]),
                                        _: 1
                                      }, 16, ["options", "text-content"]),
                                      createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                        key: 0,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: unref(uiProp)?.group })
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ReuseCreateItemTemplate))
                                        ]),
                                        _: 1
                                      }, 8, ["class"])) : createCommentVNode("", true),
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                        return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                          key: `group-${groupIndex}`,
                                          "data-slot": "group",
                                          class: ui.value.group({ class: unref(uiProp)?.group })
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                              return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                                key: `group-${groupIndex}-${index}`,
                                                item,
                                                index
                                              }, null, 8, ["item", "index"]);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1032, ["class"]);
                                      }), 128)),
                                      createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                        key: 1,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: unref(uiProp)?.group })
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ReuseCreateItemTemplate))
                                        ]),
                                        _: 1
                                      }, 8, ["class"])) : createCommentVNode("", true)
                                    ], 64))
                                  ], 2),
                                  renderSlot(_ctx.$slots, "content-bottom")
                                ]),
                                _: 3
                              }, 8, ["class"]),
                              !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
                        createVNode(unref(ComboboxContent_default), mergeProps({
                          "data-slot": "content",
                          class: ui.value.content({ class: unref(uiProp)?.content })
                        }, contentProps.value), {
                          default: withCtx(() => [
                            createVNode(unref(FocusScope_default), {
                              trapped: "",
                              "data-slot": "focusScope",
                              class: ui.value.focusScope({ class: unref(uiProp)?.focusScope })
                            }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "content-top"),
                                !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                  key: 0,
                                  modelValue: searchTerm.value,
                                  "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                  "display-value": () => searchTerm.value,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$1, mergeProps({
                                      autofocus: "",
                                      autocomplete: "off",
                                      size: selectSize.value
                                    }, searchInputProps.value, {
                                      "model-modifiers": {
                                        trim: __props.modelModifiers?.trim
                                      },
                                      "data-slot": "input",
                                      class: ui.value.input({ class: unref(uiProp)?.input }),
                                      onChange: withModifiers(() => {
                                      }, ["stop"])
                                    }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                                createVNode(unref(ComboboxEmpty_default), {
                                  "data-slot": "empty",
                                  class: ui.value.empty({ class: unref(uiProp)?.empty })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                      createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"]),
                                createVNode("div", {
                                  ref_key: "viewportRef",
                                  ref: viewportRef,
                                  role: "presentation",
                                  "data-slot": "viewport",
                                  class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                                }, [
                                  !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                    createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                      options: filteredItems.value,
                                      "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                    }, virtualizerProps.value), {
                                      default: withCtx(({ option: item, virtualItem }) => [
                                        createVNode(unref(ReuseItemTemplate), {
                                          item,
                                          index: virtualItem.index
                                        }, null, 8, ["item", "index"])
                                      ]),
                                      _: 1
                                    }, 16, ["options", "text-content"]),
                                    createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                      key: 0,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: unref(uiProp)?.group })
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseCreateItemTemplate))
                                      ]),
                                      _: 1
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                      return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                        key: `group-${groupIndex}`,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: unref(uiProp)?.group })
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                            return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                              key: `group-${groupIndex}-${index}`,
                                              item,
                                              index
                                            }, null, 8, ["item", "index"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1032, ["class"]);
                                    }), 128)),
                                    createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                      key: 1,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: unref(uiProp)?.group })
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseCreateItemTemplate))
                                      ]),
                                      _: 1
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ], 64))
                                ], 2),
                                renderSlot(_ctx.$slots, "content-bottom")
                              ]),
                              _: 3
                            }, 8, ["class"]),
                            !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
              createVNode(unref(ComboboxAnchor_default), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(ComboboxTrigger_default), {
                    ref_key: "triggerRef",
                    ref: triggerRef,
                    "data-slot": "base",
                    class: ui.value.base({ class: [unref(uiProp)?.base, props.class] }),
                    tabindex: "0"
                  }, {
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
                      renderSlot(_ctx.$slots, "default", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [
                        (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                          return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                            displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                              key: 0,
                              "data-slot": "value",
                              class: ui.value.value({ class: unref(uiProp)?.value })
                            }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                              key: 1,
                              "data-slot": "placeholder",
                              class: ui.value.placeholder({ class: unref(uiProp)?.placeholder })
                            }, toDisplayString(__props.placeholder ?? " "), 3))
                          ], 64);
                        }), 128))
                      ]),
                      unref(isTrailing) || !!slots.trailing || !!__props.clear ? (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "trailing",
                        class: ui.value.trailing({ class: unref(uiProp)?.trailing })
                      }, [
                        renderSlot(_ctx.$slots, "trailing", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          !!__props.clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                            key: 0,
                            "as-child": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$8, mergeProps({
                                as: "span",
                                icon: __props.clearIcon || unref(appConfig).ui.icons.close,
                                size: selectSize.value,
                                variant: "link",
                                color: "neutral",
                                tabindex: "-1"
                              }, clearProps.value, {
                                "data-slot": "trailingClear",
                                class: ui.value.trailingClear({ class: unref(uiProp)?.trailingClear }),
                                onClick: withModifiers(onClear, ["stop"])
                              }), null, 16, ["icon", "size", "class"])
                            ]),
                            _: 1
                          })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 1,
                            name: unref(trailingIconName),
                            "data-slot": "trailingIcon",
                            class: ui.value.trailingIcon({ class: unref(uiProp)?.trailingIcon })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ])
                      ], 2)) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["class"])
                ]),
                _: 2
              }, 1024),
              createVNode(unref(ComboboxPortal_default), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      createVNode(unref(ComboboxContent_default), mergeProps({
                        "data-slot": "content",
                        class: ui.value.content({ class: unref(uiProp)?.content })
                      }, contentProps.value), {
                        default: withCtx(() => [
                          createVNode(unref(FocusScope_default), {
                            trapped: "",
                            "data-slot": "focusScope",
                            class: ui.value.focusScope({ class: unref(uiProp)?.focusScope })
                          }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content-top"),
                              !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                key: 0,
                                modelValue: searchTerm.value,
                                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                "display-value": () => searchTerm.value,
                                "as-child": ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$1, mergeProps({
                                    autofocus: "",
                                    autocomplete: "off",
                                    size: selectSize.value
                                  }, searchInputProps.value, {
                                    "model-modifiers": {
                                      trim: __props.modelModifiers?.trim
                                    },
                                    "data-slot": "input",
                                    class: ui.value.input({ class: unref(uiProp)?.input }),
                                    onChange: withModifiers(() => {
                                    }, ["stop"])
                                  }), null, 16, ["size", "model-modifiers", "class", "onChange"])
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                              createVNode(unref(ComboboxEmpty_default), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: unref(uiProp)?.empty })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                    createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"]),
                              createVNode("div", {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: unref(uiProp)?.viewport })
                              }, [
                                !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                  createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                    options: filteredItems.value,
                                    "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                  }, virtualizerProps.value), {
                                    default: withCtx(({ option: item, virtualItem }) => [
                                      createVNode(unref(ReuseItemTemplate), {
                                        item,
                                        index: virtualItem.index
                                      }, null, 8, ["item", "index"])
                                    ]),
                                    _: 1
                                  }, 16, ["options", "text-content"]),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: 0,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: unref(uiProp)?.group })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ReuseCreateItemTemplate))
                                    ]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                    return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                      key: `group-${groupIndex}`,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: unref(uiProp)?.group })
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                          return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                            key: `group-${groupIndex}-${index}`,
                                            item,
                                            index
                                          }, null, 8, ["item", "index"]);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1032, ["class"]);
                                  }), 128)),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: 1,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: unref(uiProp)?.group })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ReuseCreateItemTemplate))
                                    ]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ], 64))
                              ], 2),
                              renderSlot(_ctx.$slots, "content-bottom")
                            ]),
                            _: 3
                          }, 8, ["class"]),
                          !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
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
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SelectMenu-BhfO7re0.mjs.map
