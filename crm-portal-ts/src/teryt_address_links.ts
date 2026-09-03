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

/**
 * Bolt optimization: Batch-resolves TERYT address entities across multiple inputs in bulk,
 * eliminating N+1 database queries when serializing lists of entities (e.g. customers or devices).
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<ResolvedTerytAddress[]> {
    if (inputs.length === 0) {
        return [];
    }

    const streetIds = Array.from(new Set(inputs.map((i) => i.streetId).filter((id): id is number => id !== undefined && id !== null)));
    const cityIds = Array.from(new Set(inputs.map((i) => i.cityId).filter((id): id is number => id !== undefined && id !== null)));
    const communeIds = Array.from(new Set(inputs.map((i) => i.communeId).filter((id): id is number => id !== undefined && id !== null)));
    const districtIds = Array.from(new Set(inputs.map((i) => i.districtId).filter((id): id is number => id !== undefined && id !== null)));
    const stateIds = Array.from(new Set(inputs.map((i) => i.stateId).filter((id): id is number => id !== undefined && id !== null)));

    const streets = streetIds.length > 0
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

    const fetchedCityIds = new Set(cityIds);
    for (const street of streets) {
        if (street.cityId) {
            fetchedCityIds.delete(street.cityId);
        }
    }
    const remainingCityIds = Array.from(fetchedCityIds);

    const cities = remainingCityIds.length > 0
        ? await cityRepo.find({
            where: { id: In(remainingCityIds) },
            relations: {
                district: { state: true },
                commune: { district: { state: true } },
            },
        })
        : [];
    const cityMap = new Map(cities.map((c) => [c.id, c]));

    const fetchedCommuneIds = new Set(communeIds);
    for (const street of streets) {
        if (street.communeId) fetchedCommuneIds.delete(street.communeId);
        if (street.city?.communeId) fetchedCommuneIds.delete(street.city.communeId);
    }
    for (const city of cities) {
        if (city.communeId) fetchedCommuneIds.delete(city.communeId);
    }
    const remainingCommuneIds = Array.from(fetchedCommuneIds);

    const communes = remainingCommuneIds.length > 0
        ? await communeRepo.find({
            where: { id: In(remainingCommuneIds) },
            relations: { district: { state: true } },
        })
        : [];
    const communeMap = new Map(communes.map((c) => [c.id, c]));

    const fetchedDistrictIds = new Set(districtIds);
    for (const street of streets) {
        if (street.commune?.districtId) fetchedDistrictIds.delete(street.commune.districtId);
        if (street.city?.districtId) fetchedDistrictIds.delete(street.city.districtId);
        if (street.city?.commune?.districtId) fetchedDistrictIds.delete(street.city.commune.districtId);
    }
    for (const city of cities) {
        if (city.districtId) fetchedDistrictIds.delete(city.districtId);
        if (city.commune?.districtId) fetchedDistrictIds.delete(city.commune.districtId);
    }
    for (const commune of communes) {
        if (commune.districtId) fetchedDistrictIds.delete(commune.districtId);
    }
    const remainingDistrictIds = Array.from(fetchedDistrictIds);

    const districts = remainingDistrictIds.length > 0
        ? await districtRepo.find({
            where: { id: In(remainingDistrictIds) },
            relations: { state: true },
        })
        : [];
    const districtMap = new Map(districts.map((d) => [d.id, d]));

    const fetchedStateIds = new Set(stateIds);
    for (const street of streets) {
        if (street.commune?.district?.stateId) fetchedStateIds.delete(street.commune.district.stateId);
        if (street.city?.district?.stateId) fetchedStateIds.delete(street.city.district.stateId);
        if (street.city?.commune?.district?.stateId) fetchedStateIds.delete(street.city.commune.district.stateId);
    }
    for (const city of cities) {
        if (city.district?.stateId) fetchedStateIds.delete(city.district.stateId);
        if (city.commune?.district?.stateId) fetchedStateIds.delete(city.commune.district.stateId);
    }
    for (const commune of communes) {
        if (commune.district?.stateId) fetchedStateIds.delete(commune.district.stateId);
    }
    for (const district of districts) {
        if (district.stateId) fetchedStateIds.delete(district.stateId);
    }
    const remainingStateIds = Array.from(fetchedStateIds);

    const states = remainingStateIds.length > 0
        ? await stateRepo.find({ where: { id: In(remainingStateIds) } })
        : [];
    const stateMap = new Map(states.map((s) => [s.id, s]));

    return inputs.map((input) => {
        const street = input.streetId ? streetMap.get(input.streetId) ?? null : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) ?? null : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) ?? null : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? districtMap.get(input.districtId) ?? null : null);
        const state = district?.state ?? (input.stateId ? stateMap.get(input.stateId) ?? null : null);

        return {
            state: state ?? null,
            district: district ?? null,
            commune: commune ?? null,
            city: city ?? null,
            street: street ?? null,
        };
    });
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
