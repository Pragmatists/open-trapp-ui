import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as React from 'react';
import { BottomNavigationBar } from './BottomNavigation';

describe('Bottom Navigation', () => {
  it.each`
    page
    ${'Registration'}
    ${'Reporting'}
  `(`navigates to $page page on tab click`, ({page}) => {
    const {getByText} = render(
        <MemoryRouter initialEntries={['/']}>
          <BottomNavigationBar/>
        </MemoryRouter>
    );

    fireEvent.click(getByText(page));

    expect(getByText(page).parentElement.parentElement).toHaveClass('Mui-selected');
  });
});
