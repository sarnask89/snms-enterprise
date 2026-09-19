import { In } from "typeorm";
import { AppDataSource } from "./database.js";
import { LocationCity, LocationCommune, LocationDistrict, LocationState, LocationStreet, } from "./models/location.js";
import { getDefaultArea } from "./teryt_defaults.js";
const stateRepo = AppDataSource.getRepository(LocationState);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const communeRepo = AppDataSource.getRepository(LocationCommune);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);
function normalizeAddressToken(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/^(ul(?:ica)?|os(?:iedle)?|al(?:eja)?|pl(?:ac)?|rondo)\.?\s+/u, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}
function normalizeAddressWordSet(value) {
    return normalizeAddressToken(value)
        .split(" ")
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right))
        .join(" ");
}
async function loadState(id) {
    return id ? await stateRepo.findOneBy({ id }) : null;
}
async function loadDistrict(id) {
    return id ? await districtRepo.findOne({
        where: { id },
        relations: { state: true },
    }) : null;
}
async function loadCommune(id) {
    return id ? await communeRepo.findOne({
        where: { id },
        relations: {
            district: {
                state: true,
            },
        },
    }) : null;
}
async function loadCity(id) {
    return id ? await cityRepo.findOne({
        where: { id },
        relations: {
            district: {
                state: true,
            },
            commune: {
                district: {
                    state: true,
                },
            },
        },
    }) : null;
}
async function loadStreet(id) {
    return id ? await streetRepo.findOne({
        where: { id },
        relations: {
            city: {
                district: {
                    state: true,
                },
                commune: {
                    district: {
                        state: true,
                    },
                },
            },
            commune: {
                district: {
                    state: true,
                },
            },
        },
    }) : null;
}
export async function resolveTerytAddress(input) {
    const street = await loadStreet(input.streetId);
    const city = street?.city ?? await loadCity(input.cityId);
    const commune = street?.commune ?? city?.commune ?? await loadCommune(input.communeId);
    const district = commune?.district ?? city?.district ?? await loadDistrict(input.districtId);
    const state = district?.state ?? await loadState(input.stateId);
    return {
        state: state ?? null,
        district: district ?? null,
        commune: commune ?? null,
        city: city ?? null,
        street: street ?? null,
    };
}
/**
 * Performance Optimization: Batch resolves TERYT addresses for an array of inputs using SQL `In()` operators.
 * Reduces database query complexity from O(N) sequential entity fetches to O(1) batched round-trips.
 */
