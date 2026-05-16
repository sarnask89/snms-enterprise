import { Router } from "express";
import { AppDataSource } from "../database.js";
import { LocationCity, LocationCommune } from "../models/location.js";
import { getDefaultArea, getDefaultCityForCommune, serializeDefaultArea } from "../teryt_defaults.js";

export const router = Router();

const cityRepo = AppDataSource.getRepository(LocationCity);
const communeRepo = AppDataSource.getRepository(LocationCommune);

function serializeManagedCity(city: LocationCity) {
    return {
        id: city.id,
        name: city.name,
        terytCode: city.terytCode ?? null,
        communeId: city.communeId ?? null,
        isManaged: city.isManaged,
        isDefault: city.isDefault,
    };
}

function serializeCommune(commune: LocationCommune) {
    return {
        id: commune.id,
        name: commune.name,
        terytCode: commune.terytCode ?? null,
        communeCode: commune.communeCode ?? null,
        communeType: commune.communeType ?? null,
        districtId: commune.districtId,
        isManaged: commune.isManaged,
        isDefault: commune.isDefault,
    };
}

router.get("/cities", async (req, res) => {
    try {
        const managedOnly = String(req.query.managedOnly ?? "").toLowerCase() === "true";

        const qb = cityRepo
            .createQueryBuilder("city")
            .orderBy("city.name", "ASC");

        if (managedOnly) {
            qb.where("city.isManaged = :managed", { managed: true });
        }

        const cities = await qb.getMany();
        res.json(cities.map((city) => serializeManagedCity(city)));
    } catch (error) {
        console.error("Error fetching managed cities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/communes", async (req, res) => {
    try {
        const managedOnly = String(req.query.managedOnly ?? "").toLowerCase() === "true";
        const qb = communeRepo
            .createQueryBuilder("commune")
            .orderBy("commune.name", "ASC");

        if (managedOnly) {
            qb.where("commune.isManaged = :managed", { managed: true });
        }

        const communes = await qb.getMany();
        res.json(communes.map((commune) => serializeCommune(commune)));
    } catch (error) {
        console.error("Error fetching communes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/default-area", async (_req, res) => {
    try {
        const area = await getDefaultArea();
        res.json(serializeDefaultArea(area));
    } catch (error) {
        console.error("Error fetching default area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/cities/:id/set-default", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const city = await cityRepo.findOneBy({ id });
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        await cityRepo
            .createQueryBuilder()
            .update(LocationCity)
            .set({ isDefault: false })
            .execute();

        city.isDefault = true;
        city.isManaged = true;
        await cityRepo.save(city);

        if (city.communeId) {
            const commune = await communeRepo.findOneBy({ id: city.communeId });
            if (commune) {
                commune.isManaged = true;
                await communeRepo.save(commune);
            }
        }

        res.json(serializeManagedCity(city));
    } catch (error) {
        console.error("Error setting default city:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/cities/:id/toggle-managed", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const city = await cityRepo.findOneBy({ id });
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        city.isManaged = !city.isManaged;
        if (!city.isManaged) {
            city.isDefault = false;
        }

        await cityRepo.save(city);
        res.json(serializeManagedCity(city));
    } catch (error) {
        console.error("Error toggling managed city:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/communes/:id/set-default", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const commune = await communeRepo.findOneBy({ id });
        if (!commune) {
            return res.status(404).json({ message: "Commune not found" });
        }

        await communeRepo
            .createQueryBuilder()
            .update(LocationCommune)
            .set({ isDefault: false })
            .execute();

        commune.isDefault = true;
        commune.isManaged = true;
        await communeRepo.save(commune);

        const defaultCity = await getDefaultCityForCommune(commune.id);
        if (defaultCity) {
            await cityRepo
                .createQueryBuilder()
                .update(LocationCity)
                .set({ isDefault: false })
                .where("commune_id = :communeId", { communeId: commune.id })
                .execute();

            defaultCity.isDefault = true;
            defaultCity.isManaged = true;
            await cityRepo.save(defaultCity);
        }

        res.json(serializeCommune(commune));
    } catch (error) {
        console.error("Error setting default commune:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/communes/:id/toggle-managed", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const commune = await communeRepo.findOneBy({ id });
        if (!commune) {
            return res.status(404).json({ message: "Commune not found" });
        }

        commune.isManaged = !commune.isManaged;
        if (!commune.isManaged) {
            commune.isDefault = false;
        }

        await communeRepo.save(commune);
        res.json(serializeCommune(commune));
    } catch (error) {
        console.error("Error toggling managed commune:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/search-teryt", async (req, res) => {
    try {
        const query = String(req.query.q ?? "").trim();
        if (query.length < 2) {
            return res.json([]);
        }

        const cities = await cityRepo
            .createQueryBuilder("city")
            .where("city.name LIKE :search", { search: `%${query}%` })
            .orderBy("city.name", "ASC")
            .limit(20)
            .getMany();

        res.json(cities.map((city) => ({
            id: city.id,
            name: city.name,
            terytCode: city.terytCode ?? null,
            communeId: city.communeId ?? null,
        })));
    } catch (error) {
        console.error("Error searching TERYT cities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
