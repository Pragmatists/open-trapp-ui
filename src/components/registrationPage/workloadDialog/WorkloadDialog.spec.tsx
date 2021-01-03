import { fireEvent, render, RenderResult } from '@testing-library/react';
import { noop } from 'lodash';
import { WorkloadDialog } from './WorkloadDialog';

describe('Workload dialog', () => {

  it('displays number of hours', () => {
    const { getByText } = render(
        <WorkloadDialog open={true} onClose={noop}/>
    );

    expect(getByText('8 hours')).toBeInTheDocument();
  });

  it('displays number of minutes', () => {
    const { getByText } = render(
        <WorkloadDialog open={true} onClose={noop}/>
    );

    expect(getByText('0 minutes')).toBeInTheDocument();
  });

  it('closes dialog on CANCEL click', () => {
    const onClose = jest.fn();
    const { getByText } = render(
        <WorkloadDialog open={true} onClose={onClose}/>
    );

    fireEvent.click(getByText('Cancel'));

    expect(onClose).toHaveBeenCalledWith();
  });

  it('emits default workload on SAVE click', () => {
    const onClose = jest.fn();
    const { getByText } = render(
        <WorkloadDialog open={true} onClose={onClose}/>
    );

    fireEvent.click(getByText('Save'));

    expect(onClose).toHaveBeenCalledWith('1d');
  });

  it('emits selected workload on SAVE click', () => {
    const onClose = jest.fn();
    const container = render(
        <WorkloadDialog open={true} onClose={onClose}/>
    );

    fireEvent.keyDown(hoursSlider(container), {key: 'ArrowLeft'});
    fireEvent.keyDown(minutesSlider(container), {key: 'ArrowRight'});
    fireEvent.click(container.getByText('Save'));

    expect(onClose).toHaveBeenCalledWith('7h 15m');
  });

  function hoursSlider(container: RenderResult) {
    return container.getByTestId('hours-slider').lastChild;
  }

  function minutesSlider(container: RenderResult) {
    return container.getByTestId('minutes-slider').lastChild;
  }
});
