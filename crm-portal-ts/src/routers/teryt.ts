import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import {
    LocationCity,
    LocationCommune,
    LocationDistrict,
    LocationState,
    LocationStreet,
} from "../models/location.js";
import { importSimcXml, importTercXml, importUlicXml } from "../teryt_import.js";

export const router = Router();

const stateRepo = AppDataSource.getRepository(LocationState);
const districtRepo = AppDataSource.getRepository(LocationDistrict);
const communeRepo = AppDataSource.getRepository(LocationCommune);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);

type CityWithRelations = LocationCity & {
    district?: LocationDistrict;
    commune?: LocationCommune | null;
    streets?: LocationStreet[];
};

type CommuneWithRelations = LocationCommune & {
    district?: LocationDistrict & {
        state?: LocationState;
    };
};

function serializeState(state: LocationState) {
    return {
        id: state.id,
        name: state.name,
        terytCode: state.terytCode ?? null,
        isActive: state.isActive,
    };
}

function serializeDistrict(district: LocationDistrict) {
    return {
        id: district.id,
        stateId: district.stateId,
        name: district.name,
        terytCode: district.terytCode ?? null,
        isActive: district.isActive,
    };
}

function serializeCommune(commune: CommuneWithRelations) {
    return {
        id: commune.id,
        districtId: commune.districtId,
        name: commune.name,
        terytCode: commune.terytCode ?? null,
        communeCode: commune.communeCode ?? null,
        communeType: commune.communeType ?? null,
        isManaged: commune.isManaged,
        isDefault: commune.isDefault,
        isActive: commune.isActive,
        district: commune.district
            ? {
                id: commune.district.id,
                name: commune.district.name,
                terytCode: commune.district.terytCode ?? null,
                stateId: commune.district.stateId,
                state: commune.district.state
                    ? {
                        id: commune.district.state.id,
                        name: commune.district.state.name,
                        terytCode: commune.district.state.terytCode ?? null,
                    }
                    : null,
            }
            : null,
    };
}

function serializeCity(city: CityWithRelations) {
    const district = city.district;
    const commune = city.commune;
    return {
        id: city.id,
        name: city.name,
        terytCode: city.terytCode ?? null,
        communeCode: city.communeCode ?? null,
        communeType: city.communeType ?? null,
        communeId: city.communeId ?? null,
        isManaged: city.isManaged,
        isDefault: city.isDefault,
        isActive: city.isActive,
        streetCount: city.streets?.length ?? 0,
        district: district
            ? {
                id: district.id,
                name: district.name,
                terytCode: district.terytCode ?? null,
                stateId: district.stateId,
            }
            : null,
        commune: commune
            ? {
                id: commune.id,
                name: commune.name,
                terytCode: commune.terytCode ?? null,
                communeCode: commune.communeCode ?? null,
                communeType: commune.communeType ?? null,
            }
            : null,
    };
}

function serializeStreet(street: LocationStreet) {
    return {
        id: street.id,
        cityId: street.cityId,
        communeId: street.communeId ?? null,
        name: street.name,
        terytCode: street.terytCode ?? null,
    };
}

