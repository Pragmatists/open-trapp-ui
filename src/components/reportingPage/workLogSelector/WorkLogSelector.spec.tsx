import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { WorkLogSelector } from './WorkLogSelector';
import { Chip } from '@material-ui/core';
import { noop, intersection, isEmpty, includes } from 'lodash';
import { ReportingWorkLog } from '../reporting.model';

const workLogs: ReportingWorkLog[] = [
  {employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/03/03'},
].map(w => new ReportingWorkLog(w as any));

describe('WorkLogSelector', () => {
  it('displays title', () => {
    const title = 'Projects';

    const wrapper = shallow(
        <WorkLogSelector title={title}
                         chipLabel={workLog => workLog.employee}
                         workLogs={[]}
                         onSelectionChange={noop}/>
    );

    expect(header(wrapper).text()).toEqual(title);
  });

  it('displays tags', () => {
    const wrapper = mount(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         onSelectionChange={noop}/>
    );

    expect(chips(wrapper)).toHaveLength(5);
    expect(chipsLabels(wrapper).sort()).toEqual(['internal', 'jld', 'nvm', 'projects', 'self-dev'])
  });

  it('displays employees', () => {
    const wrapper = mount(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         onSelectionChange={noop}/>
    );

    expect(chips(wrapper)).toHaveLength(2);
    expect(chipsLabels(wrapper).sort()).toEqual(['john.doe', 'tom.kowalsky'])
  });

  it('marks chips as selected', () => {
    const selected = ['john.doe'];
    const wrapper = mount(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selected}
                         onSelectionChange={noop}/>
    );

    expect(selectedChipsLabels(wrapper)).toEqual(['john.doe']);
  });

  it('displays workload next to employee names for selection', () => {
    const wrapper = mount(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         workLogFilter={workLog => !isEmpty(intersection(['nvm', 'jld'], workLog.projectNames))}
                         onSelectionChange={noop}/>
    );

    expect(chipWorkload(wrapper, 'john.doe')).toEqual('1d 7h');
    expect(chipWorkload(wrapper, 'tom.kowalsky')).toEqual('5h 30m');
  });

  it('displays workload next to tags for selection', () => {
    const wrapper = mount(
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         workLogFilter={workLog => includes(['tom.kowalsky'], workLog.employee)}
                         onSelectionChange={noop}/>
    );

    expect(chipWorkload(wrapper, 'projects')).toEqual('5h 30m');
    expect(chipWorkload(wrapper, 'jld')).toEqual('5h 30m');
    expect(chipWorkload(wrapper, 'internal')).toEqual('1d');
    expect(chipWorkload(wrapper, 'self-dev')).toEqual('1d');
    expect(chip(wrapper, 'nvm').find('[data-chip-workload]')).toHaveLength(0);
  });

  it('emits selection change on click', () => {
    const onChange = jest.fn();
    const selected = ['john.doe'];
    const wrapper = mount(
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selected}
                         onSelectionChange={onChange}/>
    );

    chip(wrapper, 'tom.kowalsky').simulate('click');

    expect(onChange).toHaveBeenCalledWith(['john.doe', 'tom.kowalsky']);
  });

  function header(wrapper): ReactWrapper {
    return wrapper.find('[data-work-log-selector-title]').at(0);
  }

  function chips(wrapper): ReactWrapper {
    return wrapper.find(Chip)
  }

  function chipsLabels(wrapper): string[] {
    return chips(wrapper).map(w => w.find('[data-chip-label]').at(0).text());
  }

  function selectedChips(wrapper) {
    return chips(wrapper).filter('[data-chip-selected=true]');
  }

  function selectedChipsLabels(wrapper): string[] {
    return selectedChips(wrapper).map(w => w.find('[data-chip-label]').at(0).text());
  }

  function chip(wrapper, label: string): ReactWrapper {
    return chips(wrapper)
        .filterWhere((w: any) => w.find('[data-chip-label]').at(0).text() === label).at(0);
  }

  function chipWorkload(wrapper, label: string): string {
    return chip(wrapper, label).find('[data-chip-workload]').at(0).text();
  }
});