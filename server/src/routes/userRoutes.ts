import express from "express";
import { loginUser } from "./controllers/userController";

const router = express.Router();

router.route("/login").get(loginUser);

export default router;
