import { computed, toValue } from 'vue';
import { h as useAppConfig, K as get } from './server.mjs';

function useResolvedVariants(name, props, theme, keys, overrides) {
  const appConfig = useAppConfig();
  const result = {};
  for (const key of keys) {
    result[key] = computed(() => {
      const value = overrides?.[key] !== void 0 ? toValue(overrides[key]) : get(props, key);
      return value ?? appConfig.ui?.[name]?.defaultVariants?.[key] ?? theme.defaultVariants?.[key];
    });
  }
  return result;
}

export { useResolvedVariants as u };
//# sourceMappingURL=useResolvedVariants-Cc4FdLtQ.mjs.map
