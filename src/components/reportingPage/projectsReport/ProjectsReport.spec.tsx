import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { ProjectsReport } from './ProjectsReport';
import { ReportingWorkLog } from '../reporting.model';

const workLogs: ReportingWorkLog[] = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['internal', 'self-dev'], workload: 60, day: '2019/03/01'},
  {id: 'jd3', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {id: 'tk2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 450, day: '2019/03/03'}
].map(w => new ReportingWorkLog(w as any));

describe('Projects report', () => {
  it('render empty table for empty worklog list', () => {
    const container = render(
        <ProjectsReport workLogs={[]} />
    );

    expect(projectCells(container)).toHaveLength(0);
  });

  it('displays row for each project alphabetically', () => {
    const container = render(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(projectCells(container)).toHaveLength(5);
    expect(projectCell(container, 0)).toHaveTextContent('internal');
    expect(projectCell(container, 1)).toHaveTextContent('jld');
    expect(projectCell(container, 2)).toHaveTextContent('nvm');
    expect(projectCell(container, 3)).toHaveTextContent('projects');
    expect(projectCell(container, 4)).toHaveTextContent('self-dev');
  });

  it('aggregates workload for each project', () => {
    const container = render(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(workloadCell(container, 0)).toHaveTextContent('1d 30m');
    expect(workloadCell(container, 1)).toHaveTextContent('5h 30m');
    expect(workloadCell(container, 2)).toHaveTextContent('1d 7h');
    expect(workloadCell(container, 3)).toHaveTextContent('2d 4h 30m');
    expect(workloadCell(container, 4)).toHaveTextContent('1d 30m');
  });

  it('calculates workload share for each project', () => {
    const container = render(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(shareCell(container, 0)).toHaveTextContent('29.31%');
    expect(shareCell(container, 1)).toHaveTextContent('18.97%');
    expect(shareCell(container, 2)).toHaveTextContent('51.72%');
    expect(shareCell(container, 3)).toHaveTextContent('70.69%');
    expect(shareCell(container, 4)).toHaveTextContent('29.31%');
  });

  function projectCells(container: RenderResult) {
    return container.queryAllByTestId('project-cell');
  }

  function projectCell(wrapper, idx: number) {
    return projectCells(wrapper)[idx];
  }

  function workloadCell(container: RenderResult, idx: number) {
    return container.queryAllByTestId('workload-cell')[idx];
  }

  function shareCell(container: RenderResult, idx: number) {
    return container.queryAllByTestId('share-cell')[idx];
  }
});
