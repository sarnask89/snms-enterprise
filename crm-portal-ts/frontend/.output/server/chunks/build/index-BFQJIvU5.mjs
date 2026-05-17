import { _ as _sfc_main$9 } from './Badge-BJKdv1tG.mjs';
import { c as useToast, b as _sfc_main$8, n as navigateTo, s as useLocale, h as useAppConfig, i as useComponentUI, v as useForwardPropsEmits, t as tv, q as useForwardExpose, P as Primitive, r as createContext } from './server.mjs';
import { _ as _sfc_main$2$1 } from './DashboardSidebarToggle-CpAlTuik.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$a } from './DashboardSidebarCollapse-6_wW4EC7.mjs';
import { _ as _sfc_main$3 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$4 } from './FormField-DlUD5lcD.mjs';
import { _ as _sfc_main$5 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$6 } from './Select-DYGJGuWK.mjs';
import { _ as _sfc_main$7 } from './Table-CiWunXtq.mjs';
import { ref, reactive, computed, withAsyncContext, watch, mergeProps, withCtx, unref, createVNode, toDisplayString, withModifiers, openBlock, createBlock, isRef, createTextVNode, Fragment, renderList, createCommentVNode, useSlots, renderSlot, defineComponent, toRefs, normalizeProps, guardReactiveProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { reactivePick, useVModel } from '@vueuse/core';
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
import '@vueuse/shared';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import './PopperArrow-CiJ5PBIc.mjs';
import '@floating-ui/vue';
import './FocusScope-afTtc11Z.mjs';
import 'aria-hidden';
import './utils-hoYYm4l-.mjs';
import './RovingFocusGroup-C9aTixOz.mjs';
import './utils-Bd-v-gOF.mjs';
import './useFilter-BytkjEhg.mjs';
import '@tanstack/vue-virtual';
import './Label-BCnUNGB-.mjs';
import './useResolvedVariants-Cc4FdLtQ.mjs';
import '@tanstack/vue-table';
import '@vue/shared';

var PaginationEllipsis_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationEllipsis",
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
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "data-type": "ellipsis" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createTextVNode("…"))])]),
        _: 3
      }, 16);
    };
  }
});
var PaginationEllipsis_default = PaginationEllipsis_vue_vue_type_script_setup_true_lang_default;
const [injectPaginationRootContext, providePaginationRootContext] = /* @__PURE__ */ createContext("PaginationRoot");
var PaginationRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationRoot",
  props: {
    page: {
      type: Number,
      required: false
    },
    defaultPage: {
      type: Number,
      required: false,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: false,
      default: 0
    },
    siblingCount: {
      type: Number,
      required: false,
      default: 2
    },
    disabled: {
      type: Boolean,
      required: false
    },
    showEdges: {
      type: Boolean,
      required: false,
      default: false
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
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { siblingCount, disabled, showEdges } = toRefs(props);
    useForwardExpose();
    const page = useVModel(props, "page", emits, {
      defaultValue: props.defaultPage,
      passive: props.page === void 0
    });
    const pageCount = computed(() => Math.max(1, Math.ceil(props.total / (props.itemsPerPage || 1))));
    providePaginationRootContext({
      page,
      onPageChange(value) {
        page.value = value;
      },
      pageCount,
      siblingCount,
      disabled,
      showEdges
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          page: unref(page),
          pageCount: pageCount.value
        })]),
        _: 3
      }, 8, ["as", "as-child"]);
    };
  }
});
var PaginationRoot_default = PaginationRoot_vue_vue_type_script_setup_true_lang_default;
var PaginationFirst_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationFirst",
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
    const rootContext = injectPaginationRootContext();
    useForwardExpose();
    const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "First Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("First page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationFirst_default = PaginationFirst_vue_vue_type_script_setup_true_lang_default;
var PaginationLast_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationLast",
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
    const rootContext = injectPaginationRootContext();
    useForwardExpose();
    const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Last Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).pageCount.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Last page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationLast_default = PaginationLast_vue_vue_type_script_setup_true_lang_default;
