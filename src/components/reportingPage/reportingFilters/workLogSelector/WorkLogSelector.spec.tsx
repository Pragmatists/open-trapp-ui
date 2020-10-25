import * as React from 'react';
import { fireEvent, render, RenderResult, within } from '@testing-library/react';
import { WorkLogSelector } from './WorkLogSelector';
import { includes, intersection, isEmpty, noop } from 'lodash';
import { ReportingWorkLog } from '../../reporting.model';
import { ReportingWorkLogDTO } from '../../../../api/dtos';

const workLogs: ReportingWorkLog[] = [
  {employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/03/03'}
].map(w => new ReportingWorkLog(w as any));

describe('WorkLogSelector', () => {
  it('displays title', () => {
    const title = 'Projects';

    const {getByText} = render(
        <WorkLogSelector title={title}
                         chipLabel={workLog => workLog.employee}
                         workLogs={[]}
                         onSelectionChange={noop}/>
    );

    expect(getByText(title)).toBeInTheDocument();
  });

  it('displays tags', () => {
    const container = render(
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         onSelectionChange={noop}/>
    );

    expect(chips(container)).toHaveLength(5);
    expect(chipsLabels(container).sort()).toEqual(['internal', 'jld', 'nvm', 'projects', 'self-dev'])
  });

  it('sorts tags by value', () => {
    const workLogs = [
      workLog({projectNames: ['Ai']}),
      workLog({projectNames: ['z-day']}),
      workLog({projectNames: ['a-team']})

    ];
    const container = render(
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         onSelectionChange={noop}/>
    );

    expect(chipsLabels(container)).toEqual(['Ai', 'a-team', 'z-day'])
  });

  it('displays employees', () => {
    const container = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         onSelectionChange={noop}/>
    );

    expect(chips(container)).toHaveLength(2);
    expect(chipsLabels(container).sort()).toEqual(['john.doe', 'tom.kowalsky'])
  });

  it('marks chips as selected', () => {
    const selected = ['john.doe'];
    const container = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selected}
                         onSelectionChange={noop}/>
    );

    expect(selectorChipByLabel(container, 'john.doe'))
        .toHaveAttribute('data-chip-selected', 'true');
  });


  it('displays workload next to employee names for selection', () => {
    const container = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         workLogFilter={workLog => !isEmpty(intersection(['nvm', 'jld'], workLog.projectNames))}
                         onSelectionChange={noop}/>
    );

    expect(getChipByLabel(container, 'john.doe').getByText('1d 7h')).toBeInTheDocument();
    expect(getChipByLabel(container, 'tom.kowalsky').getByText('5h 30m')).toBeInTheDocument();
  });

  it('displays workload next to tags for selection', () => {
    const container = render(
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         workLogFilter={workLog => includes(['tom.kowalsky'], workLog.employee)}
                         onSelectionChange={noop}/>
    );

    expect(getChipByLabel(container, 'projects').getByText('5h 30m')).toBeInTheDocument();
    expect(getChipByLabel(container, 'jld').getByText('5h 30m')).toBeInTheDocument();
    expect(getChipByLabel(container, 'internal').getByText('1d')).toBeInTheDocument();
    expect(getChipByLabel(container, 'self-dev').getByText('1d')).toBeInTheDocument();
    expect(getChipByLabel(container, 'nvm').queryByTestId('chip-workload')).not.toBeInTheDocument();
  });

  it('hides ineligible employees', () => {
    const container = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         hideIneligible={true}
                         workLogs={workLogs}
                         workLogFilter={workLog => !isEmpty(intersection(['nvm'], workLog.projectNames))}
                         onSelectionChange={noop}/>
    );

    expect(chipsLabels(container)).toEqual(['john.doe'])
  });

  it('shows ineligible employees on click', () => {
    const {getByText} = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         hideIneligible={true}
                         workLogs={workLogs}
                         workLogFilter={workLog => !isEmpty(intersection(['nvm'], workLog.projectNames))}
                         onSelectionChange={noop}/>
    );

    fireEvent.click(getByText('Show ineligible'));

    expect(getByText('john.doe')).toBeInTheDocument();
    expect(getByText('tom.kowalsky')).toBeInTheDocument();
  });

  it('emits selection change on click', () => {
    const onChange = jest.fn();
    const selected = ['john.doe'];
    const {getByText} = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selected}
                         onSelectionChange={onChange}/>
    );

    fireEvent.click(getByText('tom.kowalsky'));

    expect(onChange).toHaveBeenCalledWith(['john.doe', 'tom.kowalsky']);
  });

  it('emits all selected on ALL button click', () => {
    const onChange = jest.fn();
    const {getByText} = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={[]}
                         onSelectionChange={onChange}/>
    );

    fireEvent.click(getByText('All'))

    expect(onChange).toHaveBeenCalledWith(['john.doe', 'tom.kowalsky']);
  });

  it('emits none selected on NONE button click', () => {
    const onChange = jest.fn();
    const {getByText} = render(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={[]}
                         onSelectionChange={onChange}/>
    );

    fireEvent.click(getByText('None'));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  function chips(container: RenderResult) {
    return container.queryAllByTestId('selector-chip');
  }

  function chipsLabels(container: RenderResult): string[] {
    return container.queryAllByTestId('selector-chip-label').map(l => l.textContent);
  }

  function getChipByLabel(container: RenderResult, text: string) {
    return within(container.getByText(text).parentElement);
  }

  function selectorChipByLabel(container: RenderResult, label: string) {
    return container.getByText(label).parentElement.parentElement.parentElement;
  }

  function workLog(patch: Partial<ReportingWorkLogDTO>): ReportingWorkLog {
    const fulfilled: ReportingWorkLogDTO = {
      id: 'wl-0',
      day: '2019/03/01',
      employee: 'john.smith',
      workload: 60,
      link: '',
      projectNames: []
    };
    return new ReportingWorkLog({...fulfilled, ...patch})
  }
});
