import { mount, ReactWrapper } from 'enzyme';
import { WorkLogInput } from './WorkLogInput';
import * as React from 'react';
import { InputBase } from '@material-ui/core';

describe('WorklogInput', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(<WorkLogInput/>);
  });

  it('should parse new worklog expression', () => {

  });

  function typeExpression(expression: string) {
    const input = wrapper.find(InputBase);
    input.simulate('change', { target: { value: expression } })
  }
});
