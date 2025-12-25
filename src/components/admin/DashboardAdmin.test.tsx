import { render } from '@testing-library/react';
import DashboardAdmin from '@/features/admin/components/AdminDashboardPage';

test('renderiza dashboard do administrador', () => {
  const { getByText } = render(<DashboardAdmin />);
  (expect(getByText(/gestão do time/i)) as any).toBeInTheDocument();
});
