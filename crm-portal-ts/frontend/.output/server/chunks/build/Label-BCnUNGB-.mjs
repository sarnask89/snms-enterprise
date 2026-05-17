import { q as useForwardExpose, P as Primitive } from './server.mjs';
import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from 'vue';

var Label_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "Label",
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
      default: "label"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { onMousedown: _cache[0] || (_cache[0] = (event) => {
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var Label_default = Label_vue_vue_type_script_setup_true_lang_default;

export { Label_default as L };
//# sourceMappingURL=Label-BCnUNGB-.mjs.map
