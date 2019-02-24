import React, { Component } from 'react';
import { Grid } from "@material-ui/core";
import './RegistrationPage.desktop.scss'
import Divider from "@material-ui/core/Divider";
import { WorkLogInput } from "../workLogInput/WorkLogInput";
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadMonth } from '../../redux/calendar.actions';
import { DayDTO } from '../../api/dtos';

const workLogs = {
  'hubert.legec': [
    {day: '2019/02/01', workload: 8},
    {day: '2019/02/02', workload: 6},
    {day: '2019/02/03', workload: 2},
    {day: '2019/02/04', workload: 8.25},
    {day: '2019/02/05', workload: 8},
    {day: '2019/02/06', workload: 7.75}
  ]
};

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number },
  days?: DayDTO[];
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

class RegistrationPageDesktopComponent extends Component<RegistrationPageProps, {}> {

  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {days} = this.props;
    return (
        <div className='registration-page'>
          <Grid container justify='center' spacing={24}>
            <Grid item xs={8}>
              <div className='registration-page__header'>
                <span>Report your time</span> using our expression language, to make it quick!
              </div>
              <Divider variant='fullWidth'/>
            </Grid>
            <Grid item xs={8}>
              <WorkLogInput/>
            </Grid>
            <Grid item xs={8}>
              <Paper>
                {days ? <MonthlyReport days={days} workLogs={workLogs}/> : 'Loading...'}
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }
}

function mapStateToProps(state: OpenTrappState): RegistrationPageDataProps {
  const {selectedMonth, days} = state.calendar;
  return {
    selectedMonth,
    days
  };
}

function mapDispatchToProps(dispatch: any): RegistrationPageEventProps {
  return {
    init: (year, month) => dispatch(loadMonth(year, month))
  };
}

export const RegistrationPageDesktop = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageDesktopComponent);
