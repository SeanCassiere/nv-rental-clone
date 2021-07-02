import { Request } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";

import { TokenInterface } from "../../middlewares/authMiddleware";
import { getNavotarAccessToken } from "./navotarController";
import { JSONServerUser, JWTReturnAuthToken } from "../../interfaces/interfaces";

dotenv.config();

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "";
/**
 * @desc Login and Return Tokens
 * @route POST /api/users/login
 * @access PUBLIC
 */
const loginUser = asyncHandler(async (req, res) => {
	let foundUser: JSONServerUser | null = null;
	let credentials = {
		username: "",
		password: "",
	};

	let navotar_access;
	let navotar_client_id;
	let refresh_token;

	//Checking fields from post body
	try {
		const { username, password } = req.body;
		credentials = {
			username,
			password,
		};
	} catch (error) {
		res.status(400);
		throw new Error("Required username and password field not received");
	}

	//Fetching user from DB
	try {
		const { data } = await axios.get<JSONServerUser[]>(`${JSON_SERVER_URL}/users?username=${credentials.username}`);

		if (data[0].password !== credentials.password) {
			res.status(400);
			throw new Error("Password incorrect");
		}

		foundUser = data[0];
	} catch (error) {
		res.status(400);
		throw new Error("Username or Password is incorrect");
	}

	if (foundUser === null) throw new Error("User not found");

	//Fetching access token from Navotar Auth server
	try {
		navotar_access = await getNavotarAccessToken(foundUser.api_client_id, foundUser.api_client_secret);
	} catch (error) {
		res.status(400);
		throw new Error("There was an error during login");
	}

	//Decode access token
	try {
		const decoded = jwt.decode(navotar_access) as JWTReturnAuthToken;
		const { client_navotar_clientid } = decoded;
		navotar_client_id = client_navotar_clientid;
	} catch (error) {
		throw new Error("Could not decode the access token");
	}

	// Generating return refresh token
	try {
		refresh_token = generateToken(foundUser.id);
	} catch (error) {
		throw new Error("Could not generate the refresh token");
	}

	return res.status(200).json({ message: "Success", token: navotar_access, refreshToken: refresh_token });
});

/**
 * @desc Refresh Navotar Token using Server Token
 * @route GET /api/users/navotar/refresh
 * @access PRIVATE
 */
const refreshNavotarToken = asyncHandler(async (req: Request, res) => {
	let foundUser: JSONServerUser | null = null;
	let userId: string | null = null;

	//Getting userid from the token
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw new Error("Token not found");
		const decoded = jwt.decode(token) as TokenInterface;
		userId = decoded.id;
	} catch (error) {
		throw new Error("Problem getting the user id from the refresh token");
	}

	//Fetching user from DB
	try {
		const { data } = await axios.get<JSONServerUser[]>(`${JSON_SERVER_URL}/users?id=${userId}`);

		if (data.length === 0) {
			throw new Error("Cannot find user to generate new access token");
		}

		foundUser = data[0];
	} catch (error) {
		throw new Error("User not found");
	}

	if (foundUser === null) throw new Error("User not found");

	try {
		const navotar_access = await getNavotarAccessToken(foundUser.api_client_id, foundUser.api_client_secret);
		res.status(200).json({ token: navotar_access, message: "Success" });
	} catch (error) {
		throw new Error("There was an error when refreshing your token");
	}
});

export { loginUser, refreshNavotarToken };
