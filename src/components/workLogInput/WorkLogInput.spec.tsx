import * as React from 'react';
import moment from 'moment';
import { mount, ReactWrapper } from 'enzyme';
import { InputBase } from '@material-ui/core';
import { noop } from 'lodash';
import { WorkLogInput } from './WorkLogInput';
import { ParsedWorkLog } from '../../workLogExpressionParser/WorkLogExpressionParser';

const tags = ['projects', 'nvm', 'vacation'];

describe('WorkLogInput', () => {

  it('parses new worklog expression', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    type(wrapper, '1d #projects #nvm @2019/03/01');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm @2019/03/01');
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual(['2019/03/01']);
  });

  it('emits valid worklog for today if date not present', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    type(wrapper, '1d #projects #nvm');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm');
    expect(parsedWorkLog.valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual([moment().format('YYYY/MM/DD')]);
  });

  it('emits invalid worklog if tags not present', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={parsed => parsedWorkLog = parsed} onSave={noop}/>
    );

    type(wrapper, '1d');

    expect(parsedWorkLog.expression).toEqual('1d');
    expect(parsedWorkLog.valid).toBeFalsy();
  });

  it('emits save on enter click if valid work log', () => {
    let savePayload: ParsedWorkLog = undefined;
    const initialWorkLog = new ParsedWorkLog('1d #projects #nvm @2019/03/01', ['2019/03/01'], ['projects', 'nvm'], '1d');
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={payload => savePayload = payload}/>
    );

    pressEnter(wrapper);

    expect(savePayload.valid).toBeTruthy();
    expect(savePayload.workload).toEqual('1d');
    expect(savePayload.days).toEqual(['2019/03/01']);
    expect(savePayload.tags).toEqual(['projects', 'nvm']);
  });

  it('does not emit save on enter if invalid work log', () => {
    const onSave = jest.fn();
    const initialWorkLog = new ParsedWorkLog('1d', [], [], undefined);
    const wrapper = mount(
        <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={onSave}/>
    );

    pressEnter(wrapper);

    expect(onSave).not.toHaveBeenCalled();
  });

  describe('suggestions', () => {
    it('does not show suggestion if word does not starts with #', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={noop}/>
      );

      typeAndFocus(wrapper, 'pro');

      expect(suggestions(wrapper)).toHaveLength(0);
    });

    it('shows suggestions when user starts typing tag name', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={noop}/>
      );

      typeAndFocus(wrapper, '1d #pro');

      expect(suggestions(wrapper)).toHaveLength(1);
      expect(suggestions(wrapper).at(0).text()).toEqual('projects');
    });

    it('replaces last word with selected suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={workLog => parsedWorkLog = workLog} onSave={noop}/>
      );

      typeAndFocus(wrapper, '1d #pro');
      chooseSuggestion(wrapper, 0);

      expect(parsedWorkLog.expression).toEqual('1d #projects');
    });

    function typeAndFocus(wrapper, expression: string) {
      const inputField = workLogInput(wrapper);
      inputField.simulate('change', {target: {value: expression}});
      wrapper.setProps({workLog: new ParsedWorkLog(expression, [], [], undefined)});
      inputField.simulate('focus');
    }

    function chooseSuggestion(wrapper, suggestionIdx: number) {
      suggestions(wrapper).at(suggestionIdx).simulate('click');
    }

    function suggestions(wrapper): ReactWrapper {
      return wrapper.find('li.react-autosuggest__suggestion');
    }
  });

  function type(wrapper, expression: string) {
    const input = workLogInput(wrapper);
    input.simulate('change', {target: {value: expression}});
    input.simulate('focus');
  }

  function pressEnter(wrapper) {
    const input = workLogInput(wrapper);
    input.simulate('keypress', {key: 'Enter'});
  }

  function workLogInput(wrapper): ReactWrapper {
    return wrapper.find(InputBase).at(0).find('input');
  }
});
