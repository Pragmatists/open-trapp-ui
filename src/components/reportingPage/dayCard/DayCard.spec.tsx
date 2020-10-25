import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { DayCard } from './DayCard';
import { noop } from 'lodash';
import moment from 'moment';

describe('Day card', () => {
  const workLog = {
    workload: 480,
    projectNames: ['projects', 'nvm']
  };

  it('displays date in header', () => {
    const {getByText} = render(
        <DayCard day='2019/04/18' weekend={false} workLogs={[]} onEditClick={noop}/>
    );

    expect(getByText('2019/04/18')).toBeInTheDocument();
    expect(getByText('Thursday')).toBeInTheDocument();
  });

  it('displays work logs list', () => {
    const workLogs = [
      {workload: 60, projectNames: ['project1']},
      {workload: 30, projectNames: ['project2']}
    ];

    const {queryAllByTestId} = render(
        <DayCard day='2019/04/18' weekend={false} workLogs={workLogs} onEditClick={noop}/>
    );

    expect(queryAllByTestId('work-log')).toHaveLength(2);
  });

  it('displays workload', () => {
    const { getByText } = render(
        <DayCard day='2019/04/18' weekend={false} workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(getByText('1d')).toBeInTheDocument();
  });

  it('displays project names', () => {
    const { getByText } = render(
        <DayCard day='2019/04/18' weekend={false} workLogs={[workLog]} onEditClick={noop}/>
    );

    expect(getByText('projects, nvm')).toBeInTheDocument();
  });

  it('emits EDIT button click', () => {
    const onClick = jest.fn();
    const {getByText} = render(
        <DayCard day='2019/04/18' weekend={false} workLogs={[]} onEditClick={onClick}/>
    );

    fireEvent.click(getByText('Edit'));

    expect(onClick).toHaveBeenCalled();
  });

  it('displays reminder if no work logs and past date', () => {
    const yesterday = moment().subtract(1, 'day').format('YYYY/MM/DD');

    const {getByText, queryByTestId} = render(
        <DayCard day={yesterday} weekend={false} workLogs={[]} onEditClick={noop}/>
    );

    expect(getByText('You should report work time for this day!')).toBeInTheDocument();
    expect(queryByTestId('day-card-list')).not.toBeInTheDocument();
  });

  it('does not display reminder if weekend', () => {
    const {queryByText, queryByTestId} = render(
        <DayCard day='2019/05/26' weekend={true} workLogs={[]} onEditClick={noop}/>
    );

    expect(queryByText('You should report work time for this day!')).not.toBeInTheDocument();
    expect(queryByTestId('day-card-list')).not.toBeInTheDocument();
  });

  it('collapse card content if weekend or day in the future', () => {
    const yesterday = moment().add(1, 'day').format('YYYY/MM/DD');
    const {queryByText} = render(
        <DayCard day={yesterday} weekend={true} workLogs={[]} onEditClick={noop}/>
    );

    expect(queryByText('You should report work time for this day!')).not.toBeInTheDocument();
  });
});
