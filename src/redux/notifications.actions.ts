import { NOTIFICATIONS_CONSTANTS } from './constants';
import { Notification } from './notifications.reducer';
import { Dispatch } from 'redux';

export function publishInfoNotification(message: string) {
  return (dispatch: Dispatch) => dispatch(infoNotificationAction(message));
}

export function publishErrorNotification(message: string) {
  return (dispatch: Dispatch) => dispatch(errorNotificationAction(message));
}

export function dismissNotification(id: string) {
  return (dispatch: Dispatch) => dispatch(dismissNotificationAction(id));
}

export const infoNotificationAction = (message: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_CREATED,
  payload: Notification.info(message)
});

export const errorNotificationAction = (message: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_CREATED,
  payload: Notification.error(message)
});

const dismissNotificationAction = (id: string) => ({
  type: NOTIFICATIONS_CONSTANTS.NOTIFICATION_DISMISSED,
  payload: id
});