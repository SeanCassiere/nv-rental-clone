import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken";
import dotenv from "dotenv";
import { getNavotarAccessToken } from "./navotarController";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
/**
 * @desc Login and Return Tokens
 * @route GET /api/users/login
 * @access PUBLIC
 */
const loginUser = asyncHandler(async (_, res) => {
	try {
		const navotar_access = await getNavotarAccessToken(CLIENT_ID, CLIENT_SECRET);
		const refreshToken = generateToken("1234567890");
		res.status(200).json({ token: navotar_access, refreshToken, message: "Success" });
	} catch (error) {
		throw new Error(error);
	}
});

export { loginUser };
