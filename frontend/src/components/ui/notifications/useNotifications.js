import { useNotifCtx } from "./NotificationsProvider";
export const useNotifications = () => useNotifCtx(); // { notify, remove }
