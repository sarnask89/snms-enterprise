import { Router } from 'express';
import { router as customersRouter } from './routers/customers.js';
export function getCoreRouter() {
    const router = Router();
    // v1 API routes
    const v1Router = Router();
    v1Router.use('/customers', customersRouter);
    router.use('/v1', v1Router);
    return router;
}
//# sourceMappingURL=router_aggregator.js.map