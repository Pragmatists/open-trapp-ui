import { formatWorkload, workloadAsDays } from './workloadUtils';

describe('WorkLogUtils', () => {
  it.each`
    workload     |  expectedResult
    ${480}       |  ${'1d'}
    ${540}       |  ${'1d 1h'}
    ${1050}      |  ${'2d 1h 30m'}
    ${345}       |  ${'5h 45m'}
    ${20}        |  ${'20m'}
    ${495}       |  ${'1d 15m'}
    ${120}       |  ${'2h'}
    ${0}         |  ${'0h'}
    ${undefined} |  ${'INVALID'}
    ${-20}       |  ${'INVALID'}
  `(`formats workload of $workload minutes`, ({workload, expectedResult}) => expect(formatWorkload(workload)).toEqual(expectedResult));

  it.each`
    workload     | expectedResult
    ${480}       |  ${8}
    ${540}       |  ${9}
    ${345}       |  ${5.75}
    ${20}        |  ${0.33}
    ${100}       |  ${1.67}
    ${0}         |  ${0}
    ${undefined} |  ${undefined}
  `(`displays workload of $workload minutes as hours`, ({workload, expectedResult}) => expect(workloadAsDays(workload)).toEqual(expectedResult))
});
