import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

const generateToken = (id: string) => {
	return jwt.sign({ id }, JWT_SECRET, {
		expiresIn: "12h",
	});
};

export default generateToken;
