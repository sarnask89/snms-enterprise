import { A as useCollection, q as useForwardExpose, P as Primitive, E as usePrimitiveElement, R as getActiveElement, K as get, r as createContext } from './server.mjs';
import { defineComponent, computed, openBlock, createBlock, unref, withCtx, withMemo, createVNode, mergeProps, withKeys, withModifiers, renderSlot, createCommentVNode, toRefs, ref, watch, nextTick, watchSyncEffect, useSlots, Fragment, cloneVNode, createElementBlock, normalizeStyle, renderList, resolveDynamicComponent } from 'vue';
import { refAutoReset } from '@vueuse/shared';
import { useVModel, createEventHook, useParentElement } from '@vueuse/core';
import { u as useId, h as handleAndDispatchCustomEvent } from './FocusScope-afTtc11Z.mjs';
import { f as useTypeahead, a as useDirection, u as useFormControl, h as getNextMatch } from './PopperArrow-CiJ5PBIc.mjs';
import { M as MAP_KEY_TO_FOCUS_INTENT, g as getFocusIntent } from './utils-Bd-v-gOF.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-vMStSdMN.mjs';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { w as isEqual } from '../_/nitro.mjs';

function findValuesBetween(array, start, end) {
  const startIndex = array.findIndex((i) => isEqual(i, start));
  const endIndex = array.findIndex((i) => isEqual(i, end));
  if (startIndex === -1 || endIndex === -1) return [];
  const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
  return array.slice(minIndex, maxIndex + 1);
}
function useKbd() {
  return {
    ALT: "Alt",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    BACKSPACE: "Backspace",
    CAPS_LOCK: "CapsLock",
    CONTROL: "Control",
    DELETE: "Delete",
    END: "End",
    ENTER: "Enter",
    ESCAPE: "Escape",
    F1: "F1",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    HOME: "Home",
    META: "Meta",
    PAGE_DOWN: "PageDown",
    PAGE_UP: "PageUp",
    SHIFT: "Shift",
    SPACE: " ",
    TAB: "Tab",
    CTRL: "Control",
    ASTERISK: "*",
    SPACE_CODE: "Space"
  };
}
function queryCheckedElement(parentEl) {
  return parentEl?.querySelector("[data-state=checked]");
}
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
const [injectListboxRootContext, provideListboxRootContext] = /* @__PURE__ */ createContext("ListboxRoot");
var ListboxRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxRoot",
  props: {
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
    orientation: {
      type: String,
      required: false,
      default: "vertical"
    },
    dir: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    selectionBehavior: {
      type: String,
      required: false,
      default: "toggle"
    },
    highlightOnHover: {
      type: Boolean,
      required: false
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
    "entryFocus",
    "leave"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { multiple, highlightOnHover, orientation, disabled, selectionBehavior, dir: propDir } = toRefs(props);
    const { getItems } = useCollection({ isProvider: true });
    const { handleTypeaheadSearch } = useTypeahead();
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const kbd = useKbd();
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(currentElement);
    const firstValue = ref();
    const isUserAction = ref(false);
    const focusable = ref(true);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
      passive: props.modelValue === void 0,
      deep: true
    });
    function onValueChange(val) {
      isUserAction.value = true;
      if (props.multiple) {
        const modelArray = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
        const index = modelArray.findIndex((i) => compare(i, val, props.by));
        if (props.selectionBehavior === "toggle") {
          index === -1 ? modelArray.push(val) : modelArray.splice(index, 1);
          modelValue.value = modelArray;
        } else {
          modelValue.value = [val];
          firstValue.value = val;
        }
      } else if (props.selectionBehavior === "toggle") if (compare(modelValue.value, val, props.by)) modelValue.value = void 0;
      else modelValue.value = val;
      else modelValue.value = val;
      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    }
    const highlightedElement = ref(null);
    const previousElement = ref(null);
    const isVirtual = ref(false);
    const isComposing = ref(false);
    const virtualFocusHook = createEventHook();
    const virtualKeydownHook = createEventHook();
    const virtualHighlightHook = createEventHook();
    function getCollectionItem() {
      return getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
    }
    function changeHighlight(el, scrollIntoView = true, focus) {
      if (!el) return;
      highlightedElement.value = el;
      if (focus ?? focusable.value) highlightedElement.value.focus();
      if (scrollIntoView) highlightedElement.value.scrollIntoView({ block: "nearest" });
      const highlightedItem = getItems().find((i) => i.ref === el);
      emits("highlight", highlightedItem);
    }
    function highlightItem(value) {
      if (isVirtual.value) virtualHighlightHook.trigger(value);
      else {
        const item = getItems().find((i) => compare(i.value, value, props.by));
        if (item) {
          highlightedElement.value = item.ref;
          changeHighlight(item.ref);
        }
      }
    }
    function onKeydownEnter(event) {
      if (highlightedElement.value && highlightedElement.value.isConnected) {
        event.preventDefault();
        event.stopPropagation();
        if (!isComposing.value) highlightedElement.value.click();
      }
    }
    function onKeydownTypeAhead(event) {
      if (!focusable.value) return;
      isUserAction.value = true;
      if (isVirtual.value) virtualKeydownHook.trigger(event);
      else {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
        if (isMetaKey && event.key === "a" && multiple.value) {
          const collection = getItems();
          const values = collection.map((i) => i.value);
          modelValue.value = [...values];
          event.preventDefault();
          const lastItem = collection.at(-1);
          if (lastItem) changeHighlight(lastItem.ref);
        } else if (!isMetaKey) {
          const el = handleTypeaheadSearch(event.key, getItems());
          if (el) changeHighlight(el);
        }
      }
      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    }
    function onCompositionStart() {
      isComposing.value = true;
    }
    function onCompositionEnd() {
      nextTick(() => {
        isComposing.value = false;
      });
    }
    function highlightFirstItem() {
      nextTick(() => {
        const event = new KeyboardEvent("keydown", { key: "PageUp" });
        onKeydownNavigation(event);
      });
    }
    function onLeave(event) {
      const el = highlightedElement.value;
      if (el?.isConnected) previousElement.value = el;
      highlightedElement.value = null;
      emits("leave", event);
    }
    function onEnter(event) {
      const entryFocusEvent = new CustomEvent("listbox.entryFocus", {
        bubbles: false,
        cancelable: true
      });
      event.currentTarget?.dispatchEvent(entryFocusEvent);
      emits("entryFocus", entryFocusEvent);
      if (entryFocusEvent.defaultPrevented) return;
      if (previousElement.value) changeHighlight(previousElement.value);
      else {
        const el = getCollectionItem()?.[0];
        changeHighlight(el);
      }
    }
    function onKeydownNavigation(event) {
      const intent = getFocusIntent(event, orientation.value, dir.value);
      if (!intent) return;
      let collection = getCollectionItem();
      if (highlightedElement.value) {
        if (intent === "last") collection.reverse();
        else if (intent === "prev" || intent === "next") {
          if (intent === "prev") collection.reverse();
          const currentIndex = collection.indexOf(highlightedElement.value);
          collection = collection.slice(currentIndex + 1);
        }
        handleMultipleReplace(event, collection[0]);
      }
      if (collection.length) {
        const index = !highlightedElement.value && intent === "prev" ? collection.length - 1 : 0;
        changeHighlight(collection[index]);
      }
      if (isVirtual.value) return virtualKeydownHook.trigger(event);
    }
    function handleMultipleReplace(event, targetEl) {
      if (isVirtual.value || props.selectionBehavior !== "replace" || !multiple.value || !Array.isArray(modelValue.value)) return;
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
      if (isMetaKey && !event.shiftKey) return;
      if (event.shiftKey) {
        const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
        let lastValue = collection.find((i) => i.ref === targetEl)?.value;
        if (event.key === kbd.END) lastValue = collection.at(-1)?.value;
        else if (event.key === kbd.HOME) lastValue = collection[0]?.value;
        if (!lastValue || !firstValue.value) return;
        const values = findValuesBetween(collection.map((i) => i.value), firstValue.value, lastValue);
        modelValue.value = values;
      }
    }
    async function highlightSelected(event) {
      await nextTick();
      if (isVirtual.value) virtualFocusHook.trigger(event);
      else {
        const collection = getCollectionItem();
        const item = collection.find((i) => i.dataset.state === "checked");
        if (item) changeHighlight(item);
        else if (collection.length) changeHighlight(collection[0]);
      }
    }
    watch(modelValue, () => {
      if (!isUserAction.value) nextTick(() => {
        highlightSelected();
      });
    }, {
      immediate: true,
      deep: true
    });
    __expose({
      highlightedElement,
      highlightItem,
      highlightFirstItem,
      highlightSelected,
      getItems
    });
    provideListboxRootContext({
      modelValue,
      onValueChange,
      multiple,
      orientation,
      dir,
      disabled,
      highlightOnHover,
      highlightedElement,
      isVirtual,
      virtualFocusHook,
      virtualKeydownHook,
      virtualHighlightHook,
      by: props.by,
      firstValue,
      selectionBehavior,
      focusable,
      onLeave,
      onEnter,
      changeHighlight,
      onKeydownEnter,
      onKeydownNavigation,
      onKeydownTypeAhead,
      onCompositionStart,
      onCompositionEnd,
      highlightFirstItem
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        dir: unref(dir),
        "data-disabled": unref(disabled) ? "" : void 0,
        onPointerleave: onLeave,
        onFocusout: _cache[0] || (_cache[0] = async (event) => {
          const target = event.relatedTarget || event.target;
          await nextTick();
          if (highlightedElement.value && unref(currentElement) && !unref(currentElement).contains(target)) onLeave(event);
        })
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) }), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
          key: 0,
          name: _ctx.name,
          value: unref(modelValue),
          disabled: unref(disabled),
          required: _ctx.required
        }, null, 8, [
          "name",
          "value",
          "disabled",
          "required"
        ])) : createCommentVNode("v-if", true)]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "dir",
        "data-disabled"
      ]);
    };
  }
});
var ListboxRoot_default = ListboxRoot_vue_vue_type_script_setup_true_lang_default;
var ListboxContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxContent",
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
    const { CollectionSlot } = useCollection();
    const rootContext = injectListboxRootContext();
    const isClickFocus = refAutoReset(false, 10);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          role: "listbox",
          as: _ctx.as,
          "as-child": _ctx.asChild,
          tabindex: unref(rootContext).focusable.value ? unref(rootContext).highlightedElement.value ? "-1" : "0" : "-1",
          "aria-orientation": unref(rootContext).orientation.value,
          "aria-multiselectable": !!unref(rootContext).multiple.value,
          "data-orientation": unref(rootContext).orientation.value,
          onMousedown: _cache[0] || (_cache[0] = withModifiers(($event) => isClickFocus.value = true, ["left"])),
          onFocus: _cache[1] || (_cache[1] = (ev) => {
            if (unref(isClickFocus)) return;
            unref(rootContext).onEnter(ev);
          }),
          onKeydown: [
            _cache[2] || (_cache[2] = withKeys((event) => {
              if (unref(rootContext).orientation.value === "vertical" && (event.key === "ArrowLeft" || event.key === "ArrowRight") || unref(rootContext).orientation.value === "horizontal" && (event.key === "ArrowUp" || event.key === "ArrowDown")) return;
              event.preventDefault();
              unref(rootContext).focusable.value && unref(rootContext).onKeydownNavigation(event);
            }, [
              "down",
              "up",
              "left",
              "right",
              "home",
              "end"
            ])),
            withKeys(unref(rootContext).onKeydownEnter, ["enter"]),
            unref(rootContext).onKeydownTypeAhead
          ]
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "tabindex",
          "aria-orientation",
          "aria-multiselectable",
          "data-orientation",
          "onKeydown"
        ])]),
        _: 3
      });
    };
  }
});
var ListboxContent_default = ListboxContent_vue_vue_type_script_setup_true_lang_default;
var ListboxFilter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxFilter",
  props: {
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
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: "",
      passive: props.modelValue === void 0
    });
    const rootContext = injectListboxRootContext();
    const { primitiveElement } = usePrimitiveElement();
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false);
    const activedescendant = ref();
    watchSyncEffect(() => activedescendant.value = rootContext.highlightedElement.value?.id);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        value: unref(modelValue),
        disabled: disabled.value ? "" : void 0,
        "data-disabled": disabled.value ? "" : void 0,
        "aria-disabled": disabled.value ?? void 0,
        "aria-activedescendant": activedescendant.value,
        type: "text",
        onKeydown: [withKeys(withModifiers(unref(rootContext).onKeydownNavigation, ["prevent"]), [
          "down",
          "up",
          "home",
          "end"
        ]), withKeys(unref(rootContext).onKeydownEnter, ["enter"])],
        onInput: _cache[0] || (_cache[0] = (event) => {
          modelValue.value = event.target.value;
          unref(rootContext).highlightFirstItem();
        }),
        onCompositionstart: unref(rootContext).onCompositionStart,
        onCompositionend: unref(rootContext).onCompositionEnd
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "value",
        "disabled",
        "data-disabled",
        "aria-disabled",
        "aria-activedescendant",
        "onKeydown",
        "onCompositionstart",
        "onCompositionend"
      ]);
    };
  }
});
var ListboxFilter_default = ListboxFilter_vue_vue_type_script_setup_true_lang_default;
const [injectListboxGroupContext, provideListboxGroupContext] = /* @__PURE__ */ createContext("ListboxGroup");
var ListboxGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxGroup",
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
    const id = useId(void 0, "reka-listbox-group");
    provideListboxGroupContext({ id });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["aria-labelledby"]);
    };
  }
});
var ListboxGroup_default = ListboxGroup_vue_vue_type_script_setup_true_lang_default;
const LISTBOX_SELECT = "listbox.select";
const [injectListboxItemContext, provideListboxItemContext] = /* @__PURE__ */ createContext("ListboxItem");
var ListboxItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxItem",
  props: {
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
      required: false,
      default: "div"
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const id = useId(void 0, "reka-listbox-item");
    const { CollectionItem } = useCollection();
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectListboxRootContext();
    const isHighlighted = computed(() => currentElement.value === rootContext.highlightedElement.value);
    const isSelected = computed(() => valueComparator(rootContext.modelValue.value, props.value, rootContext.by));
    const disabled = computed(() => rootContext.disabled.value || props.disabled);
    async function handleSelect(ev) {
      emits("select", ev);
      if (ev?.defaultPrevented) return;
      if (!disabled.value && ev) {
        rootContext.onValueChange(props.value);
        rootContext.changeHighlight(currentElement.value);
      }
    }
    function handleSelectCustomEvent(ev) {
      const eventDetail = {
        originalEvent: ev,
        value: props.value
      };
      handleAndDispatchCustomEvent(LISTBOX_SELECT, handleSelect, eventDetail);
    }
    provideListboxItemContext({ isSelected });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), { value: _ctx.value }, {
        default: withCtx(() => [withMemo([isHighlighted.value, isSelected.value], () => createVNode(unref(Primitive), mergeProps({ id: unref(id) }, _ctx.$attrs, {
          ref: unref(forwardRef),
          role: "option",
          tabindex: unref(rootContext).focusable.value ? isHighlighted.value ? "0" : "-1" : -1,
          "aria-selected": isSelected.value,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          disabled: disabled.value ? "" : void 0,
          "data-disabled": disabled.value ? "" : void 0,
          "data-highlighted": isHighlighted.value ? "" : void 0,
          "data-state": isSelected.value ? "checked" : "unchecked",
          onClick: handleSelectCustomEvent,
          onKeydown: withKeys(withModifiers(handleSelectCustomEvent, ["prevent"]), ["space"]),
          onPointermove: _cache[0] || (_cache[0] = () => {
            if (unref(rootContext).highlightedElement.value === unref(currentElement)) return;
            if (unref(rootContext).highlightOnHover.value) unref(rootContext).changeHighlight(unref(currentElement), false, false);
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "tabindex",
          "aria-selected",
          "as",
          "as-child",
          "disabled",
          "data-disabled",
          "data-highlighted",
          "data-state",
          "onKeydown"
        ]), _cache, 1)]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var ListboxItem_default = ListboxItem_vue_vue_type_script_setup_true_lang_default;
var ListboxItemIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxItemIndicator",
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
    useForwardExpose();
    const itemContext = injectListboxItemContext();
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
var ListboxItemIndicator_default = ListboxItemIndicator_vue_vue_type_script_setup_true_lang_default;
var ListboxVirtualizer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxVirtualizer",
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
    const slots = useSlots();
    const rootContext = injectListboxRootContext();
    const parentEl = useParentElement();
    const { getItems } = useCollection();
    rootContext.isVirtual.value = true;
    const padding = computed(() => {
      const el = parentEl.value;
      if (!el) return {
        start: 0,
        end: 0
      };
      else {
        const styles = (void 0).getComputedStyle(el);
        return {
          start: Number.parseFloat(styles.paddingBlockStart || styles.paddingTop),
          end: Number.parseFloat(styles.paddingBlockEnd || styles.paddingBottom)
        };
      }
    });
    const virtualizer = useVirtualizer({
      get scrollPaddingStart() {
        return padding.value.start;
      },
      get scrollPaddingEnd() {
        return padding.value.end;
      },
      get count() {
        return props.options.length;
      },
      get horizontal() {
        return rootContext.orientation.value === "horizontal";
      },
      estimateSize(index) {
        if (typeof props.estimateSize === "function") return props.estimateSize(index);
        return props.estimateSize ?? 28;
      },
      getScrollElement() {
        return parentEl.value;
      },
      overscan: props.overscan ?? 12
    });
    const virtualizedItems = computed(() => virtualizer.value.getVirtualItems().map((item) => {
      const defaultNode = slots.default({
        option: props.options[item.index],
        virtualizer: virtualizer.value,
        virtualItem: item
      })[0];
      const targetNode = defaultNode.type === Fragment && Array.isArray(defaultNode.children) ? defaultNode.children.find((child) => typeof child.type !== "symbol") : defaultNode;
      return {
        item,
        is: cloneVNode(targetNode, {
          "key": `${item.key}`,
          "data-index": item.index,
          "aria-setsize": props.options.length,
          "aria-posinset": item.index + 1,
          "style": {
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(${item.start}px)`,
            overflowAnchor: "none"
          }
        })
      };
    }));
    rootContext.virtualFocusHook.on((event) => {
      const index = props.options.findIndex((option) => {
        if (Array.isArray(rootContext.modelValue.value)) return compare(option, rootContext.modelValue.value[0], rootContext.by);
        else return compare(option, rootContext.modelValue.value, rootContext.by);
      });
      if (index !== -1) {
        event?.preventDefault();
        virtualizer.value.scrollToIndex(index, { align: "start" });
        requestAnimationFrame(() => {
          const item = queryCheckedElement(parentEl.value);
          if (item) {
            rootContext.changeHighlight(item);
            if (event) item?.focus();
          }
        });
      } else rootContext.highlightFirstItem();
    });
    rootContext.virtualHighlightHook.on((value) => {
      const index = props.options.findIndex((option) => {
        return compare(option, value, rootContext.by);
      });
      virtualizer.value.scrollToIndex(index, { align: "start" });
      requestAnimationFrame(() => {
        const item = queryCheckedElement(parentEl.value);
        if (item) rootContext.changeHighlight(item);
      });
    });
    const search = refAutoReset("", 1e3);
    const optionsWithMetadata = computed(() => {
      const parseTextContent = (option) => {
        if (props.textContent) return props.textContent(option);
        else return option?.toString().toLowerCase();
      };
      return props.options.map((option, index) => ({
        index,
        textContent: parseTextContent(option)
      }));
    });
    function handleMultipleReplace(event, intent) {
      if (!rootContext.firstValue?.value || !rootContext.multiple.value || !Array.isArray(rootContext.modelValue.value)) return;
      const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
      const lastValue = collection.find((i) => i.ref === rootContext.highlightedElement.value)?.value;
      if (!lastValue) return;
      let value = null;
      switch (intent) {
        case "prev":
        case "next": {
          value = findValuesBetween(props.options, rootContext.firstValue.value, lastValue);
          break;
        }
        case "first": {
          value = findValuesBetween(props.options, rootContext.firstValue.value, props.options?.[0]);
          break;
        }
        case "last": {
          value = findValuesBetween(props.options, rootContext.firstValue.value, props.options.at(-1));
          break;
        }
      }
      rootContext.modelValue.value = value;
    }
    rootContext.virtualKeydownHook.on((event) => {
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
      const isTabKey = event.key === "Tab" && !isMetaKey;
      if (isTabKey) return;
      let intent = MAP_KEY_TO_FOCUS_INTENT[event.key];
      if (isMetaKey && event.key === "a" && rootContext.multiple.value) {
        event.preventDefault();
        rootContext.modelValue.value = [...props.options];
        intent = "last";
      } else if (event.shiftKey && intent) handleMultipleReplace(event, intent);
      if (["first", "last"].includes(intent)) {
        event.preventDefault();
        const index = intent === "first" ? 0 : props.options.length - 1;
        virtualizer.value.scrollToIndex(index);
        requestAnimationFrame(() => {
          const items = getItems();
          const item = intent === "first" ? items[0] : items.at(-1);
          if (item) rootContext.changeHighlight(item.ref);
        });
      } else if (!intent && !isMetaKey) {
        search.value += event.key;
        const currentIndex = Number(getActiveElement()?.getAttribute("data-index"));
        const currentMatch = optionsWithMetadata.value[currentIndex].textContent;
        const filteredOptions = optionsWithMetadata.value.map((i) => i.textContent ?? "");
        const next = getNextMatch(filteredOptions, search.value, currentMatch);
        const nextMatch = optionsWithMetadata.value.find((option) => option.textContent === next);
        if (nextMatch) {
          virtualizer.value.scrollToIndex(nextMatch.index, { align: "start" });
          requestAnimationFrame(() => {
            const item = parentEl.value.querySelector(`[data-index="${nextMatch.index}"]`);
            if (item instanceof HTMLElement) rootContext.changeHighlight(item);
          });
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "data-reka-virtualizer": "",
        style: normalizeStyle({
          position: "relative",
          width: "100%",
          height: `${unref(virtualizer).getTotalSize()}px`
        })
      }, [(openBlock(true), createElementBlock(Fragment, null, renderList(virtualizedItems.value, ({ is, item }) => {
        return openBlock(), createBlock(resolveDynamicComponent(is), { key: item.index });
      }), 128))], 4);
    };
  }
});
var ListboxVirtualizer_default = ListboxVirtualizer_vue_vue_type_script_setup_true_lang_default;
function itemHasDescription(item, descriptionKey) {
  if (typeof item !== "object" || item === null) {
    return false;
  }
  const value = get(item, descriptionKey);
  return value !== void 0 && value !== null && value !== "";
}
function getSize(size, hasDescription) {
  if (hasDescription) {
    return {
      xs: 44,
      sm: 48,
      md: 52,
      lg: 56,
      xl: 60
    }[size];
  }
  return {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40
  }[size];
}
function getEstimateSize(items, size, descriptionKey, hasDescriptionSlot) {
  const sizeWithDescription = getSize(size, true);
  const sizeWithoutDescription = getSize(size, false);
  if (hasDescriptionSlot) {
    return () => sizeWithDescription;
  }
  if (!descriptionKey) {
    return () => sizeWithoutDescription;
  }
  return (index) => {
    return itemHasDescription(items[index], descriptionKey) ? sizeWithDescription : sizeWithoutDescription;
  };
}

export { ListboxItem_default as L, ListboxItemIndicator_default as a, ListboxRoot_default as b, ListboxFilter_default as c, ListboxVirtualizer_default as d, ListboxGroup_default as e, ListboxContent_default as f, getEstimateSize as g, injectListboxGroupContext as h, injectListboxRootContext as i };
//# sourceMappingURL=virtualizer-Dnga9fey.mjs.map
