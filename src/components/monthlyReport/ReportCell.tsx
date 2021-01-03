import {FunctionComponent} from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { isNil } from 'lodash';
import { MonthlyReportDay } from './MonthlyReport.model';
import TableCell from '@material-ui/core/TableCell';
import ErrorIcon from '@material-ui/icons/Error';
import { workloadAsDays } from '../../utils/workloadUtils';

interface ReportCellProps {
  day: MonthlyReportDay;
  selected?: boolean;
  'data-testid'?: string;
  onClick: (day: MonthlyReportDay, range: boolean) => void;
}

export const ReportCell: FunctionComponent<ReportCellProps> = ({children, day, selected, onClick, 'data-testid': dataTestId}) => {
  const cellClass = classNames('report-table__cell', {
    'report-table__cell--weekend': day.weekend,
    'report-table__cell--holiday': day.holiday,
    'report-table__cell--selected': selected
  });

  const onCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(day, e.shiftKey);
  }
  return (
      <TableCell className={cellClass} onClick={onCellClick} data-testid={dataTestId}>
        {children}
      </TableCell>
  );
}

interface WorkloadTableCellProps extends ReportCellProps {
  workload: number;
}

export const ReportWorkloadCell = (props: WorkloadTableCellProps) => {
  const {day, workload} = props;
  const dayDate = moment(day.id, 'YYYY/MM/DD');
  const now = moment();
  const previousMonth = now.month() > dayDate.month() || now.year() > dayDate.year();
  const missingWorkload = previousMonth && isNil(workload) && !day.holiday && !day.weekend;
  return (
      <ReportCell {...props}>
        <div>
          {missingWorkload ? <ErrorIcon className='missing-workload-icon' data-testid='missing-workload-icon'/> : workloadAsDays(workload)}
        </div>
      </ReportCell>
  )
};

export const ReportHeaderCell = (props: ReportCellProps) => {
  const dayDate = moment(props.day.id, 'YYYY/MM/DD');
  return (
      <ReportCell {...props}>
        <div>{dayDate.date()}</div>
        <div className='day-name'>{dayDate.format('ddd')}</div>
      </ReportCell>
  );
}
