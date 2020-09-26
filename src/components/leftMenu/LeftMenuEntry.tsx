import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

interface Props {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: VoidFunction;
  icon: any;
}

export const LeftMenuEntry = ({label, disabled, selected, onClick, icon}: Props) => {
  const Icon = icon;
  return (
      <ListItem button
                selected={selected}
                disabled={disabled}
                onClick={onClick}>
        <ListItemIcon>
          <Icon color='primary'/>
        </ListItemIcon>
        <ListItemText primary={label}/>
      </ListItem>
  );
};
