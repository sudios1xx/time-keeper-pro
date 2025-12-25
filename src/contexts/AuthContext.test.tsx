import { render } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

// Teste simples apenas para garantir que o provider renderiza sem erros
it('renderiza AuthProvider sem quebrar', () => {
  const { getByText } = render(
    <AuthProvider>
      <div>child</div>
    </AuthProvider>
  );
  expect(getByText('child')).toBeTruthy();
});
