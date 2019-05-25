import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import { CreateWorkLogDialog } from './CreateWorkLogDialog';
import { ListItem } from '@material-ui/core';
import { Workload } from '../workload/Workload';
import { Slider } from '@material-ui/lab';

const tagList = ['projects', 'nvm', 'internal', 'standup'];

describe('Create Work Log Dialog', () => {
  it('displays sorted list of tags', () => {
    const wrapper = mount(
        <CreateWorkLogDialog onClose={noop} open={true} tags={tagList} />
    );

    expect(tagsText(wrapper)).toEqual(['internal', 'nvm', 'projects', 'standup']);
  });

  it('closes dialog on CANCEL click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList} />
    );

    cancelButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith();
  });

  it('closes dialog on CANCEL click when tags are selected', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList} />
    );

    tag(wrapper, 'projects').simulate('click');
    tag(wrapper, 'nvm').simulate('click');
    cancelButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith();
  });

  it('displays workload selector on NEXT click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList} />
    );

    tag(wrapper, 'projects').simulate('click');
    nextButton(wrapper).simulate('click');

    expect(wrapper.find(Workload)).toHaveLength(1);
  });

  it('do nothing on NEXT click if no tags selected', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList} />
    );

    nextButton(wrapper).simulate('click');

    expect(tagsText(wrapper)).toEqual(['internal', 'nvm', 'projects', 'standup']);
  });

  it('emits selected tags and workload on SAVE click', () => {
    const onClose = jest.fn();
    const wrapper = mount(
        <CreateWorkLogDialog onClose={onClose} open={true} tags={tagList} />
    );

    tag(wrapper, 'projects').simulate('click');
    tag(wrapper, 'nvm').simulate('click');
    nextButton(wrapper).simulate('click');
    hoursSlider(wrapper).simulate('keydown', {key: 'ArrowLeft'});
    minutesSlider(wrapper).simulate('keydown', {key: 'ArrowRight'});
    saveButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]).toEqual(['projects', 'nvm']);
    expect(onClose.mock.calls[0][1]).toEqual('7h 15m');
  });

  function tags(wrapper) {
    return wrapper.find(ListItem);
  }

  function tagsText(wrapper) {
    return tags(wrapper).map(w => w.text());
  }

  function tag(wrapper, label: string) {
    return tags(wrapper).filter(`[data-tag="${label}"]`)
  }

  function hoursSlider(wrapper) {
    return wrapper.find(Slider).filter('[data-hours-slider]').find('button');
  }

  function minutesSlider(wrapper) {
    return wrapper.find(Slider).filter('[data-minutes-slider]').find('button');
  }

  function cancelButton(wrapper) {
    return wrapper.find('[data-cancel-button]').hostNodes();
  }

  function nextButton(wrapper) {
    return wrapper.find('[data-next-button]').hostNodes();
  }

  function saveButton(wrapper) {
    return wrapper.find('[data-save-button]').hostNodes();
  }
});
