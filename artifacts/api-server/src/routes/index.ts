import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import submissionsRouter from "./submissions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(submissionsRouter);

export default router;
