import React from 'react';
import { mount } from 'enzyme';
import { MobileWorkLog } from './MobileWorkLog';
import { ReportingWorkLogDTO } from '../../../api/dtos';

describe('Mobile work log', () => {
  const workLog: ReportingWorkLogDTO = {
    id: '1234',
    employee: 'john.doe',
    link: 'link',
    day: '2019/04/18',
    workload: 480,
    projectNames: ['projects', 'nvm']
  };

  it('displays date', () => {
    const wrapper = mount(
        <MobileWorkLog  workLog={workLog}/>
    );

    expect(wrapper.find('[data-work-log-day]').text()).toEqual('2019/04/18');
  });

  it('displays workload', () => {
    const wrapper = mount(
        <MobileWorkLog  workLog={workLog}/>
    );

    expect(wrapper.find('[data-work-log-workload]').text()).toEqual('1d');
  });

  it('displays project names', () => {
    const wrapper = mount(
        <MobileWorkLog  workLog={workLog}/>
    );

    expect(wrapper.find('[data-work-log-project-names]').text()).toEqual('projects, nvm');
  });
});