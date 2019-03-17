import * as React from 'react';
import { mount, shallow } from 'enzyme';
import GoogleLogin from 'react-google-login';
import { noop } from 'lodash';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { setupStore } from '../../utils/testUtils';
import { Header, HeaderComponent } from './Header';
import { UserDetails } from '../userDetails/UserDetails';

describe('Header', () => {
  let store: Store;

  it('renders Google login if user is not logged in', () => {
    const wrapper = shallow(
        <HeaderComponent isLoggedIn={false} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(wrapper.find(GoogleLogin).exists()).toBeTruthy();
  });

  it('does not render UserDetails if user is not logged in', () => {
    const wrapper = shallow(
        <HeaderComponent isLoggedIn={false} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(wrapper.find(UserDetails).exists()).toBeFalsy();
  });

  it('renders UserDetails if user is logged in', () => {
    const wrapper = shallow(
        <HeaderComponent isLoggedIn={true} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(wrapper.find(UserDetails).exists()).toBeTruthy();
  });

  it('does not render Google login if user is logged in', () => {
    const wrapper = shallow(
        <HeaderComponent isLoggedIn={true} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(wrapper.find(GoogleLogin).exists()).toBeFalsy();
  });

  it('changes menu visibility on menu button click', () => {
    store = initializeStore(true, false);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Header/>
          </MemoryRouter>
        </Provider>
    );

    menuButton(wrapper).simulate('click');

    expect(store.getState().leftMenu.open).toBeTruthy();
  });

  function menuButton(wrapper) {
    return wrapper.find('[data-left-menu-button]').at(0);
  }

  function initializeStore(authorizedUser: boolean, menuVisible: boolean) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      } : {loggedIn: false},
      leftMenu: {open: menuVisible}
    });
  }
});