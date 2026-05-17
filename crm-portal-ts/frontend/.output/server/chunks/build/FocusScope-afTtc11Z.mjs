import { Q as injectConfigProviderContext, q as useForwardExpose, B as isNullish, P as Primitive, R as getActiveElement, a9 as AUTOFOCUS_ON_MOUNT, aa as focusFirst, ab as getTabbableCandidates, ac as focus, ad as AUTOFOCUS_ON_UNMOUNT, ae as EVENT_OPTIONS, af as getTabbableEdges } from './server.mjs';
import * as vue from 'vue';
import { defineComponent, computed, watchEffect, openBlock, createBlock, unref, normalizeStyle, withCtx, renderSlot, watch, reactive, ref, toValue, nextTick } from 'vue';
import { onKeyStroke, unrefElement, createSharedComposable, useEventListener, createGlobalState } from '@vueuse/core';
import { tryOnBeforeUnmount, isClient, isIOS } from '@vueuse/shared';
import { x as defu } from '../_/nitro.mjs';
import { hideOthers } from 'aria-hidden';

function handleAndDispatchCustomEvent(name, handler, detail) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, {
    bubbles: false,
    cancelable: true,
    detail
  });
  if (handler) target.addEventListener(name, handler, { once: true });
  target.dispatchEvent(event);
}
const useBodyLockStackCount = createSharedComposable(() => {
  const map = ref(/* @__PURE__ */ new Map());
  const initialOverflow = ref();
  const locked = computed(() => {
    for (const value of map.value.values()) if (value) return true;
    return false;
  });
  const context2 = injectConfigProviderContext({ scrollBody: ref(true) });
  let stopTouchMoveListener = null;
  const resetBodyStyle = () => {
    (void 0).body.style.paddingRight = "";
    (void 0).body.style.marginRight = "";
    (void 0).body.style.pointerEvents = "";
    (void 0).documentElement.style.removeProperty("--scrollbar-width");
    (void 0).body.style.overflow = initialOverflow.value ?? "";
    isIOS && stopTouchMoveListener?.();
    initialOverflow.value = void 0;
  };
  watch(locked, (val, oldVal) => {
    if (!isClient) return;
    if (!val) {
      if (oldVal) resetBodyStyle();
      return;
    }
    if (initialOverflow.value === void 0) initialOverflow.value = (void 0).body.style.overflow;
    const verticalScrollbarWidth = (void 0).innerWidth - (void 0).documentElement.clientWidth;
    const defaultConfig = {
      padding: verticalScrollbarWidth,
      margin: 0
    };
    const config = context2.scrollBody?.value ? typeof context2.scrollBody.value === "object" ? defu({
      padding: context2.scrollBody.value.padding === true ? verticalScrollbarWidth : context2.scrollBody.value.padding,
      margin: context2.scrollBody.value.margin === true ? verticalScrollbarWidth : context2.scrollBody.value.margin
    }, defaultConfig) : defaultConfig : {
      padding: 0,
      margin: 0
    };
    if (verticalScrollbarWidth > 0) {
      (void 0).body.style.paddingRight = typeof config.padding === "number" ? `${config.padding}px` : String(config.padding);
      (void 0).body.style.marginRight = typeof config.margin === "number" ? `${config.margin}px` : String(config.margin);
      (void 0).documentElement.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
      (void 0).body.style.overflow = "hidden";
    }
    if (isIOS) stopTouchMoveListener = useEventListener(void 0, "touchmove", (e) => preventDefault(e), { passive: false });
    nextTick(() => {
      if (!locked.value) return;
      (void 0).body.style.pointerEvents = "none";
      (void 0).body.style.overflow = "hidden";
    });
  }, {
    immediate: true,
    flush: "sync"
  });
  return map;
});
function useBodyScrollLock(initialState) {
  const id = Math.random().toString(36).substring(2, 7);
  const map = useBodyLockStackCount();
  map.value.set(id, initialState ?? false);
  const locked = computed({
    get: () => map.value.get(id) ?? false,
    set: (value) => map.value.set(id, value)
  });
  tryOnBeforeUnmount(() => {
    map.value.delete(id);
  });
  return locked;
}
function checkOverflowScroll(ele) {
  const style = (void 0).getComputedStyle(ele);
  if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) return true;
  else {
    const parent = ele.parentNode;
    if (!(parent instanceof Element) || parent.tagName === "BODY") return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e = rawEvent || (void 0).event;
  const _target = e.target;
  if (_target instanceof Element && checkOverflowScroll(_target)) return false;
  if (e.touches.length > 1) return true;
  if (e.preventDefault && e.cancelable) e.preventDefault();
  return false;
}
function useHideOthers(target) {
  let undo;
  watch(() => unrefElement(target), (el) => {
    let isInsideClosedPopover = false;
    try {
      isInsideClosedPopover = !!el?.closest("[popover]:not(:popover-open)");
    } catch {
    }
    if (el && !isInsideClosedPopover) undo = hideOthers(el);
    else if (undo) undo();
  });
}
let count = 0;
function useId(deterministicId, prefix = "reka") {
  if (deterministicId) return deterministicId;
  let id;
  if ("useId" in vue) id = vue.useId?.();
  else {
    const configProviderContext = injectConfigProviderContext({ useId: void 0 });
    id = configProviderContext.useId?.() ?? `${++count}`;
  }
  return prefix ? `${prefix}-${id}` : id;
}
const POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
const FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
function isLayerExist(layerElement, targetElement) {
  if (!(targetElement instanceof Element)) return false;
  const targetLayer = targetElement.closest("[data-dismissable-layer]");
  const mainLayer = layerElement.dataset.dismissableLayer === "" ? layerElement : layerElement.querySelector("[data-dismissable-layer]");
  const nodeList = Array.from(layerElement.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  if (targetLayer && (mainLayer === targetLayer || nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer))) return true;
  else return false;
}
function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
  const ownerDocument = element?.value?.ownerDocument ?? globalThis?.document;
  const isPointerInsideDOMTree = ref(false);
  const handleClickRef = ref(() => {
  });
  watchEffect((cleanupFn) => {
    if (!isClient || !toValue(enabled)) return;
    const handlePointerDown = async (event) => {
      const target = event.target;
      if (!element?.value || !target) return;
      if (isLayerExist(element.value, target)) {
        isPointerInsideDOMTree.value = false;
        return;
      }
      if (event.target && !isPointerInsideDOMTree.value) {
        let handleAndDispatchPointerDownOutsideEvent = function() {
          handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, onPointerDownOutside, eventDetail);
        };
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.value);
          handleClickRef.value = handleAndDispatchPointerDownOutsideEvent;
          ownerDocument.addEventListener("click", handleClickRef.value, { once: true });
        } else handleAndDispatchPointerDownOutsideEvent();
      } else ownerDocument.removeEventListener("click", handleClickRef.value);
      isPointerInsideDOMTree.value = false;
    };
    const timerId = (void 0).setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    cleanupFn(() => {
      (void 0).clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.value);
    });
  });
  return { onPointerDownCapture: () => {
    if (!toValue(enabled)) return;
    isPointerInsideDOMTree.value = true;
  } };
}
function useFocusOutside(onFocusOutside, element, enabled = true) {
  const ownerDocument = element?.value?.ownerDocument ?? globalThis?.document;
  const isFocusInsideDOMTree = ref(false);
  watchEffect((cleanupFn) => {
    if (!isClient || !toValue(enabled)) return;
    const handleFocus = async (event) => {
      if (!element?.value) return;
      await nextTick();
      await nextTick();
      const target = event.target;
      if (!element.value || !target || isLayerExist(element.value, target)) return;
      if (event.target && !isFocusInsideDOMTree.value) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, onFocusOutside, eventDetail);
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    cleanupFn(() => ownerDocument.removeEventListener("focusin", handleFocus));
  });
  return {
    onFocusCapture: () => {
      if (!toValue(enabled)) return;
      isFocusInsideDOMTree.value = true;
    },
    onBlurCapture: () => {
      if (!toValue(enabled)) return;
      isFocusInsideDOMTree.value = false;
    }
  };
}
const context = /* @__PURE__ */ reactive({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: {
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
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "dismiss"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement: layerElement } = useForwardExpose();
    const ownerDocument = computed(() => layerElement.value?.ownerDocument ?? globalThis.document);
    const layers = computed(() => context.layersRoot);
    const index = computed(() => {
      return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1;
    });
    const isBodyPointerEventsDisabled = computed(() => {
      return context.layersWithOutsidePointerEventsDisabled.size > 0;
    });
    const isPointerEventsEnabled = computed(() => {
      const localLayers = Array.from(layers.value);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
    });
    const pointerDownOutside = usePointerDownOutside(async (event) => {
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch?.contains(event.target));
      if (!isPointerEventsEnabled.value || isPointerDownOnBranch) return;
      emits("pointerDownOutside", event);
      emits("interactOutside", event);
      await nextTick();
      if (!event.defaultPrevented) emits("dismiss");
    }, layerElement);
    const focusOutside = useFocusOutside((event) => {
      const isFocusInBranch = [...context.branches].some((branch) => branch?.contains(event.target));
      if (isFocusInBranch) return;
      emits("focusOutside", event);
      emits("interactOutside", event);
      if (!event.defaultPrevented) emits("dismiss");
    }, layerElement);
    onKeyStroke("Escape", (event) => {
      const isHighestLayer = index.value === layers.value.size - 1;
      if (!isHighestLayer) return;
      emits("escapeKeyDown", event);
      if (!event.defaultPrevented) emits("dismiss");
    });
    watchEffect((cleanupFn) => {
      if (!layerElement.value) return;
      if (props.disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          context.originalBodyPointerEvents = ownerDocument.value.body.style.pointerEvents;
          ownerDocument.value.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(layerElement.value);
      }
      layers.value.add(layerElement.value);
      cleanupFn(() => {
        if (props.disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1 && !isNullish(context.originalBodyPointerEvents)) ownerDocument.value.body.style.pointerEvents = context.originalBodyPointerEvents;
      });
    });
    watchEffect((cleanupFn) => {
      cleanupFn(() => {
        if (!layerElement.value) return;
        layers.value.delete(layerElement.value);
        context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value);
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref: unref(forwardRef),
        "as-child": _ctx.asChild,
        as: _ctx.as,
        "data-dismissable-layer": "",
        style: normalizeStyle({ pointerEvents: isBodyPointerEventsDisabled.value ? isPointerEventsEnabled.value ? "auto" : "none" : void 0 }),
        onFocusCapture: unref(focusOutside).onFocusCapture,
        onBlurCapture: unref(focusOutside).onBlurCapture,
        onPointerdownCapture: unref(pointerDownOutside).onPointerDownCapture
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as-child",
        "as",
        "style",
        "onFocusCapture",
        "onBlurCapture",
        "onPointerdownCapture"
      ]);
    };
  }
});
var DismissableLayer_default = DismissableLayer_vue_vue_type_script_setup_true_lang_default;
const useFocusStackState = createGlobalState(() => {
  const stack = ref([]);
  return stack;
});
function createFocusScopesStack() {
  const stack = useFocusStackState();
  return {
    add(focusScope) {
      const activeFocusScope = stack.value[0];
      if (focusScope !== activeFocusScope) activeFocusScope?.pause();
      stack.value = arrayRemove(stack.value, focusScope);
      stack.value.unshift(focusScope);
    },
    remove(focusScope) {
      stack.value = arrayRemove(stack.value, focusScope);
      stack.value[0]?.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) updatedArray.splice(index, 1);
  return updatedArray;
}
var FocusScope_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "FocusScope",
  props: {
    loop: {
      type: Boolean,
      required: false,
      default: false
    },
    trapped: {
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
      required: false
    }
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { currentRef, currentElement } = useForwardExpose();
    const lastFocusedElementRef = ref(null);
    const focusScopesStack = createFocusScopesStack();
    const focusScope = /* @__PURE__ */ reactive({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    });
    watchEffect((cleanupFn) => {
      if (!isClient) return;
      const container = currentElement.value;
      if (!props.trapped) return;
      function handleFocusIn(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) lastFocusedElementRef.value = target;
        else focus(lastFocusedElementRef.value, { select: true });
      }
      function handleFocusOut(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.value, { select: true });
      }
      function handleMutations(mutations) {
        const lastFocusedElement = lastFocusedElementRef.value;
        if (lastFocusedElement === null) return;
        const anyNodesRemoved = mutations.some((m) => m.removedNodes.length > 0);
        if (!anyNodesRemoved) return;
        const isLastFocusedElementExist = container.contains(lastFocusedElement);
        if (!isLastFocusedElementExist) focus(container);
      }
      (void 0).addEventListener("focusin", handleFocusIn);
      (void 0).addEventListener("focusout", handleFocusOut);
      const mutationObserver = new MutationObserver(handleMutations);
      if (container) mutationObserver.observe(container, {
        childList: true,
        subtree: true
      });
      cleanupFn(() => {
        (void 0).removeEventListener("focusin", handleFocusIn);
        (void 0).removeEventListener("focusout", handleFocusOut);
        mutationObserver.disconnect();
      });
    });
    watchEffect(async (cleanupFn) => {
      const container = currentElement.value;
      await nextTick();
      if (!container) return;
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = getActiveElement();
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(getTabbableCandidates(container), { select: true });
          if (getActiveElement() === previouslyFocusedElement) focus(container);
        }
      }
      cleanupFn(() => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
        const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
        const unmountEventHandler = (ev) => {
          emits("unmountAutoFocus", ev);
        };
        container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
        container.dispatchEvent(unmountEvent);
        setTimeout(() => {
          if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? (void 0).body, { select: true });
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
          focusScopesStack.remove(focusScope);
        }, 0);
      });
    });
    function handleKeyDown(event) {
      if (!props.loop && !props.trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = getActiveElement();
      if (isTabKey && focusedElement) {
        const container = event.currentTarget;
        const [first, last] = getTabbableEdges(container);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault();
        } else if (!event.shiftKey && focusedElement === last) {
          event.preventDefault();
          if (props.loop) focus(first, { select: true });
        } else if (event.shiftKey && focusedElement === first) {
          event.preventDefault();
          if (props.loop) focus(last, { select: true });
        }
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "currentRef",
        ref: currentRef,
        tabindex: "-1",
        "as-child": _ctx.asChild,
        as: _ctx.as,
        onKeydown: handleKeyDown
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var FocusScope_default = FocusScope_vue_vue_type_script_setup_true_lang_default;

export { DismissableLayer_default as D, FocusScope_default as F, useBodyScrollLock as a, useHideOthers as b, handleAndDispatchCustomEvent as h, useId as u };
//# sourceMappingURL=FocusScope-afTtc11Z.mjs.map
