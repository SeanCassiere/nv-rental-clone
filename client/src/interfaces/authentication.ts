export interface AuthReturn {
	message: string;
	token: string;
	refreshToken: string;
}

export interface RefreshReturn {
	token: string;
	message: string;
}

export interface JWTReturnAuthToken {
	aud: string;
	client_id: string;
	client_navotar_clientid: string;
	client_navotar_userid: string;
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	nbf: number;
}