function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}
function transform(items) {
  return items.map((value) => {
    if (typeof value === "number") return {
      type: "page",
      value
    };
    return { type: "ellipsis" };
  });
}
const ELLIPSIS = "ellipsis";
function getRange(currentPage, pageCount, siblingCount, showEdges) {
  const firstPageIndex = 1;
  const lastPageIndex = pageCount;
  const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPageIndex);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPageIndex);
  if (showEdges) {
    const totalPageNumbers = Math.min(2 * siblingCount + 5, pageCount);
    const itemCount = totalPageNumbers - 2;
    const showLeftEllipsis = leftSiblingIndex > firstPageIndex + 2 && Math.abs(lastPageIndex - itemCount - firstPageIndex + 1) > 2 && Math.abs(leftSiblingIndex - firstPageIndex) > 2;
    const showRightEllipsis = rightSiblingIndex < lastPageIndex - 2 && Math.abs(lastPageIndex - itemCount) > 2 && Math.abs(lastPageIndex - rightSiblingIndex) > 2;
    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, itemCount);
      return [
        ...leftRange,
        ELLIPSIS,
        lastPageIndex
      ];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(lastPageIndex - itemCount + 1, lastPageIndex);
      return [
        firstPageIndex,
        ELLIPSIS,
        ...rightRange
      ];
    }
    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        ELLIPSIS,
        ...middleRange,
        ELLIPSIS,
        lastPageIndex
      ];
    }
    const fullRange = range(firstPageIndex, lastPageIndex);
    return fullRange;
  } else {
    const itemCount = siblingCount * 2 + 1;
    if (pageCount < itemCount) return range(1, lastPageIndex);
    else if (currentPage <= siblingCount + 1) return range(firstPageIndex, itemCount);
    else if (pageCount - currentPage <= siblingCount) return range(pageCount - itemCount + 1, lastPageIndex);
    else return range(leftSiblingIndex, rightSiblingIndex);
  }
}
var PaginationList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationList",
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
    const rootContext = injectPaginationRootContext();
    const transformedRange = computed(() => {
      return transform(getRange(rootContext.page.value, rootContext.pageCount.value, rootContext.siblingCount.value, rootContext.showEdges.value));
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { items: transformedRange.value })]),
        _: 3
      }, 16);
    };
  }
});
var PaginationList_default = PaginationList_vue_vue_type_script_setup_true_lang_default;
var PaginationListItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationListItem",
  props: {
    value: {
      type: Number,
      required: true
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
    useForwardExpose();
    const rootContext = injectPaginationRootContext();
    const isSelected = computed(() => rootContext.page.value === props.value);
    const disabled = computed(() => rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "data-type": "page",
        "aria-label": `Page ${_ctx.value}`,
        "aria-current": isSelected.value ? "page" : void 0,
        "data-selected": isSelected.value ? "true" : void 0,
        disabled: disabled.value,
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(_ctx.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.value), 1)])]),
        _: 3
      }, 16, [
        "aria-label",
        "aria-current",
        "data-selected",
        "disabled",
        "type"
      ]);
    };
  }
});
var PaginationListItem_default = PaginationListItem_vue_vue_type_script_setup_true_lang_default;
var PaginationNext_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationNext",
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
    const rootContext = injectPaginationRootContext();
    const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Next Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value + 1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Next page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationNext_default = PaginationNext_vue_vue_type_script_setup_true_lang_default;
