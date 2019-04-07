import { mount, shallow } from 'enzyme';
import React from 'react';
import { noop } from 'lodash';
import { PresetsSelector } from './PresetsSelector';
import { Preset } from '../registration.model';
import { Chip } from '@material-ui/core';

const presets = [
    new Preset(['projects', 'nvm']),
    new Preset(['internal', 'standup'])
];

describe('Presets selector', () => {
  it('displays placeholder if user has no presets', () => {
    const wrapper = shallow(
        <PresetsSelector presets={[]} onClick={noop} tags={[]} onCreate={noop} onRemove={noop}/>
    );

    expect(wrapper.find('[data-presets-selector-list]')).toHaveLength(0);
    expect(wrapper.find('[data-presets-selector-placeholder]')).toHaveLength(1);
  });

  it('displays list of presets', () => {
    const wrapper = shallow(
        <PresetsSelector presets={presets} onClick={noop} tags={[]} onCreate={noop} onRemove={noop}/>
    );

    expect(wrapper.find('[data-presets-selector-placeholder]')).toHaveLength(0);
    expect(chips(wrapper)).toHaveLength(2);
  });

  it('emits clicked preset', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
        <PresetsSelector presets={presets} onClick={onClick} tags={[]} onCreate={noop} onRemove={noop}/>
    );

    chip(wrapper, 0).simulate('click');

    expect(onClick).toHaveBeenCalledWith(presets[0]);
  });

  it('displays tags separated with comma', () => {
    const wrapper = mount(
        <PresetsSelector presets={presets} onClick={noop} tags={[]} onCreate={noop} onRemove={noop}/>
    );

    expect(chip(wrapper, 0).text()).toEqual('projects, nvm');
  });

  it('emits removed preset', () => {
    const onRemove = jest.fn();
    const wrapper = mount(
        <PresetsSelector presets={presets} onClick={noop} tags={[]} onCreate={noop} onRemove={onRemove}/>
    );

    deleteChipIcon(wrapper, 1).simulate('click');

    expect(onRemove).toHaveBeenCalledWith(presets[1]);
  });

  function chips(wrapper) {
    return wrapper.find(Chip);
  }

  function chip(wrapper, chipIdx: number) {
    return chips(wrapper).at(chipIdx);
  }

  function deleteChipIcon(wrapper, chipIdx: number) {
    return chip(wrapper, chipIdx).find('svg');
  }
});
