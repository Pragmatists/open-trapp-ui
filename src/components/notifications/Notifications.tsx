import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Snackbar } from '@material-ui/core';

export const Notifications = () => {
  const notifications = useSelector((state: OpenTrappState) => state.notifications.notifications);
  const dispatch = useDispatch();
  const dismissNotification = (id: string) => dispatch(dismissNotification(id));

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
