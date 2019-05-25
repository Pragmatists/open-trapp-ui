import React from 'react';
import {mount} from 'enzyme';
import {noop} from 'lodash';
import {WorkloadDialog} from './WorkloadDialog';
import DialogActions from '@material-ui/core/DialogActions';
import {Button} from '@material-ui/core';
import {Slider} from '@material-ui/lab';


describe('Workload dialog', () => {

  it('displays number of hours', () => {
    const wrapper = mount(
        <WorkloadDialog open={true} onClose={noop} />
    );

    expect(wrapper.find('[data-number-of-hours]').text()).toEqual('8 hours');
  });

  it('displays number of minutes', () => {
    const wrapper = mount(
        <WorkloadDialog open={true} onClose={noop} />
    );

    expect(wrapper.find('[data-number-of-minutes]').text()).toEqual('0 minutes');
  });

  it('closes dialog on CANCEL click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <WorkloadDialog open={true} onClose={onClose} />
    );

    cancelButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith();
  });

  it('emits default workload on SAVE click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <WorkloadDialog open={true} onClose={onClose} />
    );

    saveButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith('1d');
  });

  it('emits selected workload on SAVE click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <WorkloadDialog open={true} onClose={onClose} />
    );

    hoursSlider(wrapper).simulate('keydown', {key: 'ArrowLeft'});
    minutesSlider(wrapper).simulate('keydown', {key: 'ArrowRight'});
    saveButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith('7h 15m');
  });

  function cancelButton(wrapper) {
    return wrapper.find(DialogActions).find(Button).filter('[data-cancel-button]');
  }

  function saveButton(wrapper) {
    return wrapper.find(DialogActions).find(Button).filter('[data-save-button]');
  }

  function hoursSlider(wrapper) {
    return wrapper.find(Slider).filter('[data-hours-slider]').find('button');
  }

  function minutesSlider(wrapper) {
    return wrapper.find(Slider).filter('[data-minutes-slider]').find('button');
  }
});
