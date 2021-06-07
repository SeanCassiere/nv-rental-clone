import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

const appAxiosInstance = axios.create({
	baseURL: BASE_URL,
});

export default appAxiosInstance;
