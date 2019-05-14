import React, { Component } from 'react';
import { ReportingWorkLog } from '../reporting.model';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { chain, sum } from 'lodash';
import './ProjectsReport.scss';
import { formatWorkload } from '../../../utils/workLogUtils';

interface ProjectsReportProps {
  workLogs: ReportingWorkLog[];
}

interface RowData {
  project: string;
  workload: number;
  share: number;
}

export class ProjectsReport extends Component<ProjectsReportProps, {}> {
  render() {
    return (
        <div className='projects-report'>
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
                this.rowsData.map((rowData, idx) => (
                    <TableRow key={idx}>
                      <TableCell data-project-cell>{rowData.project}</TableCell>
                      <TableCell data-workload-cell>{formatWorkload(rowData.workload)}</TableCell>
                      <TableCell data-share-cell>{(rowData.share * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
    );
  }

  private get rowsData(): RowData[] {
    const {workLogs = []} = this.props;
    const totalWorkload = sum(workLogs.map(w => w.workload));
    return chain(workLogs)
        .map(w => w.projectNames.map(project => ({project, workload: w.workload})))
        .flatten()
        .groupBy(w => w.project)
        .toPairs()
        .map(pair => ({project: pair[0], workload: sum(pair[1].map(w => w.workload))}))
        .map(p => ({project: p.project, workload: p.workload, share: p.workload / totalWorkload}))
        .sortBy(p => p.project)
        .value() as RowData[];
  }
}
