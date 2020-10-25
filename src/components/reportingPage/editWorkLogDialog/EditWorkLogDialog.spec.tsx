import { fireEvent, render, RenderResult, within } from '@testing-library/react';
import * as React from 'react';
import { noop } from 'lodash';
import { EditWorkLogDialog } from './EditWorkLogDialog';
import { ReportingWorkLog } from '../reporting.model';
import { ignoreHtmlTags } from '../../../utils/testUtils';

const workLog = new ReportingWorkLog({
  id: '1',
  workload: 480,
  day: '2019/03/28',
  employee: 'john.doe',
  projectNames: ['projects', 'nvm'],
  link: 'link'
});

describe('Edit work log dialog', () => {
  it('displays labels', () => {
    const {getByTestId} = render(
        <EditWorkLogDialog workLog={workLog} tags={[]} onClose={noop} open={true} />
    );

    expect(within(getByTestId('edit-workload')).getByText('Workload')).toBeInTheDocument();
    expect(within(getByTestId('edit-employee')).getByText('Employee')).toBeInTheDocument();
    expect(within(getByTestId('edit-date')).getByText('Date')).toBeInTheDocument();
    expect(within(getByTestId('edit-project')).getByText('Projects')).toBeInTheDocument();
  });

  it('displays values', () => {
    const {getByTestId} = render(
        <EditWorkLogDialog workLog={workLog} tags={[]} onClose={noop} open={true} />
    );

    expect(within(getByTestId('edit-workload')).getByDisplayValue('1d')).toBeInTheDocument();
    expect(within(getByTestId('edit-project')).getByDisplayValue('projects, nvm')).toBeInTheDocument();
    expect(within(getByTestId('edit-employee')).getByDisplayValue('john.doe')).toBeInTheDocument();
    expect(within(getByTestId('edit-date')).getByDisplayValue('2019/03/28')).toBeInTheDocument();
  });

  it('emits updated work log on UPDATE click', () => {
    const onClose = jest.fn();
    const container = render(
        <EditWorkLogDialog workLog={workLog} tags={[]} onClose={onClose} open={true} />
    );

    typeExpression(container, 'edit-workload', '7h');
    typeExpression(container, 'edit-project', ' projects,jld, ');

    fireEvent.click(container.getByText('Update'));

    expect(onClose).toHaveBeenCalledWith({
      id: '1',
      projectNames: ['projects', 'jld'],
      workload: '7h'
    })
  });

  it('shows suggestions for projects', () => {
    const tags = ['projects', 'nvm', 'jld', 'internal'];
    const container = render(
        <EditWorkLogDialog workLog={workLog} tags={tags} onClose={noop} open={true} />
    );

    typeTagsAndFocus(container, 'p');

    expect(container.getByText(ignoreHtmlTags('projects'))).toBeInTheDocument();
  });

  it('replaces last word with selected tag suggestion', () => {
    const tags = ['projects', 'nvm', 'jld', 'internal'];
    const container = render(
        <EditWorkLogDialog workLog={workLog} tags={tags} onClose={noop} open={true} />
    );

    typeTagsAndFocus(container, 'pro');
    fireEvent.click(container.getByText(ignoreHtmlTags('projects')));

    expect(within(container.getByTestId('edit-project')).getByDisplayValue('projects,')).toBeInTheDocument();
  });

  function dialogInput(container: RenderResult, selector: string) {
    return container.getByTestId(selector).lastChild.lastChild;
  }

  function typeExpression(container: RenderResult, selector: string, expression: string) {
    fireEvent.change(dialogInput(container, selector), {target: {value: expression}});
  }

  function typeTagsAndFocus(wrapper, expression: string) {
    const input = dialogInput(wrapper, 'edit-project');
    fireEvent.change(input, {target: {value: expression}});
    fireEvent.focus(input);
  }
});