router.get("/states", async (_req, res) => {
    try {
        const states = await stateRepo.find({ order: { name: "ASC" } });
        res.json(states.map((state) => serializeState(state)));
    } catch (error) {
        console.error("Error fetching states:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/districts", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const stateId = Number.parseInt(String(req.query.stateId ?? ""), 10);

        const qb = districtRepo
            .createQueryBuilder("district")
            .orderBy("district.name", "ASC");

        if (Number.isFinite(stateId)) {
            qb.where("district.stateId = :stateId", { stateId });
        }

        if (search) {
            qb.andWhere("district.name LIKE :search", { search: `%${search}%` });
        }

        const districts = await qb.getMany();
        res.json(districts.map((district) => serializeDistrict(district)));
    } catch (error) {
        console.error("Error fetching districts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/communes", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const districtId = Number.parseInt(String(req.query.districtId ?? ""), 10);
        const stateId = Number.parseInt(String(req.query.stateId ?? ""), 10);

        const qb = communeRepo
            .createQueryBuilder("commune")
            .leftJoinAndSelect("commune.district", "district")
            .leftJoinAndSelect("district.state", "state")
            .orderBy("commune.name", "ASC");

        if (Number.isFinite(districtId)) {
            qb.where("commune.districtId = :districtId", { districtId });
        } else if (Number.isFinite(stateId)) {
            qb.where("district.stateId = :stateId", { stateId });
        }

        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("commune.name LIKE :search", { search: `%${search}%` })
                    .orWhere("commune.terytCode LIKE :search", { search: `%${search}%` });
            }));
        }

        const communes = await qb.getMany();
        res.json(communes.map((commune) => serializeCommune(commune)));
    } catch (error) {
        console.error("Error fetching communes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/cities", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const districtId = Number.parseInt(String(req.query.districtId ?? ""), 10);
        const communeId = Number.parseInt(String(req.query.communeId ?? ""), 10);

        const qb = cityRepo
            .createQueryBuilder("city")
            .leftJoinAndSelect("city.district", "district")
            .leftJoinAndSelect("city.commune", "commune")
            .leftJoinAndSelect("city.streets", "street")
            .orderBy("city.name", "ASC");

        if (Number.isFinite(communeId)) {
            qb.where("city.communeId = :communeId", { communeId });
        } else if (Number.isFinite(districtId)) {
            qb.where("city.districtId = :districtId", { districtId });
        }

        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("city.name LIKE :search", { search: `%${search}%` })
                    .orWhere("city.terytCode LIKE :search", { search: `%${search}%` });
            }));
        }

        const cities = await qb.getMany();
        res.json(cities.map((city) => serializeCity(city)));
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/streets", async (req, res) => {
    try {
        const cityId = Number.parseInt(String(req.query.cityId ?? ""), 10);
        const communeId = Number.parseInt(String(req.query.communeId ?? ""), 10);
        const search = String(req.query.q ?? "").trim();

        const qb = streetRepo
            .createQueryBuilder("street")
            .orderBy("street.name", "ASC");

        if (Number.isFinite(cityId)) {
            qb.where("street.cityId = :cityId", { cityId });
        }

        if (Number.isFinite(communeId)) {
            const clause = qb.expressionMap.wheres.length > 0 ? "andWhere" : "where";
            qb[clause]("street.communeId = :communeId", { communeId });
        }

        if (search) {
            qb.andWhere("street.name LIKE :search", { search: `%${search}%` });
        }

        const streets = await qb.getMany();
        res.json(streets.map((street) => serializeStreet(street)));
    } catch (error) {
        console.error("Error fetching streets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/suggest", async (req, res) => {
    try {
        const kind = String(req.query.kind ?? "city").trim();
        const search = String(req.query.q ?? req.query.street_name ?? "").trim();
        const managedOnly = String(req.query.managedOnly ?? "").toLowerCase() === "true";

        if (search.length < 2) {
            return res.json([]);
        }

        if (kind === "state") {
            const states = await stateRepo
                .createQueryBuilder("state")
                .where("state.name LIKE :search", { search: `%${search}%` })
                .orderBy("state.name", "ASC")
                .limit(20)
                .getMany();

            return res.json(states.map((state) => ({
                id: state.id,
                text: state.name,
                type: "state",
                terytCode: state.terytCode ?? null,
            })));
        }

        if (kind === "district") {
            const stateId = Number.parseInt(String(req.query.stateId ?? ""), 10);
            const qb = districtRepo
                .createQueryBuilder("district")
                .where("district.name LIKE :search", { search: `%${search}%` })
                .orderBy("district.name", "ASC")
                .limit(20);

            if (Number.isFinite(stateId)) {
                qb.andWhere("district.stateId = :stateId", { stateId });
            }

            const districts = await qb.getMany();
            return res.json(districts.map((district) => ({
                id: district.id,
                text: district.name,
                type: "district",
                stateId: district.stateId,
                terytCode: district.terytCode ?? null,
            })));
        }

        if (kind === "commune") {
            const districtId = Number.parseInt(String(req.query.districtId ?? ""), 10);
            const stateId = Number.parseInt(String(req.query.stateId ?? ""), 10);

            const qb = communeRepo
                .createQueryBuilder("commune")
                .leftJoinAndSelect("commune.district", "district")
                .leftJoinAndSelect("district.state", "state")
                .where("commune.name LIKE :search", { search: `%${search}%` })
                .orderBy("commune.name", "ASC")
                .limit(20);

            if (Number.isFinite(districtId)) {
                qb.andWhere("commune.districtId = :districtId", { districtId });
            } else if (Number.isFinite(stateId)) {
                qb.andWhere("district.stateId = :stateId", { stateId });
            }

            const communes = await qb.getMany();
            return res.json(communes.map((commune) => ({
                id: commune.id,
                text: commune.name,
                type: "commune",
                districtId: commune.districtId,
                districtName: commune.district?.name ?? null,
                stateId: commune.district?.stateId ?? null,
                stateName: commune.district?.state?.name ?? null,
                communeCode: commune.communeCode ?? null,
                communeType: commune.communeType ?? null,
                terytCode: commune.terytCode ?? null,
            })));
        }

        if (kind === "street") {
            const cityId = Number.parseInt(String(req.query.cityId ?? req.query.location_city_id ?? ""), 10);
            const communeId = Number.parseInt(String(req.query.communeId ?? ""), 10);

            const qb = streetRepo
                .createQueryBuilder("street")
                .leftJoin("street.city", "city")
                .where("street.name LIKE :search", { search: `%${search}%` })
                .orderBy("street.name", "ASC")
                .limit(20);

            if (Number.isFinite(cityId)) {
                qb.andWhere("street.cityId = :cityId", { cityId });
            }
            if (Number.isFinite(communeId)) {
                qb.andWhere("street.communeId = :communeId", { communeId });
            }
            if (managedOnly) {
                qb.andWhere("city.isManaged = :managed", { managed: true });
            }

            const streets = await qb.getMany();
            return res.json(streets.map((street) => ({
                id: street.id,
                text: street.name,
                type: "street",
                cityId: street.cityId,
                communeId: street.communeId ?? null,
                terytCode: street.terytCode ?? null,
            })));
        }

        const communeId = Number.parseInt(String(req.query.communeId ?? ""), 10);
        const districtId = Number.parseInt(String(req.query.districtId ?? ""), 10);
        const qb = cityRepo
            .createQueryBuilder("city")
            .leftJoinAndSelect("city.district", "district")
            .leftJoinAndSelect("city.commune", "commune")
            .leftJoinAndSelect("district.state", "state")
            .where("city.name LIKE :search", { search: `%${search}%` })
            .orderBy("city.name", "ASC")
            .limit(20);

        if (Number.isFinite(communeId)) {
            qb.andWhere("city.communeId = :communeId", { communeId });
        } else if (Number.isFinite(districtId)) {
            qb.andWhere("city.districtId = :districtId", { districtId });
        }
        if (managedOnly) {
            qb.andWhere("city.isManaged = :managed", { managed: true });
        }

        const cities = await qb.getMany();
        res.json(cities.map((city) => ({
            id: city.id,
            text: city.name,
            type: "city",
            districtId: city.districtId,
            districtName: city.district?.name ?? null,
            communeId: city.communeId ?? null,
            communeName: city.commune?.name ?? null,
            stateId: city.district?.stateId ?? null,
            stateName: city.district?.state?.name ?? null,
            terytCode: city.terytCode ?? null,
        })));
    } catch (error) {
        console.error("Error fetching TERYT suggestions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/import/terc", async (req, res) => {
    try {
        const xmlContent = String(req.body?.xmlContent ?? "");
        if (!xmlContent.trim()) {
            return res.status(400).json({ message: "xmlContent is required" });
        }

        res.json(await importTercXml(xmlContent));
    } catch (error) {
        console.error("Error importing TERC:", error);
        res.status(400).json({ message: "Failed to import TERC XML" });
    }
});

router.post("/import/simc", async (req, res) => {
    try {
        const xmlContent = String(req.body?.xmlContent ?? "");
        if (!xmlContent.trim()) {
            return res.status(400).json({ message: "xmlContent is required" });
        }

        res.json(await importSimcXml(xmlContent));
    } catch (error) {
        console.error("Error importing SIMC:", error);
        res.status(400).json({ message: "Failed to import SIMC XML" });
    }
});

router.post("/import/ulic", async (req, res) => {
    try {
        const xmlContent = String(req.body?.xmlContent ?? "");
        if (!xmlContent.trim()) {
            return res.status(400).json({ message: "xmlContent is required" });
        }

        res.json(await importUlicXml(xmlContent));
    } catch (error) {
        console.error("Error importing ULIC:", error);
        res.status(400).json({ message: "Failed to import ULIC XML" });
    }
});

router.post("/sync-geoportal", async (req, res) => {
    try {
        const cityId = Number.parseInt(String(req.body?.cityId ?? ""), 10);
        const city = Number.isFinite(cityId)
            ? await cityRepo.findOneBy({ id: cityId })
            : null;

        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        const streets = await streetRepo.countBy({ cityId: city.id });
        res.json({
            cityId: city.id,
            cityName: city.name,
            scheduled: true,
            streets,
            syncedBuildings: 0,
        });
    } catch (error) {
        console.error("Error scheduling geoportal sync:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
