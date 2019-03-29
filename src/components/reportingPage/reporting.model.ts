import { ReportingWorkLogDTO } from '../../api/dtos';

export class ReportingWorkLog {
  readonly id: string;
  readonly employee: string;
  readonly projectNames: string[];
  readonly day: string;
  readonly workload: number;

  constructor(workLog: ReportingWorkLogDTO) {
    this.id = workLog.id;
    this.employee = workLog.employee;
    this.projectNames = workLog.projectNames;
    this.day = workLog.day;
    this.workload = workLog.workload;
  }
}

export interface EditedWorkLog {
  id: string;
  workload: string;
  projectNames: string[];
}