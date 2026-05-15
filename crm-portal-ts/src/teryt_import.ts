import { AppDataSource } from "./database.js";
import { LocationCity, LocationDistrict, LocationState, LocationStreet } from "./models/location.js";

const stateRepo = AppDataSource.getRepository(LocationState);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);

function clean(value: string | null | undefined) {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
}

function extractRows(xmlContent: string) {
    return [...xmlContent.matchAll(/<row>([\s\S]*?)<\/row>/gi)].map((match) => match[1] ?? "");
}

function findTag(rowContent: string, tag: string) {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = rowContent.match(regex);
    return clean(match?.[1]);
}

export async function importTercXml(xmlContent: string) {
    const rows = extractRows(xmlContent);
    const statesData = new Map<string, string>();
    const districtsData: Array<{ woj: string; powiat: string; name: string }> = [];

    for (const row of rows) {
        const woj = findTag(row, "WOJ");
        const powiat = findTag(row, "POW");
        const gmina = findTag(row, "GMI");
        const name = findTag(row, "NAZWA");

        if (woj && !powiat && !gmina && name) {
            statesData.set(woj, name);
        } else if (woj && powiat && !gmina && name) {
            districtsData.push({ woj, powiat, name });
        }
    }

    let importedStates = 0;
    let importedDistricts = 0;
    const stateIds = new Map<string, number>();

    for (const [terytCode, name] of statesData.entries()) {
        let state = await stateRepo.findOneBy({ terytCode });
        if (!state) {
            state = stateRepo.create({ name, terytCode });
            await stateRepo.save(state);
            importedStates += 1;
        }
        stateIds.set(terytCode, state.id);
    }

    for (const districtData of districtsData) {
        const stateId = stateIds.get(districtData.woj);
        if (!stateId) {
            continue;
        }

        const existingDistrict = await districtRepo.findOneBy({
            stateId,
            terytCode: districtData.powiat,
        });

        if (!existingDistrict) {
            const district = districtRepo.create({
                stateId,
                name: districtData.name,
                terytCode: districtData.powiat,
            });
            await districtRepo.save(district);
            importedDistricts += 1;
        }
    }

    return { importedStates, importedDistricts };
}

export async function importSimcXml(xmlContent: string) {
    const rows = extractRows(xmlContent);
    let importedCities = 0;

    const districts = await districtRepo.find({ relations: { state: true } });
    const districtMap = new Map<string, number>();
    for (const district of districts) {
        const stateCode = district.state?.terytCode;
        const districtCode = district.terytCode;
        if (stateCode && districtCode) {
            districtMap.set(`${stateCode}:${districtCode}`, district.id);
        }
    }

    for (const row of rows) {
        const woj = findTag(row, "WOJ");
        const powiat = findTag(row, "POW");
        const gmi = findTag(row, "GMI");
        const rodz = findTag(row, "RODZ_GMI") ?? findTag(row, "RODZ");
        const name = findTag(row, "NAZWA");
        const sym = findTag(row, "SYM");

        if (!woj || !powiat || !name || !sym) {
            continue;
        }

        const districtId = districtMap.get(`${woj}:${powiat}`);
        if (!districtId) {
            continue;
        }

        const existingCity = await cityRepo.findOneBy({ terytCode: sym });
        if (!existingCity) {
            const city = cityRepo.create({
                districtId,
                name,
                terytCode: sym,
                communeCode: gmi ?? undefined,
                communeType: rodz ?? undefined,
            });
            await cityRepo.save(city);
            importedCities += 1;
        }
    }

    return { importedCities };
}

export async function importUlicXml(xmlContent: string) {
    const rows = extractRows(xmlContent);
    let importedStreets = 0;

    const cities = await cityRepo.find();
    const cityMap = new Map<string, number>();
    for (const city of cities) {
        if (city.terytCode) {
            cityMap.set(city.terytCode, city.id);
        }
    }

    for (const row of rows) {
        const sym = findTag(row, "SYM");
        const cecha = findTag(row, "CECHA");
        const nazwa1 = findTag(row, "NAZWA_1");
        const nazwa2 = findTag(row, "NAZWA_2") ?? "";
        const ulic = findTag(row, "SYM_UL");

        if (!sym || !nazwa1 || !ulic) {
            continue;
        }

        const cityId = cityMap.get(sym);
        if (!cityId) {
            continue;
        }

        const name = `${cecha ?? ""} ${nazwa2} ${nazwa1}`.replace(/\s+/g, " ").trim();
        const existingStreet = await streetRepo.findOneBy({ cityId, terytCode: ulic });
        if (!existingStreet) {
            const street = streetRepo.create({
                cityId,
                name,
                terytCode: ulic,
            });
            await streetRepo.save(street);
            importedStreets += 1;
        }
    }

    return { importedStreets };
}
