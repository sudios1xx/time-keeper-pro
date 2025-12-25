import { render, screen } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';

test('renderiza o botão de entrar', () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  const button = screen.getByRole('button', { name: /entrar/i });
  expect(button).toBeInTheDocument();
}); 