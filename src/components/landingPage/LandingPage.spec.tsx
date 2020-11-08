import { LandingPage } from './LandingPage';
import * as React from 'react';
import { render, RenderResult } from '@testing-library/react'

describe('LandingPage', () => {
  let container: RenderResult;

  beforeEach(() => {
    container = render(<LandingPage />);
  });

  it('should display three cards', () => {
    expect(container.queryAllByTestId('landing-page-card')).toHaveLength(3)
  });

  it('first card should describe easy time registration', () => {
    const card = landingPageCard(0);
    expect(card)
      .toHaveTextContent('Easy time capture');
    expect(card)
      .toHaveTextContent('Powerful expression language will help you quickly register your work.');
  });

  it('second card should describe reporting', () => {
    const card = landingPageCard(1);
    expect(card)
        .toHaveTextContent('Intuitive reporting');
    expect(card)
        .toHaveTextContent('Review your reports by applying different filters and enjoy the results in various presentation forms.');
  });

  it('third card should describe OpenID integration', () => {
    const card = landingPageCard(2);
    expect(card)
        .toHaveTextContent('OpenID integration');
    expect(card)
        .toHaveTextContent('No registration required. You can simply use your existing Gmail account to sign in.');
  });

  function landingPageCard(cardIndex: number) {
    return container.queryAllByTestId('landing-page-card')[cardIndex];
  }
});
