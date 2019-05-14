import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { formatWorkload } from '../../../utils/workLogUtils';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import './DayCard.scss'

interface WorkLogDTO {
  workload: number;
  projectNames: string[];
}

interface DayCardProps {
  day: string;
  workLogs: WorkLogDTO[];
  onEditClick: () => void;
}

export class DayCard extends Component<DayCardProps, {}> {
  render() {
    const {day, workLogs, onEditClick} = this.props;
    return (
        <Card className='day-card'>
          <CardHeader title={day} data-day-card-day/>
          <CardContent className='day-card__card-content card-content'>
            <List>
              {workLogs.map((w, idx) => (
                  <ListItem key={idx}>
                    <WorkLog workLog={w}/>
                  </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions className='day-card__actions'>
            <Button size='small' onClick={onEditClick} data-day-card-edit-button>Edit</Button>
          </CardActions>
        </Card>
    );
  }
}

const WorkLog = ({workLog}: { workLog: WorkLogDTO }) => (
  <div className='day-card__work-log' data-day-card-work-log>
    <div data-day-card-project-names>{workLog.projectNames.join(", ")}</div>
    <div data-day-card-workload>{formatWorkload(workLog.workload)}</div>
  </div>
);