var PaginationPrev_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationPrev",
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
    const rootContext = injectPaginationRootContext();
    const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Previous Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value - 1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Prev page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationPrev_default = PaginationPrev_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "",
    "list": "flex items-center gap-1",
    "ellipsis": "pointer-events-none",
    "label": "min-w-5 text-center",
    "first": "",
    "prev": "",
    "item": "",
    "next": "",
    "last": ""
  }
};
const _sfc_main$1 = {
  __name: "UPagination",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    firstIcon: { type: null, required: false },
    prevIcon: { type: null, required: false },
    nextIcon: { type: null, required: false },
    lastIcon: { type: null, required: false },
    ellipsisIcon: { type: null, required: false },
    color: { type: null, required: false, default: "neutral" },
    variant: { type: null, required: false, default: "outline" },
    activeColor: { type: null, required: false, default: "primary" },
    activeVariant: { type: null, required: false, default: "solid" },
    showControls: { type: Boolean, required: false, default: true },
    size: { type: null, required: false },
    to: { type: Function, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    defaultPage: { type: Number, required: false },
    disabled: { type: Boolean, required: false },
    itemsPerPage: { type: Number, required: false, default: 10 },
    page: { type: Number, required: false },
    showEdges: { type: Boolean, required: false, default: false },
    siblingCount: { type: Number, required: false, default: 2 },
    total: { type: Number, required: false, default: 0 }
  },
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { dir } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("pagination", props);
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultPage", "disabled", "itemsPerPage", "page", "showEdges", "siblingCount", "total"), emits);
    const firstIcon = computed(() => props.firstIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
    const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
    const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
    const lastIcon = computed(() => props.lastIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pagination || {} })());
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PaginationRoot_default), mergeProps(unref(rootProps), {
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }, _attrs), {
        default: withCtx(({ page, pageCount }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PaginationList_default), {
              "data-slot": "list",
              class: ui.value.list({ class: unref(uiProp)?.list })
            }, {
              default: withCtx(({ items }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.showControls || !!slots.first) {
                    _push3(ssrRenderComponent(unref(PaginationFirst_default), {
                      "as-child": "",
                      "data-slot": "first",
                      class: ui.value.first({ class: unref(uiProp)?.first })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "first", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: __props.color,
                              variant: __props.variant,
                              size: __props.size,
                              icon: firstIcon.value,
                              to: __props.to?.(1)
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "first", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: firstIcon.value,
                                to: __props.to?.(1)
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.showControls || !!slots.prev) {
                    _push3(ssrRenderComponent(unref(PaginationPrev_default), {
                      "as-child": "",
                      "data-slot": "prev",
                      class: ui.value.prev({ class: unref(uiProp)?.prev })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "prev", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: __props.color,
                              variant: __props.variant,
                              size: __props.size,
                              icon: prevIcon.value,
                              to: page > 1 ? __props.to?.(page - 1) : void 0
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "prev", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: prevIcon.value,
                                to: page > 1 ? __props.to?.(page - 1) : void 0
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<!--[-->`);
                  ssrRenderList(items, (item, index) => {
                    _push3(`<!--[-->`);
                    if (item.type === "page") {
                      _push3(ssrRenderComponent(unref(PaginationListItem_default), {
                        "as-child": "",
                        value: item.value,
                        "data-slot": "item",
                        class: ui.value.item({ class: unref(uiProp)?.item })
                      }, {
                        default: withCtx((_, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => {
                              _push4(ssrRenderComponent(_sfc_main$8, {
                                color: page === item.value ? __props.activeColor : __props.color,
                                variant: page === item.value ? __props.activeVariant : __props.variant,
                                size: __props.size,
                                label: String(item.value),
                                ui: { label: ui.value.label() },
                                to: __props.to?.(item.value),
                                square: ""
                              }, null, _parent4, _scopeId3));
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                                createVNode(_sfc_main$8, {
                                  color: page === item.value ? __props.activeColor : __props.color,
                                  variant: page === item.value ? __props.activeVariant : __props.variant,
                                  size: __props.size,
                                  label: String(item.value),
                                  ui: { label: ui.value.label() },
                                  to: __props.to?.(item.value),
                                  square: ""
                                }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(unref(PaginationEllipsis_default), {
                        "as-child": "",
                        "data-slot": "ellipsis",
                        class: ui.value.ellipsis({ class: unref(uiProp)?.ellipsis })
                      }, {
                        default: withCtx((_, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => {
                              _push4(ssrRenderComponent(_sfc_main$8, {
                                as: "div",
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: __props.ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                              }, null, _parent4, _scopeId3));
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                                createVNode(_sfc_main$8, {
                                  as: "div",
                                  color: __props.color,
                                  variant: __props.variant,
                                  size: __props.size,
                                  icon: __props.ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                                }, null, 8, ["color", "variant", "size", "icon"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                  if (__props.showControls || !!slots.next) {
                    _push3(ssrRenderComponent(unref(PaginationNext_default), {
                      "as-child": "",
                      "data-slot": "next",
                      class: ui.value.next({ class: unref(uiProp)?.next })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "next", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: __props.color,
                              variant: __props.variant,
                              size: __props.size,
                              icon: nextIcon.value,
                              to: page < pageCount ? __props.to?.(page + 1) : void 0
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "next", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: nextIcon.value,
                                to: page < pageCount ? __props.to?.(page + 1) : void 0
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.showControls || !!slots.last) {
                    _push3(ssrRenderComponent(unref(PaginationLast_default), {
                      "as-child": "",
                      "data-slot": "last",
                      class: ui.value.last({ class: unref(uiProp)?.last })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "last", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: __props.color,
                              variant: __props.variant,
                              size: __props.size,
                              icon: lastIcon.value,
                              to: __props.to?.(pageCount)
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "last", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: lastIcon.value,
                                to: __props.to?.(pageCount)
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
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
                    __props.showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
                      key: 0,
                      "as-child": "",
                      "data-slot": "first",
                      class: ui.value.first({ class: unref(uiProp)?.first })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "first", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: __props.color,
                            variant: __props.variant,
                            size: __props.size,
                            icon: firstIcon.value,
                            to: __props.to?.(1)
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 3
                    }, 8, ["class"])) : createCommentVNode("", true),
                    __props.showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
                      key: 1,
                      "as-child": "",
                      "data-slot": "prev",
                      class: ui.value.prev({ class: unref(uiProp)?.prev })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "prev", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: __props.color,
                            variant: __props.variant,
                            size: __props.size,
                            icon: prevIcon.value,
                            to: page > 1 ? __props.to?.(page - 1) : void 0
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
                      return openBlock(), createBlock(Fragment, { key: index }, [
                        item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
                          key: 0,
                          "as-child": "",
                          value: item.value,
                          "data-slot": "item",
                          class: ui.value.item({ class: unref(uiProp)?.item })
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                              createVNode(_sfc_main$8, {
                                color: page === item.value ? __props.activeColor : __props.color,
                                variant: page === item.value ? __props.activeVariant : __props.variant,
                                size: __props.size,
                                label: String(item.value),
                                ui: { label: ui.value.label() },
                                to: __props.to?.(item.value),
                                square: ""
                              }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
                          key: 1,
                          "as-child": "",
                          "data-slot": "ellipsis",
                          class: ui.value.ellipsis({ class: unref(uiProp)?.ellipsis })
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                              createVNode(_sfc_main$8, {
                                as: "div",
                                color: __props.color,
                                variant: __props.variant,
                                size: __props.size,
                                icon: __props.ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                              }, null, 8, ["color", "variant", "size", "icon"])
                            ])
                          ]),
                          _: 3
                        }, 8, ["class"]))
                      ], 64);
                    }), 128)),
                    __props.showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
                      key: 2,
                      "as-child": "",
                      "data-slot": "next",
                      class: ui.value.next({ class: unref(uiProp)?.next })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "next", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: __props.color,
                            variant: __props.variant,
                            size: __props.size,
                            icon: nextIcon.value,
                            to: page < pageCount ? __props.to?.(page + 1) : void 0
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true),
                    __props.showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
                      key: 3,
                      "as-child": "",
                      "data-slot": "last",
                      class: ui.value.last({ class: unref(uiProp)?.last })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "last", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: __props.color,
                            variant: __props.variant,
                            size: __props.size,
                            icon: lastIcon.value,
                            to: __props.to?.(pageCount)
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(PaginationList_default), {
                "data-slot": "list",
                class: ui.value.list({ class: unref(uiProp)?.list })
              }, {
                default: withCtx(({ items }) => [
                  __props.showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
                    key: 0,
                    "as-child": "",
                    "data-slot": "first",
                    class: ui.value.first({ class: unref(uiProp)?.first })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "first", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: __props.color,
                          variant: __props.variant,
                          size: __props.size,
                          icon: firstIcon.value,
                          to: __props.to?.(1)
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 3
                  }, 8, ["class"])) : createCommentVNode("", true),
                  __props.showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
                    key: 1,
                    "as-child": "",
                    "data-slot": "prev",
                    class: ui.value.prev({ class: unref(uiProp)?.prev })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "prev", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: __props.color,
                          variant: __props.variant,
                          size: __props.size,
                          icon: prevIcon.value,
                          to: page > 1 ? __props.to?.(page - 1) : void 0
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
                    return openBlock(), createBlock(Fragment, { key: index }, [
                      item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
                        key: 0,
                        "as-child": "",
                        value: item.value,
                        "data-slot": "item",
                        class: ui.value.item({ class: unref(uiProp)?.item })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                            createVNode(_sfc_main$8, {
                              color: page === item.value ? __props.activeColor : __props.color,
                              variant: page === item.value ? __props.activeVariant : __props.variant,
                              size: __props.size,
                              label: String(item.value),
                              ui: { label: ui.value.label() },
                              to: __props.to?.(item.value),
                              square: ""
                            }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
                        key: 1,
                        "as-child": "",
                        "data-slot": "ellipsis",
                        class: ui.value.ellipsis({ class: unref(uiProp)?.ellipsis })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                            createVNode(_sfc_main$8, {
                              as: "div",
                              color: __props.color,
                              variant: __props.variant,
                              size: __props.size,
                              icon: __props.ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                            }, null, 8, ["color", "variant", "size", "icon"])
                          ])
                        ]),
                        _: 3
                      }, 8, ["class"]))
                    ], 64);
                  }), 128)),
                  __props.showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
                    key: 2,
                    "as-child": "",
                    "data-slot": "next",
                    class: ui.value.next({ class: unref(uiProp)?.next })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "next", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: __props.color,
                          variant: __props.variant,
                          size: __props.size,
                          icon: nextIcon.value,
                          to: page < pageCount ? __props.to?.(page + 1) : void 0
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true),
                  __props.showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
                    key: 3,
                    "as-child": "",
                    "data-slot": "last",
                    class: ui.value.last({ class: unref(uiProp)?.last })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "last", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: __props.color,
                          variant: __props.variant,
                          size: __props.size,
                          icon: lastIcon.value,
                          to: __props.to?.(pageCount)
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1032, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const limit = 20;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const UBadge = _sfc_main$9;
    const UButton = _sfc_main$8;
    const UDropdownMenu = _sfc_main$2$1;
    const toast = useToast();
    const search = ref("");
    const statusFilter = ref("all");
    const customerTypeFilter = ref("all");
    const autoGeneratedFilter = ref("all");
    const page = ref(1);
    const total = ref(0);
    const isCreatePanelOpen = ref(false);
    const isSaving = ref(false);
    const newCustomer = reactive({
      customerCode: "",
      customerType: "individual",
      firstName: "",
      lastName: "",
      companyName: "",
      nip: "",
      email: "",
      phone: "",
      status: "active"
    });
    const columns = [
      { accessorKey: "displayName", header: "Klient" },
      { accessorKey: "email", header: "Kontakt" },
      { accessorKey: "customerType", header: "Typ" },
      { accessorKey: "source", header: "Źródło" },
      { accessorKey: "status", header: "Status" },
      { id: "actions", header: "" }
    ];
    const customerQuery = computed(() => ({
      q: search.value || void 0,
      status: statusFilter.value === "all" ? void 0 : statusFilter.value,
      customerType: customerTypeFilter.value === "all" ? void 0 : customerTypeFilter.value,
      autoGenerated: autoGeneratedFilter.value === "all" ? void 0 : autoGeneratedFilter.value,
      skip: (page.value - 1) * limit,
      limit
    }));
    const { data: customers, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/v1/customers",
      {
        query: customerQuery,
        onResponse({ response }) {
          const count = response.headers.get("x-total-count");
          if (count) total.value = parseInt(count, 10);
        }
      },
      "$44Quvx5_X3"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    function getRowItems(row) {
      return [[{
        type: "label",
        header: row.displayName
      }], [{
        label: "Otwórz dossier",
        icon: "i-lucide-folder-open",
        click: async () => {
          await navigateTo(`/customers/${row.id}`);
        }
      }, {
        label: "Edytuj klienta",
        icon: "i-lucide-pencil",
        click: async () => {
          await navigateTo(`/customers/${row.id}`);
        }
      }], [{
        label: "Usuń klienta",
        icon: "i-lucide-trash",
        color: "error",
        click: async () => {
          if (!confirm(`Czy na pewno chcesz usunąć klienta ${row.displayName}?`)) {
            return;
          }
          await $fetch(`/api/v1/customers/${row.id}`, { method: "DELETE" });
          toast.add({
            title: "Klient usunięty",
            description: `${row.displayName} został usunięty.`
          });
          await refresh();
        }
      }]];
    }
    const summaryStats = computed(() => {
      const rows = customers.value || [];
      return [
        { label: "Rekordy", value: rows.length, change: `${total.value || rows.length} łącznie` },
        { label: "Aktywni", value: rows.filter((row) => row.status === "active").length, change: "gotowi do obsługi" },
        { label: "Auto-import", value: rows.filter((row) => row.isAutoGenerated).length, change: "rekordy zewnętrzne" },
        { label: "Firmy", value: rows.filter((row) => row.customerType === "company").length, change: "B2B" }
      ];
    });
    const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / limit)));
    const statusItems = [
      { label: "Wszystkie", value: "all" },
      { label: "Aktywny", value: "active" },
      { label: "Zawieszony", value: "suspended" },
      { label: "Zakończony", value: "terminated" }
    ];
    const customerTypeItems = [
      { label: "Wszyscy", value: "all" },
      { label: "Indywidualny", value: "individual" },
      { label: "Firma", value: "company" }
    ];
    const sourceItems = [
      { label: "Wszystkie źródła", value: "all" },
      { label: "Auto-import", value: "true" },
      { label: "Manualne", value: "false" }
    ];
    const resetNewCustomer = () => {
      Object.assign(newCustomer, {
        customerCode: "",
        customerType: "individual",
        firstName: "",
        lastName: "",
        companyName: "",
        nip: "",
        email: "",
        phone: "",
        status: "active"
      });
    };
    const createCustomer = async () => {
      isSaving.value = true;
      try {
        await $fetch("/api/v1/customers", {
          method: "POST",
          body: {
            customerCode: newCustomer.customerCode,
            customerType: newCustomer.customerType,
            firstName: newCustomer.customerType === "individual" ? newCustomer.firstName : "",
            lastName: newCustomer.customerType === "individual" ? newCustomer.lastName : newCustomer.companyName || "",
            companyName: newCustomer.customerType === "company" ? newCustomer.companyName : null,
            nip: newCustomer.customerType === "company" ? newCustomer.nip || null : null,
            email: newCustomer.email || null,
            phone: newCustomer.phone || null,
            status: newCustomer.status
          }
        });
        toast.add({
          title: "Klient zapisany",
          description: "Nowy abonent został dodany do bazy."
        });
        resetNewCustomer();
        isCreatePanelOpen.value = false;
        await refresh();
      } finally {
        isSaving.value = false;
      }
    };
    const statusLabel = (status) => {
      switch (status) {
        case "active":
          return "Aktywny";
        case "suspended":
          return "Zawieszony";
        case "terminated":
          return "Zakończony";
        default:
          return status || "Nieznany";
      }
    };
    const statusColor = (status) => {
      switch (status) {
        case "active":
          return "success";
        case "suspended":
          return "warning";
        case "terminated":
          return "error";
        default:
          return "neutral";
      }
    };
    watch([search, statusFilter, customerTypeFilter, autoGeneratedFilter], () => {
      page.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDashboardPanel = _sfc_main$2;
      const _component_UDashboardNavbar = _sfc_main$1$1;
      const _component_UDashboardSidebarCollapse = _sfc_main$a;
      const _component_UCard = _sfc_main$3;
      const _component_UFormField = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      const _component_USelect = _sfc_main$6;
      const _component_UTable = _sfc_main$7;
      const _component_UPagination = _sfc_main$1;
      _push(ssrRenderComponent(_component_UDashboardPanel, mergeProps({ id: "customers" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDashboardNavbar, { title: "Abonenci" }, {
              leading: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UDashboardSidebarCollapse, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UDashboardSidebarCollapse)
                  ];
                }
              }),
              right: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UButton), {
                    icon: "i-lucide-user-plus",
                    color: "primary",
                    variant: unref(isCreatePanelOpen) ? "solid" : "subtle",
                    label: unref(isCreatePanelOpen) ? "Ukryj formularz" : "Nowy abonent",
                    onClick: ($event) => isCreatePanelOpen.value = !unref(isCreatePanelOpen)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UButton), {
                      icon: "i-lucide-user-plus",
                      color: "primary",
                      variant: unref(isCreatePanelOpen) ? "solid" : "subtle",
                      label: unref(isCreatePanelOpen) ? "Ukryj formularz" : "Nowy abonent",
                      onClick: ($event) => isCreatePanelOpen.value = !unref(isCreatePanelOpen)
                    }, null, 8, ["variant", "label", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDashboardNavbar, { title: "Abonenci" }, {
                leading: withCtx(() => [
                  createVNode(_component_UDashboardSidebarCollapse)
                ]),
                right: withCtx(() => [
                  createVNode(unref(UButton), {
                    icon: "i-lucide-user-plus",
                    color: "primary",
                    variant: unref(isCreatePanelOpen) ? "solid" : "subtle",
                    label: unref(isCreatePanelOpen) ? "Ukryj formularz" : "Nowy abonent",
                    onClick: ($event) => isCreatePanelOpen.value = !unref(isCreatePanelOpen)
                  }, null, 8, ["variant", "label", "onClick"])
                ]),
                _: 1
              })
            ];
          }
        }),
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-4 xl:grid-cols-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(summaryStats), (stat) => {
              _push2(ssrRenderComponent(_component_UCard, {
                key: stat.label,
                ui: { body: "p-4 sm:p-4" }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="text-sm text-muted"${_scopeId2}>${ssrInterpolate(stat.label)}</div><div class="mt-2 text-2xl font-semibold text-highlighted"${_scopeId2}>${ssrInterpolate(stat.value)}</div><div class="mt-1 text-xs text-muted"${_scopeId2}>${ssrInterpolate(stat.change)}</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "text-sm text-muted" }, toDisplayString(stat.label), 1),
                      createVNode("div", { class: "mt-2 text-2xl font-semibold text-highlighted" }, toDisplayString(stat.value), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(stat.change), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (unref(isCreatePanelOpen)) {
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-between gap-3"${_scopeId2}><div${_scopeId2}><h2 class="text-base font-semibold text-highlighted"${_scopeId2}>Nowy abonent</h2><p class="text-sm text-muted"${_scopeId2}>Szybkie dodanie klienta bez opuszczania listy.</p></div>`);
                    _push3(ssrRenderComponent(unref(UButton), {
                      color: "neutral",
                      variant: "ghost",
                      icon: "i-lucide-x",
                      onClick: ($event) => isCreatePanelOpen.value = false
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                        createVNode("div", null, [
                          createVNode("h2", { class: "text-base font-semibold text-highlighted" }, "Nowy abonent"),
                          createVNode("p", { class: "text-sm text-muted" }, "Szybkie dodanie klienta bez opuszczania listy.")
                        ]),
                        createVNode(unref(UButton), {
                          color: "neutral",
                          variant: "ghost",
                          icon: "i-lucide-x",
                          onClick: ($event) => isCreatePanelOpen.value = false
                        }, null, 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<form class="space-y-4"${_scopeId2}><div class="grid gap-3 xl:grid-cols-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "Kod klienta",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(newCustomer).customerCode,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).customerCode = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(newCustomer).customerCode,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).customerCode = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "Typ klienta",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelect, {
                            modelValue: unref(newCustomer).customerType,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).customerType = $event,
                            items: customerTypeItems.slice(1)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelect, {
                              modelValue: unref(newCustomer).customerType,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).customerType = $event,
                              items: customerTypeItems.slice(1)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, { label: "Email" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(newCustomer).email,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).email = $event,
                            type: "email"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(newCustomer).email,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).email = $event,
                              type: "email"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, { label: "Telefon" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(newCustomer).phone,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).phone = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(newCustomer).phone,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).phone = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    if (unref(newCustomer).customerType === "individual") {
                      _push3(`<div class="grid gap-3 xl:grid-cols-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UFormField, {
                        label: "Imię",
                        required: ""
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              modelValue: unref(newCustomer).firstName,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).firstName = $event
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).firstName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).firstName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_UFormField, {
                        label: "Nazwisko",
                        required: ""
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              modelValue: unref(newCustomer).lastName,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).lastName = $event
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).lastName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).lastName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<div class="grid gap-3 xl:grid-cols-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UFormField, {
                        label: "Nazwa firmy",
                        required: ""
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              modelValue: unref(newCustomer).companyName,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).companyName = $event
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).companyName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).companyName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_UFormField, { label: "NIP" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              modelValue: unref(newCustomer).nip,
                              "onUpdate:modelValue": ($event) => unref(newCustomer).nip = $event
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).nip,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).nip = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                    _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(UButton), {
                      color: "neutral",
                      variant: "outline",
                      label: "Resetuj",
                      onClick: resetNewCustomer
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(UButton), {
                      type: "submit",
                      color: "primary",
                      label: "Zapisz",
                      loading: unref(isSaving)
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></form>`);
                  } else {
                    return [
                      createVNode("form", {
                        onSubmit: withModifiers(createCustomer, ["prevent"]),
                        class: "space-y-4"
                      }, [
                        createVNode("div", { class: "grid gap-3 xl:grid-cols-4" }, [
                          createVNode(_component_UFormField, {
                            label: "Kod klienta",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).customerCode,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).customerCode = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Typ klienta",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(newCustomer).customerType,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).customerType = $event,
                                items: customerTypeItems.slice(1)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, { label: "Email" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).email,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).email = $event,
                                type: "email"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, { label: "Telefon" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).phone,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).phone = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        unref(newCustomer).customerType === "individual" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-3 xl:grid-cols-2"
                        }, [
                          createVNode(_component_UFormField, {
                            label: "Imię",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).firstName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).firstName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, {
                            label: "Nazwisko",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).lastName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).lastName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "grid gap-3 xl:grid-cols-2"
                        }, [
                          createVNode(_component_UFormField, {
                            label: "Nazwa firmy",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).companyName,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).companyName = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormField, { label: "NIP" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(newCustomer).nip,
                                "onUpdate:modelValue": ($event) => unref(newCustomer).nip = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ])),
                        createVNode("div", { class: "flex justify-end gap-2" }, [
                          createVNode(unref(UButton), {
                            color: "neutral",
                            variant: "outline",
                            label: "Resetuj",
                            onClick: resetNewCustomer
                          }),
                          createVNode(unref(UButton), {
                            type: "submit",
                            color: "primary",
                            label: "Zapisz",
                            loading: unref(isSaving)
                          }, null, 8, ["loading"])
                        ])
                      ], 32)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-wrap items-center justify-between gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(search),
              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
              class: "max-w-sm",
              icon: "i-lucide-search",
              placeholder: "Szukaj po nazwie, kodzie, emailu..."
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-wrap items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(statusFilter),
              "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
              items: statusItems,
              class: "min-w-32"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(customerTypeFilter),
              "onUpdate:modelValue": ($event) => isRef(customerTypeFilter) ? customerTypeFilter.value = $event : null,
              items: customerTypeItems,
              class: "min-w-36"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(autoGeneratedFilter),
              "onUpdate:modelValue": ($event) => isRef(autoGeneratedFilter) ? autoGeneratedFilter.value = $event : null,
              items: sourceItems,
              class: "min-w-40"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(UButton), {
              label: "Grupy klientów",
              color: "neutral",
              variant: "outline",
              "trailing-icon": "i-lucide-users",
              to: "/customers/groups"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(customers) || [],
              columns,
              loading: unref(pending),
              class: "shrink-0",
              ui: {
                base: "table-fixed border-separate border-spacing-0",
                thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                tbody: "[&>tr]:last:[&>td]:border-b-0",
                th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                td: "border-b border-default align-top",
                separator: "h-0"
              }
            }, {
              "displayName-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="min-w-[16rem]"${_scopeId2}><div class="font-medium text-highlighted"${_scopeId2}>${ssrInterpolate(row.displayName)}</div><div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(row.customerCode)}</span><span${_scopeId2}>•</span><span${_scopeId2}>${ssrInterpolate(row.phone || "brak telefonu")}</span></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "min-w-[16rem]" }, [
                      createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.displayName), 1),
                      createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted" }, [
                        createVNode("span", null, toDisplayString(row.customerCode), 1),
                        createVNode("span", null, "•"),
                        createVNode("span", null, toDisplayString(row.phone || "brak telefonu"), 1)
                      ])
                    ])
                  ];
                }
              }),
              "email-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}><div${_scopeId2}>${ssrInterpolate(row.email || "brak email")}</div><div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.groupCount)} grup</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", null, toDisplayString(row.email || "brak email"), 1),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.groupCount) + " grup", 1)
                    ])
                  ];
                }
              }),
              "customerType-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.customerType === "company" ? "primary" : "neutral",
                    variant: "subtle",
                    class: "capitalize"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.customerType === "company" ? "firma" : "indywidualny")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.customerType === "company" ? "firma" : "indywidualny"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: row.customerType === "company" ? "primary" : "neutral",
                      variant: "subtle",
                      class: "capitalize"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.customerType === "company" ? "firma" : "indywidualny"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "source-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: row.isAutoGenerated ? "warning" : "success",
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.isAutoGenerated ? "auto-import" : "manualny")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.isAutoGenerated ? "auto-import" : "manualny"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(row.autoImportSource || "operator")}</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode(unref(UBadge), {
                        color: row.isAutoGenerated ? "warning" : "success",
                        variant: "subtle"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.isAutoGenerated ? "auto-import" : "manualny"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]),
                      createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.autoImportSource || "operator"), 1)
                    ])
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UBadge), {
                    color: statusColor(row.status),
                    variant: "subtle"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(statusLabel(row.status))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(UBadge), {
                      color: statusColor(row.status),
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-right"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UDropdownMenu), {
                    items: getRowItems(row),
                    content: { align: "end" }
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(UButton), {
                          icon: "i-lucide-ellipsis-vertical",
                          color: "neutral",
                          variant: "ghost",
                          class: "ml-auto"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(UButton), {
                            icon: "i-lucide-ellipsis-vertical",
                            color: "neutral",
                            variant: "ghost",
                            class: "ml-auto"
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-right" }, [
                      createVNode(unref(UDropdownMenu), {
                        items: getRowItems(row),
                        content: { align: "end" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(UButton), {
                            icon: "i-lucide-ellipsis-vertical",
                            color: "neutral",
                            variant: "ghost",
                            class: "ml-auto"
                          })
                        ]),
                        _: 1
                      }, 8, ["items"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4"${_scopeId}><div class="text-sm text-muted"${_scopeId}> Strona ${ssrInterpolate(unref(page))} z ${ssrInterpolate(unref(totalPages))} · ${ssrInterpolate(unref(total) || unref(customers)?.length || 0)} rekordów </div>`);
            _push2(ssrRenderComponent(_component_UPagination, {
              page: unref(page),
              total: unref(total),
              "items-per-page": limit,
              "onUpdate:page": ($event) => page.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-4 xl:grid-cols-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(summaryStats), (stat) => {
                  return openBlock(), createBlock(_component_UCard, {
                    key: stat.label,
                    ui: { body: "p-4 sm:p-4" }
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "text-sm text-muted" }, toDisplayString(stat.label), 1),
                      createVNode("div", { class: "mt-2 text-2xl font-semibold text-highlighted" }, toDisplayString(stat.value), 1),
                      createVNode("div", { class: "mt-1 text-xs text-muted" }, toDisplayString(stat.change), 1)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              unref(isCreatePanelOpen) ? (openBlock(), createBlock(_component_UCard, { key: 0 }, {
                header: withCtx(() => [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-base font-semibold text-highlighted" }, "Nowy abonent"),
                      createVNode("p", { class: "text-sm text-muted" }, "Szybkie dodanie klienta bez opuszczania listy.")
                    ]),
                    createVNode(unref(UButton), {
                      color: "neutral",
                      variant: "ghost",
                      icon: "i-lucide-x",
                      onClick: ($event) => isCreatePanelOpen.value = false
                    }, null, 8, ["onClick"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(createCustomer, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "grid gap-3 xl:grid-cols-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Kod klienta",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).customerCode,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).customerCode = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Typ klienta",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(newCustomer).customerType,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).customerType = $event,
                            items: customerTypeItems.slice(1)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Email" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).email,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).email = $event,
                            type: "email"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Telefon" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).phone,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).phone = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    unref(newCustomer).customerType === "individual" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-3 xl:grid-cols-2"
                    }, [
                      createVNode(_component_UFormField, {
                        label: "Imię",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).firstName,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).firstName = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Nazwisko",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).lastName,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).lastName = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "grid gap-3 xl:grid-cols-2"
                    }, [
                      createVNode(_component_UFormField, {
                        label: "Nazwa firmy",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).companyName,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).companyName = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "NIP" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCustomer).nip,
                            "onUpdate:modelValue": ($event) => unref(newCustomer).nip = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(unref(UButton), {
                        color: "neutral",
                        variant: "outline",
                        label: "Resetuj",
                        onClick: resetNewCustomer
                      }),
                      createVNode(unref(UButton), {
                        type: "submit",
                        color: "primary",
                        label: "Zapisz",
                        loading: unref(isSaving)
                      }, null, 8, ["loading"])
                    ])
                  ], 32)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode("div", { class: "flex flex-wrap items-center justify-between gap-2" }, [
                createVNode(_component_UInput, {
                  modelValue: unref(search),
                  "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                  class: "max-w-sm",
                  icon: "i-lucide-search",
                  placeholder: "Szukaj po nazwie, kodzie, emailu..."
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                  createVNode(_component_USelect, {
                    modelValue: unref(statusFilter),
                    "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
                    items: statusItems,
                    class: "min-w-32"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelect, {
                    modelValue: unref(customerTypeFilter),
                    "onUpdate:modelValue": ($event) => isRef(customerTypeFilter) ? customerTypeFilter.value = $event : null,
                    items: customerTypeItems,
                    class: "min-w-36"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_USelect, {
                    modelValue: unref(autoGeneratedFilter),
                    "onUpdate:modelValue": ($event) => isRef(autoGeneratedFilter) ? autoGeneratedFilter.value = $event : null,
                    items: sourceItems,
                    class: "min-w-40"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(UButton), {
                    label: "Grupy klientów",
                    color: "neutral",
                    variant: "outline",
                    "trailing-icon": "i-lucide-users",
                    to: "/customers/groups"
                  })
                ])
              ]),
              createVNode(_component_UTable, {
                data: unref(customers) || [],
                columns,
                loading: unref(pending),
                class: "shrink-0",
                ui: {
                  base: "table-fixed border-separate border-spacing-0",
                  thead: "[&>tr]:bg-elevated/50 [&>tr]:after:content-none",
                  tbody: "[&>tr]:last:[&>td]:border-b-0",
                  th: "py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r",
                  td: "border-b border-default align-top",
                  separator: "h-0"
                }
              }, {
                "displayName-data": withCtx(({ row }) => [
                  createVNode("div", { class: "min-w-[16rem]" }, [
                    createVNode("div", { class: "font-medium text-highlighted" }, toDisplayString(row.displayName), 1),
                    createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted" }, [
                      createVNode("span", null, toDisplayString(row.customerCode), 1),
                      createVNode("span", null, "•"),
                      createVNode("span", null, toDisplayString(row.phone || "brak telefonu"), 1)
                    ])
                  ])
                ]),
                "email-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", null, toDisplayString(row.email || "brak email"), 1),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.groupCount) + " grup", 1)
                  ])
                ]),
                "customerType-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: row.customerType === "company" ? "primary" : "neutral",
                    variant: "subtle",
                    class: "capitalize"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.customerType === "company" ? "firma" : "indywidualny"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "source-data": withCtx(({ row }) => [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode(unref(UBadge), {
                      color: row.isAutoGenerated ? "warning" : "success",
                      variant: "subtle"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.isAutoGenerated ? "auto-import" : "manualny"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(row.autoImportSource || "operator"), 1)
                  ])
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode(unref(UBadge), {
                    color: statusColor(row.status),
                    variant: "subtle"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(statusLabel(row.status)), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "text-right" }, [
                    createVNode(unref(UDropdownMenu), {
                      items: getRowItems(row),
                      content: { align: "end" }
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(UButton), {
                          icon: "i-lucide-ellipsis-vertical",
                          color: "neutral",
                          variant: "ghost",
                          class: "ml-auto"
                        })
                      ]),
                      _: 1
                    }, 8, ["items"])
                  ])
                ]),
                _: 1
              }, 8, ["data", "loading"]),
              createVNode("div", { class: "mt-auto flex items-center justify-between gap-3 border-t border-default pt-4" }, [
                createVNode("div", { class: "text-sm text-muted" }, " Strona " + toDisplayString(unref(page)) + " z " + toDisplayString(unref(totalPages)) + " · " + toDisplayString(unref(total) || unref(customers)?.length || 0) + " rekordów ", 1),
                createVNode(_component_UPagination, {
                  page: unref(page),
                  total: unref(total),
                  "items-per-page": limit,
                  "onUpdate:page": ($event) => page.value = $event
                }, null, 8, ["page", "total", "onUpdate:page"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/customers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BFQJIvU5.mjs.map
