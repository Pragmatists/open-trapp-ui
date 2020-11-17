import { LandingPage } from './LandingPage';
import * as React from 'react';
import { render, RenderResult } from '@testing-library/react'
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { setupStore } from '../../utils/testUtils';

const TestRegistration = () => (
    <div>Registration component</div>
);

describe('LandingPage', () => {
  it('should display three cards', () => {
    const container = render(
        <Provider store={initializeStore(false)}>
          <MemoryRouter initialEntries={['/']}>
            <LandingPage/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryAllByTestId('landing-page-card')).toHaveLength(3)
  });

  it('first card should describe easy time registration', () => {
    const container = render(
        <Provider store={initializeStore(false)}>
          <MemoryRouter initialEntries={['/']}>
            <LandingPage/>
          </MemoryRouter>
        </Provider>
    );

    const card = landingPageCard(container, 0);
    expect(card)
        .toHaveTextContent('Easy time capture');
    expect(card)
        .toHaveTextContent('Powerful expression language will help you quickly register your work.');
  });

  it('second card should describe reporting', () => {
    const container = render(
        <Provider store={initializeStore(false)}>
          <MemoryRouter initialEntries={['/']}>
            <LandingPage/>
          </MemoryRouter>
        </Provider>
    );

    const card = landingPageCard(container, 1);
    expect(card)
        .toHaveTextContent('Intuitive reporting');
    expect(card)
        .toHaveTextContent('Review your reports by applying different filters and enjoy the results in various presentation forms.');
  });

  it('third card should describe OpenID integration', () => {
    const container = render(
        <Provider store={initializeStore(false)}>
          <MemoryRouter initialEntries={['/']}>
            <LandingPage/>
          </MemoryRouter>
        </Provider>
    );

    const card = landingPageCard(container, 2);
    expect(card)
        .toHaveTextContent('OpenID integration');
    expect(card)
        .toHaveTextContent('No registration required. You can simply use your existing Gmail account to sign in.');
  });

  it('redirects to registration if user logged in', () => {
    const {queryByText} = render(
        <Provider store={initializeStore(true)}>
          <MemoryRouter initialEntries={['/']}>
            <Route component={LandingPage} path='/' exact/>
            <Route component={TestRegistration} path='/registration'/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByText('Registration component')).toBeInTheDocument();
  });

  function landingPageCard(container: RenderResult, cardIndex: number) {
    return container.queryAllByTestId('landing-page-card')[cardIndex];
  }

  function initializeStore(authorizedUser: boolean) {
    return setupStore({
      authentication: {
        loggedIn: authorizedUser
      }
    });
  }
});
