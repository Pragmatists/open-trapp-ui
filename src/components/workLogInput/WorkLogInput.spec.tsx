import { mount } from 'enzyme';
import { WorkLogInput } from './WorkLogInput';
import * as React from 'react';
import { InputBase } from '@material-ui/core';
import { ParsedWorkLog } from '../../workLogExpressionParser/WorkLogExpressionParser';
import moment from 'moment';

describe('WorklogInput', () => {

  it('parses new worklog expression', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(<WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed}/>);

    typeExpression(wrapper, '1d #projects #nvm @2019/03/01');
    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm @2019/03/01')
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual(['2019/03/01']);
  });

  it('emits valid worklog for today if date not present', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(<WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed}/>);

    typeExpression(wrapper, '1d #projects #nvm');
    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm')
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual([moment().format('YYYY/MM/DD')]);
  });

  it('emits invalid worklog if tags not present', () => {
    let parsedWorkLog: ParsedWorkLog;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(<WorkLogInput workLog={initialWorkLog} onChange={parsed => parsedWorkLog = parsed}/>);

    typeExpression(wrapper, '1d');
    expect(parsedWorkLog.expression).toEqual('1d');
    expect(parsedWorkLog.valid).toBeFalsy();
  });

  function typeExpression(wrapper, expression: string) {
    const input = wrapper.find(InputBase).at(0).find('input');
    input.simulate('change', { target: { value: expression } })
  }
});
