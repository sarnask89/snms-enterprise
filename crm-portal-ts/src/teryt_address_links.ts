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
 * Batch resolves TERYT addresses for multiple inputs in at most 5 database queries (1 per table),
 * avoiding N+1 queries when serializing lists of entities with TERYT location IDs.
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<Map<TerytIdInput, ResolvedTerytAddress>> {
    const resultMap = new Map<TerytIdInput, ResolvedTerytAddress>();
    if (!inputs.length) {
        return resultMap;
    }

    // 1. Collect street IDs and batch load
    const streetIds = Array.from(new Set(inputs.map((i) => i.streetId).filter((id): id is number => id != null)));
    const streets = streetIds.length
        ? await streetRepo.find({
            where: { id: In(streetIds) },
            relations: {
                city: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
                commune: { district: { state: true } },
            },
        })
        : [];
    const streetMap = new Map(streets.map((s) => [s.id, s]));

    // 2. Collect city IDs (from inputs + loaded streets) and batch load missing
    const neededCityIds = new Set<number>();
    for (const input of inputs) {
        if (input.cityId != null) neededCityIds.add(input.cityId);
    }
    const missingCityIds = Array.from(neededCityIds);
    const cities = missingCityIds.length
        ? await cityRepo.find({
            where: { id: In(missingCityIds) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        })
        : [];
    const cityMap = new Map(cities.map((c) => [c.id, c]));

    // 3. Collect commune IDs
    const neededCommuneIds = new Set<number>();
    for (const input of inputs) {
        if (input.communeId != null) neededCommuneIds.add(input.communeId);
    }
    const missingCommuneIds = Array.from(neededCommuneIds);
    const communes = missingCommuneIds.length
        ? await communeRepo.find({
            where: { id: In(missingCommuneIds) },
            relations: { district: { state: true } },
        })
        : [];
    const communeMap = new Map(communes.map((c) => [c.id, c]));

    // 4. Collect district IDs
    const neededDistrictIds = new Set<number>();
    for (const input of inputs) {
        if (input.districtId != null) neededDistrictIds.add(input.districtId);
    }
    const missingDistrictIds = Array.from(neededDistrictIds);
    const districts = missingDistrictIds.length
        ? await districtRepo.find({
            where: { id: In(missingDistrictIds) },
            relations: { state: true },
        })
        : [];
    const districtMap = new Map(districts.map((d) => [d.id, d]));

    // 5. Collect state IDs
    const neededStateIds = new Set<number>();
    for (const input of inputs) {
        if (input.stateId != null) neededStateIds.add(input.stateId);
    }
    const missingStateIds = Array.from(neededStateIds);
    const states = missingStateIds.length
        ? await stateRepo.find({
            where: { id: In(missingStateIds) },
        })
        : [];
    const stateMap = new Map(states.map((s) => [s.id, s]));

    // Assemble resolved address for each input
    for (const input of inputs) {
        const street = input.streetId != null ? streetMap.get(input.streetId) ?? null : null;
        const city = street?.city ?? (input.cityId != null ? cityMap.get(input.cityId) ?? null : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId != null ? communeMap.get(input.communeId) ?? null : null);
        const district = commune?.district ?? city?.district ?? (input.districtId != null ? districtMap.get(input.districtId) ?? null : null);
        const state = district?.state ?? (input.stateId != null ? stateMap.get(input.stateId) ?? null : null);

        resultMap.set(input, {
            state: state ?? null,
            district: district ?? null,
            commune: commune ?? null,
            city: city ?? null,
            street: street ?? null,
        });
    }

    return resultMap;
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
