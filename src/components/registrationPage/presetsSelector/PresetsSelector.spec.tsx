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
  it('displays list of presets', () => {
    const wrapper = shallow(
        <PresetsSelector presets={presets} onClick={noop} tags={[]} onCreate={noop}/>
    );

    expect(wrapper.find('[data-presets-selector-placeholder]')).toHaveLength(0);
    expect(chips(wrapper)).toHaveLength(2);
  });

  it('emits clicked preset', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
        <PresetsSelector presets={presets} onClick={onClick} tags={[]} onCreate={noop}/>
    );

    chip(wrapper, 0).simulate('click');

    expect(onClick).toHaveBeenCalledWith(presets[0]);
  });

  it('displays tags separated with comma', () => {
    const wrapper = mount(
        <PresetsSelector presets={presets} onClick={noop} tags={[]} onCreate={noop}/>
    );

    expect(chip(wrapper, 0).text()).toEqual('projects, nvm');
  });

  function chips(wrapper) {
    return wrapper.find(Chip);
  }

  function chip(wrapper, chipIdx: number) {
    return chips(wrapper).at(chipIdx);
  }
});
