import { NOTIFICATIONS_CONSTANTS } from './constants';
import { Notification } from '../redux/notifications.reducer';

export const infoNotificationAction = (message: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_CREATED,
  payload: Notification.info(message)
});

export const errorNotificationAction = (message: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_CREATED,
  payload: Notification.error(message)
});

export const dismissNotificationAction = (id: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_DISMISSED,
  payload: id
});
