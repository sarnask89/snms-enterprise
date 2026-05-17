import { useSlots, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderSlot, toDisplayString, createCommentVNode, defineComponent, normalizeProps, guardReactiveProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { h as useAppConfig, i as useComponentUI, w as useForwardProps, t as tv, e as _sfc_main$d, z as _sfc_main$b, P as Primitive } from './server.mjs';
import { reactivePick } from '@vueuse/core';

var BaseSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "BaseSeparator",
  props: {
    orientation: {
      type: String,
      required: false,
      default: "horizontal"
    },
    decorative: {
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
    const ORIENTATIONS = ["horizontal", "vertical"];
    function isValidOrientation(orientation) {
      return ORIENTATIONS.includes(orientation);
    }
    const computedOrientation = computed(() => isValidOrientation(props.orientation) ? props.orientation : "horizontal");
    const ariaOrientation = computed(() => computedOrientation.value === "vertical" ? props.orientation : void 0);
    const semanticProps = computed(() => props.decorative ? { role: "none" } : {
      "aria-orientation": ariaOrientation.value,
      "role": "separator"
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-orientation": computedOrientation.value
      }, semanticProps.value), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "as",
        "as-child",
        "data-orientation"
      ]);
    };
  }
});
var BaseSeparator_default = BaseSeparator_vue_vue_type_script_setup_true_lang_default;
var Separator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "Separator",
  props: {
    orientation: {
      type: String,
      required: false,
      default: "horizontal"
    },
    decorative: {
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(BaseSeparator_default, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var Separator_default = Separator_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "flex items-center align-center text-center",
    "border": "",
    "container": "font-medium text-default flex",
    "icon": "shrink-0 size-5",
    "avatar": "shrink-0",
    "avatarSize": "2xs",
    "label": "text-sm"
  },
  "variants": {
    "color": {
      "primary": {
        "border": "border-primary"
      },
      "secondary": {
        "border": "border-secondary"
      },
      "success": {
        "border": "border-success"
      },
      "info": {
        "border": "border-info"
      },
      "warning": {
        "border": "border-warning"
      },
      "error": {
        "border": "border-error"
      },
      "neutral": {
        "border": "border-default"
      }
    },
    "orientation": {
      "horizontal": {
        "root": "w-full flex-row",
        "border": "w-full",
        "container": "mx-3 whitespace-nowrap"
      },
      "vertical": {
        "root": "h-full flex-col",
        "border": "h-full",
        "container": "my-2"
      }
    },
    "size": {
      "xs": "",
      "sm": "",
      "md": "",
      "lg": "",
      "xl": ""
    },
    "type": {
      "solid": {
        "border": "border-solid"
      },
      "dashed": {
        "border": "border-dashed"
      },
      "dotted": {
        "border": "border-dotted"
      }
    }
  },
  "compoundVariants": [
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": {
        "border": "border-t"
      }
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": {
        "border": "border-t-[2px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": {
        "border": "border-t-[3px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": {
        "border": "border-t-[4px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": {
        "border": "border-t-[5px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": {
        "border": "border-s"
      }
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": {
        "border": "border-s-[2px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": {
        "border": "border-s-[3px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": {
        "border": "border-s-[4px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": {
        "border": "border-s-[5px]"
      }
    }
  ],
  "defaultVariants": {
    "color": "neutral",
    "size": "xs",
    "type": "solid"
  }
};
const _sfc_main = {
  __name: "USeparator",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    label: { type: String, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    type: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    decorative: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("separator", props);
    const rootProps = useForwardProps(reactivePick(props, "as", "decorative", "orientation"));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.separator || {} })({
      color: props.color,
      orientation: props.orientation,
      size: props.size,
      type: props.type
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator_default), mergeProps(unref(rootProps), {
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="border" class="${ssrRenderClass(ui.value.border({ class: unref(uiProp)?.border }))}"${_scopeId}></div>`);
            if (__props.label || __props.icon || __props.avatar || !!slots.default) {
              _push2(`<!--[--><div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: unref(uiProp)?.container }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
                if (__props.label) {
                  _push2(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({ class: unref(uiProp)?.label }))}"${_scopeId}>${ssrInterpolate(__props.label)}</span>`);
                } else if (__props.icon) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: __props.icon,
                    "data-slot": "icon",
                    class: ui.value.icon({ class: unref(uiProp)?.icon })
                  }, null, _parent2, _scopeId));
                } else if (__props.avatar) {
                  _push2(ssrRenderComponent(_sfc_main$b, mergeProps({
                    size: unref(uiProp)?.avatarSize || ui.value.avatarSize()
                  }, __props.avatar, {
                    "data-slot": "avatar",
                    class: ui.value.avatar({ class: unref(uiProp)?.avatar })
                  }), null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</div><div data-slot="border" class="${ssrRenderClass(ui.value.border({ class: unref(uiProp)?.border }))}"${_scopeId}></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", {
                "data-slot": "border",
                class: ui.value.border({ class: unref(uiProp)?.border })
              }, null, 2),
              __props.label || __props.icon || __props.avatar || !!slots.default ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode("div", {
                  "data-slot": "container",
                  class: ui.value.container({ class: unref(uiProp)?.container })
                }, [
                  renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [
                    __props.label ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "label",
                      class: ui.value.label({ class: unref(uiProp)?.label })
                    }, toDisplayString(__props.label), 3)) : __props.icon ? (openBlock(), createBlock(_sfc_main$d, {
                      key: 1,
                      name: __props.icon,
                      "data-slot": "icon",
                      class: ui.value.icon({ class: unref(uiProp)?.icon })
                    }, null, 8, ["name", "class"])) : __props.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                      key: 2,
                      size: unref(uiProp)?.avatarSize || ui.value.avatarSize()
                    }, __props.avatar, {
                      "data-slot": "avatar",
                      class: ui.value.avatar({ class: unref(uiProp)?.avatar })
                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                  ])
                ], 2),
                createVNode("div", {
                  "data-slot": "border",
                  class: ui.value.border({ class: unref(uiProp)?.border })
                }, null, 2)
              ], 64)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Separator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Separator-CoXp0Z15.mjs.map
