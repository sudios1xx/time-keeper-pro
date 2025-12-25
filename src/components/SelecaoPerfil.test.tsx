import { render } from '@testing-library/react';
import SelecaoPerfil from './SelecaoPerfil';
import { AuthProvider } from '../contexts/AuthContext';

test('renderiza botões de seleção de perfil', () => {
  const { getByRole } = render(
    <AuthProvider>
      <SelecaoPerfil />
    </AuthProvider>
  );
  const btnAdmin = getByRole('button', { name: /administrador/i });
  const btnJogador = getByRole('button', { name: /jogador/i });
  (expect(btnAdmin) as any).toBeInTheDocument();
  (expect(btnJogador) as any).toBeInTheDocument();
});
