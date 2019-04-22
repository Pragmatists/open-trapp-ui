import { Month } from '../../../utils/Month';

export class BulkEditQuery {
  constructor(readonly query: string = '', readonly expression: string = '') {}

  get encodedQuery(): string {
    return this.query
        .replace(/#/g, "!project=")
        .replace(/\*/g, "!employee=")
        .replace(/@/g, "!date=")
        .replace(/\s/g, "+")
        .replace(/\//g, ":");
  }

  static fromSelection(
      selectedTags: string[],
      selectedEmployees: string[],
      selectedMonth: Month
  ) {
    const query = [
      `@${selectedMonth.toString()}`,
      selectedTags.map(tag => `#${tag}`).join(' '),
      selectedEmployees.map(employee => `*${employee}`).join(' ')
    ].join(' ');
    return new BulkEditQuery(query);
  }
}