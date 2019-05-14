import React from 'react';
import { mount } from 'enzyme';
import { DayCard } from './DayCard';
import { noop } from 'lodash';

describe('Day card', () => {
  const workLog = {
    workload: 480,
    projectNames: ['projects', 'nvm']
  };

  it('displays date in header', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' workLogs={[]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-day]').hostNodes().text()).toEqual('2019/04/18');
  });

  it('displays work logs list', () => {
    const workLogs = [
        {workload: 60, projectNames: ['project1']},
        {workload: 30, projectNames: ['project2']}
        ];

    const wrapper = mount(
        <DayCard day='2019/04/18' workLogs={workLogs} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-work-log]')).toHaveLength(2);
  });

  it('displays workload', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-workload]').text()).toEqual('1d');
  });

  it('displays project names', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-project-names]').text()).toEqual('projects, nvm');
  });

  it('emits EDIT button click', () => {
    const onClick = jest.fn();
    const wrapper = mount(
        <DayCard day='2019/04/18' workLogs={[]} onEditClick={onClick}/>
    );

    editButton(wrapper).simulate('click');

    expect(onClick).toHaveBeenCalled();
  });

  function editButton(wrapper) {
    return wrapper.find('[data-day-card-edit-button]').hostNodes();
  }
});
