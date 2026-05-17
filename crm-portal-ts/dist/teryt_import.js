import { AppDataSource } from "./database.js";
import { LocationCity, LocationCommune, LocationDistrict, LocationState, LocationStreet, } from "./models/location.js";
const stateRepo = AppDataSource.getRepository(LocationState);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const communeRepo = AppDataSource.getRepository(LocationCommune);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);
const STATE_NAME_BY_TERYT_CODE = {
    "02": "Dolnośląskie",
    "04": "Kujawsko-Pomorskie",
    "06": "Lubelskie",
    "08": "Lubuskie",
    "10": "Łódzkie",
    "12": "Małopolskie",
    "14": "Mazowieckie",
    "16": "Opolskie",
    "18": "Podkarpackie",
    "20": "Podlaskie",
    "22": "Pomorskie",
    "24": "Śląskie",
    "26": "Świętokrzyskie",
    "28": "Warmińsko-Mazurskie",
    "30": "Wielkopolskie",
    "32": "Zachodniopomorskie",
};
function clean(value) {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
}
function titleCase(name) {
    if (!name) {
        return null;
    }
    return name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
function extractRows(xmlContent) {
    return [...xmlContent.matchAll(/<row>([\s\S]*?)<\/row>/gi)].map((match) => match[1] ?? "");
}
function findTag(rowContent, tag) {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = rowContent.match(regex);
    return clean(match?.[1]);
}
function makeCommuneKey(woj, powiat, gmina, rodz) {
    return `${woj}:${powiat}:${gmina}:${rodz ?? ""}`;
}
function makeCommuneTerytCode(woj, powiat, gmina, rodz) {
    return `${woj}${powiat}${gmina}${rodz ?? ""}`;
}
export async function importTercXml(xmlContent) {
    const rows = extractRows(xmlContent);
    const statesData = new Map();
    const districtsData = [];
    const communesData = [];
    const fallbackStateCodes = new Set();
    for (const row of rows) {
        const woj = findTag(row, "WOJ");
        const powiat = findTag(row, "POW");
        const gmina = findTag(row, "GMI");
        const rodz = findTag(row, "RODZ");
        const name = titleCase(findTag(row, "NAZWA"));
        if (woj && !powiat && !gmina && name) {
            statesData.set(woj, name);
        }
        else if (woj && powiat && !gmina && name) {
            districtsData.push({ woj, powiat, name });
            fallbackStateCodes.add(woj);
        }
        else if (woj && powiat && gmina && name) {
            communesData.push({ woj, powiat, gmina, rodz, name });
            fallbackStateCodes.add(woj);
        }
    }
    for (const woj of fallbackStateCodes) {
        if (!statesData.has(woj) && STATE_NAME_BY_TERYT_CODE[woj]) {
            statesData.set(woj, STATE_NAME_BY_TERYT_CODE[woj]);
        }
    }
    let importedStates = 0;
    let importedDistricts = 0;
    let importedCommunes = 0;
    const stateIds = new Map();
    const districtIds = new Map();
    for (const [terytCode, name] of statesData.entries()) {
        let state = await stateRepo.findOneBy({ terytCode });
        if (!state) {
            state = stateRepo.create({ name, terytCode });
            await stateRepo.save(state);
            importedStates += 1;
        }
        else if (state.name !== name) {
            state.name = name;
            await stateRepo.save(state);
        }
        stateIds.set(terytCode, state.id);
    }
    for (const districtData of districtsData) {
        const stateId = stateIds.get(districtData.woj);
        if (!stateId) {
            continue;
        }
        const districtKey = `${districtData.woj}:${districtData.powiat}`;
        let district = await districtRepo.findOneBy({
            stateId,
            terytCode: districtData.powiat,
        });
        if (!district) {
            district = districtRepo.create({
                stateId,
                name: districtData.name,
                terytCode: districtData.powiat,
            });
            await districtRepo.save(district);
            importedDistricts += 1;
        }
        else if (district.name !== districtData.name) {
            district.name = districtData.name;
            await districtRepo.save(district);
        }
        districtIds.set(districtKey, district.id);
    }
    for (const communeData of communesData) {
        const districtId = districtIds.get(`${communeData.woj}:${communeData.powiat}`);
        if (!districtId) {
            continue;
        }
        const terytCode = makeCommuneTerytCode(communeData.woj, communeData.powiat, communeData.gmina, communeData.rodz);
        let commune = await communeRepo.findOneBy({ terytCode });
        if (!commune) {
            commune = communeRepo.create({
                districtId,
                name: communeData.name,
                terytCode,
                communeCode: communeData.gmina,
                communeType: communeData.rodz ?? undefined,
            });
            await communeRepo.save(commune);
            importedCommunes += 1;
        }
        else {
            commune.districtId = districtId;
            commune.name = communeData.name;
            commune.communeCode = communeData.gmina;
            commune.communeType = communeData.rodz ?? undefined;
            await communeRepo.save(commune);
        }
    }
    return { importedStates, importedDistricts, importedCommunes };
}
export async function importSimcXml(xmlContent) {
    const rows = extractRows(xmlContent);
    let importedCities = 0;
    const districts = await districtRepo.find({ relations: { state: true } });
    const districtMap = new Map();
    for (const district of districts) {
        const stateCode = district.state?.terytCode;
        const districtCode = district.terytCode;
        if (stateCode && districtCode) {
            districtMap.set(`${stateCode}:${districtCode}`, district.id);
        }
    }
    const communes = await communeRepo.find({ relations: { district: { state: true } } });
    const communeMap = new Map();
    for (const commune of communes) {
        const stateCode = commune.district?.state?.terytCode;
        const districtCode = commune.district?.terytCode;
        if (stateCode && districtCode && commune.communeCode) {
            communeMap.set(makeCommuneKey(stateCode, districtCode, commune.communeCode, commune.communeType ?? null), commune.id);
        }
    }
    for (const row of rows) {
        const woj = findTag(row, "WOJ");
        const powiat = findTag(row, "POW");
        const gmi = findTag(row, "GMI");
        const rodz = findTag(row, "RODZ_GMI") ?? findTag(row, "RODZ");
        const name = titleCase(findTag(row, "NAZWA"));
        const sym = findTag(row, "SYM");
        if (!woj || !powiat || !name || !sym) {
            continue;
        }
        const districtId = districtMap.get(`${woj}:${powiat}`);
        if (!districtId) {
            continue;
        }
        const communeId = gmi
            ? communeMap.get(makeCommuneKey(woj, powiat, gmi, rodz))
            : undefined;
        const existingCity = await cityRepo.findOneBy({ terytCode: sym });
        if (!existingCity) {
            const city = cityRepo.create({
                districtId,
                communeId,
                name,
                terytCode: sym,
                communeCode: gmi ?? undefined,
                communeType: rodz ?? undefined,
            });
            await cityRepo.save(city);
            importedCities += 1;
        }
        else {
            existingCity.districtId = districtId;
            existingCity.communeId = communeId;
            existingCity.name = name;
            existingCity.communeCode = gmi ?? undefined;
            existingCity.communeType = rodz ?? undefined;
            await cityRepo.save(existingCity);
        }
    }
    return { importedCities };
}
export async function importUlicXml(xmlContent) {
    const rows = extractRows(xmlContent);
    let importedStreets = 0;
    const cities = await cityRepo.find();
    const cityMap = new Map();
    for (const city of cities) {
        if (city.terytCode) {
            cityMap.set(city.terytCode, city);
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
        const city = cityMap.get(sym);
        if (!city) {
            continue;
        }
        const name = `${cecha ?? ""} ${nazwa2} ${nazwa1}`.replace(/\s+/g, " ").trim();
        const existingStreet = await streetRepo.findOneBy({ cityId: city.id, terytCode: ulic });
        if (!existingStreet) {
            const street = streetRepo.create({
                cityId: city.id,
                communeId: city.communeId,
                name,
                terytCode: ulic,
            });
            await streetRepo.save(street);
            importedStreets += 1;
        }
        else {
            existingStreet.name = name;
            existingStreet.communeId = city.communeId;
            await streetRepo.save(existingStreet);
        }
    }
    return { importedStreets };
}
//# sourceMappingURL=teryt_import.js.map