import { reactive } from 'vue';

function useManagedTerytAddress(target, fieldMap, defaultArea) {
  const suggestions = reactive({
    cities: [],
    streets: []
  });
  const getField = (key) => target[fieldMap[key]];
  const setField = (key, value) => {
    target[fieldMap[key]] = value;
  };
  const clearSuggestions = () => {
    suggestions.cities = [];
    suggestions.streets = [];
  };
  const applyDefaultArea = () => {
    setField("cityId", defaultArea.value?.city?.id || null);
    setField("city", defaultArea.value?.city?.name || "");
    setField("streetId", null);
    setField("street", "");
    clearSuggestions();
  };
  const fetchSuggestions = async (kind, query, extraQuery = {}) => {
    if (!query || String(query).trim().length < 2) {
      return [];
    }
    return await $fetch("/api/v1/teryt/suggest", {
      query: {
        kind,
        q: String(query).trim(),
        managedOnly: true,
        ...extraQuery
      }
    });
  };
  const onCityInput = async () => {
    setField("cityId", null);
    setField("streetId", null);
    setField("street", "");
    suggestions.streets = [];
    suggestions.cities = await fetchSuggestions("city", getField("city"));
  };
  const onStreetInput = async () => {
    setField("streetId", null);
    suggestions.streets = await fetchSuggestions("street", getField("street"), {
      cityId: getField("cityId") || void 0
    });
  };
  const selectCity = (suggestion) => {
    setField("cityId", suggestion.id);
    setField("city", suggestion.text);
    setField("streetId", null);
    setField("street", "");
    suggestions.cities = [];
    suggestions.streets = [];
  };
  const selectStreet = (suggestion) => {
    setField("streetId", suggestion.id);
    setField("street", suggestion.text);
    suggestions.streets = [];
  };
  return {
    suggestions,
    clearSuggestions,
    applyDefaultArea,
    onCityInput,
    onStreetInput,
    selectCity,
    selectStreet
  };
}

export { useManagedTerytAddress as u };
//# sourceMappingURL=useManagedTerytAddress-CbBqmtiX.mjs.map
