
import { apiRequest } from "./api";

export const NOTIFICATIONS_CHANGED = "notifications:changed";

// Lets the sidebar badge refresh right after a notification is read.
export const announceNotificationsChanged = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
};

// GET /api/notifications/  (newest first)
export const getNotifications = async () => {
  const data = await apiRequest("/api/notifications/");

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.notifications)) return data.notifications;
  return [];
};

// GET /api/notifications/unread-count/  ->  { unreadCount: 2 }
export const getUnreadCount = async () => {
  const data = await apiRequest("/api/notifications/unread-count/");
  return Number(data?.unreadCount ?? data?.count ?? 0) || 0;
};

// PATCH /api/notifications/{id}/read/  ->  204
export const markNotificationRead = async (id) => {
  await apiRequest(`/api/notifications/${id}/read/`, { method: "PATCH" });
  announceNotificationsChanged();
};

// PATCH /api/notifications/read-all/  ->  204
export const markAllNotificationsRead = async () => {
  await apiRequest("/api/notifications/read-all/", { method: "PATCH" });
  announceNotificationsChanged();
};

// The API sends the flag as `read` (or `isRead` on some builds).
export const isNotificationRead = (notification) =>
  Boolean(notification?.read ?? notification?.isRead ?? false);
