import React from 'react';
import moment from 'moment';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { noop } from 'lodash';
import { WorkLogInput, WorkLogInputProps } from './WorkLogInput';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import { Preset } from '../registration.model';
import { ignoreHtmlTags } from '../../../utils/testUtils';

const tags = ['projects', 'nvm', 'vacation'];

const presets: Preset[] = [
  {tags: ['nvm', 'projects']},
  {tags: ['holiday']}
];

describe('WorkLogInput', () => {

  it('parses new work log expression', () => {
    const onChange = jest.fn();
    const initialWorkLog = ParsedWorkLog.empty();
    const container = render(worLogInput({workLog: initialWorkLog, tags, onChange}));

    type(container, '1d #projects #nvm @2019/03/01');

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
    const container = render(worLogInput({workLog: initialWorkLog, tags, onChange: parsed => parsedWorkLog = parsed}));

    type(container, '1d #projects #nvm');

    expect(parsedWorkLog.expression).toEqual('1d #projects #nvm');
    expect(parsedWorkLog.validate().valid).toBeTruthy();
    expect(parsedWorkLog.workload).toEqual('1d');
    expect(parsedWorkLog.tags).toEqual(['projects', 'nvm']);
    expect(parsedWorkLog.days).toEqual([moment().format('YYYY/MM/DD')]);
  });

  it('emits invalid work log if tags not present', () => {
    let parsedWorkLog: ParsedWorkLog = undefined;
    const initialWorkLog = ParsedWorkLog.empty();
    const container = render(worLogInput({workLog: initialWorkLog, tags, onChange: parsed => parsedWorkLog = parsed}));

    type(container, '1d');

    expect(parsedWorkLog.expression).toEqual('1d');
    expect(parsedWorkLog.validate().valid).toBeFalsy();
  });

  it('emits save on enter click if valid work log', () => {
    let savePayload: ParsedWorkLog = undefined;
    const initialWorkLog = new ParsedWorkLog('1d #projects #nvm @2019/03/01', ['2019/03/01'], ['projects', 'nvm'], '1d');
    const container = render(worLogInput({workLog: initialWorkLog, tags, onSave: payload => savePayload = payload}));

    pressEnter(container);

    expect(savePayload.validate().valid).toBeTruthy();
    expect(savePayload.workload).toEqual('1d');
    expect(savePayload.days).toEqual(['2019/03/01']);
    expect(savePayload.tags).toEqual(['projects', 'nvm']);
  });

  it('does not emit save on enter if invalid work log', () => {
    const onSave = jest.fn();
    const initialWorkLog = new ParsedWorkLog('1d', [], [], undefined);
    const container = render(worLogInput({workLog: initialWorkLog, tags, onSave}));

    pressEnter(container);

    expect(onSave).not.toHaveBeenCalled();
  });

  describe('suggestions', () => {
    it('does not show suggestion if word does not starts with # or @', () => {
      const initialWorkLog = new ParsedWorkLog('pro', [], [], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags}));

      fireEvent.focus(workLogInput(container));

      expect(suggestions(container)).toHaveLength(0);
    });

    it('shows presets at the top when user typed #', () => {
      const initialWorkLog = new ParsedWorkLog('#', [], [], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags, presets}));

      fireEvent.focus(workLogInput(container));

      expect((suggestions(container))[0]).toHaveTextContent('nvm, projects');
      expect((suggestions(container))[1]).toHaveTextContent('holiday');
      expect((suggestions(container))[2]).toHaveTextContent('nvm');
    });

    it('shows suggestions when user starts typing tag name', () => {
      const initialWorkLog = new ParsedWorkLog('#p', [], [], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags, presets}));

      fireEvent.focus(workLogInput(container));

      expect(suggestions(container)).toHaveLength(2);
      expect(suggestions(container)[0]).toHaveTextContent('nvm, projects');
      expect(suggestions(container)[1]).toHaveTextContent('projects');
    });

    it('replaces last word with selected tag suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = new ParsedWorkLog('1d #pro', [], ['pro'], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags, onChange: workLog => parsedWorkLog = workLog}));

      fireEvent.focus(workLogInput(container));
      fireEvent.click(container.getByText(ignoreHtmlTags('projects')));

      expect(parsedWorkLog.expression).toEqual('1d #projects ');
    });

    it('replaces last word with selected preset', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = new ParsedWorkLog('1d #pro', [], ['pro'], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags, presets, onChange: workLog => parsedWorkLog = workLog}));

      fireEvent.focus(workLogInput(container));
      fireEvent.click(container.getByText(ignoreHtmlTags('nvm, projects')));

      expect(parsedWorkLog.expression).toEqual('1d #nvm #projects ');
    });

    it('shows suggestions when user starts typing date', () => {
      const initialWorkLog = new ParsedWorkLog('1d @to', [], [], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags}));

      fireEvent.focus(workLogInput(container));

      expect(suggestions(container)).toHaveLength(2);
      expect(suggestions(container)[0]).toHaveTextContent('today');
      expect(suggestions(container)[1]).toHaveTextContent('tomorrow');
    });

    it('replaces last word with selected day suggestion', () => {
      let parsedWorkLog: ParsedWorkLog = undefined;
      const initialWorkLog = new ParsedWorkLog('1d #projects @to', [], ['projects'], '1d');
      const container = render(worLogInput({workLog: initialWorkLog, tags, onChange: workLog => parsedWorkLog = workLog}));

      fireEvent.focus(workLogInput(container));
      fireEvent.click(container.getByText(ignoreHtmlTags('tomorrow')));

      expect(parsedWorkLog.expression).toEqual('1d #projects @tomorrow ');
    });

    function suggestions(container: RenderResult) {
      return container.queryAllByRole('menuitem');
    }
  });

  describe('new tags', () => {
    it('shows confirmation dialog if work log contains new tags', () => {
      const onSave = jest.fn();
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const container = render(worLogInput({workLog: initialWorkLog, tags}));

      pressEnter(container);

      expect(onSave).not.toHaveBeenCalled();
      expect(container.getByTestId('confirm-new-tags')).toBeVisible();
      expect(container.getByText(ignoreHtmlTags('This action will add new tag: new-tag.Make sure you really want to do this!')))
          .toBeInTheDocument();
    });

    it('emits save if user confirmed new tags', () => {
      const onSave = jest.fn();
      const expression = '1h #projects #new-tag @2019/03/01';
      const initialWorkLog = new ParsedWorkLog(expression, ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const container = render(worLogInput({workLog: initialWorkLog, tags, onSave}));

      pressEnter(container);
      fireEvent.click(container.getByText('Confirm'));

      expect(onSave).toHaveBeenCalledWith({
        days: ['2019/03/01'],
        expression: expression,
        tags: ['projects', 'new-tag'],
        workload: '1h'
      });
      expect(container.queryByTestId('confirm-new-tags')).not.toBeVisible();
    });

    it('closes dialog when CANCEL clicked', () => {
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const container = render(worLogInput({workLog: initialWorkLog, tags}));

      pressEnter(container);
      fireEvent.click(container.getByTestId('cancel-new-tags-button'));

      expect(container.queryByTestId('confirm-new-tags')).not.toBeVisible();
    });
  });

  describe('validation', () => {
    it('does not show icon for empty input', () => {
      const initialWorkLog = ParsedWorkLog.empty();
      const {queryByTestId} = render(worLogInput({workLog: initialWorkLog, tags}));

      expect(queryByTestId('error-indicator')).not.toBeInTheDocument();
      expect(queryByTestId('ok-indicator')).not.toBeInTheDocument();
    });

    it('shows success icon for valid expression', () => {
      const initialWorkLog = new ParsedWorkLog('1h #projects #new-tag @2019/03/01', ['2019/03/01'], ['projects', 'new-tag'], '1h');
      const {getByTestId, queryByTestId} = render(worLogInput({workLog: initialWorkLog, tags}));

      expect(queryByTestId('error-indicator')).not.toBeInTheDocument();
      expect(getByTestId('ok-indicator')).toBeInTheDocument();
    });

    it('shows error icon for invalid expression', () => {
      const initialWorkLog = new ParsedWorkLog('1hasd', [], [], '');
      const {getByTestId, queryByTestId} = render(worLogInput({workLog: initialWorkLog, tags}));

      expect(getByTestId('error-indicator')).toBeInTheDocument();
      expect(queryByTestId('ok-indicator')).not.toBeInTheDocument();
    });
  });
  
  describe('auto added tags', () => {
    it('adds tags as per config', () => {
      let parsedWorkLog: ParsedWorkLog;
      const autoAddedTagsMapping = new Map().set('tag-with-auto-added', ['added-tag']);
      const container = render(worLogInput({tags: [], onChange: e => parsedWorkLog = e, autoAddedTagsMapping}));

      type(container, "#tag-with-auto-added");

      expect(parsedWorkLog.tags).toContain('added-tag');
      expect(parsedWorkLog.tags).toContain('tag-with-auto-added');
      expect(parsedWorkLog.tags.length).toEqual(2);
    })
  });

  function worLogInput(overrides: Partial<WorkLogInputProps>) {
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
  
  function type(container: RenderResult, expression: string) {
    const input = workLogInput(container);
    fireEvent.change(input, {target: {value: expression}});
    fireEvent.focus(input);
  }

  function pressEnter(container: RenderResult) {
    fireEvent.keyPress(workLogInput(container), {key: 'Enter', keyCode: 13});
  }

  function workLogInput(container: RenderResult) {
    return container.getByRole('combobox').firstChild.firstChild;
  }
});
