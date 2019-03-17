import { ReportingWorkLogDTO } from '../../api/dtos';

export class ReportingWorkLog {
  readonly employee: string;
  readonly projectNames: string[];
  readonly day: string;
  readonly workload: number;

  constructor(workLog: ReportingWorkLogDTO) {
    this.employee = workLog.employee;
    this.projectNames = workLog.projectNames;
    this.day = workLog.day;
    this.workload = workLog.workload;
  }
}