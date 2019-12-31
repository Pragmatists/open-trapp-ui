import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Store } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { LeftMenu } from './LeftMenu';
import { ListItem, ListItemText } from '@material-ui/core';
import { setupStore } from '../../utils/testUtils';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';

const OpenMenuComponent = () => {
  const dispatch = useDispatch();
  return (
      <button data-open-menu-button onClick={() => dispatch(toggleMenuVisibility())}/>
  );
};

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

  ['Registration', 'Reporting', 'Admin'].forEach(page =>
      it(`navigates to ${page} page on menu item click`, () => {
        store = initializeStore(true, true, true);
        const wrapper = mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/']}>
                <LeftMenu />
                <OpenMenuComponent />
              </MemoryRouter>
            </Provider>
        );

        listItem(wrapper, page).simulate('click');
        openLeftMenu(wrapper);

        expect(selectedItemsText(wrapper)).toEqual([page]);
      })
  );

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

  it('ADMIN entry is not visible if user does not have ADMIN role', () => {
    store = initializeStore(true, true, false);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(itemsText(wrapper)).not.toContain('Admin');
  });

  it('ADMIN entry is not visible if mobile version', () => {
    store = initializeStore(true, true, true);
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu mobileVersion={true}/>
          </MemoryRouter>
        </Provider>
    );

    expect(itemsText(wrapper)).not.toContain('Admin');
  });

  function openLeftMenu<C>(wrapper: ReactWrapper) {
    wrapper.find('[data-open-menu-button]').simulate('click');
  }

  function closeButton(wrapper: ReactWrapper): ReactWrapper {
    return wrapper.find('[data-close-menu-button]').at(0);
  }

  function listItems(wrapper: ReactWrapper) {
    return wrapper.find(ListItem);
  }

  function selectedItemsText(wrapper: ReactWrapper): string[] {
    return listItems(wrapper)
        .filterWhere(w => w.prop('selected'))
        .map(w => w.text());
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

  function itemsText(wrapper: ReactWrapper): string[] {
    return listItems(wrapper)
        .map(w => w.find(ListItemText).at(0).text());
  }

  function initializeStore(authorizedUser: boolean, menuVisible: boolean, admin = false) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe',
          roles: admin ? ['ADMIN'] : []
        }
      } : {loggedIn: false},
      leftMenu: {open: menuVisible}
    });
  }
});
