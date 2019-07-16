import React from 'react';
import { mount } from 'enzyme';
import { DayCard } from './DayCard';
import { noop } from 'lodash';
import moment from 'moment';

describe('Day card', () => {
  const workLog = {
    workload: 480,
    projectNames: ['projects', 'nvm']
  };

  it('displays date in header', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' weekend={false} workLogs={[]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-day]').hostNodes().text()).toEqual('2019/04/18Thursday');
  });

  it('displays work logs list', () => {
    const workLogs = [
        {workload: 60, projectNames: ['project1']},
        {workload: 30, projectNames: ['project2']}
        ];

    const wrapper = mount(
        <DayCard day='2019/04/18' weekend={false} workLogs={workLogs} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-work-log]')).toHaveLength(2);
  });

  it('displays workload', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' weekend={false} workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-chip-workload]').text()).toEqual('1d');
  });

  it('displays project names', () => {
    const wrapper = mount(
        <DayCard day='2019/04/18' weekend={false} workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-chip-label]').text()).toEqual('projects, nvm');
  });

  it('emits EDIT button click', () => {
    const onClick = jest.fn();
    const wrapper = mount(
        <DayCard day='2019/04/18' weekend={false} workLogs={[]} onEditClick={onClick}/>
    );

    editButton(wrapper).simulate('click');

    expect(onClick).toHaveBeenCalled();
  });

  it('displays reminder if no work logs and past date', () => {
    const yesterday = moment().subtract(1, 'day').format('YYYY/MM/DD');

    const wrapper = mount(
        <DayCard day={yesterday} weekend={false} workLogs={[]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-reminder]').text())
        .toEqual('You should report work time for this day!');
    expect(wrapper.find('[data-day-card-list]')).toHaveLength(0);
  });

  it('does not display reminder if weekend', () => {
    const wrapper = mount(
        <DayCard day='2019/05/26' weekend={true} workLogs={[]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-reminder]')).toHaveLength(0);
    expect(wrapper.find('[data-day-card-list]')).toHaveLength(0);
  });

  it('collapse card content if weekend or day in the future', () => {
    const yesterday = moment().add(1, 'day').format('YYYY/MM/DD');
    const wrapper = mount(
        <DayCard day={yesterday} weekend={true} workLogs={[]} onEditClick={noop}/>
    );

    expect(wrapper.find('[data-day-card-reminder]')).toHaveLength(0);
  });

  function editButton(wrapper) {
    return wrapper.find('[data-day-card-edit-button]').hostNodes();
  }
});
