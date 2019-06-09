import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { ListItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { setupStore } from '../../utils/testUtils';
import { LeftMenu } from './LeftMenu';

describe('Left menu', () => {
  let store: Store;

  it('closes on button click', () => {
    store = initializeStore(true, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    closeButton(wrapper).simulate('click');

    expect(store.getState().leftMenu.open).toBeFalsy();
  });

  it('marks list item that matches current location', () => {
    store = initializeStore(true, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(selectedItemsText(wrapper)).toEqual(['Landing page']);
  });

  it('navigates to REGISTRATION page on menu item click', () => {
    store = initializeStore(true, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    listItem(wrapper, 'Registration').simulate('click');

    expect(selectedItemsText(wrapper)).toEqual(['Registration']);
  });

  it('navigates to REPORTING page on menu item click', () => {
    store = initializeStore(true, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    listItem(wrapper, 'Reporting').simulate('click');

    expect(selectedItemsText(wrapper)).toEqual(['Reporting']);
  });

  it('only LANDING PAGE entry is enabled if user not logged in', () => {
    store = initializeStore(false, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(enabledItemsText(wrapper)).toEqual(['Landing page']);
  });

  function closeButton(wrapper: ReactWrapper): ReactWrapper {
    return wrapper.find('[data-close-menu-button]').at(0);
  }

  function listItems(wrapper: ReactWrapper) {
    return wrapper.find(ListItem);
  }

  function selectedItemsText(wrapper: ReactWrapper): string[] {
    return listItems(wrapper)
        .filterWhere(w => w.prop('selected'))
        .map(w => w.find(ListItemText).at(0).text());
  }

  function listItem(wrapper: ReactWrapper, label: string) {
    return listItems(wrapper)
        .filterWhere(w => w.find(ListItemText).at(0).text() === label)
        .at(0);
  }

  function enabledItemsText(wrapper: ReactWrapper): string[] {
    return listItems(wrapper)
        .filterWhere(w => !w.prop('disabled'))
        .map(w => w.find(ListItemText).at(0).text());
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
