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
 * Batch resolves TERYT addresses for an array of inputs in a single set of queries,
 * avoiding N+1 database lookups when serializing lists of entities.
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<ResolvedTerytAddress[]> {
    if (!inputs || inputs.length === 0) {
        return [];
    }

    // 1. Batch load Streets
    const streetIds = Array.from(new Set(
        inputs.map((i) => i.streetId).filter((id): id is number => id !== undefined && id !== null)
    ));
    const streetMap = new Map<number, LocationStreet>();
    if (streetIds.length > 0) {
        const streets = await streetRepo.find({
            where: { id: In(streetIds) },
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
        for (const street of streets) {
            streetMap.set(street.id, street);
        }
    }

    // 2. Batch load Cities for missing street cities or direct cityIds
    const cityIds = Array.from(new Set(
        inputs.map((input) => {
            const street = input.streetId ? streetMap.get(input.streetId) : null;
            return street?.city ? null : input.cityId;
        }).filter((id): id is number => id !== undefined && id !== null)
    ));
    const cityMap = new Map<number, LocationCity>();
    if (cityIds.length > 0) {
        const cities = await cityRepo.find({
            where: { id: In(cityIds) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        });
        for (const city of cities) {
            cityMap.set(city.id, city);
        }
    }

    // 3. Batch load Communes for missing street/city communes or direct communeIds
    const communeIds = Array.from(new Set(
        inputs.map((input) => {
            const street = input.streetId ? streetMap.get(input.streetId) : null;
            const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
            const commune = street?.commune ?? city?.commune;
            return commune ? null : input.communeId;
        }).filter((id): id is number => id !== undefined && id !== null)
    ));
    const communeMap = new Map<number, LocationCommune>();
    if (communeIds.length > 0) {
        const communes = await communeRepo.find({
            where: { id: In(communeIds) },
            relations: {
                district: { state: true },
            },
        });
        for (const commune of communes) {
            communeMap.set(commune.id, commune);
        }
    }

    // 4. Batch load Districts for missing commune/city districts or direct districtIds
    const districtIds = Array.from(new Set(
        inputs.map((input) => {
            const street = input.streetId ? streetMap.get(input.streetId) : null;
            const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
            const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) : null);
            const district = commune?.district ?? city?.district;
            return district ? null : input.districtId;
        }).filter((id): id is number => id !== undefined && id !== null)
    ));
    const districtMap = new Map<number, LocationDistrict>();
    if (districtIds.length > 0) {
        const districts = await districtRepo.find({
            where: { id: In(districtIds) },
            relations: { state: true },
        });
        for (const district of districts) {
            districtMap.set(district.id, district);
        }
    }

    // 5. Batch load States for missing district states or direct stateIds
    const stateIds = Array.from(new Set(
        inputs.map((input) => {
            const street = input.streetId ? streetMap.get(input.streetId) : null;
            const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
            const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) : null);
            const district = commune?.district ?? city?.district ?? (input.districtId ? districtMap.get(input.districtId) : null);
            const state = district?.state;
            return state ? null : input.stateId;
        }).filter((id): id is number => id !== undefined && id !== null)
    ));
    const stateMap = new Map<number, LocationState>();
    if (stateIds.length > 0) {
        const states = await stateRepo.find({
            where: { id: In(stateIds) },
        });
        for (const state of states) {
            stateMap.set(state.id, state);
        }
    }

    // 6. Assemble resolved address for each input
    return inputs.map((input) => {
        const street = input.streetId ? streetMap.get(input.streetId) ?? null : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) ?? null : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) ?? null : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? districtMap.get(input.districtId) ?? null : null);
        const state = district?.state ?? (input.stateId ? stateMap.get(input.stateId) ?? null : null);

        return {
            state,
            district,
            commune,
            city,
            street,
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
