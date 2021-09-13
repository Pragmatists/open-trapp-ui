import { noop, repeat } from 'lodash';
import { CreateWorkLogDialog } from './CreateWorkLogDialog';
import {fireEvent, render, RenderResult, within} from '@testing-library/react';
import userEvent from "@testing-library/user-event";

const tagList = ['projects', 'nvm', 'internal', 'standup', 'self-dev'];

describe('Create Work Log Dialog', () => {
  it('displays sorted list of tags', () => {
    const container = render(
        <CreateWorkLogDialog onCancel={noop} onSave={noop} open={true} tags={tagList}/>
    );

    expect(tagsText(container)).toEqual(['internal', 'nvm', 'projects', 'self-dev', 'standup']);
  });

  it('displays workload selector if tags provided', () => {
    const { getByTestId, queryByTestId } = render(
        <CreateWorkLogDialog onCancel={noop} onSave={noop} open={true} tags={tagList} selectedTags={['internal', 'standup']}/>
    );

    expect(getByTestId('workload-selector')).toBeVisible();
    expect(queryByTestId('tag')).not.toBeInTheDocument();
  })

  it('closes dialog on CANCEL click', () => {
    const onCancel = jest.fn();
    const { getByRole } = render(
        <CreateWorkLogDialog onCancel={onCancel} onSave={noop} open={true} tags={tagList}/>
    );

    fireEvent.click(getByRole('button', {name: 'Cancel'}));

    expect(onCancel).toHaveBeenCalled();
  });

  it('closes dialog on CANCEL click when tags are selected', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
        <CreateWorkLogDialog onCancel={onCancel} onSave={noop} open={true} tags={tagList}/>
    );
    fireEvent.click(getByText('projects'));
    fireEvent.click(getByText('nvm'));

    fireEvent.click(getByText('Cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('displays workload selector on NEXT click', () => {
    const { getByText, getByRole, getByTestId } = render(
        <CreateWorkLogDialog onCancel={noop} onSave={noop} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('projects'));
    fireEvent.click(getByRole('button', {name: 'Next'}));

    expect(getByTestId('workload-selector')).toBeVisible();
  });

  it('do nothing on NEXT click if no tags selected', () => {
    const container = render(
        <CreateWorkLogDialog onCancel={noop} onSave={noop} open={true} tags={tagList}/>
    );

    fireEvent.click(container.getByRole('button', {name: 'Next'}));

    expect(tagsText(container)).toEqual(['internal', 'nvm', 'projects', 'self-dev', 'standup']);
    expect(container.queryByTestId('workload-selector')).not.toBeInTheDocument();
  });

  it('displays description input if "self-dev" tag selected', () => {
    const { getByText, getByRole, getByLabelText } = render(
        <CreateWorkLogDialog onCancel={noop} onSave={noop} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));

    expect(getByLabelText('self-dev description')).toBeVisible();
    expect(getByText('Self-dev description')).toBeVisible();
  })

  it('emits selected tags and workload on SAVE click', () => {
    const onSave = jest.fn();
    const container = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(container.getByText('projects'));
    fireEvent.click(container.getByText('nvm'));
    fireEvent.click(container.getByRole('button', {name: 'Next'}));
    fireEvent.keyDown(hoursSlider(container), {key: 'ArrowLeft'});
    fireEvent.keyDown(minutesSlider(container), {key: 'ArrowRight'});
    fireEvent.click(container.getByRole('button', {name: 'Save'}));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(['projects', 'nvm'], '7h 15m', undefined);
  });

  it('emits selected tags, workload and description on SAVE click if "self-dev" selected', () => {
    const onSave = jest.fn();
    const {getByText, getByRole, getByLabelText} = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));
    userEvent.type(within(getByLabelText('self-dev description')).getByRole('textbox'), 'Some description');
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(onSave).toHaveBeenCalledWith(['self-dev'], '1d', 'Some description');
  })

  it('shows validation error if description is empty', () => {
    const onSave = jest.fn();
    const {getByText, getByRole} = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(onSave).not.toHaveBeenCalled()
    expect(getByText('Description cannot be empty')).toBeVisible();
  })

  it('shows validation error if description includes only blank characters', () => {
    const onSave = jest.fn();
    const {getByText, getByRole, getByLabelText} = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));
    userEvent.type(within(getByLabelText('self-dev description')).getByRole('textbox'), '    ');
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(onSave).not.toHaveBeenCalled()
    expect(getByText('Description cannot be empty')).toBeVisible();
  })

  it('shows validation error if description is too long', () => {
    const onSave = jest.fn();
    const {getByText, getByRole, getByLabelText} = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));
    userEvent.type(within(getByLabelText('self-dev description')).getByRole('textbox'), repeat('a', 1001));
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(onSave).not.toHaveBeenCalled()
    expect(getByText('Description cannot be longer than 1000 characters')).toBeVisible();
  })

  it('trims self-dev description', () => {
    const onSave = jest.fn();
    const {getByText, getByRole, getByLabelText} = render(
        <CreateWorkLogDialog onCancel={noop} onSave={onSave} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('self-dev'));
    fireEvent.click(getByRole('button', {name: 'Next'}));
    userEvent.type(within(getByLabelText('self-dev description')).getByRole('textbox'), '     Text to trim  ');
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(onSave).toHaveBeenCalledWith(['self-dev'], '1d', 'Text to trim');
  })

  function tagsText(container: RenderResult) {
    return container.queryAllByTestId('tag').map(w => w.textContent);
  }

  function hoursSlider(container: RenderResult) {
    return container.getByTestId('hours-slider').lastChild
  }

  function minutesSlider(container: RenderResult) {
    return container.getByTestId('minutes-slider').lastChild;
  }
});
