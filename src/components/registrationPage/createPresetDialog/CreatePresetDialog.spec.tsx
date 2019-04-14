import React from 'react';
import { mount, shallow } from 'enzyme';
import { noop } from 'lodash';
import { CreatePresetDialog } from './CreatePresetDialog';
import { ListItem } from '@material-ui/core';

const tagList = ['projects', 'nvm', 'internal', 'standup'];

describe('Create Preset Dialog', () => {
  it('displays sorted list of tags', () => {
    const wrapper = mount(
        <CreatePresetDialog onClose={noop} open={true} tags={tagList} />
    );

    expect(tagsText(wrapper)).toEqual(['internal', 'nvm', 'projects', 'standup']);
  });

  it('closes dialog on CANCEL click', () => {
    const onClose = jest.fn();
    const wrapper = shallow(
        <CreatePresetDialog onClose={onClose} open={true} tags={tagList} />
    );

    cancelButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith();
  });

  it('closes dialog on CANCEL click when tags are selected', () => {
    const onClose = jest.fn();
    const wrapper = shallow(
        <CreatePresetDialog onClose={onClose} open={true} tags={tagList} />
    );

    tag(wrapper, 'projects').simulate('click');
    tag(wrapper, 'nvm').simulate('click');
    cancelButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledWith();
  });

  it('emits selected tags on SAVE click', () => {
    const onClose = jest.fn();
    const wrapper = shallow(
        <CreatePresetDialog onClose={onClose} open={true} tags={tagList} />
    );

    tag(wrapper, 'projects').simulate('click');
    tag(wrapper, 'nvm').simulate('click');
    saveButton(wrapper).simulate('click');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0].tags).toEqual(['projects', 'nvm']);
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

  function cancelButton(wrapper) {
    return wrapper.find('[data-cancel-button]');
  }

  function saveButton(wrapper) {
    return wrapper.find('[data-save-button]');
  }
});