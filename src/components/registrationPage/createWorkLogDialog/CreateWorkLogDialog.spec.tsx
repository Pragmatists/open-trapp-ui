import React from 'react';
import { noop } from 'lodash';
import { CreateWorkLogDialog } from './CreateWorkLogDialog';
import { fireEvent, render, RenderResult } from '@testing-library/react';

const tagList = ['projects', 'nvm', 'internal', 'standup'];

describe('Create Work Log Dialog', () => {
  it('displays sorted list of tags', () => {
    const container = render(
        <CreateWorkLogDialog onClose={noop} open={true} tags={tagList}/>
    );

    expect(tagsText(container)).toEqual(['internal', 'nvm', 'projects', 'standup']);
  });

  it('closes dialog on CANCEL click', () => {
    const onClose = jest.fn();
    const { getByText } = render(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('Cancel'));

    expect(onClose).toHaveBeenCalledWith();
  });

  it('closes dialog on CANCEL click when tags are selected', () => {
    const onClose = jest.fn();
    const { getByText } = render(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList}/>
    );
    fireEvent.click(getByText('projects'));
    fireEvent.click(getByText('nvm'));

    fireEvent.click(getByText('Cancel'));

    expect(onClose).toHaveBeenCalledWith();
  });

  it('displays workload selector on NEXT click', () => {
    const onClose = jest.fn();
    const { getByText, getByTestId } = render(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList}/>
    );

    fireEvent.click(getByText('projects'));
    fireEvent.click(getByText('Next'));

    expect(getByTestId('workload-selector')).toBeInTheDocument();
  });

  it('do nothing on NEXT click if no tags selected', () => {
    const onClose = jest.fn();
    const container = render(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList}/>
    );

    fireEvent.click(container.getByText('Next'));

    expect(tagsText(container)).toEqual(['internal', 'nvm', 'projects', 'standup']);
    expect(container.queryByTestId('workload-selector')).not.toBeInTheDocument();
  });

  it('emits selected tags and workload on SAVE click', () => {
    const onClose = jest.fn();
    const container = render(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList}/>
    );

    fireEvent.click(container.getByText('projects'));
    fireEvent.click(container.getByText('nvm'));
    fireEvent.click(container.getByText('Next'));
    fireEvent.keyDown(hoursSlider(container), {key: 'ArrowLeft'});
    fireEvent.keyDown(minutesSlider(container), {key: 'ArrowRight'});
    fireEvent.click(container.getByText('Save'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]).toEqual(['projects', 'nvm']);
    expect(onClose.mock.calls[0][1]).toEqual('7h 15m');
  });

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
