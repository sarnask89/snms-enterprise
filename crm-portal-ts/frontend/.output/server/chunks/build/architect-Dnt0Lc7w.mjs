import { e as _sfc_main$d, f as _sfc_main$7, b as _sfc_main$8, g as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-D7GUUID0.mjs';
import { _ as _sfc_main$2 } from './Input-B7kliWtD.mjs';
import { _ as _sfc_main$3 } from './Alert-CJa1dftu.mjs';
import { ref, mergeProps, withCtx, unref, isRef, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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
import '@vueuse/core';
import '@vueuse/shared';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "architect",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const input = ref("");
    const isLoading = ref(false);
    const isImplementing = ref(false);
    const lastSpec = ref("");
    const messages = ref([
      { role: "assistant", content: `👋 **Witaj w module AI Architekta!** Jestem Twoim lokalnym asystentem działającym na Ollamie.

**Co potrafię?**
Generuję kompletne moduły dla Twojego systemu CRM. Mogę tworzyć modele bazy danych, routery backendowe oraz widoki Vue. Co najważniejsze: **mogę fizycznie utworzyć te pliki na Twoim dysku**, oszczędzając Ci kopiowania!

**Jak zacząć?**
Po prostu opisz, czego potrzebujesz. Na przykład:
- *"Stwórz prosty moduł do zarządzania flotą samochodową w firmie (marka, rejestracja, status)."*
- *"Zbuduj router i stronę Vue do zarządzania zadaniami dla pracowników."*

Kiedy wygeneruję specyfikację z kodem, kliknij zielony przycisk **"Wdróż Moduł"**, a ja zapiszę go prosto w Twoim projekcie! Jak zaczynamy? 🚀` }
    ]);
    const clearChat = () => {
      messages.value = [messages.value[0]];
      lastSpec.value = "";
    };
    const sendMessage = async () => {
      if (!input.value.trim()) return;
      const userText = input.value.trim();
      messages.value.push({ role: "user", content: userText });
      input.value = "";
      isLoading.value = true;
      try {
        const response = await fetch(`${config.public.ollamaUrl}/api/chat`, {
          method: "POST",
          body: JSON.stringify({
            model: config.public.ollamaModel,
            messages: [
              {
                role: "system",
                content: `You are an elite TypeScript/Vue Architect. Your goal is to write full, working code files based on user requests.
            CRITICAL RULES:
            1. You MUST precede EVERY code block with exactly this format: "### FILE: relative/path/to/file.ext"
            2. Example: 
            ### FILE: crm-portal-ts/src/models/car.ts
            \`\`\`typescript
            export class Car { ... }
            \`\`\`
            3. Provide NO explanations. ONLY the file definitions and code.
            4. Backend files should go to: crm-portal-ts/src/models/... or crm-portal-ts/src/routers/...
            5. Frontend files should go to: crm-portal-ts/frontend/app/pages/...
            Follow this format strictly so the automated system can write the files to disk.`
              },
              ...messages.value.map((m) => ({ role: m.role, content: m.content }))
            ],
            stream: false
          })
        });
        const data = await response.json();
        const content = data.message.content;
        messages.value.push({ role: "assistant", content });
        lastSpec.value = content;
      } catch (error) {
        messages.value.push({ role: "assistant", content: "❌ Błąd połączenia z serwerem Ollama. Upewnij się, że działa." });
      } finally {
        isLoading.value = false;
      }
    };
    const implementModule = async () => {
      isImplementing.value = true;
      try {
        const res = await $fetch("/api/v1/architect/implement", {
          method: "POST",
          body: { spec: lastSpec.value }
        });
        alert(`Wdrożono pomyślnie! Utworzono pliki:
` + res.files.join("\n"));
      } catch (error) {
        alert(`Błąd wdrażania: ${error.data?.message || error.message}`);
      } finally {
        isImplementing.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UCard = _sfc_main$1;
      const _component_UButton = _sfc_main$8;
      const _component_UProgress = _sfc_main$7;
      const _component_UInput = _sfc_main$2;
      const _component_UAlert = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 max-w-5xl mx-auto" }, _attrs))}><div class="flex items-center gap-4 mb-8"><div class="p-3 rounded-2xl bg-primary-500/10 text-primary-500">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-sparkles",
        class: "w-8 h-8"
      }, null, _parent));
      _push(`</div><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">AI Architekt Modułów</h1><p class="text-sm text-gray-500">Projektuj i twórz nowe moduły CRM za pomocą sztucznej inteligencji</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-8">`);
      _push(ssrRenderComponent(_component_UCard, { class: "flex flex-col h-[600px]" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="font-bold"${_scopeId}>Czat z Architektem</h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-trash",
              color: "gray",
              variant: "ghost",
              size: "xs",
              onClick: clearChat
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "font-bold" }, "Czat z Architektem"),
                createVNode(_component_UButton, {
                  icon: "i-heroicons-trash",
                  color: "gray",
                  variant: "ghost",
                  size: "xs",
                  onClick: clearChat
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-950 rounded-lg mb-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(messages), (msg, index) => {
              _push2(`<div class="${ssrRenderClass([msg.role === "user" ? "bg-primary-500 text-white self-end" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start", "p-4 rounded-2xl max-w-[90%] text-sm"])}"${_scopeId}>`);
              if (msg.role === "assistant") {
                _push2(`<div class="prose dark:prose-invert prose-xs"${_scopeId}>${ssrInterpolate(msg.content)}</div>`);
              } else {
                _push2(`<div${_scopeId}>${ssrInterpolate(msg.content)}</div>`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (unref(isLoading)) {
              _push2(`<div class="self-start"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UProgress, {
                animation: "carousel",
                class: "w-20"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><form class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(input),
              "onUpdate:modelValue": ($event) => isRef(input) ? input.value = $event : null,
              placeholder: "Opisz moduł, który chcesz zbudować...",
              class: "flex-1",
              disabled: unref(isLoading)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              icon: "i-heroicons-paper-airplane",
              loading: unref(isLoading)
            }, null, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("div", { class: "flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-950 rounded-lg mb-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(messages), (msg, index) => {
                  return openBlock(), createBlock("div", {
                    key: index,
                    class: ["p-4 rounded-2xl max-w-[90%] text-sm", msg.role === "user" ? "bg-primary-500 text-white self-end" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start"]
                  }, [
                    msg.role === "assistant" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "prose dark:prose-invert prose-xs"
                    }, toDisplayString(msg.content), 1)) : (openBlock(), createBlock("div", { key: 1 }, toDisplayString(msg.content), 1))
                  ], 2);
                }), 128)),
                unref(isLoading) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "self-start"
                }, [
                  createVNode(_component_UProgress, {
                    animation: "carousel",
                    class: "w-20"
                  })
                ])) : createCommentVNode("", true)
              ]),
              createVNode("form", {
                onSubmit: withModifiers(sendMessage, ["prevent"]),
                class: "flex gap-2"
              }, [
                createVNode(_component_UInput, {
                  modelValue: unref(input),
                  "onUpdate:modelValue": ($event) => isRef(input) ? input.value = $event : null,
                  placeholder: "Opisz moduł, który chcesz zbudować...",
                  class: "flex-1",
                  disabled: unref(isLoading)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                createVNode(_component_UButton, {
                  type: "submit",
                  icon: "i-heroicons-paper-airplane",
                  loading: unref(isLoading)
                }, null, 8, ["loading"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-col gap-6">`);
      _push(ssrRenderComponent(_component_UCard, { class: "flex-1" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="font-bold"${_scopeId}>Wygenerowana Specyfikacja</h3>`);
            if (unref(lastSpec)) {
              _push2(ssrRenderComponent(_component_UButton, {
                icon: "i-heroicons-cpu-chip",
                label: "Wdróż Moduł",
                color: "green",
                loading: unref(isImplementing),
                onClick: implementModule
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "font-bold" }, "Wygenerowana Specyfikacja"),
                unref(lastSpec) ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  icon: "i-heroicons-cpu-chip",
                  label: "Wdróż Moduł",
                  color: "green",
                  loading: unref(isImplementing),
                  onClick: implementModule
                }, null, 8, ["loading"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(lastSpec)) {
              _push2(`<div class="prose dark:prose-invert prose-sm max-h-[400px] overflow-y-auto"${_scopeId}><pre class="text-[10px] bg-gray-900 text-green-400 p-4 rounded-lg"${_scopeId}><code${_scopeId}>${ssrInterpolate(unref(lastSpec))}</code></pre></div>`);
            } else {
              _push2(`<div class="flex flex-col items-center justify-center h-64 text-gray-400"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-document-magnifying-glass",
                class: "w-12 h-12 mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p${_scopeId}>Jeszcze nie wygenerowano specyfikacji</p></div>`);
            }
          } else {
            return [
              unref(lastSpec) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "prose dark:prose-invert prose-sm max-h-[400px] overflow-y-auto"
              }, [
                createVNode("pre", { class: "text-[10px] bg-gray-900 text-green-400 p-4 rounded-lg" }, [
                  createVNode("code", null, toDisplayString(unref(lastSpec)), 1)
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "flex flex-col items-center justify-center h-64 text-gray-400"
              }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-document-magnifying-glass",
                  class: "w-12 h-12 mb-2"
                }),
                createVNode("p", null, "Jeszcze nie wygenerowano specyfikacji")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UAlert, {
        icon: "i-heroicons-information-circle",
        color: "primary",
        variant: "soft",
        title: "Uwaga dotycząca bezpieczeństwa",
        description: "Sztuczna inteligencja wygeneruje kod na podstawie Twojego opisu. Zawsze sprawdzaj wygenerowaną implementację przed wdrożeniem na produkcję."
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/architect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=architect-Dnt0Lc7w.mjs.map
