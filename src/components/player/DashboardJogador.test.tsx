import { render, screen } from '@testing-library/react';
import DashboardJogador from './DashboardJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza dashboard do jogador', () => {
  render(
    <AuthProvider>
      <DashboardJogador />
    </AuthProvider>
  );
  (expect(screen.getByText(/olá/i)) as any).toBeInTheDocument();
});