export async function batchResolveTerytAddresses(inputs) {
    if (inputs.length === 0) {
        return [];
    }
    const streetIds = new Set();
    const cityIds = new Set();
    const communeIds = new Set();
    const districtIds = new Set();
    const stateIds = new Set();
    for (const input of inputs) {
        if (input.streetId)
            streetIds.add(input.streetId);
        if (input.cityId)
            cityIds.add(input.cityId);
        if (input.communeId)
            communeIds.add(input.communeId);
        if (input.districtId)
            districtIds.add(input.districtId);
        if (input.stateId)
            stateIds.add(input.stateId);
    }
    const streetsMap = new Map();
    const citiesMap = new Map();
    const communesMap = new Map();
    const districtsMap = new Map();
    const statesMap = new Map();
    const recordRelations = (street, city, commune, district, state) => {
        if (street && !streetsMap.has(street.id))
            streetsMap.set(street.id, street);
        if (city && !citiesMap.has(city.id))
            citiesMap.set(city.id, city);
        if (commune && !communesMap.has(commune.id))
            communesMap.set(commune.id, commune);
        if (district && !districtsMap.has(district.id))
            districtsMap.set(district.id, district);
        if (state && !statesMap.has(state.id))
            statesMap.set(state.id, state);
    };
    if (streetIds.size > 0) {
        const streets = await streetRepo.find({
            where: { id: In(Array.from(streetIds)) },
            relations: {
                city: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
                commune: {
                    district: { state: true },
                },
            },
        });
        for (const st of streets) {
            recordRelations(st, st.city, st.commune ?? st.city?.commune, st.commune?.district ?? st.city?.district, st.commune?.district?.state ?? st.city?.district?.state);
        }
    }
    const missingCityIds = Array.from(cityIds).filter((id) => !citiesMap.has(id));
    if (missingCityIds.length > 0) {
        const cities = await cityRepo.find({
            where: { id: In(missingCityIds) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        });
        for (const c of cities) {
            recordRelations(null, c, c.commune, c.district ?? c.commune?.district, c.district?.state ?? c.commune?.district?.state);
        }
    }
    const missingCommuneIds = Array.from(communeIds).filter((id) => !communesMap.has(id));
    if (missingCommuneIds.length > 0) {
        const communes = await communeRepo.find({
            where: { id: In(missingCommuneIds) },
            relations: {
                district: { state: true },
            },
        });
        for (const cm of communes) {
            recordRelations(null, null, cm, cm.district, cm.district?.state);
        }
    }
    const missingDistrictIds = Array.from(districtIds).filter((id) => !districtsMap.has(id));
    if (missingDistrictIds.length > 0) {
        const districts = await districtRepo.find({
            where: { id: In(missingDistrictIds) },
            relations: { state: true },
        });
        for (const d of districts) {
            recordRelations(null, null, null, d, d.state);
        }
    }
    const missingStateIds = Array.from(stateIds).filter((id) => !statesMap.has(id));
    if (missingStateIds.length > 0) {
        const states = await stateRepo.find({
            where: { id: In(missingStateIds) },
        });
        for (const s of states) {
            recordRelations(null, null, null, null, s);
        }
    }
    return inputs.map((input) => {
        const hasTerytIds = [
            input.stateId,
            input.districtId,
            input.communeId,
            input.cityId,
            input.streetId,
        ].some((v) => v !== null && v !== undefined);
        if (!hasTerytIds) {
            return { state: null, district: null, commune: null, city: null, street: null };
        }
        const street = input.streetId ? (streetsMap.get(input.streetId) ?? null) : null;
        const city = street?.city ?? (input.cityId ? (citiesMap.get(input.cityId) ?? null) : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? (communesMap.get(input.communeId) ?? null) : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? (districtsMap.get(input.districtId) ?? null) : null);
        const state = district?.state ?? (input.stateId ? (statesMap.get(input.stateId) ?? null) : null);
        return { state, district, commune, city, street };
    });
}
export async function resolveParsedStreetWithinDefaultArea(streetName) {
    const normalizedStreet = normalizeAddressToken(streetName);
    const defaultArea = await getDefaultArea();
    if (!defaultArea || !normalizedStreet) {
        return defaultArea
            ? {
                state: defaultArea.state ?? null,
                district: defaultArea.district ?? null,
                commune: defaultArea.commune ?? null,
                city: defaultArea.city ?? null,
                street: null,
            }
            : null;
    }
    const candidateStreetRows = defaultArea.city
        ? await streetRepo.find({
            where: { cityId: defaultArea.city.id },
            relations: {
                city: {
                    district: {
                        state: true,
                    },
                    commune: {
                        district: {
                            state: true,
                        },
                    },
                },
                commune: {
                    district: {
                        state: true,
                    },
                },
            },
        })
        : [];
    const normalizedWordSet = normalizeAddressWordSet(streetName);
    const exactStreet = candidateStreetRows.find((street) => {
        const normalizedCandidate = normalizeAddressToken(street.name);
        return normalizedCandidate === normalizedStreet || normalizeAddressWordSet(street.name) === normalizedWordSet;
    });
    const fuzzyStreet = exactStreet ?? candidateStreetRows.find((street) => {
        const normalizedCandidate = normalizeAddressToken(street.name);
        return normalizedCandidate.includes(normalizedStreet) || normalizedStreet.includes(normalizedCandidate);
    });
    if (!fuzzyStreet) {
        return {
            state: defaultArea.state ?? null,
            district: defaultArea.district ?? null,
            commune: defaultArea.commune ?? null,
            city: defaultArea.city ?? null,
            street: null,
        };
    }
    return {
        state: fuzzyStreet.city?.district?.state ?? defaultArea.state ?? null,
        district: fuzzyStreet.city?.district ?? defaultArea.district ?? null,
        commune: fuzzyStreet.commune ?? fuzzyStreet.city?.commune ?? defaultArea.commune ?? null,
        city: fuzzyStreet.city ?? defaultArea.city ?? null,
        street: fuzzyStreet,
    };
}
export function serializeTerytEntry(entry) {
    if (!entry) {
        return null;
    }
    return {
        id: entry.id,
        name: entry.name,
        terytCode: "terytCode" in entry ? (entry.terytCode ?? null) : null,
    };
}
//# sourceMappingURL=teryt_address_links.js.map