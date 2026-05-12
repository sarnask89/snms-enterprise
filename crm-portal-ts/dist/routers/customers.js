import { Router } from "express";
import { AppDataSource } from "../database.js";
import { Customer } from "../models/customer.js";
import { Like } from "typeorm";
const router = Router();
router.get("/", async (req, res) => {
    try {
        const { q, skip, limit } = req.query;
        const customerRepo = AppDataSource.getRepository(Customer);
        const queryOptions = {
            order: { id: "DESC" },
            skip: skip ? parseInt(skip) : 0,
            take: limit ? parseInt(limit) : 20,
        };
        if (q) {
            const searchTerm = `%${q}%`;
            queryOptions.where = [
                { customerCode: Like(searchTerm) },
                { firstName: Like(searchTerm) },
                { lastName: Like(searchTerm) },
                { email: Like(searchTerm) },
            ];
        }
        const [customers, total] = await customerRepo.findAndCount(queryOptions);
        res.set("X-Total-Count", total.toString());
        res.json(customers);
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export { router };
//# sourceMappingURL=customers.js.map