import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { noop } from 'lodash';
import { EditWorkLogDialog } from './EditWorkLogDialog';
import { ReportingWorkLog } from '../reporting.model';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

const workLog = new ReportingWorkLog({
  id: '1',
  workload: 480,
  day: '2019/03/28',
  employee: 'john.doe',
  projectNames: ['projects', 'nvm'],
  link: 'link'
});

describe('Edit work log dialog', () => {
  it('displays values', () => {
    const wrapper = mount(
        <EditWorkLogDialog workLog={workLog} tags={[]} onClose={noop} open={true} />
    );

    expect(inputValue(wrapper, '[data-edit-work-log-workload]')).toEqual('1d');
    expect(inputValue(wrapper, '[data-edit-work-log-project]')).toEqual('projects, nvm');
    expect(inputValue(wrapper, '[data-edit-work-log-employee]')).toEqual('john.doe');
    expect(inputValue(wrapper, '[data-edit-work-log-date]')).toEqual('2019/03/28');
  });

  it('emits updated work log on UPDATE click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <EditWorkLogDialog workLog={workLog} tags={[]} onClose={onClose} open={true} />
    );

    typeExpression(wrapper, '[data-edit-work-log-workload]', '7h');
    typeExpression(wrapper, '[data-edit-work-log-project]', ' projects,jld, ');
    updateButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith({
      id: '1',
      projectNames: ['projects', 'jld'],
      workload: '7h'
    })
  });

  it('shows suggestions for projects', () => {
    const tags = ['projects', 'nvm', 'jld', 'internal'];
    const wrapper = mount(
        <EditWorkLogDialog workLog={workLog} tags={tags} onClose={noop} open={true} />
    );

    typeTagsAndFocus(wrapper, 'p');

    expect(suggestions(wrapper)).toHaveLength(1);
    expect(suggestions(wrapper).at(0).text()).toEqual('projects');
  });

  it('replaces last word with selected tag suggestion', () => {
    const tags = ['projects', 'nvm', 'jld', 'internal'];
    const wrapper = mount(
        <EditWorkLogDialog workLog={workLog} tags={tags} onClose={noop} open={true} />
    );

    typeTagsAndFocus(wrapper, 'pro');
    chooseSuggestion(wrapper, 0);

    expect(inputValue(wrapper, '[data-edit-work-log-project]')).toEqual('projects, ');
  });

  function dialogInput(wrapper, selector: string) {
    return wrapper.find(TextField).filter(selector)
        .find('input');
  }

  function inputValue(wrapper, selector: string) {
    return (dialogInput(wrapper, selector).instance() as any).value;
  }

  function updateButton(wrapper) {
    return wrapper.find(Button).filter('[data-update-button]').at(0);
  }

  function typeExpression(wrapper, selector: string, expression: string) {
    const input = dialogInput(wrapper, selector);
    input.simulate('change', {target: {value: expression}});
  }

  function typeTagsAndFocus(wrapper, expression: string) {
    const inputField = dialogInput(wrapper, '[data-edit-work-log-project]');
    inputField.simulate('change', {target: {value: expression}});
    inputField.simulate('focus');
  }

  function suggestions(wrapper): ReactWrapper {
    return wrapper.find('li.react-autosuggest__suggestion');
  }

  function chooseSuggestion(wrapper, suggestionIdx: number) {
    suggestions(wrapper).at(suggestionIdx).simulate('click');
  }
});