import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getClientFeatures, getNavotarAccessToken } from "./navotarController";
import { JWTReturnAuthToken } from "../../interfaces/interfaces";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
/**
 * @desc Login and Return Tokens
 * @route GET /api/users/login
 * @access PUBLIC
 */
const loginUser = asyncHandler(async (_, res) => {
	let navotar_access;
	let navotar_client_id;
	let refresh_token;

	try {
		navotar_access = await getNavotarAccessToken(CLIENT_ID, CLIENT_SECRET);
	} catch (error) {
		throw new Error("There was an error during login");
	}

	try {
		const decoded = jwt.decode(navotar_access) as JWTReturnAuthToken;
		const { client_navotar_clientid } = decoded;
		navotar_client_id = client_navotar_clientid;
	} catch (error) {
		throw new Error("Could not decode the access token");
	}

	const navotar_features = await getClientFeatures("1013", navotar_access);

	try {
		refresh_token = generateToken("1234567890");
	} catch (error) {
		throw new Error("Could not generate the refresh token");
	}

	res
		.status(200)
		.json({ message: "Success", token: navotar_access, refreshToken: refresh_token, features: navotar_features });
});

/**
 * @desc Refresh Navotar Token using Server Token
 * @route GET /api/users/navotar/refresh
 * @access PRIVATE
 */
const refreshNavotarToken = asyncHandler(async (_, res) => {
	try {
		const navotar_access = await getNavotarAccessToken(CLIENT_ID, CLIENT_SECRET);
		res.status(200).json({ token: navotar_access, message: "Success" });
	} catch (error) {
		throw new Error("There was an error when refreshing your token");
	}
});

export { loginUser, refreshNavotarToken };
