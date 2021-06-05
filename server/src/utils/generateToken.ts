import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

const generateToken = (id: string) => {
	console.log(JWT_SECRET);
	return jwt.sign({ id }, JWT_SECRET, {
		expiresIn: "4d",
	});
};

export default generateToken;
