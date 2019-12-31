import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BuildIcon from '@material-ui/icons/Build';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

interface Props {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: VoidFunction;
}

export const LeftMenuEntry = ({label, disabled, selected, onClick}: Props) => (
    <ListItem button
              selected={selected}
              disabled={disabled}
              onClick={onClick}>
      <ListItemIcon>
        <BuildIcon color='primary'/>
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItem>
);
