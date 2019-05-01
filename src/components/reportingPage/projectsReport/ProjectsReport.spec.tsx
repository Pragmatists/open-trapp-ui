import React from 'react';
import { mount } from 'enzyme';
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
    const wrapper = mount(
        <ProjectsReport workLogs={[]} />
    );

    expect(projectCells(wrapper)).toHaveLength(0);
  });

  it('displays row for each project alphabetically', () => {
    const wrapper = mount(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(projectCells(wrapper)).toHaveLength(5);
    expect(projectCellText(wrapper, 0)).toEqual('internal');
    expect(projectCellText(wrapper, 1)).toEqual('jld');
    expect(projectCellText(wrapper, 2)).toEqual('nvm');
    expect(projectCellText(wrapper, 3)).toEqual('projects');
    expect(projectCellText(wrapper, 4)).toEqual('self-dev');
  });

  it('aggregates workload for each project', () => {
    const wrapper = mount(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(workloadCellText(wrapper, 0)).toEqual('1d 30m');
    expect(workloadCellText(wrapper, 1)).toEqual('5h 30m');
    expect(workloadCellText(wrapper, 2)).toEqual('1d 7h');
    expect(workloadCellText(wrapper, 3)).toEqual('2d 4h 30m');
    expect(workloadCellText(wrapper, 4)).toEqual('1d 30m');
  });

  it('calculates workload share for each project', () => {
    const wrapper = mount(
        <ProjectsReport workLogs={workLogs} />
    );

    expect(shareCellText(wrapper, 0)).toEqual('29.31%');
    expect(shareCellText(wrapper, 1)).toEqual('18.97%');
    expect(shareCellText(wrapper, 2)).toEqual('51.72%');
    expect(shareCellText(wrapper, 3)).toEqual('70.69%');
    expect(shareCellText(wrapper, 4)).toEqual('29.31%');
  });

  function projectCells(wrapper) {
    return wrapper.find('[data-project-cell]').hostNodes();
  }

  function projectCellText(wrapper, idx: number) {
    return projectCells(wrapper).at(idx).text();
  }

  function workloadCellText(wrapper, idx: number) {
    return wrapper.find('[data-workload-cell]').hostNodes().at(idx).text();
  }

  function shareCellText(wrapper, idx: number) {
    return wrapper.find('[data-share-cell]').hostNodes().at(idx).text();
  }
});
