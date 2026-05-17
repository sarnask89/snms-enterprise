import { AppDataSource } from "./database.js";
import { LocationCity, LocationCommune, LocationDistrict, LocationState } from "./models/location.js";
const communeRepo = AppDataSource.getRepository(LocationCommune);
const cityRepo = AppDataSource.getRepository(LocationCity);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const stateRepo = AppDataSource.getRepository(LocationState);
export async function getDefaultCityForCommune(communeId) {
    const preferred = await cityRepo.findOne({
        where: { communeId, isDefault: true },
        order: { name: "ASC" },
    });
    if (preferred) {
        return preferred;
    }
    return await cityRepo.findOne({
        where: { communeId },
        order: { name: "ASC" },
    });
}
export async function getDefaultArea() {
    const commune = await communeRepo.findOne({
        where: { isDefault: true },
        order: { name: "ASC" },
    });
    if (!commune) {
        return null;
    }
    const city = await getDefaultCityForCommune(commune.id);
    const district = await districtRepo.findOneBy({ id: commune.districtId });
    const state = district ? await stateRepo.findOneBy({ id: district.stateId }) : null;
    return {
        state,
        district,
        commune,
        city: city ?? null,
    };
}
export function serializeDefaultArea(area) {
    if (!area) {
        return {
            state: null,
            district: null,
            commune: null,
            city: null,
        };
    }
    return {
        state: area.state
            ? {
                id: area.state.id,
                name: area.state.name,
                terytCode: area.state.terytCode ?? null,
            }
            : null,
        district: area.district
            ? {
                id: area.district.id,
                name: area.district.name,
                terytCode: area.district.terytCode ?? null,
            }
            : null,
        commune: area.commune
            ? {
                id: area.commune.id,
                name: area.commune.name,
                terytCode: area.commune.terytCode ?? null,
                communeCode: area.commune.communeCode ?? null,
                communeType: area.commune.communeType ?? null,
            }
            : null,
        city: area.city
            ? {
                id: area.city.id,
                name: area.city.name,
                terytCode: area.city.terytCode ?? null,
            }
            : null,
    };
}
//# sourceMappingURL=teryt_defaults.js.map