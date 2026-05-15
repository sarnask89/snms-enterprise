import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { LocationCity, LocationDistrict, LocationState, LocationStreet } from "../models/location.js";
import { importSimcXml, importTercXml, importUlicXml } from "../teryt_import.js";

export const router = Router();

const stateRepo = AppDataSource.getRepository(LocationState);
const cityRepo = AppDataSource.getRepository(LocationCity);
const streetRepo = AppDataSource.getRepository(LocationStreet);

type CityWithRelations = LocationCity & {
    district?: LocationDistrict;
    streets?: LocationStreet[];
};

function serializeState(state: LocationState) {
    return {
        id: state.id,
        name: state.name,
        terytCode: state.terytCode ?? null,
        isActive: state.isActive,
    };
}

function serializeCity(city: CityWithRelations) {
    const district = city.district;
    return {
        id: city.id,
        name: city.name,
        terytCode: city.terytCode ?? null,
        communeCode: city.communeCode ?? null,
        communeType: city.communeType ?? null,
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
    };
}

function serializeStreet(street: LocationStreet) {
    return {
        id: street.id,
        cityId: street.cityId,
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

router.get("/cities", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();

        const qb = cityRepo
            .createQueryBuilder("city")
            .leftJoinAndSelect("city.district", "district")
            .leftJoinAndSelect("city.streets", "street")
            .orderBy("city.name", "ASC");

        if (search) {
            qb.where(new Brackets((subQuery) => {
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
        const search = String(req.query.q ?? "").trim();

        const qb = streetRepo
            .createQueryBuilder("street")
            .orderBy("street.name", "ASC");

        if (Number.isFinite(cityId)) {
            qb.where("street.cityId = :cityId", { cityId });
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

        if (search.length < 2) {
            return res.json([]);
        }

        if (kind === "street") {
            const cityId = Number.parseInt(String(req.query.cityId ?? req.query.location_city_id ?? ""), 10);
            if (!Number.isFinite(cityId)) {
                return res.json([]);
            }

            const streets = await streetRepo
                .createQueryBuilder("street")
                .where("street.cityId = :cityId", { cityId })
                .andWhere("street.name LIKE :search", { search: `%${search}%` })
                .orderBy("street.name", "ASC")
                .limit(20)
                .getMany();

            return res.json(streets.map((street) => ({
                id: street.id,
                text: street.name,
                type: "street",
            })));
        }

        const cities = await cityRepo
            .createQueryBuilder("city")
            .where("city.name LIKE :search", { search: `%${search}%` })
            .orderBy("city.name", "ASC")
            .limit(20)
            .getMany();

        res.json(cities.map((city) => ({
            id: city.id,
            text: city.name,
            type: "city",
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
