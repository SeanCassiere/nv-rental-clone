export interface AuthReturn {
	message: string;
	token: string;
	refreshToken: string;
	features: NavotarClientFeature[];
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

export interface NavotarClientFeature {
	featureName: string;
	clientFeatureId: number;
	clientId: number;
	featureId: number;
	flag: string | null;
	value: string | null;
}
