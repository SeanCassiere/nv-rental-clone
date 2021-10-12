import { IWidget } from "../interfaces/dashboard/widgets";
import appAxiosInstance from "./appAxiosInstance";

export async function updateDashboardWidget(widget: IWidget, token: string) {
	try {
		await appAxiosInstance.post("/Dashboard", widget, {
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
		});
		return true;
	} catch (error) {
		console.error("Error updating widget configuration", error);
		return false;
	}
}
