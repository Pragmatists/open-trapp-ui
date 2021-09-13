import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { noop, repeat } from 'lodash';
import { SelfDevDescriptionDialog } from './SelfDevDescriptionDialog';

describe('Self-dev description dialog', () => {
  it('shows content if open', () => {
    const { getByRole, getByLabelText } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={noop} />
    );

    expect(getByLabelText('Self-dev description')).toBeVisible();
    expect(getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(getByRole('button', { name: 'Confirm' })).toBeVisible();
  })

  it('does not show content if closed', () => {
    const { queryByLabelText, queryByRole } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={noop} />
    );

    expect(queryByLabelText('Self-dev description')).toBeVisible();
    expect(queryByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(queryByRole('button', { name: 'Confirm' })).toBeVisible();
  })

  it('returns description on confirm', () => {
    const onConfirm = jest.fn();
    const { getByRole } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={onConfirm}/>
    );

    userEvent.type(getByRole('textbox'), 'Some self-dev description');
    userEvent.click(getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledWith('Some self-dev description');
  })

  it('discards description on cancel', () => {
    const onCancel = jest.fn();
    const { getByRole } = render(
        <SelfDevDescriptionDialog open={true} onCancel={onCancel} onConfirm={onCancel}/>
    );

    userEvent.click(getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  })

  it('description cannot be empty', () => {
    const onConfirm = jest.fn();
    const { getByRole, getByText } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={onConfirm}/>
    );

    userEvent.click(getByRole('button', { name: 'Confirm' }));

    expect(getByText('Description cannot be empty')).toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();
  })

  it('description cannot be blank', () => {
    const onConfirm = jest.fn();
    const { getByRole, getByText } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={onConfirm}/>
    );

    userEvent.type(getByRole('textbox'), ' ');
    userEvent.click(getByRole('button', { name: 'Confirm' }));

    expect(getByText('Description cannot be empty')).toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();
  })

  it('description is trimmed', () => {
    const onConfirm = jest.fn();
    const { getByRole } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={onConfirm}/>
    );

    userEvent.type(getByRole('textbox'), ' Text with spaces     ');
    userEvent.click(getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledWith('Text with spaces');
  })

  it('description cannot be longer than 1000 characters', () => {
    const onConfirm = jest.fn();
    const { getByRole, getByText } = render(
        <SelfDevDescriptionDialog open={true} onCancel={noop} onConfirm={onConfirm}/>
    );

    userEvent.type(getByRole('textbox'), repeat('a', 1001));
    userEvent.click(getByRole('button', { name: 'Confirm' }));

    expect(getByText('Description cannot be longer than 1000 characters')).toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();
  })
})
