import { shallow } from 'enzyme';
import { HeaderComponent } from './Header';
import * as React from 'react';
import GoogleLogin from 'react-google-login';
import { UserDetails } from '../userDetails/UserDetails';

describe('Header', () => {
  it('should render Google login if user is not logged in', () => {
    const wrapper = shallow(<HeaderComponent isLoggedIn={false} onLogout={() => {}} onGoogleToken={() => {}} />);

    expect(wrapper.find(GoogleLogin).exists()).toBeTruthy();
  });

  it('should not render UserDetails if user is not logged in', () => {
    const wrapper = shallow(<HeaderComponent isLoggedIn={false} onLogout={() => {}} onGoogleToken={() => {}} />);

    expect(wrapper.find(UserDetails).exists()).toBeFalsy();
  });

  it('should render UserDetails if user is logged in', () => {
    const wrapper = shallow(<HeaderComponent isLoggedIn={true} onLogout={() => {}} onGoogleToken={() => {}} />);

    expect(wrapper.find(UserDetails).exists()).toBeTruthy();
  });

  it('should not render Google login if user is logged in', () => {
    const wrapper = shallow(<HeaderComponent isLoggedIn={true} onLogout={() => {}} onGoogleToken={() => {}} />);

    expect(wrapper.find(GoogleLogin).exists()).toBeFalsy();
  });
});