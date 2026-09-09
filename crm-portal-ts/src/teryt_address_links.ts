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
 * Batch resolves TERYT addresses for an array of inputs in O(1) bulk database queries
 * instead of making O(N) queries per individual record.
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

    const streetMap = new Map<number, LocationStreet>();
    if (streetIds.size > 0) {
        const streets = await streetRepo.find({
            where: { id: In(Array.from(streetIds)) },
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
        });
        for (const street of streets) {
            streetMap.set(street.id, street);
        }
    }

    const remainingCityIds = new Set<number>();
    for (const input of inputs) {
        const street = input.streetId ? streetMap.get(input.streetId) : null;
        if (!street?.city && input.cityId) {
            remainingCityIds.add(input.cityId);
        }
    }

    const cityMap = new Map<number, LocationCity>();
    if (remainingCityIds.size > 0) {
        const cities = await cityRepo.find({
            where: { id: In(Array.from(remainingCityIds)) },
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
        });
        for (const city of cities) {
            cityMap.set(city.id, city);
        }
    }

    const remainingCommuneIds = new Set<number>();
    for (const input of inputs) {
        const street = input.streetId ? streetMap.get(input.streetId) : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
        if (!street?.commune && !city?.commune && input.communeId) {
            remainingCommuneIds.add(input.communeId);
        }
    }

    const communeMap = new Map<number, LocationCommune>();
    if (remainingCommuneIds.size > 0) {
        const communes = await communeRepo.find({
            where: { id: In(Array.from(remainingCommuneIds)) },
            relations: {
                district: {
                    state: true,
                },
            },
        });
        for (const commune of communes) {
            communeMap.set(commune.id, commune);
        }
    }

    const remainingDistrictIds = new Set<number>();
    for (const input of inputs) {
        const street = input.streetId ? streetMap.get(input.streetId) : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) : null);
        if (!commune?.district && !city?.district && input.districtId) {
            remainingDistrictIds.add(input.districtId);
        }
    }

    const districtMap = new Map<number, LocationDistrict>();
    if (remainingDistrictIds.size > 0) {
        const districts = await districtRepo.find({
            where: { id: In(Array.from(remainingDistrictIds)) },
            relations: {
                state: true,
            },
        });
        for (const district of districts) {
            districtMap.set(district.id, district);
        }
    }

    const remainingStateIds = new Set<number>();
    for (const input of inputs) {
        const street = input.streetId ? streetMap.get(input.streetId) : null;
        const city = street?.city ?? (input.cityId ? cityMap.get(input.cityId) : null);
        const commune = street?.commune ?? city?.commune ?? (input.communeId ? communeMap.get(input.communeId) : null);
        const district = commune?.district ?? city?.district ?? (input.districtId ? districtMap.get(input.districtId) : null);
        if (!district?.state && input.stateId) {
            remainingStateIds.add(input.stateId);
        }
    }

    const stateMap = new Map<number, LocationState>();
    if (remainingStateIds.size > 0) {
        const states = await stateRepo.find({
            where: { id: In(Array.from(remainingStateIds)) },
        });
        for (const state of states) {
            stateMap.set(state.id, state);
        }
    }

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
