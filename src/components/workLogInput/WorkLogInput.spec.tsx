import * as React from 'react';
import moment from 'moment';
import { mount, ReactWrapper } from 'enzyme';
import { InputBase } from '@material-ui/core';
import { noop } from 'lodash';
import { WorkLogInput } from './WorkLogInput';
import { ParsedWorkLog } from '../../workLogExpressionParser/WorkLogExpressionParser';

describe('WorkLogInput', () => {

  it('parses new worklog expression', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    typeExpression(wrapper, '1d #projects #nvm @2019/03/01');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm @2019/03/01');
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual(['2019/03/01']);
  });

  it('emits valid worklog for today if date not present', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    typeExpression(wrapper, '1d #projects #nvm');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm');
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual([moment().format('YYYY/MM/DD')]);
  });

  it('emits invalid worklog if tags not present', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    typeExpression(wrapper, '1d');

    expect(parsedWorkLog.expression).toEqual('1d');
    expect(parsedWorkLog.valid).toBeFalsy();
  });

  it('emits save on enter click if valid work log', () => {
    let savePayload: ParsedWorkLog;
    const initialWorkLog = new ParsedWorkLog('1d #projects #nvm @2019/03/01', ['2019/03/01'], ['projects', 'nvm'], '1d');
    const wrapper = mount(<WorkLogInput workLog={initialWorkLog} onChange={noop} onSave={payload => savePayload = payload}/>);

    pressEnter(wrapper);

    expect(savePayload.valid).toBeTruthy();
    expect(savePayload.workload).toEqual('1d');
    expect(savePayload.days).toEqual(['2019/03/01']);
    expect(savePayload.tags).toEqual(['projects', 'nvm']);
  });

  it('does not emit save on enter if invalid work log', () => {
    const onSave = jest.fn();
    const initialWorkLog = new ParsedWorkLog('1d', [], [], undefined);
    const wrapper = mount(<WorkLogInput workLog={initialWorkLog} onChange={noop} onSave={onSave}/>);

    pressEnter(wrapper);

    expect(onSave).not.toHaveBeenCalled();
  });

  function typeExpression(wrapper, expression: string) {
    const input = workLogInput(wrapper);
    input.simulate('change', {target: {value: expression}})
  }

  function pressEnter(wrapper) {
    const input = workLogInput(wrapper);
    input.simulate('keypress', {key: 'Enter'});
  }

  function workLogInput(wrapper): ReactWrapper {
    return wrapper.find(InputBase).at(0).find('input');
  }
});
