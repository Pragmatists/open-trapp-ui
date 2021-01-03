import { ReportingWorkLog } from '../reporting.model';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { chain, sum } from 'lodash';
import './ProjectsReport.scss';
import { formatWorkload } from '../../../utils/workloadUtils';

interface ProjectsReportProps {
  workLogs: ReportingWorkLog[];
}

export const ProjectsReport = ({workLogs = []}: ProjectsReportProps) => {
  const totalWorkload = sum(workLogs.map(w => w.workload));
  const rowsData = chain(workLogs)
      .map(w => w.projectNames.map(project => ({project, workload: w.workload})))
      .flatten()
      .groupBy(w => w.project)
      .toPairs()
      .map(pair => ({project: pair[0], workload: sum(pair[1].map(w => w.workload))}))
      .map(p => ({project: p.project, workload: p.workload, share: p.workload / totalWorkload}))
      .sortBy(p => p.project)
      .value();

  return (
      <div className='projects-report' data-testid='projects-report'>
        <Table className='projects-report__table table'>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Workload</TableCell>
              <TableCell>Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rowsData.map((rowData, idx) => (
                  <TableRow key={idx}>
                    <TableCell data-testid='project-cell'>{rowData.project}</TableCell>
                    <TableCell data-testid='workload-cell'>{formatWorkload(rowData.workload)}</TableCell>
                    <TableCell data-testid='share-cell'>{(rowData.share * 100).toFixed(2)}%</TableCell>
                  </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
  );
}
