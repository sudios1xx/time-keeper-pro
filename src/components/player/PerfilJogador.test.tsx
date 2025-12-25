import { render, screen } from '@testing-library/react';
import PerfilJogador from './PerfilJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza perfil do jogador', () => {
  render(
    <AuthProvider>
      <PerfilJogador />
    </AuthProvider>
  );
  (expect(screen.getByText(/conquistas recentes/i)) as any).toBeInTheDocument();
});