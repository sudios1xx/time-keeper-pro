import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { MemoryRouter } from 'react-router-dom';

test('renderiza página 404', () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  expect(screen.getByText(/404/i)).toBeInTheDocument();
  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
}); 