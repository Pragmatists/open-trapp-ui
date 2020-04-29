import React from 'react';
import moment from 'moment';
import { mount, ReactWrapper } from 'enzyme';
import { InputBase } from '@material-ui/core';
import { noop } from 'lodash';
import {WorkLogInput, WorkLogInputProps} from './WorkLogInput';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { ConfirmNewTagsDialog } from '../confirmNewTagsDialog/ConfirmNewTagsDialog';
import { Preset } from '../registration.model';

const tags = ['projects', 'nvm', 'vacation'];

const presets: Preset[] = [
  {tags: ['nvm', 'projects']},
  {tags: ['holiday']}
];

describe('WorkLogInput', () => {

  it('parses new work log expression', () => {
    const onChange = jest.fn();
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onChange}));

    type(wrapper, '1d #projects #nvm @2019/03/01');

    expect(onChange).toHaveBeenCalledWith({
      expression: '1d #projects #nvm @2019/03/01',
      workload: '1d',
      tags: ['projects', 'nvm'],
      days: ['2019/03/01']
    });
  });

  it('emits valid work log for today if date not present', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onChange: parsed => parsedWorkLog = parsed}));

    type(wrapper, '1d #projects #nvm');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm');
    expect(parsedWorkLog.validate().valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual([moment().format('YYYY/MM/DD')]);
  });

  it('emits invalid work log if tags not present', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onChange: parsed => parsedWorkLog = parsed}));

    type(wrapper, '1d');

    expect(parsedWorkLog.expression).toEqual('1d');
    expect(parsedWorkLog.validate().valid).toBeFalsy();
  });

  it('emits save on enter click if valid work log', () => {
    let savePayload: ParsedWorkLog = undefined;
    const initialWorkLog = new ParsedWorkLog('1d #projects #nvm @2019/03/01', ['2019/03/01'], ['projects', 'nvm'], '1d');
    const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onSave: payload => savePayload = payload}));

    pressEnter(wrapper);

    expect(savePayload.validate().valid).toBeTruthy();
    expect(savePayload.workload).toEqual('1d');
    expect(savePayload.days).toEqual(['2019/03/01']);
    expect(savePayload.tags).toEqual(['projects', 'nvm']);
  });

  it('does not emit save on enter if invalid work log', () => {
    const onSave = jest.fn();
    const initialWorkLog = new ParsedWorkLog('1d', [], [], undefined);
    const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onSave}));
    pressEnter(wrapper);

    expect(onSave).not.toHaveBeenCalled();
  });

  describe('suggestions', () => {
    it('does not show suggestion if word does not starts with # or @', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      typeAndFocus(wrapper, 'pro');

      expect(suggestions(wrapper)).toHaveLength(0);
    });

    it('shows presets at the top when user typed #', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, presets}));

      typeAndFocus(wrapper, '1d #');

      expect(suggestions(wrapper).at(0).text()).toEqual('nvm, projects');
      expect(suggestions(wrapper).at(1).text()).toEqual('holiday');
      expect(suggestions(wrapper).at(2).text()).toEqual('nvm');
    });

    it('shows suggestions when user starts typing tag name', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, presets}));

      typeAndFocus(wrapper, '1d #pro');

      expect(suggestions(wrapper)).toHaveLength(2);
      expect(suggestions(wrapper).at(0).text()).toEqual('nvm, projects');
      expect(suggestions(wrapper).at(1).text()).toEqual('projects');
    });

    it('replaces last word with selected tag suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onChange: workLog => parsedWorkLog = workLog}));

      typeAndFocus(wrapper, '1d #pro');
      chooseSuggestion(wrapper, 0);

      expect(parsedWorkLog.expression).toEqual('1d #projects ');
    });

    it('replaces last word with selected preset', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, presets, onChange: workLog => parsedWorkLog = workLog}));

      typeAndFocus(wrapper, '1d #pro');
      chooseSuggestion(wrapper, 0);

      expect(parsedWorkLog.expression).toEqual('1d #nvm #projects ');
    });

    it('shows suggestions when user starts typing date', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      typeAndFocus(wrapper, '1d @to');

      expect(suggestions(wrapper)).toHaveLength(2);
      expect(suggestions(wrapper).at(0).text()).toEqual('today');
      expect(suggestions(wrapper).at(1).text()).toEqual('tomorrow');
    });

    it('replaces last word with selected day suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onChange: workLog => parsedWorkLog = workLog}));

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
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      pressEnter(wrapper);

      expect(onSave).not.toHaveBeenCalled();
      expect(wrapper.find(DialogContent)).toHaveLength(1);
      expect(wrapper.find(DialogContent).text()).toEqual('This action will add new tag: new-tag.Make sure you really want to do this!');
    });

    it('emits save if user confirmed new tags', () => {
      const onSave = jest.fn();
      const expression = '1h #projects #new-tag @2019/03/01';
      const initialWorkLog = new ParsedWorkLog(expression, ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags, onSave}));

      pressEnter(wrapper);
      confirmButton(wrapper).simulate('click');

      expect(onSave).toHaveBeenCalledWith({
        days: ['2019/03/01'],
        expression: expression,
        tags: ['projects', 'new-tag'],
        workload: '1h'
      });
      expect(wrapper.find(ConfirmNewTagsDialog).props().open).toBeFalsy();
    });

    it('closes dialog when CANCEL clicked', () => {
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

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

  describe('validation', () => {
    it('does not show icon for empty input', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      expect(wrapper.find('[data-error-indicator]')).toHaveLength(0);
      expect(wrapper.find('[data-ok-indicator]')).toHaveLength(0);
    });

    it('shows success icon for valid expression', () => {
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      expect(wrapper.find('[data-error-indicator]')).toHaveLength(0);
      expect(wrapper.find('[data-ok-indicator]').length).toBeGreaterThan(0);
    });

    it('shows error icon for invalid expression', () => {
      const initialWorkLog = new ParsedWorkLog('1hasd', [], [], '');
      const wrapper = mount(prepareWorLogInput({workLog: initialWorkLog, tags}));

      expect(wrapper.find('[data-error-indicator]').length).toBeGreaterThan(0);
      expect(wrapper.find('[data-ok-indicator]')).toHaveLength(0);
    });
  });
  
  describe('auto added tags', () => {
    it('adds tags as per config', () => {
      let parsedWorkLog: ParsedWorkLog;
      const autoAddedTagsMapping = new Map().set('tag-with-auto-added', ['added-tag']);
      const wrapper = mount(prepareWorLogInput({tags: [], onChange: e => parsedWorkLog = e, autoAddedTagsMapping}));

      type(wrapper, "#tag-with-auto-added");

      expect(parsedWorkLog.tags).toContain('added-tag');
      expect(parsedWorkLog.tags).toContain('tag-with-auto-added');
      expect(parsedWorkLog.tags.length).toEqual(2);
    })
  });

  function prepareWorLogInput(overrides: Partial<WorkLogInputProps>) {
    const props: WorkLogInputProps = {
      workLog: overrides.workLog || ParsedWorkLog.empty(),
      tags: overrides.tags || [],
      presets: overrides.presets || [],
      onChange: overrides.onChange || noop,
      onSave: overrides.onSave || noop,
      autoAddedTagsMapping: overrides.autoAddedTagsMapping || new Map<string, string[]>()
    };

    return <WorkLogInput {...props} />;
  }
  
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
