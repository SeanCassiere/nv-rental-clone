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

export interface NavotarClientFeature {
	featureName: string;
	clientFeatureId: number;
	clientId: number;
	featureId: number;
	flag: string | null;
	value: string | null;
}

export interface JSONServerUser {
	id: string;
	username: string;
	password: string;
	email: string;
	nav_client_id: string;
	api_client_id: string;
	api_client_secret: string;
}
