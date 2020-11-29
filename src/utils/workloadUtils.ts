import { round } from 'lodash';

export function formatWorkload(workload: number): string {
  if (workload === null || workload === undefined || workload < 0) {
    return 'INVALID';
  }
  if (workload === 0) {
    return '0h';
  }
  const days = Math.floor(workload / (8 * 60));
  const daysRemainder = workload % (8 * 60);
  const hours = Math.floor(daysRemainder / 60);
  const minutes = daysRemainder % 60;
  return [
    days > 0 ? `${days}d` : undefined,
    hours > 0 ? `${hours}h` : undefined,
    minutes > 0 ? `${minutes}m` : undefined
  ].filter(v => v !== undefined)
      .join(' ');
}

export function workloadAsDays(workload: number): number {
  return workload ? round(workload / 60, 2) : workload;
}
