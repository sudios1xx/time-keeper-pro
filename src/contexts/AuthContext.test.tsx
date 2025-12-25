import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

test('login fictício retorna true', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  let loginResult = false;
  await act(async () => {
    loginResult = await result.current.login('admin@time.com', '123456');
  });
  expect(loginResult).toBe(true);
  expect(result.current.usuario?.email).toBe('admin@time.com');
}); 