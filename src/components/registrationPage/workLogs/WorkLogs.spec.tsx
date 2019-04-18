import React from 'react';
import { mount } from 'enzyme';
import { WorkLogs } from './WorkLogs';
import { noop } from 'lodash';
import { ReportingWorkLogDTO } from '../../../api/dtos';

describe('Work logs', () => {
  const workLogs: ReportingWorkLogDTO[] = [
    {id: '3', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 450, projectNames: ['projects', 'nvm']},
    {id: '4', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 30, projectNames: ['internal', 'standup']}
  ];

  it('displays work logs', () => {
    const wrapper = mount(
        <WorkLogs workLogs={workLogs} onDelete={noop}/>
    );

    expect(workLogText(wrapper, 0)).toContain('projects, nvm');
    expect(workLogText(wrapper, 0)).toContain('7h 30m');
    expect(workLogText(wrapper, 1)).toContain('internal, standup');
    expect(workLogText(wrapper, 1)).toContain('30m');
  });

  it('calls on delete on chip delete click', () => {
    const onDelete = jest.fn();

    const wrapper = mount(
        <WorkLogs workLogs={workLogs} onDelete={onDelete}/>
    );
    deleteWorkLogIcon(wrapper, 0).simulate('click');

    expect(onDelete).toHaveBeenCalledWith(workLogs[0]);
  });

  function workLog(wrapper, workLogIdx: number) {
    return wrapper.find('[data-work-log]').hostNodes().at(workLogIdx);
  }

  function workLogText(wrapper, workLogIdx: number) {
    return workLog(wrapper, workLogIdx).text();
  }

  function deleteWorkLogIcon(wrapper, workLogIdx: number) {
    return workLog(wrapper, workLogIdx).find('svg');
  }
});