import React from 'react';
import { RedirectIfNeeded } from './RedirectIfNeeded';
import { MemoryRouter, Route } from 'react-router';
import { render } from '@testing-library/react'

const SomeComponent = () => (
    <div>some component</div>
);

const ReportingComponent = () => (
    <div>reporting</div>
);

describe('Redirect if needed', () => {
  it('does nothing if redirect param not present in URL', () => {
    const RedirectComponent = RedirectIfNeeded(SomeComponent);
    const container = render(
        <RedirectComponent location={{search: ''}}/>
    );

    expect(container.queryByText('some component')).toBeInTheDocument();
  });

  it('redirects if param in URL', () => {
    const RedirectComponent = RedirectIfNeeded(SomeComponent);
    const container = render(
        <MemoryRouter initialEntries={['/?redirect=/reporting']}>
          <Route component={RedirectComponent} path='/' exact/>
          <Route component={ReportingComponent} path='/reporting'/>
        </MemoryRouter>
    );

    expect(container.queryByText('some component')).not.toBeInTheDocument();
    expect(container.queryByText('reporting')).toBeInTheDocument();
  });
});
