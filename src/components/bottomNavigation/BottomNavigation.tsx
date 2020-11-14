import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CreateIcon from '@material-ui/icons/Create';
import BarChartIcon from '@material-ui/icons/BarChart';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0
  },
});

export const BottomNavigationBar = () => {
  const {pathname} = useLocation();
  const history = useHistory();
  const {root} = useStyles();
  return (
    <BottomNavigation value={pathname}
                      onChange={(e, v) => history.push(v)}
                      className={root}
                      showLabels data-testid='bottom-navigation-bar'>
      <BottomNavigationAction label='Registration' value='/registration' icon={<CreateIcon/>} />
      <BottomNavigationAction label='Reporting' value='/reporting' icon={<BarChartIcon/>}/>
    </BottomNavigation>
  );
}
