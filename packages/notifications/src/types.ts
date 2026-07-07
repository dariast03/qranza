export const NOTIFICATION_TYPES = {
	WELCOME: "WELCOME",
	APP_UPDATE: "APP_UPDATE",
} as const;

export const NOTIFICATION_TARGETS = {
	IN_APP: "IN_APP",
	EMAIL: "EMAIL",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
export type NotificationTarget = (typeof NOTIFICATION_TARGETS)[keyof typeof NOTIFICATION_TARGETS];
