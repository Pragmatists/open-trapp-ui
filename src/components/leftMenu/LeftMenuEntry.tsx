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
  const getTestId = () => {
    if (disabled) {
      return 'left-menu-entry-disabled';
    } else if (selected) {
      return 'left-menu-entry-selected'
    }
    return 'left-menu-entry';
  }
  return (
      <ListItem button
                selected={selected}
                disabled={disabled}
                onClick={onClick}
                data-testid={getTestId()}>
        <ListItemIcon>
          <Icon color='primary'/>
        </ListItemIcon>
        <ListItemText primary={label}/>
      </ListItem>
  );
};
