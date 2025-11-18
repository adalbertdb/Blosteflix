import { Router } from "express";
export const createUserRouter = (controller) => {
    const router = Router();
    router.get('/:topic', controller.getByTopic.bind(controller));
    router.get('/', controller.getById.bind(controller));
    router.get('/:id', controller.getById.bind(controller));
    return router;
};
//# sourceMappingURL=router.js.map