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

/**
 * ⚡ Bolt Performance Optimization:
 * Batch resolves TERYT addresses for an array of input IDs using TypeORM In() queries.
 * Reduces database queries from 5*N per list payload down to a maximum of 5 batched queries,
 * eliminating N+1 performance bottlenecks during customer and device list serialization.
 */
export async function batchResolveTerytAddresses(inputs: TerytIdInput[]): Promise<ResolvedTerytAddress[]> {
    if (inputs.length === 0) {
        return [];
    }

    const streetIds = Array.from(new Set(inputs.map((i) => i.streetId).filter((id): id is number => typeof id === "number")));
    const cityIds = Array.from(new Set(inputs.map((i) => i.cityId).filter((id): id is number => typeof id === "number")));
    const communeIds = Array.from(new Set(inputs.map((i) => i.communeId).filter((id): id is number => typeof id === "number")));
    const districtIds = Array.from(new Set(inputs.map((i) => i.districtId).filter((id): id is number => typeof id === "number")));
    const stateIds = Array.from(new Set(inputs.map((i) => i.stateId).filter((id): id is number => typeof id === "number")));

    const [streets, cities, communes, districts, states] = await Promise.all([
        streetIds.length > 0
            ? streetRepo.find({
                where: { id: In(streetIds) },
                relations: {
                    city: {
                        district: { state: true },
                        commune: { district: { state: true } },
                    },
                    commune: { district: { state: true } },
                },
            })
            : Promise.resolve([]),
        cityIds.length > 0
            ? cityRepo.find({
                where: { id: In(cityIds) },
                relations: {
                    district: { state: true },
                    commune: { district: { state: true } },
                },
            })
            : Promise.resolve([]),
        communeIds.length > 0
            ? communeRepo.find({
                where: { id: In(communeIds) },
                relations: { district: { state: true } },
            })
            : Promise.resolve([]),
        districtIds.length > 0
            ? districtRepo.find({
                where: { id: In(districtIds) },
                relations: { state: true },
            })
            : Promise.resolve([]),
        stateIds.length > 0
            ? stateRepo.find({ where: { id: In(stateIds) } })
            : Promise.resolve([]),
    ]);

    const streetMap = new Map(streets.map((s) => [s.id, s]));
    const cityMap = new Map(cities.map((c) => [c.id, c]));
    const communeMap = new Map(communes.map((c) => [c.id, c]));
    const districtMap = new Map(districts.map((d) => [d.id, d]));
    const stateMap = new Map(states.map((s) => [s.id, s]));

    return inputs.map((input) => {
        const street = input.streetId ? (streetMap.get(input.streetId) ?? null) : null;
        const city = street?.city ?? (input.cityId ? (cityMap.get(input.cityId) ?? null) : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? (communeMap.get(input.communeId) ?? null) : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? (districtMap.get(input.districtId) ?? null) : null);
        const state = district?.state ?? (input.stateId ? (stateMap.get(input.stateId) ?? null) : null);

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
    const [resolved] = await batchResolveTerytAddresses([input]);
    return resolved;
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
