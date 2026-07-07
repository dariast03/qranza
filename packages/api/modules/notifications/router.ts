import { getPreferences } from "./procedures/get-preferences";
import { list } from "./procedures/list";
import { markAllAsRead } from "./procedures/mark-all-as-read";
import { markAllNotificationsRead } from "./procedures/mark-all-read";
import { markAsRead } from "./procedures/mark-as-read";
import { markNotificationsRead } from "./procedures/mark-notifications-read";
import { unreadCount } from "./procedures/unread-count";
import { updatePreference } from "./procedures/update-preference";

export const notificationsRouter = {
	list,
	unreadCount,
	markAsRead,
	markRead: markNotificationsRead,
	markAllAsRead,
	markAllRead: markAllNotificationsRead,
	getPreferences,
	updatePreference,
};
