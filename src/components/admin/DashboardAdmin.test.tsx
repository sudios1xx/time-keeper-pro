import { render } from '@testing-library/react';
import DashboardAdmin from './DashboardAdmin';

test('renderiza dashboard do administrador', () => {
  const { getByText } = render(<DashboardAdmin />);
  (expect(getByText(/dashboard/i)) as any).toBeInTheDocument();
});
