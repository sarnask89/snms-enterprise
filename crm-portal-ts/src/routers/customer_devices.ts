import { Router } from "express";
import { AppDataSource } from "../database.js";
import { CustomerDevice } from "../models/network.js";
import { ILike } from "typeorm";

export const router = Router();
const deviceRepo = AppDataSource.getRepository(CustomerDevice);

// GET /api/v1/customer-devices
router.get("/", async (req, res) => {
    try {
        const { q, skip, limit } = req.query;
        const search = q as string;
        const skipNum = parseInt(skip as string) || 0;
        const limitNum = parseInt(limit as string) || 20;

        let where = {};
        if (search) {
            where = [
                { hostname: ILike(`%${search}%`) },
                { ipAddress: ILike(`%${search}%`) },
                { macAddress: ILike(`%${search}%`) }
            ];
        }

        const [items, total] = await deviceRepo.findAndCount({
            where,
            skip: skipNum,
            take: limitNum,
            relations: ["customer"],
            order: { hostname: "ASC" }
        });

        res.set('X-Total-Count', total.toString());
        res.json(items);
    } catch (error) {
        console.error("Error fetching customer devices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/v1/customer-devices/:id
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const device = await deviceRepo.findOne({
            where: { id },
            relations: ["customer"]
        });

        if (!device) return res.status(404).json({ message: "Device not found" });
        res.json(device);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/v1/customer-devices
router.post("/", async (req, res) => {
    try {
        const device = deviceRepo.create(req.body);
        await deviceRepo.save(device);
        res.status(201).json(device);
    } catch (error) {
        res.status(400).json({ message: "Failed to create device" });
    }
});

// PUT /api/v1/customer-devices/:id
router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let device = await deviceRepo.findOneBy({ id });
        if (!device) return res.status(404).json({ message: "Device not found" });

        deviceRepo.merge(device, req.body);
        await deviceRepo.save(device);
        res.json(device);
    } catch (error) {
        res.status(400).json({ message: "Failed to update device" });
    }
});

// DELETE /api/v1/customer-devices/:id
router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await deviceRepo.delete(id);
        if (result.affected === 0) return res.status(404).json({ message: "Device not found" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
