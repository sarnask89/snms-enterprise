import { useSlots, useId, useAttrs, computed, unref, mergeProps, withCtx, openBlock, createBlock, createVNode, resolveDynamicComponent, renderSlot, createTextVNode, toDisplayString, createCommentVNode, defineComponent, withKeys, withModifiers, nextTick, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderVNode, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { h as useAppConfig, i as useComponentUI, v as useForwardPropsEmits, D as useFormField, t as tv, P as Primitive, e as _sfc_main$d, q as useForwardExpose, B as isNullish, C as Presence_default, r as createContext, A as useCollection } from './server.mjs';
import { i as isValueEqualOrExist } from './isValueEqualOrExist-DDZNo4Zk.mjs';
import { u as useFormControl } from './PopperArrow-CiJ5PBIc.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-vMStSdMN.mjs';
import { u as useId$1 } from './FocusScope-afTtc11Z.mjs';
import { g as getFocusIntent, w as wrapArray, f as focusFirst } from './utils-Bd-v-gOF.mjs';
import { i as injectRovingFocusGroupContext } from './RovingFocusGroup-C9aTixOz.mjs';
import { reactivePick, useVModel } from '@vueuse/core';
import { L as Label_default } from './Label-BCnUNGB-.mjs';
import { u as useResolvedVariants } from './useResolvedVariants-Cc4FdLtQ.mjs';
import { w as isEqual } from '../_/nitro.mjs';

var RovingFocusItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {
      type: String,
      required: false
    },
    focusable: {
      type: Boolean,
      required: false,
      default: true
    },
    active: {
      type: Boolean,
      required: false
    },
    allowShiftKey: {
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
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const context = injectRovingFocusGroupContext();
    const randomId = useId$1();
    const id = computed(() => props.tabStopId || randomId);
    const isCurrentTabStop = computed(() => context.currentTabStopId.value === id.value);
    const { getItems, CollectionItem } = useCollection();
    function handleKeydown(event) {
      if (event.key === "Tab" && event.shiftKey) {
        context.onItemShiftTab();
        return;
      }
      if (event.target !== event.currentTarget) return;
      const focusIntent = getFocusIntent(event, context.orientation.value, context.dir.value);
      if (focusIntent !== void 0) {
        if (event.metaKey || event.ctrlKey || event.altKey || (props.allowShiftKey ? false : event.shiftKey)) return;
        event.preventDefault();
        let candidateNodes = [...getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "")];
        if (focusIntent === "last") candidateNodes.reverse();
        else if (focusIntent === "prev" || focusIntent === "next") {
          if (focusIntent === "prev") candidateNodes.reverse();
          const currentIndex = candidateNodes.indexOf(event.currentTarget);
          candidateNodes = context.loop.value ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
        }
        nextTick(() => focusFirst(candidateNodes));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          tabindex: isCurrentTabStop.value ? 0 : -1,
          "data-orientation": unref(context).orientation.value,
          "data-active": _ctx.active ? "" : void 0,
          "data-disabled": !_ctx.focusable ? "" : void 0,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          onMousedown: _cache[0] || (_cache[0] = (event) => {
            if (!_ctx.focusable) event.preventDefault();
            else unref(context).onItemFocus(id.value);
          }),
          onFocus: _cache[1] || (_cache[1] = ($event) => unref(context).onItemFocus(id.value)),
          onKeydown: handleKeydown
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "tabindex",
          "data-orientation",
          "data-active",
          "data-disabled",
          "as",
          "as-child"
        ])]),
        _: 3
      });
    };
  }
});
var RovingFocusItem_default = RovingFocusItem_vue_vue_type_script_setup_true_lang_default;
const [injectCheckboxGroupRootContext] = /* @__PURE__ */ createContext("CheckboxGroupRoot");
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
const [injectCheckboxRootContext, provideCheckboxRootContext] = /* @__PURE__ */ createContext("CheckboxRoot");
var CheckboxRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "CheckboxRoot",
  props: {
    defaultValue: {
      type: null,
      required: false
    },
    modelValue: {
      type: null,
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false
    },
    value: {
      type: null,
      required: false,
      default: "on"
    },
    id: {
      type: String,
      required: false
    },
    trueValue: {
      type: null,
      required: false,
      default: () => true
    },
    falseValue: {
      type: null,
      required: false,
      default: () => false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
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
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const checkboxGroupContext = injectCheckboxGroupRootContext(null);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? props.falseValue,
      passive: props.modelValue === void 0
    });
    const disabled = computed(() => checkboxGroupContext?.disabled.value || props.disabled);
    const isChecked = computed(() => isEqual(modelValue.value, props.trueValue));
    const checkboxState = computed(() => {
      if (!isNullish(checkboxGroupContext?.modelValue.value)) return isValueEqualOrExist(checkboxGroupContext.modelValue.value, props.value);
      else {
        if (modelValue.value === "indeterminate") return "indeterminate";
        return isChecked.value;
      }
    });
    function handleClick() {
      if (!isNullish(checkboxGroupContext?.modelValue.value)) {
        const modelValueArray = [...checkboxGroupContext.modelValue.value || []];
        if (isValueEqualOrExist(modelValueArray, props.value)) {
          const index = modelValueArray.findIndex((i) => isEqual(i, props.value));
          modelValueArray.splice(index, 1);
        } else modelValueArray.push(props.value);
        checkboxGroupContext.modelValue.value = modelValueArray;
      } else if (modelValue.value === "indeterminate") modelValue.value = props.trueValue;
      else modelValue.value = isChecked.value ? props.falseValue : props.trueValue;
    }
    const isFormControl = useFormControl(currentElement);
    const ariaLabel = computed(() => props.id && currentElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText : void 0);
    provideCheckboxRootContext({
      disabled,
      state: checkboxState
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(checkboxGroupContext)?.rovingFocus.value ? unref(RovingFocusItem_default) : unref(Primitive)), mergeProps(_ctx.$attrs, {
        id: _ctx.id,
        ref: unref(forwardRef),
        role: "checkbox",
        "as-child": _ctx.asChild,
        as: _ctx.as,
        type: _ctx.as === "button" ? "button" : void 0,
        "aria-checked": unref(isIndeterminate)(checkboxState.value) ? "mixed" : checkboxState.value,
        "aria-required": _ctx.required,
        "aria-label": _ctx.$attrs["aria-label"] || ariaLabel.value,
        "data-state": unref(getState)(checkboxState.value),
        "data-disabled": disabled.value ? "" : void 0,
        disabled: disabled.value,
        focusable: unref(checkboxGroupContext)?.rovingFocus.value ? !disabled.value : void 0,
        onKeydown: withKeys(withModifiers(() => {
        }, ["prevent"]), ["enter"]),
        onClick: handleClick
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          modelValue: unref(modelValue),
          state: checkboxState.value
        }), unref(isFormControl) && _ctx.name && !unref(checkboxGroupContext) ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
          key: 0,
          type: "checkbox",
          checked: !!checkboxState.value,
          name: _ctx.name,
          value: _ctx.value,
          disabled: disabled.value,
          required: _ctx.required
        }, null, 8, [
          "checked",
          "name",
          "value",
          "disabled",
          "required"
        ])) : createCommentVNode("v-if", true)]),
        _: 3
      }, 16, [
        "id",
        "as-child",
        "as",
        "type",
        "aria-checked",
        "aria-required",
        "aria-label",
        "data-state",
        "data-disabled",
        "disabled",
        "focusable",
        "onKeydown"
      ]);
    };
  }
});
var CheckboxRoot_default = CheckboxRoot_vue_vue_type_script_setup_true_lang_default;
var CheckboxIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CheckboxIndicator",
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
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    const rootContext = injectCheckboxRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(isIndeterminate)(unref(rootContext).state.value) || unref(rootContext).state.value === true }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "data-state": unref(getState)(unref(rootContext).state.value),
          "data-disabled": unref(rootContext).disabled.value ? "" : void 0,
          style: { pointerEvents: "none" },
          "as-child": _ctx.asChild,
          as: _ctx.as
        }, _ctx.$attrs), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "data-state",
          "data-disabled",
          "as-child",
          "as"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var CheckboxIndicator_default = CheckboxIndicator_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "relative flex items-start",
    "container": "flex items-center",
    "base": "rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    "indicator": "flex items-center justify-center size-full text-inverted",
    "icon": "shrink-0 size-full",
    "wrapper": "w-full",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "focus-visible:outline-primary",
        "indicator": "bg-primary"
      },
      "secondary": {
        "base": "focus-visible:outline-secondary",
        "indicator": "bg-secondary"
      },
      "success": {
        "base": "focus-visible:outline-success",
        "indicator": "bg-success"
      },
      "info": {
        "base": "focus-visible:outline-info",
        "indicator": "bg-info"
      },
      "warning": {
        "base": "focus-visible:outline-warning",
        "indicator": "bg-warning"
      },
      "error": {
        "base": "focus-visible:outline-error",
        "indicator": "bg-error"
      },
      "neutral": {
        "base": "focus-visible:outline-inverted",
        "indicator": "bg-inverted"
      }
    },
    "variant": {
      "list": {
        "root": ""
      },
      "card": {
        "root": "border border-muted rounded-lg"
      }
    },
    "indicator": {
      "start": {
        "root": "flex-row",
        "wrapper": "ms-2"
      },
      "end": {
        "root": "flex-row-reverse",
        "wrapper": "me-2"
      },
      "hidden": {
        "base": "sr-only",
        "wrapper": "text-center"
      }
    },
    "size": {
      "xs": {
        "base": "size-3",
        "container": "h-4",
        "wrapper": "text-xs"
      },
      "sm": {
        "base": "size-3.5",
        "container": "h-4",
        "wrapper": "text-xs"
      },
      "md": {
        "base": "size-4",
        "container": "h-5",
        "wrapper": "text-sm"
      },
      "lg": {
        "base": "size-4.5",
        "container": "h-5",
        "wrapper": "text-sm"
      },
      "xl": {
        "base": "size-5",
        "container": "h-6",
        "wrapper": "text-base"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "disabled": {
      "true": {
        "root": "opacity-75",
        "base": "cursor-not-allowed",
        "label": "cursor-not-allowed",
        "description": "cursor-not-allowed"
      }
    },
    "checked": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "size": "xs",
      "variant": "card",
      "class": {
        "root": "p-2.5"
      }
    },
    {
      "size": "sm",
      "variant": "card",
      "class": {
        "root": "p-3"
      }
    },
    {
      "size": "md",
      "variant": "card",
      "class": {
        "root": "p-3.5"
      }
    },
    {
      "size": "lg",
      "variant": "card",
      "class": {
        "root": "p-4"
      }
    },
    {
      "size": "xl",
      "variant": "card",
      "class": {
        "root": "p-4.5"
      }
    },
    {
      "color": "primary",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-primary"
      }
    },
    {
      "color": "secondary",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-secondary"
      }
    },
    {
      "color": "success",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-success"
      }
    },
    {
      "color": "info",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-info"
      }
    },
    {
      "color": "warning",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-warning"
      }
    },
    {
      "color": "error",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-error"
      }
    },
    {
      "color": "neutral",
      "variant": "card",
      "class": {
        "root": "has-data-[state=checked]:border-inverted"
      }
    },
    {
      "variant": "card",
      "disabled": true,
      "class": {
        "root": "cursor-not-allowed"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "list",
    "indicator": "start"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UCheckbox",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    indicator: { type: null, required: false },
    icon: { type: null, required: false },
    indeterminateIcon: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    disabled: { type: Boolean, required: false },
    required: { type: Boolean, required: false },
    name: { type: String, required: false },
    value: { type: null, required: false },
    id: { type: String, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    trueValue: { type: null, required: false },
    falseValue: { type: null, required: false }
  },
  emits: ["change", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const slots = useSlots();
    const emits = __emit;
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("checkbox", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "required", "value", "defaultValue", "modelValue", "trueValue", "falseValue"), emits);
    const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
    const id = _id.value ?? useId();
    const { variant } = useResolvedVariants("checkbox", props, theme, ["variant"]);
    const attrs = useAttrs();
    const forwardedAttrs = computed(() => {
      const { "data-state": _, ...rest } = attrs;
      return rest;
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.checkbox || {} })({
      size: size.value,
      color: color.value,
      variant: variant.value,
      indicator: props.indicator,
      required: props.required,
      disabled: disabled.value
    }));
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(variant) === "list" ? __props.as : unref(Label_default),
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: unref(uiProp)?.container }))}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckboxRoot_default), mergeProps({ id: unref(id) }, { ...unref(rootProps), ...forwardedAttrs.value, ...unref(ariaAttrs) }, {
              name: unref(name),
              disabled: unref(disabled),
              "data-slot": "base",
              class: ui.value.base({ class: unref(uiProp)?.base }),
              "onUpdate:modelValue": onUpdate
            }), {
              default: withCtx(({ state }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CheckboxIndicator_default), {
                    "data-slot": "indicator",
                    class: ui.value.indicator({ class: unref(uiProp)?.indicator })
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (state === "indeterminate") {
                          _push4(ssrRenderComponent(_sfc_main$d, {
                            name: __props.indeterminateIcon || unref(appConfig).ui.icons.minus,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(uiProp)?.icon })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_sfc_main$d, {
                            name: __props.icon || unref(appConfig).ui.icons.check,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(uiProp)?.icon })
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          state === "indeterminate" ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 0,
                            name: __props.indeterminateIcon || unref(appConfig).ui.icons.minus,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(uiProp)?.icon })
                          }, null, 8, ["name", "class"])) : (openBlock(), createBlock(_sfc_main$d, {
                            key: 1,
                            name: __props.icon || unref(appConfig).ui.icons.check,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(uiProp)?.icon })
                          }, null, 8, ["name", "class"]))
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(CheckboxIndicator_default), {
                      "data-slot": "indicator",
                      class: ui.value.indicator({ class: unref(uiProp)?.indicator })
                    }, {
                      default: withCtx(() => [
                        state === "indeterminate" ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: __props.indeterminateIcon || unref(appConfig).ui.icons.minus,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(uiProp)?.icon })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(_sfc_main$d, {
                          key: 1,
                          name: __props.icon || unref(appConfig).ui.icons.check,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(uiProp)?.icon })
                        }, null, 8, ["name", "class"]))
                      ]),
                      _: 2
                    }, 1032, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.label || !!slots.label || (__props.description || !!slots.description)) {
              _push2(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: unref(uiProp)?.wrapper }))}"${_scopeId}>`);
              if (__props.label || !!slots.label) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(variant) === "list" ? unref(Label_default) : "p"), {
                  for: unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: unref(uiProp)?.label })
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                        _push3(`${ssrInterpolate(__props.label)}`);
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                          createTextVNode(toDisplayString(__props.label), 1)
                        ])
                      ];
                    }
                  }),
                  _: 3
                }), _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
              if (__props.description || !!slots.description) {
                _push2(`<p data-slot="description" class="${ssrRenderClass(ui.value.description({ class: unref(uiProp)?.description }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                  _push2(`${ssrInterpolate(__props.description)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", {
                "data-slot": "container",
                class: ui.value.container({ class: unref(uiProp)?.container })
              }, [
                createVNode(unref(CheckboxRoot_default), mergeProps({ id: unref(id) }, { ...unref(rootProps), ...forwardedAttrs.value, ...unref(ariaAttrs) }, {
                  name: unref(name),
                  disabled: unref(disabled),
                  "data-slot": "base",
                  class: ui.value.base({ class: unref(uiProp)?.base }),
                  "onUpdate:modelValue": onUpdate
                }), {
                  default: withCtx(({ state }) => [
                    createVNode(unref(CheckboxIndicator_default), {
                      "data-slot": "indicator",
                      class: ui.value.indicator({ class: unref(uiProp)?.indicator })
                    }, {
                      default: withCtx(() => [
                        state === "indeterminate" ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: __props.indeterminateIcon || unref(appConfig).ui.icons.minus,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(uiProp)?.icon })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(_sfc_main$d, {
                          key: 1,
                          name: __props.icon || unref(appConfig).ui.icons.check,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(uiProp)?.icon })
                        }, null, 8, ["name", "class"]))
                      ]),
                      _: 2
                    }, 1032, ["class"])
                  ]),
                  _: 1
                }, 16, ["id", "name", "disabled", "class"])
              ], 2),
              __props.label || !!slots.label || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: unref(uiProp)?.wrapper })
              }, [
                __props.label || !!slots.label ? (openBlock(), createBlock(resolveDynamicComponent(unref(variant) === "list" ? unref(Label_default) : "p"), {
                  key: 0,
                  for: unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: unref(uiProp)?.label })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                      createTextVNode(toDisplayString(__props.label), 1)
                    ])
                  ]),
                  _: 3
                }, 8, ["for", "class"])) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({ class: unref(uiProp)?.description })
                }, [
                  renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    createTextVNode(toDisplayString(__props.description), 1)
                  ])
                ], 2)) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Checkbox-mfegmXJ0.mjs.map
