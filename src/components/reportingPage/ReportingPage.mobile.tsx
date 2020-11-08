import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import { DayCard } from './dayCard/DayCard';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import { loadMonthAction, monthChangedAction } from '../../actions/calendar.actions';
import { MonthSelector } from './monthSelector/MonthSelector';
import { Month } from '../../utils/Month';
import { History, Location } from 'history';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import { match, withRouter } from 'react-router';
import { workLogChangedAction } from '../../actions/workLog.actions';

interface Props {
  history: History<any>;
  location: Location<any>;
  match: match<any>;
}

const ReportingPageMobileComponent = ({history}: Props) => {
  const {selectedMonth, days = []} = useSelector((state: OpenTrappState) => state.calendar);
  const workLogs = useSelector((state: OpenTrappState) =>
      state.workLog.workLogs.filter(workLog => workLog.employee === state.authentication.user.name)
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMonthAction());
  }, [dispatch]);

  const groupedWorkLogs = groupBy(workLogs, w => w.day);
  const workLogsByDay = days
      .sort((d1, d2) => d2.id.localeCompare(d1.id))
      .map(d => ({day: d.id, weekend: d.weekend, workLogs: groupedWorkLogs[d.id] || []}))
      .filter(d => d.workLogs.length > 0);

  const onEditDayClick = (day: string) => {
    dispatch(workLogChangedAction(ParsedWorkLog.empty().withDays([day])));
    history.push('/registration');
  }

  const onMonthChange = (month: Month) => dispatch(monthChangedAction(month.year, month.month));

  return (
      <div>
        <MonthSelector selectedMonth={new Month(selectedMonth.year, selectedMonth.month)} onChange={onMonthChange}/>
        <List>
          {workLogsByDay.map(day =>
              <ListItem key={day.day}>
                <DayCard day={day.day}
                         weekend={day.weekend}
                         workLogs={day.workLogs}
                         onEditClick={() => onEditDayClick(day.day)}/>
              </ListItem>
          )}
        </List>
      </div>
  );
}

export const ReportingPageMobile = withRouter(ReportingPageMobileComponent);
