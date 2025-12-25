import { render, screen, fireEvent } from '@testing-library/react';
import SelecaoPerfil from './SelecaoPerfil';
import { AuthProvider } from '../contexts/AuthContext';

test('renderiza botões de seleção de perfil', () => {
  render(
    <AuthProvider>
      <SelecaoPerfil />
    </AuthProvider>
  );
  const btnAdmin = screen.getByRole('button', { name: /administrador/i });
  const btnJogador = screen.getByRole('button', { name: /jogador/i });
  (expect(btnAdmin) as any).toBeInTheDocument();
  (expect(btnJogador) as any).toBeInTheDocument();
  fireEvent.click(btnAdmin);
  fireEvent.click(btnJogador);
}); 