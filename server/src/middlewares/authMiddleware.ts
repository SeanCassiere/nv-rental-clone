import { verify, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

export interface TokenInterface {
	id: string;
}

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let token: string = "";

	if (token.length === 0) {
		res.status(401);
		throw new Error("Unauthorized, no token provided.");
	}

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			verify(token, JWT_SECRET) as TokenInterface;

			next();
		} catch (error) {
			res.status(401);
			throw new Error("Unauthorized, token not valid.");
		}
	}
});

export { protect };
