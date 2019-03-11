import * as React from 'react';
import moment from 'moment';
import { mount, ReactWrapper } from 'enzyme';
import { InputBase } from '@material-ui/core';
import { noop } from 'lodash';
import { WorkLogInput } from './WorkLogInput';
import { ParsedWorkLog } from '../../workLogExpressionParser/WorkLogExpressionParser';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { ConfirmNewTagsDialog } from '../confirmNewTagsDialog/ConfirmNewTagsDialog';

const tags = ['projects', 'nvm', 'vacation'];

describe('WorkLogInput', () => {

  it('parses new work log expression', () => {
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

  it('emits valid work log for today if date not present', () => {
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

  it('emits invalid work log if tags not present', () => {
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

    it('replaces last word with selected tag suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={workLog => parsedWorkLog = workLog} onSave={noop}/>
      );

      typeAndFocus(wrapper, '1d #pro');
      chooseSuggestion(wrapper, 0);

      expect(parsedWorkLog.expression).toEqual('1d #projects ');
    });

    it('shows suggestions when user starts typing date', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={noop}/>
      );

      typeAndFocus(wrapper, '1d @to');

      expect(suggestions(wrapper)).toHaveLength(2);
      expect(suggestions(wrapper).at(0).text()).toEqual('today');
      expect(suggestions(wrapper).at(1).text()).toEqual('tomorrow');
    });

    it('replaces last word with selected day suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={workLog => parsedWorkLog = workLog} onSave={noop}/>
      );

      typeAndFocus(wrapper, '1d #projects @to');
      chooseSuggestion(wrapper, 1);

      expect(parsedWorkLog.expression).toEqual('1d #projects @tomorrow ');
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

  describe('new tags', () => {
    it('shows confirmation dialog if work log contains new tags', () => {
      const onSave = jest.fn();
      const initialWorkLog = new ParsedWorkLog('1h #new-tag @2019/03/01', ['2019/03/01'], ['new-tag'], '1h');
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={onSave}/>
      );

      pressEnter(wrapper);

      expect(onSave).not.toHaveBeenCalled();
      expect(wrapper.find(DialogContent)).toHaveLength(1);
      expect(wrapper.find(DialogContent).text()).toEqual('This action will add new tag: new-tag.Make sure you really want to do this!');
    });

    it('emits save if user confirmed new tags', () => {
      const onSave = jest.fn();
      const initialWorkLog = new ParsedWorkLog('1h #new-tag @2019/03/01', ['2019/03/01'], ['new-tag'], '1h');
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={onSave}/>
      );

      pressEnter(wrapper);
      confirmButton(wrapper).simulate('click');

      expect(onSave).toHaveBeenCalledWith({
        days: ['2019/03/01'],
        expression: '1h #new-tag @2019/03/01',
        tags: ['new-tag'],
        workload: '1h'
      });
      expect(wrapper.find(ConfirmNewTagsDialog).props().open).toBeFalsy();
    });

    it('closes dialog when CANCEL clicked', () => {
      const initialWorkLog = new ParsedWorkLog('1h #new-tag @2019/03/01', ['2019/03/01'], ['new-tag'], '1h');
      const wrapper = mount(
          <WorkLogInput workLog={initialWorkLog} tags={tags} onChange={noop} onSave={noop}/>
      );

      pressEnter(wrapper);
      cancelButton(wrapper).simulate('click');

      expect(wrapper.find(ConfirmNewTagsDialog).props().open).toBeFalsy();
    });

    function confirmButton(wrapper) {
      return wrapper.find(DialogActions).at(0).find(Button).filter('[data-confirm-button]').at(0);
    }

    function cancelButton(wrapper) {
      return wrapper.find(DialogActions).at(0).find(Button).filter('[data-cancel-button]').at(0);
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
