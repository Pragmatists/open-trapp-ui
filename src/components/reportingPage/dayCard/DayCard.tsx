import { Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import { isEmpty } from 'lodash';
import './DayCard.scss'
import { WorkLogChip } from '../../workLogChip/WorkLogChip';

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

const Reminder = () => (
    <div className='card-content__reminder'>You should report work time for this day!</div>
);

const WorkLogs = ({workLogs}) => (
    <List data-testid='day-card-list'>
      {workLogs.map((w, idx) => (
          <ListItem key={idx}>
            <WorkLogChip workLog={w}/>
          </ListItem>
      ))}
    </List>
)

const DayCardContent = ({weekend, workLogs, pastDate}: { weekend: boolean, workLogs: WorkLogDTO[], pastDate: boolean }) => (
    <CardContent className='day-card__card-content card-content'>
      {
        pastDate && isEmpty(workLogs) && !weekend ? <Reminder/> : <WorkLogs workLogs={workLogs}/>
      }
    </CardContent>
);

export const DayCard = ({day, onEditClick, weekend, workLogs}: DayCardProps) => {
  const pastDate = moment(day, 'YYYY/MM/DD').isBefore(moment(), 'day');
  const showContent = (pastDate && !weekend) || !isEmpty(workLogs);
  return (
      <Card className='day-card' data-testid='day-card'>
        <CardHeader title={day} subheader={moment(day, 'YYYY/MM/DD').format('dddd')} data-testid='day-card-day'/>
        {
          showContent && <DayCardContent weekend={weekend} workLogs={workLogs} pastDate={pastDate}/>
        }
        <CardActions className='day-card__actions'>
          <Button size='small' onClick={onEditClick}>Edit</Button>
        </CardActions>
      </Card>
  );
}
