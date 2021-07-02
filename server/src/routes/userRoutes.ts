import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { loginUser, refreshNavotarToken } from "./controllers/userController";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/navotar/refresh").get(protect, refreshNavotarToken);

export default router;
