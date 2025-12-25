import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

// Teste simples apenas para garantir que o provider renderiza sem erros
it('renderiza AuthProvider sem quebrar', () => {
  render(
    <AuthProvider>
      <div>child</div>
    </AuthProvider>
  );
  expect(screen.getByText('child')).toBeTruthy();
});