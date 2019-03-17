import { formatWorkload } from './workLogUtils';

describe('WorkLogUtils', () => {
  [
    {workload: 480, expectedResult: '1d'},
    {workload: 540, expectedResult: '1d 1h'},
    {workload: 1050, expectedResult: '2d 1h 30m'},
    {workload: 345, expectedResult: '5h 45m'},
    {workload: 20, expectedResult: '20m'},
    {workload: 495, expectedResult: '1d 15m'},
    {workload: 120, expectedResult: '2h'},
    {workload: 0, expectedResult: '0h'},
    {workload: undefined, expectedResult: 'INVALID'},
    {workload: -20, expectedResult: 'INVALID'}
  ].forEach(({workload, expectedResult}) =>
    it(`formats workload of ${workload} minutes`, () => {
      const result = formatWorkload(workload);

      expect(result).toEqual(expectedResult);
    })
  );
});
