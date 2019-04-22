import React from 'react';
import { shallow } from 'enzyme';
import { RedirectIfNeeded } from './RedirectIfNeeded';
import { Redirect } from 'react-router';

const SomeComponent = () => (
    <div>some component</div>
);


describe('Redirect if needed', () => {
  it('does nothing if redirect param not present in URL', () => {
    const RedirectComponent = RedirectIfNeeded(SomeComponent);
    const wrapper = shallow(
        <RedirectComponent location={{search: ''}} />
    );

    expect(wrapper.find(SomeComponent)).toHaveLength(1);
  });

  it('redirects if param in URL', () => {
    const RedirectComponent = RedirectIfNeeded(SomeComponent);
    const wrapper = shallow(
        <RedirectComponent location={{search: '?redirect=/reporting'}} />
    );

    expect(wrapper.find(SomeComponent)).toHaveLength(0);
    expect(wrapper.find(Redirect)).toHaveLength(1);
    expect((wrapper.find(Redirect).props().to as any).pathname).toEqual('/reporting');
  });
});
