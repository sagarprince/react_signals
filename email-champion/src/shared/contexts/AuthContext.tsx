import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import { StorageService } from '../../services/StorageService';
import { User } from '../../models/User';
import * as ROUTES from '../../constants/routes';

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  error?: any;
  setError: (error: any) => void;
  login: (params: { email: string; password: string }) => void;
  signUp: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }): any {
  const userInfo = StorageService.get('userInfo');
  const [user, setUser] = useState<User | null>((userInfo && JSON.parse(userInfo)) || null);
  const [error, setError] = useState<any | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  async function login(params: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(params);
      StorageService.set('token', response.access_token);
      const user = new User(response.userInfo);
      StorageService.set('userInfo', JSON.stringify(user));
      setUser(user);
      navigate(ROUTES.HOME);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(user: User) {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(user);
      console.log(response, response.userInfo);
      StorageService.set('token', response.access_token);
      const userInfo = new User(response.userInfo);
      StorageService.set('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      navigate(ROUTES.HOME);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    StorageService.remove('token');
    StorageService.remove('userInfo');
    setUser(null);
    navigate(ROUTES.LOGIN);
  }

  // Make the provider update only when it should
  const memoedValue = useMemo(
    () => ({
      user,
      isLoading,
      error,
      setError,
      login,
      signUp,
      logout,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={memoedValue as unknown as AuthContextType}>{children}</AuthContext.Provider>;
}
