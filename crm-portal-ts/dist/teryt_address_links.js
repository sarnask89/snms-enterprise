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
export function makeTerytKey(input) {
    return `${input.stateId ?? ""}:${input.districtId ?? ""}:${input.communeId ?? ""}:${input.cityId ?? ""}:${input.streetId ?? ""}`;
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
 * ⚡ Bolt Optimization: Batch resolves TERYT address components across multiple inputs using TypeORM's `In` operator.
 * Replaces N+1 individual database queries with at most 5 batch queries regardless of input count.
 */
export async function batchResolveTerytAddresses(inputs) {
    const result = new Map();
    if (!inputs.length) {
        return result;
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
    const streetMap = new Map();
    if (streetIds.size > 0) {
        const streets = await streetRepo.find({
            where: { id: In(Array.from(streetIds)) },
            relations: {
                city: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
                commune: { district: { state: true } },
            },
        });
        for (const street of streets) {
            streetMap.set(street.id, street);
        }
    }
    const cityMap = new Map();
    if (cityIds.size > 0) {
        const cities = await cityRepo.find({
            where: { id: In(Array.from(cityIds)) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        });
        for (const city of cities) {
            cityMap.set(city.id, city);
        }
    }
    const communeMap = new Map();
    if (communeIds.size > 0) {
        const communes = await communeRepo.find({
            where: { id: In(Array.from(communeIds)) },
            relations: {
                district: { state: true },
            },
        });
        for (const commune of communes) {
            communeMap.set(commune.id, commune);
        }
    }
    const districtMap = new Map();
    if (districtIds.size > 0) {
        const districts = await districtRepo.find({
            where: { id: In(Array.from(districtIds)) },
            relations: { state: true },
        });
        for (const district of districts) {
            districtMap.set(district.id, district);
        }
    }
    const stateMap = new Map();
    if (stateIds.size > 0) {
        const states = await stateRepo.findBy({ id: In(Array.from(stateIds)) });
        for (const state of states) {
            stateMap.set(state.id, state);
        }
    }
    for (const input of inputs) {
        const street = input.streetId ? streetMap.get(input.streetId) ?? null : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) ?? null : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) ?? null : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? districtMap.get(input.districtId) ?? null : null);
        const state = district?.state ?? (input.stateId ? stateMap.get(input.stateId) ?? null : null);
        result.set(makeTerytKey(input), {
            state: state ?? null,
            district: district ?? null,
            commune: commune ?? null,
            city: city ?? null,
            street: street ?? null,
        });
    }
    return result;
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