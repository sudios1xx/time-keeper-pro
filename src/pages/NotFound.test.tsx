import { render } from '@testing-library/react';
import NotFound from './NotFound';
import { MemoryRouter } from 'react-router-dom';

test('renderiza página 404', () => {
  const { getByText } = render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  (expect(getByText(/404/i)) as any).toBeInTheDocument();
  (expect(getByText(/page not found/i)) as any).toBeInTheDocument();
});
