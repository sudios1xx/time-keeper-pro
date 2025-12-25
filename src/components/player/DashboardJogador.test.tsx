import { render, screen } from '@testing-library/react';
import DashboardJogador from './DashboardJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza dashboard do jogador', () => {
  render(
    <AuthProvider>
      <DashboardJogador onNavigate={() => {}} />
    </AuthProvider>
  );
  expect(screen.getByText(/olá/i)).toBeInTheDocument();
  expect(screen.getByText(/joão santos/i)).toBeInTheDocument();
}); 