import { shallow, ShallowWrapper } from 'enzyme';
import { LandingPage } from './LandingPage';
import * as React from 'react';

describe('LandingPage', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<LandingPage />);
  });

  it('should display three cards', () => {
    expect(wrapper.find('[data-landing-page-card]')).toHaveLength(3)
  });

  it('first card should describe easy time registration', () => {
    expect(landingPageCardTitle(0))
      .toEqual('Easy time capture');
    expect(landingPageCardText(0))
      .toEqual('Powerfull expression language will help you quickly register your work.');
  });

  it('second card should describe reporting', () => {
    expect(landingPageCardTitle(1))
      .toEqual('Intuitive reporting');
    expect(landingPageCardText(1))
      .toEqual('Review your reports by applying different filters and enjoy the results in various presentation forms.');
  });

  it('third card should describe OpenID integration', () => {
    expect(landingPageCardTitle(2))
      .toEqual('OpenID integration');
    expect(landingPageCardText(2))
      .toEqual('No registration required. You can simply use your existing Gmail account to sign in.');
  });

  function landingPageCard(cardIndex: number) {
    return wrapper.find('[data-landing-page-card]').at(cardIndex);
  }

  function landingPageCardText(cardIndex: number) {
    return landingPageCard(cardIndex).find('[data-card-text]').text();
  }

  function landingPageCardTitle(cardIndex: number) {
    return landingPageCard(cardIndex).find('[data-card-title]').text();
  }
});
