import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { formatWorkload } from '../../../utils/workLogUtils';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import { isEmpty } from 'lodash';
import './DayCard.scss'

interface WorkLogDTO {
  workload: number;
  projectNames: string[];
}

interface DayCardProps {
  day: string;
  weekend: boolean;
  workLogs: WorkLogDTO[];
  onEditClick: VoidFunction;
}

export class DayCard extends Component<DayCardProps, {}> {
  render() {
    const {day, onEditClick} = this.props;
    return (
        <Card className='day-card'>
          <CardHeader title={day} subheader={moment(day, 'YYYY/MM/DD').format('dddd')} data-day-card-day/>
          {
            this.showContent && this.renderContent()
          }
          <CardActions className='day-card__actions'>
            <Button size='small' onClick={onEditClick} data-day-card-edit-button>Edit</Button>
          </CardActions>
        </Card>
    );
  }

  private renderContent() {
    const {workLogs, weekend} = this.props;
    return (
        <CardContent className='day-card__card-content card-content'>
          {
            this.pastDate && isEmpty(workLogs) && !weekend ? this.renderReminder() : this.renderWorkLogs()
          }
        </CardContent>
    );
  }

  private renderWorkLogs() {
    const {workLogs} = this.props;
    return (
        <List data-day-card-list>
          {workLogs.map((w, idx) => (
              <ListItem key={idx}>
                <WorkLog workLog={w}/>
              </ListItem>
          ))}
        </List>
    );
  }

  private renderReminder() {
    return (
       <div className='card-content__reminder' data-day-card-reminder>
         You should report work time for this day!
       </div>
    );
  }

  private get pastDate() {
    const {day} = this.props;
    return moment(day, 'YYYY/MM/DD').isBefore(moment(), 'day');
  }

  private get showContent() {
    const {workLogs, weekend} = this.props;
    return (this.pastDate && !weekend) || !isEmpty(workLogs);
  }
}

const WorkLog = ({workLog}: { workLog: WorkLogDTO }) => (
    <div className='day-card__work-log' data-day-card-work-log>
      <div data-day-card-project-names>{workLog.projectNames.join(", ")}</div>
      <div data-day-card-workload>{formatWorkload(workLog.workload)}</div>
    </div>
);
