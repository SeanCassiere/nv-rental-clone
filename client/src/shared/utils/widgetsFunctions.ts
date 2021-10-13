import { IWidget } from "../interfaces/dashboard/widgets";

export function sortWidgetsInAscendingList(items: IWidget[]) {
	return items.sort((a, b) => a.widgetUserPosition - b.widgetUserPosition);
}

export function sortWidgetDeleteEnterReorder(allWidgets: IWidget[]) {
	const inActiveWidgets = sortWidgetsInAscendingList(allWidgets.filter((w) => w.isDeleted === true));
	const activeWidgets = sortWidgetsInAscendingList(allWidgets.filter((w) => w.isDeleted === false));

	const refreshedActiveList = activeWidgets.map((w, index) => {
		const widgetUserPosition = index + 1;
		return { ...w, widgetUserPosition };
	});

	const refreshedInActiveList = inActiveWidgets.map((w, index) => {
		const widgetUserPosition = refreshedActiveList.length + index + 1;
		return { ...w, widgetUserPosition };
	});

	const reorderedWidgetList = [...refreshedActiveList, ...refreshedInActiveList];
	return sortWidgetsInAscendingList(reorderedWidgetList);
}
