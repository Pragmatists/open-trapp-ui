export interface MonthlyReportDay {
    id: string;
    weekend: boolean;
    holiday: boolean;
}

export interface WorkLog {
    day: string;
    workload: number;
}
