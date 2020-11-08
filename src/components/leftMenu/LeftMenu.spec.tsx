import * as React from 'react';
import { Store } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { LeftMenu } from './LeftMenu';
import { setupStore } from '../../utils/testUtils';
import { toggleMenuVisibilityAction } from '../../actions/leftMenu.actions';
import { render, fireEvent, RenderResult } from '@testing-library/react'

const OpenMenuComponent = () => {
  const dispatch = useDispatch();
  return (
      <button data-testid='open-menu-button' onClick={() => dispatch(toggleMenuVisibilityAction())}/>
  );
};

describe('Left menu', () => {
  let store: Store;

  it('closes on button click', () => {
    store = initializeStore(true, true);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    fireEvent.click(container.getByTestId('close-menu-button'));

    expect(store.getState().leftMenu.open).toBeFalsy();
  });

  it('marks list item that matches current location', () => {
    store = initializeStore(true, true);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(selectedItemsText(container)).toEqual(['Landing page']);
  });

  ['Registration', 'Reporting', 'Admin'].forEach(page =>
      it(`navigates to ${page} page on menu item click`, () => {
        store = initializeStore(true, true, true);
        const container = render(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/']}>
                <LeftMenu />
                <OpenMenuComponent />
              </MemoryRouter>
            </Provider>
        );

        fireEvent.click(container.getByText(page));
        fireEvent.click(container.getByTestId('open-menu-button'));

        expect(selectedItemsText(container)).toEqual([page]);
      })
  );

  it('only LANDING PAGE entry is enabled if user not logged in', () => {
    store = initializeStore(false, true);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(disabledItemsText(container)).toEqual(['Registration', 'Reporting']);
    expect(container.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('ADMIN entry is not visible if user does not have ADMIN role', () => {
    store = initializeStore(true, true, false);
    const { queryByText } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByText('Admin')).not.toBeInTheDocument();
  });

  it('ADMIN entry is not visible if mobile version', () => {
    store = initializeStore(true, true, true);
    const { queryByText } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <LeftMenu mobileVersion={true}/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByText('Admin')).not.toBeInTheDocument();
  });

  function selectedItemsText(container: RenderResult): string[] {
    return container.queryAllByTestId('left-menu-entry-selected').map(i => i.textContent);
  }

  function disabledItemsText(container: RenderResult): string[] {
    return container.queryAllByTestId('left-menu-entry-disabled').map(i => i.textContent);
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
