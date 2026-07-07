/** Section id for i18n (`settings.notificationsPage.groups.${id}`) and ordering. */
export type NotificationGroupId = "general";
export type NotificationTypeId = "WELCOME" | "APP_UPDATE";

export interface NotificationGroupConfig {
	id: NotificationGroupId;
	types: readonly NotificationTypeId[];
}

export const NOTIFICATION_GROUPS: readonly NotificationGroupConfig[] = [
	{
		id: "general",
		types: ["APP_UPDATE"],
	},
];
