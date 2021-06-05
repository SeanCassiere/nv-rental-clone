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

export interface AuthReturn {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
}
