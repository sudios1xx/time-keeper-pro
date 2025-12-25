import { render, screen } from '@testing-library/react';
import MainApp from './MainApp';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => {
  const actual = jest.requireActual('../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({ usuario: null, perfilSelecionado: false, isLoading: false })
  };
});

test('renderiza Login quando não autenticado', () => {
  render(
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
  const button = screen.getByRole('button', { name: /entrar/i });
  expect(button).toBeInTheDocument();
}); 