import { render } from '@testing-library/react';
import PerfilJogador from './PerfilJogador';
import { AuthProvider } from '../../contexts/AuthContext';

test('renderiza perfil do jogador', () => {
  const { getByText } = render(
    <AuthProvider>
      <PerfilJogador />
    </AuthProvider>
  );
  (expect(getByText(/nome do jogador/i)) as any).toBeInTheDocument();
});
