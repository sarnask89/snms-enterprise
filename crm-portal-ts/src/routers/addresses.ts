import { Router } from "express";
import { AppDataSource } from "../database.js";
import { LocationCity } from "../models/location.js";

export const router = Router();

const cityRepo = AppDataSource.getRepository(LocationCity);

function serializeManagedCity(city: LocationCity) {
    return {
        id: city.id,
        name: city.name,
        terytCode: city.terytCode ?? null,
        isManaged: city.isManaged,
        isDefault: city.isDefault,
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
        })));
    } catch (error) {
        console.error("Error searching TERYT cities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
