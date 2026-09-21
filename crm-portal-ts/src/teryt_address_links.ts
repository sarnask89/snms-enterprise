import { In } from "typeorm";
import { AppDataSource } from "./database.js";
import {
    LocationCity,
    LocationCommune,
    LocationDistrict,
    LocationState,
    LocationStreet,
} from "./models/location.js";
import { getDefaultArea } from "./teryt_defaults.js";

const stateRepo = AppDataSource.getRepository(LocationState);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const communeRepo = AppDataSource.getRepository(LocationCommune);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);

function normalizeAddressToken(value: string | null | undefined) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/^(ul(?:ica)?|os(?:iedle)?|al(?:eja)?|pl(?:ac)?|rondo)\.?\s+/u, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function normalizeAddressWordSet(value: string | null | undefined) {
    return normalizeAddressToken(value)
        .split(" ")
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right))
        .join(" ");
}

export type ResolvedTerytAddress = {
    state: LocationState | null;
    district: LocationDistrict | null;
    commune: LocationCommune | null;
    city: LocationCity | null;
    street: LocationStreet | null;
};

export type TerytIdInput = {
    stateId?: number;
    districtId?: number;
    communeId?: number;
    cityId?: number;
    streetId?: number;
};

async function loadState(id?: number) {
    return id ? await stateRepo.findOneBy({ id }) : null;
}

async function loadDistrict(id?: number) {
    return id ? await districtRepo.findOne({
        where: { id },
        relations: { state: true },
    }) : null;
}

async function loadCommune(id?: number) {
    return id ? await communeRepo.findOne({
        where: { id },
        relations: {
            district: {
                state: true,
            },
        },
    }) : null;
}

async function loadCity(id?: number) {
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

async function loadStreet(id?: number) {
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

export async function resolveTerytAddress(input: TerytIdInput): Promise<ResolvedTerytAddress> {
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
 * ⚡ Performance Optimization: Batch resolve TERYT addresses for a list of inputs.
 * Replaces N individual resolveTerytAddress database query chains (up to 5N queries)
 * with a single batched query step for streets, cities, communes, districts, and states (max 5 queries total).
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<ResolvedTerytAddress[]> {
    if (inputs.length === 0) {
        return [];
    }

    const streetsMap = new Map<number, LocationStreet>();
    const citiesMap = new Map<number, LocationCity>();
    const communesMap = new Map<number, LocationCommune>();
    const districtsMap = new Map<number, LocationDistrict>();
    const statesMap = new Map<number, LocationState>();

    // 1. Batch load streets and populate associated relations
    const streetIds = [...new Set(
        inputs
            .map((input) => input.streetId)
            .filter((id): id is number => typeof id === "number" && id > 0),
    )];

    if (streetIds.length > 0) {
        const streets = await streetRepo.find({
            where: { id: In(streetIds) },
            relations: {
                city: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
                commune: { district: { state: true } },
            },
        });
        for (const street of streets) {
            streetsMap.set(street.id, street);
            if (street.city) {
                citiesMap.set(street.city.id, street.city);
                if (street.city.commune) {
                    communesMap.set(street.city.commune.id, street.city.commune);
                }
                if (street.city.district) {
                    districtsMap.set(street.city.district.id, street.city.district);
                    if (street.city.district.state) {
                        statesMap.set(street.city.district.state.id, street.city.district.state);
                    }
                }
            }
            if (street.commune) {
                communesMap.set(street.commune.id, street.commune);
                if (street.commune.district) {
                    districtsMap.set(street.commune.district.id, street.commune.district);
                    if (street.commune.district.state) {
                        statesMap.set(street.commune.district.state.id, street.commune.district.state);
                    }
                }
            }
        }
    }

    // 2. Batch load cities for inputs missing streets or having explicit cityId
    const cityIdsNeeded = [...new Set(
        inputs
            .map((input) => input.cityId)
            .filter((id): id is number => typeof id === "number" && id > 0 && !citiesMap.has(id)),
    )];

    if (cityIdsNeeded.length > 0) {
        const cities = await cityRepo.find({
            where: { id: In(cityIdsNeeded) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        });
        for (const city of cities) {
            citiesMap.set(city.id, city);
            if (city.commune) {
                communesMap.set(city.commune.id, city.commune);
            }
            if (city.district) {
                districtsMap.set(city.district.id, city.district);
                if (city.district.state) {
                    statesMap.set(city.district.state.id, city.district.state);
                }
            }
        }
    }

    // 3. Batch load communes for remaining explicit communeIds
    const communeIdsNeeded = [...new Set(
        inputs
            .map((input) => input.communeId)
            .filter((id): id is number => typeof id === "number" && id > 0 && !communesMap.has(id)),
    )];

    if (communeIdsNeeded.length > 0) {
        const communes = await communeRepo.find({
            where: { id: In(communeIdsNeeded) },
            relations: { district: { state: true } },
        });
        for (const commune of communes) {
            communesMap.set(commune.id, commune);
            if (commune.district) {
                districtsMap.set(commune.district.id, commune.district);
                if (commune.district.state) {
                    statesMap.set(commune.district.state.id, commune.district.state);
                }
            }
        }
    }

    // 4. Batch load districts for remaining explicit districtIds
    const districtIdsNeeded = [...new Set(
        inputs
            .map((input) => input.districtId)
            .filter((id): id is number => typeof id === "number" && id > 0 && !districtsMap.has(id)),
    )];

    if (districtIdsNeeded.length > 0) {
        const districts = await districtRepo.find({
            where: { id: In(districtIdsNeeded) },
            relations: { state: true },
        });
        for (const district of districts) {
            districtsMap.set(district.id, district);
            if (district.state) {
                statesMap.set(district.state.id, district.state);
            }
        }
    }

    // 5. Batch load states for remaining explicit stateIds
    const stateIdsNeeded = [...new Set(
        inputs
            .map((input) => input.stateId)
            .filter((id): id is number => typeof id === "number" && id > 0 && !statesMap.has(id)),
    )];

    if (stateIdsNeeded.length > 0) {
        const states = await stateRepo.find({
            where: { id: In(stateIdsNeeded) },
        });
        for (const state of states) {
            statesMap.set(state.id, state);
        }
    }

    // Map inputs back to ResolvedTerytAddress objects
    return inputs.map((input) => {
        const street = input.streetId ? (streetsMap.get(input.streetId) ?? null) : null;
        const city = street?.city ?? (input.cityId ? (citiesMap.get(input.cityId) ?? null) : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? (communesMap.get(input.communeId) ?? null) : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? (districtsMap.get(input.districtId) ?? null) : null);
        const state = district?.state ?? (input.stateId ? (statesMap.get(input.stateId) ?? null) : null);

        return {
            state: state ?? null,
            district: district ?? null,
            commune: commune ?? null,
            city: city ?? null,
            street: street ?? null,
        };
    });
}

export async function resolveParsedStreetWithinDefaultArea(streetName: string | null | undefined): Promise<ResolvedTerytAddress | null> {
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

export function serializeTerytEntry(entry: LocationState | LocationDistrict | LocationCommune | LocationCity | LocationStreet | null) {
    if (!entry) {
        return null;
    }

    return {
        id: entry.id,
        name: entry.name,
        terytCode: "terytCode" in entry ? (entry.terytCode ?? null) : null,
    };
}
