import { render, screen } from '@testing-library/react';
import PerfilJogador from './PerfilJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza estatísticas do jogador', () => {
  render(
    <AuthProvider>
      <PerfilJogador />
    </AuthProvider>
  );
  expect(screen.getByText(/presença em jogos/i)).toBeInTheDocument();
  expect(screen.getByText(/participação em eventos/i)).toBeInTheDocument();
  expect(screen.getByText(/pontualidade/i)).toBeInTheDocument();
}); 