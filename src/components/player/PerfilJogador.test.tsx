import { render } from '@testing-library/react';
import PerfilJogador from './PerfilJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza perfil do jogador', () => {
  const { getByText } = render(
    <AuthProvider>
      <PerfilJogador />
    </AuthProvider>
  );
  (expect(getByText(/conquistas recentes/i)) as any).toBeInTheDocument();
});
