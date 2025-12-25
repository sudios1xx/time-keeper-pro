import { render, screen } from '@testing-library/react';
import DashboardAdmin from './DashboardAdmin';

test('renderiza dashboard do administrador', () => {
  render(<DashboardAdmin />);
  (expect(screen.getByText(/dashboard/i)) as any).toBeInTheDocument();
});