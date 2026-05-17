import { useId, toRef, computed, mergeProps, withCtx, unref, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, useSlots, createTextVNode, toDisplayString, ref, useTemplateRef, watch, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { h as useAppConfig, i as useComponentUI, t as tv, P as Primitive, e as _sfc_main$d, w as useForwardProps, s as useLocale, b as _sfc_main$8 } from './server.mjs';
import { x as defu } from '../_/nitro.mjs';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { u as useDashboard, a as useResizable, b as _sfc_main$1$1, c as _sfc_main$4 } from './DashboardSidebarToggle-CpAlTuik.mjs';
import { createReusableTemplate, reactiveOmit } from '@vueuse/core';

const theme$3 = {
  "slots": {
    "root": "relative",
    "viewport": "relative flex",
    "item": ""
  },
  "variants": {
    "orientation": {
      "vertical": {
        "root": "overflow-y-auto overflow-x-hidden",
        "viewport": "flex-col",
        "item": ""
      },
      "horizontal": {
        "root": "overflow-x-auto overflow-y-hidden",
        "viewport": "flex-row",
        "item": ""
      }
    }
  }
};
const _sfc_main$3 = {
  __name: "UScrollArea",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    orientation: { type: null, required: false, default: "vertical" },
    items: { type: Array, required: false },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false }
  },
  emits: ["scroll"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { dir } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("scrollArea", props);
    const ui = computed(() => tv({ extend: tv(theme$3), ...appConfig.ui?.scrollArea || {} })({
      orientation: props.orientation
    }));
    const rootRef = useTemplateRef("rootRef");
    const isRtl = computed(() => dir.value === "rtl");
    const isHorizontal = computed(() => props.orientation === "horizontal");
    const isVertical = computed(() => !isHorizontal.value);
    const virtualizerProps = toRef(() => {
      const options = typeof props.virtualize === "boolean" ? {} : props.virtualize;
      return defu(options, {
        estimateSize: 100,
        overscan: 12,
        gap: 0,
        paddingStart: 0,
        paddingEnd: 0,
        scrollMargin: 0
      });
    });
    const lanes = computed(() => {
      const value = virtualizerProps.value.lanes;
      return typeof value === "number" ? value : void 0;
    });
    const skipMeasurement = computed(() => {
      return typeof props.virtualize === "object" && props.virtualize.skipMeasurement === true;
    });
    const virtualizer = !!props.virtualize && useVirtualizer({
      ...virtualizerProps.value,
      get overscan() {
        return virtualizerProps.value.overscan;
      },
      get gap() {
        return virtualizerProps.value.gap;
      },
      get paddingStart() {
        return virtualizerProps.value.paddingStart;
      },
      get paddingEnd() {
        return virtualizerProps.value.paddingEnd;
      },
      get scrollMargin() {
        return virtualizerProps.value.scrollMargin;
      },
      get lanes() {
        return lanes.value;
      },
      get isRtl() {
        return isRtl.value;
      },
      get count() {
        return props.items?.length || 0;
      },
      getScrollElement: () => rootRef.value?.$el,
      get horizontal() {
        return isHorizontal.value;
      },
      estimateSize: (index) => {
        const estimate = virtualizerProps.value.estimateSize;
        return typeof estimate === "function" ? estimate(index) : estimate;
      }
    });
    const virtualItems = computed(() => virtualizer ? virtualizer.value.getVirtualItems() : []);
    const totalSize = computed(() => virtualizer ? virtualizer.value.getTotalSize() : 0);
    const virtualViewportStyle = computed(() => ({
      position: "relative",
      inlineSize: isHorizontal.value ? `${totalSize.value}px` : "100%",
      blockSize: isVertical.value ? `${totalSize.value}px` : "100%"
    }));
    function getVirtualItemStyle(virtualItem) {
      const hasLanes = lanes.value !== void 0 && lanes.value > 1;
      const lane = virtualItem.lane;
      const gap = virtualizerProps.value.gap ?? 0;
      const laneSize = hasLanes ? `calc((100% - ${(lanes.value - 1) * gap}px) / ${lanes.value})` : "100%";
      const lanePosition = hasLanes && lane !== void 0 ? `calc(${lane} * ((100% - ${(lanes.value - 1) * gap}px) / ${lanes.value} + ${gap}px))` : 0;
      return {
        position: "absolute",
        insetBlockStart: isHorizontal.value && hasLanes ? lanePosition : 0,
        insetInlineStart: isVertical.value && hasLanes ? lanePosition : 0,
        blockSize: isHorizontal.value ? hasLanes ? laneSize : "100%" : void 0,
        inlineSize: isVertical.value ? hasLanes ? laneSize : "100%" : void 0,
        transform: isHorizontal.value ? `translateX(${isRtl.value ? -virtualItem.start : virtualItem.start}px)` : `translateY(${virtualItem.start}px)`
      };
    }
    function measureElement(el) {
      if (el && virtualizer && !skipMeasurement.value) {
        const element = el instanceof Element ? el : el.$el;
        virtualizer.value.measureElement(element);
      }
    }
    watch(
      () => virtualizer ? virtualizer.value.isScrolling : false,
      (isScrolling) => emits("scroll", isScrolling)
    );
    function getItemKey(item, index) {
      if (virtualizerProps.value.getItemKey) {
        return virtualizerProps.value.getItemKey(index);
      }
      if (item && typeof item === "object" && "id" in item) {
        return item.id;
      }
      return index;
    }
    __expose({
      get $el() {
        return rootRef.value?.$el;
      },
      virtualizer: virtualizer || void 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        as: __props.as,
        "data-slot": "root",
        "data-orientation": __props.orientation,
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(virtualizer)) {
              _push2(`<div data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: unref(uiProp)?.viewport }))}" style="${ssrRenderStyle(virtualViewportStyle.value)}"${_scopeId}><!--[-->`);
              ssrRenderList(virtualItems.value, (virtualItem) => {
                _push2(`<div${ssrRenderAttr("data-index", virtualItem.index)} data-slot="item" class="${ssrRenderClass(ui.value.item({ class: unref(uiProp)?.item }))}" style="${ssrRenderStyle(getVirtualItemStyle(virtualItem))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "default", {
                  item: __props.items?.[virtualItem.index],
                  index: virtualItem.index,
                  virtualItem
                }, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: unref(uiProp)?.viewport }))}"${_scopeId}>`);
              if (__props.items) {
                _push2(`<!--[-->`);
                ssrRenderList(__props.items, (item, index) => {
                  _push2(`<div data-slot="item" class="${ssrRenderClass(ui.value.item({ class: unref(uiProp)?.item }))}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, "default", {
                    item,
                    index
                  }, null, _push2, _parent2, _scopeId);
                  _push2(`</div>`);
                });
                _push2(`<!--]-->`);
              } else {
                ssrRenderSlot(_ctx.$slots, "default", {
                  item: {},
                  index: 0
                }, null, _push2, _parent2, _scopeId);
              }
              _push2(`</div>`);
            }
          } else {
            return [
              unref(virtualizer) ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "viewport",
                class: ui.value.viewport({ class: unref(uiProp)?.viewport }),
                style: virtualViewportStyle.value
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(virtualItems.value, (virtualItem) => {
                  return openBlock(), createBlock("div", {
                    key: String(virtualItem.key),
                    ref_for: true,
                    ref: measureElement,
                    "data-index": virtualItem.index,
                    "data-slot": "item",
                    class: ui.value.item({ class: unref(uiProp)?.item }),
                    style: getVirtualItemStyle(virtualItem)
                  }, [
                    renderSlot(_ctx.$slots, "default", {
                      item: __props.items?.[virtualItem.index],
                      index: virtualItem.index,
                      virtualItem
                    })
                  ], 14, ["data-index"]);
                }), 128))
              ], 6)) : (openBlock(), createBlock("div", {
                key: 1,
                "data-slot": "viewport",
                class: ui.value.viewport({ class: unref(uiProp)?.viewport })
              }, [
                __props.items ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(__props.items, (item, index) => {
                  return openBlock(), createBlock("div", {
                    key: getItemKey(item, index),
                    "data-slot": "item",
                    class: ui.value.item({ class: unref(uiProp)?.item })
                  }, [
                    renderSlot(_ctx.$slots, "default", {
                      item,
                      index
                    })
                  ], 2);
                }), 128)) : renderSlot(_ctx.$slots, "default", {
                  key: 1,
                  item: {},
                  index: 0
                })
              ], 2))
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/ScrollArea.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const theme$2 = {
  "slots": {
    "root": "relative flex flex-col min-w-0 min-h-svh lg:not-last:border-e lg:not-last:border-default shrink-0",
    "body": "flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6",
    "handle": ""
  },
  "variants": {
    "size": {
      "true": {
        "root": "w-full lg:w-(--width)"
      },
      "false": {
        "root": "flex-1"
      }
    }
  }
};
const _sfc_main$2 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UDashboardPanel",
  __ssrInlineRender: true,
  props: {
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    id: { type: String, required: false },
    minSize: { type: Number, required: false, default: 15 },
    maxSize: { type: Number, required: false },
    defaultSize: { type: Number, required: false },
    resizable: { type: Boolean, required: false, default: false }
  },
  setup(__props) {
    const props = __props;
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardPanel", props);
    const dashboardContext = useDashboard({ storageKey: "dashboard", unit: "%" });
    const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`;
    const { el, size, isDragging, onMouseDown, onTouchStart, onDoubleClick } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })));
    const ui = computed(() => tv({ extend: tv(theme$2), ...appConfig.ui?.dashboardPanel || {} })({
      size: !!size.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UScrollArea = _sfc_main$3;
      _push(ssrRenderComponent(_component_UScrollArea, mergeProps({ class: "h-full" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${ssrRenderAttrs(mergeProps({
              id,
              ref_key: "el",
              ref: el
            }, _ctx.$attrs, {
              "data-dragging": unref(isDragging),
              "data-slot": "root",
              class: ui.value.root({ class: [unref(uiProp)?.root, props.class] }),
              style: [unref(size) ? { "--width": `${unref(size)}${unref(dashboardContext).unit}` } : void 0]
            }))}${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              ssrRenderSlot(_ctx.$slots, "header", {}, null, _push2, _parent2, _scopeId);
              _push2(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(uiProp)?.body }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "body", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
              ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent2, _scopeId);
            }, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            ssrRenderSlot(_ctx.$slots, "resize-handle", {
              onMouseDown: unref(onMouseDown),
              onTouchStart: unref(onTouchStart),
              onDoubleClick: unref(onDoubleClick)
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
              createVNode("div", mergeProps({
                id,
                ref_key: "el",
                ref: el
              }, _ctx.$attrs, {
                "data-dragging": unref(isDragging),
                "data-slot": "root",
                class: ui.value.root({ class: [unref(uiProp)?.root, props.class] }),
                style: [unref(size) ? { "--width": `${unref(size)}${unref(dashboardContext).unit}` } : void 0]
              }), [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  renderSlot(_ctx.$slots, "header"),
                  createVNode("div", {
                    "data-slot": "body",
                    class: ui.value.body({ class: unref(uiProp)?.body })
                  }, [
                    renderSlot(_ctx.$slots, "body")
                  ], 2),
                  renderSlot(_ctx.$slots, "footer")
                ])
              ], 16, ["data-dragging"]),
              renderSlot(_ctx.$slots, "resize-handle", {
                onMouseDown: unref(onMouseDown),
                onTouchStart: unref(onTouchStart),
                onDoubleClick: unref(onDoubleClick)
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
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "root": "h-(--ui-header-height) shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5",
    "left": "flex items-center gap-1.5 min-w-0",
    "icon": "shrink-0 size-5 self-center me-1.5",
    "title": "flex items-center gap-1.5 font-semibold text-highlighted truncate",
    "center": "hidden lg:flex",
    "right": "flex items-center shrink-0 gap-1.5",
    "toggle": ""
  },
  "variants": {
    "toggleSide": {
      "left": {
        "toggle": ""
      },
      "right": {
        "toggle": ""
      }
    }
  }
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UDashboardNavbar",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    icon: { type: null, required: false },
    title: { type: String, required: false },
    toggle: { type: [Boolean, Object], required: false, default: true },
    toggleSide: { type: String, required: false, default: "left" },
    class: { type: null, required: false },
    ui: { type: Object, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardNavbar", props);
    const dashboardContext = useDashboard({});
    const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.dashboardNavbar || {} })());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineToggleTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "toggle", { ...unref(dashboardContext), ui: ui.value }, () => {
              if (__props.toggle) {
                _push2(ssrRenderComponent(_sfc_main$4, mergeProps(typeof __props.toggle === "object" ? __props.toggle : {}, {
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
              renderSlot(_ctx.$slots, "toggle", { ...unref(dashboardContext), ui: ui.value }, () => [
                __props.toggle ? (openBlock(), createBlock(_sfc_main$4, mergeProps({ key: 0 }, typeof __props.toggle === "object" ? __props.toggle : {}, {
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
      _push(ssrRenderComponent(unref(Primitive), mergeProps({ as: __props.as }, _ctx.$attrs, {
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="left" class="${ssrRenderClass(ui.value.left({ class: unref(uiProp)?.left }))}"${_scopeId}>`);
            if (__props.toggleSide === "left") {
              _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "left", unref(dashboardContext), () => {
              ssrRenderSlot(_ctx.$slots, "leading", { ...unref(dashboardContext), ui: ui.value }, () => {
                if (__props.icon) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: __props.icon,
                    "data-slot": "icon",
                    class: ui.value.icon({ class: unref(uiProp)?.icon })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`<h1 data-slot="title" class="${ssrRenderClass(ui.value.title({ class: unref(uiProp)?.title }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                _push2(`${ssrInterpolate(__props.title)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</h1>`);
              ssrRenderSlot(_ctx.$slots, "trailing", { ...unref(dashboardContext), ui: ui.value }, null, _push2, _parent2, _scopeId);
            }, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            if (!!slots.default) {
              _push2(`<div data-slot="center" class="${ssrRenderClass(ui.value.center({ class: unref(uiProp)?.center }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "default", unref(dashboardContext), null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div data-slot="right" class="${ssrRenderClass(ui.value.right({ class: unref(uiProp)?.right }))}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "right", unref(dashboardContext), null, _push2, _parent2, _scopeId);
            if (__props.toggleSide === "right") {
              _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "data-slot": "left",
                class: ui.value.left({ class: unref(uiProp)?.left })
              }, [
                __props.toggleSide === "left" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 0 })) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "left", unref(dashboardContext), () => [
                  renderSlot(_ctx.$slots, "leading", { ...unref(dashboardContext), ui: ui.value }, () => [
                    __props.icon ? (openBlock(), createBlock(_sfc_main$d, {
                      key: 0,
                      name: __props.icon,
                      "data-slot": "icon",
                      class: ui.value.icon({ class: unref(uiProp)?.icon })
                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                  ]),
                  createVNode("h1", {
                    "data-slot": "title",
                    class: ui.value.title({ class: unref(uiProp)?.title })
                  }, [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      createTextVNode(toDisplayString(__props.title), 1)
                    ])
                  ], 2),
                  renderSlot(_ctx.$slots, "trailing", { ...unref(dashboardContext), ui: ui.value })
                ])
              ], 2),
              !!slots.default ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "center",
                class: ui.value.center({ class: unref(uiProp)?.center })
              }, [
                renderSlot(_ctx.$slots, "default", unref(dashboardContext))
              ], 2)) : createCommentVNode("", true),
              createVNode("div", {
                "data-slot": "right",
                class: ui.value.right({ class: unref(uiProp)?.right })
              }, [
                renderSlot(_ctx.$slots, "right", unref(dashboardContext)),
                __props.toggleSide === "right" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 0 })) : createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardNavbar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const theme = {
  "base": "hidden lg:flex",
  "variants": {
    "side": {
      "left": "",
      "right": ""
    }
  }
};
const _sfc_main = {
  __name: "UDashboardSidebarCollapse",
  __ssrInlineRender: true,
  props: {
    color: { type: null, required: false, default: "neutral" },
    variant: { type: null, required: false, default: "ghost" },
    side: { type: String, required: false, default: "left" },
    ui: { type: Object, required: false },
    label: { type: String, required: false },
    activeColor: { type: null, required: false },
    activeVariant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    block: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    icon: { type: null, required: false },
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
    const buttonProps = useForwardProps(reactiveOmit(props, "icon", "side", "class"));
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("dashboardSidebarCollapse", props);
    const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {
    } });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSidebarCollapse || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$8, mergeProps({
        ...unref(buttonProps),
        "icon": props.icon || (unref(sidebarCollapsed) ? unref(appConfig).ui.icons.panelOpen : unref(appConfig).ui.icons.panelClose),
        "aria-label": unref(sidebarCollapsed) ? unref(t)("dashboardSidebarCollapse.expand") : unref(t)("dashboardSidebarCollapse.collapse"),
        ..._ctx.$attrs
      }, {
        class: ui.value({ class: [unref(uiProp)?.base, props.class], side: props.side }),
        onClick: ($event) => unref(collapseSidebar)?.(!unref(sidebarCollapsed))
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/DashboardSidebarCollapse.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$2 as _, _sfc_main$1 as a, _sfc_main as b };
//# sourceMappingURL=DashboardSidebarCollapse-6_wW4EC7.mjs.map
