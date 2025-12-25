import { render } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';

test('renderiza o botão de entrar', () => {
  const { getByRole } = render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  const button = getByRole('button', { name: /entrar/i });
  (expect(button) as any).toBeInTheDocument();
});
