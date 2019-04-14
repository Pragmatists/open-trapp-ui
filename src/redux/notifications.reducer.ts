import { v4 as uuid } from 'uuid';
import { NOTIFICATIONS_CONSTANTS } from './constants';

enum NotificationType {
  INFO = 'INFO',
  ERROR = 'ERROR'
}

export class Notification {
  readonly id: string;

  private constructor(readonly message: string, readonly type: NotificationType) {
    this.id = uuid();
  }

  static info(message: string): Notification {
    return new Notification(message, NotificationType.INFO);
  }

  static error(message: string): Notification {
    return new Notification(message, NotificationType.ERROR);
  }
}

export interface NotificationsState {
  notifications: Notification[];
}

const initialState: () => NotificationsState = () => ({
  notifications: []
});

export function notifications(state = initialState(), action): NotificationsState {
  switch (action.type) {
    case NOTIFICATIONS_CONSTANTS.NOTIFICATION_CREATED:
      return {
        notifications: [...state.notifications, action.payload]
      };
    case NOTIFICATIONS_CONSTANTS.NOTIFICATION_DISMISSED:
      return {
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}