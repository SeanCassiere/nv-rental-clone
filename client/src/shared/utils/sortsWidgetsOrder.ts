import { IWidget } from "../interfaces/dashboard/widgets";

export function sortAscendingList(items: IWidget[]) {
	return items.sort((a, b) => a.widgetUserPosition - b.widgetUserPosition);
}
