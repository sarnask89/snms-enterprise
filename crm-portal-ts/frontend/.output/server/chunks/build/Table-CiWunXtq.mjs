import { useSlots, computed, useModel, useTemplateRef, toRef, watch, unref, withCtx, mergeProps, createVNode, openBlock, createBlock, Fragment, renderList, renderSlot, createCommentVNode, createTextVNode, toDisplayString, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { s as useLocale, h as useAppConfig, i as useComponentUI, t as tv, w as useForwardProps, P as Primitive } from './server.mjs';
import { N as upperFirst, x as defu } from '../_/nitro.mjs';
import { useVueTable, getExpandedRowModel, getSortedRowModel, getFilteredRowModel, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { createRef, createReusableTemplate, reactivePick } from '@vueuse/core';

const theme = {
  "slots": {
    "root": "relative overflow-auto",
    "base": "min-w-full overflow-clip",
    "caption": "sr-only",
    "thead": "relative",
    "tbody": "isolate [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary divide-y divide-default",
    "tfoot": "relative",
    "tr": "data-[selected=true]:bg-elevated/50",
    "th": "px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0",
    "td": "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    "separator": "absolute z-1 left-0 w-full h-px bg-(--ui-border-accented)",
    "empty": "py-6 text-center text-sm text-muted",
    "loading": "py-6 text-center"
  },
  "variants": {
    "pinned": {
      "true": {
        "th": "sticky bg-default/75 z-1",
        "td": "sticky bg-default/75 z-1"
      }
    },
    "sticky": {
      "true": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1",
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      "header": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      "footer": {
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      }
    },
    "loading": {
      "true": {
        "thead": "after:absolute after:z-1 after:h-px"
      }
    },
    "loadingAnimation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "loadingColor": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    }
  },
  "compoundVariants": [
    {
      "loading": true,
      "loadingColor": "primary",
      "class": {
        "thead": "after:bg-primary"
      }
    },
    {
      "loading": true,
      "loadingColor": "secondary",
      "class": {
        "thead": "after:bg-secondary"
      }
    },
    {
      "loading": true,
      "loadingColor": "success",
      "class": {
        "thead": "after:bg-success"
      }
    },
    {
      "loading": true,
      "loadingColor": "info",
      "class": {
        "thead": "after:bg-info"
      }
    },
    {
      "loading": true,
      "loadingColor": "warning",
      "class": {
        "thead": "after:bg-warning"
      }
    },
    {
      "loading": true,
      "loadingColor": "error",
      "class": {
        "thead": "after:bg-error"
      }
    },
    {
      "loading": true,
      "loadingColor": "neutral",
      "class": {
        "thead": "after:bg-inverted"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel",
      "class": {
        "thead": "after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel-inverse",
      "class": {
        "thead": "after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "swing",
      "class": {
        "thead": "after:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "elastic",
      "class": {
        "thead": "after:animate-[elastic_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "loadingColor": "primary",
    "loadingAnimation": "carousel"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UTable",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    data: { type: Array, required: false },
    columns: { type: Array, required: false },
    caption: { type: String, required: false },
    meta: { type: Object, required: false },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    empty: { type: String, required: false },
    sticky: { type: [Boolean, String], required: false },
    loading: { type: Boolean, required: false },
    loadingColor: { type: null, required: false },
    loadingAnimation: { type: null, required: false },
    watchOptions: { type: Object, required: false, default: () => ({
      deep: true
    }) },
    globalFilterOptions: { type: Object, required: false },
    columnFiltersOptions: { type: Object, required: false },
    columnPinningOptions: { type: Object, required: false },
    columnSizingOptions: { type: Object, required: false },
    visibilityOptions: { type: Object, required: false },
    sortingOptions: { type: Object, required: false },
    groupingOptions: { type: Object, required: false },
    expandedOptions: { type: Object, required: false },
    rowSelectionOptions: { type: Object, required: false },
    rowPinningOptions: { type: Object, required: false },
    paginationOptions: { type: Object, required: false },
    facetedOptions: { type: Object, required: false },
    onSelect: { type: Function, required: false },
    onHover: { type: Function, required: false },
    onContextmenu: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    state: { type: Object, required: false },
    onStateChange: { type: Function, required: false },
    renderFallbackValue: { type: null, required: false },
    _features: { type: Array, required: false },
    autoResetAll: { type: Boolean, required: false },
    debugAll: { type: Boolean, required: false },
    debugCells: { type: Boolean, required: false },
    debugColumns: { type: Boolean, required: false },
    debugHeaders: { type: Boolean, required: false },
    debugRows: { type: Boolean, required: false },
    debugTable: { type: Boolean, required: false },
    defaultColumn: { type: Object, required: false },
    getRowId: { type: Function, required: false },
    getSubRows: { type: Function, required: false },
    initialState: { type: Object, required: false },
    mergeOptions: { type: Function, required: false }
  }, {
    "globalFilter": { type: String },
    "globalFilterModifiers": {},
    "columnFilters": { type: Array },
    "columnFiltersModifiers": {},
    "columnOrder": { type: Array },
    "columnOrderModifiers": {},
    "columnVisibility": { type: Object },
    "columnVisibilityModifiers": {},
    "columnPinning": { type: Object },
    "columnPinningModifiers": {},
    "columnSizing": { type: Object },
    "columnSizingModifiers": {},
    "columnSizingInfo": { type: Object },
    "columnSizingInfoModifiers": {},
    "rowSelection": { type: Object },
    "rowSelectionModifiers": {},
    "rowPinning": { type: Object },
    "rowPinningModifiers": {},
    "sorting": { type: Array },
    "sortingModifiers": {},
    "grouping": { type: Array },
    "groupingModifiers": {},
    "expanded": { type: [Boolean, Object] },
    "expandedModifiers": {},
    "pagination": { type: Object },
    "paginationModifiers": {}
  }),
  emits: ["update:globalFilter", "update:columnFilters", "update:columnOrder", "update:columnVisibility", "update:columnPinning", "update:columnSizing", "update:columnSizingInfo", "update:rowSelection", "update:rowPinning", "update:sorting", "update:grouping", "update:expanded", "update:pagination"],
  setup(__props, { expose: __expose }) {
    const props = __props;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("table", props);
    const data = createRef(props.data ?? [], props.watchOptions?.deep !== false);
    const meta = computed(() => props.meta ?? {});
    const columns = computed(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey) => ({ accessorKey, header: upperFirst(accessorKey) }))));
    function processColumns(columns2) {
      return columns2.map((column) => {
        const col = { ...column };
        if ("columns" in col && col.columns) {
          col.columns = processColumns(col.columns);
        }
        if (!col.cell) {
          col.cell = ({ getValue }) => {
            const value = getValue();
            if (value === "" || value === null || value === void 0) {
              return " ";
            }
            return String(value);
          };
        }
        return col;
      });
    }
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.table || {} })({
      sticky: props.sticky,
      loading: props.loading,
      loadingColor: props.loadingColor,
      loadingAnimation: props.loadingAnimation
    }));
    const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate();
    const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate({
      props: {
        row: {
          type: Object,
          required: true
        },
        style: {
          type: Object,
          required: false
        }
      }
    });
    const hasFooter = computed(() => {
      function hasFooterRecursive(columns2) {
        for (const column of columns2) {
          if ("footer" in column) {
            return true;
          }
          if ("columns" in column && hasFooterRecursive(column.columns)) {
            return true;
          }
        }
        return false;
      }
      return hasFooterRecursive(columns.value);
    });
    const globalFilterState = useModel(__props, "globalFilter");
    const columnFiltersState = useModel(__props, "columnFilters");
    const columnOrderState = useModel(__props, "columnOrder");
    const columnVisibilityState = useModel(__props, "columnVisibility");
    const columnPinningState = useModel(__props, "columnPinning");
    const columnSizingState = useModel(__props, "columnSizing");
    const columnSizingInfoState = useModel(__props, "columnSizingInfo");
    const rowSelectionState = useModel(__props, "rowSelection");
    const rowPinningState = useModel(__props, "rowPinning");
    const sortingState = useModel(__props, "sorting");
    const groupingState = useModel(__props, "grouping");
    const expandedState = useModel(__props, "expanded");
    const paginationState = useModel(__props, "pagination");
    const rootRef = useTemplateRef("rootRef");
    const tableRef = useTemplateRef("tableRef");
    const tableProps = useForwardProps(reactivePick(props, "_features", "autoResetAll", "debugAll", "debugCells", "debugColumns", "debugHeaders", "debugRows", "debugTable", "defaultColumn", "getRowId", "getSubRows", "initialState", "mergeOptions", "renderFallbackValue"));
    const tableApi = useVueTable({
      ...tableProps.value,
      get data() {
        return data.value;
      },
      get columns() {
        return columns.value;
      },
      meta: meta.value,
      getCoreRowModel: getCoreRowModel(),
      ...props.globalFilterOptions || {},
      ...globalFilterState.value !== void 0 && { onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState) },
      ...props.columnFiltersOptions || {},
      getFilteredRowModel: getFilteredRowModel(),
      ...columnFiltersState.value !== void 0 && { onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState) },
      ...columnOrderState.value !== void 0 && { onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState) },
      ...props.visibilityOptions || {},
      ...columnVisibilityState.value !== void 0 && { onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState) },
      ...props.columnPinningOptions || {},
      ...columnPinningState.value !== void 0 && { onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState) },
      ...props.columnSizingOptions || {},
      ...columnSizingState.value !== void 0 && { onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState) },
      ...columnSizingInfoState.value !== void 0 && { onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState) },
      ...props.rowSelectionOptions || {},
      ...rowSelectionState.value !== void 0 && { onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState) },
      ...props.rowPinningOptions || {},
      ...rowPinningState.value !== void 0 && { onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState) },
      ...props.sortingOptions || {},
      getSortedRowModel: getSortedRowModel(),
      ...sortingState.value !== void 0 && { onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState) },
      ...props.groupingOptions || {},
      ...groupingState.value !== void 0 && { onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState) },
      ...props.expandedOptions || {},
      getExpandedRowModel: getExpandedRowModel(),
      ...expandedState.value !== void 0 && { onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState) },
      ...props.paginationOptions || {},
      ...paginationState.value !== void 0 && { onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState) },
      ...props.facetedOptions || {},
      state: {
        get globalFilter() {
          return globalFilterState.value;
        },
        get columnFilters() {
          return columnFiltersState.value;
        },
        get columnOrder() {
          return columnOrderState.value;
        },
        get columnVisibility() {
          return columnVisibilityState.value;
        },
        get columnPinning() {
          return columnPinningState.value;
        },
        get expanded() {
          return expandedState.value;
        },
        get rowSelection() {
          return rowSelectionState.value;
        },
        get sorting() {
          return sortingState.value;
        },
        get grouping() {
          return groupingState.value;
        },
        get rowPinning() {
          return rowPinningState.value;
        },
        get columnSizing() {
          return columnSizingState.value;
        },
        get columnSizingInfo() {
          return columnSizingInfoState.value;
        },
        get pagination() {
          return paginationState.value;
        }
      }
    });
    const rows = computed(() => tableApi.getRowModel().rows);
    const topRows = computed(() => props.virtualize ? [] : tableApi.getTopRows());
    const bottomRows = computed(() => props.virtualize ? [] : tableApi.getBottomRows());
    const centerRows = computed(() => topRows.value.length || bottomRows.value.length ? tableApi.getCenterRows() : rows.value);
    const virtualizerProps = toRef(() => defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
      estimateSize: 65,
      overscan: 12
    }));
    const virtualizer = !!props.virtualize && useVirtualizer({
      ...virtualizerProps.value,
      get count() {
        return centerRows.value.length;
      },
      getScrollElement: () => rootRef.value?.$el,
      estimateSize: (index) => {
        const estimate = virtualizerProps.value.estimateSize;
        return typeof estimate === "function" ? estimate(index) : estimate;
      }
    });
    const virtualItems = computed(() => virtualizer ? virtualizer.value.getVirtualItems() : []);
    const virtualPaddingTop = computed(() => virtualItems.value[0]?.start ?? 0);
    const virtualPaddingBottom = computed(() => {
      if (!virtualizer || !virtualItems.value.length) return 0;
      return virtualizer.value.getTotalSize() - (virtualItems.value[virtualItems.value.length - 1]?.end ?? 0);
    });
    function valueUpdater(updaterOrValue, ref) {
      ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
    }
    function onRowSelect(e, row) {
      if (!props.onSelect) {
        return;
      }
      const target = e.target;
      const isInteractive = target.closest("button") || target.closest("a");
      if (isInteractive) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      props.onSelect(e, row);
    }
    function onRowHover(e, row) {
      if (!props.onHover) {
        return;
      }
      props.onHover(e, row);
    }
    function onRowContextmenu(e, row) {
      if (!props.onContextmenu) {
        return;
      }
      if (Array.isArray(props.onContextmenu)) {
        props.onContextmenu.forEach((fn) => fn(e, row));
      } else {
        props.onContextmenu(e, row);
      }
    }
    function resolveValue(prop, arg) {
      if (typeof prop === "function") {
        return prop(arg);
      }
      return prop;
    }
    function getColumnStyles(column) {
      const styles = {};
      const pinned = column.getIsPinned();
      if (pinned === "left") {
        styles.left = `${column.getStart("left")}px`;
      } else if (pinned === "right") {
        styles.right = `${column.getAfter("right")}px`;
      }
      return styles;
    }
    watch(() => props.data, () => {
      data.value = props.data ? [...props.data] : [];
    }, props.watchOptions);
    __expose({
      get $el() {
        return rootRef.value?.$el;
      },
      tableRef,
      tableApi
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineRowTemplate), null, {
        default: withCtx(({ row, style }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<tr${ssrRenderAttr("data-selected", row.getIsSelected())}${ssrRenderAttr("data-selectable", !!props.onSelect || !!props.onHover || !!props.onContextmenu)}${ssrRenderAttr("data-expanded", row.getIsExpanded())}${ssrRenderAttr("data-pinned", row.getIsPinned() || void 0)}${ssrRenderAttr("role", props.onSelect ? "button" : void 0)}${ssrRenderAttr("tabindex", props.onSelect ? 0 : void 0)} data-slot="tr" class="${ssrRenderClass(ui.value.tr({
              class: [
                unref(uiProp)?.tr,
                resolveValue(unref(tableApi).options.meta?.class?.tr, row)
              ]
            }))}" style="${ssrRenderStyle([resolveValue(unref(tableApi).options.meta?.style?.tr, row), style])}"${_scopeId}><!--[-->`);
            ssrRenderList(row.getVisibleCells(), (cell) => {
              _push2(`<td${ssrRenderAttr("data-pinned", cell.column.getIsPinned())}${ssrRenderAttr("colspan", resolveValue(cell.column.columnDef.meta?.colspan?.td, cell))}${ssrRenderAttr("rowspan", resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell))} data-slot="td" class="${ssrRenderClass(ui.value.td({
                class: [
                  unref(uiProp)?.td,
                  resolveValue(cell.column.columnDef.meta?.class?.td, cell)
                ],
                pinned: !!cell.column.getIsPinned()
              }))}" style="${ssrRenderStyle([
                getColumnStyles(cell.column),
                resolveValue(cell.column.columnDef.meta?.style?.td, cell)
              ])}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => {
                _push2(ssrRenderComponent(unref(FlexRender), {
                  render: cell.column.columnDef.cell,
                  props: cell.getContext()
                }, null, _parent2, _scopeId));
              }, _push2, _parent2, _scopeId);
              _push2(`</td>`);
            });
            _push2(`<!--]--></tr>`);
            if (row.getIsExpanded()) {
              _push2(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(uiProp)?.tr] }))}"${_scopeId}><td${ssrRenderAttr("colspan", row.getAllCells().length)} data-slot="td" class="${ssrRenderClass(ui.value.td({ class: [unref(uiProp)?.td] }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "expanded", { row }, null, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("tr", {
                "data-selected": row.getIsSelected(),
                "data-selectable": !!props.onSelect || !!props.onHover || !!props.onContextmenu,
                "data-expanded": row.getIsExpanded(),
                "data-pinned": row.getIsPinned() || void 0,
                role: props.onSelect ? "button" : void 0,
                tabindex: props.onSelect ? 0 : void 0,
                "data-slot": "tr",
                class: ui.value.tr({
                  class: [
                    unref(uiProp)?.tr,
                    resolveValue(unref(tableApi).options.meta?.class?.tr, row)
                  ]
                }),
                style: [resolveValue(unref(tableApi).options.meta?.style?.tr, row), style],
                onClick: ($event) => onRowSelect($event, row),
                onPointerenter: ($event) => onRowHover($event, row),
                onPointerleave: ($event) => onRowHover($event, null),
                onContextmenu: ($event) => onRowContextmenu($event, row)
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
                  return openBlock(), createBlock("td", {
                    key: cell.id,
                    "data-pinned": cell.column.getIsPinned(),
                    colspan: resolveValue(cell.column.columnDef.meta?.colspan?.td, cell),
                    rowspan: resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell),
                    "data-slot": "td",
                    class: ui.value.td({
                      class: [
                        unref(uiProp)?.td,
                        resolveValue(cell.column.columnDef.meta?.class?.td, cell)
                      ],
                      pinned: !!cell.column.getIsPinned()
                    }),
                    style: [
                      getColumnStyles(cell.column),
                      resolveValue(cell.column.columnDef.meta?.style?.td, cell)
                    ]
                  }, [
                    renderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => [
                      createVNode(unref(FlexRender), {
                        render: cell.column.columnDef.cell,
                        props: cell.getContext()
                      }, null, 8, ["render", "props"])
                    ])
                  ], 14, ["data-pinned", "colspan", "rowspan"]);
                }), 128))
              ], 46, ["data-selected", "data-selectable", "data-expanded", "data-pinned", "role", "tabindex", "onClick", "onPointerenter", "onPointerleave", "onContextmenu"]),
              row.getIsExpanded() ? (openBlock(), createBlock("tr", {
                key: 0,
                "data-slot": "tr",
                class: ui.value.tr({ class: [unref(uiProp)?.tr] })
              }, [
                createVNode("td", {
                  colspan: row.getAllCells().length,
                  "data-slot": "td",
                  class: ui.value.td({ class: [unref(uiProp)?.td] })
                }, [
                  renderSlot(_ctx.$slots, "expanded", { row })
                ], 10, ["colspan"])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineTableTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table data-slot="base" class="${ssrRenderClass(ui.value.base({ class: [unref(uiProp)?.base] }))}"${_scopeId}>`);
            if (__props.caption || !!slots.caption) {
              _push2(`<caption data-slot="caption" class="${ssrRenderClass(ui.value.caption({ class: [unref(uiProp)?.caption] }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "caption", {}, () => {
                _push2(`${ssrInterpolate(__props.caption)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</caption>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<thead data-slot="thead" class="${ssrRenderClass(ui.value.thead({ class: [unref(uiProp)?.thead] }))}"${_scopeId}><!--[-->`);
            ssrRenderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
              _push2(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(uiProp)?.tr] }))}"${_scopeId}><!--[-->`);
              ssrRenderList(headerGroup.headers, (header) => {
                _push2(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("scope", header.colSpan > 1 ? "colgroup" : "col")}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${ssrRenderClass(ui.value.th({
                  class: [
                    unref(uiProp)?.th,
                    resolveValue(header.column.columnDef.meta?.class?.th, header)
                  ],
                  pinned: !!header.column.getIsPinned()
                }))}" style="${ssrRenderStyle([
                  getColumnStyles(header.column),
                  resolveValue(header.column.columnDef.meta?.style?.th, header)
                ])}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => {
                  if (!header.isPlaceholder) {
                    _push2(ssrRenderComponent(unref(FlexRender), {
                      render: header.column.columnDef.header,
                      props: header.getContext()
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                }, _push2, _parent2, _scopeId);
                _push2(`</th>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]--><tr data-slot="separator" class="${ssrRenderClass(ui.value.separator({ class: [unref(uiProp)?.separator] }))}"${_scopeId}></tr></thead><tbody data-slot="tbody" class="${ssrRenderClass(ui.value.tbody({ class: [unref(uiProp)?.tbody] }))}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "body-top", {}, null, _push2, _parent2, _scopeId);
            if (rows.value.length) {
              _push2(`<!--[--><!--[-->`);
              ssrRenderList(topRows.value, (row) => {
                _push2(ssrRenderComponent(unref(ReuseRowTemplate), {
                  key: row.id,
                  row
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
              if (unref(virtualizer)) {
                _push2(`<!--[-->`);
                if (virtualPaddingTop.value > 0) {
                  _push2(`<tr style="${ssrRenderStyle({ height: `${virtualPaddingTop.value}px` })}" aria-hidden="true"${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)}${_scopeId}></td></tr>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--[-->`);
                ssrRenderList(virtualItems.value, (virtualRow) => {
                  _push2(`<!--[-->`);
                  if (centerRows.value[virtualRow.index]) {
                    _push2(ssrRenderComponent(unref(ReuseRowTemplate), {
                      row: centerRows.value[virtualRow.index],
                      style: { height: `${virtualRow.size}px` }
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<!--]-->`);
                });
                _push2(`<!--]-->`);
                if (virtualPaddingBottom.value > 0) {
                  _push2(`<tr style="${ssrRenderStyle({ height: `${virtualPaddingBottom.value}px` })}" aria-hidden="true"${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)}${_scopeId}></td></tr>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!--[-->`);
                ssrRenderList(centerRows.value, (row) => {
                  _push2(ssrRenderComponent(unref(ReuseRowTemplate), {
                    key: row.id,
                    row
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(bottomRows.value, (row) => {
                _push2(ssrRenderComponent(unref(ReuseRowTemplate), {
                  key: row.id,
                  row
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--><!--]-->`);
            } else if (__props.loading && !!slots["loading"]) {
              _push2(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} data-slot="loading" class="${ssrRenderClass(ui.value.loading({ class: unref(uiProp)?.loading }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "loading", {}, null, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            } else {
              _push2(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} data-slot="empty" class="${ssrRenderClass(ui.value.empty({ class: unref(uiProp)?.empty }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
                _push2(`${ssrInterpolate(__props.empty || unref(t)("table.noData"))}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            }
            ssrRenderSlot(_ctx.$slots, "body-bottom", {}, null, _push2, _parent2, _scopeId);
            _push2(`</tbody>`);
            if (hasFooter.value) {
              _push2(`<tfoot data-slot="tfoot" class="${ssrRenderClass(ui.value.tfoot({ class: [unref(uiProp)?.tfoot] }))}"${_scopeId}><tr data-slot="separator" class="${ssrRenderClass(ui.value.separator({ class: [unref(uiProp)?.separator] }))}"${_scopeId}></tr><!--[-->`);
              ssrRenderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
                _push2(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(uiProp)?.tr] }))}"${_scopeId}><!--[-->`);
                ssrRenderList(footerGroup.headers, (header) => {
                  _push2(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${ssrRenderClass(ui.value.th({
                    class: [
                      unref(uiProp)?.th,
                      resolveValue(header.column.columnDef.meta?.class?.th, header)
                    ],
                    pinned: !!header.column.getIsPinned()
                  }))}" style="${ssrRenderStyle([
                    getColumnStyles(header.column),
                    resolveValue(header.column.columnDef.meta?.style?.th, header)
                  ])}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => {
                    if (!header.isPlaceholder) {
                      _push2(ssrRenderComponent(unref(FlexRender), {
                        render: header.column.columnDef.footer,
                        props: header.getContext()
                      }, null, _parent2, _scopeId));
                    } else {
                      _push2(`<!---->`);
                    }
                  }, _push2, _parent2, _scopeId);
                  _push2(`</th>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]--></tfoot>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</table>`);
          } else {
            return [
              createVNode("table", {
                ref_key: "tableRef",
                ref: tableRef,
                "data-slot": "base",
                class: ui.value.base({ class: [unref(uiProp)?.base] })
              }, [
                __props.caption || !!slots.caption ? (openBlock(), createBlock("caption", {
                  key: 0,
                  "data-slot": "caption",
                  class: ui.value.caption({ class: [unref(uiProp)?.caption] })
                }, [
                  renderSlot(_ctx.$slots, "caption", {}, () => [
                    createTextVNode(toDisplayString(__props.caption), 1)
                  ])
                ], 2)) : createCommentVNode("", true),
                createVNode("thead", {
                  "data-slot": "thead",
                  class: ui.value.thead({ class: [unref(uiProp)?.thead] })
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
                    return openBlock(), createBlock("tr", {
                      key: headerGroup.id,
                      "data-slot": "tr",
                      class: ui.value.tr({ class: [unref(uiProp)?.tr] })
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
                        return openBlock(), createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          scope: header.colSpan > 1 ? "colgroup" : "col",
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          "data-slot": "th",
                          class: ui.value.th({
                            class: [
                              unref(uiProp)?.th,
                              resolveValue(header.column.columnDef.meta?.class?.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          }),
                          style: [
                            getColumnStyles(header.column),
                            resolveValue(header.column.columnDef.meta?.style?.th, header)
                          ]
                        }, [
                          renderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.header,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                          ])
                        ], 14, ["data-pinned", "scope", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128)),
                  createVNode("tr", {
                    "data-slot": "separator",
                    class: ui.value.separator({ class: [unref(uiProp)?.separator] })
                  }, null, 2)
                ], 2),
                createVNode("tbody", {
                  "data-slot": "tbody",
                  class: ui.value.tbody({ class: [unref(uiProp)?.tbody] })
                }, [
                  renderSlot(_ctx.$slots, "body-top"),
                  rows.value.length ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(topRows.value, (row) => {
                      return openBlock(), createBlock(unref(ReuseRowTemplate), {
                        key: row.id,
                        row
                      }, null, 8, ["row"]);
                    }), 128)),
                    unref(virtualizer) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      virtualPaddingTop.value > 0 ? (openBlock(), createBlock("tr", {
                        key: 0,
                        style: { height: `${virtualPaddingTop.value}px` },
                        "aria-hidden": "true"
                      }, [
                        createVNode("td", {
                          colspan: unref(tableApi).getAllLeafColumns().length
                        }, null, 8, ["colspan"])
                      ], 4)) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(virtualItems.value, (virtualRow) => {
                        return openBlock(), createBlock(Fragment, {
                          key: centerRows.value[virtualRow.index]?.id ?? `virtual-${virtualRow.index}`
                        }, [
                          centerRows.value[virtualRow.index] ? (openBlock(), createBlock(unref(ReuseRowTemplate), {
                            key: 0,
                            row: centerRows.value[virtualRow.index],
                            style: { height: `${virtualRow.size}px` }
                          }, null, 8, ["row", "style"])) : createCommentVNode("", true)
                        ], 64);
                      }), 128)),
                      virtualPaddingBottom.value > 0 ? (openBlock(), createBlock("tr", {
                        key: 1,
                        style: { height: `${virtualPaddingBottom.value}px` },
                        "aria-hidden": "true"
                      }, [
                        createVNode("td", {
                          colspan: unref(tableApi).getAllLeafColumns().length
                        }, null, 8, ["colspan"])
                      ], 4)) : createCommentVNode("", true)
                    ], 64)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(centerRows.value, (row) => {
                      return openBlock(), createBlock(unref(ReuseRowTemplate), {
                        key: row.id,
                        row
                      }, null, 8, ["row"]);
                    }), 128)),
                    (openBlock(true), createBlock(Fragment, null, renderList(bottomRows.value, (row) => {
                      return openBlock(), createBlock(unref(ReuseRowTemplate), {
                        key: row.id,
                        row
                      }, null, 8, ["row"]);
                    }), 128))
                  ], 64)) : __props.loading && !!slots["loading"] ? (openBlock(), createBlock("tr", { key: 1 }, [
                    createVNode("td", {
                      colspan: unref(tableApi).getAllLeafColumns().length,
                      "data-slot": "loading",
                      class: ui.value.loading({ class: unref(uiProp)?.loading })
                    }, [
                      renderSlot(_ctx.$slots, "loading")
                    ], 10, ["colspan"])
                  ])) : (openBlock(), createBlock("tr", { key: 2 }, [
                    createVNode("td", {
                      colspan: unref(tableApi).getAllLeafColumns().length,
                      "data-slot": "empty",
                      class: ui.value.empty({ class: unref(uiProp)?.empty })
                    }, [
                      renderSlot(_ctx.$slots, "empty", {}, () => [
                        createTextVNode(toDisplayString(__props.empty || unref(t)("table.noData")), 1)
                      ])
                    ], 10, ["colspan"])
                  ])),
                  renderSlot(_ctx.$slots, "body-bottom")
                ], 2),
                hasFooter.value ? (openBlock(), createBlock("tfoot", {
                  key: 1,
                  "data-slot": "tfoot",
                  class: ui.value.tfoot({ class: [unref(uiProp)?.tfoot] })
                }, [
                  createVNode("tr", {
                    "data-slot": "separator",
                    class: ui.value.separator({ class: [unref(uiProp)?.separator] })
                  }, null, 2),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
                    return openBlock(), createBlock("tr", {
                      key: footerGroup.id,
                      "data-slot": "tr",
                      class: ui.value.tr({ class: [unref(uiProp)?.tr] })
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(footerGroup.headers, (header) => {
                        return openBlock(), createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          "data-slot": "th",
                          class: ui.value.th({
                            class: [
                              unref(uiProp)?.th,
                              resolveValue(header.column.columnDef.meta?.class?.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          }),
                          style: [
                            getColumnStyles(header.column),
                            resolveValue(header.column.columnDef.meta?.style?.th, header)
                          ]
                        }, [
                          renderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.footer,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                          ])
                        ], 14, ["data-pinned", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128))
                ], 2)) : createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        as: __props.as
      }, _ctx.$attrs, {
        "data-slot": "root",
        class: ui.value.root({ class: [unref(uiProp)?.root, props.class] })
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ReuseTableTemplate), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ReuseTableTemplate))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Table-CiWunXtq.mjs.map
