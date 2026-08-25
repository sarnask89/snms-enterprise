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
 * Batch resolves TERYT addresses for a list of inputs using TypeORM's `In()` operator.
 * Prevents N+1 database queries during serialization of customer or device lists.
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<ResolvedTerytAddress[]> {
    if (inputs.length === 0) {
        return [];
    }

    const streetIds = new Set<number>();
    const cityIds = new Set<number>();
    const communeIds = new Set<number>();
    const districtIds = new Set<number>();
    const stateIds = new Set<number>();

    for (const input of inputs) {
        if (input.streetId) streetIds.add(input.streetId);
        if (input.cityId) cityIds.add(input.cityId);
        if (input.communeId) communeIds.add(input.communeId);
        if (input.districtId) districtIds.add(input.districtId);
        if (input.stateId) stateIds.add(input.stateId);
    }

    const [streets, cities, communes, districts, states] = await Promise.all([
        streetIds.size > 0
            ? streetRepo.find({
                where: { id: In([...streetIds]) },
                relations: {
                    city: {
                        district: { state: true },
                        commune: { district: { state: true } },
                    },
                    commune: { district: { state: true } },
                },
            })
            : [],
        cityIds.size > 0
            ? cityRepo.find({
                where: { id: In([...cityIds]) },
                relations: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
            })
            : [],
        communeIds.size > 0
            ? communeRepo.find({
                where: { id: In([...communeIds]) },
                relations: { district: { state: true } },
            })
            : [],
        districtIds.size > 0
            ? districtRepo.find({
                where: { id: In([...districtIds]) },
                relations: { state: true },
            })
            : [],
        stateIds.size > 0
            ? stateRepo.find({
                where: { id: In([...stateIds]) },
            })
            : [],
    ]);

    const streetMap = new Map(streets.map((item) => [item.id, item]));
    const cityMap = new Map(cities.map((item) => [item.id, item]));
    const communeMap = new Map(communes.map((item) => [item.id, item]));
    const districtMap = new Map(districts.map((item) => [item.id, item]));
    const stateMap = new Map(states.map((item) => [item.id, item]));

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
