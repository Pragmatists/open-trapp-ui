import React from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Notification } from '../../redux/notifications.reducer';
import { Snackbar } from '@material-ui/core';
import { dismissNotification } from '../../redux/notifications.actions';

interface NotificationsDataProps {
  notifications: Notification[];
}

interface NotificationsEventProps {
  dismissNotification: (id: string) => void;
}

type NotificationsProps = NotificationsDataProps & NotificationsEventProps;

const NotificationsComponent = ({notifications, dismissNotification}: NotificationsProps) => {
    return (
        <div>
          {notifications.map((notification, idx) =>
            <Snackbar key={idx}
                      open={true}
                      onClose={() => dismissNotification(notification.id)}
                      message={notification.message}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}/>
          )}
        </div>
    );
};

function mapStateToProps(state: OpenTrappState): NotificationsDataProps {
  const {notifications} = state.notifications;
  return {
    notifications
  };
}

function mapDispatchToProps(dispatch): NotificationsEventProps {
  return {
    dismissNotification(id: string) {
      dispatch(dismissNotification(id));
    }
  };
}

export const Notifications = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsComponent);