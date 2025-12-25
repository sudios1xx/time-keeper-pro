import { render } from '@testing-library/react';
import DashboardJogador from './DashboardJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza dashboard do jogador', () => {
  const { getByText } = render(
    <AuthProvider>
      <DashboardJogador />
    </AuthProvider>
  );
  (expect(getByText(/olá/i)) as any).toBeInTheDocument();
});
